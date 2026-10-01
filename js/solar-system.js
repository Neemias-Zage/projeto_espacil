// Experiência interactiva do Sistema Solar
const state={selected:null,paused:false,zoom:1,theme:"space",returnFocus:null};
const $=s=>document.querySelector(s), stage=$("#stage"), panel=$("#panel");
const tour=["sun","mercury","venus","earth","moon","mars","jupiter","saturn","uranus","neptune"];
const order=["mercury","venus","earth","mars","jupiter","saturn","uranus","neptune"];
function initializeSolarSystem(){
  stage.insertAdjacentHTML("beforeend",order.map((id,i)=>{const p=planets[id];
    const visualSize=(p.size*1.3).toFixed(2);
    const orbitSeconds=Math.round(p.secs*1.25);
    return `<div class="orbit" data-id="${id}" style="--o:${p.orbit}%;--t:${orbitSeconds}s;--a:${-(i*37)%orbitSeconds}s;--d:${visualSize}vmin"><button class="planet ${id}" data-id="${id}" style="--d:${visualSize}vmin" aria-label="${p.nome}" aria-pressed="false"><i class="body"></i><em>${p.nome}</em></button>${id==="earth"?'<span class="moonorbit"><button class="moon" type="button" aria-label="Lua: ver informação e activar modo nocturno"></button></span>':""}</div>`}).join(""));
  $("#planetnav").innerHTML=tour.map(id=>`<button data-id="${id}" aria-pressed="false">${planets[id].nome}</button>`).join("");
}
function selectPlanet(id){
  const p=planets[id]; if(!p) return;
  if(!panel.classList.contains("open")) state.returnFocus=document.activeElement;
  state.selected=id; document.body.classList.add("focus");
  const host=id==="moon"?"earth":id;
  document.querySelectorAll(".orbit,.planet,#sun").forEach(e=>{const selected=e.dataset.id===host;e.classList.toggle("sel",selected);if(e.matches("button"))e.setAttribute("aria-pressed",String(selected));});
  document.querySelector(".moon").classList.toggle("sel",id==="moon");
  document.querySelectorAll("#planetnav button").forEach(b=>{const selected=b.dataset.id===id;b.classList.toggle("on",selected);b.setAttribute("aria-pressed",String(selected));});
  $("#pn").textContent=p.nome; $("#pt").textContent=p.tipo; $("#pd").textContent=p.desc; $("#pm").textContent=p.luas;
  $("#pg").textContent=p.grav+" ("+p.gravRel+")"; $("#pk").textContent=p.dist;
  const sourceUrl=p.fonte.includes("IAU MPC")?"https://minorplanetcenter.net/":p.fonte.includes("Sky & Telescope")?"https://skyandtelescope.org/":"https://science.nasa.gov/solar-system/";
  $("#ps").innerHTML=`Fonte: <a href="${sourceUrl}" target="_blank" rel="noopener noreferrer">${p.fonte}</a> (contagens conforme a referência citada)`;
  panel.classList.add("open"); panel.setAttribute("aria-hidden","false"); panel.inert=false;
  if(panel.dataset.focused!=="true"){panel.dataset.focused="true";$("#pClose").focus();}
  setZoom(Math.max(state.zoom,id==="sun"?1.15:1.25));
  if(id==="sun"){setTheme("space");document.body.classList.add("sun-mode");}else document.body.classList.remove("sun-mode");
}
function closePanel(){
  const returnFocus=state.returnFocus;state.returnFocus=null;state.selected=null; document.body.classList.remove("focus","sun-mode"); panel.classList.remove("open"); panel.setAttribute("aria-hidden","true");panel.inert=true;panel.dataset.focused="false";
  document.querySelectorAll(".sel,#planetnav .on").forEach(e=>e.classList.remove("sel","on")); setZoom(1);
  document.querySelectorAll("[aria-pressed]").forEach(e=>e.setAttribute("aria-pressed","false"));
  if(returnFocus&&returnFocus.isConnected)returnFocus.focus();
}
function setZoom(z){state.zoom=Math.min(2.5,Math.max(.7,z)); stage.style.setProperty("--z",state.zoom);}
function setTheme(t){state.theme=t; document.body.classList.toggle("night",t==="night"); if(t==="night")document.body.classList.remove("sun-mode");const b=$("#bMoon");b.setAttribute("aria-pressed",String(t==="night"));b.setAttribute("aria-label",t==="night"?"Desactivar modo nocturno":"Activar modo nocturno");}
function onMoon(){if(state.selected==="moon")toggleNight();else{setTheme("night");selectPlanet("moon");}}
function toggleNight(){setTheme(state.theme==="night"?"space":"night");}
function togglePause(){state.paused=!state.paused; stage.classList.toggle("paused",state.paused); const b=$("#bPause"); b.innerHTML=`<i class="fa-solid ${state.paused?"fa-play":"fa-pause"}"></i>`; b.setAttribute("aria-label",state.paused?"Continuar movimento":"Pausar movimento");b.setAttribute("aria-pressed",String(state.paused));}
function step(d){const l=tour; selectPlanet(l[(l.indexOf(state.selected)+d+l.length)%l.length]);}
function initializeControls(){
  $("#bIn").onclick=()=>setZoom(state.zoom+.25); $("#bOut").onclick=()=>setZoom(state.zoom-.25);
  $("#bReset").onclick=()=>{closePanel();setTheme("space");}; $("#bPause").onclick=togglePause; $("#bMoon").onclick=toggleNight;
  $("#bFull").onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen();
  $("#bHelp").onclick=()=>{const help=$("#help"),show=!help.classList.contains("show");help.classList.toggle("show",show);$("#bHelp").setAttribute("aria-expanded",String(show));};
  $("#pClose").onclick=closePanel; $("#pPrev").onclick=()=>step(-1); $("#pNext").onclick=()=>step(1);
}
function initializePlanetInteractions(){
  stage.addEventListener("click",e=>{
    if(e.target.closest(".moon")){onMoon();return;}
    const b=e.target.closest(".planet,#sun"); if(b) selectPlanet(b.dataset.id);
  });
  $("#planetnav").addEventListener("click",e=>{const b=e.target.closest("button"); if(b)selectPlanet(b.dataset.id);});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&state.selected)closePanel(); if(state.selected&&e.key==="ArrowRight")step(1); if(state.selected&&e.key==="ArrowLeft")step(-1);});
}
function playLaunchArrival(){
  try {
    if(sessionStorage.getItem("solar-arrival")!=="1")return;
    sessionStorage.removeItem("solar-arrival");
  } catch (_) { return; }
  if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  document.body.classList.add("launch-arrival");
  setTimeout(()=>document.body.classList.remove("launch-arrival"),1400);
}
document.addEventListener("DOMContentLoaded",()=>{initializeSolarSystem();initializeControls();initializePlanetInteractions();panel.inert=true;playLaunchArrival();});
