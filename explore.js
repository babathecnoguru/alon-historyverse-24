/* ALON HISTORYVERSE 24 — Explore/Search Engine V100 */
import { getArticles, searchArticles } from './articles.js';
import { getCivilizations, getCountries, getHeritage, getExploreData } from './data.js';

const state={initialized:false,query:'',results:[]};
function allItems(){
  const articles=getArticles?.()||[];
  const safe=a=>Array.isArray(a)?a:[];
  return [...safe(getExploreData?.()),...safe(getCivilizations?.()),...safe(getCountries?.()),...safe(getHeritage?.()),...articles];
}
export function initExploreSystem(){
  if(state.initialized)return;
  state.initialized=true;
  const input=document.querySelector('[data-search-input],#search-input,input[type="search"]');
  const form=input?.closest('form');
  form?.addEventListener('submit',e=>{e.preventDefault();runExploreSearch(input.value);});
  window.ALON_EXPLORE=window.ALON_EXPLORE||{};
  window.ALON_EXPLORE.search=runExploreSearch;
}
export function runExploreSearch(query=''){
  state.query=String(query).trim();
  if(!state.query) state.results=allItems();
  else {
    const articles=searchArticles?.(state.query)||[];
    const term=state.query.toLowerCase();
    const generic=allItems().filter(x=>JSON.stringify(x).toLowerCase().includes(term));
    state.results=[...new Map([...articles,...generic].map(x=>[x.id||JSON.stringify(x),x])).values()];
  }
  document.dispatchEvent(new CustomEvent('alon:search',{detail:{query:state.query,results:state.results}}));
  return state.results;
}
export function getExploreState(){return {...state,results:[...state.results]};}
export function renderExploreResults(results=state.results,target='[data-explore-results]'){
  const el=document.querySelector(target); if(!el)return;
  el.innerHTML=results.map(x=>`<a class="content-card" href="${x.url||x.href||'#'}"><h3>${x.title||x.name||'Untitled'}</h3><p>${x.description||x.summary||''}</p></a>`).join('')||'<p>No results found.</p>';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initExploreSystem,{once:true});else initExploreSystem();
