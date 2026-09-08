# Funnel tracking — specification and dev-session prompt

*Raised 2026-08-18. For the product app, built in the new repo.*
*Reads alongside: `docs/product/onboarding-understanding.md` · `docs/product/gate-output-spec.md` · `docs/gtm/segmentation-ask.md`*

---

## Why this exists

Every number in the GTM is gated on measurement that does not exist. Activation rate has been unknown since May. No campaign, channel or dollar of spend can be evaluated without it, and no portal built on top can prove return.

**One rule shapes the whole design.** Per `onboarding-understanding.md`, signup is now the tool: the user writes a prompt, converses, reviews a layout and starts the Theater **before any account exists**. So the most important half of the funnel happens while the user is anonymous. A tracking design that starts at signup measures the wrong thing and will report an activation rate that is meaningless.

---

## Part 1 — Identity

Three identifiers, and the stitch between them is the part that matters.

| Identifier | Created | Lives |
|---|---|---|
| `anonymous_id` | First page load, before any interaction | First-party cookie + localStorage, 400-day expiry |
| `session_id` | Each visit; 30-minute inactivity timeout | Memory |
| `user_id` | At account creation | Server |

**The alias event is the single most important call in this spec.** At the moment the signup overlay completes, the client must emit an `identify` that carries the existing `anonymous_id` alongside the new `user_id`, and the backend must retroactively re-attribute every prior event on that `anonymous_id` to that `user_id`.

Without it, the pre-signup prompt, conversation, layout and Theater are orphaned, and we cannot answer the only question worth asking: *of the people who started a prompt, how many finished an analysis?*

**Merge rule:** last write wins on user properties; events keep their original timestamps. If an `anonymous_id` later signs in as a different `user_id`, do not merge — start a new identity chain.

---

## Part 2 — Attribution

Captured on **first touch**, persisted for the life of the `anonymous_id`, and written onto the user record at signup. Store both first-touch and last-touch; first-touch is what we report on.

| Property | Source |
|---|---|
| `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` | Query string |
| `referrer_host` | `document.referrer` |
| `landing_path` | First path in the session |
| `icp_hint` | Derived from `landing_path` or an explicit `?icp=` param |
| `first_touch_at` | Timestamp |

`icp_hint` is already expected by the onboarding spec, which reorders the five Type cards and swaps the example prompts by entry ICP. The marketing site must therefore append it on every outbound CTA — `/consulting`, `/investors`, `/strategy`, `/agencies`, `/startups`, `/market-research`, `/corporate-dev`, `/category-managers`, `/academic`.

**Never put personal data in a URL parameter.** `icp_hint` is a segment label, nothing more.

---

## Part 3 — Events

Fire exactly these, with exactly these names. Anything extra is fine; anything missing breaks a funnel step.

### Pre-signup — the anonymous half

| Event | Fires when | Key properties |
|---|---|---|
| `session_started` | First load of the first-time-user page | attribution block, `device_type` |
| `prompt_submitted` | User submits their first prompt | `entry_method` (`typed` / `type_card` / `placeholder_example`), `type_card` if used, `prompt_length` |
| `conversation_turn` | Each clarifying question answered | `turn_index` |
| `layout_rendered` | Structure cards fill the centre | `section_count`, `ms_since_prompt` |
| `generate_requested` | User confirms generate in chat | — |
| `theater_started` | Theater begins playing | — |
| `signup_wall_shown` | Overlay fires | `trigger` (`gate_button` / `theater_timer`), `ms_of_theater_watched` |
| `signup_abandoned` | Session ends with wall shown, no account | `ms_on_wall` |

### Account and generation

