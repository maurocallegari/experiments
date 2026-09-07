(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const range=(p,a,b)=>clamp((p-a)/(b-a));
const ease=t=>{t=clamp(t);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
const mix=(a,b,t)=>a+(b-a)*t;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile=()=>innerWidth<=900;
const prog=el=>{const r=el.getBoundingClientRect();return clamp(-r.top/Math.max(1,el.offsetHeight-innerHeight))};

const loaderBar=$('.loader i em'),loaderPct=$('.loader small');
let lp=0;const loading=setInterval(()=>{lp=Math.min(92,lp+7);if(loaderBar)loaderBar.style.width=lp+'%';if(loaderPct)loaderPct.textContent=lp+'%'},70);
addEventListener('load',()=>{clearInterval(loading);if(loaderBar)loaderBar.style.width='100%';if(loaderPct)loaderPct.textContent='100%';setTimeout(()=>document.documentElement.classList.add('ready'),150)},{once:true});
setTimeout(()=>document.documentElement.classList.add('ready'),1400);

if(!reduced&&!mobile()&&window.Lenis){try{const l=new Lenis({duration:1.05,smoothWheel:true,wheelMultiplier:.9});const raf=t=>{l.raf(t);requestAnimationFrame(raf)};requestAnimationFrame(raf)}catch(e){}}

const head=$('.head'),bar=$('.progress i');
const hero=$('.hero'),copyA=$('.copy-a'),copyB=$('.copy-b'),works=$$('[data-work]');
const cases=$('.cases'),track=$('#caseTrack'),caseEls=$$('[data-case]'),caseFill=$('#caseFill');
const ai=$('.ai-chapter'),aiNoise=$$('.ai-noise-card'),aiCore=$('.ai-orbit-core'),aiResult=$('.ai-result');
const pivot=$('.pivot'),sels=$$('.sel'),selCore=$('.sel-core');
const build=$('.build'),inputs=$$('.input'),product=$('.product'),output=$('.output');
const evolve=$('.evolve'),evApp=$('.ev-app'),newEls=$$('.ev-app .new'),need=$('.need');

const heroD=[{x:-15,y:8,r:-4,s:.74},{x:14,y:-1,r:3,s:.72},{x:-5,y:-8,r:-2,s:.74},{x:13,y:2,r:5,s:.70},{x:-10,y:-6,r:-3,s:.68},{x:10,y:4,r:3,s:.74},{x:-4,y:11,r:-2,s:.72},{x:8,y:-8,r:2,s:.70},{x:-9,y:4,r:-4,s:.72}];
const heroM=[{x:-5,y:1,r:-2,s:.86},{x:5,y:0,r:2,s:.84},{x:-4,y:1,r:-2,s:.86},{x:5,y:0,r:3,s:.84},{x:-4,y:1,r:-2,s:.82},{x:4,y:0,r:2,s:.86},{x:-3,y:1,r:-2,s:.84},{x:4,y:0,r:2,s:.83},{x:-3,y:1,r:-2,s:.84}];
function heroMotion(){
 if(!hero||reduced)return;
 const p=prog(hero),m=mobile(),vectors=m?heroM:heroD,acc=ease(range(p,.04,.34)),gather=ease(range(p,.42,.79)),fade=ease(range(p,m?.965:.80,m?.999:.97));
 works.forEach((el,i)=>{const v=vectors[i%vectors.length],arrive=1-ease(range(p,Math.max(.02,i*.02),Math.min(.32,.10+i*.028))),x=(i%2?1:-1)*(m?5:11)*arrive+v.x*gather+(i%2?1:-1)*acc*(m?1.5:3),y=(i%3-1)*(m?1:3)*arrive+v.y*gather,rot=v.r*gather,sc=mix(1,v.s,gather);el.style.transform=`translate3d(${x}vw,${y}vh,0) rotate(${rot}deg) scale(${sc})`;el.style.opacity=String((1-fade*.98)*mix(.62,1,1-arrive));el.style.filter=`blur(${fade*(m?1.5:3)}px)`});
 const a=ease(range(p,.28,.53));if(copyA){copyA.style.opacity=String(1-a);copyA.style.transform=`translateX(-50%) translateY(${-22*a}px)`;copyA.style.filter=`blur(${a*2}px)`}
 const bin=ease(range(p,.43,.62)),bout=ease(range(p,m?.965:.86,m?.999:.985));if(copyB){copyB.style.opacity=String(bin*(1-bout));copyB.style.transform=`translateX(-50%) translateY(${mix(18,0,bin)-12*bout}px)`;copyB.style.filter=`blur(${(1-bin)*2+bout*2}px)`}
}

/* One active case at a time. Outgoing finishes before the next panel begins. */
function casesMotion(){
 if(!cases||!caseEls.length)return;
 const p=prog(cases),m=mobile(),n=caseEls.length,scaled=Math.min(n-.000001,p*n),idx=Math.min(n-1,Math.floor(scaled)),local=scaled-idx;
 if(track)track.style.setProperty('transform','none','important');
 caseEls.forEach((el,i)=>{
   const art=$('.case-art',el),copy=$('.case-copy',el),active=i===idx;
   if(!active){el.style.visibility='hidden';el.style.opacity='0';el.style.pointerEvents='none';if(art)art.style.opacity='0';if(copy)copy.style.opacity='0';return}
   const enter=(idx===0&&p<.02)?1:ease(range(local,0,.16));
   const exit=idx===n-1?0:ease(range(local,.76,.97));
   const vis=clamp(enter*(1-exit));
   el.style.visibility='visible';el.style.opacity='1';el.style.pointerEvents=vis>.7?'auto':'none';
   if(art){const x=mix(m?8:5,0,enter)-exit*(m?8:5),y=mix(m?10:14,0,enter)+exit*(m?8:12);art.style.opacity=String(vis);art.style.transform=`translate3d(${x}vw,${y}px,0) scale(${mix(.97,1,enter)*(1-exit*.025)})`;art.style.filter=`blur(${(1-vis)*(m?2.5:4.5)}px)`}
   if(copy){const x=mix(m?5:3,0,enter)-exit*(m?5:3),y=mix(m?9:12,0,enter)+exit*(m?8:10);copy.style.opacity=String(vis);copy.style.transform=`translate3d(${x}vw,${y}px,0)`;copy.style.filter=`blur(${(1-vis)*(m?1.8:3)}px)`}
 });
 if(caseFill)caseFill.style.width=(p*100)+'%';
}

const aiVD=[[18,19],[-18,20],[17,-17],[-18,-15],[2,11],[-10,-18]],aiVM=[[11,11],[-11,12],[9,-10],[-10,-9],[1,6],[-6,-10]],aiR=[-6,5,5,-5,4,-7];
function aiMotion(){
 if(!ai)return;const p=prog(ai),m=mobile(),vec=m?aiVM:aiVD;
 if(reduced){aiNoise.forEach(el=>el.style.opacity='0');if(aiCore)aiCore.style.opacity='.2';if(aiResult)aiResult.style.opacity='1';return}
 const gather=ease(range(p,.08,.48)),coreIn=ease(range(p,.22,.50)),out=ease(range(p,.52,.82));
 aiNoise.forEach((el,i)=>{const v=vec[i%vec.length];el.style.opacity=String(1-gather*.96);el.style.filter=`blur(${gather*(m?1.8:3)}px)`;el.style.transform=`translate3d(${v[0]*gather}vw,${v[1]*gather}vh,0) rotate(${aiR[i%aiR.length]*(1-gather)}deg) scale(${mix(1,.62,gather)})`});
 if(aiCore){const co=ease(range(p,.67,.88));aiCore.style.opacity=String(coreIn*(1-co*.8));aiCore.style.transform=`translate(-50%,-50%) scale(${mix(.42,1,coreIn)})`;aiCore.style.boxShadow=`0 0 0 ${mix(0,m?10:15,coreIn*(1-out))}px rgba(160,205,210,.2),0 0 ${mix(0,m?42:80,coreIn*(1-out))}px rgba(160,205,210,.4)`}
 if(aiResult){aiResult.style.opacity=String(out);aiResult.style.transform=m?`translate(50%,-50%) translateY(${mix(24,0,out)}px) scale(${mix(.95,1,out)})`:`translateY(-50%) translateX(${mix(40,0,out)}px) scale(${mix(.95,1,out)})`}
}

function pivotMotion(){if(!pivot||reduced)return;const p=prog(pivot),t=ease(range(p,.12,.68)),core=ease(range(p,.43,.78)),m=mobile(),vec=m?[[-7,-5],[7,-5],[-7,5],[7,5],[0,-7],[3,7]]:[[-30,-24],[32,-24],[-34,25],[31,24],[1,-35],[8,34]];sels.forEach((el,i)=>{const[x,y]=vec[i];el.style.transform=`translate3d(${x*t}vw,${y*t}vh,0) scale(${mix(1,m?.82:.72,t)})`;el.style.opacity=String(1-t*.8)});if(selCore){const base=m?'translate(50%,-50%)':'translateY(-50%)';selCore.style.opacity=String(core);selCore.style.transform=`${base} scale(${mix(.82,1,core)})`}}

/* Reference choreography: EMAIL/FOTO/FIRMA are absorbed into STEALTH / PRATICHE, then PDF is generated. */
function buildMotion(){
 if(!build)return;const p=prog(build),m=mobile();if(reduced){inputs.forEach(el=>el.style.opacity='0');if(product)product.style.opacity='1';if(output)output.style.opacity='1';return}
 const ingest=ease(range(p,.08,.48)),settle=ease(range(p,.25,.61)),out=ease(range(p,.58,.84)),vec=m?[[20,14],[20,0],[17,-13]]:[[34,18],[32,-5],[27,-27]],rots=[-5,4,-2];
 inputs.forEach((el,i)=>{const[x,y]=vec[i];el.style.transform=`translate3d(${x*ingest}vw,${y*ingest}vh,0) rotate(${mix(rots[i],0,ingest)}deg) scale(${mix(1,m?.70:.64,ingest)})`;el.style.opacity=String(1-ingest*.98);el.style.filter=`blur(${ingest*(m?1.8:3)}px)`});
 if(product){product.style.opacity=String(mix(.82,1,settle));product.style.filter=`blur(${mix(m?1.5:2.5,0,settle)}px)`;product.style.transform=`translateY(-50%) translateX(${mix(m?18:28,0,settle)}px) scale(${mix(.94,1,settle)})`}
 if(output){output.style.opacity=String(out);output.style.filter=`blur(${mix(m?2:3.5,0,out)}px)`;output.style.transform=`translate3d(${mix(m?12:20,0,out)}px,${mix(m?24:34,0,out)}px,0) rotate(${mix(m?4:6,0,out)}deg) scale(${mix(.94,1,out)})`}
}

/* Evolution reference: existing app first; the new requirement becomes part of the same UI. */
function evolveMotion(){
 if(!evolve)return;const m=mobile(),r=evolve.getBoundingClientRect(),p=clamp((innerHeight*.88-r.top)/Math.max(1,innerHeight+r.height*.55));
 if(reduced){if(evApp)evApp.style.opacity='1';newEls.forEach(el=>el.style.opacity='1');if(need)need.style.opacity='1';return}
 const app=ease(range(p,.04,.30)),needIn=ease(range(p,.50,.78));
 if(evApp){evApp.style.opacity=String(mix(.72,1,app));evApp.style.filter=`blur(${mix(m?2:4,0,app)}px)`;evApp.style.transform=`translateY(-50%) translateX(${mix(m?-14:-28,0,app)}px) scale(${mix(.96,1,app)})`}
 newEls.forEach((el,i)=>{const t=ease(range(p,.30+i*.035,.58+i*.035));el.style.opacity=String(t);el.style.transform=`translate3d(${mix(m?10:18,0,t)}px,${mix(10,0,t)}px,0)`});
 if(need){need.style.opacity=String(needIn);need.style.filter=`blur(${mix(m?2:4,0,needIn)}px)`;need.style.transform=`translate3d(${mix(m?20:34,0,needIn)}px,${mix(22,0,needIn)}px,0) rotate(${mix(4,0,needIn)}deg) scale(${mix(.95,1,needIn)})`}
}

function globalUI(){const max=Math.max(1,document.documentElement.scrollHeight-innerHeight),p=clamp(scrollY/max);if(bar)bar.style.width=(p*100)+'%';if(head)head.classList.toggle('scrolled',scrollY>22)}
let ticking=false;function update(){ticking=false;globalUI();heroMotion();casesMotion();aiMotion();pivotMotion();buildMotion();evolveMotion()}addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(update)}},{passive:true});addEventListener('resize',update,{passive:true});update();
})();