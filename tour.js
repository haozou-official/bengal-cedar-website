'use strict';
// DOM-anchored guided tour. Spotlight coordinates are measured from real screenshot containers.
// It never pretends that the snapshots are a live interactive model endpoint.
const steps=[
 {eyebrow:'THE LIVING REPORT',title:'A report that stays current.',desc:'One evolving report, with the evidence beside it.',target:'#overview-figure',region:[.015,.16,.97,.72],figure:'#overview-figure .image-button'},
 {eyebrow:'EVOLVING TIMELINE',title:'Five dates. One report.',desc:'This is March 10 (T2). Move between T0 and T4 to see the report respond to new evidence.',target:'.timeline-list',region:[0,.01,1,.98],checkpoint:2,figure:'#checkpoint-figure'},
 {eyebrow:'SELECTIVE REVISION',title:'Change only what needs changing.',desc:'At T4, blue shows new wording and red shows what it replaces. Supported claims remain.',target:'#checkpoint-figure',region:[.12,.29,.47,.59],checkpoint:4,figure:'#checkpoint-figure'},
 {eyebrow:'TRACEABLE SOURCES',title:'Follow the evidence.',desc:'Inspect the source article and the passage behind a claim.',target:'.evidence-visual .image-button',region:[.18,.13,.65,.76],figure:'.evidence-visual .image-button'},
 {eyebrow:'MULTILINGUAL REPORTING',title:'Read beyond English.',desc:'Keep Arabic-language evidence linked to the English report.',target:'.language-visual .image-button',region:[.05,.1,.9,.8],figure:'.language-visual .image-button'},
 {eyebrow:'VISUAL EVIDENCE',title:'See the context—and its limits.',desc:'Review related images without treating them as proof of every claim.',target:'.visual-panel-main .image-button',region:[.08,.1,.84,.8],figure:'.visual-panel-main .image-button'},
 {eyebrow:'ASK',title:'Ask the report.',desc:'Explore a question about the event and its implications.',target:'#dialogue-image-button',region:[.08,.07,.84,.86],dialogue:'ask',figure:'#dialogue-image-button'},
 {eyebrow:'REVIEW',title:'Inspect the answer.',desc:'Check flagged claims against the available evidence.',target:'#dialogue-image-button',region:[.08,.07,.84,.86],dialogue:'review',figure:'#dialogue-image-button'},
 {eyebrow:'REMEMBER',title:'Keep useful context.',desc:'Bring relevant conversation takeaways into later analysis.',target:'#dialogue-image-button',region:[.08,.07,.84,.86],dialogue:'remember',figure:'#dialogue-image-button'},
 {eyebrow:'INCORPORATE',title:'The analyst decides.',desc:'Add a reviewed finding to the report only when the analyst approves.',target:'#dialogue-image-button',region:[.08,.07,.84,.86],dialogue:'incorporate',figure:'#dialogue-image-button'}
];
document.documentElement.dataset.cedarTourVersion='2.4.0';
const layer=document.getElementById('tour-layer');
const focus=document.getElementById('tour-focus');const ring=document.getElementById('tour-ring');const card=document.getElementById('tour-card');
const count=document.getElementById('tour-count');const eyebrow=document.getElementById('tour-eyebrow');const heading=document.getElementById('tour-heading');const copy=document.getElementById('tour-copy');
const prev=document.getElementById('tour-prev');const next=document.getElementById('tour-next');const dots=document.getElementById('tour-dots');const skip=document.getElementById('tour-skip');
const restart=document.getElementById('tour-restart');
let running=false,current=0,positionFrame=0,token=0,lastFocus=null,previousFocus=null;
const prefersReduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const imageLink=document.createElement('button');imageLink.type='button';imageLink.className='tour-full';imageLink.textContent='View full screenshot ↗';copy.after(imageLink);
steps.forEach((_,i)=>{const d=document.createElement('span');d.className='tour-dot';d.setAttribute('aria-hidden','true');dots.appendChild(d)});
function getImageArea(node){
 const img=node?.matches('img')?node:node?.querySelector('img');
 if(!img)return node?.getBoundingClientRect()||null;
 const r=img.getBoundingClientRect();
 // Images in this tour are rendered with object-fit: contain, or natural aspect ratio.
 const s=getComputedStyle(img);if(s.objectFit==='contain'&&img.naturalWidth&&img.naturalHeight){
   const intrinsic=img.naturalWidth/img.naturalHeight,box=r.width/r.height;
   if(box>intrinsic){const width=r.height*intrinsic;return {x:r.left+(r.width-width)/2,y:r.top,width,height:r.height,left:r.left+(r.width-width)/2,top:r.top,right:r.left+(r.width+width)/2,bottom:r.bottom}}
   const height=r.width/intrinsic;return {x:r.left,y:r.top+(r.height-height)/2,width:r.width,height,left:r.left,top:r.top+(r.height-height)/2,right:r.right,bottom:r.top+(r.height+height)/2};
 }
 return r;
}
function computeRect(){const step=steps[current],target=document.querySelector(step.target);if(!target)return null;const r=getImageArea(target);if(!r||r.width<10||r.height<10)return null;
 const [x,y,w,h]=step.region||[0,0,1,1];let l=r.left+r.width*x,t=r.top+r.height*y,ww=r.width*w,hh=r.height*h;
 const pad=5;l=Math.max(6,l-pad);t=Math.max(6,t-pad);ww=Math.min(innerWidth-l-6,ww+pad*2);hh=Math.min(innerHeight-t-8,hh+pad*2);
 if(ww<25||hh<25)return null;return {l,t,w:ww,h:hh};}
