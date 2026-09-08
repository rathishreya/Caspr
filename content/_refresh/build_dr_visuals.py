# -*- coding: utf-8 -*-
import os, base64
RAW=r"G:/My Drive/Caspr/caspr-claude-core/content/assets/visuals/screenshots/raw"
SHOTS=r"G:/My Drive/Caspr/caspr-claude-core/content/assets/visuals/screenshots"
VID=r"G:/My Drive/Caspr/caspr-claude-core/content/assets/visuals/video"
def b64(fn):
    with open(os.path.join(RAW,fn),"rb") as f: return base64.b64encode(f.read()).decode()

PAGE=r"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>__TITLE__ — Caspr help</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Inter:wght@400;500;600&family=DM+Mono&display=swap" rel="stylesheet">
<style>
:root{--ink:#111;--red:#e8453c;--dark:#0b0b09;--canvas:#f6f5f3;--muted:#6b6b66;--hair:#e5e4e1;
--serif:'Instrument Serif',Georgia,serif;--sans:'Inter',Helvetica,Arial,sans-serif;--mono:'DM Mono',monospace;}
*{margin:0;padding:0;box-sizing:border-box}body{background:var(--canvas);font-family:var(--sans);color:var(--ink);padding:40px 24px}
.wrap{max-width:1160px;margin:0 auto}
.eyebrow{font-weight:600;letter-spacing:.18em;font-size:12px;color:var(--red);text-transform:uppercase}
.eyebrow::after{content:"";display:block;width:52px;height:3px;background:var(--red);margin-top:10px}
h1{font-family:var(--serif);font-weight:400;font-size:46px;line-height:1.05;margin:14px 0 4px}
.serves{font-family:var(--mono);font-size:12px;color:var(--muted);margin-bottom:26px}
.shot{width:100%;border:1px solid var(--hair);border-radius:2px;display:block;background:#fff}
.steps{margin-top:30px;display:flex;flex-direction:column;gap:16px}
.step{display:flex;gap:16px;align-items:flex-start}
.num{flex:0 0 auto;width:30px;height:30px;border-radius:50%;background:var(--red);color:#fff;font-family:var(--mono);font-size:14px;display:flex;align-items:center;justify-content:center;margin-top:1px}
.step p{font-size:17px;line-height:1.45}.step p b{font-weight:600}
.foot{margin-top:40px;padding-top:18px;border-top:1px solid var(--hair);display:flex;justify-content:space-between;align-items:center}
.foot .wm{font-family:var(--serif);font-size:26px}.foot .wm .d{color:var(--red)}.foot .u{font-size:14px;color:var(--muted)}
@media(prefers-color-scheme:dark){body{background:#0f0f0d;color:#f2f1ee}.shot{border-color:#26251f}.step p{color:#e9e8e4}.foot{border-color:#26251f}.foot .wm{color:#fff}}
</style></head><body><div class="wrap">
<div class="eyebrow">__EB__</div><h1>__H1__</h1><div class="serves">Serves cards: __SV__ · frame __FR__ · updated 2026-08-18</div>
<img class="shot" src="data:image/png;base64,__IMG__"><div class="steps">__STEPS__</div>
<div class="foot"><div class="wm">Caspr<span class="d">.</span></div><div class="u">In-app help · caspr.ai</div></div>
</div></body></html>"""

CARDS=[
("k01_data_room","dataroom_1756-2.png","1756:2","Data & the Data Room","The Data Room","K-01 · K-02 · K-05",
 ["<b>Included</b> files are attached to analyses by default; <b>Excluded</b> are kept but opt-in; <b>Connected</b> sources are coming soon.",
  "Add files by dropping, browsing, or pasting a link — PDF · XLSX · CSV · DOCX.",
  "Each row has a <b>checkbox</b> (with <b>Select all</b>) to act on files in bulk; <b>Reset Data Room</b> clears every source at once."]),
("k04_file_actions","dataroom_1756-2.png","1756:2","Data & the Data Room","File actions: privacy & inclusion","K-04 · K-06",
 ["Tick a file's <b>checkbox</b> — or <b>Select all</b> — to act on one file or many at once.",
  "A selection toolbar appears: <b>Include · Exclude · Make private/public · Delete</b>.",
  "<b>Exclude</b> keeps a file without using it — the Data Room's non-destructive declutter (there is no Archive here)."]),
("k07_delete_file","dataroom_delete_1775-2.png","1775:2","Data & the Data Room","Deleting a file","K-07",
 ["Select file(s) with the checkbox, then choose red <b>Delete</b> in the toolbar — single, multiple, or <b>Select all</b>.",
  "The confirm shows a live count (\u201CDelete N sources?\u201D) and offers <b>Move to Excluded</b> first — kept, but not used.",
  "Choose <b>Delete permanently</b> only when you want the copy gone; deletion can't be undone."]),
]
for name,frame,node,eb,h1,sv,steps in CARDS:
    img=b64(frame)
    sh="".join(f'<div class="step"><div class="num">{i+1}</div><p>{s}</p></div>' for i,s in enumerate(steps))
    html=PAGE.replace("__TITLE__",h1).replace("__EB__",eb).replace("__H1__",h1).replace("__SV__",sv).replace("__FR__",node).replace("__IMG__",img).replace("__STEPS__",sh)
    open(os.path.join(SHOTS,name+".html"),"w",encoding="utf-8").write(html)
    print("rebuilt",name+".html")

# --- walkthrough wv_k03 (frames: base -> uploading -> delete) ---
frames=[("dataroom_1756-2.png",1,"Open the Data Room."),
        ("dataroom_uploading_1791-2.png",2,"Drop files or paste a link — they land in Included."),
        ("dataroom_delete_1775-2.png",3,"Select any file to include, exclude, or delete — deletion always confirms.")]
n=2+len(frames); T=n*4; slot=100.0/n; fade=slot*0.14
def kf(cls,i):
    a=i*slot;b=(i+1)*slot
    return f"@keyframes {cls}{{0%,{max(0,a-0.1):.2f}%{{opacity:0}}{a+fade:.2f}%{{opacity:1}}{b-fade:.2f}%{{opacity:1}}{b:.2f}%{{opacity:0}}100%{{opacity:0}}}}"
kfs=[kf("scT",0)];scenes=[f'<div class="scene" style="animation:scT {T}s infinite"><div class="card"><div class="eyebrow">Caspr walkthrough</div><h1>Add your own data<span class="d">.</span></h1></div></div>']
for j,(fn,st,cap) in enumerate(frames):
    idx=j+1;cls=f"scF{j}";kfs.append(kf(cls,idx))
    scenes.append(f'<div class="scene" style="animation:{cls} {T}s infinite"><div class="shotwrap"><img class="shot" src="data:image/png;base64,{b64(fn)}"></div><div class="cap"><div class="st">STEP {idx} / {len(frames)}</div><div class="tx">{cap}</div></div></div>')
kfs.append(kf("scE",n-1));scenes.append(f'<div class="scene" style="animation:scE {T}s infinite"><div class="card"><h1 style="font-size:6vh">Your data, in every analysis</h1><div class="tag">25M+ sources — plus your own.</div></div></div>')
kfs.append(f"@keyframes footfade{{0%,{(n-1)*slot-2:.2f}%{{opacity:0}}{(n-1)*slot+fade:.2f}%{{opacity:1}}100%{{opacity:1}}}}")
WV=r"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Add your own data — Caspr walkthrough</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Inter:wght@400;600&family=DM+Mono&display=swap" rel="stylesheet">
<style>:root{--red:#e8453c;--dark:#0b0b09;--serif:'Instrument Serif',Georgia,serif;--sans:'Inter',Arial,sans-serif;--mono:'DM Mono',monospace;}
*{margin:0;padding:0;box-sizing:border-box}html,body{height:100%;background:#000;overflow:hidden}
.stage{position:relative;width:100vw;height:100vh;max-width:177.78vh;max-height:56.25vw;margin:auto;background:var(--dark);overflow:hidden;aspect-ratio:16/9}
.scene{position:absolute;inset:0;opacity:0;display:flex;align-items:center;justify-content:center}
.card{padding:0 8%}.eyebrow{font-family:var(--sans);font-weight:600;letter-spacing:.22em;font-size:1.6vh;color:var(--red);text-transform:uppercase;margin-bottom:2.4vh}.eyebrow::after{content:"";display:block;width:5vh;height:2px;background:var(--red);margin-top:1.4vh}
h1{font-family:var(--serif);font-weight:400;color:#fff;font-size:8vh;line-height:1.03}h1 .d{color:var(--red)}.tag{font-family:var(--mono);color:#fff;font-size:2.3vh;margin-top:3vh}
.shotwrap{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}.shot{max-width:82%;max-height:70%;border:1px solid #26251f;box-shadow:0 3vh 8vh rgba(0,0,0,.5)}
.cap{position:absolute;left:0;right:0;bottom:0;padding:5vh 8%;background:linear-gradient(transparent,rgba(6,6,5,.92) 42%)}.cap .st{font-family:var(--mono);color:var(--red);font-size:1.8vh;letter-spacing:.1em;margin-bottom:1vh}.cap .tx{font-family:var(--serif);color:#fff;font-size:4.4vh;line-height:1.12}
__KF__</style></head><body><div class="stage">__SC__</div></body></html>"""
open(os.path.join(VID,"wv_k03_add_data.html"),"w",encoding="utf-8").write(WV.replace("__KF__","\n".join(kfs)).replace("__SC__","\n".join(scenes)))
print("rebuilt wv_k03_add_data.html")
