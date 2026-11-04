'use strict';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const progressBar = document.getElementById('scroll-progress');
let scrollQueued = false;
function measureScroll(){
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  if(progressBar)progressBar.style.transform = `scaleX(${Math.max(0,Math.min(1,window.scrollY/max))})`;
  document.body.classList.toggle('has-scrolled', window.scrollY > 24);
  scrollQueued = false;
}
window.addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(measureScroll)}},{passive:true});
window.addEventListener('resize',measureScroll,{passive:true});measureScroll();

const revealEls=[...document.querySelectorAll('.reveal')];
if(reducedMotion || !('IntersectionObserver' in window)) revealEls.forEach(el=>el.classList.add('visible'));
else {const revealObserver=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}},{threshold:0.09,rootMargin:'0px 0px -24px 0px'});revealEls.forEach(el=>revealObserver.observe(el));}

const checkpoints=[
 {id:'T0',date:'05 MARCH 2026',title:'Starting with a source-grounded report.',body:"The initial report summarizes the disruption to the Strait of Hormuz, while distinguishing statements by Iranian officials from U.S. Central Command's position."},
 {id:'T1',date:'06 MARCH 2026',title:'Refining the account as reporting develops.',body:'New coverage brings changes in how shipping pressure and unsafe navigation are described. Some edits refine wording rather than correcting a false claim.'},
 {id:'T2',date:'10 MARCH 2026',title:'Linking new risks to the reporting.',body:'The report incorporates more specific coverage of navigation risks and international responses. Analysts can inspect sources supporting descriptions such as “unsafe for navigation.”'},
 {id:'T3',date:'19 MARCH 2026',title:'Following continued shipping disruption.',body:'The report carries forward evidence about serious operational disruption while preserving attribution to different official statements.'},
 {id:'T4',date:'29 MARCH 2026',title:'Making room for a more nuanced account.',body:'Later reporting describes three vessels reportedly blocked and conditional passage for some non-hostile ships. The update separates restrictions from claims that the waterway is simply open or closed.'}
];
const timelineButtons=[...document.querySelectorAll('.timeline-item')];
function showCheckpoint(index){
 const x=checkpoints[index];if(!x)return;
 timelineButtons.forEach((b,i)=>{const active=i===index;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
 for(const [key,val] of [['story-id',x.id],['story-date',x.date],['story-title',x.title],['story-body',x.body]])document.getElementById(key).textContent=val;
 const image=document.querySelector('#checkpoint-figure img');const btn=document.getElementById('checkpoint-figure');
 if(image && btn){const file=`./assets/screenshots/hormuz_t${index}.webp`;image.src=file;image.alt=`CEDAR Living Report, Strait of Hormuz ${x.id} checkpoint, ${x.date}; report and supporting evidence.`;btn.dataset.fullImage=file;btn.dataset.caption=`CEDAR Living Report — original ${x.id} screenshot, ${x.date}.`;}
}
timelineButtons.forEach(b=>b.addEventListener('click',()=>showCheckpoint(Number(b.dataset.t))));
showCheckpoint(4);

const dialogueFrames={
 ask:{label:'THE INFORMATION-SEEKING DIALOGUE',heading:"Ask what the report doesn't yet explain.",description:'Ask how the Hormuz crisis affects international energy and shipping.',img:'p06_1.webp',caption:'CEDAR assistant answering a question about the Hormuz crisis and Japan’s energy response.',alt:'CEDAR assistant answering a question about the Hormuz situation and Japanese energy measures.'},
 review:{label:'ANSWER REVIEW & EVIDENCE',heading:'Look closely at uncertain or unsupported answers.',description:'Inspect flagged claims and the source evidence behind the answer.',img:'p07_1.webp',caption:'Answer review with unsupported content flagged alongside evidence.',alt:'A BENGAL assistant answer displaying an audit section with an unsupported claim highlighted.'},
 remember:{label:'CONVERSATION TAKEAWAYS',heading:'Carry forward useful context.',description:'Retrieve useful context from earlier turns.',img:'p09_1.webp',caption:'BENGAL conversation memory interface.',alt:'MemGuard memory panel displaying categorized stored conversation information.'},
 incorporate:{label:'ANALYST-APPROVED REPORT UPDATES',heading:'Make the final report an informed choice.',description:'Add a reviewed finding only when the analyst approves it.',img:'p11_1.webp',caption:'A new report checkpoint indicating a conversation-derived addition.',alt:'A BENGAL report with version history and a highlighted addition from the analyst conversation.'}
};
const order=['ask','review','remember','incorporate'];
const dialogueTabs=[...document.querySelectorAll('.dialogue-tab')];
function setDialogue(key){const d=dialogueFrames[key];if(!d)return;
 dialogueTabs.forEach(b=>{const selected=b.dataset.panel===key;b.classList.toggle('active',selected);b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1});
 document.getElementById('dialogue-content').setAttribute('aria-labelledby','dialogue-tab-'+key);
 document.getElementById('dialogue-label').textContent=d.label;
 document.getElementById('dialogue-heading').textContent=d.heading;
 document.getElementById('dialogue-description').textContent=d.description;
 const idx=order.indexOf(key);document.getElementById('dialogue-count').textContent=`0${idx+1} / 04`;
 document.getElementById('count-progress').style.width=`${(idx+1)*25}%`;
 const img=document.getElementById('dialogue-image');img.src='./assets/screenshots/'+d.img;img.alt=d.alt;
 const btn=document.getElementById('dialogue-image-button');btn.dataset.fullImage=img.src;btn.dataset.caption=d.caption;
}
dialogueTabs.forEach(btn=>{btn.addEventListener('click',()=>setDialogue(btn.dataset.panel));btn.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;e.preventDefault();const curr=order.indexOf(btn.dataset.panel);const dest=e.key==='Home'?0:e.key==='End'?3:(curr+(e.key==='ArrowRight'?1:3))%4;setDialogue(order[dest]);dialogueTabs[dest].focus();});});setDialogue('ask');

const imageDialog=document.getElementById('image-dialog');
const largeImg=document.getElementById('dialog-large-image');
document.querySelectorAll('[data-full-image]').forEach(b=>b.addEventListener('click',()=>{largeImg.src=b.dataset.fullImage;largeImg.alt=b.querySelector('img')?.alt||'';document.getElementById('dialog-caption').textContent=b.dataset.caption||'';if(typeof imageDialog.showModal==='function')imageDialog.showModal();}));
document.getElementById('dialog-close').addEventListener('click',()=>imageDialog.close());
imageDialog.addEventListener('click',e=>{if(e.target===imageDialog)imageDialog.close();});
imageDialog.addEventListener('close',()=>{largeImg.removeAttribute('src')});

const menu=document.getElementById('menu-toggle');const mobileNav=document.getElementById('mobile-navigation');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');mobileNav.hidden=!open});
mobileNav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobileNav.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation')}));
const navLinks=[...document.querySelectorAll('.desktop-nav a')];
if('IntersectionObserver' in window){const activeObserver=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;navLinks.forEach(a=>a.classList.toggle('is-current',a.hash==='#'+entry.target.id));}},{rootMargin:'-30% 0px -55% 0px',threshold:0});document.querySelectorAll('main section[id]').forEach(s=>activeObserver.observe(s));}
