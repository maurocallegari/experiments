(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const range=(p,a,b)=>clamp((p-a)/(b-a));
const ease=t=>{t=clamp(t);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
const mix=(a,b,t)=>a+(b-a)*t;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile=()=>innerWidth<=900;
const prog=el=>{const r=el.getBoundingClientRect();const travel=Math.max(1,el.offsetHeight-innerHeight);return clamp(-r.top/travel)};

const loaderBar=$('.loader i em'), loaderPct=$('.loader small');
let lp=0;
const loading=setInterval(()=>{lp=Math.min(92,lp+Math.ceil(Math.random()*8));if(loaderBar)loaderBar.style.width=lp+'%';if(loaderPct)loaderPct.textContent=lp+'%';},70);
addEventListener('load',()=>{clearInterval(loading);if(loaderBar)loaderBar.style.width='100%';if(loaderPct)loaderPct.textContent='100%';setTimeout(()=>document.documentElement.classList.add('ready'),180)},{once:true});
setTimeout(()=>document.documentElement.classList.add('ready'),1500);

if(!reduced && !isMobile() && window.Lenis){
  try{
    const lenis=new Lenis({duration:1.05,smoothWheel:true,wheelMultiplier:.9});
    const raf=t=>{lenis.raf(t);requestAnimationFrame(raf)};
    requestAnimationFrame(raf);
  }catch(e){}
}

const head=$('.head'), bar=$('.progress i');
const hero=$('.hero'), copyA=$('.copy-a'), copyB=$('.copy-b'), works=$$('[data-work]');
const cases=$('.cases'), track=$('#caseTrack'), caseEls=$$('[data-case]'), caseFill=$('#caseFill'), caseNum=$('#caseNum');
const ai=$('.ai-chapter'), aiNoise=$$('.ai-noise-card'), aiCore=$('.ai-orbit-core'), aiResult=$('.ai-result');
const pivot=$('.pivot'), sels=$$('.sel'), selCore=$('.sel-core');
const build=$('.build'), inputs=$$('.input'), product=$('.product'), output=$('.output');
const evolve=$('.evolve'), newEls=$$('.ev-app .new'), need=$('.need');

const heroDesktop=[{x:-15,y:8,r:-4,s:.74},{x:14,y:-1,r:3,s:.72},{x:-5,y:-8,r:-2,s:.74},{x:13,y:2,r:5,s:.70},{x:-10,y:-6,r:-3,s:.68},{x:10,y:4,r:3,s:.74},{x:-4,y:11,r:-2,s:.72},{x:8,y:-8,r:2,s:.70},{x:-9,y:4,r:-4,s:.72}];
const heroMobile=[{x:-8,y:-2,r:-3,s:.82},{x:8,y:-2,r:3,s:.80},{x:-6,y:2,r:-2,s:.82},{x:7,y:-1,r:4,s:.80},{x:-6,y:2,r:-2,s:.78},{x:6,y:-2,r:2,s:.82},{x:-5,y:2,r:-2,s:.80},{x:5,y:-2,r:2,s:.79},{x:-4,y:1,r:-3,s:.80}];

function heroMotion(){
  if(!hero||reduced)return;
  const p=prog(hero),m=isMobile();
  const accumulate=ease(range(p,.03,.34));
  const gather=ease(range(p,.42,.78));
  const fade=ease(range(p,m?.90:.77,m?.995:.96));
  const vectors=m?heroMobile:heroDesktop;
  works.forEach((el,i)=>{
    const v=vectors[i%vectors.length];
    const arrive=Math.max(0,1-ease(range(p,Math.max(.02,i*.025),Math.min(.38,.12+i*.035))));
    const initialX=(i%2?1:-1)*(m?10:12)*arrive;
    const initialY=(i%3-1)*(m?3:4)*arrive;
    const chaos=(i%2?1:-1)*accumulate*(m?3:4);
    const x=initialX+v.x*gather+chaos;
    const y=initialY+v.y*gather+Math.sin((p+i)*3)*accumulate*(m?.8:1.6);
    const rot=v.r*gather+(i%2?1:-1)*accumulate*(m?1.2:2);
    const sc=mix(1,v.s,gather);
    el.style.transform=`translate3d(${x}vw,${y}vh,0) rotate(${rot}deg) scale(${sc})`;
    el.style.opacity=String((1-fade*.94)*mix(.58,1,1-arrive));
    el.style.filter=`blur(${mix(0,m?2.2:3.6,fade)}px)`;
  });
  const aOut=ease(range(p,.28,.53));
  if(copyA){
    copyA.style.opacity=String(1-aOut);
    copyA.style.transform=`translateX(-50%) translate3d(0,${-28*aOut}px,0)`;
    copyA.style.filter=`blur(${aOut*(m?2:3)}px)`;
  }
  const bIn=ease(range(p,.42,.62));
  const bOut=ease(range(p,m?.91:.84,m?.995:.98));
  if(copyB){
    copyB.style.opacity=String(bIn*(1-bOut));
    copyB.style.transform=`translateX(-50%) translate3d(0,${mix(m?22:30,0,bIn)-16*bOut}px,0)`;
    copyB.style.filter=`blur(${(1-bIn)*2+bOut*(m?2:3)}px)`;
  }
}

/* Pinned horizontal storytelling: panels do NOT travel as a carousel.
   They share one stage and crossfade/morph as scroll moves between beats. */
function casesMotion(){
  if(!cases||!track||!caseEls.length)return;
  const p=prog(cases),m=isMobile(),n=caseEls.length;
  const exact=p*(n-1);
  track.style.setProperty('transform','none','important');
  caseEls.forEach((el,i)=>{
    const d=exact-i;
    const ad=Math.min(1,Math.abs(d));
    const signed=clamp(d,-1,1);
    const vis=reduced?(i===Math.round(exact)?1:0):1-ease(ad);
    const artVis=reduced?vis:1-ease(clamp(ad*.90));
    const copyVis=reduced?vis:1-ease(clamp(ad*1.08));
    const art=$('.case-art',el), copy=$('.case-copy',el);
    el.style.opacity='1';
    el.style.visibility=vis>.002?'visible':'hidden';
    el.style.pointerEvents=ad<.38?'auto':'none';
    el.style.transform='none';
    el.style.filter='none';
    if(art){
      const x=-signed*(m?9:7);
      const y=ad*(m?8:12);
      const sc=mix(1,.965,ad);
      art.style.opacity=String(artVis);
      art.style.transform=`translate3d(${x}vw,${y}px,0) scale(${sc}) rotate(${signed*(m?.4:.7)}deg)`;
      art.style.filter=`blur(${mix(0,m?2.2:4.5,ad)}px)`;
    }
    if(copy){
      const x=-signed*(m?5:4);
      const y=ad*(m?9:13);
      copy.style.opacity=String(copyVis);
      copy.style.transform=`translate3d(${x}vw,${y}px,0)`;
      copy.style.filter=`blur(${mix(0,m?1.6:3.5,ad)}px)`;
    }
  });
  if(caseFill)caseFill.style.width=(p*100)+'%';
  if(caseNum)caseNum.textContent=String(clamp(Math.round(exact)+1,1,n)).padStart(2,'0');
}

const aiVectorsDesktop=[[18,19],[-18,20],[17,-17],[-18,-15],[2,11],[-10,-18]];
const aiVectorsMobile=[[12,13],[-12,14],[10,-11],[-11,-10],[1,7],[-7,-12]];
const aiRots=[-6,5,5,-5,4,-7];
function aiMotion(){
  if(!ai)return;
  const p=prog(ai),m=isMobile();
  if(reduced){
    aiNoise.forEach(el=>el.style.opacity='0');
    if(aiCore){aiCore.style.opacity='.2';aiCore.style.transform='translate(-50%,-50%) scale(1)'}
    if(aiResult){aiResult.style.opacity='1';aiResult.style.transform=m?'translate(50%,-50%) scale(1)':'translateY(-50%) scale(1)'}
    return;
  }
  const gather=ease(range(p,.08,.48)),coreIn=ease(range(p,.22,.50)),out=ease(range(p,.52,.82)),vectors=m?aiVectorsMobile:aiVectorsDesktop;
  aiNoise.forEach((el,i)=>{
    const v=vectors[i%vectors.length],rot=aiRots[i%aiRots.length]*(1-gather);
    el.style.opacity=String(1-gather*.94);
    el.style.filter=`blur(${gather*(m?1.8:3)}px)`;
    el.style.transform=`translate3d(${v[0]*gather}vw,${v[1]*gather}vh,0) rotate(${rot}deg) scale(${mix(1,.62,gather)})`;
  });
  if(aiCore){
    const coreOut=ease(range(p,.66,.88));
    aiCore.style.opacity=String(coreIn*(1-coreOut*.78));
    aiCore.style.transform=`translate(-50%,-50%) scale(${mix(.42,1,coreIn)})`;
    const ring=coreIn*(1-out);
    aiCore.style.boxShadow=`0 0 0 ${mix(0,m?10:15,ring)}px rgba(160,205,210,${mix(0,.20,ring)}),0 0 ${mix(0,m?42:80,ring)}px rgba(160,205,210,${mix(0,.45,ring)})`;
  }
  if(aiResult){
    aiResult.style.opacity=String(out);
    aiResult.style.transform=m?`translate(50%,-50%) translateY(${mix(28,0,out)}px) scale(${mix(.95,1,out)})`:`translateY(-50%) translateX(${mix(40,0,out)}px) scale(${mix(.95,1,out)})`;
  }
}

function pivotMotion(){
  if(!pivot||reduced)return;
  const p=prog(pivot),t=ease(range(p,.12,.68)),core=ease(range(p,.43,.78)),m=isMobile();
  const vec=m?[[-7,-5],[7,-5],[-7,5],[7,5],[0,-7],[3,7]]:[[-30,-24],[32,-24],[-34,25],[31,24],[1,-35],[8,34]];
  sels.forEach((el,i)=>{const[x,y]=vec[i];el.style.transform=`translate3d(${x*t}vw,${y*t}vh,0) scale(${mix(1,m?.82:.72,t)})`;el.style.opacity=String(1-t*.8)});
  if(selCore){const base=m?'translate(50%,-50%)':'translateY(-50%)';selCore.style.opacity=String(core);selCore.style.transform=`${base} scale(${mix(.82,1,core)})`}
}

function buildMotion(){
  if(!build||reduced)return;
  const p=prog(build),ingest=ease(range(p,.09,.55)),settle=ease(range(p,.39,.70)),out=ease(range(p,.63,.88)),m=isMobile();
  const vec=m?[[17,5],[17,-1],[14,-7]]:[[31,11],[29,-8],[24,-24]];
  inputs.forEach((el,i)=>{const[x,y]=vec[i];el.style.transform=`translate3d(${x*ingest}vw,${y*ingest}vh,0) scale(${mix(1,m?.72:.65,ingest)})`;el.style.opacity=String(1-ingest*.94);el.style.filter=`blur(${ingest*(m?1.2:2)}px)`});
  if(product)product.style.transform=`translateY(-50%) scale(${mix(.96,1,settle)})`;
  if(output){output.style.opacity=String(out);output.style.transform=`translate3d(0,${mix(m?18:28,0,out)}px,0) rotate(${mix(m?2.5:4,0,out)}deg)`}
}

function evolveMotion(){
  if(!evolve||reduced)return;
  const r=evolve.getBoundingClientRect(),p=clamp((innerHeight-r.top)/(innerHeight+r.height*.45)),t=ease(range(p,.32,.66));
  newEls.forEach(el=>{el.style.opacity=String(t);el.style.transform=`translateY(${mix(10,0,t)}px)`});
  if(need){const n=ease(range(p,.46,.74));need.style.opacity=String(n);need.style.transform=`translateY(${mix(20,0,n)}px)`}
}

function globalUI(){
  const max=Math.max(1,document.documentElement.scrollHeight-innerHeight),p=clamp(scrollY/max);
  if(bar)bar.style.width=(p*100)+'%';
  if(head)head.classList.toggle('scrolled',scrollY>22);
}

let ticking=false;
function update(){ticking=false;globalUI();heroMotion();casesMotion();aiMotion();pivotMotion();buildMotion();evolveMotion()}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(update)}},{passive:true});
addEventListener('resize',update,{passive:true});
update();
})();
