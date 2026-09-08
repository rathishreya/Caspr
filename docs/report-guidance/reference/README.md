# Reference — worked examples, not specification

These are **rendered outputs and reference implementations**. They show what the spec produces; they do not define it.

> **Where a reference file and a spec file disagree, the spec wins.** These were rendered at a point in time and are not re-generated when the spec changes.

| File | What it is | Useful for |
|---|---|---|
| `sodium-report-reference.html` | a full Intelligence-style report rendered in HTML | ground truth for the PDF system — cover, section openers, tables, callouts, citations, last page, all in one place |
| `sodium-cover.png` | the rendered cover | the `§4.3` photography treatment: filter tier, overlay stops, badge and depth lines |
| `cover-variants.html` | cover treatments side by side | comparing depth marks and content density across Brief / Study / Intelligence |
| `report-last-page.html` | the closing page | the `§15` implementation — zones, disclaimer, contact, social row |
| `brief-sample-v2.html` · `brief-sample-v2.pdf` | a Brief rendered against v2 | the `brief-design-v2.md` deviations: single dominant stat, Key Takeaways block, red-rule close, no last page |
| `sodium-report-revisions.md` | review notes on the sodium report | the *reasoning* behind several master rules — findings-as-headers, callout selection, section-opener restraint |

**The most useful two for a developer starting out:** `sodium-report-reference.html` for the page system, and `brief-sample-v2.html` for how a tier overlay changes it.

Start at [`../README.md`](../README.md).
