/* STEALTH static foundation: native page scroll + event-driven friction slider. */
(function(){
  'use strict';

  var root=document.documentElement;
  root.classList.remove('is-loading');
  root.classList.add('is-loaded','static-ready');

  function important(el,prop,value){
    if(el)el.style.setProperty(prop,value,'important');
  }

  var viewportUnit=(window.CSS&&CSS.supports&&CSS.supports('height','100svh'))?'100svh':'100vh';

  /* Structural rule: every main section owns at least one full viewport. */
  Array.prototype.forEach.call(document.querySelectorAll('main > section'),function(section){
    important(section,'position','relative');
    important(section,'min-height',viewportUnit);
    important(section,'margin','0');
    important(section,'box-sizing','border-box');
  });

  /* Full-height inner stages for the normal sections. */
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
  if(slides.length<2)return;

  /* The friction section is exactly one viewport and contains the carousel completely. */
  section.classList.add('slider-ready');
  important(section,'height',viewportUnit);
  important(section,'min-height',viewportUnit);
  important(section,'max-height',viewportUnit);
  important(section,'padding','0');
  important(section,'overflow','hidden');
  important(section,'width','100%');
  important(section,'background','#f8f8f8');
  important(section,'z-index','2');

  if(pin){
    important(pin,'height','100%');
    important(pin,'min-height','0');
    important(pin,'width','100%');
    important(pin,'display','flex');
    important(pin,'flex-direction','column');
    important(pin,'align-items','stretch');
    important(pin,'overflow','hidden');
    important(pin,'padding','clamp(82px,9vh,104px) 0 16px');
    important(pin,'box-sizing','border-box');
  }

  if(head){
    important(head,'flex','0 0 auto');
    important(head,'width','min(760px,calc(100% - 36px))');
    important(head,'margin','0 auto clamp(18px,2.5vh,30px)');
    important(head,'padding','0');
    important(head,'box-sizing','border-box');
  }

  /* True full-viewport-width horizontal track. */
  important(track,'position','relative');
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
  important(track,'transition','transform 680ms cubic-bezier(.22,1,.36,1)');
  important(track,'box-sizing','border-box');

  slides.forEach(function(slide){
    important(slide,'flex','0 0 100vw');
    important(slide,'width','100vw');
    important(slide,'min-width','100vw');
    important(slide,'max-width','100vw');
    important(slide,'height','100%');
    important(slide,'min-height','0');
    important(slide,'margin','0');
    important(slide,'border-radius','0');
    important(slide,'box-sizing','border-box');
    important(slide,'overflow','hidden');
    important(slide,'padding','clamp(28px,4vw,64px) max(var(--pad),calc((100vw - 1280px)/2 + var(--pad)))');
  });

  /* Keep the artwork inside the viewport-height slide. */
  Array.prototype.forEach.call(track.querySelectorAll('.case-art'),function(art){
    important(art,'height','min(46vh,430px)');
    important(art,'min-height','0');
    important(art,'max-height','46vh');
  });

  section.setAttribute('role','region');
  section.setAttribute('aria-roledescription','carousel');
  section.setAttribute('aria-label','Dove si perde tempo, davvero');
  section.tabIndex=0;

  var ui=document.createElement('div');
  ui.className='case-slider-ui';
  ui.style.cssText='width:100%;flex:0 0 62px;margin:0;display:flex;align-items:center;justify-content:center;gap:14px;position:relative;z-index:30;box-sizing:border-box;';

  var prev=document.createElement('button');
  var next=document.createElement('button');
  var dotsWrap=document.createElement('div');
  prev.type=next.type='button';
  prev.textContent='←';
  next.textContent='→';
  prev.setAttribute('aria-label','Slide precedente');
  next.setAttribute('aria-label','Slide successiva');
  dotsWrap.setAttribute('role','tablist');
  dotsWrap.setAttribute('aria-label','Seleziona una slide');
  dotsWrap.style.cssText='display:flex;align-items:center;gap:8px;';

  [prev,next].forEach(function(btn){
    btn.style.cssText='width:46px;height:46px;border-radius:50%;border:1px solid rgba(26,31,44,.14);background:#fff;color:#1a1f2c;display:grid;place-items:center;font:600 20px/1 Manrope,system-ui,sans-serif;cursor:pointer;-webkit-tap-highlight-color:transparent;';
  });

  ui.appendChild(prev);
  ui.appendChild(dotsWrap);
  ui.appendChild(next);
  track.insertAdjacentElement('afterend',ui);

  var dots=slides.map(function(slide,i){
    var dot=document.createElement('button');
    dot.type='button';
    dot.setAttribute('role','tab');
    dot.setAttribute('aria-label','Mostra slide '+(i+1));
    dot.style.cssText='width:9px;height:9px;border:0;border-radius:999px;padding:0;background:#d4dadd;cursor:pointer;-webkit-tap-highlight-color:transparent;';
    dot.addEventListener('click',function(){go(i,true);});
    dotsWrap.appendChild(dot);

    slide.setAttribute('role','group');
    slide.setAttribute('aria-roledescription','slide');
    slide.setAttribute('aria-label',(i+1)+' di '+slides.length);
    return dot;
  });

  var index=0;
  var entered=false;
  var reduceMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  function animateActive(){
    if(reduceMotion)return;
    var slide=slides[index];
    cancelEntryAnimations(slide);

    var copy=Array.prototype.slice.call(slide.querySelectorAll('.case-copy > *'));
    var art=Array.prototype.slice.call(slide.querySelectorAll('.case-art > *'));

    copy.forEach(function(el,i){
      el.animate([
        {opacity:0,translate:'-24px 0'},
        {opacity:1,translate:'0 0'}
      ],{
        duration:560,
        delay:i*70,
        easing:'cubic-bezier(.22,1,.36,1)',
        fill:'both'
      });
    });

    art.forEach(function(el,i){
      el.animate([
        {opacity:0,translate:'30px 18px'},
        {opacity:1,translate:'0 0'}
      ],{
        duration:620,
        delay:90+i*55,
        easing:'cubic-bezier(.22,1,.36,1)',
        fill:'both'
      });
    });
  }

  function render(animate){
    important(track,'transform','translate3d('+(-index*100)+'vw,0,0)');

    slides.forEach(function(slide,i){
      var active=i===index;
      slide.classList.toggle('is-active',active);
      slide.setAttribute('aria-hidden',active?'false':'true');
      if(!active)cancelEntryAnimations(slide);
    });

    dots.forEach(function(dot,i){
      var active=i===index;
      dot.setAttribute('aria-selected',active?'true':'false');
      dot.tabIndex=active?0:-1;
      dot.style.width=active?'28px':'9px';
      dot.style.background=active?'#7aaeb5':'#d4dadd';
    });

    prev.disabled=index===0;
    next.disabled=index===slides.length-1;
    prev.style.opacity=prev.disabled?'.28':'1';
    next.style.opacity=next.disabled?'.28':'1';
    prev.style.cursor=prev.disabled?'default':'pointer';
    next.style.cursor=next.disabled?'default':'pointer';

    if(animate&&entered){
      window.setTimeout(animateActive,120);
    }
  }

  function go(nextIndex,animate){
    nextIndex=Math.max(0,Math.min(slides.length-1,nextIndex));
    if(nextIndex===index){
      if(animate&&entered)animateActive();
      return;
    }
    index=nextIndex;
    render(animate!==false);
  }

  prev.addEventListener('click',function(){go(index-1,true);});
  next.addEventListener('click',function(){go(index+1,true);});

  section.addEventListener('keydown',function(e){
    if(e.key==='ArrowLeft'){
      e.preventDefault();
      go(index-1,true);
    }else if(e.key==='ArrowRight'){
      e.preventDefault();
      go(index+1,true);
    }
  });

  var sx=0,sy=0,tracking=false;
  track.addEventListener('touchstart',function(e){
    if(!e.touches||e.touches.length!==1)return;
    sx=e.touches[0].clientX;
    sy=e.touches[0].clientY;
    tracking=true;
  },{passive:true});

  track.addEventListener('touchend',function(e){
    if(!tracking||!e.changedTouches||!e.changedTouches.length)return;
    tracking=false;
    var dx=e.changedTouches[0].clientX-sx;
    var dy=e.changedTouches[0].clientY-sy;
    if(Math.abs(dx)<44||Math.abs(dx)<=Math.abs(dy)*1.15)return;
    if(dx<0)go(index+1,true);
    else go(index-1,true);
  },{passive:true});

  if('IntersectionObserver' in window){
    var observer=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(!entered&&entry.isIntersecting){
          entered=true;
          window.setTimeout(animateActive,100);
          observer.disconnect();
        }
      });
    },{threshold:.18});
    observer.observe(section);
  }else{
    entered=true;
    window.setTimeout(animateActive,100);
  }

  render(false);
})();
