# Drive → repo migration manifest

Source: Google Drive folder **`caspr-claude-core`** (shared by joy.sharma@gmail.com)
`https://drive.google.com/drive/folders/1H-hRGZPjPntfVlyvpzaKvZPIv2isb7uO`

Captured 2026-09-07. This file records the **complete** inventory of the Drive folder
and exactly which parts have been copied into this repository so far.

---

## Status: partial copy

**12 of ~600 files copied.** Every copied file was verified byte-exact against the
Drive source (size + UTF-8 validity) before being committed. Nothing below is a
silent partial.

### Why this is partial

The only available transfer path is the Google Drive MCP connector, which returns
file contents as base64 through the agent's context window. Two consequences:

1. **Volume.** The folder is ~40–60 MB. Text alone is ~8 MB, which is transferable
   but slow; the binaries (a 24 MB zip, ~30 MB of PDFs, ~10 MB of PNGs, a 1.9 MB
   MP4, ~1 MB of TTFs) are not, because base64 inflates them ~1.37× and every byte
   must pass through context twice.
2. **Fidelity.** Reproducing large base64 blobs by hand is error-prone — measured at
   roughly a 1-in-7 corruption rate on files >30 KB during this migration. Every
   write is therefore size-verified and re-done on mismatch, which roughly doubles
   the cost per file.

**Recommended instead:** mirror the folder directly with a tool built for it. From a
machine with the Drive folder mounted or `rclone` configured:

```bash
rclone copy "gdrive:caspr-claude-core" ./caspr-claude-core --progress
```

That gets 100% fidelity, including binaries, in minutes. Note also that `CLAUDE.md`
states this Drive folder is itself the source of truth mirrored from
`C:\Users\joysh\Documents\caspr\caspr-claude-core` — copying from that machine is
likely simpler still.

---

## Copied (verified byte-exact)

| Path | Bytes |
|---|---|
| `CLAUDE.md` | 36,764 |
| `CONCEPTS.md` | 7,216 |
| `.claude/settings.json` | 1,808 |
| `.claude/serve-docs.ps1` | 1,340 |
| `.agents/caspr-brand-integration-brief.md` | 2,157 |
| `.agents/email-sequences.md` | 16,288 |
| `scripts/extract_pdfs.py` | 1,504 |
| `scripts/find_python.bat` | 673 |
| `scripts/run_extract.bat` | 328 |
| `scripts/run_extract_gitbash.bat` | 224 |
| `scripts/unblock_pdfs.vbs` | 508 |
| `Ahrefs_Key.txt` | 40 |

### ⚠ `Ahrefs_Key.txt` — live credential, committed by explicit instruction

This file contains a working Ahrefs API key. It was included at the user's explicit
direction after the exposure was flagged. Two things worth recording:

- Committing it publishes the key to git history, where it persists even if the file
  is later deleted. Rotating the key is the only real remediation.
- The repo's own `.claude/settings.json` **denies** reading this path
  (`"Read(**/Ahrefs_Key.txt)"`), and `CLAUDE.md` §7 names this exact file as the
  reason the credential rule was extended to cover Drive. The project's own standard
  treats it as a secret.

`docs/app-handoff/CASPR-KEYS-REQUEST.txt` (5,479 bytes) is denied by the same rule
and has **not** been copied.

---

## Not yet copied — full inventory

Folder IDs are given so each can be fetched directly.

### Text / source (~8 MB, ~500 files) — transferable, not yet done

| Drive folder | ID | Contents |
|---|---|---|
| `.agents/` | `1IFDjFfG7OVIJKPoFGmPp2xZmNcNBeHoR` | 11 remaining .md — `icp-personas.md` (76 KB), `pricing-model.md` (68 KB), `gtm-strategy.md` (43 KB), `product-marketing-context.md` (43 KB), `brand-guidelines.md` (27 KB), `website-visual-design-guidelines.md` (37 KB), `brief-spec.md` (25 KB), `icp-copy.md` (17 KB), `website-architecture.md` (15 KB), `security-posture.md` (16 KB), `academic-programme.md` (16 KB) |
| `docs/` (root) | `1PaZnR9lx79VQjq9MKcJVxGVf42Rc51Rc` | ~40 .md + .html — site truth, copy decks, website/app session prompts, SEO, report corpus briefs |
| `docs/app-handoff/` | `1hAySEj1cTML_i2mM1DhusheKZxEaguE5` | ~70 .md — dev prompts, build status, FIGMA-* exchange, conformance, test reports |
| `docs/gtm/` | `1hrapVPcXBlGPsHpNisSGucTLY6zaVvp_` | ~25 .md — portal specs, content engine, launch plan, tracking spec |
| `docs/product/` | `127hXzkF7tErAwngLllnWnFIoMW0SFeqj` | ~30 .md — app shell framework (91 KB), design spec, API specs, access model |
| `docs/report-guidance/` | `1N1C1dzL7b4KrTnSLty3pyrZsFr2qtCbP` | ~12 .md — report style guide (77 KB), per-type guidance + `reference/`, `archive/` |
| `docs/website/`, `legal/`, `video-briefs/`, `video-preview/`, `superpowers/`, `solutions/`, `seo/` | see below | ~60 files |
| `content/` | `1FIRtIaa3L0UJLG6uzrZDy2nMkxeqpa6W` | help-content repository + `_refresh/` deltas, `assets/visuals/` (HTML/SVG) |
| `strategy/` | `1DJ_V0JIi7xy-S2slZ72Vj8snjjK2caq1` | 5 .md — product roadmap, review, tool suggestions, website brief |
| `Caspr-dm-handover/` | `1nj01-UOVuWcmy634Kh9xGl8JEXB1jhG5` | LinkedIn company page / profiles / developer app, testimonials + transcripts |
| `.claude/skills/caspr-release-check/` | `1yNoibF_7yHPW0cnkBqsVwS3jfWspPh1v` | `SKILL.md`, `run.mjs` (33 KB) |
| `skills/` | `11rUB8H9JGjJ8ZkfRYi9Ua8wRfKAe8lzS` | `docx-skill/`, `joy-figma-dev-ready/` (+ `references/`) |
| `.playwright-mcp/` | `1NBJhVRkU8g1JXtltG4I5uBM1KyHFlXjD` | 7 console logs + page snapshots |
| `.superpowers/brainstorm/` | `1kmAsEVZWSuBNd5vkiV9OM1blLWeHmLbq` | 3 session dirs (`state/`, `content/`) |

