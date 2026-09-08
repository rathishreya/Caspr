# LinkedIn Company Page — rebuild

**Owner:** Social Specialist · **Time:** ~45 minutes · **Dependencies:** none
Full reasoning behind these changes: [`audit.md`](audit.md)

---

## Do these in order

### 1 · Check the ad account first — before anything else

The Page dashboard shows **47,080 post impressions in the last 7 days**, with **0 new followers** and **no posts in 90 days**. That pattern means paid distribution is probably running.

**If spend is live, pause it now.** It is currently driving traffic to a page that says *"AI for Market Research"* and claims *500,000+ sources* — both wrong. Resume once steps 2–5 are done. **Report back what you find.**

### 2 · Delete two categories of post

LinkedIn allows deleting but not editing, so these cannot be corrected in place.

- **Delete** any post containing **"LAM"** or **"Large Analysis Model"** — a prohibited claim that cannot stand publicly
- **Delete** any post stating a source count other than **25M+** (look for "1 million" and "500,000")
- **Leave** everything else. Older posts are dated and the new cadence will bury them

### 3 · Page settings

Open [`page-settings.txt`](page-settings.txt) and work down it. Every value is final — paste, do not rephrase.

Two things need Joy before you can finish: the **registered Singapore address** and confirmation of the **founded year**. Do everything else and come back to those.

### 4 · About us

Open [`about-us.txt`](about-us.txt), select all, paste over the existing text.

### 5 · Logo

Upload **`assets/logo/caspr-monogram-300-dark.png`**.

That is the recommendation. LinkedIn crops logos to a circle in nearly every placement and renders them at 48px in the feed, where a five-letter wordmark is unreadable. The monogram survives both.

Alternatives, if you or Joy prefer:

| File | When |
|---|---|
| `caspr-monogram-300-transparent.png` | If a transparent ground is needed elsewhere |
| `caspr-monogram-300-red.png` | Higher contrast in a crowded feed. Bolder, less restrained |
| `caspr-wordmark-300-dark.png` | Only if the full wordmark is required. **Check it at 48px first** |
| `caspr-wordmark-300-transparent.png` | As above, transparent |

### 6 · Cover image

Upload **`assets/cover/caspr-cover-1128x191-claim-dark.png`**.

Dark ground, the claim set in Instrument Serif, with the closing full stop as the brand's red dot. It is the recommendation — dark is how the brand handles its statement moments, and it holds the eye against LinkedIn's white interface.

| File | When |
|---|---|
| `caspr-cover-1128x191-claim-dark.png` | **Recommended** |
| `caspr-cover-1128x191-claim-paper.png` | Light ground, same line |
| `caspr-cover-1128x191-category-dark.png` | *"Analytical AI. Not generative."* — the category argument instead of the proof |
| `caspr-cover-1128x191-dark.png` · `-paper.png` | Wordmark only, no claim line |

### 7 · Report back

Tell Joy: what you found in the ad account, how many posts you deleted, and anything on the settings list you could not complete.

---

## Asset specifications

Built from the master vector logo, so type and the red dot are exact. Do not resize, recolour or re-export them.

| | Spec |
|---|---|
| Logo | 300 × 300 px, PNG |
| Cover | 1128 × 191 px, PNG |
| Brand red | `#E8453C` — this exact value |
| Dark ground | `#0C0B09` |

**Cover safe area:** the left ~220px sits behind the logo on desktop and is cropped on mobile. The wordmark is centred, which clears both.

---

## Also in this folder

| File | What it is |
|---|---|
| [`audit.md`](audit.md) | Why every change above is being made, with the full findings |
| [`../02-linkedin-profiles/audit.md`](../02-linkedin-profiles/audit.md) | The seven individual profiles — headline rewrites, voice lanes, engagement rules |
| [`../03-linkedin-developer-app/README.md`](../03-linkedin-developer-app/README.md) | Developer-app submission for the marketing portal. Separate task, longer lead time — start it in parallel |

*(These were emailed to you earlier. **This folder is now the current version** — work from here, not from the email.)*

---

## Fonts

Instrument Serif, Inter and DM Mono. All three are free on **fonts.google.com** — install from there. Every asset in this folder is already set in them, so you only need the fonts for new work.
