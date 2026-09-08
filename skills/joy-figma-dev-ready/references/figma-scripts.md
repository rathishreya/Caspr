# Figma Plugin API snippets

Working code for every audit and conversion in this skill. Adapt names and tokens; the structure is the reusable part.

**Contents:** [1 Coverage](#1-coverage-audit) · [2 Contrast](#2-contrast-audit) · [3 Spacing histogram](#3-spacing-histogram) · [4 Fractional type](#4-fractional-type-audit) · [5 Variable binding](#5-variable-binding-by-role) · [6 Auto Layout with safety net](#6-auto-layout-conversion-with-safety-net) · [7 List runs](#7-list-run-detector) · [8 Nesting](#8-nested-wrapper-build)

**Two API facts worth knowing before you start.** `findAll` does not descend into `INSTANCE` children, so instance internals are invisible to sweeps — audit components separately. And a call that throws rolls back everything it did, which is a free transaction: prefer one call that verifies and reverts over several that half-apply.

---

## 1 · Coverage audit

Answers "how much of this file is Auto Layout" honestly, per page. Run this before claiming anything about the file.

```js
const pages=[];
for(const p of figma.root.children){
  if(/Deprecated|Archive/i.test(p.name)) continue;
  await figma.setCurrentPageAsync(p);
  const all=p.findAllWithCriteria({types:['FRAME','COMPONENT']});
  const auto=all.filter(n=>n.layoutMode&&n.layoutMode!=='NONE');
  pages.push({page:p.name, containers:all.length, auto:auto.length,
    pct: all.length?Math.round(auto.length/all.length*100):0});
}
return pages;
```

## 2 · Contrast audit

Walks up to the nearest opaque ancestor rather than assuming white — that is what makes it trustworthy.

```js
const hex=c=>{const t=n=>Math.round(n*255).toString(16).padStart(2,'0');
  return '#'+t(c.r)+t(c.g)+t(c.b);};
const lum=c=>{const f=v=>v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);
  return 0.2126*f(c.r)+0.7152*f(c.g)+0.0722*f(c.b);};
const ratio=(a,b)=>{const L1=Math.max(a,b),L2=Math.min(a,b);return (L1+0.05)/(L2+0.05);};

const fails=[];
for(const p of figma.root.children){
  if(/Deprecated|Archive/i.test(p.name)) continue;
  await figma.setCurrentPageAsync(p);
  for(const t of p.findAllWithCriteria({types:['TEXT']})){
    const f=t.fills;
    if(!Array.isArray(f)||!f.length||f[0].type!=='SOLID') continue;
    let a=t.parent, bg=null;
    while(a && a.type!=='PAGE'){
      const af=a.fills;
      if(Array.isArray(af)&&af.length&&af[0].type==='SOLID'&&af[0].visible!==false
         &&(af[0].opacity===undefined||af[0].opacity>0.5)){ bg=af[0].color; break; }
      a=a.parent;
    }
    const L=bg?lum(bg):1;
    const r=ratio(lum(f[0].color),L);
    const w=(t.fontName&&t.fontName.style||'').toLowerCase();
    const isLarge = t.fontSize>=18 || (t.fontSize>=14 && /bold|semi|black|heavy/.test(w));
    if(r >= (isLarge?3:4.5)) continue;
    fails.push({page:p.name, fg:hex(f[0].color), bg:bg?hex(bg):'#ffffff',
      ratio:Math.round(r*100)/100, size:t.fontSize, isLarge,
      txt:(t.characters||'').slice(0,28)});
  }
}
const byPair={};
for(const f of fails){
  const k=f.fg+' on '+f.bg;
  byPair[k]=byPair[k]||{fg:f.fg,bg:f.bg,ratio:f.ratio,count:0,pages:{},sample:f.txt};
  byPair[k].count++; byPair[k].pages[f.page]=(byPair[k].pages[f.page]||0)+1;
}
return {failing:fails.length,
  pairs:Object.values(byPair).sort((a,b)=>b.count-a.count)};
```

**Group by colour *pair*, not by node** — foreground plus its actual background. Thousands of failures usually come from a handful of pairs, which turns an overwhelming list into a short palette decision.

**Classify by size and weight before judging**, or you will report headings as failures:

```js
const w=(t.fontName&&t.fontName.style||'').toLowerCase();
const isLarge = t.fontSize>=18 || (t.fontSize>=14 && /bold|semi|black|heavy/.test(w));
const need = isLarge ? 3 : 4.5;
```

**This sweep catches both directions automatically** — because it keys on the *pair*, a white label on a brand-coloured button appears as `#ffffff on <accent>` alongside the dark-on-light failures. Do not filter the results to a list of suspect foreground colours; that is exactly how a failing primary button gets missed.

## 3 · Spacing histogram

Derives the scale from the file instead of importing one. Run before any conversion.

```js
const R=n=>Math.round(n);
const gaps={}, pads={};
for(const p of figma.root.children){
  await figma.setCurrentPageAsync(p);
  for(const f of p.findAllWithCriteria({types:['FRAME','COMPONENT']})){
    if(!f.layoutMode||f.layoutMode==='NONE') continue;
    if(f.children&&f.children.length>=2) gaps[R(f.itemSpacing)]=(gaps[R(f.itemSpacing)]||0)+1;
    for(const v of [f.paddingTop,f.paddingRight,f.paddingBottom,f.paddingLeft]){
      const q=R(v); if(q>0) pads[q]=(pads[q]||0)+1;
    }
  }
}
const sort=o=>Object.entries(o).sort((a,b)=>b[1]-a[1]);
return {gaps:sort(gaps).slice(0,15), pads:sort(pads).slice(0,15)};
```

**Read the base off the histogram before proposing a scale.** Dominant values of 2, 6, 10 mean a 2px base; 8, 16, 24 mean an 8px grid. Then measure what proportion of gaps and paddings fall outside the candidate scale — **padding is usually the worse of the two and is usually ignored.**

## 4 · Fractional type audit

Separates deliberate half-steps from scale artifacts, and shows where each lives so thumbnails are not mistaken for defects.

```js
const dist={};
for(const p of figma.root.children){
  if(/Deprecated|Archive/i.test(p.name)) continue;
  await figma.setCurrentPageAsync(p);
  for(const t of p.findAllWithCriteria({types:['TEXT']})){
    const s=t.fontSize;
    if(typeof s!=='number'||Math.abs(s-Math.round(s))<0.001) continue;
    const isHalf=Math.abs(s*2-Math.round(s*2))<0.001;
    const k=Math.round(s*1000)/1000;
    dist[k]=dist[k]||{size:k,half:isHalf,count:0,parents:{}};
    dist[k].count++;
    const par=t.parent?t.parent.name:'-';
    dist[k].parents[par]=(dist[k].parents[par]||0)+1;
  }
}
return Object.values(dist).sort((a,b)=>b.count-a.count);
```

Half-steps are almost always intentional. Non-half values are artifacts — divide by the suspected scale factor to confirm (`11.585 / 0.7723 = 15`).

## 5 · Variable binding by role

Bind by what a colour *means* in context, not by its hex. Three maps, chosen by node type.

Build the three maps from the file's own variable names and resolved values — the keys below are placeholders.

```js
const TEXT={'<ink hex>':'<ink token>','<muted hex>':'<secondary token>','#ffffff':'<inverse token>'};
const SHAPE={'#ffffff':'<surface token>','<canvas hex>':'<canvas token>'};
const STROKE={'<border hex>':'<border token>'};

const vars=await figma.variables.getLocalVariablesAsync('COLOR');
const V=n=>vars.find(v=>v.name===n);
const bind=(node,prop,map)=>{
  const arr=node[prop];
  if(!Array.isArray(arr)||!arr.length) return 0;
  let hits=0;
  const next=arr.map(p=>{
    if(p.type!=='SOLID'||!p.color) return p;
    if(p.boundVariables&&p.boundVariables.color) return p;   // never re-bind
    const v=V(map[hex(p.color)]); if(!v) return p;
    hits++; return figma.variables.setBoundVariableForPaint(p,'color',v);
  });
  if(hits) node[prop]=next;
  return hits;
};
// then per node: TEXT nodes use TEXT, others use SHAPE; strokes always STROKE
```

**Resolve aliases before building the map** — a semantic variable may point at a primitive several hops away, and you need its final value to match hexes against.

## 6 · Auto Layout conversion with safety net

The safety net is the point. Never convert without it.

```js
const R=n=>Math.round(n);
const before=[...f.children].map(k=>({id:k.id,x:R(k.x),y:R(k.y),w:R(k.width)}));
const fw=R(f.width), fh=R(f.height);
try{
  f.layoutMode='VERTICAL';
  f.primaryAxisSizingMode='FIXED'; f.counterAxisSizingMode='FIXED';
  f.itemSpacing=gap;
  f.paddingTop=padT; f.paddingBottom=padB; f.paddingLeft=padL; f.paddingRight=padR;
  f.counterAxisAlignItems=align;              // 'MIN' | 'CENTER' | 'MAX'

  for(const k of backgrounds){                 // full-bleed children stay put
    k.layoutPositioning='ABSOLUTE';
    const b=before.find(z=>z.id===k.id); if(b){k.x=b.x;k.y=b.y;}
  }
  const inner=fw-padL-padR;
  for(const k of f.children){
    if(k.layoutPositioning==='ABSOLUTE') continue;
    const b=before.find(z=>z.id===k.id); if(!b) continue;
    k.layoutSizingHorizontal = (b.w>=inner-1)?'FILL':'FIXED';
  }
  const drift=f.children.some(k=>{const b=before.find(z=>z.id===k.id);
    return !b||Math.abs(R(k.x)-b.x)>1||Math.abs(R(k.y)-b.y)>1;});
  if(drift||R(f.width)!==fw||R(f.height)!==fh){
    f.layoutMode='NONE';
    for(const b of before){const k=f.children.find(z=>z.id===b.id);
      if(k){k.layoutPositioning='AUTO'; k.x=b.x; k.y=b.y;}}
    f.resize(fw,fh);
    reverted++;
  } else converted++;
}catch(e){ /* the throw already rolled back */ }
```

**Detecting the plan before committing:** sort children on the main axis, reject if any gap is negative (overlap) or if gaps vary by more than ~1.5px, derive padding from the bounding box, and pick `counterAxisAlignItems` from whether children share a start edge or a centre. If no plan fits either axis, it is a two-dimensional composition — leave it and record why.

## 7 · List-run detector

The highest-yield automated conversion: repeated rows and cards, which is most of what panes contain.

```js
const SCALE=[4,8,12,16,20,24,32,48,64];
const snap=g=>SCALE.reduce((a,b)=>Math.abs(b-g)<Math.abs(a-g)?b:a);

const sorted=[...C.children].filter(k=>k.visible!==false).sort((a,b)=>a.y-b.y);
let i=0;
while(i<sorted.length){
  let j=i+1; const gaps=[];
  while(j<sorted.length){
    const a=sorted[j-1], b=sorted[j];
    const sameX=Math.abs(R(a.x)-R(b.x))<=1;
    const sameW=Math.abs(R(a.width)-R(b.width))<=2;
    const gp=b.y-(a.y+a.height);
    if(!sameX||!sameW||gp<0||gp>40) break;
    if(gaps.length && Math.abs(gp-gaps[0])>2) break;
    gaps.push(gp); j++;
  }
  const run=sorted.slice(i,j);
  if(run.length>=3){
    const idx=C.children.indexOf(run[0]);
    const wrap=figma.createFrame();
    wrap.name='auto · list run'; wrap.fills=[]; wrap.clipsContent=false;
    C.insertChild(idx,wrap);
    wrap.layoutMode='VERTICAL';
    wrap.itemSpacing=snap(gaps.reduce((s,v)=>s+v,0)/gaps.length);
    wrap.primaryAxisSizingMode='AUTO'; wrap.counterAxisSizingMode='AUTO';
    for(const k of run) wrap.appendChild(k);
    wrap.layoutSizingHorizontal='FIXED'; wrap.resize(R(run[0].width),wrap.height);
    for(const k of wrap.children) k.layoutSizingHorizontal='FILL';
    wrap.x=R(run[0].x); wrap.y=R(run[0].y);
  }
  i = j>i ? j : i+1;
}
```

Run it for `VERTICAL` first, then again for `HORIZONTAL` with x/y and width/height swapped — that picks up toolbars and pill rows.

## 8 · Nested wrapper build

For hand-conversion where gaps genuinely vary. Build inner wrappers first so parents size correctly.

```js
const mk=(parent,name,axis,gap,align)=>{
  const f=figma.createFrame();
  f.name=name; f.fills=[]; f.clipsContent=false;
  parent.appendChild(f);
  f.layoutMode=axis; f.itemSpacing=gap;
  f.counterAxisAlignItems=align||'MIN';
  f.primaryAxisSizingMode='AUTO'; f.counterAxisSizingMode='AUTO';
  return f;
};
const headGrp = mk(F,'auto · headline + proof','VERTICAL',12,'CENTER');
headGrp.appendChild(headline); headGrp.appendChild(proof);
const textGrp = mk(F,'auto · text','VERTICAL',16,'CENTER');
textGrp.appendChild(greeting); textGrp.appendChild(headGrp);
// …then set the outermost to FIXED width and position it
```

**Name wrappers with a consistent prefix** (`auto · …`). It makes them findable, removable and obviously generated — and it lets you re-run a conversion idempotently by unwrapping first:

```js
for(const o of F.children.filter(x=>/^auto ·/.test(x.name||''))){
  for(const k of [...o.children]) F.appendChild(k);
  o.remove();
}
```
