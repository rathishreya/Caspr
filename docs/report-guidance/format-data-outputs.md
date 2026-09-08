# Format Guidance — Data & Plain-Text Outputs

*Layer 1 · Pass 2 (render) · `format ∈ {xlsx, csv, md, docx}`*
*Reads alongside `report-style-guide.md` (the master system)*
*Version 1.0 · 2026-08-19*

---

## Scope

Four formats that ship in the base sets (`gate-output-spec.md §4`) but carry no visual system of their own:

| Format | In base set | What it is for |
|---|---|---|
| **XLSX** | Study · Intelligence | the data behind the report, in a form the reader can work with |
| **CSV** | Study · Intelligence | machine-readable data for import into another system |
| **MD** | all tiers — **always free** | portable structured text; the report as source |
| **DOCX** | paid extra ($5) | an editable prose document |

These are **working formats.** They are judged on usability, not beauty. But the voice rules (`§11`) and the citation obligation (`§14`) do not relax — a source is a source in any container.

> **Outcome, not method.** This file specifies conventions. It does not specify which sheets, tabs, or sections a report should contain — that follows from the analysis, which is Caspr's to structure.

---

## 1. XLSX — the working data file

The reason this exists: readers rebuild Caspr's numbers into their own models. The research is explicit — analysts spend 40–50% of their time on exactly this, and *"I'm using junior analyst hours to format data in Excel"* is a named pain (`icp-personas.md` 1, 3).

**A CSV a user has to clean before using has failed.** So has a spreadsheet that looks pretty and cannot be pivoted.

### Structure rules — all RULES

1. **One table per sheet.** Never two tables stacked on one sheet — it breaks every downstream tool.
2. **Row 1 is the header row.** Nothing above it: no title banner, no logo, no merged "report name" cell.
3. **No merged cells anywhere.** Merged cells are the single most common cause of a broken pivot.
4. **No blank spacer rows or columns** inside a table.
5. **Values, not formatted strings.** `1400000` as a number with a display format — never the text `"1.4m"`. Percentages as real percentages (`0.62`), not the string `"62%"`.
6. **One unit per column, declared in the header** — e.g. `Revenue (USD m)`. Never mixed units down a column.
7. **ISO dates** (`YYYY-MM-DD`) as real date values.
8. **Every sheet carries its source.** Either a `Source` column, or a source row directly beneath the table separated by one blank row. Mandatory — `§14` Layer 1 applies here.

### Conventions

| Element | Specification |
|---|---|
| Header row | Bold, `caspr-black` fill, white text, frozen (freeze panes at A2) |
| Sheet naming | Descriptive and short — the finding or the dataset, not `Sheet1` |
| Number alignment | Numeric columns right-aligned; text left-aligned |
| Derived values | Where a figure is computed from others, **keep the live formula** — the reader can audit and adjust it |
| Nulls | Genuinely empty cells. Never `N/A`, `-`, or `0` standing in for missing data |
| Colour | Header row only. No banding, no conditional formatting, no red accent — this is a data file |
| First sheet | A short `Notes` sheet: report title, date generated, tier, and the definition of any non-obvious column |

**The `Notes` sheet is the exception to "no prose"** — column definitions and units prevent misreading, and misread data is worse than no data.

---

## 2. CSV — machine-readable

Strictly **RFC 4180**, UTF-8, no BOM, comma-separated, CRLF line endings, quoted fields where they contain a delimiter.

- **One table per file.** Multiple tables ⇒ multiple files.
- Header row first, single row, no preamble.
- **No formatting, no source row, no notes.** A CSV that contains anything other than tabular data is not a CSV.
- Sources travel in a `source` column, or in the accompanying XLSX. Where a CSV is generated standalone and a source column is impractical, a sidecar `.sources.csv` carries them — the citation obligation does not disappear because the format is plain.
- ISO dates. Decimal point (not comma). No thousands separators.
- Filenames: `{report-slug}--{table-slug}.csv`, lowercase, hyphenated.

---

## 3. MD — the report as portable source

Free in every tier. It is how a report travels into another system — a wiki, a repo, an LLM, a note-taking app.

- **Structural fidelity is the goal.** Heading hierarchy, tables, lists, and citation superscripts preserved so the document's structure survives.
- **The voice survives in full.** `§11` applies: findings-as-headers, conclusions not descriptions, no hedging, no exclamation points. MD is not a downgrade of the writing.
- Headings map to the report hierarchy (`#` report title, `##` section, `###` sub-section).
- **Tables as GitHub-flavoured markdown**, with the source line as an italic line immediately beneath.
- **Citations preserved:** inline superscripts as `[^n]` footnote references, with the full References list as footnote definitions at the end. Every reference resolves.
- Callout stats render as a bold number line plus its label — the emphasis survives even without the visual treatment.
- **No HTML.** If something cannot be expressed in plain markdown, it is described in text rather than embedded as markup.
- Front matter (YAML) carries the metadata: title, date, tier, deliverable type, and `guidance_version`.

