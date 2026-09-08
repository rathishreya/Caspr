# -*- coding: utf-8 -*-
from openpyxl import load_workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
XL=r'G:/My Drive/Caspr/caspr-claude-core/content/caspr-help-content-repository.xlsx'
thin=Side(style='thin',color='D9D9D9'); border=Border(left=thin,right=thin,top=thin,bottom=thin)

EM=u'\u2014'  # em dash
answers={
"E-01": f"""Editing turns a Caspr report into your report, and it unlocks at the Business milestone. Open any section and Edit gives you two ways in: a contextual menu for direct changes {EM} rewrite a paragraph, restructure a section, swap a chart, cut what doesn't apply {EM} or a rewrite prompt where you describe the change in plain language and Caspr makes it. Either way, saving creates a new version; nothing is overwritten, and the prior version stays on the Versions timeline to compare against or revert to.

Every analysis comes with an editing allowance included, measured in edit credits and scaled to depth: 15,000 on a Brief, 80,000 on a Study, 300,000 on an Intelligence report. It's a benefit, not a fee. The allowance is deliberately generous {EM} enough to rewrite every section of a 100-page Study twice over {EM} so in practice you edit as much as a report needs without watching a meter. Small tweaks barely register against it.

Citations move with the content, so a rewritten paragraph is still traceable to its source {EM} editing never breaks the trail back to where a number came from. This is where a report stops being a one-shot deliverable and becomes a working document you shape: sharpen the language for a specific audience, restructure the flow to match how your board reads a deck, or push a chart to say what the data actually supports. A consultant tailoring the same market research for three clients, or an investor trimming a due-diligence report to what the IC needs, both live here.

Upgrade to edit.""",

"E-02": f"""Exporting to PowerPoint gives you an editable PPTX {EM} the deck version of your report, built to drop into your own template rather than be presented exactly as Caspr delivered it. For a Study or an Intelligence report, a PPTX is part of the included base set; on a Brief it's an out-of-tier format, priced per output. Editing that deck inside Caspr unlocks at the Business milestone, alongside the rest of the editing tools, since adapting a deck properly usually means editing it first.

From the report, open Outputs, choose PPTX, and pick the language you need {EM} it renders natively in that language rather than translating after the fact. Once exported, the deck holds the same structure, charts, and citations as the PDF, reflowed into slide form: ready to be re-themed in your own colours, trimmed to the slides you need, or dropped into a client or board template.

This is the fastest route from a Caspr report to a deck you walk into a meeting with {EM} export the PPTX, adapt it with your own template, and keep the numbers and the sourcing intact under every slide.

Export to PPTX.""",

"E-03": f"""A follow-up lets you keep working with a report instead of starting over each time a new question occurs to you {EM} Caspr as an ongoing dialogue with your material, not a single answer delivered once. It unlocks at the Business milestone, alongside section refinement, since both draw on the same editing tools.

From any section, open Edit and use the rewrite prompt to ask Caspr to go deeper: expand a section, address a question the original brief didn't scope, or build out an angle the report only touched on. Caspr treats that as a targeted extension of the existing analysis, grounded in the same sources rather than started fresh, and saving produces a new version on the Versions timeline.

Because a follow-up like this refines the report you already have, it draws from that report's included editing allowance {EM} the same edit credits that cover the rest of your editing {EM} not a fresh charge. Going deeper on one question doesn't cost what starting over would.

The exception is scope. If a follow-up changes what the report actually is {EM} a new subject, a new market, a different analysis type {EM} that's a new analysis, and Caspr takes it to the gate and prices it there before running, so you always see the cost of genuinely new work before you commit. Deepening within the existing report stays inside your allowance; expanding into new territory becomes its own analysis.

Use it the way you'd use a second meeting with the analyst who wrote the first draft. You read a market-sizing Study, the competitive intensity in one sub-segment jumps out, and instead of commissioning a whole new brief you ask Caspr to build that section out inside the report you already have.

Ask a follow-up.""",

"E-04": f"""You don't need to re-run an entire report to fix or deepen one part of it. Open the section that needs work in Edit, use the contextual menu or the rewrite prompt to describe exactly what should change, and save {EM} only that section is touched, and every citation in it stays intact.

This is deliberately narrower than a full follow-up: you're not extending the report's scope, just sharpening what's already there {EM} tightening a paragraph that ran long, correcting emphasis that landed wrong, asking for a table instead of prose, or swapping a chart for one that makes the point faster.

Refining a section draws from your report's included editing allowance {EM} the edit credits that come with every analysis (15,000 on a Brief, 80,000 on a Study, 300,000 on an Intelligence report). The allowance is generous enough that a single-section pass barely touches it, so this is a tool you reach for freely rather than ration. Saving still produces a new version on the Versions timeline, so the prior read of that section is never lost.

Section refinement unlocks at the Business milestone, the same gate as editing generally. It's the tool for the common case: the report is right almost everywhere, and exactly one section needs another pass before it goes out the door.

Refine a section.""",

"D-10": f"""At launch, Caspr runs on a single template {EM} one style, applied consistently across every report.

Style does more work than it sounds like. It governs density, vocabulary, how charts are treated, overall length, and whether appendices appear {EM} the texture of the report, not just its skin. You set it before generating, at the gate, and choosing it there costs nothing.

Changing style after generation is an edit. "Make it denser," "add an appendix," "more visual" {EM} each reshapes the finished report, so each draws from that report's included editing allowance (the edit credits that come with every analysis) rather than a separate charge, on the Business milestone where editing lives. The allowance is generous enough that a restyle is a small draw against it.

Custom, user-built templates aren't in the launch scope {EM} one Caspr-designed template, well executed, beats a menu of half-finished ones.

Set your style.""",
}

