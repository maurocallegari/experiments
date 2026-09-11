(function(){
  'use strict';
  var section=document.getElementById('attriti');
  var track=document.getElementById('casesTrack');
  if(!section||!track)return;
  var slides=Array.prototype.slice.call(track.querySelectorAll('.case-slide'));
  var active=-1;
  var ticking=false;

  function clamp(v,min,max){return Math.max(min,Math.min(max,v));}

  function activate(index){
    if(index===active)return;
    active=index;
    slides.forEach(function(slide,i){
      var isActive=i===index;
      slide.classList.toggle('is-active',isActive);
      slide.setAttribute('aria-hidden',isActive?'false':'true');
      if(isActive){
        slide.classList.remove('entering');
        void slide.offsetWidth;
        slide.classList.add('entering');
      }else{
        slide.classList.remove('entering');
      }
    });
  }

  function update(){
    ticking=false;
    var rect=section.getBoundingClientRect();
    var viewport=window.visualViewport?window.visualViewport.height:window.innerHeight;
    var travel=Math.max(1,section.offsetHeight-viewport);
    var progress=clamp(-rect.top/travel,0,1);
    var x=-progress*(slides.length-1)*window.innerWidth;
    track.style.transform='translate3d('+x+'px,0,0)';
    activate(clamp(Math.round(progress*(slides.length-1)),0,slides.length-1));
  }

  function requestUpdate(){
    if(ticking)return;
    ticking=true;
    requestAnimationFrame(update);
  }

  window.addEventListener('scroll',requestUpdate,{passive:true});
  window.addEventListener('resize',requestUpdate,{passive:true});
  window.addEventListener('orientationchange',requestUpdate,{passive:true});
  if(window.visualViewport){window.visualViewport.addEventListener('resize',requestUpdate,{passive:true});}
  requestUpdate();
})();