function geometry(el,r){for(const [k,v] of Object.entries({left:r.l+'px',top:r.t+'px',width:r.w+'px',height:r.h+'px'}))el.style[k]=v;}
function place(){if(!running)return;const r=computeRect();if(!r)return;lastFocus=r;geometry(focus,r);geometry(ring,r);
 if(innerWidth<=640)return;
 const W=Math.min(360,innerWidth-28),H=card.offsetHeight||270,margin=20,gap=22;
 const candidates=[
  {x:r.l+r.w+gap,y:r.t-8},
  {x:r.l-W-gap,y:r.t-8},
  {x:r.l,y:r.t+r.h+gap},
  {x:r.l,y:r.t-H-gap},
 ];
 let chosen=null;for(const p of candidates){const y=Math.max(12,Math.min(innerHeight-H-12,p.y));if(p.x>=margin&&p.x+W<=innerWidth-margin&&Math.abs(y-p.y)<65){chosen={x:p.x,y};break}}
 if(!chosen){let x=r.l+r.w/2>innerWidth/2?margin:innerWidth-W-margin;let y=Math.min(innerHeight-H-12,Math.max(12,r.t+r.h/2-H/2));chosen={x,y}}
 card.style.left=chosen.x+'px';card.style.top=chosen.y+'px';card.style.bottom='auto';
}
function scrollToStep(){const node=document.querySelector(steps[current].target);if(!node)return;const anchor=node;
 const rect=node.getBoundingClientRect();if(rect.top>95&&rect.bottom<innerHeight-(innerWidth<=640?330:45)){requestAnimationFrame(place);return}
 anchor.scrollIntoView({behavior:prefersReduced?'instant':'smooth',block:innerWidth<=640?'start':'center'});
 setTimeout(place,prefersReduced?50:360);setTimeout(place,prefersReduced?100:720);
}
function showStep(i){if(!running)return;current=Math.max(0,Math.min(steps.length-1,i));const step=steps[current];token++;
 if(step.checkpoint!==undefined && typeof showCheckpoint==='function')showCheckpoint(step.checkpoint);
 if(step.dialogue && typeof setDialogue==='function')setDialogue(step.dialogue);
 count.textContent=String(current+1).padStart(2,'0')+' / '+String(steps.length).padStart(2,'0');eyebrow.textContent=step.eyebrow;heading.textContent=step.title;copy.textContent=step.desc;
 [...dots.children].forEach((d,k)=>d.classList.toggle('is-current',k===current));prev.disabled=current===0;next.innerHTML=current===steps.length-1?'Finish <span aria-hidden="true">✓</span>':'Next <span aria-hidden="true">→</span>';
 scrollToStep();requestAnimationFrame(()=>{place();card.focus({preventScroll:true})});
}
function startTour(){if(running)return;previousFocus=document.activeElement;running=true;layer.hidden=false;layer.setAttribute('aria-hidden','false');restart.hidden=true;document.body.classList.add('tour-active');history.replaceState(null,'',location.pathname+location.search+'#tour');showStep(0);}
function endTour(){if(!running)return;running=false;layer.hidden=true;layer.setAttribute('aria-hidden','true');restart.hidden=false;document.body.classList.remove('tour-active');if(location.hash==='#tour')history.replaceState(null,'',location.pathname+location.search);(previousFocus?.isConnected?previousFocus:restart).focus({preventScroll:true});}
function openFigure(){const button=document.querySelector(steps[current].figure);if(!button)return;const dialog=document.getElementById('image-dialog');const large=document.getElementById('dialog-large-image');const src=button.dataset.fullImage||button.querySelector('img')?.src;if(!src)return;large.src=src;large.alt=button.querySelector('img')?.alt||'';document.getElementById('dialog-caption').textContent=button.dataset.caption||stepCaption();if(!dialog.open)dialog.showModal();}
function stepCaption(){return `${steps[current].title} — original CEDAR demonstration screenshot.`}
document.getElementById('tour-start').addEventListener('click',startTour);
document.getElementById('tour-again').addEventListener('click',startTour);
restart.addEventListener('click',startTour);skip.addEventListener('click',endTour);prev.addEventListener('click',()=>showStep(current-1));next.addEventListener('click',()=>current===steps.length-1?endTour():showStep(current+1));imageLink.addEventListener('click',openFigure);
window.addEventListener('scroll',()=>{if(running){cancelAnimationFrame(positionFrame);positionFrame=requestAnimationFrame(place)}},{passive:true});window.addEventListener('resize',()=>{if(running)requestAnimationFrame(place)},{passive:true});
document.addEventListener('keydown',e=>{if(!running || document.getElementById('image-dialog')?.open)return;
 if(e.key==='Escape'){e.preventDefault();endTour()}else if(e.key==='ArrowRight'){e.preventDefault();current===steps.length-1?endTour():showStep(current+1)}else if(e.key==='ArrowLeft'){e.preventDefault();showStep(current-1)}else if(e.key==='Tab'){
  const eligible=[skip,imageLink,prev,next].filter(n=>!n.disabled),pos=eligible.indexOf(document.activeElement);if(!e.shiftKey&&pos===eligible.length-1){e.preventDefault();eligible[0].focus()}else if(e.shiftKey&&(pos<=0)){e.preventDefault();eligible[eligible.length-1].focus()}
 }
});

// CEDAR v2.6 — Guided Tour starts automatically.
//
// Direct section links (#report, #dialogue, etc.)
// remain accessible without interrupting navigation.
//
// Visitors may skip at any time and explore freely.

function autoStartTourOnEntry() {

  if (location.hash && location.hash !== '#tour') {
    return;
  }

  window.setTimeout(() => {
    if (!running) {
      startTour();
    }
  }, 450);

}

if (document.readyState === 'loading') {

  document.addEventListener(
    'DOMContentLoaded',
    autoStartTourOnEntry,
    { once: true }
  );

} else {

  autoStartTourOnEntry();

}

