# SES values

The four sending values are in `.env.joy`:

- `SES_REGION` — AWS region for SES (`us-east-1`)
- `SES_SENDER` — From address (`no-reply@caspr.ai`)
- `AWS_ACCESS_KEY_ID` — access key that can call `ses:SendEmail`
- `AWS_SECRET_ACCESS_KEY` — matching secret

The domain **caspr.ai** is verified in SES. The account is **out of the sandbox**, so mail can go to any real inbox, not only addresses we verified for testing.

# Stripe values

Test keys (`sk_test_…` and `whsec_…`) are in `.env.joy`:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

These are **test** keys, not live. The webhook already exists and is subscribed to `payment_intent.succeeded`, `invoice.paid`, and `customer.subscription.deleted`.

For local testing, follow `stripe-local-testing-setup.md` to start ngrok. Send us the ngrok URL. We will point the Stripe dashboard webhook at that URL.

# AI service

The AI service is not deployed yet. We will provide the AI variables (`AI_API_BASE_URL`, `AI_HEALTH_URL`, `AI_PATH_PREFIX`, `AI_REALTIME_ORIGIN`, and the related call/auth values) once we are done with the code implementation phase.

`/mcp` is only for hosts like Claude Desktop and Cursor.

`AUTH_JWT_ISSUER`, `AUTH_JWT_AUDIENCE`, and JWKS belong on **your** product backend (`@caspr/backend`), as in your `CONFIGURATION.md`: you stamp `iss` / `aud` on the JWT and publish JWKS at `AUTH_ORIGIN` (your API, e.g. `http://localhost:8787`). We do not set those three values.

# Cost + capacity

Use your dummy values for now. The real numbers will be decided later, as discussed with Jayant's team today.

# Legacy reports

S3 values are in `.env.joy`, separate from the SES AWS keys:

- `LEGACY_S3_BUCKET`
- `LEGACY_S3_REGION`
- `LEGACY_S3_ACCESS_KEY_ID`
- `LEGACY_S3_SECRET_ACCESS_KEY`

Those two access keys are read-only on S3.

Reports are here:

`s3://caspr-dev-s3/caspr_reports_dev/2026/`

Layout of a generated version:

`caspr_reports_dev/2026/MM/DD/{user_id}_{user_slug}/{chat_id}_{title_slug}/report_{report_id}/v{version}/report/{title}.{extension}`

Anything else in the bucket is extra. To access the generated reports; use this prefix.