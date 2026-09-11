/* STEALTH static foundation: native page scroll + scroll-driven friction track. */
(function(){
  'use strict';

  var root=document.documentElement;
  root.classList.remove('is-loading');
  root.classList.add('is-loaded','static-ready');

  function important(el,prop,value){
    if(el)el.style.setProperty(prop,value,'important');
  }
  function clamp(value,min,max){return Math.max(min,Math.min(max,value));}

  var supportsSvh=window.CSS&&CSS.supports&&CSS.supports('height','100svh');
  var viewportUnit=supportsSvh?'100svh':'100vh';
  var viewportSuffix=supportsSvh?'svh':'vh';
  var mobileMq=window.matchMedia('(max-width:700px)');

  /* Every regular section owns at least one full viewport. */
  Array.prototype.forEach.call(document.querySelectorAll('main > section'),function(section){
    important(section,'position','relative');
    important(section,'min-height',viewportUnit);
    important(section,'margin','0');
    important(section,'box-sizing','border-box');
  });
  Array.prototype.forEach.call(document.querySelectorAll('main > section:not(#attriti) > .pin, main > section:not(#attriti) > .scene-view'),function(stage){
    important(stage,'min-height',viewportUnit);
    important(stage,'box-sizing','border-box');
  });

  document.addEventListener('click',function(e){
    var target=e.target;
    if(!target||!target.closest)return;
    var a=target.closest('a[href^="#"]');
    if(!a)return;
    var id=a.getAttribute('href');
    if(!id||id==='#')return;
    var el=document.querySelector(id);
    if(!el)return;
    e.preventDefault();
    el.scrollIntoView({behavior:'auto',block:'start'});
  });

  var section=document.getElementById('attriti');
  var track=document.getElementById('caseTrack');
  if(!section||!track)return;

  var pin=section.querySelector('.cases-pin');
  var head=section.querySelector('.cases-head');
  var slides=Array.prototype.slice.call(track.querySelectorAll('.case'));
  if(!pin||slides.length<2)return;

  Array.prototype.forEach.call(section.querySelectorAll('.case-slider-ui'),function(el){el.remove();});

  section.classList.add('slider-ready','scroll-slider');
  section.setAttribute('role','region');
  section.setAttribute('aria-label','Dove si perde tempo, davvero');

  /* Outer wrapper supplies the vertical distance; visible stage is always exactly one viewport. */
  important(section,'height',(slides.length*100)+viewportSuffix);
  important(section,'min-height',(slides.length*100)+viewportSuffix);
  important(section,'max-height','none');
  important(section,'padding','0');
  important(section,'overflow','visible');
  important(section,'width','100%');
  important(section,'background','#f8f8f8');
  important(section,'z-index','2');

  important(pin,'position','sticky');
  important(pin,'top','0');
  important(pin,'left','0');
  important(pin,'right','0');
  important(pin,'height',viewportUnit);
  important(pin,'min-height',viewportUnit);
  important(pin,'max-height',viewportUnit);
  important(pin,'width','100%');
  important(pin,'display','block');
  important(pin,'overflow','hidden');
  important(pin,'padding','0');
  important(pin,'box-sizing','border-box');
  important(pin,'background','#f8f8f8');
  important(pin,'transform','none');

  /* Section title floats above the slides instead of stealing height from the track. */
  if(head){
    important(head,'position','absolute');
    important(head,'z-index','40');
    important(head,'left','50%');
    important(head,'right','auto');
    important(head,'bottom','auto');
    important(head,'top',mobileMq.matches?'82px':'96px');
    important(head,'width',mobileMq.matches?'calc(100% - 36px)':'min(760px,calc(100% - 72px))');
    important(head,'max-width','760px');
    important(head,'margin','0');
    important(head,'padding','0');
    important(head,'text-align','center');
    important(head,'transform','translateX(-50%)');
    important(head,'box-sizing','border-box');
    important(head,'pointer-events','none');
  }

  /* The horizontal strip itself always fills the complete sticky viewport. */
  important(track,'position','absolute');
  important(track,'inset','0 auto auto 0');
  important(track,'display','flex');
  important(track,'grid-template-columns','none');
  important(track,'gap','0');
  important(track,'width','100vw');
  important(track,'max-width','none');
  important(track,'min-width','100vw');
  important(track,'height','100%');
  important(track,'min-height','100%');
  important(track,'max-height','100%');
  important(track,'margin','0');
  important(track,'padding','0');
  important(track,'align-items','stretch');
  important(track,'overflow','visible');
  important(track,'will-change','transform');
  important(track,'touch-action','pan-y');
  important(track,'transition','none');
  important(track,'box-sizing','border-box');

  function layoutSlides(){
    var mobile=mobileMq.matches;

    if(head){
      important(head,'top',mobile?'82px':'96px');
      important(head,'width',mobile?'calc(100% - 36px)':'min(760px,calc(100% - 72px))');
    }

    slides.forEach(function(slide,i){
      important(slide,'position','relative');
      important(slide,'inset','auto');
      important(slide,'flex','0 0 100vw');
      important(slide,'width','100vw');
      important(slide,'min-width','100vw');
      important(slide,'max-width','100vw');
      important(slide,'height','100%');
      important(slide,'min-height','100%');
      important(slide,'max-height','100%');
      important(slide,'margin','0');
      important(slide,'border-radius','0');
      important(slide,'box-sizing','border-box');
      important(slide,'overflow','hidden');
      important(slide,'opacity','1');
      important(slide,'visibility','visible');
      important(slide,'transform','none');

      if(mobile){
        important(slide,'display','flex');
        important(slide,'flex-direction','column');
        important(slide,'justify-content','space-between');
        important(slide,'align-items','stretch');
        important(slide,'gap','14px');
        important(slide,'padding','210px 18px max(22px,env(safe-area-inset-bottom))');
      }else{
        important(slide,'display','grid');
        important(slide,'grid-template-columns','minmax(280px,.78fr) minmax(0,1.22fr)');
        important(slide,'align-items','center');
        important(slide,'gap','clamp(32px,5vw,76px)');
        important(slide,'padding','clamp(180px,20vh,220px) max(var(--pad),calc((100vw - 1280px)/2 + var(--pad))) 34px');
      }

      slide.setAttribute('role','group');
      slide.setAttribute('aria-roledescription','slide');
      slide.setAttribute('aria-label',(i+1)+' di '+slides.length);
    });

    Array.prototype.forEach.call(track.querySelectorAll('.case-copy'),function(copy){
      important(copy,'position','relative');
      important(copy,'z-index','5');
      if(mobile){
        important(copy,'width','100%');
        important(copy,'max-width','620px');
        important(copy,'margin','0 auto');
        important(copy,'text-align','center');
        important(copy,'flex','0 0 auto');
      }
    });

    Array.prototype.forEach.call(track.querySelectorAll('.case-art'),function(art){
      important(art,'display','block');
      important(art,'width','100%');
      important(art,'opacity','1');
      important(art,'visibility','visible');
      important(art,'overflow',mobile?'hidden':'visible');
      if(mobile){
        important(art,'height','min(42vh,360px)');
        important(art,'min-height','240px');
        important(art,'max-height','42vh');
        important(art,'flex','0 0 auto');
        important(art,'margin','0 auto');
      }else{
        important(art,'height','min(48vh,460px)');
        important(art,'min-height','280px');
        important(art,'max-height','48vh');
      }
    });

    Array.prototype.forEach.call(track.querySelectorAll('.case-art > *'),function(el){
      important(el,'visibility','visible');
    });
  }

  var reduceMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var activeIndex=-1;
  var ticking=false;

  function cancelEntryAnimations(slide){
    if(!slide||!slide.querySelectorAll)return;
    Array.prototype.forEach.call(slide.querySelectorAll('.case-copy > *, .case-art > *'),function(el){
      if(el.getAnimations){el.getAnimations().forEach(function(anim){anim.cancel();});}
      el.style.removeProperty('opacity');
      el.style.removeProperty('translate');
    });
  }

  function animateSlide(index){
    if(reduceMotion||index<0||index>=slides.length)return;
    var slide=slides[index];
    cancelEntryAnimations(slide);

    Array.prototype.slice.call(slide.querySelectorAll('.case-copy > *')).forEach(function(el,i){
      if(!el.animate)return;
      el.animate([
        {opacity:0,translate:mobileMq.matches?'0 18px':'-24px 0'},
        {opacity:1,translate:'0 0'}
      ],{duration:520,delay:i*65,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'});
    });

    Array.prototype.slice.call(slide.querySelectorAll('.case-art > *')).forEach(function(el,i){
      if(!el.animate)return;
      el.animate([
        {opacity:0,translate:mobileMq.matches?'18px 12px':'34px 18px'},
        {opacity:1,translate:'0 0'}
      ],{duration:600,delay:80+i*55,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'});
    });
  }

  function updateHorizontalScroll(){
    ticking=false;

    var rect=section.getBoundingClientRect();
    var stageHeight=pin.getBoundingClientRect().height||window.innerHeight;
    var travel=Math.max(1,section.offsetHeight-stageHeight);
    var consumed=clamp(-rect.top,0,travel);
    var progress=consumed/travel;
    var x=-progress*(slides.length-1)*window.innerWidth;

    important(track,'transform','translate3d('+x+'px,0,0)');

    var visible=rect.top<stageHeight*.8 && rect.bottom>stageHeight*.2;
    if(!visible)return;

    var nextIndex=clamp(Math.round(progress*(slides.length-1)),0,slides.length-1);
    if(nextIndex!==activeIndex){
      activeIndex=nextIndex;
      slides.forEach(function(slide,i){
        var active=i===activeIndex;
        slide.classList.toggle('is-active',active);
        slide.setAttribute('aria-hidden',active?'false':'true');
        if(!active)cancelEntryAnimations(slide);
      });
      window.setTimeout(function(){animateSlide(activeIndex);},70);
    }
  }

  function requestUpdate(){
    if(ticking)return;
    ticking=true;
    window.requestAnimationFrame(updateHorizontalScroll);
  }

  function relayout(){
    layoutSlides();
    requestUpdate();
  }

  layoutSlides();
  window.addEventListener('scroll',requestUpdate,{passive:true});
  window.addEventListener('resize',relayout,{passive:true});
  window.addEventListener('orientationchange',relayout,{passive:true});
  if(window.visualViewport){window.visualViewport.addEventListener('resize',requestUpdate,{passive:true});}
  if(mobileMq.addEventListener){mobileMq.addEventListener('change',relayout);}

  requestUpdate();
})();
