/* ============================================================
   STEALTH — motore a scene bloccate
   Lenis (venduto) + rAF, fade in/out per slide, beats interni
   ============================================================ */
(function () {
'use strict';

var doc = document;
var qs = function (s, c) { return (c || doc).querySelector(s); };
var qsa = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
var lerp = function (a, b, t) { return a + (b - a) * t; };
var norm = function (v, a, b) { return clamp((v - a) / (b - a), 0, 1); };
var easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };
var easeInOut = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
var win = function (p, a, b) { return easeOut(norm(p, a, b)); };

var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var FINE = window.matchMedia('(pointer: fine)').matches;
var mqMob = window.matchMedia('(max-width: 899px)');
var YO = (location.search.match(/[?&]y=(\d+)/) || [])[1];
var NOPRELOAD = /[?&]nopreload/.test(location.search);
if (NOPRELOAD || YO) RM = true;

doc.documentElement.classList.remove('no-js');
doc.documentElement.classList.add('js');

history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

/* ---------- Lenis ---------- */
var lenis = null;
if (window.Lenis && !RM) {
  try { lenis = new Lenis({ duration: 1.15, smoothWheel: true }); } catch (e) { lenis = null; }
}

/* ---------- stato ---------- */
var sy = window.scrollY || 0;
var vh = window.innerHeight;
var ticking = false;

function raf(time) {
  if (lenis) lenis.raf(time);
  updateFrame();
  requestAnimationFrame(raf);
}

/* ============================================================
   PRELOADER
   ============================================================ */
var loader = qs('.loader'), lBar = qs('.loader-bar i'), lPct = qs('.loader-pct');
var lDone = false;
function finishLoad() {
  if (lDone) return;
  lDone = true;
  doc.documentElement.classList.remove('is-loading');
  doc.documentElement.classList.add('is-loaded');
  if (lenis) lenis.start();
  setTimeout(function () { if (loader && loader.parentNode) loader.parentNode.removeChild(loader); }, 700);
  measureAll();
}
if (RM || !loader) {
  finishLoad();
} else {
  if (lenis) lenis.stop();
  (function () {
    var t0 = performance.now(), D = 900;
    (function step() {
      var p = clamp((performance.now() - t0) / D, 0, 1), e = easeOut(p);
      if (lBar) lBar.style.transform = 'scaleX(' + e + ')';
      if (lPct) lPct.textContent = Math.round(e * 100) + '%';
      if (p < 1) requestAnimationFrame(step);
      else finishLoad();
    })();
  })();
  setTimeout(finishLoad, 1500);
}

/* ============================================================
   HEADER + PROGRESS
   ============================================================ */
var head = qs('.site-head');
var pbarI = qs('#pbarI');

function updateHeader() {
  if (head) head.classList.toggle('solid', sy > 24);
  if (pbarI) {
    var dh = doc.documentElement.scrollHeight - vh;
    pbarI.style.width = (clamp(sy / Math.max(1, dh), 0, 1) * 100).toFixed(2) + '%';
  }
}

/* ============================================================
   DOTS NAV
   ============================================================ */
var dotsBox = qs('#dots');
var dotBtns = [];
var sceneEls = qsa('.scene');

if (dotsBox) {
  sceneEls.forEach(function (s) {
    var b = doc.createElement('button');
    b.setAttribute('aria-label', 'Sezione ' + (s.id || ''));
    b.addEventListener('click', function () {
      var t = qs('#' + s.id);
      if (!t) return;
      if (lenis) lenis.scrollTo(t, { offset: 2, duration: 1.1 });
      else t.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
    });
    dotsBox.appendChild(b);
    dotBtns.push({ btn: b, id: s.id });
  });
}

function updateDots() {
  if (mqMob.matches || !dotBtns.length) return;
  var cur = 0, best = Infinity;
  dotBtns.forEach(function (d, i) {
    var el = doc.getElementById(d.id);
    if (!el) return;
    var dist = Math.abs(el.getBoundingClientRect().top);
    if (dist < best) { best = dist; cur = i; }
  });
  dotBtns.forEach(function (d, i) { d.btn.classList.toggle('on', i === cur); });
}

/* ============================================================
   NAV ATTIVA
   ============================================================ */
var navLinks = qsa('[data-nav]');
if ('IntersectionObserver' in window) {
  var nio = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var id = '#' + e.target.id;
      navLinks.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === id); });
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  navLinks.forEach(function (a) {
    var s = qs(a.getAttribute('href'));
    if (s) nio.observe(s);
  });
}

