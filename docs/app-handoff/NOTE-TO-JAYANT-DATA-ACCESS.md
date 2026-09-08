# Note for Jayant's team — how services get user context

**Caspr · 2026-08-27.** Short version of a decision that affects the API contract.

---

## What changes

**Request payloads carry identifiers, not state.**

```
POST /analysis/run   { user_id, prompt, depth }
```

Everything the analysis needs *about that user* — research profile, Data Room manifest, entitlements,
balance — is no longer copied into the payload. You fetch it, at the point you need it, from a read
endpoint we own:

```
GET /internal/context/{user_id}   → { profile, data_room_manifest, entitlements }
```

**Service-to-service authenticated. One definition, ours, read live.**

---

## Why we are doing it

Two reasons, and the second is the one that decided it.

**1 · Payload state goes stale, and it gets defined twice.** A payload is a snapshot. On a long analysis
the Data Room, the profile and the balance can all move before the run finishes. Worse, the same state
ends up modelled on both sides of the wire and the two drift — we have already paid for that twice this
month, once with a wallet figure that rendered as `$NaN` and once with an endpoint that existed in the
service but was never routed. Each side was internally consistent; nothing tested the join.

**2 · Services should be able to run in different environments.** Wherever your services sit today, the
design should not assume it. A read endpoint works the same whether the caller is in our VPC, in yours,
or somewhere neither of us has chosen yet.

---

## Why not read-only database access

It was proposed, seriously considered, and it is the version we rejected. Three reasons worth stating
because they are not about trust:

**It moves the authorization decision across the boundary.** Every table enforces row-level security,
keyed on a session variable the application sets per request. Today the answer to *"whose rows does this
query see"* is decided once, by us, on every request. With a direct connection your service sets that
variable — and a missed one returns nothing while a **wrong** one returns another customer's data and
looks like working software.

**A shared schema is a contract nobody can version.** We are about to rename `classification` →
`confidentiality` and add a `visibility` field. Behind an endpoint that is our migration. Across a shared
database it becomes a coordinated release, and a rename you would discover at runtime.

**It assumes co-location.** See reason 2 above. It is the assumption we are specifically trying not to
bake in.

---

## What this means for you

| | |
|---|---|
| **Payloads get smaller** | Identifiers only. Less to construct, less to keep in step |
| **One extra call** | Same-origin service-to-service, cacheable for the life of a run |
| **Schema changes stop reaching you** | The endpoint is versioned; our migrations are not your problem |
| **Nothing changes about what you can see** | The endpoint returns what the task needs, as the payload did |

---

## What we need from you, and it shapes the endpoint

**Which fields do your services actually read today?** We would rather build `/internal/context` around
what you genuinely consume than around what we imagine you consume — the second version is how an
endpoint ends up with fifteen fields and three callers using four of them.

A list of the fields, and which of them you need *during* a run versus once at the start, is enough. We
will send the contract back for review before it is built.

**If you have a case that genuinely needs bulk or analytical reads** — something an endpoint per user
would make silly — say so. That is a different problem and it has a different answer: a read replica
exposing views, never base tables. We have not ruled it out; it just is not the default path.

---

*Full reasoning, including the controls we would have needed under the database option:*
[`DATA-ACCESS-ARCHITECTURE-EVAL.md`](DATA-ACCESS-ARCHITECTURE-EVAL.md).
