# Migrating the existing accounts

Everything needed to move the ~1,600–1,700 accounts from the old app into this one,
**without asking any of them to set a new password**.

| File | What it is |
|---|---|
| `legacy-schema.sql` | The old app's schema, as given. Reference only — never run it |
| `001-users.sql` | Accounts, credentials, wallets. Re-runnable |
| `002-balances.sql` | Carries outstanding balances at report-equivalence. Re-runnable |
| `003-conversations.sql` | Brings unfinished conversations across as Drafts. Re-runnable |
| `004-deliverables.sql` | Brings every delivered report across as archive files. Re-runnable |

The plan in one line: copy the users, copy their password hashes **as they are**,
and let the app verify against the old scheme and quietly re-hash to its own the
first time each person signs in.

---

## Before it can run — one thing to confirm

**Which scheme hashed the old passwords.** The app reads it off each row's
prefix, so a mixed table is fine, but bcrypt and argon2 need a verifier this
service does not ship. Run this against the old database — it returns *counts,
not hashes*, so it is safe to paste anywhere:

```sql
SELECT
  CASE
    WHEN password_hash LIKE '$2%'       THEN 'bcrypt'
    WHEN password_hash LIKE '$argon2%'  THEN 'argon2'
    WHEN password_hash LIKE '$pbkdf2-%' THEN 'pbkdf2 (passlib)'
    WHEN password_hash LIKE 'pbkdf2:%'  THEN 'pbkdf2 (werkzeug)'
    ELSE 'something else — send me the first 12 characters'
  END AS scheme,
  count(*)
FROM users
GROUP BY 1;
```

- **PBKDF2** — nothing to do. Node has it; it already works.
- **bcrypt** — needs `bcryptjs` (pure JS, no native build) wired into
  `createApp({ legacyPasswords: { bcrypt } })`. Ten minutes.
- **argon2** — needs `@node-rs/argon2`. Same shape, same ten minutes.

Until the right one is wired, a legacy sign-in answers **500, not 401** — on
purpose. A 401 would tell every migrated user that the password they have been
using for months is wrong, and they would all go and reset it, which is the
friction this whole approach exists to avoid.

---

## Balances — the model

**The rule (Joy, 2026-08-15):** a study cost **$25** in the old app and costs
**$80** here, so a dollar of outstanding balance is worth **3.2 dollars** in this
one. Somebody who could run four more studies can still run four more studies.

```
credit_cents = round(outstanding_old_dollars * 100 * 80 / 25)
```

**Nothing needs measuring.** An earlier version of this asked for a
tokens-per-study figure out of the old data. It does not any more: every token
batch records both what was paid for it (`amount`) and how many tokens it bought
(`initial_tokens`), which gives a **per-batch** rate. That is better than one
global average, because it prices each batch at what that particular user
actually paid for it.

`002-balances.sql` §4(a) prints the multiplier it produced. It must read
**3.20**. Anything else means the per-batch rates are not what we think, and
nothing should have been written.

### What counts as outstanding

**Paid batches only** — TOPUP and SUBSCRIPTION, which carry an `amount`.
SIGNUP_BONUS and BONUS do not, because nobody paid for them, and those users are
covered by the standard **$100 free trial** that `001-users.sql` already gifts
every migrated account. In report terms that is four studies, worth more than
the old signup bonus was.

Referral credit is not a case: the `referrals` table exists in the old schema but
has never been used (Joy, 2026-08-15). §4(e) still counts unpaid holders, which
is how we would find out if that had stopped being true before the run.

Expired batches are excluded: they had already stopped being spendable, so
honouring them would give people more than they had.

### Where the credit lands, and why it matters

**Promo, not paid.** The ledgers spend free trial → promo → paid, so promo is
spendable and spent *before* anything the user buys from here on. What it is not
is refundable.

That distinction is the point. This credit is 3.2× what these users actually
paid. Putting it in a refundable ledger would let someone who spent $25 ask for
$80 back in cash.