/* ============================================================
   HERO — parallasse mouse + scroll
   ============================================================ */
var hero = qs('.hero');
var fcs = qsa('.fc');
var hmx = 0, hmy = 0, hmxT = 0, hmyT = 0;
if (FINE && !RM && hero) {
  hero.addEventListener('mousemove', function (e) {
    var r = hero.getBoundingClientRect();
    hmxT = (e.clientX - r.left) / r.width - .5;
    hmyT = (e.clientY - r.top) / r.height - .5;
  });
  hero.addEventListener('mouseleave', function () { hmxT = 0; hmyT = 0; });
}

function updateHeroParallax(p) {
  if (!hero || mqMob.matches) return;
  hmx = lerp(hmx, hmxT, .06); hmy = lerp(hmy, hmyT, .06);
  var sp = easeOut(clamp(p * 1.2, 0, 1)); /* il caos cresce con lo scroll */
  fcs.forEach(function (fc, i) {
    var d = parseFloat(fc.getAttribute('data-depth')) || .4;
    var sx = Math.sin(i * 1.7) * (30 + ((i * 37) % 70)) * sp;
    var sy2 = -p * 90 * d + Math.cos(i * 2.1) * 20 * sp;
    var rz = Math.sin(i * .9) * 12 * sp;
    fc.style.transform = 'translate3d(' + (hmx * 30 * d + sx).toFixed(1) + 'px,' + (hmy * 30 * d + sy2).toFixed(1) + 'px,0) rotate(' + rz.toFixed(1) + 'deg)';
  });
}

/* ============================================================
   SCENE ENGINE
   ============================================================ */
var scenes = sceneEls.map(function (el) {
  return {
    el: el,
    id: el.id,
    beats: parseFloat(el.getAttribute('data-beats') || '1'),
    view: qs('.scene-view', el),
    fade: el.getAttribute('data-fade') || 'inout'
  };
});
var casiScene = null;
scenes.forEach(function (s) { if (s.id === 'casi') casiScene = s; });

function measureScenes() {
  if (RM) {
    scenes.forEach(function (s) { s.el.style.height = ''; });
    return;
  }
  scenes.forEach(function (s) {
    var b = mqMob.matches ? Math.min(s.beats, 1.5) : s.beats;
    s.el.style.height = ((b + 1) * vh) + 'px';
  });
}

function sceneFade(s, p) {
  if (!s.view) return;
  if (s.fade === 'none') { s.view.style.opacity = '1'; s.view.style.transform = ''; return; }
  /* entrata: fade + leggera crescita; uscita: rimpicciolisce e svanisce */
  var vin = s.fade === 'out' ? 1 : win(p, .04, .16);
  var vout = s.fade === 'in' ? 0 : win(p, .88, .995);
  var o = Math.min(vin, 1 - vout);
  var sc = (1 - (1 - vin) * .05) * (1 - vout * .07);
  var y = (1 - vin) * 14 - vout * 10;
  s.view.style.opacity = o.toFixed(3);
  s.view.style.transform = 'translateY(' + y.toFixed(1) + 'px) scale(' + sc.toFixed(4) + ')';
}

function pOf(s) {
  var top = s.el.getBoundingClientRect().top + sy;
  return norm(sy, top, top + s.el.offsetHeight - vh);
}

/* ---------- PROBLEMA (6 card in crossfade) ---------- */
var pxBox = qs('#px');
var pxInners = qsa('#px .mx-inner'), pxIdx = qs('#pxIdx');
function updateProblema(p) {
  var n = pxInners.length || 6, cur = 0, i;
  for (i = 0; i < n; i++) { if (p >= i / n) cur = i; }
  pxInners.forEach(function (el, k) {
    el.classList.toggle('on', k === cur);
  });
  if (pxIdx) pxIdx.textContent = ('0' + (cur + 1)).slice(-2);
}
var problemaScene = qs('#problema');
if (problemaScene) {
  pxInners.forEach(function (card, i) {
    card.addEventListener('click', function () {
      if (mqMob.matches || RM) return;
      var n = pxInners.length || 6;
      var sTop = problemaScene.getBoundingClientRect().top + sy;
      var sH = problemaScene.offsetHeight - vh;
      var target = sTop + sH * (i / n + .01);
      if (lenis) lenis.scrollTo(target, { offset: 0, duration: .9 });
      else window.scrollTo({ top: target, behavior: 'smooth' });
    });
  });
}

