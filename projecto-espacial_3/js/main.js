// Recursos partilhados e componentes do site
const LOGO="img/logo.png";
// Navegação, rodapé, estrelas e componentes partilhados
const NAV=[["index.html","Início","fa-house"],["sistema-solar.html","Sistema Solar","fa-sun"],["mini-game.html","Mini-game","fa-rocket"],["creditos.html","Créditos","fa-users"]];
function initializeChrome(){
  const page=document.body.dataset.page, nav=document.getElementById("nav"), foot=document.getElementById("footer");
  if(nav) nav.innerHTML=`<a class="brand" href="index.html"><img class="logo" src="${LOGO}" alt=""><span>SPACE PROJECT</span></a><nav aria-label="Principal">${NAV.map(([h,t,i])=>`<a href="${h}" ${h===page?'aria-current="page"':""}><i class="fa-solid ${i}"></i><span>${t}</span></a>`).join("")}</nav>`;
  if(foot) foot.innerHTML=`<strong>Projecto Espacial</strong><p>Colégio Pitruca — Semana do Espaço</p><p>12ª Classe · Turma B · Informática</p><div>${NAV.map(([h,t])=>`<a href="${h}">${t}</a>`).join("")}</div>`;
}
function initializeStars(){
  const c=document.getElementById("stars"); if(!c) return;
  const x=c.getContext("2d");
  function draw(){
    const ratio=window.devicePixelRatio||1;
    c.width=Math.round(innerWidth*ratio); c.height=Math.round(innerHeight*ratio);
    c.style.width=`${innerWidth}px`; c.style.height=`${innerHeight}px`;
    x.setTransform(ratio,0,0,ratio,0,0); x.clearRect(0,0,innerWidth,innerHeight);
    for(let i=0;i<Math.min(260,innerWidth/4);i++){
      const r=Math.random()**3*1.6+.3; x.globalAlpha=.25+Math.random()*.75;
      x.fillStyle=Math.random()<.15?"#a5b4fc":"#fff"; x.beginPath(); x.arc(Math.random()*innerWidth,Math.random()*innerHeight,r,0,7); x.fill();
    }
    x.globalAlpha=1;
  }
  draw();
  let resizeTimer;
  window.addEventListener("resize",()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(draw,120);},{passive:true});
}
function initializeReveal(){
  if(!("IntersectionObserver" in window)){document.querySelectorAll(".reveal").forEach(el=>el.classList.add("in"));return;}
  const io=new IntersectionObserver(e=>e.forEach(i=>{if(i.isIntersecting){i.target.classList.add("in");io.unobserve(i.target)}}),{threshold:.12});
  document.querySelectorAll(".reveal").forEach(el=>io.observe(el));
}
function initializeCredits(){
  const g=document.getElementById("students"); if(!g) return;
  g.innerHTML=students.map((n,i)=>`<li><span>${String(i+1).padStart(2,"0")}</span>${n}</li>`).join("");
}
document.addEventListener("DOMContentLoaded",()=>{initializeChrome();initializeStars();initializeReveal();initializeCredits();});
