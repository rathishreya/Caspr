# Read-only data access for Jayant's team — evaluation

**Dev session · 2026-08-27.** Joy's proposal, and my assessment.

> **The proposal:** rather than passing user, account, Data Room and memory state through the API
> payload, give Jayant's team read-only access to the relevant databases (or parts of them). The payload
> then carries only the **user ID**.

**Short answer: the diagnosis is right, the mechanism is wrong, and there is a version of this that gives
you everything you want without inverting the security model.**

---

## 1 · What is actually wrong today — Joy's instinct is correct

The problem with fat payloads is not their size. It is that **the same state is defined twice**: once in
our schema and once in the contract, and the two drift. That is the failure that produced the `$NaN`
wallet header, the wallet reservation endpoint that existed in the service but not in the router, and the
legal sheet rendering the wrong document. Each side internally consistent; nothing testing the join.

**A payload is also a snapshot.** By the time a long analysis runs, the Data Room, the research profile
and the balance may all have moved. Reading current state at the point of use is genuinely better than
shipping a copy of it.

**So the objective is right: one definition, read at the point of use, with the payload carrying an
identifier rather than a copy.**

---

## 2 · Why direct database access is the wrong mechanism

### 2.1 ⚠ It moves the authorization decision into their code

This is the decisive objection.

The backend enforces **row-level security** on every table — `ENABLE` *and* `FORCE`, with policies keyed
on `app_current_user_id()`, which reads a session variable the application sets per request
(`migrations/versions/0001_identity.py`). Today the answer to *"whose rows may this query see"* is decided
by **our** code, on every request, and it is decided once.

Under direct access, their service sets that variable — so the authorization decision moves across the
boundary. Two outcomes, both bad:

- They connect as a `caspr_request`-style role and must set `app.current_user_id` correctly on **every**
  query. A missed `SET` returns nothing (fails safe); a **wrong** one returns another customer's data
  (fails silently, and looks like working software).
- They connect as something with `BYPASSRLS` to avoid that friction, and RLS is over.

**Passing only the user ID sounds like less trust. It is more.** Today the payload *is* the authorization
— we decided what they may see before we sent it. A user ID in a payload is a *request* to see something,
and the thing granting it is now on their side of the line.

### 2.2 A shared database is a contract nobody can version

An API payload is a contract with a name, a shape and tests. A table is a contract too, but an invisible
one — and the moment two services read the same tables, **every migration is a coordinated release.**

This is not hypothetical: `access-model.md` §6.1 has us renaming `classification` → `confidentiality` and
adding `visibility`. Under the current design that is our migration. Under shared access it becomes a
change we cannot ship without their deployment moving in lockstep, and a rename they will discover at
runtime.

### 2.3 It widens what a compromise costs

A payload leaks one user's context. A database credential leaks **every user's Data Room** — the
proprietary files the product's entire security promise is about.

`CLAUDE.md` rule 7 is default-deny on exactly this shape of thing, and the credential would live in
another team's environment, outside our rotation.

### 2.4 It weakens two claims we make in public

- **GDPR data minimisation (Art. 5(1)(c)).** The payload approach *is* minimisation: they receive what
  the task needs. Broad read access is its opposite, and `privacy-policy.md` describes Caspr Research
  Private Limited as a **processor acting on documented instructions**. "Read what you need from the
  database" is not a documented instruction.
- **Auditability.** A payload is a discrete, loggable event — *we sent X, at time T, for purpose P.* A
  SELECT is not, unless we build query auditing. For a company arguing *cited or it does not ship*, and
  carrying an AI-provenance obligation, losing that trail is a poor trade.

### 2.5 Their query load lands on our production database

A bad join degrades the product, not just their service.

---

## 3 · The version that works — a read API, not a read connection

**Keep the payload carrying only the user ID, exactly as Joy proposes. Serve the rest through a narrow,
authenticated read surface that we own.**

```
POST /analysis/run          { user_id, prompt, depth }        ← the payload Joy wants
GET  /internal/context/{id} → { profile, data_room_manifest, entitlements }
```

| Joy's objective | Met? | How |
|---|---|---|
| Payload carries only the user ID | ✅ | It does |
| No duplicated state definitions | ✅ | One definition, ours, read at point of use |
| Always current, never a snapshot | ✅ | Read at the moment it is needed |
| No schema coupling | ✅ | We can rename `classification` freely behind it |
| Authorization stays ours | ✅ | Enforced per request, as it is today |
| Auditable | ✅ | Every read is a logged, attributable call |
| Rate-limitable and cacheable | ✅ | Ordinary HTTP |

**If they need bulk or analytical reads** — genuinely different from request-time context — then a
**read replica exposing views only, never base tables**. A view is a contract; a base table is not. That
keeps the migration freedom in §2.2 while giving them SQL.

---

## 4 · If direct access is chosen anyway — the minimum controls

Ordered by how badly each is needed.

| | Control | Why |
|---|---|---|
| 1 | **Never `BYPASSRLS`.** A dedicated role with RLS enforced, and `app.current_user_id` set per query | Without this there is no boundary at all |
| 2 | **Grants on views only, never base tables.** No `GRANT` on `users`, `wallets`, `data_room_files` | Restores the versioned contract |
| 3 | **A read replica, never the primary** | Their load cannot degrade the product |
| 4 | **Column exclusion** — no tokens, password hashes, or Data Room file *contents*; manifest metadata only | The files are the thing we promise to protect |
| 5 | **Private networking only** — VPC peering or PrivateLink, no public endpoint | |
| 6 | **Credentials in Secrets Manager, rotated on a schedule, never in their repo** | `CLAUDE.md` rule 7 |
| 7 | **`pgaudit` on the role**, shipped to our logs | Restores the audit trail lost in §2.4 |
| 8 | **DPA amendment** covering the widened processing, before access is granted | It changes what a processor may reach |

**Controls 1, 2 and 4 are not negotiable.** Without them this is a shared database with a login, and the
security posture we publish stops being true.

---

## 5 · Recommendation

**Adopt Joy's payload change — user ID only. Serve the context over a read API we own.**

That is the same architecture Joy is describing, with the read surface being HTTP rather than SQL. It
keeps every benefit and loses none of the boundary. **The only thing it gives up is their ability to
write arbitrary queries** — which is also the thing that makes the other version unsafe.

### ✅ DECIDED — Joy, 2026-08-27

I had made this conditional on whether their services sit inside our trust boundary. **Joy closed it, and
the reasoning is better than the question:**

> *"Regardless of where their services are now, it's better to design for a future where services can run
> in different environments."*

That is decisive, and it removes the conditional rather than answering it. **A read API is
environment-agnostic** — it works the same whether the caller is in our VPC, in theirs, or in a third
place we have not chosen yet. **Direct database access silently assumes co-location and a shared trust
boundary**, so adopting it would bake today's deployment topology into the data model, and the cost of
that assumption only arrives on the day it stops being true — which is the worst day to find out.

**So: read API. Payload carries the user ID and nothing else. §4's controls do not apply, because there
is no direct connection to control.**

The replica-with-views option in §3 stays available for genuine bulk or analytical reads, but it is a
separate decision with its own justification — not the default path.