/* ---------- AI ---------- */
var aiSec = qs('#ai'), aiCore = qs('.ai-core'), aiOutBox = qs('.ai-out');
var nzEls = qsa('.nz');
var outCard = qs('.doc.out'), out2Card = qs('.doc.out2'), out3Card = qs('.doc.out2.o3');

function updateAI(p) {
  nzEls.forEach(function (el, i) {
    var d = parseFloat(el.style.getPropertyValue('--d')) || i;
    var w = win(p, .02 + d * .035, .18 + d * .035);
    var tc = easeInOut(norm(p, .3, .54));
    var base = 'translate(0,0)';
    if (tc > 0) {
      var r = el.getBoundingClientRect();
      var c = aiCore.getBoundingClientRect();
      var dx = (c.left + c.width / 2) - (r.left + r.width / 2);
      var dy = (c.top + c.height / 2) - (r.top + r.height / 2);
      base = 'translate(' + (dx * tc).toFixed(1) + 'px,' + (dy * tc).toFixed(1) + 'px) rotate(' + ((1 - tc) * parseFloat(el.style.getPropertyValue('--r') || 0)).toFixed(1) + 'deg) scale(' + (1 - tc * .45).toFixed(3) + ')';
      el.style.opacity = (w * (1 - tc)).toFixed(3);
    } else {
      el.style.opacity = w.toFixed(3);
    }
    el.style.transform = base;
  });
  var cp = win(p, .3, .46);
  /* l'output si sposta al centro e riempie la scena, il nucleo passa il testimone */
  var oc = easeInOut(norm(p, .7, .85));
  if (aiOutBox) {
    aiOutBox.style.opacity = oc.toFixed(3);
    if (oc > 0) {
      aiOutBox.style.transform = 'scale(' + lerp(.92, 1, oc).toFixed(3) + ')';
    } else {
      aiOutBox.style.transform = '';
    }
  }
  if (aiCore) {
    aiCore.style.transform = 'scale(' + lerp(.4, 1, cp).toFixed(3) + ')';
    aiCore.style.opacity = (cp * (1 - oc)).toFixed(3);
    aiCore.classList.toggle('hot', p > .5 && oc < .35);
  }
  var o1 = win(p, .56, .7);
  if (outCard) {
    outCard.style.opacity = o1.toFixed(3);
    outCard.style.transform = 'translateY(' + ((1 - o1) * 30).toFixed(1) + 'px) scale(' + lerp(.96, 1, o1).toFixed(3) + ')';
  }
  var o2 = win(p, .68, .8);
  if (out2Card) {
    out2Card.style.opacity = o2.toFixed(3);
    out2Card.style.transform = 'translateY(' + ((1 - o2) * 26).toFixed(1) + 'px) scale(' + lerp(.96, 1, o2).toFixed(3) + ')';
  }
  var o3 = win(p, .76, .88);
  if (out3Card) {
    out3Card.style.opacity = o3.toFixed(3);
    out3Card.style.transform = 'translateY(' + ((1 - o3) * 26).toFixed(1) + 'px) scale(' + lerp(.96, 1, o3).toFixed(3) + ')';
  }
}

/* output AI interattivo: approva la pratica */
var oApprove = qs('#oApprove');
if (oApprove) {
  oApprove.addEventListener('click', function () {
    var b = qs('#aiOut .out-badge');
    if (b) b.textContent = 'Inviata ✓';
    oApprove.textContent = 'Inviata ✓';
    oApprove.style.background = '#2f7d55';
    oApprove.style.borderColor = '#2f7d55';
  });
}

/* ---------- CASI: un pannello svanisce, l'altro entra in fade ---------- */
var panels = qsa('.case-panel');
var caseIdx = qs('#caseIdx'), caseBar = qs('#caseBar i'), caseGhost = qs('#caseGhost');
var CW = [.8, 1, 1, 1.3], CWsum = CW.reduce(function (a, b) { return a + b; }, 0);

function measureCasi() { /* i pannelli sono impilati: niente misure */ }

