# Configuration — every input the product needs

**One file, on purpose.** Everything the app reads from its environment is listed
here, so a deployment is one pass through one document rather than a hunt through
three services. Nothing is compiled in: no domain, key, port or address exists in
the source, which is what makes local → staging → production a config change and
never a code change.

**How to read the tables.** *Required* means the feature does not work without
it. **Every optional value has a defined behaviour when absent**, and it is
always "refuse and say so" rather than "carry on quietly" — a missing payment key
returns 501 rather than pretending, and a missing mailer prints to the log with a
warning rather than silently dropping account-recovery emails.

Values marked 🔑 are **secrets**. They go in AWS Secrets Manager or the task
definition, never in this repo and never in a ticket.

---

## 1. Product backend (`@caspr/backend`)

### Identity and origins

| Variable | Required | Default | What it is |
|---|---|---|---|
| `APP_ORIGIN` | **yes** | `http://localhost:5173` | Where the SPA lives. Emailed verification and reset links point here, and Stripe returns the user here. Deliberately separate from `CORS_ORIGIN`: that is a list of who may call us, this is the single address a browser is sent to. Conflating them means the first extra CORS origin silently redirects verification links |
| `CORS_ORIGIN` | **yes** | `http://localhost:5173` | Comma-separated origins allowed to call the API |
| `AUTH_JWT_ISSUER` | **yes** | `https://auth.caspr.local` | `iss` on every Caspr JWT. Jayant's service verifies against it, so **it must match on both sides exactly** |
| `AUTH_JWT_AUDIENCE` | **yes** | `caspr-app` | `aud`. Same — must match Jayant's |
| `BACKEND_PORT` / `--port` | no | `8787` | Two services live in this repo and cannot share one `PORT`; whichever binds second dies on `EADDRINUSE`. `PORT` still works and has the last word for a container that injects it |

### Email — Amazon SES

**SES, not SNS.** SNS delivers only to *subscribed* endpoints, which cannot work
for a link sent to somebody who signed up ten seconds ago. (Confirmed with Joy,
2026-08-15.)

| Variable | Required | Default | What it is |
|---|---|---|---|
| `SES_REGION` | **yes** | — | e.g. `ap-southeast-1`. Must be a region where the sending identity is verified |
| `SES_SENDER` | **yes** | — | A **verified** SES identity: `Caspr <no-reply@caspr.ai>` or a bare address |
| `AWS_ACCESS_KEY_ID` 🔑 | **yes** | — | Or leave unset and give the task an IAM role with `ses:SendEmail` |
| `AWS_SECRET_ACCESS_KEY` 🔑 | **yes** | — | |
| `AWS_SESSION_TOKEN` 🔑 | no | — | Only when the credentials come from STS |
| `SES_CONFIGURATION_SET` | no | — | Strongly recommended. It routes bounces and complaints somewhere visible, and **a bounce nobody sees is a user who never got their link and has no way to tell us** |

**Absent → links are printed to the log with a loud warning, not sent.** Fine
locally; in a deployment it means nobody can complete a signup, so the warning
exists to make that impossible to miss.

**Two things to do in the SES console before this works:**
1. Verify the sending domain (or at minimum the sender address).
2. **Leave the sandbox.** A new SES account can only send to verified addresses,
   so signup will appear to work and reach nobody. This is the single most likely
   reason "SES is configured but no email arrives".

### Payments — Stripe

| Variable | Required | Default | What it is |
|---|---|---|---|
| `STRIPE_SECRET_KEY` 🔑 | for live payments | — | `sk_test_…` or `sk_live_…`. **Which key you inject is the only thing that decides test or live** — there is no environment flag to get wrong |
| `STRIPE_WEBHOOK_SECRET` 🔑 | for live payments | — | `whsec_…`. Absent → the webhook answers 501 rather than trusting what arrives. An unverified webhook is a URL that credits wallets on request |
| `ALLOW_SANDBOX_PAYMENTS` / `--sandbox-payments` | no | off | Fake gateway for local work. **Never set in production.** With no Stripe key and no sandbox flag, top-ups answer 501 |

We use **hosted Checkout**, so no publishable key is needed and card details
never touch a page we serve — which is the cheapest thing available for the PCI
and SOC 2 work.

**In the Stripe dashboard:** point a webhook at `{BACKEND_ORIGIN}/webhooks/stripe`
and subscribe it to `payment_intent.succeeded`, `invoice.paid` and
`customer.subscription.deleted`.

