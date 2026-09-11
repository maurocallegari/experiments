/* STEALTH static foundation: document scroll stays native; the friction section is an event-driven slider. */
(function(){
  var root=document.documentElement;
  root.classList.remove('is-loading');
  root.classList.add('is-loaded','static-ready');

  /* Native anchors only. No scroll choreography. */
  document.addEventListener('click',function(e){
    var a=e.target.closest('a[href^="#"]');
    if(!a)return;
    var id=a.getAttribute('href');
    if(!id||id==='#')return;
    var target=document.querySelector(id);
    if(!target)return;
    e.preventDefault();
    target.scrollIntoView({behavior:'auto',block:'start'});
  });

  var section=document.getElementById('attriti');
  var track=document.getElementById('caseTrack');
  if(!section||!track)return;

  var slides=Array.prototype.slice.call(track.querySelectorAll('.case'));
  if(slides.length<2)return;

  /* Slider CSS is intentionally local to this interaction layer. */
  var style=document.createElement('style');
  style.id='friction-slider-style';
  style.textContent=`
    .cases.slider-ready{overflow:hidden!important}
    .cases.slider-ready .cases-pin{overflow:hidden!important}
    .cases.slider-ready .track{
      --slider-x:0%;
      display:flex!important;
      grid-template-columns:none!important;
      gap:0!important;
      width:min(1280px,100%)!important;
      max-width:100%!important;
      align-items:stretch!important;
      transform:translate3d(var(--slider-x),0,0)!important;
      transition:transform .68s cubic-bezier(.22,1,.36,1)!important;
      will-change:transform!important;
      touch-action:pan-y!important;
    }
    .cases.slider-ready .case{
      flex:0 0 100%!important;
      width:100%!important;
      min-width:100%!important;
      max-width:100%!important;
      margin:0!important;
    }
    .case-slider-ui{
      width:min(1280px,100%);
      margin:28px auto 0;
      display:flex;
      align-items:center;
      justify-content:center;
      gap:16px;
      position:relative;
      z-index:20;
    }
    .case-slider-arrow{
      width:46px;height:46px;border-radius:50%;
      border:1px solid rgba(26,31,44,.14);
      background:#fff;color:#1a1f2c;
      display:grid;place-items:center;
      font:600 20px/1 Manrope,system-ui,sans-serif;
      cursor:pointer;
      transition:transform .2s ease,background .2s ease,opacity .2s ease!important;
      -webkit-tap-highlight-color:transparent;
    }
    .case-slider-arrow:hover:not(:disabled){transform:translateY(-2px)!important;background:#edf5f6}
    .case-slider-arrow:disabled{opacity:.28;cursor:default}
    .case-slider-dots{display:flex;align-items:center;gap:8px;padding:0 2px}
    .case-slider-dot{
      width:9px;height:9px;border:0;border-radius:999px;padding:0;
      background:#d4dadd;cursor:pointer;
      transition:width .25s ease,background .25s ease!important;
      -webkit-tap-highlight-color:transparent;
    }
    .case-slider-dot.is-active{width:28px;background:#7aaeb5}

    /* Entry animation: triggered by slide activation, never scrubbed by page scroll. */
    .cases.slider-ready .case.is-entering .case-copy>*,
    .cases.slider-ready .case.is-entering .case-art>*{
      animation-duration:.62s!important;
      animation-fill-mode:both!important;
      animation-timing-function:cubic-bezier(.22,1,.36,1)!important;
    }
    .cases.slider-ready .case.is-entering .case-copy>*{
      animation-name:frictionCopyIn!important;
    }
    .cases.slider-ready .case.is-entering .case-copy>*:nth-child(2){animation-delay:.06s!important}
    .cases.slider-ready .case.is-entering .case-copy>*:nth-child(3){animation-delay:.12s!important}
    .cases.slider-ready .case.is-entering .case-art>*{
      animation-name:frictionArtIn!important;
    }
    .cases.slider-ready .case.is-entering .case-art>*:nth-child(2){animation-delay:.05s!important}
    .cases.slider-ready .case.is-entering .case-art>*:nth-child(3){animation-delay:.10s!important}
    .cases.slider-ready .case.is-entering .case-art>*:nth-child(4){animation-delay:.15s!important}
    .cases.slider-ready .case.is-entering .case-art>*:nth-child(5){animation-delay:.20s!important}
    .cases.slider-ready .case.is-entering .case-art>*:nth-child(6){animation-delay:.25s!important}
    @keyframes frictionCopyIn{
      from{opacity:0;translate:-24px 0}
      to{opacity:1;translate:0 0}
    }
    @keyframes frictionArtIn{
      from{opacity:0;translate:28px 18px}
      to{opacity:1;translate:0 0}
    }
    @media(max-width:700px){
      .cases.slider-ready{padding-left:0!important;padding-right:0!important}
      .cases.slider-ready .cases-head{padding-left:18px!important;padding-right:18px!important}
      .cases.slider-ready .track{width:100%!important;max-width:none!important}
      .cases.slider-ready .case{
        border-left:0!important;border-right:0!important;border-radius:0!important;
        padding-left:18px!important;padding-right:18px!important;
      }
      .case-slider-ui{margin-top:20px;gap:14px}
      .case-slider-arrow{width:44px;height:44px}
      .cases.slider-ready .case.is-entering .case-copy>*{animation-name:frictionCopyInMobile!important}
      .cases.slider-ready .case.is-entering .case-art>*{animation-name:frictionArtInMobile!important}
      @keyframes frictionCopyInMobile{
        from{opacity:0;translate:0 20px}
        to{opacity:1;translate:0 0}
      }
      @keyframes frictionArtInMobile{
        from{opacity:0;translate:18px 14px}
        to{opacity:1;translate:0 0}
      }
    }
    @media(prefers-reduced-motion:reduce){
      .cases.slider-ready .track{transition:none!important}
      .cases.slider-ready .case.is-entering .case-copy>*,
      .cases.slider-ready .case.is-entering .case-art>*{animation:none!important}
    }
  `;
  document.head.appendChild(style);

  section.classList.add('slider-ready');
  section.setAttribute('role','region');
  section.setAttribute('aria-roledescription','carousel');
  section.setAttribute('aria-label','Dove si perde tempo, davvero');
  section.tabIndex=0;

  var ui=document.createElement('div');
  ui.className='case-slider-ui';
  ui.innerHTML='<button class="case-slider-arrow case-prev" type="button" aria-label="Slide precedente">←</button><div class="case-slider-dots" role="tablist" aria-label="Seleziona una slide"></div><button class="case-slider-arrow case-next" type="button" aria-label="Slide successiva">→</button>';
  track.insertAdjacentElement('afterend',ui);

  var prev=ui.querySelector('.case-prev');
  var next=ui.querySelector('.case-next');
  var dotsWrap=ui.querySelector('.case-slider-dots');
  var dots=slides.map(function(slide,i){
    var dot=document.createElement('button');
    dot.type='button';
    dot.className='case-slider-dot';
    dot.setAttribute('role','tab');
    dot.setAttribute('aria-label','Mostra slide '+(i+1));
    dot.addEventListener('click',function(){go(i,true)});
    dotsWrap.appendChild(dot);
    slide.setAttribute('role','group');
    slide.setAttribute('aria-roledescription','slide');
    slide.setAttribute('aria-label',(i+1)+' di '+slides.length);
    return dot;
  });

  var index=0;
  var hasEntered=false;
  var animationTimer=0;

  function animateActive(){
    var slide=slides[index];
    window.clearTimeout(animationTimer);
    slide.classList.remove('is-entering');
    void slide.offsetWidth;
    slide.classList.add('is-entering');
    animationTimer=window.setTimeout(function(){slide.classList.remove('is-entering')},950);
  }

  function render(animate){
    track.style.setProperty('--slider-x',(-index*100)+'%');
    slides.forEach(function(slide,i){
      var active=i===index;
      slide.classList.toggle('is-active',active);
      slide.setAttribute('aria-hidden',active?'false':'true');
    });
    dots.forEach(function(dot,i){
      var active=i===index;
      dot.classList.toggle('is-active',active);
      dot.setAttribute('aria-selected',active?'true':'false');
      dot.tabIndex=active?0:-1;
    });
    prev.disabled=index===0;
    next.disabled=index===slides.length-1;
    if(animate&&hasEntered)animateActive();
  }

  function go(nextIndex,animate){
    nextIndex=Math.max(0,Math.min(slides.length-1,nextIndex));
    if(nextIndex===index){
      if(animate&&hasEntered)animateActive();
      return;
    }
    index=nextIndex;
    render(animate!==false);
  }

  prev.addEventListener('click',function(){go(index-1,true)});
  next.addEventListener('click',function(){go(index+1,true)});
  section.addEventListener('keydown',function(e){
    if(e.key==='ArrowLeft'){e.preventDefault();go(index-1,true)}
    if(e.key==='ArrowRight'){e.preventDefault();go(index+1,true)}
  });

  /* Horizontal swipe, while preserving vertical page scrolling. */
  var sx=0,sy=0,tracking=false;
  track.addEventListener('touchstart',function(e){
    if(!e.touches||e.touches.length!==1)return;
    sx=e.touches[0].clientX; sy=e.touches[0].clientY; tracking=true;
  },{passive:true});
  track.addEventListener('touchend',function(e){
    if(!tracking||!e.changedTouches||!e.changedTouches.length)return;
    tracking=false;
    var dx=e.changedTouches[0].clientX-sx;
    var dy=e.changedTouches[0].clientY-sy;
    if(Math.abs(dx)<48||Math.abs(dx)<=Math.abs(dy)*1.15)return;
    if(dx<0)go(index+1,true); else go(index-1,true);
  },{passive:true});

  /* Only the trigger is viewport entry; animation progress is time-based, not scroll-based. */
  if('IntersectionObserver' in window){
    var observer=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(!hasEntered&&entry.isIntersecting&&entry.intersectionRatio>=0.22){
          hasEntered=true;
          section.classList.add('has-entered');
          animateActive();
          observer.disconnect();
        }
      });
    },{threshold:[0,.22,.5]});
    observer.observe(section);
  }else{
    hasEntered=true;
    section.classList.add('has-entered');
    window.setTimeout(animateActive,80);
  }

  render(false);
})();
