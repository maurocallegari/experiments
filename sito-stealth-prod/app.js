(()=>{'use strict';
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp=(n,a=0,b=1)=>Math.min(b,Math.max(a,n));
const lerp=(a,b,t)=>a+(b-a)*t;
const smooth=t=>{t=clamp(t);return t*t*(3-2*t)};
const range=(p,a,b)=>clamp((p-a)/Math.max(.0001,b-a));
let vh=innerHeight,vw=innerWidth,ticking=false;
const hero=document.querySelector('.hero-story');
const heroA=document.querySelector('.hero-copy-a');
const heroB=document.querySelector('.hero-copy-b');
const handoff=document.querySelector('.hero-handoff');
const handoffTitle=document.querySelector('.handoff-title');
const desk=document.querySelector('.desk');
const deskItems=[...document.querySelectorAll('.desk-item')];
const cases=document.querySelector('.cases-story');
const scenes=[...document.querySelectorAll('.case-scene')];
const progressFill=document.querySelector('.progress-track i');
const progressNum=document.querySelector('.progress-num');
const cluster=[[-6,-1,-7,.76],[2,3,5,.72],[5,-3,3,.73],[-1,6,-5,.71],[0,-5,6,.68],[7,2,-4,.66],[-7,4,5,.7],[4,-7,-3,.69],[-4,7,2,.67],[6,-5,-6,.68],[-7,-6,4,.67],[3,6,-2,.69]];
function progress(section){const r=section.getBoundingClientRect();return clamp(-r.top/Math.max(1,section.offsetHeight-vh));}
function updateHero(){if(!hero||reduce)return;const p=progress(hero);const mobile=vw<900;deskItems.forEach((el,i)=>{const x0=+(el.dataset.x||0),y0=+(el.dataset.y||0),r0=+(el.dataset.r||0),s0=+(el.dataset.s||1);const target=cluster[i%cluster.length];const t=smooth(range(p,.08,.58));const x=lerp(x0*(mobile?.78:1),target[0],t)*vw/100;const y=lerp(y0*(mobile?.62:1),target[1],t)*vh/100;const rot=lerp(r0,target[2],t);const scale=lerp(s0*(mobile?.78:1),target[3]*(mobile?.8:1),t);const out=range(p,.64,.82);el.style.transform=`translate(calc(-50% + ${x}px),calc(-50% + ${y}px)) rotate(${rot}deg) scale(${scale})`;el.style.opacity=String(1-.82*out);el.style.filter=`blur(${lerp(0,2.8,out)}px)`;el.style.zIndex=String(10+(i%7));});
const aOut=range(p,.26,.48);heroA.style.opacity=String(1-aOut);heroA.style.transform=`translateX(-50%) translateY(${-24*aOut}px) scale(${lerp(1,.985,aOut)})`;
const bIn=smooth(range(p,.5,.66)),bOut=range(p,.73,.84);heroB.style.opacity=String(bIn*(1-bOut));heroB.style.transform=`translate(-50%,${lerp(28,0,bIn)-18*bOut}px) scale(${lerp(.985,1,bIn)})`;
const dOut=range(p,.68,.84);desk.style.opacity=String(1-dOut);desk.style.filter=`blur(${lerp(0,5,dOut)}px)`;
const h=smooth(range(p,.78,.96));handoff.style.transform=`translateY(${(1-h)*100}%)`;handoffTitle.style.opacity=String(smooth(range(p,.86,.97)));handoffTitle.style.transform=`translateY(${lerp(26,0,smooth(range(p,.86,.97)))}px)`;}
function updateCases(){if(!cases||!scenes.length||reduce)return;const p=progress(cases),q=p*(scenes.length-1),base=Math.min(scenes.length-1,Math.floor(q)),t=base===scenes.length-1?0:q-base;scenes.forEach((scene,i)=>{const d=i-q,ad=Math.abs(d);const visible=ad<1.02;scene.style.opacity=visible?'1':'0';scene.style.transform='none';scene.style.filter='none';scene.style.zIndex=String(20-Math.round(ad*4));scene.style.pointerEvents=ad<.38?'auto':'none';const copy=scene.querySelector('.case-copy'),visual=scene.querySelector('.case-visual');const visualT=smooth(clamp(1-ad/.88)),visualSpan=vw<900?58:42;visual.style.opacity=String(visualT);visual.style.transform=`translate3d(${d*visualSpan}vw,0,0) scale(${lerp(.98,1,visualT)})`;visual.style.filter=`blur(${lerp(1.1,0,visualT)}px)`;let copyOpacity=0,copyX=0,copyY=0;if(base===scenes.length-1&&i===base){copyOpacity=1}else if(i===base){const out=smooth(range(t,.16,.47));copyOpacity=1-out;copyX=-lerp(0,vw<900?38:30,out);copyY=-lerp(0,10,out)}else if(i===base+1){const enter=smooth(range(t,.53,.84));copyOpacity=enter;copyX=lerp(vw<900?38:30,0,enter);copyY=lerp(10,0,enter)}copy.style.opacity=String(copyOpacity);copy.style.transform=`translate3d(${copyX}px,${copyY}px,0)`;});if(progressFill){progressFill.style.transform=`scaleX(${.25+.75*p})`;progressFill.style.width='100%';}if(progressNum){progressNum.textContent=String(Math.min(4,Math.max(1,Math.round(q)+1))).padStart(2,'0');}}
function update(){ticking=false;updateHero();updateCases();}
function request(){if(!ticking){ticking=true;requestAnimationFrame(update)}}
addEventListener('scroll',request,{passive:true});addEventListener('resize',()=>{vh=innerHeight;vw=innerWidth;request()},{passive:true});update();})();