### Legacy archive — only for the migration

| Variable | Required | Default | What it is |
|---|---|---|---|
| `LEGACY_S3_BUCKET` | for archived reports | — | The old app's bucket. `archived_outputs` rows point into it; **nothing is copied** |
| `LEGACY_S3_REGION` | for archived reports | — | |
| `LEGACY_S3_ACCESS_KEY_ID` 🔑 | for archived reports | — | Needs **read only**. A migration credential that can write is a migration credential that can destroy the thing it is migrating |
| `LEGACY_S3_SECRET_ACCESS_KEY` 🔑 | for archived reports | — | |

Absent → the archive rows exist and cannot be opened, which is why
`004-deliverables.sql` should run **at cutover, not before**.

---

## 2. AI service (`@caspr/reference-ai`)

Replaced by Jayant's service at cutover. These matter until then, and on any
environment that keeps the reference implementation for conformance runs.

| Variable | Required | Default | What it is |
|---|---|---|---|
| `AUTH_ORIGIN` | **yes** | `http://localhost:8787` | Where it fetches the JWKS to verify our tokens |
| `AUTH_JWT_ISSUER` / `AUTH_JWT_AUDIENCE` | **yes** | as above | Must match the backend's, exactly |
| `AI_PORT` / `--port` | no | `8788` | |
| `LATENCY_PROFILE` | no | `compressed` | `real` runs a Study in 60–120 minutes as production will; `compressed` keeps the proportions ~600× faster |
| `ALLOW_FAULTS` | no | off | Enables the `x-caspr-fault` header. Opt-in on purpose: a header must never be able to break a real analysis on a shared environment |
| `OUTPUT_SIGNING_SECRET` 🔑 | no | random per process | Signs download links. The random default is deliberate — every restart invalidates outstanding links and no secret sits in the repo. Set it only if links must survive a restart |

---

## 3. Web app (`@caspr/web`)

Vite inlines these **at build time**, so changing one means rebuilding. They are
public by definition: anything here is readable by anyone who opens the app, so
**no secret ever goes in a `VITE_` variable**.

| Variable | Required | Default | What it is |
|---|---|---|---|
| `VITE_BACKEND_ORIGIN` | **yes** | `http://localhost:8787` | The product backend |
| `VITE_MCP_ENDPOINT` | **yes** | `http://localhost:8788/mcp` | The AI service. **Re-point this at Jayant's and nothing else changes** |
| `VITE_REALTIME_ORIGIN` | **yes** | `ws://localhost:8788` | The WebSocket origin for the analysis lifecycle. A `ws://`/`wss://` scheme, not `http` |
| `VITE_REQUEST_TIMEOUT_MS` | no | `30000` | |
| `VITE_USE_MOCKS` | no | `false` | In-process mock client. For tests and for working on a plane — **never a deployment** |
| `VITE_GOOGLE_OAUTH_CLIENT_ID` | for Google sign-in | — | Public by design; the secret half stays server-side |

---

## 4. Cutover checklist

The order matters: each step depends on the one above it.

1. `AUTH_JWT_ISSUER` and `AUTH_JWT_AUDIENCE` **identical** on the backend and on
   Jayant's service. Everything else fails confusingly if these differ.
2. SES verified, **out of the sandbox**, and `SES_CONFIGURATION_SET` pointed at
   somewhere bounces are read.
3. Stripe live keys in, webhook registered, `ALLOW_SANDBOX_PAYMENTS` **unset**.
4. `VITE_MCP_ENDPOINT` and `VITE_REALTIME_ORIGIN` pointed at Jayant's service,
   then **rebuild the web app** — these are baked in, not read at runtime.
5. Legacy S3 read credentials in.
6. Run the migration: `001-users` → `002-balances` → `003-conversations` →
   `004-deliverables`. See `services/backend/migration/README.md`.
7. Confirm with the conformance suite against the live AI service:
   `CONFORMANCE_TOKEN=<a real JWT> npm run conformance -- --origin <AI_ORIGIN>`.
   All green **and zero skips**.

## 5. What is deliberately not configurable

Prices (`pricing-model.md` is the source), the $100 free-trial gift, token
lifetimes, and rate limits. Each is a product decision rather than an environment
one, and a price that can be changed by an environment variable is a price that
will eventually differ between two environments without anyone deciding it
should.