| Event | Fires when | Key properties |
|---|---|---|
| `signup_completed` | Account created — **must carry the `identify`/alias** | `method` (google / linkedin / outlook / email), full attribution block |
| `gate_viewed` | Pre-generation confirmation shown | `tier`, `formats[]`, `language`, `style`, `total_price`, `is_free_trial` |
| `gate_confirmed` | Generate pressed | same, plus `balance_before` |
| `analysis_started` | Generation begins server-side | `analysis_id`, `type`, `depth` |
| `analysis_completed` | **The activation event.** Deliverable produced | `analysis_id`, `depth`, `duration_seconds`, `page_count`, `is_first_for_user` |
| `analysis_failed` | Generation errors | `analysis_id`, `stage`, `error_class` |
| `output_generated` | Any output produced | `format`, `charged`, `amount` |
| `report_opened` | Report surface opened | `analysis_id`, `days_since_generation` |

### Commercial and retention

| Event | Fires when | Key properties |
|---|---|---|
| `budget_set` | User authorises a Research Budget | `amount`, `milestone` |
| `payment_succeeded` | Any charge | `amount`, `kind` (recharge / à la carte / output) |
| `payment_failed` | | `amount`, `reason_class` |
| `trial_expired` | 90-day trial lapses unused | `balance_forfeited` |
| `ask_caspr_query` | Follow-up question asked | `analysis_id` |
| `citation_opened` | Red-dot citation clicked | `analysis_id` |
| `edit_applied` | Edit produces a new version | `credits_consumed` |

`citation_opened` is not vanity. It is the only direct measure of whether the credibility answer — the documented #1 objection — is landing.

---

## Part 4 — The questions this must answer

If the implementation cannot produce these from a single query, it is not finished.

1. **Activation rate.** Distinct users with ≥1 `analysis_completed` ÷ distinct users with `signup_completed`.
2. **True top-of-funnel conversion.** Distinct `anonymous_id` with `prompt_submitted` → `signup_completed` → `analysis_completed`. This is the number the old model could not see at all.
3. **Where the anonymous funnel leaks.** Drop-off between each pre-signup step. If most sessions die at `signup_wall_shown`, the wall is wrong. If they die at `layout_rendered`, the layout is wrong. These call for opposite fixes.
4. **Time to first analysis.** Median hours, `signup_completed` → first `analysis_completed`.
5. **Everything above, split by `icp_hint` and `utm_campaign`.** Without this the portal cannot attribute revenue to a channel and the RoI target is unprovable.
6. **Cohort retention.** By signup week: share still running analyses at week 4 and week 12.
7. **Gate abandonment.** `gate_viewed` without `gate_confirmed`, split by `total_price`. Directly tests whether pricing is the blocker.
8. **Domain clustering.** Distinct corporate email domains with 3+ users — the documented Enterprise outreach trigger.

---

## Part 5 — User buckets and x

*Added 2026-08-20. Canonical definitions: `.agents/gtm-strategy.md` §11.*

**These are the operating classifications. Each implies a different engagement, so they must be derivable
from the event stream — not recomputed by hand each time.**

| Bucket | Derivation |
|---|---|
| `never_activated` | `signup_completed` and **no** `analysis_completed` |
| `sampled` | exactly one `analysis_completed`, none since, 21+ days |
| `consuming` | ≥2 `analysis_completed`, trial balance falling, no `budget_set` |
| `converted_early` | `budget_set` **before** trial balance reached zero |
| `exhausted_not_converted` | trial balance zero, no `budget_set` |
| `expired_unused` | `trial_expired` with balance remaining |
| `paying_consuming` | `budget_set` **and** ≥1 `analysis_completed` this cycle |
| **`paying_dormant`** | **`budget_set`, zero `analysis_completed` this cycle** |
| `lapsed` | previously paying, no `payment_succeeded` this cycle |

**`paying_dormant` is the one to get right.** Under the Research Budget model a user can authorise a $200
budget, run nothing, and pay only the **$14 platform fee** — counting as a "paid user" while generating
almost no revenue. **Any metric counting paid users rather than revenue hides this.** It is why x is
measured on revenue, and why *trial-to-paid* is retired as a headline metric.

**Long-cycle rule:** `exhausted_not_converted` past **4.5 months** from signup moves to a separate
long-cycle bucket — lower-frequency engagement, not continued nurture.

### x — what the events must support

> **x = revenue per $1 of total GTM spend, by signup cohort. Reported at `x@3` and `x@6` months.**

