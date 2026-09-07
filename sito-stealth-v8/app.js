(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = () => matchMedia('(max-width: 900px)').matches;
  const clamp=(n,a=0,b=1)=>Math.min(b,Math.max(a,n));
  const mix=(a,b,t)=>a+(b-a)*t;
  const range=(p,a,b)=>clamp((p-a)/(b-a));
  const ease=t=>{t=clamp(t);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
  const progress=(el)=>{const r=el.getBoundingClientRect(),travel=Math.max(1,el.offsetHeight-innerHeight);return clamp(-r.top/travel)};

  fetch('content.json').then(r=>r.ok?r.json():null).then(data=>{
    if(!data)return;
    document.querySelectorAll('[data-content]').forEach(el=>{
      const value=el.dataset.content.split('.').reduce((o,k)=>o&&o[k],data);
      if(typeof value==='string') el.innerHTML=value;
    });
  }).catch(()=>{});

  const hero=document.querySelector('.hero');
  const heroCopy=document.querySelector('[data-hero-copy]');
  const heroEnd=document.querySelector('[data-hero-end]');
  const chaos=[...document.querySelectorAll('[data-chaos]')];
  const chaosTargets=[[-5,-2,-7,.56],[4,2,3,.53],[-1,2,-2,.54],[3,4,5,.49],[-3,-4,-3,.46],[2,-1,2,.5],[-4,3,-5,.48],[5,-3,4,.47],[0,-5,-1,.49],[-1,5,3,.46]];
  function updateHero(){
    if(!hero||reduced||mobile())return;
    const p=progress(hero), gather=ease(range(p,.05,.66)), dissolve=ease(range(p,.68,.9));
    chaos.forEach((el,i)=>{
      const [x,y,r,s]=chaosTargets[i%chaosTargets.length];
      const wobble=(i%2?1:-1)*mix(0,4,range(p,.18,.5));
      el.style.transform=`translate(${x*innerWidth/100*gather}px,${y*innerHeight/100*gather}px) rotate(${r*gather+wobble}deg) scale(${mix(1,s,gather)})`;
      el.style.opacity=String(1-dissolve*.92);
      el.style.filter=`blur(${mix(0,3.5,dissolve)}px)`;
    });
    if(heroCopy){const t=ease(range(p,.32,.58));heroCopy.style.opacity=String(1-t);heroCopy.style.transform=`translateY(${-35*t}px)`;heroCopy.style.filter=`blur(${2*t}px)`}
    if(heroEnd){const tin=ease(range(p,.58,.74)),tout=ease(range(p,.82,.97));heroEnd.style.opacity=String(tin*(1-tout));heroEnd.style.transform=`translate(-50%,calc(-50% + ${mix(28,0,tin)-20*tout}px)) scale(${mix(.97,1,tin)})`}
  }

  const story=document.querySelector('[data-story-scroll]');
  const scenes=[...document.querySelectorAll('[data-scene]')];
  const fill=document.querySelector('.story-progress-fill');
  const count=document.querySelector('.story-progress-count');
  function updateStory(){
    if(!story||reduced||mobile())return;
    const p=progress(story), q=p*(scenes.length-1), active=Math.round(q);
    scenes.forEach((scene,i)=>{
      const d=i-q,ad=Math.abs(d); let opacity=clamp(1-ad*1.45); if(ad>.9)opacity=0;
      const x=d*22, y=ad*7;
      scene.style.opacity=String(opacity);
      scene.style.transform=`translate3d(${x}vw,${y}px,0) scale(${mix(1,.975,clamp(ad))})`;
      scene.style.filter=`blur(${mix(0,4,clamp(ad))}px)`;
      scene.style.pointerEvents=ad<.42?'auto':'none';
      const vis=scene.querySelector('.scene-visual'); if(vis){vis.style.transform=`translate3d(${d*7}vw,0,0) rotateY(${d*-2}deg)`;vis.style.opacity=String(clamp(1-ad*.9));}
    });
    if(fill)fill.style.width=`${p*100}%`;
    if(count)count.textContent=String(clamp(active+1,1,scenes.length)).padStart(2,'0');
  }

  const pivot=document.querySelector('[data-pivot]');
  const pivotItems=[...document.querySelectorAll('.pivot-item')];
  const pivotCore=document.querySelector('.pivot-core');
  function updatePivot(){
    if(!pivot||reduced||mobile())return;
    const p=progress(pivot),t=ease(range(p,.08,.68));
    const points=[[-32,-25],[33,-26],[-34,25],[31,24],[1,-36],[8,34]];
    pivotItems.forEach((el,i)=>{const [x,y]=points[i];el.style.transform=`translate(${x*t}vw,${y*t}vh) scale(${mix(1,.72,t)})`;el.style.opacity=String(1-t*.82)});
    if(pivotCore){const ci=ease(range(p,.38,.72));pivotCore.style.opacity=String(ci);pivotCore.style.transform=`translateY(-50%) scale(${mix(.8,1,ci)})`}
  }

  const build=document.querySelector('[data-build]');
  const inputs=[...document.querySelectorAll('.input-orbit')];
  const shell=document.querySelector('.app-shell');
  const output=document.querySelector('.output-doc');
  function updateBuild(){
    if(!build||reduced||mobile())return;
    const p=progress(build), ingest=ease(range(p,.08,.54)), settle=ease(range(p,.42,.72)), out=ease(range(p,.64,.88));
    const vectors=[[31,11],[29,-8],[24,-24]];
    inputs.forEach((el,i)=>{const [x,y]=vectors[i];el.style.transform=`translate(${x*ingest}vw,${y*ingest}vh) scale(${mix(1,.68,ingest)})`;el.style.opacity=String(1-ingest*.92);el.style.filter=`blur(${ingest*2}px)`});
    if(shell)shell.style.transform=`translateY(-50%) scale(${mix(.96,1,settle)})`;
    if(output){output.style.opacity=String(out);output.style.transform=`translateY(${mix(26,0,out)}px) rotate(${mix(3,0,out)}deg)`}
  }

  const evolve=document.querySelector('[data-evolve]');
  const newRow=document.querySelector('.new-row');
  function updateEvolve(){
    if(!evolve||reduced)return;
    const r=evolve.getBoundingClientRect(),p=clamp((innerHeight-r.top)/(innerHeight+r.height*.45));
    if(newRow){newRow.style.opacity=String(ease(range(p,.44,.72)));newRow.style.transform=`translateY(${mix(12,0,ease(range(p,.44,.72)))}px)`}
  }

  let ticking=false;
  function update(){ticking=false;updateHero();updateStory();updatePivot();updateBuild();updateEvolve()}
  addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(update)}},{passive:true});
  addEventListener('resize',update,{passive:true});
  update();
})();
