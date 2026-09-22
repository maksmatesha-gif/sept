const canvas=document.getElementById("flow-canvas");
const ctx=canvas?.getContext("2d");
let w=0,h=0,particles=[];
const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function resize(){
  if(!canvas)return;
  const dpr=Math.min(window.devicePixelRatio||1,1.5);
  w=innerWidth;h=innerHeight;canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+"px";canvas.style.height=h+"px";ctx.setTransform(dpr,0,0,dpr,0,0);
  const count=innerWidth<700?18:36;
  particles=Array.from({length:count},()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.5+.4,s:Math.random()*.45+.12,a:Math.random()*.18+.035,p:Math.random()*6.28}));
}
resize();addEventListener("resize",resize,{passive:true});

function draw(){
  if(!ctx)return;
  ctx.clearRect(0,0,w,h);
  particles.forEach(p=>{
    ctx.globalAlpha=p.a;ctx.fillStyle="#d8f36a";ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
    p.y+=p.s;p.x+=Math.sin(p.y*.009+p.p)*.18;
    if(p.y>h+5){p.y=-5;p.x=Math.random()*w}
  });
  ctx.globalAlpha=1;requestAnimationFrame(draw);
}
if(!reduced)draw();

const nav=document.getElementById("nav");
const onScroll=()=>nav?.classList.toggle("scrolled",scrollY>20);
addEventListener("scroll",onScroll,{passive:true});onScroll();

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");observer.unobserve(e.target)}}),{threshold:.12,rootMargin:"0px 0px -30px"});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

const burger=document.querySelector(".burger");
burger?.addEventListener("click",()=>{
  nav.classList.toggle("open");
  burger.setAttribute("aria-expanded",nav.classList.contains("open"));
});
document.querySelectorAll(".nav-links a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));

document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener("click",e=>{
  const target=document.querySelector(a.getAttribute("href"));
  if(target){e.preventDefault();target.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"});nav.classList.remove("open");}
}));

const glow=document.querySelector(".cursor-glow");
if(glow && !reduced && matchMedia("(pointer:fine)").matches){
  addEventListener("pointermove",e=>{glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px";glow.style.opacity="1"},{passive:true});
  addEventListener("pointerleave",()=>glow.style.opacity="0");
}

const form=document.getElementById("lead-form");
form?.addEventListener("submit",e=>{
  e.preventDefault();
  const data=Object.fromEntries(new FormData(form).entries());
  if(!data.name||!data.phone)return;
  try{localStorage.setItem("hydro_request",JSON.stringify({...data,time:new Date().toISOString()}));}catch(_){}
  form.reset();
  document.querySelector(".form-ok")?.classList.add("show");
});

document.getElementById("year").textContent=new Date().getFullYear();
