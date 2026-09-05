(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobileQuery = window.matchMedia('(max-width: 900px)');
  const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => 1 - Math.pow(1 - clamp(t), 3);
  const range = (p, a, b) => clamp((p - a) / (b - a));

  const hero = document.querySelector('.hero-scroll');
  const heroPrimary = document.querySelector('.hero-copy-primary');
  const heroSecondary = document.querySelector('.hero-copy-secondary');
  const heroRail = document.querySelector('.hero-rail');
  const heroLabel = document.querySelector('.hero-flow-label');
  const heroWipe = document.querySelector('.hero-wipe');
  const wipeWord = document.querySelector('.wipe-word');
  const heroArtifacts = [...document.querySelectorAll('.hero-workbench .artifact')];

  const aiScroll = document.querySelector('.ai-scroll');
  const aiInputs = [...document.querySelectorAll('.ai-input')];
  const aiCore = document.querySelector('.ai-core');
  const aiOutput = document.querySelector('.ai-output');
  const aiCheck = document.querySelector('.ai-check');
  const aiLines = [...document.querySelectorAll('.ai-line')];

  const casesStage = document.querySelector('.cases-stage');
  const casePanels = [...document.querySelectorAll('.case-panel')];
  const progressBars = [...document.querySelectorAll('.case-progress i')];

  const header = document.querySelector('.site-header');
  const partner = document.querySelector('.partner');

  let ticking = false;
  let vw = window.innerWidth;
  let vh = window.innerHeight;

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
    const rect = hero.getBoundingClientRect();
    const travel = hero.offsetHeight - vh;
    const p = clamp(-rect.top / Math.max(1, travel));
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

  function updateAI() {
    if (!aiScroll || reducedMotion || mobileQuery.matches) return;
    const rect = aiScroll.getBoundingClientRect();
    const travel = aiScroll.offsetHeight - vh;
    const p = clamp(-rect.top / Math.max(1, travel));
    const inputsT = ease(range(p, .03, .42));
    const coreT = ease(range(p, .22, .52));
    const outT = ease(range(p, .45, .78));

    aiInputs.forEach((el, i) => {
      const offset = (1 - inputsT) * (-28 - i * 5);
      el.style.transform = `translateX(${offset}px) rotate(${[-4,3,-2][i]}deg)`;
      el.style.opacity = String(.48 + inputsT * .52);
    });
    aiLines.forEach((line, i) => {
      const t = i === 0 ? inputsT : outT;
      line.style.transform = `scaleX(${Math.max(.04, t)})`;
      line.style.opacity = String(.22 + .45 * t);
    });
    aiCore.style.transform = `translate(-50%, -50%) scale(${lerp(.88, 1, coreT)})`;
    aiOutput.style.transform = `translateX(${lerp(34, 0, outT)}px)`;
    aiOutput.style.opacity = String(.35 + .65 * outT);
    aiCheck.style.transform = `translateY(${lerp(26, 0, outT)}px)`;
    aiCheck.style.opacity = String(.28 + .72 * outT);
  }

  function updateCases() {
    if (!casesStage || reducedMotion || mobileQuery.matches) return;
    const rect = casesStage.getBoundingClientRect();
    const travel = casesStage.offsetHeight - vh;
    const p = clamp(-rect.top / Math.max(1, travel));
    const q = p * (casePanels.length - 1);
    const active = Math.min(casePanels.length - 1, Math.max(0, Math.round(q)));

    casePanels.forEach((panel, i) => {
      const d = i - q;
      const x = d * 62;
      const ad = Math.abs(d);
      const opacity = ad < .92 ? lerp(1, .22, ad / .92) : .08;
      const scale = lerp(1, .965, Math.min(1, ad));
      const blur = lerp(0, 3.2, Math.min(1, ad));
      panel.style.transform = `translate(calc(-50% + ${x}vw), -50%) scale(${scale})`;
      panel.style.opacity = String(opacity);
      panel.style.filter = `blur(${blur}px)`;
      panel.style.pointerEvents = ad < .46 ? 'auto' : 'none';
      panel.setAttribute('aria-hidden', ad < .75 ? 'false' : 'true');
    });
    progressBars.forEach((bar, i) => bar.classList.toggle('active', i === active));
  }

  function updateHeaderTone() {
    if (!header || !partner) return;
    const r = partner.getBoundingClientRect();
    header.classList.toggle('on-dark', r.top < 72 && r.bottom > 0);
  }

  function updateAll() {
    ticking = false;
    updateHero();
    updateAI();
    updateCases();
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
    }, { threshold: .18, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal, .method-step').forEach(el => revealObserver.observe(el));
  } else {
    document.querySelectorAll('.reveal, .method-step').forEach(el => el.classList.add('in-view'));
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
