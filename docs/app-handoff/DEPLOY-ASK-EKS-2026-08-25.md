# Deployment — what we need from you, for EKS

**2026-08-25. This supersedes `DEPLOY-PROPOSAL-AND-ASK.md`, which is stale in a way that matters:** it asks for **App Runner, S3 and CloudFront**. That was written before the EKS decision. The manifests, Dockerfiles and pipelines in both repositories target **EKS + ECR + an ALB Ingress**, so anything provisioned from the older document is the wrong shape. Please work from this one.

Both applications are built, tested and committed. Nothing on our side is waiting on code.

---

## The short version

**Five values, and six cluster prerequisites.** The five are what the pipelines read. The six are things that must already be true of the cluster, and they are here because each one fails *silently or confusingly* on a first deploy — an Ingress that creates cleanly and routes nothing is the classic one.

---

## 1 · The five values

Set as GitHub repository variables and secrets on `caspr-ai/caspr-backend` and `caspr-ai/caspr-frontend`.

| | Where it goes | Notes |
|---|---|---|
| **IAM role ARN** | `secrets.AWS_DEPLOY_ROLE_ARN` | Assumed via GitHub OIDC — **no stored AWS keys**, nothing long-lived to leak or rotate. Trust policy scoped to these two repositories |
| **AWS region** | `vars.AWS_REGION` | |
| **ECR repository URIs** | deployment manifests | Two — `caspr-backend` and `caspr-frontend` |
| **EKS cluster name** | `vars.EKS_CLUSTER_NAME` | |
| **Kubernetes namespace** | deployment manifests | Confirm which; we have assumed one exists |

### What the role needs

| For | Actions |
|---|---|
| ECR | `GetAuthorizationToken`; push/pull on the two repositories |
| EKS | `DescribeCluster` on the one cluster |
| Kubernetes RBAC | The role mapped in `aws-auth` (or an EKS access entry) with permission to `get`/`patch` deployments and read rollout status **in that namespace only** |

The pipeline does exactly two things to the cluster: `kubectl set image` and `kubectl rollout status`. It never applies manifests, so nothing a person sets by hand is silently reverted by a deploy.

---

## 2 · Secrets — confirm these exist and are populated

As a Kubernetes Secret named `caspr-api-secrets` in the namespace, or synced into it from Secrets Manager.

| Key | Value | Status |
|---|---|---|
| `DB__DSN` | `postgresql+asyncpg://…` for the RDS instance | **We have it** — verified against the live database, 11/11 checks |
| `AUTH__SIGNING_KEY` | RSA private key, PEM, one line with escaped newlines | **Ours to generate.** Handed over through a password manager, never in a ticket |
| `AUTH__GOOGLE_CLIENT_ID` | already shared | ✅ |
| `MAIL__ACCESS_KEY_ID` · `MAIL__SECRET_ACCESS_KEY` | already shared | ✅ SES is wired and sending — five emails |
| `STRIPE__SECRET_KEY` · `STRIPE__WEBHOOK_SECRET` | already shared, test mode | ✅ |
| `AI__BASE_URL` | the analysis service | **Needs confirming** — see §3.6 |

Non-secret values (`ENVIRONMENT`, `APP_ORIGIN`, `AUTH__ISSUER`, `AUTH__AUDIENCE`, `MAIL__REGION`, `MAIL__SENDER`, `LOG_LEVEL`) are already in the ConfigMap in `deploy/k8s/deployment.yaml`. **Nothing confidential goes in a ConfigMap** — it is readable by anything that can read the namespace and shows in plain text in `kubectl describe`.

The service refuses to start on an unbound variable in one of our namespaces, so a typo like `DB__DNS` fails loudly at boot rather than falling back to a default nobody intended.

---

## 3 · The six cluster prerequisites

These are the ones that turn a one-hour deploy into a one-day deploy if they surface on the day.

### 3.1 · The AWS Load Balancer Controller must be installed

The Ingress is annotated `kubernetes.io/ingress.class: alb`. **Without the controller the Ingress object is created successfully and no load balancer ever appears** — no error, no event, nothing to see. This is the single most likely first-deploy surprise.

### 3.2 · An ACM certificate for `new.caspr.ai`, issued and validated

TLS terminates at the ALB. The nginx config deliberately does **not** set HSTS, because an origin that only ever sees plaintext cannot honestly make that claim.

### 3.3 · DNS for `new.caspr.ai`

A Route 53 alias to the ALB. **This is necessarily a two-step:** the ALB does not exist until the Ingress is applied, so the record is created after the first apply. Budget for it rather than being surprised.

### 3.4 · Google OAuth — authorised redirect URI

`https://new.caspr.ai` must be on the authorised list for the client id already shared. If it is not, sign-in fails at Google with a `redirect_uri_mismatch` that never reaches our logs.

### 3.5 · Stripe webhook endpoint

`https://new.caspr.ai/api/v1/wallet/webhook` — **this matches the URL your team already assumed**, confirmed against the routing today. The endpoint verifies the signature before parsing the body, uses a constant-time compare and a 300-second tolerance, so the signing secret in `STRIPE__WEBHOOK_SECRET` must be the one for *this* endpoint.

### 3.6 · `AI__BASE_URL` — where the analysis service lives

Our manifest currently assumes `http://caspr-ai.default.svc.cluster.local`. **Please confirm or correct.** Until it resolves, the two spending calls answer `503` — which is the honest degradation, not a crash, but it means no analysis can be generated.

### Who applies the manifests

The first `kubectl apply` of `deploy/k8s/deployment.yaml` in each repo needs somebody with cluster access. After that, CI only ever changes the image tag.

---

## 4 · What happens once those land

| Step | Time |
|---|---|
| Set GitHub variables and secrets | minutes |
| First CI run — build, test, push to ECR | ~5 min backend, ~3 min frontend |
| First manifest apply | minutes, **if §3 is all true** |
| ALB provisions and becomes active | 2–4 min |
| DNS record, then propagation | minutes |
| Our smoke checks against the live URL | ~10 min |

**Under an hour of actual work if §3 holds. Realistically half a day**, because a first apply to a cluster that has never seen these manifests reliably surfaces one thing — and §3 is our best guess at which one.

**Rollout is zero-downtime and self-checking.** `maxUnavailable: 0` means the old pods serve throughout, so a bad image fails `rollout status` in the pipeline without users seeing it. Liveness and readiness point at *different* endpoints deliberately: `/health/live` touches nothing external, `/health/ready` reaches the database. Pointing liveness at the database check would turn a thirty-second RDS blip into a cluster-wide restart storm.

---

## 5 · One thing that is still ours, and is not small

**Server-side hold reconciliation.** When an analysis commits, we hold its price against the wallet. The client resolves that hold when it sees the run finish — but **a browser closed mid-run never sends it**, and the money stays held.

That needs your service to either call us on completion, or expose a status we can poll. Neither exists yet. Our half is built and idempotent; this is the honest half of the mechanism, not the whole of it.

It does not block launch. It does mean that until it lands, a small number of abandoned runs will leave money held that a person has to release. Worth agreeing a shape for in the fortnight after handover.

---

## 6 · What is deliberately not in this ask

Notifications, preferences, two-factor and the device list are **Phase 1.5** (Joy, 2026-08-25), built over the fortnight after handover alongside the rest of 1.5. They ship visible and explicitly disabled, with a "Coming soon" state — not hidden, and not pretending to work.

Nothing is needed from your team for them now.
