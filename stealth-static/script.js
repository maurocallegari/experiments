/* STEALTH static foundation: native page scroll + snapped hybrid friction scrollytelling. */
(function(){
  'use strict';

  var root=document.documentElement;
  root.classList.remove('is-loading');
  root.classList.add('is-loaded','static-ready');

  function important(el,prop,value){
    if(el)el.style.setProperty(prop,value,'important');
  }
  function clamp(value,min,max){return Math.max(min,Math.min(max,value));}

  var mobileMq=window.matchMedia('(max-width:700px)');
  var reduceMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Every normal section still owns at least one viewport. */
  Array.prototype.forEach.call(document.querySelectorAll('main > section'),function(section){
    important(section,'position','relative');
    important(section,'min-height','100vh');
    important(section,'margin','0');
    important(section,'box-sizing','border-box');
  });
  Array.prototype.forEach.call(document.querySelectorAll('main > section:not(#attriti) > .pin, main > section:not(#attriti) > .scene-view'),function(stage){
    important(stage,'min-height','100vh');
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
  section.classList.add('slider-ready','scroll-slider','swipe-slider');
  section.setAttribute('role','region');
  section.setAttribute('aria-label','Dove si perde tempo, davvero');

  var stageHeight=window.innerHeight;
  var sectionTop=0;
  var travel=1;
  var activeIndex=-1;
  var ticking=false;
  var snapTimer=0;
  var snapping=false;
  var snapReleaseTimer=0;
  var touching=false;
  var horizontalDrag=false;
  var touchStartX=0;
  var touchStartY=0;
  var touchStartTime=0;
  var dragBaseX=0;
  var latestProgress=0;

  function realViewportHeight(){
    var vv=window.visualViewport;
    var h=vv&&vv.height?vv.height:window.innerHeight;
    return Math.max(420,Math.round(h));
  }

  function currentSectionTop(){
    return Math.round(window.scrollY+section.getBoundingClientRect().top);
  }

  function layoutSlides(){
    var mobile=mobileMq.matches;
    stageHeight=realViewportHeight();
    travel=stageHeight*(slides.length-1);

    /* Exact px heights remove the mobile svh/dvh address-bar gap. */
    important(section,'height',(stageHeight*slides.length)+'px');
    important(section,'min-height',(stageHeight*slides.length)+'px');
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
    important(pin,'height',stageHeight+'px');
    important(pin,'min-height',stageHeight+'px');
    important(pin,'max-height',stageHeight+'px');
    important(pin,'width','100%');
    important(pin,'display','block');
    important(pin,'overflow','hidden');
    important(pin,'padding','0');
    important(pin,'box-sizing','border-box');
    important(pin,'background','#f8f8f8');
    important(pin,'transform','none');
    important(pin,'overscroll-behavior-x','contain');

    if(head){
      important(head,'position','absolute');
      important(head,'z-index','40');
      important(head,'left','50%');
      important(head,'right','auto');
      important(head,'bottom','auto');
      important(head,'top',mobile?'72px':'92px');
      important(head,'width',mobile?'calc(100% - 36px)':'min(760px,calc(100% - 72px))');
      important(head,'max-width','760px');
      important(head,'margin','0');
      important(head,'padding','0');
      important(head,'text-align','center');
      important(head,'transform','translateX(-50%)');
      important(head,'box-sizing','border-box');
      important(head,'pointer-events','none');
    }

    important(track,'position','absolute');
    important(track,'left','0');
    important(track,'top','0');
    important(track,'right','auto');
    important(track,'bottom','auto');
    important(track,'display','flex');
    important(track,'grid-template-columns','none');
    important(track,'gap','0');
    important(track,'width','100vw');
    important(track,'max-width','none');
    important(track,'min-width','100vw');
    important(track,'height',stageHeight+'px');
    important(track,'min-height',stageHeight+'px');
    important(track,'max-height',stageHeight+'px');
    important(track,'margin','0');
    important(track,'padding','0');
    important(track,'align-items','stretch');
    important(track,'overflow','visible');
    important(track,'will-change','transform');
    important(track,'touch-action','pan-y');
    important(track,'transition','none');
    important(track,'box-sizing','border-box');
    important(track,'overscroll-behavior-x','contain');

    slides.forEach(function(slide,i){
      important(slide,'position','relative');
      important(slide,'inset','auto');
      important(slide,'flex','0 0 100vw');
      important(slide,'width','100vw');
      important(slide,'min-width','100vw');
      important(slide,'max-width','100vw');
      important(slide,'height',stageHeight+'px');
      important(slide,'min-height',stageHeight+'px');
      important(slide,'max-height',stageHeight+'px');
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
        important(slide,'justify-content','flex-start');
        important(slide,'align-items','stretch');
        important(slide,'gap','12px');
        important(slide,'padding','clamp(174px,24vh,206px) 18px max(14px,env(safe-area-inset-bottom))');
      }else{
        important(slide,'display','grid');
        important(slide,'grid-template-columns','minmax(280px,.78fr) minmax(0,1.22fr)');
        important(slide,'align-items','center');
        important(slide,'gap','clamp(32px,5vw,76px)');
        important(slide,'padding','clamp(176px,19vh,215px) max(var(--pad),calc((100vw - 1280px)/2 + var(--pad))) 28px');
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
      important(art,'margin','0 auto');
      if(mobile){
        var artHeight=Math.max(230,Math.min(330,Math.round(stageHeight*.36)));
        important(art,'height',artHeight+'px');
        important(art,'min-height',artHeight+'px');
        important(art,'max-height',artHeight+'px');
        important(art,'flex','0 0 '+artHeight+'px');
      }else{
        important(art,'height','min(48vh,460px)');
        important(art,'min-height','280px');
        important(art,'max-height','48vh');
      }
    });

    Array.prototype.forEach.call(track.querySelectorAll('.case-art > *'),function(el){
      important(el,'visibility','visible');
    });

    sectionTop=currentSectionTop();
  }

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
        {opacity:0,translate:mobileMq.matches?'0 16px':'-24px 0'},
        {opacity:1,translate:'0 0'}
      ],{duration:500,delay:i*60,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'});
    });

    Array.prototype.slice.call(slide.querySelectorAll('.case-art > *')).forEach(function(el,i){
      if(!el.animate)return;
      el.animate([
        {opacity:0,translate:mobileMq.matches?'16px 10px':'34px 18px'},
        {opacity:1,translate:'0 0'}
      ],{duration:580,delay:70+i*50,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'});
    });
  }

  function setActive(index,animate){
    index=clamp(index,0,slides.length-1);
    if(index===activeIndex)return;
    activeIndex=index;
    slides.forEach(function(slide,i){
      var active=i===activeIndex;
      slide.classList.toggle('is-active',active);
      slide.setAttribute('aria-hidden',active?'false':'true');
      if(!active)cancelEntryAnimations(slide);
    });
    if(animate){window.setTimeout(function(){animateSlide(activeIndex);},60);}
  }

  function transformForProgress(progress){
    return -progress*(slides.length-1)*window.innerWidth;
  }

  function updateHorizontalScroll(){
    ticking=false;
    var y=window.scrollY;
    var consumed=clamp(y-sectionTop,0,travel);
    latestProgress=travel?consumed/travel:0;

    if(!horizontalDrag){
      important(track,'transform','translate3d('+transformForProgress(latestProgress)+'px,0,0)');
    }

    var rect=section.getBoundingClientRect();
    var visible=rect.top<stageHeight*.9&&rect.bottom>stageHeight*.1;
    if(!visible)return;

    setActive(Math.round(latestProgress*(slides.length-1)),true);
  }

  function requestUpdate(){
    if(ticking)return;
    ticking=true;
    window.requestAnimationFrame(updateHorizontalScroll);
  }

  function targetYForIndex(index){
    return sectionTop+clamp(index,0,slides.length-1)*stageHeight;
  }

  function releaseSnapSoon(){
    window.clearTimeout(snapReleaseTimer);
    snapReleaseTimer=window.setTimeout(function(){snapping=false;},700);
  }

  function snapToIndex(index,smooth){
    index=clamp(index,0,slides.length-1);
    var target=targetYForIndex(index);
    snapping=true;
    setActive(index,true);
    window.scrollTo({top:target,behavior:(smooth&&!reduceMotion)?'smooth':'auto'});
    releaseSnapSoon();
  }

  function maybeSnapAfterScroll(){
    window.clearTimeout(snapTimer);
    if(touching||horizontalDrag||snapping)return;
    snapTimer=window.setTimeout(function(){
      var y=window.scrollY;
      var start=sectionTop-stageHeight*.04;
      var end=sectionTop+travel+stageHeight*.10;
      if(y<start||y>end)return;
      var nearest=clamp(Math.round((y-sectionTop)/stageHeight),0,slides.length-1);
      var target=targetYForIndex(nearest);
      if(Math.abs(target-y)>3)snapToIndex(nearest,true);
    },150);
  }

  function onScroll(){
    requestUpdate();
    maybeSnapAfterScroll();
  }

  /* Horizontal swipe and vertical scrolling share one state: the page scroll position. */
  track.addEventListener('touchstart',function(e){
    if(!e.touches||e.touches.length!==1)return;
    touching=true;
    horizontalDrag=false;
    touchStartX=e.touches[0].clientX;
    touchStartY=e.touches[0].clientY;
    touchStartTime=Date.now();
    var consumed=clamp(window.scrollY-sectionTop,0,travel);
    latestProgress=travel?consumed/travel:0;
    dragBaseX=transformForProgress(latestProgress);
    window.clearTimeout(snapTimer);
  },{passive:true});

  track.addEventListener('touchmove',function(e){
    if(!touching||!e.touches||e.touches.length!==1)return;
    var dx=e.touches[0].clientX-touchStartX;
    var dy=e.touches[0].clientY-touchStartY;

    if(!horizontalDrag){
      if(Math.abs(dx)<8&&Math.abs(dy)<8)return;
      if(Math.abs(dx)<=Math.abs(dy)*1.08)return;
      horizontalDrag=true;
    }

    if(horizontalDrag){
      if(e.cancelable)e.preventDefault();
      var minX=-(slides.length-1)*window.innerWidth;
      var preview=clamp(dragBaseX+dx,minX,0);
      important(track,'transform','translate3d('+preview+'px,0,0)');
    }
  },{passive:false});

  track.addEventListener('touchend',function(e){
    if(!touching)return;
    touching=false;

    var changed=e.changedTouches&&e.changedTouches[0];
    var dx=changed?changed.clientX-touchStartX:0;
    var dy=changed?changed.clientY-touchStartY:0;
    var elapsed=Math.max(1,Date.now()-touchStartTime);
    var velocity=Math.abs(dx)/elapsed;

    if(horizontalDrag){
      horizontalDrag=false;
      var baseIndex=clamp(Math.round(latestProgress*(slides.length-1)),0,slides.length-1);
      var decisive=Math.abs(dx)>Math.min(72,window.innerWidth*.16)||velocity>.38;
      var nextIndex=baseIndex;
      if(decisive&&Math.abs(dx)>Math.abs(dy))nextIndex=dx<0?baseIndex+1:baseIndex-1;
      snapToIndex(nextIndex,true);
    }else{
      maybeSnapAfterScroll();
    }
  },{passive:true});

  track.addEventListener('touchcancel',function(){
    touching=false;
    horizontalDrag=false;
    requestUpdate();
    maybeSnapAfterScroll();
  },{passive:true});

  function relayout(){
    var beforeIndex=clamp(Math.round(latestProgress*(slides.length-1)),0,slides.length-1);
    layoutSlides();
    /* Preserve the logical slide across address-bar/orientation changes. */
    if(window.scrollY>=sectionTop-stageHeight&&window.scrollY<=sectionTop+travel+stageHeight){
      window.scrollTo({top:targetYForIndex(beforeIndex),behavior:'auto'});
    }
    requestUpdate();
  }

  layoutSlides();
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',relayout,{passive:true});
  window.addEventListener('orientationchange',function(){window.setTimeout(relayout,120);},{passive:true});
  if(window.visualViewport){
    var vvTimer=0;
    window.visualViewport.addEventListener('resize',function(){
      window.clearTimeout(vvTimer);
      vvTimer=window.setTimeout(relayout,100);
    },{passive:true});
  }
  if(mobileMq.addEventListener)mobileMq.addEventListener('change',relayout);

  requestUpdate();
})();
