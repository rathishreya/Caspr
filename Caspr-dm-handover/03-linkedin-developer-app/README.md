# LinkedIn App Submission — instructions for the DM team

**Purpose:** get the GTM portal authorised to publish to LinkedIn
**Owner:** Social Specialist, with Page-admin support from Joy
**Start:** week 1 of the build — this has the longest lead time of anything in the project
**Time required:** ~90 minutes of actual work, then waiting

---

## 1 · What we are doing, and why it is two separate things

There are two LinkedIn capabilities we need. They have completely different levels of difficulty, and the common mistake is treating them as one application.

| | What it does | Approval |
|---|---|---|
| **Share on LinkedIn** | Post, comment and like on **personal profiles** — the seven team members | **None. Open permission.** Works as soon as the app exists |
| **Community Management API** | Post to the **Caspr Company Page** and read its analytics | Application, reviewed by LinkedIn |

**Do the first one first.** It needs no approval, it covers the majority of what we publish, and it means the portal is functional on LinkedIn even if the second application is slow.

---

## 2 · Before you start — prerequisites

Tick all of these first. Starting without them wastes a submission.

- ☐ **The canonical Company Page is confirmed:** `linkedin.com/company/caspr-for-market-research/` — Page ID **108139853**. *(A slug change to `caspr-ai` is proposed in [`../01-linkedin-company-page/audit.md`](../01-linkedin-company-page/audit.md) §3.5. **Do the slug change before creating the app**, so the app is created against the final URL.)*
- ☐ **The person submitting is an admin of that Page.** LinkedIn verifies app ownership through Page admin rights — without it, the app cannot be verified at all
- ☐ **A LinkedIn account to own the app.** Use a role account or the Social Specialist's. Do not use a personal account belonging to someone who might leave
- ☐ **Legal entity — confirmed (Joy, 2026-08-19): `Caspr Holding Pte. Ltd.`, incorporated in Singapore.** Use this exact name. The registered Singapore address is required on the form — get it from Joy
- ☐ **`caspr.ai/privacy` and `caspr.ai/terms` are live and reachable.** LinkedIn checks these URLs
- ☐ **A business email address on the caspr.ai domain.** Free-mail addresses are rejected

---

## 3 · Part A — Create and verify the app

1. Go to **developer.linkedin.com** → **My Apps** → **Create app**
2. Fill in:

| Field | Value |
|---|---|
| App name | `Caspr GTM Portal` |
| LinkedIn Page | Select the canonical Caspr Company Page |
| Privacy policy URL | `https://caspr.ai/privacy` |
| App logo | The Caspr `C.` monogram — source from `assets/logo/` |
| Legal agreement | Accept |

3. **Verify the app.** LinkedIn generates a verification URL. Send it to a Page admin; they open it and confirm. This is instant but it is a hard gate — nothing works until it is done.

4. Under the **Auth** tab, add the redirect URLs. Give these to the dev session and add exactly what they specify — a mismatch here is the single most common cause of OAuth failures:

```
https://team.caspr.ai/api/auth/linkedin/callback
http://localhost:3000/api/auth/linkedin/callback     ← development only
```

5. Record the **Client ID** and **Client Secret**. Hand them over per §7. **Do not paste them into email, chat, or a document.**

---

## 4 · Part B — Share on LinkedIn *(no approval needed)*

1. In the app, go to the **Products** tab
2. Add **Share on LinkedIn**
3. Add **Sign In with LinkedIn using OpenID Connect** — needed so the portal can identify which team member is authorising

That is the whole process. These are self-serve and become available immediately.

**What this gives us:** the portal can post, comment and like on all seven personal profiles once each person authorises. Limits are 150 requests per member per day and 100,000 per app per day — we will use a small fraction of that.

**Do not add `r_member_social`** or any product that reads member feeds. It is not needed for publishing, and requesting it forces the entire app into the Standard-tier vetting process described in §6.

---

## 5 · Part C — Community Management API *(Development tier)*

This is for Company Page posting. Same **Products** tab → add **Community Management API** → complete the access form.

### What the form asks, and what to put

**Company details** — legal name **`Caspr Holding Pte. Ltd.`** (Singapore), its registered Singapore address, website `https://caspr.ai`, privacy policy `https://caspr.ai/privacy`, business email on the caspr.ai domain.

**Use case description** — paste this:

