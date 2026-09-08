# Drive consolidation — status (2026-08-18)

## Corrected target

Everything non-code lives in a **single** Drive folder: **`G:\My Drive\Caspr\caspr-claude-core`**, mirroring the repo structure (`docs/`, `.agents/`, `content/`, `strategy/`, `Caspr_UI/`, `Logo/`, loose PNGs, `CLAUDE.md`). It is the **root for all non-dev sessions**. Code (`caspr-web`, `caspr-app`) stays **local** for the dev session.

> An earlier pass wrongly scattered files into the `Caspr\1. … 8.` business folders. That was fully reverted — all additions removed (verified: no existing files touched) — and re-consolidated into `caspr-claude-core`. See `feedback-file-location-rule.md` in memory.

## Done

- **Consolidated** the current non-code tree into `G:\My Drive\Caspr\caspr-claude-core` (parity verified: `.agents` 13, `docs` 109, `content` 88, `strategy` 6, `Caspr_UI` 46, `Logo` 4).
- **Retired** the stale May snapshot (it was fully superseded by local; local won on every divergent file).
- **Deleted** `Other Inputs/` (221M published-video report inputs — Joy approved).
- **Access boundary** written into `CLAUDE.md` Rule 1 and memory.

## Reconcile findings (for the doc-unify pass)

- **Edit credits:** the **token model (`EDIT-ECONOMICS.md`) governs** (Joy). `pricing-model.md` §4.6-A (visual-revision counts: Brief 2 / Study 10 / Intelligence 25, $5/10) and its §14 rows are **retired** and must be rewritten to the edit-token model; `gate-output-spec.md` §2.2/§4 and `visualization-library.md` also still carry the old model. `website-workplan.md` §2.1 already documents the landed model (edit credits included per analysis: Brief 15k / Study 80k / Intelligence 300k tokens).
- **Duplicates:** collapse `architecture-alignment-{aws,final,v4}.md` to one authoritative version.

## Next

1. **Per-session prompts** (Joy's ask) — a definitive prompt pinning each session to its folder + the access boundary.
2. **Doc-unify** — rewrite the retired edit-credit sections to the token model across `pricing-model.md`, `gate-output-spec.md`, `visualization-library.md`.
