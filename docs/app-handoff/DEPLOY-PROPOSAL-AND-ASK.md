> **⚠ SUPERSEDED — 2026-08-25.** This document asks for **App Runner, S3 and
> CloudFront**. That was the proposal before Jayant chose **EKS**, and the
> manifests, Dockerfiles and pipelines now in both repositories target EKS +
> ECR + an ALB Ingress. **Anything provisioned from this page is the wrong
> shape.**
>
> Work from **`DEPLOY-ASK-EKS-2026-08-25.md`** instead. This is kept only
> because §"What is still ours" records reasoning that is still true.

---

# How the code gets there — the proposal, and the one ask

**2026-08-24.** For Jayant's team. Everything on our side is written and pushed; this is the list of values that makes it run.

---

## The shape, and why

Jayant's team confirmed the API is served at `https://new.caspr.ai/api/v1/…` and the app at `https://new.caspr.ai/app`. **One hostname, two different kinds of thing** — a static bundle and a long-running service — so something has to front both and route by path. That single fact decides most of the architecture.

```
                        new.caspr.ai
                             │
                        CloudFront
                    ┌────────┴────────┐
              /app/*│                 │/api/v1/*  ·  /.well-known/*
                    ▼                 ▼
              S3 (static SPA)    App Runner (FastAPI container)
                                       │
                                       ├── RDS PostgreSQL
                                       ├── SES
                                       └── Stripe
```

**Why App Runner rather than ECS Fargate or Lambda.**

- **Against ECS + ALB:** it is the same container, but it needs a cluster, a task definition, a service, a load balancer, target groups and security groups before anything answers. That is a lot of surface to stand up and keep right for one service at this stage, and it can be migrated to later without changing the image.
- **Against Lambda:** FastAPI runs there via Mangum, but a database connection pool on Lambda is a genuine problem — each execution environment holds its own connections and RDS runs out long before traffic does. It is solvable with RDS Proxy; it is a solved problem we would be choosing to acquire.
- **For App Runner:** managed HTTPS, a stable URL, scales down when idle, and **deploying is "push an image to ECR"**. The RDS instance is already publicly reachable — I connected to it from a laptop this morning — so no VPC connector is needed to reach it.

**One consequence of that last point is worth naming rather than leaving implied:** the database being publicly reachable is convenient now and is not where it should end up. With TLS required and a strong password it is acceptable for a testing deployment. For production it should sit in a private subnet with the service inside the VPC. Flagging it now so it is a decision rather than a discovery.

---

## How code gets there

**GitHub Actions, with OIDC. No AWS keys stored in GitHub at all.**

The workflows assume an IAM role through GitHub's OIDC provider, so the credential is a short-lived token minted per run and scoped to one repository. The alternative — an `AWS_ACCESS_KEY_ID` and secret in repository secrets — is a credential that never expires, is readable by anyone who can add a workflow, and outlives everyone who has ever had access. For the sake of one IAM role, it is not a close call.

**The pipeline, already written and pushed:**

| Repo | On merge to `main` |
|---|---|
| `caspr-backend` | lint → format → types → 206 tests on real PostgreSQL → dependency audit → build image → **migrate** → release → wait for healthy → smoke the live URL |
| `caspr-frontend` | typecheck → tests → build → sync hashed assets → sync HTML → invalidate CloudFront → smoke |

Three details in there that are deliberate:

1. **Migrations run in the pipeline, once, before the new image is released** — never on container startup. Containers start in parallel, so startup migrations race each other, and a rollback becomes a schema nobody planned. Every migration is additive (expand/contract), so the old version keeps serving correctly against the new schema until it is replaced.
2. **Images are tagged with the commit SHA**, not only `latest`. `latest` cannot be rolled back to and cannot answer *"what is actually running?"*.
3. **The deploy waits for healthy and then curls the live URL.** A pipeline that goes green before the new code answers is a pipeline that hides its own failures.

---

## The ask

Five values, and one of them is the only real work.

### 1 · An IAM role for GitHub Actions — the only setup step

Trust policy: GitHub's OIDC provider (`token.actions.githubusercontent.com`), with `sub` restricted to our two repositories so no other repo can assume it:

```
repo:caspr-ai/caspr-backend:ref:refs/heads/main
repo:caspr-ai/caspr-frontend:ref:refs/heads/main
```

Permissions needed, and nothing beyond them:

| For | Actions |
|---|---|
| ECR | `GetAuthorizationToken`, and push/pull on the one repository |
| App Runner | `StartDeployment`, `DescribeService` on the one service |
| S3 | `PutObject`, `DeleteObject`, `ListBucket` on the web bucket, prefix `app/*` |
| CloudFront | `CreateInvalidation` on the one distribution |

**We need:** the role ARN.

### 2 · An ECR repository

Private, in `us-east-1`. Any name — `caspr-backend` is the obvious one.

**We need:** the repository name.

### 3 · An App Runner service

From the ECR image above, port **8000**, health check path **`/api/v1/health/live`** (it deliberately touches nothing external, so a database blip does not restart every healthy container).

Environment: `ENVIRONMENT=production` and `APP_ORIGIN=https://new.caspr.ai`. Everything secret comes from Secrets Manager — see §5.

**We need:** the service ARN.

### 4 · S3 + CloudFront

The SPA is deployed under the `app/` prefix. CloudFront needs a behaviour that sends `/api/v1/*` **and `/.well-known/*`** to the App Runner origin, and everything else to S3.

`/.well-known/jwks.json` is easy to miss and matters: it is how the AI service verifies our tokens, and it is served at the origin root rather than under `/api/v1` because RFC 8615 fixes that location.

`/app/*` should fall back to `/app/index.html` on 404 — it is a single-page app, so a deep link is not a missing file.

**We need:** the bucket name and the distribution ID.

### 5 · Secrets Manager entries for the service

The service reads these; none of them should ever be in a repository or a ticket.

| Name | Value |
|---|---|
| `DB__DSN` | `postgresql+asyncpg://…` for the RDS instance |
| `AUTH__SIGNING_KEY` | RSA private key, PEM, **one line with escaped newlines**. Ours to generate — we will hand it over through a password manager, not here |
| `AUTH__ISSUER` | `https://new.caspr.ai` |
| `AUTH__AUDIENCE` | `caspr-app` |
| `AUTH__GOOGLE_CLIENT_ID` | the client id already shared |
| `MAIL__ACCESS_KEY_ID` / `MAIL__SECRET_ACCESS_KEY` / `MAIL__REGION` / `MAIL__SENDER` | the SES values already shared |
| `STRIPE__SECRET_KEY` / `STRIPE__WEBHOOK_SECRET` | already shared, test mode |
| `AI__BASE_URL` | the AI service, once it exists. Until then the two spending calls answer 503 |

**We need:** confirmation these are in place, not their values.

---

## What happens the moment those five land

The workflows are already committed. Adding the role ARN and four repository variables to each repo is the whole of the remaining setup — the first merge to `main` after that builds, migrates, deploys and smoke-tests itself.

**Verified this morning against the real RDS instance**, before any of this: signup, verification, session issue, `SET LOCAL ROLE caspr_request` under row-level security, profile and persona, a library write, committing an analysis with its budget reserved and context frozen, settling the hold, and the balance landing correctly at $100 → $20. Eleven checks, all passing, against the database this will deploy against.

---

## One thing that is still ours, and is not small

**The frontend presentation layer has not been rebuilt.** 836 absolute positions across 73 files, 16 semantic headings. The deployment pipeline above will happily ship it, and it should not ship until that work is done. It is the largest remaining piece and it is on us, not on this list.
