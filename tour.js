'use strict';
// DOM-anchored guided tour. Spotlight coordinates are measured from real screenshot containers.
// It never pretends that the snapshots are a live interactive model endpoint.
const steps=[
 {eyebrow:'LIVING REPORT',title:'One report, connected to its evidence.',desc:'See the evolving report alongside its source material.',target:'#overview-figure',region:[.09,.32,.81,.52],figure:'#overview-figure .image-button'},

 {eyebrow:'REPLAY TIMELINE',title:'Five dates. One evolving report.',desc:'Use T0–T4 to revisit the report as evidence arrives.',target:'.timeline-list',region:[.03,.02,.94,.95],checkpoint:2,figure:'#checkpoint-figure'},

 {eyebrow:'SELECTIVE REVISION',title:'Update only what needs to change.',desc:'At T4, blue marks new wording; red marks what it replaced.',target:'#checkpoint-figure',region:[.145,.34,.345,.30],checkpoint:4,figure:'#checkpoint-figure'},

 {eyebrow:'SOURCE LIST',title:'Browse the evidence.',desc:'Each checkpoint has a source list analysts can inspect.',target:'.evidence-visual .image-button',region:[.04,.15,.92,.75],shot:'tour_hormuz_list.png',figure:'.evidence-visual .image-button'},

 {eyebrow:'SOURCE INSPECTION',title:'Open the original evidence.',desc:'Read provenance, linked statements, and highlighted source text.',target:'.evidence-visual .image-button',region:[.035,.16,.93,.78],shot:'tour_hormuz_open.png',figure:'.evidence-visual .image-button'},

 {eyebrow:'BEYOND ENGLISH',title:'Sources are not limited to English.',desc:'An Arabic source appears beside the Ceuta report.',target:'.language-visual .image-button',region:[.585,.585,.385,.13],shot:'p04_2.webp?v=20261105-hd-refresh',figure:'.language-visual .image-button'},

 {eyebrow:'SOURCE TO SUMMARY',title:'Follow the multilingual evidence into the report.',desc:'The source remains linked to the specific statement it supports.',target:'.language-visual .image-button',region:[.035,.205,.93,.155],shot:'tour_ceuta_open.png',arrow:true,figure:'.language-visual .image-button'},

 {eyebrow:'VISUAL EVIDENCE',title:'Images provide context, not automatic proof.',desc:'Inspect the visual evidence panel and what it can establish.',target:'.visual-panel-main .image-button',region:[.585,.27,.38,.61],figure:'.visual-panel-main .image-button'},

 {eyebrow:'ASK',title:'Begin with a question.',desc:'The analyst types a question before requesting an answer.',target:'#dialogue-image-button',region:[.03,.34,.94,.56],dialogue:'ask',shot:'tour_ask_typed.png',figure:'#dialogue-image-button'},

 {eyebrow:'GROUNDED RESPONSE',title:'Read the assistant’s answer.',desc:'The response draws on the report and its cited evidence.',target:'#dialogue-image-button',region:[.07,.40,.87,.42],dialogue:'ask',figure:'#dialogue-image-button'},

 {eyebrow:'REVIEW THE ANSWER',title:'Inspect evidence and conflicting claims.',desc:'Review the response check, confidence warning, and evidence support.',target:'#dialogue-image-button',region:[.055,.30,.89,.44],dialogue:'review',figure:'#dialogue-image-button'},

 {eyebrow:'REMEMBER',title:'Carry forward relevant findings.',desc:'Conversation takeaways remain organized for later analysis.',target:'#dialogue-image-button',region:[.145,.27,.71,.49],dialogue:'remember',figure:'#dialogue-image-button'},

 {eyebrow:'INCORPORATE',title:'The analyst makes the final decision.',desc:'Only approved information enters the living report.',target:'#dialogue-image-button',region:[.195,.811,.78,.165],dialogue:'incorporate',figure:'#dialogue-image-button'}
];
document.documentElement.dataset.cedarTourVersion='2.9.1';
const layer=document.getElementById('tour-layer');
const focus=document.getElementById('tour-focus');const ring=document.getElementById('tour-ring');const card=document.getElementById('tour-card');
const count=document.getElementById('tour-count');const eyebrow=document.getElementById('tour-eyebrow');const heading=document.getElementById('tour-heading');const copy=document.getElementById('tour-copy');
const prev=document.getElementById('tour-prev');const next=document.getElementById('tour-next');const dots=document.getElementById('tour-dots');const skip=document.getElementById('tour-skip');
const restart=document.getElementById('tour-restart');
let running=false,current=0,positionFrame=0,token=0,lastFocus=null,previousFocus=null;
const prefersReduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

// CEDAR_FOCUSED_TOUR_V28
// Restore normal screenshots when the tour is skipped.

let activeTourShot = null;

function undoTourShot() {
  if (!activeTourShot) return;

  const {button, img, src, full, caption} = activeTourShot;
  img.onload=null;

  img.src = src;

  if (full === null)
    button.removeAttribute('data-full-image');
  else
    button.setAttribute('data-full-image', full);

  if (caption === null)
    button.removeAttribute('data-caption');
  else
    button.setAttribute('data-caption', caption);

  activeTourShot = null;
}

