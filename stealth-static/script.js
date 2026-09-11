/* STEALTH static foundation: intentionally no scroll choreography. */
(function(){
  var root=document.documentElement;
  root.classList.remove('is-loading');
  root.classList.add('is-loaded','static-ready');

  /* Native anchors only. Keep navigation deterministic and browser-owned. */
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
})();