function updateCasi(p) {
  if (!panels.length || RM) return;
  var ranges = [], acc = 0;
  CW.forEach(function (w) { ranges.push([acc / CWsum, (acc + w) / CWsum]); acc += w; });
  var i = CW.length - 1, k;
  for (k = 0; k < CW.length; k++) { if (p <= ranges[k][1]) { i = k; break; } }

  if (caseIdx) caseIdx.textContent = ('0' + (i + 1)).slice(-2);
  if (caseGhost) caseGhost.textContent = ('0' + (i + 1)).slice(-2);
  if (caseBar) caseBar.style.width = (p * 100).toFixed(2) + '%';

  panels.forEach(function (panel, n) {
    panel.classList.toggle('active', n === i);
  });

  /* gli elementi del pannello attivo si muovono con lo scroll */
  var ap = panels[i];
  if (ap) {
    var mid = (ranges[i][0] + ranges[i][1]) / 2;
    qsa('.doc', ap).forEach(function (el) {
      var dd = parseFloat(el.getAttribute('data-depth')) || .3;
      var rot = (el.style.getPropertyValue('--rot') || '0deg').trim() || '0deg';
      var yy = (p - mid) * 140 * dd;
      el.style.transform = 'rotate(' + rot + ') translateY(' + yy.toFixed(1) + 'px)';
    });
  }
}

/* ---------- METODO (le card prendono il centro) ---------- */
var mxInners = qsa('#mx .mx-inner'), mIdx = qs('#mIdx');
var mxTrack = qs('#mxTrack'), mxBox = qs('#mx');
var mxCur = 0, mxX = [], mxTrackX = 0;
function measureMx() {
  if (!mxTrack || !mxBox || mqMob.matches || RM) { mxX = []; return; }
  var sw = mxBox.clientWidth;
  mxX = mxInners.map(function (el) {
    return Math.max(0, el.offsetLeft + el.offsetWidth / 2 - sw / 2);
  });
  mxTrackX = mxX[mxCur] || 0;
}
function updateMetodo(p) {
  var cur = 0;
  if (p >= 2 / 3) cur = 2;
  else if (p >= 1 / 3) cur = 1;
  mxCur = cur;
  if (mxTrack && mxX.length) {
    var target = mxX[cur] || 0;
    mxTrackX = lerp(mxTrackX, target, .12);
    if (Math.abs(target - mxTrackX) < .5) mxTrackX = target;
    mxTrack.style.transform = 'translate3d(' + (-mxTrackX).toFixed(1) + 'px,0,0)';
  }
  mxInners.forEach(function (el, i) {
    el.classList.toggle('is-c', i === cur);
  });
  if (mIdx) mIdx.textContent = ('0' + (cur + 1)).slice(-2);
}

/* ---------- RISULTATO ---------- */
var dash = qs('#dash');
var rcaps = qsa('.rcap');
var counted = false;
function countUp(el) {
  var T = +el.getAttribute('data-count'), t0 = performance.now(), D = 1100;
  (function f(t) {
    var pp = clamp((t - t0) / D, 0, 1);
    el.textContent = Math.round(T * easeOut(pp));
    if (pp < 1) requestAnimationFrame(f);
  })(t0);
}
function updateRisultato(p) {
  if (!dash) return;
  dash.classList.toggle('live', p > .05 && p < .95);
  var states = [[.06, .34], [.38, .64], [.68, .95]];
  var cur = -1;
  states.forEach(function (st, i) {
    if (p >= st[0] && p < st[1]) cur = i;
  });
  dash.classList.toggle('b0', cur === 0);
  dash.classList.toggle('b1', cur === 1);
  dash.classList.toggle('b2', cur === 2);
  rcaps.forEach(function (c, i) {
    if (cur === i) {
      var w = easeOut(norm(p, states[i][0], states[i][0] + .05));
      c.style.opacity = w.toFixed(3);
      c.style.transform = 'translateY(' + ((1 - w) * 10).toFixed(1) + 'px)';
    } else {
      c.style.opacity = '0';
      c.style.transform = 'translateY(10px)';
    }
  });
  if (!counted && p > .04) {
    counted = true;
    qsa('[data-count]', dash).forEach(countUp);
  }
}

/* ---------- SUPPORTO ---------- */
var egWin = qs('.eg-win');
var supPs = qsa('.sup-p');
function updateSupporto(p) {
  if (egWin) {
    var ew = win(p, .06, .2);
    egWin.style.opacity = ew.toFixed(3);
    egWin.style.transform = 'translateY(' + ((1 - ew) * 26).toFixed(1) + 'px)';
    egWin.classList.toggle('on', p > .35);
  }
  supPs.forEach(function (s, i) {
    var w = win(p, .48 + i * .07, .62 + i * .07);
    s.style.opacity = w.toFixed(3);
    s.style.transform = 'translateY(' + ((1 - w) * 20).toFixed(1) + 'px)';
  });
}

