(()=>{
'use strict';
const doc=document;
const qs=(s,c)=> (c||doc).querySelector(s);
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

function measureScenes(){
  vh=innerHeight;
  scenes.forEach(s=>{
    if(RM){s.el.style.height='';return}
    const b=mqMob.matches?Math.min(s.beats,1.5):s.beats;
    s.el.style.height=((b+1)*vh)+'px';
  });
  measureMx();
}
function sceneFade(s,p){
  if(!s.view)return;
  if(s.fade==='none'){s.view.style.opacity='1';s.view.style.transform='';return}
  const vin=s.fade==='out'?1:win(p,.04,.16);
  const vout=s.fade==='in'?0:win(p,.88,.995);
  const o=Math.min(vin,1-vout);
  const sc=(1-(1-vin)*.05)*(1-vout*.07);
  const y=(1-vin)*14-vout*10;
  s.view.style.opacity=o.toFixed(3);
  s.view.style.transform=`translateY(${y.toFixed(1)}px) scale(${sc.toFixed(4)})`;
}

/* AI — copied from stealth-new choreography */
const aiCore=qs('#ai .ai-core'), aiOutBox=qs('#ai .ai-out');
const nzEls=qsa('#ai .nz');
const outCard=qs('#ai .doc.out'),out2Card=qs('#ai .doc.out2'),out3Card=qs('#ai .doc.out2.o3');
function updateAI(p){
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
const approve=qs('#oApprove');
if(approve)approve.addEventListener('click',()=>{const b=qs('#aiOut .out-badge');if(b)b.textContent='Inviata ✓';approve.textContent='Inviata ✓';approve.style.background='#2f7d55';approve.style.borderColor='#2f7d55'});

/* METODO — same 3-card centered movement as stealth-new */
const mxInners=qsa('#mx .mx-inner'),mIdx=qs('#mIdx'),mxTrack=qs('#mxTrack'),mxBox=qs('#mx');
let mxCur=0,mxX=[],mxTrackX=0;
function measureMx(){
  if(!mxTrack||!mxBox||mqMob.matches||RM){mxX=[];return}
  const sw=mxBox.clientWidth;
  mxX=mxInners.map(el=>Math.max(0,el.offsetLeft+el.offsetWidth/2-sw/2));
  mxTrackX=mxX[mxCur]||0;
}
function updateMetodo(p){
  let cur=0;if(p>=2/3)cur=2;else if(p>=1/3)cur=1;mxCur=cur;
  if(mxTrack&&mxX.length){const target=mxX[cur]||0;mxTrackX=lerp(mxTrackX,target,.12);if(Math.abs(target-mxTrackX)<.5)mxTrackX=target;mxTrack.style.transform=`translate3d(${(-mxTrackX).toFixed(1)}px,0,0)`}
  mxInners.forEach((el,i)=>el.classList.toggle('is-c',i===cur));
  if(mIdx)mIdx.textContent=('0'+(cur+1)).slice(-2);
}

/* RISULTATO — exact dashboard states */
const dash=qs('#dash'),rcaps=qsa('.rcap');let counted=false;
function countUp(el){const T=+el.getAttribute('data-count'),t0=performance.now(),D=1100;(function f(t){const pp=clamp((t-t0)/D);el.textContent=Math.round(T*easeOut(pp));if(pp<1)requestAnimationFrame(f)})(t0)}
function updateRisultato(p){
  if(!dash)return;
  dash.classList.toggle('live',p>.05&&p<.95);
  const states=[[.06,.34],[.38,.64],[.68,.95]];let cur=-1;
  states.forEach((st,i)=>{if(p>=st[0]&&p<st[1])cur=i});
  dash.classList.toggle('b0',cur===0);dash.classList.toggle('b1',cur===1);dash.classList.toggle('b2',cur===2);
  rcaps.forEach((c,i)=>{if(cur===i){const w=easeOut(norm(p,states[i][0],states[i][0]+.05));c.style.opacity=w.toFixed(3);c.style.transform=`translateY(${((1-w)*10).toFixed(1)}px)`}else{c.style.opacity='0';c.style.transform='translateY(10px)'}});
  if(!counted&&p>.04){counted=true;qsa('[data-count]',dash).forEach(countUp)}
}

/* SUPPORTO — exact evolution window */
const egWin=qs('.eg-win'),supPs=qsa('.sup-p');
function updateSupporto(p){
  if(egWin){const ew=win(p,.06,.2);egWin.style.opacity=ew.toFixed(3);egWin.style.transform=`translateY(${((1-ew)*26).toFixed(1)}px)`;egWin.classList.toggle('on',p>.35)}
  supPs.forEach((s,i)=>{const w=win(p,.48+i*.07,.62+i*.07);s.style.opacity=w.toFixed(3);s.style.transform=`translateY(${((1-w)*20).toFixed(1)}px)`});
}

function updateScenes(){
  vh=innerHeight;
  scenes.forEach(s=>{
    const r=s.el.getBoundingClientRect();
    const active=r.bottom>0&&r.top<vh;
    if(!active){if(s.view)s.view.style.opacity='0';return}
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