Two points because the trial is **$100 with a 90-day expiry** — a user can sit on credit through month
three and convert in month four. `x@3` is the fast signal; `x@6` is the one scaling decisions rest on.

The stream must support, per signup cohort:

- **Revenue** — sum of `payment_succeeded`, at 3 and 6 months from `signup_completed`. **Charges actually taken, never budgets authorised**
- **Cohort membership** — signup month, plus first-touch `utm_campaign` and `icp_hint`
- **Three series, never blended** — `x_netnew` (the gate) · `x_reengagement` (the existing 1,600, reported alongside) · `unattributed` (pre-existing payers, and direct arrivals with no tracked prior touch)

**Spend comes from the portal, not the product.** The product supplies the numerator; the portal joins it
to spend. Cohort keys are the only integration point and both sides must agree on them.

---

## Part 6 — Implementation notes

- **Server-side wherever possible.** `analysis_completed` and every payment event must fire server-side. Ad blockers suppress a material share of client events, and under-reporting activation is the specific failure this project exists to fix.
- **Client events go through one wrapper**, never scattered `track()` calls. One module owns the event names so a typo cannot silently create a second funnel.
- **Event names are a contract.** Once live, they are not renamed without a migration — dashboards, the portal and the paid-ads attribution all bind to them.
- **Backfill what history allows.** The one-time export in `segmentation-ask.md` gives the historical baseline; this spec covers everything from go-live forward. They will not perfectly reconcile, and that is acceptable — say so on the dashboard rather than quietly blending them.
- **No personal data in event properties.** Identifiers and segment labels only. No prompt text, no report content, no email addresses in the analytics payload.
- **Consent.** Respect the cookie/consent decision. If analytics consent is refused, drop the event rather than sending it without an identifier.

---

## Part 7 — Prompt for the dev session

> Implement funnel tracking in the Caspr product app per `docs/gtm/tracking-spec.md` on the Caspr Drive folder. Read that file first — it is the source of truth for event names and properties.
>
> Scope:
>
> 1. **Identity module.** `anonymous_id` (first-party cookie + localStorage, 400-day expiry), `session_id` (30-minute inactivity timeout), and an `identify`/alias at `signup_completed` that retroactively re-attributes prior anonymous events to the new `user_id`. This is the critical path — signup happens *after* the user has prompted, conversed, seen a layout and watched the Theater, so most of the funnel is anonymous.
> 2. **Attribution capture.** First-touch UTMs, referrer host, landing path and `icp_hint` persisted for the life of the `anonymous_id` and written to the user record at signup. Store first-touch and last-touch separately.
> 3. **One typed event wrapper.** A single module exporting a typed `track()` with the event names and property shapes from Part 3. No direct analytics calls anywhere else in the codebase. A typo must be a type error, not a second funnel.
> 4. **Wire the events** at the points named in Part 3, matching the real flow in `docs/product/onboarding-understanding.md` and `docs/product/gate-output-spec.md`. Fire `analysis_completed`, `analysis_failed` and all payment events **server-side**.
> 5. **Consent gate.** Honour the cookie decision; drop events rather than sending them unidentified.
> 6. **Bucket derivation.** Expose the nine buckets in Part 5 as a queryable classification per user, recomputed on the relevant events. They drive engagement, so they must be reliable and cheap to read — not a reporting-layer afterthought.
> 6. **Bucket derivation.** Expose the nine user buckets in Part 5 as a queryable classification per user, recomputed on the relevant events. Do not leave them as a reporting-layer afterthought — they drive engagement, so they need to be reliable and cheap to read.
>
> Constraints: no personal data in event properties — no prompt text, no report content, no email addresses. Event names are a contract; do not improvise alternatives. Use the app's existing AWS-native stack; do not introduce a new vendor SDK without flagging it first.
>
> Deliver: the identity and tracking modules, the wiring, and a short `README` section listing every event and where it fires. Then confirm which of the eight questions in Part 4 the implementation can answer end-to-end, and name any it cannot.
