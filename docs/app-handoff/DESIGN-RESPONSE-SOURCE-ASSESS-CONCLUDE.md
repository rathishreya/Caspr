# Design response — the architecture rename in Figma

**To:** the dev session · **From:** the app design session · **2026-09-01**
**File:** `y2F394I4CwEeSzH2kKuDCt`

Answers [`APP-PROMPT-SOURCE-ASSESS-CONCLUDE.md`](../APP-PROMPT-SOURCE-ASSESS-CONCLUDE.md). **The file now matches
the docs**, and one of the docs was wrong — see §2.

---

## 1 · Done — every node ID

### 1.1 The proof line · §2.1

| Node | Frame |
|---|---|
| `1171:4` | `First-Time User — Desktop` (`1170:146`) |
| `1289:385` | `First-Time User — Mobile` (`1289:377`) |
| `2601:251` | `4.5 · Invited user · first run — Desktop` |
| `2601:295` | `4.5 · Invited user · first run — Mobile` |

> **Every source, credible. Every claim, triangulated. Every report, defensible.**

**Four, not two** — the invited-user first-run frames built last week are clones of the FTU stack and carried
the old line with them. The mobile pair sits in `auto · headline + proof`, so the shorter string reflowed
inside the Auto Layout with no collision.

### 1.2 The notification line · §2.2 — **8 nodes**

`760:67` · `1514:6` · `2157:3` · `1527:7494` · `1827:37` · `2044:39` · `2186:4603` · `2187:4717`

> `Initiating Learning Brain` → **`Sourcing now — assessing and concluding follow.`**

### 1.3 Sweep · §2.3

**Zero remaining** instances of *brain · thinking · reasoning · cognitive* or the old proof line, in **text or
layer names**, across every live page.

**One was mine:** `2612:1069` on the Collaboration page used *"the reasoning, or the reason it is closed"* —
written before this rule existed. Now *"the working"*.

**The Archive page is deliberately untouched** — 5 nodes on `🗄 Archive · Pre-framework concepts` still say
`THE LEARNING BRAIN` / `Thinking Brain generating report`. That page exists to record what the product used to
claim; scrubbing it would destroy the lineage the rename is worth understanding from.

---

## 2 · §2.2's conflict — resolved, and the prompt's framing was not quite right

**The prompt asked me to settle whether `DEV-BRIEF.md` §325 (Retired) or `gate-output-spec.md` §136 (current)
is live. Neither document was wrong about the slot. They disagreed about its *styling*, and the file had
already answered it.**

**What is actually drawn** at `2157:3` and its seven siblings:

| | |
|---|---|
| Type | **Inter Italic 13** `#5c5b58` |
| Alignment | **Left**, sentence case, letter-spacing 0 |
| Furniture | A **product-voice dot** (7px ellipse) beside it · **one** `#ececea` hairline above |
| Context | In the Ask thread, between `Proposed a Study — $80. Generating now.` and `One quick thing while I work…` |

**What `DEV-BRIEF.md` §10 retired** is *"centred-caps-between-hairlines **phase labels**"*. What is drawn is
none of those things — not centred, not caps, not between hairlines, and not a phase label. **The migration
had already happened**, in the same sweep that turned `OR JUST ASK` into product voice (the adjacent row in
that same table).

**So `DEV-BRIEF.md` is live and already applied. `gate-output-spec.md` §8.0 was stale** — it still described
the retired caps format and still carried `INITIATING LEARNING BRAIN`. **Corrected in place**, with the
reasoning recorded there rather than only here.

### The consequence for the copy — why I did not use the stage lockup

**§2.2 offers `SOURCING → ASSESSING → CONCLUDING`, justified because it "narrates ongoing action".** That
justification is sound *for a running progress sequence*. **This node is not one** — it is a single line that
fires once, in a chat thread, in italic product voice, sandwiched between two other Caspr sentences.

Setting three caps words there would **reintroduce exactly the centred-caps phase label DEV-BRIEF retired**,
one document after retiring it. So the line narrates the same three stages in the voice the slot actually
uses: **`Sourcing now — assessing and concluding follow.`**

**If you want the three-stage lockup**, its home is the Theater's own progress furniture — not the Ask thread.
That is a separate design, and I have not drawn it.

---

## 3 · Not done, deliberately

| | Why |
|---|---|
| **§4 · the report cover string** | **The prompt says coordinate, and I have not acted.** It is on 23 delivered reports and is half of an **EU AI Act Art. 50(2)** obligation whose **XMP half is absent entirely**. Changing the visible string alone closes nothing and makes the gap look addressed. **Needs Jayant, in the pass that adds the XMP fields** |
| **§5 · `§§PG\|COVER\|§§` leakage + duplicated Brief tables** | Both are in the **PDF pipeline**, not the design. Nothing in Figma produces them. Dev-side |
| **§3 · entry routes and CTA** | Already applied across the onboarding screens. Not reopened |

---

## 4 · The depth poll — **resolved 2026-09-01, retired**

**Joy: the poll is global, so retire the question** — *"we will have this information anyway from the users
data."* Done, in 4 frames, and replaced. **Full detail and the replacement set is in
[`DEV-PROMPT-ROUND-5.md`](DEV-PROMPT-ROUND-5.md) §2.** The rule it establishes:

> **Never ask what usage data already answers.** Depth, type, sector, geography, cadence, edit/share/export —
> all logged. A poll that asks one of them spends attention to learn something you already hold.

Depth preference is now a **derived** memory reading `Prefers the $80 depth` — the universal price rung rather
than a depth name that exists for only one type.

*The original finding, kept for the reasoning:*

### 4.1 How it was found — `COPY-07b`

**The get-to-know poll asks `How deep do you usually go?` and offers `Study · Brief · Intelligence` — the
Market Research ladder with no type anchoring it.** That is the error `CLAUDE.md` calls *"the single
most-repeated error in this project"*.

**Live in 4 frames:** `2159:4566` (`Generation — Desktop v3`) · `1749:80` · `1834:22` · `2195:2947`
(`Account · Research profile`). *(A fifth in `Type Specimens` is a type sample, not product copy — left alone.)*

**I did not fix it, because the fix depends on an answer I do not have:**

| If the poll is… | Then |
|---|---|
| **Type-scoped** — asked per deliverable type | Retitle: `How deep do you usually go on market research?` — but the title box is **208px** and that string needs ~380px, so it wraps or the box grows |
| **Global** — asked once about the user generally | The ladder is the wrong control entirely. It should offer **`the $15 · $80 · $300 depths`**, which are universal, rather than three names that only exist for one type |

**The second reading is more likely right** — it sits on the *Research profile*, which is a standing preference,
not a per-run choice. But that changes the control, not just the copy, so it is your call.

---

*App design session · 2026-09-01. Read with `source-assess-conclude.md`, `DEV-BRIEF.md` §10, and
`gate-output-spec.md` §8.0.*
