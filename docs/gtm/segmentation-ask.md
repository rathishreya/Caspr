# Ask: one-time user segmentation export

*For: Jayant's engineering team*
*From: Joy*
*Raised: 2026-08-18*
*Companion file: `segmentation-export-template.xlsx` — fill sheet 2 and return*

---

## What this is for

We are preparing the re-engagement campaign to everyone who has ever signed up for Caspr. Before a single email is written we need to know who they are and what they actually did, because the message to someone who ran eight analyses is not the message to someone who bounced at the upload modal.

This same export answers a second question that has been open since May and currently blocks the entire GTM: **what percentage of signups have ever generated an analysis.** That is the activation baseline. Nothing in the marketing plan can be evaluated without it.

**This is a one-time pull.** Ongoing measurement is a separate, larger piece of work — specified in `docs/gtm/tracking-spec.md` — and should not be bundled into this request.

---

## What we need

One row per account, all accounts ever created, including deleted and test accounts (flagged, not filtered — we will exclude them ourselves).

### Identity and acquisition

| Field | Type | Notes |
|---|---|---|
| `user_id` | string | Internal identifier. Stable |
| `email` | string | Required for sending |
| `first_name` | string | Required for personalisation. Blank if not captured |
| `last_name` | string | |
| `signup_date` | ISO 8601 date | |
| `signup_source` | string | UTM source / referrer if captured at signup. Blank if not |
| `email_domain` | string | Everything after the `@` |
| `email_domain_type` | enum | `corporate` · `free` (gmail, outlook, yahoo…) · `edu` · `unknown` |
| `country` | string | If captured, from profile or IP at signup |

### Behaviour — the part that matters most

| Field | Type | Notes |
|---|---|---|
| `last_login_date` | date | Blank if never returned after signup |
| `login_count` | integer | Total sessions if available |
| `prompts_started` | integer | How many times they began a prompt or conversation, whether or not it produced anything |
| `analyses_completed` | integer | **The activation number.** Completed analyses that produced a deliverable |
| `first_analysis_date` | date | Blank if none |
| `last_analysis_date` | date | Blank if none |
| `analyses_by_depth` | string | Counts by depth in whatever vocabulary the data uses — legacy token tiers are fine, do not attempt to remap |
| `reports_downloaded` | integer | Any format |

If `analyses_completed` cannot be produced cleanly, give us the closest available proxy and tell us what it counts. **An approximate number this week is worth more than an exact one next month.**

### Commercial

| Field | Type | Notes |
|---|---|---|
| `legacy_plan` | string | Free / Plus / Pro under the retired token model |
| `legacy_token_balance` | number | Unspent balance at time of export. Needed to decide what we owe people |
| `ever_paid` | boolean | |
| `total_revenue_to_date` | number | USD |
| `trial_balance_remaining` | number | Under whatever model applies to that account |
| `trial_expiry_date` | date | |

### Hygiene — required, campaign will not send without it

| Field | Type | Notes |
|---|---|---|
| `account_status` | enum | `active` · `deleted` · `suspended` |
| `is_internal_or_test` | boolean | Staff, QA and demo accounts |
| `email_hard_bounced` | boolean | Any prior hard bounce |
| `unsubscribed` | boolean | Any prior opt-out |
| `marketing_consent` | boolean | If recorded |
| `consent_basis` | string | e.g. signup checkbox, terms acceptance |
| `consent_date` | date | |

The last three matter for EU and UK recipients. If consent was never separately recorded, say so plainly — we will handle it with a legitimate-interest basis and a prominent unsubscribe, but we need to know rather than assume.

---

## Two summary numbers we would like in the same delivery

Sheet 3 of the template calculates these automatically once the export is pasted in, but if they are easier to produce directly, they are the two headline answers:

1. **Activation rate** — accounts with `analyses_completed ≥ 1`, divided by total non-test accounts.
2. **Median time to first analysis** — median days from `signup_date` to `first_analysis_date`, for activated accounts only.

---

## One additional cut, cheap to produce, high value

**Company domains with three or more registered accounts.** Just the domain and the count.

This is the documented trigger for enterprise outreach (`gtm-strategy.md` §8): three or more active accounts on one domain means a firm is already using Caspr individually and can be converted to a pooled Enterprise budget. We have never looked. It costs one `GROUP BY` and may be the highest-value row in the whole export.

---

## Format and delivery

- **Format:** CSV or XLSX. Sheet 2 of the attached template has the exact column headers in order — matching them saves us a mapping step
- **Encoding:** UTF-8
- **Dates:** ISO 8601 (`YYYY-MM-DD`)
- **Empty values:** leave blank rather than `NULL`, `N/A` or `0` — a blank and a zero mean different things here and we will read them differently
- **Delivery:** shared drive, not email attachment — it is personal data
- **Deadline requested:** within 5 working days

---

## Handling note

This file contains personal data for every person who has ever signed up. Store it in the shared drive, not on local machines, and delete working copies when the campaign is built. It should never be uploaded to any third-party tool other than the email platform we send from.

---

## What we do with it

For visibility, so the shape of the request makes sense. We will cut the list into five groups and write a different opening to each:

| Segment | Definition | What they get |
|---|---|---|
| **S0 — Suppress** | Test, deleted, hard-bounced, unsubscribed | Nothing |
| **S1 — Never activated** | 0 completed analyses | The full sequence. The largest group and the main target |
| **S2 — Activated once** | Exactly 1 | Sequence with a different opening — they saw the output and did not come back, and we want to know why |
| **S3 — Repeat users** | 2 or more | Short, personal, from Joy. These are the testimonial and referral candidates |
| **S4 — Ever paid** | Any revenue | Personal note from both founders before anything automated reaches them |

Plus the domain cluster list, which goes to Joy directly rather than into any sequence.