---

## 4. DOCX — the editable document

A paid extra for readers who need to edit prose — most often to fold Caspr's analysis into a longer internal document.

- **Styles-based, not direct formatting.** Every element uses a named Word style (`Caspr Title`, `Caspr Section Finding`, `Caspr Body`, `Caspr Source`, `Caspr Table`). A user changing a style must see it apply document-wide. Hand-formatted text is a **RULE** violation, for the same reason the PPTX must sit on a master.
- Styles map to the master type scale (`§3`) and palette (`§2`), adjusted to Word's point conventions.
- **Real Word tables** with the `§9` treatment: black header row, white ALL CAPS Semi Bold, banding starting white, outer border only.
- **Charts as native or high-resolution embedded images with the source line as document text**, never baked into the image.
- Footnotes for `§14` Layer 2 citations; References as a closing section.
- Automatic page numbering and a footer carrying the `Caspr.` wordmark.
- **No text boxes and no floating objects.** They break reflow the moment a user edits — the entire reason this format exists.

---

## 5a. Evidence-class blocks without a visual system

**Added 2026-08-19.** The Signal (`report-style-guide.md §9a`), Divergence (`tier-intelligence.md §4`), and Primary Data (`components.md` C1) rely on tint, borders, and a left rule — **none of which exist here.** These formats therefore carry the highest risk in the whole system:

> **RULE — an evidence-class block must never degrade into ordinary prose.**
> The tint is how a reader knows crowd sentiment is not a cited finding. Strip it with nothing in its place and the block has been silently *promoted* — the exact failure the family exists to prevent. **The label and its meaning survive every format; only the styling is negotiable.**

### MD

Each block renders as a **blockquote with an explicit label line**, so the class is stated in words where it cannot be shown in colour:

```
> **THE SIGNAL** — the market's view, captured beyond the cited record
> [statement]
> *~2,400 mentions across forums, X and Reddit · Jan–Jun 2026*
```

```
> **WHERE THE EVIDENCE DIVERGES**
> Grand View Research (2025) — USD 4.2bn
> Euromonitor (2025) — USD 5.1bn
> **Resolution:** Euromonitor includes sodium bicarbonate; excluding it brings them to 4.3bn.
```

```
> **PRIMARY DATA — AI-SIMULATED PANEL**
> Responses are model-simulated from audience profiles, not collected from people.
> n = 412 · UK adults 25–54 · "[question verbatim]"
> [table follows]
```

Rules: the **label line is mandatory and always first**; the Divergence `Resolution:` line is mandatory; the synthetic sentence is mandatory and never abbreviated.

### DOCX

Named Word styles — `Caspr Signal`, `Caspr Divergence`, `Caspr Primary Data` — carrying the tint as paragraph shading and, for Divergence, a left paragraph border. **The label paragraph is part of the style and cannot be deleted without leaving the style.** Where shading is stripped by a user's template, the label text still states the class — belt and braces, deliberately.

### XLSX · CSV

**These blocks are not carried as blocks.** They are prose-and-provenance objects; a spreadsheet is not.

- **Divergence** may become a comparison table — one row per position, a `source` column, and the resolution as a row in the `Notes` sheet. Never as a bare list of conflicting numbers with no resolution: a reader pivoting that table would treat three incompatible figures as three data points.
- **Primary Data** — the data goes in a sheet; **method, base, question wording, and the synthetic disclosure go in the `Notes` sheet**, mandatory. A synthetic dataset in a spreadsheet with no method note is indistinguishable from measured data, which is the worst outcome in the system.
- **The Signal** is not exported to XLSX or CSV at all. Aggregate sentiment has no rows.

---

## 5. What carries across all four

**Non-negotiable regardless of format:**

- [ ] **Every figure traceable to a source** — a working format does not suspend `§14`
- [ ] No exclamation points; no hedging phrases from the `§11` removal list
- [ ] Findings-as-headers wherever the format has headers
- [ ] Numbers as values, never as pre-formatted strings, in XLSX and CSV
- [ ] No merged cells, no stacked tables, no spacer rows in tabular formats
- [ ] Units declared, once, in the header
- [ ] `guidance_version` recorded in the file's metadata or notes
- [ ] **Every evidence-class block carries its label line** — never degraded to plain prose *(RULE, §5a)*
- [ ] Divergence carries its resolution; synthetic Primary Data carries the "not collected from people" disclosure
- [ ] XLSX: method, base, and question wording present in the `Notes` sheet for any primary-data sheet

**What does not apply:** the cover system, section opening pages, callout visual treatment, cover photography, and the last-page design. Those are PDF and PPTX concerns. **Do not attempt to simulate them** — an ASCII-art cover in a markdown file or a logo banner above a spreadsheet header is worse than their absence.

---

*Owner: Joy · Engineering: Jayant · Layer 1 of `00-resolution-map.md`*
*Master design system: `docs/report-guidance/report-style-guide.md`*
