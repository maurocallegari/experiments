(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobileQuery = window.matchMedia('(max-width: 900px)');
  const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOut = t => 1 - Math.pow(1 - clamp(t), 3);
  const easeInOut = t => {
    t = clamp(t);
    return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };
  const range = (p, a, b) => clamp((p - a) / Math.max(.0001, b - a));

  const hero = document.querySelector('.hero-scroll');
  const heroPrimary = document.querySelector('.hero-copy-primary');
  const heroSecondary = document.querySelector('.hero-copy-secondary');
  const heroRail = document.querySelector('.hero-rail');
  const heroLabel = document.querySelector('.hero-flow-label');
  const heroWipe = document.querySelector('.hero-wipe');
  const wipeWord = document.querySelector('.wipe-word');
  const heroWorkbench = document.querySelector('.hero-workbench');

  /* Add visual fragments that read like real work objects, not labeled rectangles. */
  if (heroWorkbench && !heroWorkbench.querySelector('.chaos-extra')) {
    const extras = [
      {
        cls: 'chaos-postit', x: -45, y: -18, r: -9, scale: .94,
        html: '<span class="postit-pin"></span><p>Richiamare<br>cliente Rossi</p><b>entro oggi</b>'
      },
      {
        cls: 'chaos-call', x: 43, y: 21, r: 7, scale: .92,
        html: '<div class="call-avatar">MR</div><div class="call-copy"><small>chiamata in corso</small><strong>Marco · tecnico</strong><span>03:42</span></div><div class="call-controls"><i></i><i></i><i class="hang"></i></div>'
      },
      {
        cls: 'chaos-photo', x: 42, y: -17, r: 5, scale: .90,
        html: '<div class="photo-top"><span></span><small>foto_1287.jpg</small></div><div class="chaos-photo-frame"><div class="paper-mini"><i></i><i></i><i></i><em></em></div></div><div class="photo-meta">oggi · 16:28</div>'
      },
      {
        cls: 'chaos-attachment', x: -42, y: 22, r: -4, scale: .96,
        html: '<div class="attachment-title"><span class="clip"></span><small>3 allegati</small></div><div class="file-row"><i>PDF</i><span>ordine_cliente.pdf</span></div><div class="file-row"><i>JPG</i><span>firma.jpg</span></div><div class="file-row"><i>DOC</i><span>note_intervento.docx</span></div>'
      },
      {
        cls: 'chaos-calendar', x: 29, y: 28, r: -5, scale: .90,
        html: '<div class="calendar-head"><span></span><span></span><small>SCADENZA</small></div><strong>12</strong><b>SET</b><span>consegna pratica</span>'
      },
      {
        cls: 'chaos-note', x: -28, y: 30, r: 8, scale: .92,
        html: '<div class="note-rule"></div><small>APPUNTO</small><p>“Manca ancora<br>la firma?”</p><span class="note-check">□ verificare</span>'
      },
      {
        cls: 'chaos-stamp', x: 8, y: 33, r: -8, scale: .86,
        html: '<div class="stamp-paper"><small>PRATICA 347</small><strong>DA RICONTROLLARE</strong><span>cliente · data · allegati</span></div>'
      }
    ];

    extras.forEach(item => {
      const el = document.createElement('aside');
      el.className = `artifact chaos-extra ${item.cls}`;
      el.dataset.x = item.x;
      el.dataset.y = item.y;
      el.dataset.r = item.r;
      el.dataset.scale = item.scale;
      el.innerHTML = item.html;
      heroWorkbench.appendChild(el);
    });
  }

  const heroArtifacts = [...document.querySelectorAll('.hero-workbench .artifact')];
  const thesis = document.querySelector('.thesis');
  const processLines = [...document.querySelectorAll('.process-line')];

  const aiScroll = document.querySelector('.ai-scroll');
  const aiInputs = [...document.querySelectorAll('.ai-input')];
  const aiCore = document.querySelector('.ai-core');
  const aiOutput = document.querySelector('.ai-output');
  const aiCheck = document.querySelector('.ai-check');
  const aiLines = [...document.querySelectorAll('.ai-line')];

  const casesStage = document.querySelector('.cases-stage');
  const caseViewport = document.querySelector('.case-viewport');
  const casePanels = [...document.querySelectorAll('.case-panel')];
  const progressBars = [...document.querySelectorAll('.case-progress i')];

  const method = document.querySelector('.method');
  const methodSteps = [...document.querySelectorAll('.method-step')];
  const result = document.querySelector('.result');
  const practiceUI = document.querySelector('.practice-ui');
  const resultPoints = [...document.querySelectorAll('.result-points div')];
  const header = document.querySelector('.site-header');
  const partner = document.querySelector('.partner');

  let ticking = false;
  let vw = window.innerWidth;
  let vh = window.innerHeight;

  const scrollProgress = section => {
    if (!section) return 0;
    const rect = section.getBoundingClientRect();
    const travel = Math.max(1, section.offsetHeight - vh);
    return clamp(-rect.top / travel);
  };

  /* Dense irregular cluster: everything is attracted inward, but never aligns. */
  const cluster = [
    [-4.6, 1.5, -7, .72], [4.2, -2.0, 5, .69], [-1.8, -4.8, -3, .68],
    [2.2, 5.2, 7, .66], [.3, .2, -1, .67], [5.8, 1.7, 4, .64],
    [-5.9, -1.3, -5, .66], [3.3, -5.5, 6, .66], [-4.1, 5.7, -4, .68],
    [1.2, 3.1, 3, .65], [-.8, -3.1, -6, .66], [4.9, -4.0, 5, .65],
    [-5.1, 4.6, 2, .64], [3.2, 4.1, -2, .66], [-2.5, .8, 8, .62]
  ];

  function heroTransform(el, p, index) {
    const ds = el.dataset;
    const mobile = mobileQuery.matches;
    const x0 = Number(ds.x || 0);
    const y0 = Number(ds.y || 0);
    const r0 = Number(ds.r || 0);
    const s0 = Number(ds.scale || 1);
    const target = cluster[index % cluster.length];

    const gather = easeInOut(range(p, .12, .62));
    const x = lerp(x0 * (mobile ? .84 : 1), target[0], gather) * vw / 100;
    const y = lerp(y0 * (mobile ? .62 : 1), target[1], gather) * vh / 100;
    const r = lerp(r0, target[2], gather);
    const finalScale = target[3] * (mobile ? .78 : 1);
    const s = lerp(s0 * (mobile ? .80 : 1), finalScale, gather);

    const heroFade = range(p, .68, .86);
    const depth = lerp(1, .935 + (index % 5) * .012, range(p, .45, .66));
    el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${r}deg) scale(${s * depth})`;
    el.style.opacity = String(1 - .9 * heroFade);
    el.style.filter = `blur(${lerp(0, 3.2, heroFade)}px)`;
    el.style.zIndex = String(8 + (index % 8));
  }

  function updateHero() {
    if (!hero || reducedMotion) return;
    const p = scrollProgress(hero);
    heroArtifacts.forEach((el, i) => heroTransform(el, p, i));

    const primaryOut = easeOut(range(p, .30, .50));
    if (heroPrimary) {
      heroPrimary.style.opacity = String(1 - primaryOut);
      heroPrimary.style.transform = `translateX(-50%) translateY(${-20 * primaryOut}px) scale(${lerp(1, .985, primaryOut)})`;
      heroPrimary.style.filter = `blur(${lerp(0, 2.4, primaryOut)}px)`;
    }

    const secondaryIn = easeOut(range(p, .50, .67));
    const secondaryOut = easeOut(range(p, .73, .87));
    if (heroSecondary) {
      heroSecondary.style.opacity = String(secondaryIn * (1 - secondaryOut));
      heroSecondary.style.transform = `translate(-50%, ${lerp(26, 0, secondaryIn) - 15 * secondaryOut}px) scale(${lerp(.985, 1, secondaryIn)})`;
      heroSecondary.style.filter = `blur(${lerp(1.8, 0, secondaryIn) + lerp(0, 2.2, secondaryOut)}px)`;
    }

    if (heroRail) heroRail.style.opacity = '0';
    if (heroLabel) heroLabel.style.opacity = '0';

    /* The next chapter rises in while the hero is still dissolving. */
    const wipe = easeInOut(range(p, .78, .96));
    if (heroWipe) {
      heroWipe.style.transform = `translate3d(0, ${(1 - wipe) * 100}%, 0)`;
      heroWipe.style.opacity = String(lerp(.88, 1, wipe));
    }
    if (wipeWord) {
      const wordIn = easeOut(range(p, .86, .985));
      wipeWord.style.opacity = String(wordIn);
      wipeWord.style.transform = `translateY(${lerp(30, 0, wordIn)}px) scale(${lerp(.985, 1, wordIn)})`;
    }
  }

  function updateThesis() {
    if (!thesis || !processLines.length || reducedMotion) return;
    if (mobileQuery.matches) return;

    const p = scrollProgress(thesis);
    processLines.forEach((line, i) => {
      const start = .06 + i * .18;
      const t = easeOut(range(p, start, start + .19));
      line.style.opacity = String(lerp(.22, 1, t));
      line.style.transform = `translateX(${lerp(24, 0, t)}px)`;
      line.classList.toggle('story-active', t > .55);
    });
  }

  function updateAI() {
    if (!aiScroll || reducedMotion) return;
    if (mobileQuery.matches) return;

    const p = scrollProgress(aiScroll);
    const inputsT = easeOut(range(p, .03, .38));
    const coreT = easeOut(range(p, .22, .52));
    const outT = easeOut(range(p, .46, .80));

    aiInputs.forEach((el, i) => {
      const offset = (1 - inputsT) * (-28 - i * 5);
      el.style.transform = `translateX(${offset}px) rotate(${[-4, 3, -2][i]}deg)`;
      el.style.opacity = String(.42 + inputsT * .58);
    });
    aiLines.forEach((line, i) => {
      const t = i === 0 ? inputsT : outT;
      line.style.transform = `scaleX(${Math.max(.04, t)})`;
      line.style.opacity = String(.18 + .48 * t);
    });
    if (aiCore) aiCore.style.transform = `translate(-50%, -50%) scale(${lerp(.88, 1, coreT)})`;
    if (aiOutput) {
      aiOutput.style.transform = `translateX(${lerp(42, 0, outT)}px)`;
      aiOutput.style.opacity = String(.2 + .8 * outT);
    }
    if (aiCheck) {
      aiCheck.style.transform = `translateY(${lerp(30, 0, outT)}px)`;
      aiCheck.style.opacity = String(.18 + .82 * outT);
    }
  }

  /* Kortix-like chapter: one pinned stage, four overlapping scenes.
     Vertical scroll advances a horizontal narrative without exposing a carousel track. */
  function updateCases() {
    if (!casesStage || !caseViewport || !casePanels.length || reducedMotion) return;

    const p = scrollProgress(casesStage);
    const q = p * (casePanels.length - 1);
    const active = Math.min(casePanels.length - 1, Math.max(0, Math.round(q)));
    const mobile = mobileQuery.matches;
    const distanceX = mobile ? 34 : 27;

    caseViewport.style.setProperty('transform', 'none', 'important');

    casePanels.forEach((panel, i) => {
      const d = i - q;
      const ad = Math.abs(d);
      const x = d * distanceX;

      let opacity = ad <= .52 ? lerp(.42, 1, 1 - ad / .52) : lerp(.18, .035, clamp((ad - .52) / .95));
      if (ad > 1.35) opacity = .018;
      const scale = lerp(1, mobile ? .968 : .972, clamp(ad));
      const blur = lerp(0, mobile ? 2.4 : 2.8, clamp(ad));
      const y = Math.sign(d) * lerp(0, mobile ? 7 : 10, clamp(ad));

      panel.style.setProperty('transform', `translate3d(calc(-50% + ${x}vw), calc(-50% + ${y}px), 0) scale(${scale})`, 'important');
      panel.style.setProperty('opacity', String(opacity), 'important');
      panel.style.setProperty('filter', `blur(${blur}px)`, 'important');
      panel.style.setProperty('z-index', String(100 - Math.round(ad * 10)), 'important');
      panel.style.pointerEvents = ad < .35 ? 'auto' : 'none';
      panel.setAttribute('aria-hidden', ad > 1.1 ? 'true' : 'false');

      const copy = panel.querySelector('.case-copy');
      const visual = panel.querySelector('.case-visual');
      if (visual) {
        const visualStrength = clamp(1 - ad / .95);
        const visualX = d * (mobile ? 7 : 10);
        visual.style.transform = `translate3d(${visualX}vw, 0, 0) scale(${lerp(.985, 1, visualStrength)})`;
        visual.style.opacity = String(lerp(.2, 1, visualStrength));
      }
      if (copy) {
        const copyStrength = clamp(1 - Math.max(0, ad - .08) / .74);
        copy.style.transform = `translate3d(${d * (mobile ? 10 : 13)}vw, 0, 0)`;
        copy.style.opacity = String(lerp(.08, 1, copyStrength));
      }

      panel.dataset.visualState = ad < .42 ? 'active' : ad < 1.05 ? 'near' : 'far';
    });

    progressBars.forEach((bar, i) => bar.classList.toggle('active', i === active));
  }

  function updateMethod() {
    if (!method || !methodSteps.length || reducedMotion || mobileQuery.matches) return;
    const p = scrollProgress(method);
    const q = p * (methodSteps.length - 1);
    const active = Math.round(q);
    methodSteps.forEach((step, i) => {
      const distance = Math.abs(i - q);
      const strength = clamp(1 - distance * .78);
      step.style.opacity = String(lerp(.24, 1, strength));
      step.style.transform = `translateY(${lerp(14, 0, strength)}px)`;
      step.classList.toggle('story-active', i === active);
    });
  }

  function updateResult() {
    if (!result || !practiceUI || reducedMotion || mobileQuery.matches) return;
    const p = scrollProgress(result);
    const uiT = easeOut(range(p, .04, .54));
    practiceUI.style.opacity = String(lerp(.42, 1, uiT));
    practiceUI.style.transform = `translate3d(${lerp(48, 0, uiT)}px, ${lerp(18, 0, uiT)}px, 0) scale(${lerp(.97, 1, uiT)})`;

    resultPoints.forEach((point, i) => {
      const t = easeOut(range(p, .18 + i * .11, .39 + i * .11));
      point.style.opacity = String(lerp(.28, 1, t));
      point.style.transform = `translateX(${lerp(18, 0, t)}px)`;
    });
  }

  function updateHeaderTone() {
    if (!header || !partner) return;
    const r = partner.getBoundingClientRect();
    header.classList.toggle('on-dark', r.top < 72 && r.bottom > 0);
  }

  function updateAll() {
    ticking = false;
    updateHero();
    updateThesis();
    updateAI();
    updateCases();
    updateMethod();
    updateResult();
    updateHeaderTone();
  }

  function requestTick() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateAll);
    }
  }

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('in-view');
      });
    }, { threshold: .16, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
  }

  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', () => {
    vw = window.innerWidth;
    vh = window.innerHeight;
    requestTick();
  }, { passive: true });
  mobileQuery.addEventListener?.('change', requestTick);
  updateAll();
})();