Other `docs/` subfolder IDs: `solutions` `18NH5SAKQVhDldwKzBU5G-20upPzwCxhZ` ·
`seo` `1Drk0czAMI1q_Per8nbcJ0h4p1L2BlSnl` · `website` `1pcIEAguAsAnGF9fVFo5h8FeAr-jg9sy_` ·
`legal` `1TkxJDThLvptoBZX7JE5pJjoeCEy3FN5A` · `video-briefs` `1983zwT0Bp7Kb_Q4Cuf-3896zknmxjZ9e` ·
`video-preview` `1hG4HR8bQ9_-yGDSI9_n60Tenrj-mCSLW` · `superpowers` `1U58mBHgut3JWnYVo1PEPzWglmqOqA0R2`

### Vendored third-party (~600 KB, ~120 files)

`skills/watermarks-remover-main/` — `11bUQxSi-yKTYfc951SH6QJoxnFZVaTdg`

A complete vendored Python project (its own `LICENSE`, `.github/`, `service/`,
`tests/`, `Makefile`, Dockerfiles, `README.md` at 87 KB). Better re-cloned from its
upstream than copied file-by-file.

### Binaries — not transferable through this channel

| Item | Drive ID | Size |
|---|---|---|
| `Reports (1).zip` | `1-kv3VdqELxIAdnToFDvYq0HMoJaX6FIX` | 24.0 MB |
| `Reports/Reports/Reports-pdf/` (25 PDFs) | `1rdREwkXwUvoCW84kXRk6vkUcsmg9Xixq` | ~35 MB |
| `Reports/Reports/Reports-md/` (25 .md) | `1kGPjN2WdDSt8T59JICz44pLdv5iEEAFU` | ~4 MB (text — transferable) |
| `Caspr_UI/` (PNG mockups + Caspr logo SVGs) | `1EYpQZxIpP59xdEstWbAZcery19jQAdtj` | ~8 MB |
| `content/assets/visuals/screenshots/`, `video/` | `1vwdm6EUFbGHWflpt9FT4gFBnK9scbj4P` | ~3 MB HTML |
| `assets/fonts/` (Inter, DM Mono, Instrument Serif TTFs) | `1bFO4Opb7nJmtexvkw_6B6gv9MhIL7f0F` | ~1 MB |
| `assets/WhatsApp Video 2026-08-14.mp4` | `1U_CmQ-85_fDrxIakAErDC96EIsIun7BK` | 1.9 MB |
| `Logo/` (3 PNG + 1 SVG) | `1PYRfPGEtbDPf6T4th19T3cXnZq0pdtpR` | ~330 KB |
| Root PNGs (`inv_*`, `consulting_*`, `ent_features`, `help-1440`) | — | ~600 KB |
| `docs/report-guidance/reference/sodium-cover.png` | `1pGjlr8LFE7ZJZXvSNhWZknME1HkE0dK3` | 1.9 MB |
| `.xlsx` trackers (report corpus, od-10, help content, segmentation) | — | ~600 KB |

### Google-native docs (no direct binary export)

Several `docs/gtm/` and `Caspr-dm-handover/` entries exist as Google Docs rather than
files — `portal-build-spec.md`, `hiring-brief-marketing-lead.md`,
`testimonial-brief-v1.md`, `linkedin-app-submission.md`, `linkedin-profile-audit.md`,
`interview-review-round-1.md`, `production-brief.md`. Most duplicate a `.md` of the
same name; where they do not, they need exporting rather than copying.

---

## Verification method

Every copied file was written via `base64 -d` and then checked with `wc -c` against
the size reported by the Drive API, plus a UTF-8 decode for text files. Two files
failed on the first attempt (`scripts/extract_pdfs.py`, `CLAUDE.md`) and were caught
by this check and re-transferred successfully.

`CLAUDE.md` (36,764 bytes) failed twice as a single 49 KB base64 blob. It was then
transferred as **12 independently-decoded chunks**, each verified for size and UTF-8
validity before assembly. That surfaced three separate transcription errors — two
mangled em-dash sequences and one dropped `*` — each isolated to one chunk and fixed
without re-transferring the rest. The assembled file is byte-exact at 36,764 bytes.

**Chunking is the working method for any file over ~10 KB.** A single large blob has
roughly a 1-in-7 failure rate and gives no way to localise the fault; chunks of
2–5 KB fail rarely and localise immediately.

`CLAUDE.md` also names `.agents/product-marketing-context.md` as *"the master
reference"* — that file, plus `icp-personas.md`, `pricing-model.md`,
`gtm-strategy.md` and `brand-guidelines.md`, are the highest-value remaining items.
