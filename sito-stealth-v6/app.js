(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobileQuery = window.matchMedia('(max-width: 900px)');
  const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => 1 - Math.pow(1 - clamp(t), 3);
  const range = (p, a, b) => clamp((p - a) / Math.max(.0001, b - a));

  const hero = document.querySelector('.hero-scroll');
  const heroPrimary = document.querySelector('.hero-copy-primary');
  const heroSecondary = document.querySelector('.hero-copy-secondary');
  const heroRail = document.querySelector('.hero-rail');
  const heroLabel = document.querySelector('.hero-flow-label');
  const heroWipe = document.querySelector('.hero-wipe');
  const wipeWord = document.querySelector('.wipe-word');
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

  function heroTransform(el, p) {
    const ds = el.dataset;
    const mobile = mobileQuery.matches;
    const x0 = Number(ds.x);
    const y0 = Number(ds.y);
    const r0 = Number(ds.r);
    const s0 = Number(ds.scale);
    const x1 = Number(ds.finalX);
    const y1 = Number(ds.finalY);
    const r1 = Number(ds.finalR);
    const s1 = Number(ds.finalScale);
    const t = ease(range(p, .08, .58));
    const x = lerp(x0, x1, t) * vw / 100;
    const yScale = mobile ? .72 : 1;
    const y = lerp(y0, y1, t) * vh / 100 * yScale;
    const r = lerp(r0, r1, t);
    const s = lerp(s0, s1, t) * (mobile ? .78 : 1);
    const fade = 1 - .72 * range(p, .64, .82);
    const blur = lerp(0, 1.5, range(p, .65, .82));
    el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${r}deg) scale(${s})`;
    el.style.opacity = String(fade);
    el.style.filter = `blur(${blur}px)`;
  }

  function updateHero() {
    if (!hero || reducedMotion) return;
    const p = scrollProgress(hero);
    heroArtifacts.forEach(el => heroTransform(el, p));

    const primaryOut = range(p, .32, .49);
    heroPrimary.style.opacity = String(1 - primaryOut);
    heroPrimary.style.transform = `translateX(-50%) translateY(${-26 * primaryOut}px)`;

    const secondaryIn = ease(range(p, .46, .62));
    const secondaryOut = range(p, .73, .84);
    heroSecondary.style.opacity = String(secondaryIn * (1 - secondaryOut));
    heroSecondary.style.transform = `translate(-50%, ${lerp(28, 0, secondaryIn) - 18 * secondaryOut}px)`;

    const railIn = ease(range(p, .43, .64));
    const railOut = range(p, .72, .82);
    heroRail.style.opacity = String(railIn * (1 - railOut));
    heroRail.style.transform = `translateX(-50%) scaleX(${lerp(.05, 1, railIn)})`;

    const labelIn = ease(range(p, .54, .67));
    const labelOut = range(p, .73, .83);
    heroLabel.style.opacity = String(labelIn * (1 - labelOut));
    heroLabel.style.transform = `translate(-50%, ${lerp(14, 0, labelIn)}px)`;

    const wipe = ease(range(p, .78, .93));
    heroWipe.style.transform = `translateY(${(1 - wipe) * 100}%)`;
    const wordIn = ease(range(p, .86, .97));
    wipeWord.style.opacity = String(wordIn);
    wipeWord.style.transform = `translateY(${lerp(24, 0, wordIn)}px)`;
  }

  function updateThesis() {
    if (!thesis || !processLines.length || reducedMotion) return;
    if (mobileQuery.matches) {
      processLines.forEach(line => {
        line.style.opacity = '';
        line.style.transform = '';
        line.classList.remove('story-active');
      });
      return;
    }

    const p = scrollProgress(thesis);
    processLines.forEach((line, i) => {
      const start = .06 + i * .18;
      const t = ease(range(p, start, start + .19));
      line.style.opacity = String(lerp(.22, 1, t));
      line.style.transform = `translateX(${lerp(24, 0, t)}px)`;
      line.classList.toggle('story-active', t > .55);
    });
  }

  function updateAI() {
    if (!aiScroll || reducedMotion) return;
    if (mobileQuery.matches) {
      aiInputs.forEach(el => { el.style.transform = ''; el.style.opacity = ''; });
      aiLines.forEach(el => { el.style.transform = ''; el.style.opacity = ''; });
      if (aiCore) aiCore.style.transform = '';
      if (aiOutput) { aiOutput.style.transform = ''; aiOutput.style.opacity = ''; }
      if (aiCheck) { aiCheck.style.transform = ''; aiCheck.style.opacity = ''; }
      return;
    }

    const p = scrollProgress(aiScroll);
    const inputsT = ease(range(p, .03, .38));
    const coreT = ease(range(p, .22, .52));
    const outT = ease(range(p, .46, .80));

    aiInputs.forEach((el, i) => {
      const offset = (1 - inputsT) * (-28 - i * 5);
      el.style.transform = `translateX(${offset}px) rotate(${[-4,3,-2][i]}deg)`;
      el.style.opacity = String(.42 + inputsT * .58);
    });
    aiLines.forEach((line, i) => {
      const t = i === 0 ? inputsT : outT;
      line.style.transform = `scaleX(${Math.max(.04, t)})`;
      line.style.opacity = String(.18 + .48 * t);
    });
    aiCore.style.transform = `translate(-50%, -50%) scale(${lerp(.88, 1, coreT)})`;
    aiOutput.style.transform = `translateX(${lerp(42, 0, outT)}px)`;
    aiOutput.style.opacity = String(.2 + .8 * outT);
    aiCheck.style.transform = `translateY(${lerp(30, 0, outT)}px)`;
    aiCheck.style.opacity = String(.18 + .82 * outT);
  }

  /* Desktop and mobile use the same core interaction:
     vertical page scroll scrubs one pinned horizontal case track. */
  function updateCases() {
    if (!casesStage || !caseViewport || !casePanels.length || reducedMotion) return;

    const p = scrollProgress(casesStage);
    const maxTranslate = Math.max(0, caseViewport.scrollWidth - vw);
    const x = maxTranslate * p;
    caseViewport.style.transform = `translate3d(${-x}px,0,0)`;

    const q = p * (casePanels.length - 1);
    const active = Math.min(casePanels.length - 1, Math.max(0, Math.round(q)));

    casePanels.forEach((panel, i) => {
      const distance = Math.abs(i - q);
      const activeLimit = mobileQuery.matches ? .62 : .55;
      const nearLimit = mobileQuery.matches ? 1.3 : 1.45;
      const state = distance < activeLimit ? 'active' : distance < nearLimit ? 'near' : 'far';
      panel.dataset.visualState = state;
      panel.setAttribute('aria-hidden', state === 'far' ? 'true' : 'false');
    });

    progressBars.forEach((bar, i) => bar.classList.toggle('active', i === active));
  }

  function updateMethod() {
    if (!method || !methodSteps.length || reducedMotion) return;
    if (mobileQuery.matches) {
      methodSteps.forEach(step => step.classList.remove('story-active'));
      return;
    }

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
    if (!result || !practiceUI || reducedMotion) return;
    if (mobileQuery.matches) {
      practiceUI.style.transform = '';
      practiceUI.style.opacity = '';
      resultPoints.forEach(point => { point.style.opacity = ''; point.style.transform = ''; });
      return;
    }

    const p = scrollProgress(result);
    const uiT = ease(range(p, .04, .54));
    practiceUI.style.opacity = String(lerp(.42, 1, uiT));
    practiceUI.style.transform = `translate3d(${lerp(48, 0, uiT)}px, ${lerp(18, 0, uiT)}px, 0) scale(${lerp(.97, 1, uiT)})`;

    resultPoints.forEach((point, i) => {
      const t = ease(range(p, .18 + i * .11, .39 + i * .11));
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