> Caspr is an analytical AI product for business research. We are building an internal marketing operations tool for our own company page, used only by our own employees.
>
> The tool schedules and publishes content to the Caspr LinkedIn Page, and reads that Page's engagement metrics into an internal reporting dashboard. All content is generated internally, reviewed and approved by a named member of our marketing team before publication, and published only to pages and profiles we own.
>
> We are not building a product for third parties, we do not resell access, and we do not store or process data belonging to any LinkedIn member other than our own consenting employees.

**Are you building for your own company or as a vendor?** — **Own company.** This matters: vendor applications face a much higher bar.

**Which APIs do you need?** — request only:
- Posting to the organisation's page
- Reading the organisation's page analytics

Request nothing else. Every additional permission is another reason for a reviewer to say no.

### What to expect

**Development tier is what we need and what you should expect to receive.** It allows 500 API requests per app per day and 100 per member per day. The Caspr Page will post two to three times a week, so this is roughly a hundred times more headroom than required.

Approval typically takes days rather than weeks. If nothing has arrived after **10 working days**, follow up through the developer support form.

---

## 6 · Part D — Standard tier *(we are not applying)*

Recording this so nobody applies for it by reflex.

Standard tier requires a screen recording of the application, test credentials handed to LinkedIn, and a vetting process in which LinkedIn responds within 60 days **only where they identify a "strong partnership fit."**

**We do not need it.** It exists for products operating at production scale on behalf of many customers. Our volume sits far inside Development tier limits. Applying would consume weeks and would probably be declined, which is a worse position than not asking.

Revisit only if we exceed the Development tier rate limits — which, at three Page posts a week, will not happen.

---

## 7 · Handing over the credentials

The portal needs these. **Secrets go into AWS Secrets Manager, not into a document, a message, or an email.**

| Item | Where it goes |
|---|---|
| Client ID | Secrets Manager |
| Client Secret | Secrets Manager |
| Organisation URN (the Company Page ID) | Secrets Manager |
| Approved product list and tier | Note it in this document when granted |
| Approval date | Note it here — some grants expire and need renewal |

Ask the dev session for the exact secret names before you store anything, so the values land where the code expects them.

---

## 8 · After approval — the seven authorisations

Once the app is live, each of the seven grants access individually. This is a one-time, 30-second action per person.

1. The portal shows each person a **Connect LinkedIn** button
2. They click it, LinkedIn asks them to confirm, they accept
3. The portal stores their token

**Brief them before sending the link**, in plain terms:

> This lets the portal publish the posts you have already approved, from your own profile, at the scheduled time. It cannot read your inbox, your connections, or your feed. You can revoke it at any moment from LinkedIn Settings → Data privacy → Permitted services.

Track completion — seven of seven — in the portal's admin page. A missing authorisation is a silently broken voice lane.

---

## 9 · If the application is rejected

Rejections are normally about form, not merit. In order of likelihood:

| Cause | Fix |
|---|---|
| Legal entity name does not match registration | Confirm the exact registered name with Joy and resubmit |
| Privacy policy URL unreachable or too thin | Check `caspr.ai/privacy` loads and covers data handling |
| Use case reads as a third-party or resale product | Re-emphasise **own company, own pages, internal tool** |
| Too many permissions requested | Cut back to the two in §5 |
| App not verified by a Page admin | Complete §3 step 3 |

Resubmission is permitted. Fix the specific cause; do not resubmit the same form hoping for a different reviewer.

---

## 10 · What we are deliberately not doing

- **Not applying for the Advertising API.** LinkedIn ads are deferred until the proof layer is live, and Google Search comes first when paid does start. Revisit then
- **Not applying for Standard tier** (§6)
- **Not requesting member-feed read access** — it would drag the whole app into Standard-tier vetting
- **Not automating anything on a profile we do not own.** No connection requests, no messaging, no scraping. Beyond breaching LinkedIn's terms, it is the fastest way to lose the app and the accounts behind it

---

## 11 · Status

Update as you go. This is the record.

| Step | Status | Date | Notes |
|---|---|---|---|
| Canonical Company Page confirmed | ☐ | | |
| Legal entity confirmed with Joy | ☐ | | |
| App created | ☐ | | |
| App verified by Page admin | ☐ | | |
| Redirect URLs added | ☐ | | |
| Share on LinkedIn added | ☐ | | Self-serve — immediate |
| Sign In with OpenID Connect added | ☐ | | Self-serve — immediate |
| Community Management API submitted | ☐ | | |
| Community Management API granted | ☐ | | Tier: |
| Credentials in Secrets Manager | ☐ | | |
| 7 of 7 personal authorisations | ☐ | | |