/* ---------- CTA: dissolvenza al nero + ingresso contenuti ---------- */
var ctaVeil = qs('.cta-veil'), ctaEls = qsa('.cta-el');
function updateCTA(p) {
  if (ctaVeil) ctaVeil.style.opacity = win(p, .01, .08).toFixed(3);
  ctaEls.forEach(function (el, i) {
    var w = win(p, .1 + i * .06, .26 + i * .06);
    el.style.opacity = w.toFixed(3);
    el.style.transform = 'translateY(' + ((1 - w) * 34).toFixed(1) + 'px)';
  });
}

/* ---------- dispatcher ---------- */
var casiPin = qs('.casi-pin');
function updateScenes() {
  if (RM) return;
  for (var i = 0; i < scenes.length; i++) {
    var s = scenes[i];
    var r = s.el.getBoundingClientRect();
    var active = r.bottom > 0 && r.top < vh;
    if (!active) {
      /* fuori dal proprio tratto sticky: il contenuto non si vede mai "a metà" */
      if (s.view) s.view.style.opacity = '0';
      if (s.id === 'casi' && casiPin) casiPin.style.opacity = '0';
      continue;
    }
    var p = clamp(-r.top / Math.max(1, r.height - vh), 0, 1);
    if (s.id === 'casi') {
      if (casiPin) {
        var fin = win(p, .01, .1), fout = win(p, .92, .99);
        casiPin.style.opacity = Math.min(fin, 1 - fout).toFixed(3);
      }
      updateCasi(p);
      continue;
    }
    sceneFade(s, p);
    if (s.id === 'problema') updateProblema(p);
    else if (s.id === 'ai') updateAI(p);
    else if (s.id === 'metodo') updateMetodo(p);
    else if (s.id === 'risultato') updateRisultato(p);
    else if (s.id === 'supporto') updateSupporto(p);
    else if (s.id === 'cta') updateCTA(p);
    else if (s.id === 'hero') updateHeroParallax(p);
  }
}

function measureAll() {
  vh = window.innerHeight;
  measureScenes();
  measureCasi();
  measureMx();
}

/* ============================================================
   METODO — click su card/ghost per navigare tra i passi
   ============================================================ */
var metodoScene = qs('#metodo');
function mxGo(i) {
  if (!metodoScene || mqMob.matches || RM) return;
  i = clamp(i, 0, 2);
  var sTop = metodoScene.getBoundingClientRect().top + sy;
  var sH = metodoScene.offsetHeight - vh;
  var target = sTop + sH * (i / 3 + .02);
  if (lenis) lenis.scrollTo(target, { offset: 0, duration: .9 });
  else window.scrollTo({ top: target, behavior: 'smooth' });
}
if (metodoScene) {
  mxInners.forEach(function (card, i) {
    card.addEventListener('click', function () { mxGo(i); });
  });
}

/* ============================================================
   MAGNETIC + ANCORE
   ============================================================ */
if (FINE && !RM) {
  qsa('.magnetic').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      var r = btn.getBoundingClientRect();
      btn.style.transform = 'translate(' + (((e.clientX - r.left - r.width / 2) / r.width) * 10).toFixed(1) + 'px,' + (((e.clientY - r.top - r.height / 2) / r.height) * 8).toFixed(1) + 'px)';
    });
    btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
  });
}

qsa('a[href^="#"]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    var href = a.getAttribute('href');
    if (href.length < 2) return;
    var target = qs(href);
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: 2, duration: 1.15 });
    else target.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
  });
});

/* ============================================================
   FRAME + RESIZE
   ============================================================ */
function updateFrame() {
  sy = window.scrollY || window.pageYOffset || 0;
  vh = window.innerHeight;
  updateHeader();
  updateDots();
  updateScenes();
}

var rzT;
window.addEventListener('resize', function () {
  clearTimeout(rzT);
  rzT = setTimeout(function () {
    fcs.forEach(function (fc) { fc.style.transform = ''; });
    nzEls.forEach(function (el) { el.style.opacity = ''; el.style.transform = ''; });
    qsa('.case-visual .doc').forEach(function (el) { el.style.transform = ''; });
    measureAll();
    updateFrame();
  }, 200);
});
window.addEventListener('load', function () { measureAll(); updateFrame(); });
setTimeout(function () { measureAll(); updateFrame(); }, 800);

requestAnimationFrame(raf);
updateFrame();
if (YO) {
  doc.documentElement.style.scrollBehavior = 'auto';
  setTimeout(function () { window.scrollTo({ top: +YO, behavior: 'instant' }); sy = window.scrollY; updateFrame(); }, 60);
}

})();
