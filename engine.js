/* ALON HISTORYVERSE 24 — Compatibility Engine V100 */
(() => {
  'use strict';
  if(window.ALON_HISTORYVERSE_ENGINE)return;
  const api={version:'V100',ready:false};
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  function mark(){document.documentElement.dataset.historyverse='ready';document.body?.classList.add('historyverse-ready');api.ready=true;}
  function bindCards(){
    $$('[data-href],[data-url],[data-card-url]').forEach(card=>{
      if(card.dataset.alonBound==='1')return;
      const url=card.dataset.href||card.dataset.url||card.dataset.cardUrl||card.querySelector('a[href]')?.getAttribute('href');
      if(!url)return;
      card.dataset.alonBound='1';card.setAttribute('role',card.getAttribute('role')||'link');card.tabIndex=card.tabIndex<0?0:card.tabIndex;
      card.addEventListener('click',e=>{if(e.target.closest('a,button,input,select,textarea'))return;location.href=url;});
      card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();location.href=url;}});
    });
  }
  function init(){bindCards();mark();document.dispatchEvent(new CustomEvent('alon:ready',{detail:api}));}
  api.init=init;api.bindCards=bindCards;window.ALON_HISTORYVERSE_ENGINE=api;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