function setTourShot(step) {
  if (!step.shot) return;

  const button = document.querySelector(step.target);
  const img = button?.querySelector('img');

  if (!button || !img) return;

  activeTourShot = {
    button,
    img,
    src: img.getAttribute('src'),
    full: button.getAttribute('data-full-image'),
    caption: button.getAttribute('data-caption')
  };

  const path = './assets/screenshots/' + step.shot;

  img.onload=()=>{if(running && activeTourShot?.img===img && img.getAttribute('src')===path){
      scrollToStep();
      requestAnimationFrame(place);
    }
  };

  img.src = path;
  button.dataset.fullImage = path;
  button.dataset.caption =
    step.title + ' — CEDAR demonstration capture.';
}

// Evidence-to-summary directional arrow.
const tourArrow = document.createElementNS(
  'http://www.w3.org/2000/svg', 'svg'
);

tourArrow.classList.add('cedar-tour-arrow');
tourArrow.setAttribute('aria-hidden', 'true');

tourArrow.innerHTML = `
<defs>
  <marker id="cedar-arrow-tip" markerWidth="7"
    markerHeight="7" refX="5" refY="3.5" orient="auto">
    <path d="M0 0 L7 3.5 L0 7"
      fill="none" stroke="#e6fff1" stroke-width="1.6"/>
  </marker>
</defs>
<path id="cedar-tour-arrow-path"
  fill="none" stroke="#e6fff1" stroke-width="3"
  stroke-linecap="round"
  marker-end="url(#cedar-arrow-tip)"/>
`;

layer.insertBefore(tourArrow, card);
tourArrow.hidden=true; tourArrow.style.display='none';

function drawTourArrow() {
  const step = steps[current];

  tourArrow.hidden=!step.arrow; tourArrow.style.display=step.arrow?'block':'none';
  if(!step.arrow)return;

  const img = document.querySelector(step.target)
    ?.querySelector('img');

  if (!img) return;

  const r = getImageArea(img);

  const x1 = r.left + r.width * .56;
  const y1 = r.top + r.height * .53;
  const x2 = r.left + r.width * .56;
  const y2 = r.top + r.height * .29;

  tourArrow.setAttribute(
    'viewBox', `0 0 ${innerWidth} ${innerHeight}`
  );

  tourArrow.querySelector('#cedar-tour-arrow-path')
    .setAttribute(
      'd',
      `M ${x1} ${y1} Q ${x1 + 65} ${(y1 + y2) / 2} ${x2} ${y2}`
    );
}

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
function place(){if(!running)return;const r=computeRect();if(!r)return;lastFocus=r;geometry(focus,r);geometry(ring,r);drawTourArrow();
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
function scrollToStep(){
 const step=steps[current];
 const node=document.querySelector(step.target);
 if(!node)return;

 const r=getImageArea(node);
 if(!r)return;

 const [x,y,w,h]=step.region||[0,0,1,1];
 const cy=r.top+r.height*(y+h/2);

 const desired=innerWidth<=640
   ? innerHeight*.29
   : innerHeight*.46;

 const delta=cy-desired;

 if(Math.abs(delta)>25)
   window.scrollBy({
     top:delta,
     behavior:prefersReduced?'instant':'smooth'
   });

 setTimeout(place,prefersReduced?40:400);
 setTimeout(place,prefersReduced?90:820);
}
function showStep(i){if(!running)return;current=Math.max(0,Math.min(steps.length-1,i));const step=steps[current];token++;
 tourArrow.hidden=!step.arrow;
 tourArrow.style.display=step.arrow?'block':'none';
 if(step.checkpoint!==undefined && typeof showCheckpoint==='function')showCheckpoint(step.checkpoint);
 undoTourShot();
 if(step.dialogue && typeof setDialogue==='function')setDialogue(step.dialogue);
 setTourShot(step);
 count.textContent=String(current+1).padStart(2,'0')+' / '+String(steps.length).padStart(2,'0');eyebrow.textContent=step.eyebrow;heading.textContent=step.title;copy.textContent=step.desc;
 [...dots.children].forEach((d,k)=>d.classList.toggle('is-current',k===current));prev.disabled=current===0;next.innerHTML=current===steps.length-1?'Finish <span aria-hidden="true">✓</span>':'Next <span aria-hidden="true">→</span>';
 scrollToStep();requestAnimationFrame(()=>{place();card.focus({preventScroll:true})});
}
function startTour(){if(running)return;previousFocus=document.activeElement;running=true;layer.hidden=false;layer.setAttribute('aria-hidden','false');restart.hidden=true;document.body.classList.add('tour-active');history.replaceState(null,'',location.pathname+location.search+'#tour');showStep(0);}
function endTour(){if(!running)return;running=false;undoTourShot();tourArrow.hidden=true;tourArrow.style.display='none';layer.hidden=true;layer.setAttribute('aria-hidden','true');restart.hidden=false;document.body.classList.remove('tour-active');if(location.hash==='#tour')history.replaceState(null,'',location.pathname+location.search);(previousFocus?.isConnected?previousFocus:restart).focus({preventScroll:true});}
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

