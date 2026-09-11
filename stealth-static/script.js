/* STEALTH static foundation: native page scroll + scroll-driven friction track. */
(function(){
  'use strict';

  var root=document.documentElement;
  root.classList.remove('is-loading');
  root.classList.add('is-loaded','static-ready');

  function important(el,prop,value){
    if(el)el.style.setProperty(prop,value,'important');
  }

  var supportsSvh=window.CSS&&CSS.supports&&CSS.supports('height','100svh');
  var viewportUnit=supportsSvh?'100svh':'100vh';
  var viewportSuffix=supportsSvh?'svh':'vh';

  /* Every normal section owns at least one full viewport. */
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

  /* Remove any controls left by earlier carousel experiments. */
  Array.prototype.forEach.call(section.querySelectorAll('.case-slider-ui'),function(el){el.remove();});

  section.classList.add('slider-ready','scroll-slider');
  section.setAttribute('role','region');
  section.setAttribute('aria-label','Dove si perde tempo, davvero');

  /*
   * The visible stage is ALWAYS one viewport tall.
   * The outer wrapper is N viewports tall only to provide native vertical scroll distance.
   * With 4 slides: 400svh wrapper - 100svh sticky stage = 300svh travel,
   * exactly one vertical viewport of travel for each horizontal slide change.
   */
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
  important(pin,'display','flex');
  important(pin,'flex-direction','column');
  important(pin,'align-items','stretch');
  important(pin,'overflow','hidden');
  important(pin,'padding','clamp(78px,8vh,96px) 0 clamp(18px,2.5vh,30px)');
  important(pin,'box-sizing','border-box');
  important(pin,'background','#f8f8f8');
  important(pin,'transform','none');

  if(head){
    important(head,'position','relative');
    important(head,'inset','auto');
    important(head,'flex','0 0 auto');
    important(head,'width','min(760px,calc(100% - 36px))');
    important(head,'max-width','none');
    important(head,'margin','0 auto clamp(18px,2.3vh,28px)');
    important(head,'padding','0');
    important(head,'text-align','center');
    important(head,'transform','none');
    important(head,'box-sizing','border-box');
  }

  /* Full-width horizontal strip. No buttons, no dots, no carousel chrome. */
  important(track,'position','relative');
  important(track,'inset','auto');
  important(track,'display','flex');
  important(track,'flex','1 1 0');
  important(track,'grid-template-columns','none');
  important(track,'gap','0');
  important(track,'width','100vw');
  important(track,'max-width','none');
  important(track,'min-width','100vw');
  important(track,'height','auto');
  important(track,'min-height','0');
  important(track,'margin','0');
  important(track,'padding','0');
  important(track,'align-items','stretch');
  important(track,'overflow','visible');
  important(track,'will-change','transform');
  important(track,'touch-action','pan-y');
  important(track,'transition','none');
  important(track,'box-sizing','border-box');

  slides.forEach(function(slide,i){
    important(slide,'position','relative');
    important(slide,'inset','auto');
    important(slide,'flex','0 0 100vw');
    important(slide,'width','100vw');
    important(slide,'min-width','100vw');
    important(slide,'max-width','100vw');
    important(slide,'height','100%');
    important(slide,'min-height','0');
    important(slide,'max-height','none');
    important(slide,'margin','0');
    important(slide,'border-radius','0');
    important(slide,'box-sizing','border-box');
    important(slide,'overflow','hidden');
    important(slide,'padding','clamp(22px,3.5vw,56px) max(var(--pad),calc((100vw - 1280px)/2 + var(--pad)))');
    important(slide,'opacity','1');
    important(slide,'visibility','visible');
    important(slide,'transform','none');
    slide.setAttribute('role','group');
    slide.setAttribute('aria-roledescription','slide');
    slide.setAttribute('aria-label',(i+1)+' di '+slides.length);
  });

  /* Every slide has its own artwork; force it to stay visible inside the 100vh stage. */
  Array.prototype.forEach.call(track.querySelectorAll('.case-art'),function(art){
    important(art,'display','block');
    important(art,'width','100%');
    important(art,'height','min(45vh,430px)');
    important(art,'min-height','240px');
    important(art,'max-height','45vh');
    important(art,'opacity','1');
    important(art,'visibility','visible');
    important(art,'overflow','visible');
  });
  Array.prototype.forEach.call(track.querySelectorAll('.case-art > *'),function(el){
    important(el,'visibility','visible');
  });

  var reduceMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var activeIndex=-1;
  var ticking=false;

  function cancelEntryAnimations(slide){
    if(!slide||!slide.querySelectorAll)return;
    Array.prototype.forEach.call(slide.querySelectorAll('.case-copy > *, .case-art > *'),function(el){
      if(el.getAnimations){
        el.getAnimations().forEach(function(anim){anim.cancel();});
      }
      el.style.removeProperty('opacity');
      el.style.removeProperty('translate');
    });
  }

  /* Entry motion starts when a new slide becomes active; it is time-based, never scrubbed. */
  function animateSlide(index){
    if(reduceMotion||index<0||index>=slides.length)return;
    var slide=slides[index];
    cancelEntryAnimations(slide);

    var copy=Array.prototype.slice.call(slide.querySelectorAll('.case-copy > *'));
    var art=Array.prototype.slice.call(slide.querySelectorAll('.case-art > *'));

    copy.forEach(function(el,i){
      if(!el.animate)return;
      el.animate([
        {opacity:0,translate:'-24px 0'},
        {opacity:1,translate:'0 0'}
      ],{
        duration:520,
        delay:i*65,
        easing:'cubic-bezier(.22,1,.36,1)',
        fill:'both'
      });
    });

    art.forEach(function(el,i){
      if(!el.animate)return;
      el.animate([
        {opacity:0,translate:'34px 18px'},
        {opacity:1,translate:'0 0'}
      ],{
        duration:600,
        delay:80+i*55,
        easing:'cubic-bezier(.22,1,.36,1)',
        fill:'both'
      });
    });
  }

  function clamp(value,min,max){return Math.max(min,Math.min(max,value));}

  function updateHorizontalScroll(){
    ticking=false;

    var rect=section.getBoundingClientRect();
    var stageHeight=pin.getBoundingClientRect().height||window.innerHeight;
    var travel=Math.max(1,section.offsetHeight-stageHeight);
    var consumed=clamp(-rect.top,0,travel);
    var progress=consumed/travel;
    var x=-progress*(slides.length-1)*window.innerWidth;

    important(track,'transform','translate3d('+x+'px,0,0)');

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

  window.addEventListener('scroll',requestUpdate,{passive:true});
  window.addEventListener('resize',requestUpdate,{passive:true});
  window.addEventListener('orientationchange',requestUpdate,{passive:true});

  requestUpdate();
})();