**✅ Confirmed by Joy, 2026-08-15: promo.** The whole credit, non-refundable.

### No cap

A ceiling would silently break the promise the script exists to keep, so there
isn't one. The protection is §4(c), which lists the twenty largest credits — look
at those before running it for real.

---

## Before it runs — one thing to look at

**Anyone who has already signed up in the new app under the same address.**
Their new account wins: it is the one they have been using and the one their
wallet belongs to, so the migration skips their legacy row rather than trying
to overwrite it. Without that guard the whole run aborts on the `users.email`
unique constraint.

It should be a very short list, and it is worth seeing:

```sql
SELECT lower(btrim(u.email)) AS email
FROM legacy.users u
JOIN users n ON n.email = lower(btrim(u.email)) AND n.id <> u.id;
```

If anybody is on it, their **old password will not work** — they will be
signing in with whatever they chose here. Worth an email if the list is more
than a handful.

## Running it

1. Restore the old dump into a schema called `legacy` in the new database
   (`pg_restore --schema=public` then `ALTER SCHEMA public RENAME TO legacy`, or
   map it with `postgres_fdw`).
2. Apply this app's own `src/db/schema.sql` first — the migration writes into
   those tables and does not create them.
3. Run `001-users.sql`.
4. Run `002-balances.sql`, then its §4 checks. The multiplier must read 3.20.
5. Run `003-conversations.sql` to bring across the unfinished conversations.
6. Check it landed:

```sql
SELECT
  (SELECT count(*) FROM legacy.users)                                  AS legacy_users,
  (SELECT count(*) FROM users)                                         AS migrated,
  (SELECT count(*) FROM user_credentials WHERE password_hash IS NOT NULL) AS with_password,
  (SELECT count(*) FROM user_credentials WHERE email_verified_at IS NOT NULL) AS verified,
  (SELECT count(*) FROM wallet)                                        AS wallets;
```

`migrated` will be **lower** than `legacy_users` if the old table holds two rows
for one address differing only by case. That is intended — the new app treats
those as one person — and the difference is worth eyeballing rather than
assuming:

```sql
SELECT lower(btrim(email)), count(*) FROM legacy.users
GROUP BY 1 HAVING count(*) > 1;
```

## Re-running it

Safe, by construction. Every statement is an upsert, the free trial is never
re-gifted, and a hash this app has already upgraded is never overwritten with
the old one — so a returning user who has signed in since the last run does not
get their new hash replaced by their old one.

## What is not carried across yet

**Delivered reports — migrated** by `004-deliverables.sql`, all of them, for
every user. There is no sample and no cut-off: someone who paid for a report
keeps that report, and how many there are does not change what the script does.

What comes across is the **file**, not the content. Each row in
`archived_outputs` points at an object that stays where it is in the legacy
bucket — nothing is copied into this database, which is what keeps the §4 rule
intact. An archived report opens as the PDF or PPTX it always was.

**What does not happen is conversion into a native analysis.** That needs an
ingest capability the AI contract does not have, plus per-anchor explanations and
an exec-summary infographic the old data never held (`QUESTIONS-FOR-JOY.md` §45).
It stays possible later, per report, without redoing any of this.

**One thing this needs before the archive is usable:** read access to the legacy
bucket, so the app can sign a download. That is `LEGACY_S3_*` in
`deploy/CONFIGURATION.md`. Until it is set the rows exist and the files are not
reachable — so **run this at cutover, not before**, or the library will show
rows that cannot be opened.

**Uploaded files.** `uploaded_files.s3_uri` points at objects in the old
account, and `file_versions.openai_file_id` at files in an OpenAI account this
app does not use. The S3 objects could come across with the deliverables; the
OpenAI ids are meaningless here.

**Old subscriptions.** The tiers do not map onto the Research Budget milestones,
and an active card-on-file subscription has to be cancelled with the old payment
provider rather than re-pointed at Stripe. Commercial, not SQL.
