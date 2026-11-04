'use strict';
const controls=[...document.querySelectorAll('.research-toggle')];
function setOpen(button,expand){
 const panel=document.getElementById(button.getAttribute('aria-controls'));if(!panel)return;
 button.setAttribute('aria-expanded',String(expand));button.closest('.research-entry').classList.toggle('is-open',expand);panel.hidden=!expand;
}
controls.forEach(button=>button.addEventListener('click',()=>{
 const expanding=button.getAttribute('aria-expanded')!=='true';
 controls.forEach(b=>setOpen(b,false));setOpen(button,expanding);
}));