# new card E-06
E06_answer=f"""Edit credits are the editing allowance included with every analysis {EM} what lets you refine a finished report instead of living with the first draft. Every report you generate on the Business milestone comes with them, scaled to depth: 15,000 credits on a Brief, 80,000 on a Study, 300,000 on an Intelligence report.

They're a benefit, not a fee. The allowance is set to be generous {EM} enough to rewrite every section of a 100-page Study twice over {EM} so for normal editing you won't watch a meter or think about them at all. Small changes barely register; even substantial rewrites draw modestly against a large balance.

What they cover: everything you do in Edit on that report {EM} rewriting sections, restructuring, swapping or adjusting charts, refining a single section, and follow-up questions that go deeper on the existing analysis. What they don't cover is genuinely new work {EM} a new subject, market, or analysis type {EM} which is a new analysis, priced at the gate before it runs.

Credits are included per report and scoped to that report, so a heavily-edited Study never eats into the allowance on your next one.

See what Business unlocks."""

wb=load_workbook(XL); ac=wb['Answer Cards']
h={ac.cell(row=1,column=c).value:c for c in range(1,ac.max_column+1)}
idx={ac.cell(row=r,column=h['ID']).value:r for r in range(3,ac.max_row+1)}
CAN=h['Canonical Answer (writer fills)']
for cid,a in answers.items():
    r=idx[cid]
    ac.cell(row=r,column=CAN,value=a.strip())
    ac.cell(row=r,column=h['Status'],value='Draft')
    ac.cell(row=r,column=h['Owner'],value='AI draft (pass3)')
    print('updated',cid,len(a.split()),'words')

# append E-06
nr=ac.max_row+1
rowvals={
 'ID':'E-06','Category':'E Editing & Refining','Question (customer words)':'What are edit credits?',
 'Working Title':'Edit credits, explained','Surfaces':'Help \u00b7 Blog','Max Depth':'L2',
 'ICP':'All ICPs','Buyer Stage':'Consideration','Pillar':'3','Target Keyword':'caspr edit credits',
 'Wave':'2','Writing Brief (what to cover)':'Explain edit credits = the included editing allowance per analysis (Brief 15k / Study 80k / Intelligence 300k), a benefit not a fee, generous (rewrite a Study twice over), covers all in-report editing incl. follow-ups; new scope = a new analysis at the gate. Business-milestone capability.',
 'Proof Points / Sources to cite':'15k/80k/300k by depth \u00b7 benefit not fee \u00b7 Business unlock \u00b7 new scope = new analysis',
 'CTA':'See what Business unlocks','Word Count':'L2:200',
 'Visual Type':'Comparison infographic','Production Method':'SVG/Figma infographic \u2014 build directly',
 'Needs Figma Frames?':'No','Figma Frames Needed':'','Asset Status':'Ready to build now',
 'Canonical Answer (writer fills)':E06_answer.strip(),'Status':'Draft','Owner':'AI draft (pass3)',
 'Surface':'Both','Coming Soon?':'No','Destination':'App: Pricing \u00b7 Web: Pricing/FAQ','Asset File(s)':'','Publish Ready':'Ready',
}
for hdr,val in rowvals.items():
    c=ac.cell(row=nr,column=h[hdr],value=val)
    c.font=Font(name='Arial',size=9,color='111111'); c.alignment=Alignment(vertical='top',wrap_text=True); c.border=border
ac.cell(row=nr,column=h['ID']).fill=PatternFill('solid',fgColor='F3EAFB')
ac.cell(row=nr,column=h['Publish Ready']).font=Font(name='Arial',size=9,bold=True,color='1E7A46')
ac.cell(row=nr,column=h['Asset Status']).font=Font(name='Arial',size=9,bold=True,color='1E7A46')
ac.row_dimensions[nr].height=96
print('appended E-06 at row',nr)

# update Voice Cheat Sheet 'editing under review' line
vs=wb['Voice Cheat Sheet']
for r in range(1,vs.max_row+1):
    v=vs.cell(row=r,column=1).value
    if isinstance(v,str) and 'Editing model is UNDER REVIEW' in v:
        vs.cell(row=r,column=1,value='\u2022 Editing = INCLUDED EDIT CREDITS by depth (Brief 15,000 / Study 80,000 / Intelligence 300,000), a benefit not a fee, Business-milestone unlock. Do NOT surface token top-ups in copy. New scope = a new analysis priced at the gate.')
        vs.cell(row=r,column=1).font=Font(name='Arial',size=10,color='111111')
        print('updated Voice Cheat Sheet editing line')
        break

wb.save(XL)

# QA
wb2=load_workbook(XL); ac2=wb2['Answer Cards']
import re
issues=[]
for cid in list(answers.keys())+['E-06']:
    rr=idx.get(cid) or ac2.max_row
    # find row for E-06
for r in range(3,ac2.max_row+1):
    cidv=ac2.cell(row=r,column=1).value
    if cidv in list(answers.keys())+['E-06']:
        a=ac2.cell(row=r,column=CAN).value or ''
        if '!' in a: issues.append((cidv,'excl'))
        if '\ufffd' in a: issues.append((cidv,'mojibake'))
        for b in ['platform','leverage','algorithm','workflow','revolutionary','powerful ai']:
            if b in a.lower(): issues.append((cidv,b))
print('QA issues:',issues or 'none')
print('Total cards now:',sum(1 for r in range(3,ac2.max_row+1) if ac2.cell(row=r,column=1).value and ac2.cell(row=r,column=1).value!='EX-00'))
