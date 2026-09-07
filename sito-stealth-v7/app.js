(() => {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktop = window.matchMedia('(min-width: 900px)');
  const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOut = t => 1 - Math.pow(1 - clamp(t), 3);
  const easeInOut = t => {
    t = clamp(t);
    return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };
  const range = (p, a, b) => clamp((p - a) / Math.max(.00001, b - a));

  function getPath(obj, path) {
    return path.split('.').reduce((acc, key) => acc == null ? undefined : acc[key], obj);
  }

  async function loadContent() {
    try {
      const response = await fetch('./content.json', { cache: 'no-store' });
      if (!response.ok) return;
      const data = await response.json();
      document.querySelectorAll('[data-content]').forEach(el => {
        const value = getPath(data, el.dataset.content);
        if (typeof value === 'string') el.textContent = value;
      });
      document.querySelectorAll('[data-content-href]').forEach(el => {
        const value = getPath(data, el.dataset.contentHref);
        if (typeof value === 'string') el.setAttribute('href', value);
      });
      if (data.site?.metaTitle) document.title = data.site.metaTitle;
      const meta = document.querySelector('meta[name="description"]');
      if (meta && data.site?.metaDescription) meta.setAttribute('content', data.site.metaDescription);
    } catch (_) {
      /* The HTML contains a complete readable fallback. */
    }
  }
  loadContent();

  if (reduced) return;

  const hero = document.querySelector('.hero-story');
  const heroA = document.querySelector('.hero-copy-a');
  const heroB = document.querySelector('.hero-copy-b');
  const baseObjects = [...document.querySelectorAll('[data-hero]')];
  const extras = [...document.querySelectorAll('[data-hero-extra]')];

  const casesDesktop = document.querySelector('.cases-desktop');
  const casesTrack = document.querySelector('.cases-track');
  const casePanels = [...document.querySelectorAll('.case-scene')];
  const casesProgress = document.querySelector('.progress-line i');
  const casesLabel = document.querySelector('.progress-label');

  const turn = document.querySelector('.turn-story');
  const turnCopy = document.querySelector('.turn-copy');
  const selectionObjects = [...document.querySelectorAll('.selection-object')];
  const duplicates = [...document.querySelectorAll('.selection-object.duplicate')];
  const keeps = [...document.querySelectorAll('.selection-object.keep')];
  const ring = document.querySelector('.selection-ring');

  const practice = document.querySelector('.practice-window');
  const sourceChips = [...document.querySelectorAll('.source-chip')];
  const buildSection = document.querySelector('.build-section');
  const evolution = document.querySelector('.evolution-section');
  const newRequirement = document.querySelector('.new-requirement');
  const newRow = document.querySelector('.new-row');

  const desktopTargets = [
    { x: -80, y: 20, r: -5, s: .96 },
    { x: -35, y: -25, r: 4, s: .97 },
    { x: 75, y: -20, r: 7, s: .96 },
    { x: -25, y: -55, r: -7, s: .95 },
    { x: 50, y: 45, r: 7, s: .95 },
    { x: 15, y: 65, r: -10, s: .96 }
  ];
  const mobileTargets = [
    { x: -25, y: 15, r: -4, s: .98 },
    { x: -10, y: -12, r: 3, s: .98 },
    { x: 35, y: -8, r: 5, s: .97 },
    { x: -20, y: -28, r: -5, s: .96 },
    { x: 28, y: 22, r: 5, s: .96 },
    { x: 8, y: 32, r: -8, s: .96 }
  ];

  const state = { vw: innerWidth, vh: innerHeight, ticking: false };

  function sectionProgress(section) {
    if (!section) return 0;
    const rect = section.getBoundingClientRect();
    const travel = Math.max(1, section.offsetHeight - state.vh);
    return clamp(-rect.top / travel);
  }

  function updateHero() {
    if (!hero) return;
    const p = sectionProgress(hero);
    const targets = desktop.matches ? desktopTargets : mobileTargets;
    const gather = easeInOut(range(p, .08, .56));

    baseObjects.forEach((el, index) => {
      const t = targets[index] || targets[targets.length - 1];
      const scale = lerp(1, t.s, gather);
      const x = lerp(0, t.x, gather);
      const y = lerp(0, t.y, gather);
      const r = lerp(0, t.r, gather);
      el.style.setProperty('--motion-x', `${x}px`);
      el.style.setProperty('--motion-y', `${y}px`);
      el.style.setProperty('--motion-r', `${r}deg`);
      el.style.setProperty('--motion-scale', scale.toFixed(3));
      el.style.transform = `translate3d(${x}px,${y}px,0) rotate(${r}deg) scale(${scale})`;
    });

    extras.forEach((el, index) => {
      const t = easeOut(range(p, .28 + index * .08, .48 + index * .08));
      el.style.opacity = String(t);
      el.style.visibility = t < .02 ? 'hidden' : 'visible';
      const dy = lerp(25, 0, t);
      el.style.transform = `translate3d(0,${dy}px,0) scale(${lerp(.94,1,t)}) ${index === 2 ? 'rotate(6deg)' : ''}`;
    });

    const aOut = easeOut(range(p, .50, .66));
    if (heroA) {
      heroA.style.opacity = String(1 - aOut);
      heroA.style.visibility = aOut > .98 ? 'hidden' : 'visible';
      heroA.style.transform = `translate3d(0,${-24 * aOut}px,0)`;
      heroA.style.filter = `blur(${3 * aOut}px)`;
    }
    const bIn = easeOut(range(p, .58, .76));
    if (heroB) {
      heroB.style.opacity = String(bIn);
      heroB.style.visibility = bIn < .02 ? 'hidden' : 'visible';
      heroB.style.transform = `translate3d(0,${lerp(30,0,bIn)}px,0)`;
      heroB.style.filter = `blur(${lerp(3,0,bIn)}px)`;
      heroB.setAttribute('aria-hidden', bIn < .5 ? 'true' : 'false');
    }
  }

  function updateCases() {
    if (!casesDesktop || !casesTrack || !casePanels.length || !desktop.matches) {
      if (casesTrack) casesTrack.style.transform = '';
      return;
    }
    const p = sectionProgress(casesDesktop);
    const first = casePanels[0];
    const last = casePanels[casePanels.length - 1];
    const firstCenter = first.offsetLeft + first.offsetWidth / 2;
    const lastCenter = last.offsetLeft + last.offsetWidth / 2;
    const distance = lastCenter - firstCenter;
    casesTrack.style.transform = `translate3d(${-distance * p}px,0,0)`;

    const exact = p * (casePanels.length - 1);
    const active = Math.round(exact);
    casePanels.forEach((panel, index) => {
      const dExact = Math.abs(index - exact);
      const dActive = Math.abs(index - active);
      const isActive = index === active;
      panel.classList.toggle('is-active', isActive);
      const opacity = isActive ? 1 : Math.max(.14, .42 - Math.max(0, dExact - .5) * .25);
      const blur = isActive ? 0 : Math.min(3.2, 2.1 + dActive * .55);
      const scale = isActive ? 1 : Math.max(.965, .978 - dActive * .008);
      panel.style.opacity = opacity.toFixed(3);
      panel.style.filter = `blur(${blur.toFixed(2)}px)`;
      panel.style.scale = scale.toFixed(3);
    });
    if (casesProgress) casesProgress.style.transform = `scaleX(${.25 + p * .75})`;
    if (casesLabel) casesLabel.textContent = String(active + 1).padStart(2, '0');
  }

  function updateTurn() {
    if (!turn || !desktop.matches) return;
    const p = sectionProgress(turn);
    const copyIn = easeOut(range(p, .08, .28));
    if (turnCopy) {
      turnCopy.style.opacity = String(copyIn);
      turnCopy.style.transform = `translate3d(0,${lerp(30,0,copyIn)}px,0)`;
    }
    const settle = easeInOut(range(p, .08, .58));
    selectionObjects.forEach(el => {
      const matrix = getComputedStyle(el).transform;
      void matrix;
      el.style.filter = '';
    });
    duplicates.forEach((el, index) => {
      const t = easeInOut(range(p, .34, .64));
      el.style.opacity = String(lerp(1, .14, t));
      el.style.filter = `blur(${lerp(0,2,t)}px)`;
      el.style.transform = `rotate(${lerp(index === 0 ? -8 : 8,0,settle)}deg) scale(${lerp(1,.86,t)})`;
    });
    keeps.forEach((el, index) => {
      const t = easeInOut(range(p, .36, .74));
      const x = index === 0 ? lerp(0,65,t) : lerp(0,-45,t);
      const y = index === 0 ? lerp(0,-5,t) : lerp(0,5,t);
      const baseR = index === 0 ? 3 : 4;
      el.style.transform = `translate3d(${x}px,${y}px,0) rotate(${lerp(baseR,0,settle)}deg) scale(${lerp(1,.92,t)})`;
    });
    if (ring) {
      const t = easeOut(range(p, .50, .75));
      ring.style.opacity = String(.55 * t);
      ring.style.transform = `translate(-50%,-50%) scale(${lerp(.75,1,t)})`;
    }
  }

  function elementInProgress(el, start = .78, end = .30) {
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const p = (state.vh * start - rect.top) / (state.vh * (start - end) + rect.height * .35);
    return clamp(p);
  }

  function updateBuildAndEvolution() {
    const bp = easeOut(elementInProgress(buildSection));
    if (practice) {
      practice.style.opacity = String(bp);
      practice.style.transform = `translate3d(0,${lerp(70,0,bp)}px,0)`;
    }
    sourceChips.forEach((el, i) => {
      const t = easeOut(clamp((bp - .18 - i * .08) / .45));
      el.style.opacity = String(t);
    });

    const ep = easeOut(elementInProgress(evolution));
    if (newRequirement) {
      const fade = clamp(ep / .65);
      newRequirement.style.opacity = String(lerp(0, ep > .78 ? .45 : 1, fade));
      newRequirement.style.transform = `translate3d(${lerp(-45, ep > .78 ? 18 : 0, fade)}px,0,0) scale(${lerp(.94, ep > .78 ? .96 : 1, fade)})`;
    }
    if (newRow) {
      const t = easeOut(range(ep, .40, .82));
      newRow.style.opacity = String(t);
      newRow.style.transform = `translate3d(0,${lerp(18,0,t)}px,0)`;
    }
  }

  function update() {
    state.ticking = false;
    updateHero();
    updateCases();
    updateTurn();
    updateBuildAndEvolution();
  }

  function requestUpdate() {
    if (state.ticking) return;
    state.ticking = true;
    requestAnimationFrame(update);
  }

  addEventListener('scroll', requestUpdate, { passive: true });
  addEventListener('resize', () => {
    state.vw = innerWidth;
    state.vh = innerHeight;
    requestUpdate();
  }, { passive: true });
  desktop.addEventListener('change', requestUpdate);
  addEventListener('load', requestUpdate, { once: true });
  requestUpdate();
})();