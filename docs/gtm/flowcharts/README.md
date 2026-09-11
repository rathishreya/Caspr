# Flowcharts — the source files

*2026-09-11. Eleven mermaid charts. Render them, don't read them.*

**These are diagram sources, not documents.** Every rule and citation lives in the specs; these are the same
mechanisms drawn, one question per chart. Where a chart and a spec disagree, **the spec is right and the
chart is a bug.**

| File | Answers | Shape |
|---|---|---|
| `00-master.mmd` | **The whole system on one line** — both engines, every station | wide |
| `A-sources.mmd` | **Which sources, named**, how each is reached, free or paid — and the three kinds we must never confuse | wide |
| `B-trend.mmd` | **How a trend is chosen** — the four gates by name, the four ranking signals, the four verdicts, and **where viral content forks off** | wide |
| `C-clocks.mmd` | **Daily vs weekly**, hour by hour, and the fan-out that makes the volume work | square |
| `D-types.mmd` | **Every content type** — blog, post, thread, carousel, atom, email — plus **captions, hashtags, the link, and where reels stop** | wide |
| `E-angles.mmd` | **Angles** — pillar, narrative, funnel stage, ICP — and how the four together pick a channel | portrait |
| `F-engage.mmd` | **Creation vs engagement**, who comments where, and **how a target is found** | portrait |
| `G-calendar.mmd` | **How the calendar is built** — once, weekly, automatically, monthly | square |
| `H-sanity.mmd` | **Every sanity check in order**, and what each one refuses | wide |
| `I-platforms.mmd` | **Every platform: what content, what format, what size, when** — including Instagram's dimensions, where Reels stop, and why the caption is not a separate step | square |
| `J-accounts.mmd` | ⭐ **Whose account a post goes out from, and the mechanism that decides it** — the narrative picks the person, not the rota | square |

## Rendering

```
npx @mermaid-js/mermaid-cli@11 -i A-sources.mmd -o A-sources.png -b white -s 3
```

`-b white` for slides · `-s 3` for a crisp raster · `-o name.svg` to scale without blurring.
**All nine validated 2026-09-11.**

## The colour key, and it is the same in every chart

| | |
|---|---|
| 🟩 green | a source, or a good outcome |
| ⬜ grey | the machine, running unattended |
| 🟦 blue | **a person decides** |
| ⬛ dark | **a hard stop** — the engine refuses |
| 🟨 amber | a loop, or a cap that binds |
| 🟥 red | **compliance** — law, not preference |

**Specs:** [`../content-engine-runtime-spec.md`](../content-engine-runtime-spec.md) ·
[`../content-engine-operating-model.md`](../content-engine-operating-model.md) ·
[`../index-engine-runtime-spec.md`](../index-engine-runtime-spec.md) ·
[`../content-engine-decisions.md`](../content-engine-decisions.md) ·
[`../content-calendar-v2.md`](../content-calendar-v2.md)
