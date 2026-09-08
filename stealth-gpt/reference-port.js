(()=>{
'use strict';
const doc=document;
const qs=(s,c)=>(c||doc).querySelector(s);
const qsa=(s,c)=>Array.from((c||doc).querySelectorAll(s));
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const norm=(v,a,b)=>clamp((v-a)/(b-a));
const easeOut=t=>1-Math.pow(1-clamp(t),3);
const easeInOut=t=>{t=clamp(t);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
const win=(p,a,b)=>easeOut(norm(p,a,b));
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const mqMob=matchMedia('(max-width:899px)');
let vh=innerHeight;

const scenes=qsa('.ref-scene').map(el=>({
  el,
  id:el.id,
  beats:parseFloat(el.getAttribute('data-beats')||'1'),
  view:qs('.scene-view',el),
  fade:el.getAttribute('data-fade')||'inout'
}));

/* Mobile travel deliberately compact: enough room for a real scrub, without
   the long blank dwell visible in the iOS recording. */
const mobileHeights={ai:2.12,metodo:1.92,risultato:1.72,supporto:1.62};
function measureScenes(){
  vh=innerHeight;
  scenes.forEach(s=>{
    if(RM){s.el.style.removeProperty('height');return}
    if(mqMob.matches){
      const mult=mobileHeights[s.id]||1.7;
      s.el.style.setProperty('height',(mult*vh)+'px','important');
    }else{
      s.el.style.setProperty('height',((s.beats+1)*vh)+'px');
    }
  });
  measureMx();
}
function sceneFade(s,p){
  if(!s.view)return;
  /* On mobile the scene itself never fades. Transitions happen inside the
     graphic stage, so there is no white screen between chapters. */
  if(mqMob.matches){
    s.view.style.setProperty('opacity','1','important');
    s.view.style.setProperty('transform','none','important');
    return;
  }
  if(s.fade==='none'){s.view.style.opacity='1';s.view.style.transform='';return}
  const vin=s.fade==='out'?1:win(p,.04,.16);
  const vout=s.fade==='in'?0:win(p,.88,.995);
  const o=Math.min(vin,1-vout);
  const sc=(1-(1-vin)*.05)*(1-vout*.07);
  const y=(1-vin)*14-vout*10;
  s.view.style.opacity=o.toFixed(3);
  s.view.style.transform=`translateY(${y.toFixed(1)}px) scale(${sc.toFixed(4)})`;
}

/* ---------------- AI ---------------- */
const aiStage=qs('#ai .ai-stage');
const aiCore=qs('#ai .ai-core'),aiOutBox=qs('#ai .ai-out');
const nzEls=qsa('#ai .nz');
const outCard=qs('#ai .doc.out'),out2Card=qs('#ai .doc.out2'),out3Card=qs('#ai .doc.out2.o3');

function updateAIMobile(p){
  if(!aiStage||!aiCore)return;
  const gather=easeInOut(norm(p,.04,.66));
  const out=easeInOut(norm(p,.57,.96));
  const coreX=aiStage.clientWidth*.5;
  const coreY=aiStage.clientHeight*.54;

  nzEls.forEach(el=>{
    /* Geometry uses untransformed layout coordinates, so the motion is stable
       and follows the finger 1:1 instead of recalculating from transformed rects. */
    const cx=el.offsetLeft+el.offsetWidth/2;
    const cy=el.offsetTop+el.offsetHeight/2;
    const dx=coreX-cx,dy=coreY-cy;
    const rot=parseFloat(el.style.getPropertyValue('--r')||0);
    const baseScale=.60;
    const endScale=.13;
    const sc=lerp(baseScale,endScale,gather);
    el.style.setProperty('opacity','1','important');
    el.style.transform=`translate3d(${(dx*gather).toFixed(1)}px,${(dy*gather).toFixed(1)}px,0) rotate(${(rot*(1-gather)).toFixed(2)}deg) scale(${sc.toFixed(3)})`;
  });

  /* Core is present from frame one. It grows while inputs converge, then
     recedes behind the result. No opacity animation. */
  const coreGrow=lerp(.78,1.08,easeInOut(norm(p,.05,.55)));
  const coreLeave=lerp(1,.46,out);
  aiCore.style.setProperty('opacity','1','important');
  aiCore.style.transform=`scale(${(coreGrow*coreLeave).toFixed(3)})`;
  aiCore.classList.toggle('hot',p>.34&&p<.78);

  /* Result enters by physical movement from below, never by fading. */
  if(aiOutBox){
    const y=(1-out)*aiStage.clientHeight*1.08;
    aiOutBox.style.setProperty('opacity','1','important');
    aiOutBox.style.transform=`translate3d(0,${y.toFixed(1)}px,0) scale(${lerp(.94,1,out).toFixed(3)})`;
  }
  [outCard,out2Card,out3Card].forEach(el=>{if(el){el.style.setProperty('opacity','1','important')}});
  if(outCard)outCard.style.transform='none';
  if(out2Card)out2Card.style.transform='none';
  if(out3Card)out3Card.style.transform='none';
}

function updateAIDesktop(p){
  nzEls.forEach((el,i)=>{
    const d=parseFloat(el.style.getPropertyValue('--d'))||i;
    const w=win(p,.02+d*.035,.18+d*.035);
    const tc=easeInOut(norm(p,.3,.54));
    let base='translate(0,0)';
    if(tc>0&&aiCore){
      const r=el.getBoundingClientRect(),c=aiCore.getBoundingClientRect();
      const dx=(c.left+c.width/2)-(r.left+r.width/2);
      const dy=(c.top+c.height/2)-(r.top+r.height/2);
      base=`translate(${(dx*tc).toFixed(1)}px,${(dy*tc).toFixed(1)}px) rotate(${((1-tc)*parseFloat(el.style.getPropertyValue('--r')||0)).toFixed(1)}deg) scale(${(1-tc*.45).toFixed(3)})`;
      el.style.opacity=(w*(1-tc)).toFixed(3);
    }else el.style.opacity=w.toFixed(3);
    el.style.transform=base;
  });
  const cp=win(p,.3,.46),oc=easeInOut(norm(p,.7,.85));
  if(aiOutBox){aiOutBox.style.opacity=oc.toFixed(3);aiOutBox.style.transform=oc>0?`scale(${lerp(.92,1,oc).toFixed(3)})`:''}
  if(aiCore){aiCore.style.transform=`scale(${lerp(.4,1,cp).toFixed(3)})`;aiCore.style.opacity=(cp*(1-oc)).toFixed(3);aiCore.classList.toggle('hot',p>.5&&oc<.35)}
  const o1=win(p,.56,.7);if(outCard){outCard.style.opacity=o1.toFixed(3);outCard.style.transform=`translateY(${((1-o1)*30).toFixed(1)}px) scale(${lerp(.96,1,o1).toFixed(3)})`}
  const o2=win(p,.68,.8);if(out2Card){out2Card.style.opacity=o2.toFixed(3);out2Card.style.transform=`translateY(${((1-o2)*26).toFixed(1)}px) scale(${lerp(.96,1,o2).toFixed(3)})`}
  const o3=win(p,.76,.88);if(out3Card){out3Card.style.opacity=o3.toFixed(3);out3Card.style.transform=`translateY(${((1-o3)*26).toFixed(1)}px) scale(${lerp(.96,1,o3).toFixed(3)})`}
}
function updateAI(p){mqMob.matches?updateAIMobile(p):updateAIDesktop(p)}

const approve=qs('#oApprove');
if(approve)approve.addEventListener('click',()=>{const b=qs('#aiOut .out-badge');if(b)b.textContent='Inviata ✓';approve.textContent='Inviata ✓';approve.style.background='#2f7d55';approve.style.borderColor='#2f7d55'});

/* ---------------- METHOD ---------------- */
const mxInners=qsa('#mx .mx-inner'),mIdx=qs('#mIdx'),mxTrack=qs('#mxTrack'),mxBox=qs('#mx');
let mxCur=0,mxX=[],mxTrackX=0;
function measureMx(){
  if(!mxTrack||!mxBox||RM){mxX=[];return}
  const sw=mxBox.clientWidth;
  mxX=mxInners.map(el=>Math.max(0,el.offsetLeft+el.offsetWidth/2-sw/2));
  mxTrackX=mxX[mxCur]||0;
}
function updateMetodoMobile(p){
  if(!mxTrack||!mxBox||!mxInners.length)return;
  if(!mxX.length)measureMx();
  const maxX=mxX[mxX.length-1]||0;
  /* Linear progress: every pixel of vertical scroll produces a corresponding
     fraction of horizontal movement. No thresholds, no one-shot slide swap. */
  const x=maxX*clamp(p);
  mxTrack.style.transform=`translate3d(${(-x).toFixed(2)}px,0,0)`;
  const center=mxBox.clientWidth/2;
  let nearest=0,nearestDist=Infinity;
  mxInners.forEach((el,i)=>{
    const cardCenter=el.offsetLeft+el.offsetWidth/2-x;
    const d=Math.abs(cardCenter-center)/Math.max(1,mxBox.clientWidth);
    if(d<nearestDist){nearestDist=d;nearest=i}
    const sc=1-Math.min(.075,d*.085);
    const blur=Math.min(2.4,d*3.1);
    el.style.setProperty('opacity','1','important');
    el.style.filter=`blur(${blur.toFixed(2)}px)`;
    el.style.transform=`scale(${sc.toFixed(4)})`;
  });
  mxCur=nearest;
  mxInners.forEach((el,i)=>el.classList.toggle('is-c',i===nearest));
  if(mIdx)mIdx.textContent=('0'+(nearest+1)).slice(-2);
}
function updateMetodoDesktop(p){
  let cur=0;if(p>=2/3)cur=2;else if(p>=1/3)cur=1;mxCur=cur;
  if(mxTrack&&mxX.length){const target=mxX[cur]||0;mxTrackX=lerp(mxTrackX,target,.12);if(Math.abs(target-mxTrackX)<.5)mxTrackX=target;mxTrack.style.transform=`translate3d(${(-mxTrackX).toFixed(1)}px,0,0)`}
  mxInners.forEach((el,i)=>el.classList.toggle('is-c',i===cur));
  if(mIdx)mIdx.textContent=('0'+(cur+1)).slice(-2);
}
function updateMetodo(p){mqMob.matches?updateMetodoMobile(p):updateMetodoDesktop(p)}

/* ---------------- RESULT ---------------- */
const dash=qs('#dash'),rcaps=qsa('.rcap');let counted=false;
function countUp(el){const T=+el.getAttribute('data-count'),t0=performance.now(),D=1100;(function f(t){const pp=clamp((t-t0)/D);el.textContent=Math.round(T*easeOut(pp));if(pp<1)requestAnimationFrame(f)})(t0)}
function updateRisultato(p){
  if(!dash)return;
  dash.classList.toggle('live',p>.03&&p<.98);
  const states=[[.02,.35],[.34,.67],[.66,.99]];let cur=Math.min(2,Math.floor(clamp(p)*3));
  dash.classList.toggle('b0',cur===0);dash.classList.toggle('b1',cur===1);dash.classList.toggle('b2',cur===2);
  rcaps.forEach((c,i)=>{
    if(mqMob.matches){
      const center=(i+.5)/3;
      const d=Math.abs(p-center);
      const v=clamp(1-d*5.2);
      c.style.setProperty('opacity',String(v),'important');
      c.style.transform=`translateY(${((1-v)*8).toFixed(1)}px)`;
    }else if(cur===i){
      const w=easeOut(norm(p,states[i][0],states[i][0]+.05));c.style.opacity=w.toFixed(3);c.style.transform=`translateY(${((1-w)*10).toFixed(1)}px)`;
    }else{c.style.opacity='0';c.style.transform='translateY(10px)'}
  });
  if(!counted&&p>.02){counted=true;qsa('[data-count]',dash).forEach(countUp)}
}

/* ---------------- SUPPORT ---------------- */
const egWin=qs('.eg-win'),supPs=qsa('.sup-p');
function updateSupporto(p){
  if(egWin){
    if(mqMob.matches){
      egWin.style.setProperty('opacity','1','important');
      egWin.style.transform=`translateY(${lerp(14,0,easeOut(norm(p,0,.18))).toFixed(1)}px)`;
    }else{
      const ew=win(p,.06,.2);egWin.style.opacity=ew.toFixed(3);egWin.style.transform=`translateY(${((1-ew)*26).toFixed(1)}px)`;
    }
    egWin.classList.toggle('on',p>.34);
  }
  supPs.forEach((s,i)=>{
    if(mqMob.matches){s.style.setProperty('opacity','1','important');s.style.transform='none'}
    else{const w=win(p,.48+i*.07,.62+i*.07);s.style.opacity=w.toFixed(3);s.style.transform=`translateY(${((1-w)*20).toFixed(1)}px)`}
  });
}

function updateScenes(){
  vh=innerHeight;
  scenes.forEach(s=>{
    const r=s.el.getBoundingClientRect();
    const active=r.bottom>0&&r.top<vh;
    if(!active){
      if(!mqMob.matches&&s.view)s.view.style.opacity='0';
      return;
    }
    const p=clamp(-r.top/Math.max(1,r.height-vh));
    sceneFade(s,p);
    if(s.id==='ai')updateAI(p);
    else if(s.id==='metodo')updateMetodo(p);
    else if(s.id==='risultato')updateRisultato(p);
    else if(s.id==='supporto')updateSupporto(p);
  });
}

let ticking=false;
function frame(){ticking=false;updateScenes()}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(frame)}},{passive:true});
let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{measureScenes();frame()},180)},{passive:true});
addEventListener('load',()=>{measureScenes();frame()},{once:true});
setTimeout(()=>{measureScenes();frame()},300);
measureScenes();frame();
})();