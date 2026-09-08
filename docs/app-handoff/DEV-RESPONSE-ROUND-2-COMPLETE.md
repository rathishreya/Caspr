# Dev response — round 2 complete

**Commits `57964db` · `a01d12f` · `3bb350c`.** Gate green: 0 lint, 0 typecheck,
**829 tests**, build clean, bundle 206.76 kB / 215 kB.

| # | Action | Status |
|---|---|---|
| 1 | Pull Figma | Done — and it changed two numbers, see below |
| 2 | Edge-prompt spacing, both breakpoints | Done, measured |
| 3 | Delete `WalletBadge` | Done |
| 4 | Two one-line copy edits | Done |
| 5 | Rebuild the first-run stack | Done, measured |
| 6 | Wire the flipping placeholder | Done — **generated**, not transcribed |
| 7 | Website header and footer | **Blocked. Cannot be done as written** — §7 below |
| 8 | Nothing in §6 | Nothing done |

---

## 5 · The first-run screen

### The body was 13, not 14 — and two frame numbers disagreed with the prompt

Measured after rebuilding:

| | Desktop `1170:146` | Mobile `1289:377` |
|---|---|---|
| Greeting | y116 h19 · Inter 16/19 | y72 h16 · Inter 13/16 |
| Identity | y151 h55 · Serif 42/55 | y104 h31 · Serif 24/31 |
| Proof | y218 h29 · Serif 22/29 | y143 h32 · Inter 13/16, 2 lines |
| Input bar | y274 | y196 |
| Cards | 5 × 224×204 | y300 lead 358×108 · y416 · y586, 173×162 |

**Two places the prompt and the frame disagreed. I took the frame and am
flagging it, per the standing rule.**

1. *"the remaining four at 173 wide beneath it, 8px gutters"* — 173 + 8 + 173 is
   **354**, not 358. The frame puts the columns at x16 and x201, so the **column
   gap is 12** and only the **row** gap is 8. Card height is **162**, which the
   prompt did not state.
2. *"All four lines … x16 w358"* — the frame draws the text stack at **x20
   w350**. Visually identical because the lines are centred, but worth
   correcting in the prompt so the next reader does not build to 358.

Everything else landed exactly, including the mobile proof line in sans — you
were right that at serif it wraps to three lines and pushes the cards off the
viewport.

### The placeholder library is generated, not typed out

`firstRunContent.ts` is **produced from
`docs/product/onboarding-placeholder-prompts.md`**: 72 placeholders (9 sets × 8)
and 45 card examples (9 × 5), parsed and counted rather than transcribed.

Hand-copying ~110 strings is how a transcription error ships as customer voice,
and these are the strings whose whole value is that they are the ICP's own
language. If the library changes on Drive, the file is regenerated rather than
patched.

Built to the rules as stated: the dividing line is the prompt bar and nothing
above it varies; card order and line ③ flex, the Type name and one-liner never
do; detection is a hint, so a wrong guess reorders and never removes the card
the user came for; five cards always.

The flipping rules are in one hook with the reasoning attached, because they are
the load-bearing part — pauses on focus and clears the field, never flips over
typing, honours reduced motion, and is **placeholder only, never a value**.

*(The website's ICP routes — `/consulting`, `/investors`, `/agencies` and the
rest — all exist, so the detection paths are real rather than assumed.)*

---

## 7 · The website header and footer — this one cannot be done as written

**The instruction is right and I could not carry it out.** Not a scoping
objection: the import is impossible in the current architecture, and every way
around it is something §5.5 explicitly forbids.

```
caspr-website   Next.js  (app/, next.config.ts)
caspr-app       Vite + React SPA, react-router
```

Two separate repositories, two separate builds, no shared package and no
workspace link. And the components bind to Next's router:

| Component | Portable? |
|---|---|
| `components/layout/Header.tsx` | **No** — `next/link`, `next/navigation`, `'use client'` |
| `components/layout/Footer.tsx` | **No** — `next/link` |
| `components/ui/CTAButton.tsx` | **No** — `next/link` |
| `components/ui/Wordmark.tsx` | **Yes** — pure, zero Next imports |

`usePathname()` and `next/link` do not exist in a Vite SPA. So:

- **Importing them** fails at build.
- **Copying them** is a second implementation — the thing §5.5 exists to stop.
- **Rewriting them on react-router** is also a second implementation, just with
  extra steps, and it drifts on the first marketing change exactly as you
  describe.

**You are right that the problem is real.** The app has **four** hand-built
onboarding headers today (`AuthScreen`, `LoginPage`, `FirstTimeUserPage`,
`OnboardingToolLayout`) — which is the drift already happening, on the
highest-intent screens we have.

### Three ways out, and none is mine to pick

1. **Extract the chrome into a shared package** — `@caspr/site-chrome`,
   router-agnostic: components take `Link` as a prop or use plain `<a>`, and both
   repos consume it. The correct long-term answer, and it spans two repos and
   two teams.
2. **Serve the onboarding routes from the website.** The Next app already owns
   `/consulting`, `/pricing` and the rest; Login and First-Run become its pages,
   and the SPA takes over after authentication. Removes the duplication instead
   of managing it, and moves a real chunk of work across the boundary.
3. **Accept the copy, with a contract.** One `SiteChrome` component in the app,
   marked as a mirror, plus a test that fails when the website's header changes
   shape. Cheapest, and honest about what it is rather than pretending.

My read: **(1) if the website is going to keep changing, (2) if onboarding is
going to keep growing.** (3) is a holding position, not an answer.

Nothing is committed for this. I would rather leave four visible hand-built
headers with this note attached than add a fifth that looks official.

---

## Still open on you

1. **The two frame/prompt mismatches** above — worth correcting in the prompt.
2. **Onboarding chrome** — which of the three, and with whom.

*Dev session · 2026-08-20.*
