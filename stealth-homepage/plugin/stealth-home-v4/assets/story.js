/* Normal document scroll. Horizontal enhancement only when every panel fits. */
(() => {
  'use strict';
  const root = document.querySelector('#sth-story');
  if (!root || root.dataset.sthReady) return;
  root.dataset.sthReady = 'true';
  const journey = root.querySelector('[data-sth-journey]');
  const track = root.querySelector('.sth-track');
  const panels = [...root.querySelectorAll('.sth-panel')];
  const links = [...root.querySelectorAll('.sth-chapters a')];
  const scenes = [...root.querySelectorAll('[data-sth-scene]')];
  const resolution = root.querySelector('[data-sth-resolution]');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = n => Math.min(1, Math.max(0, n));
  let top = 0, height = innerHeight, travel = 0, enabled = false, raf = 0, resizeTimer;
  let selected = -1;

  function measure() {
    height = innerHeight;
    // The only queries outside our root: existing theme header/admin bar geometry.
    const header = document.querySelector('#header');
    const bar = document.querySelector('#wpadminbar');
    top = 0;
    for (const el of [header, bar]) {
      if (!el) continue;
      const pos = getComputedStyle(el).position;
      if (pos === 'fixed' || pos === 'sticky') top = Math.max(top, el.getBoundingClientRect().bottom);
    }
    top = Math.max(0, Math.min(height * .3, top));
    root.style.setProperty('--sth-top', `${top}px`);
    root.style.setProperty('--sth-vh', `${height}px`);
    root.classList.remove('sth-motion');
    journey.style.height = '';
    track.style.transform = '';
    const available = height - top;
    enabled = !motion.matches && available >= 510 && panels.every(panel => {
      const css = getComputedStyle(panel);
      const copy = panel.querySelector('.sth-copy').offsetHeight;
      const art = panel.querySelector('.sth-composition').offsetHeight;
      const stacked = css.gridTemplateColumns.split(' ').length === 1;
      const required = (stacked ? copy + art + parseFloat(css.rowGap) : Math.max(copy, art)) + parseFloat(css.paddingTop) + parseFloat(css.paddingBottom);
      return required <= available + 2;
    });
    travel = enabled ? available * (panels.length - 1) * 1.15 : 0;
    if (enabled) {
      root.classList.add('sth-motion');
      journey.style.height = `${available + travel}px`;
    }
    selected = -1;
    request();
  }

  function render() {
    raf = 0;
    const reduced = motion.matches;
    if (enabled) {
      const progress = clamp((top - journey.getBoundingClientRect().top) / travel);
      track.style.transform = `translate3d(${-progress * (track.scrollWidth - root.clientWidth)}px,0,0)`;
      root.style.setProperty('--sth-progress', String(progress));
      const next = Math.round(progress * (panels.length - 1));
      if (next !== selected) {
        selected = next;
        links.forEach((link, i) => i === next ? link.setAttribute('aria-current', 'step') : link.removeAttribute('aria-current'));
      }
      const local = clamp(progress * 3);
      const offsets = [[-20,-12,-7],[15,-5,-6],[25,10,7],[-5,22,11]];
      root.querySelectorAll('.sth-piece').forEach((piece, i) => {
        const [x,y,r] = offsets[i];
        piece.style.transform = `translate3d(${x*local}px,${y*local}px,0) rotate(${r+local*2}deg)`;
      });
    }
    scenes.forEach(scene => {
      const r = scene.getBoundingClientRect();
      const p = reduced ? 1 : clamp((height - r.top) / (height + r.height * .25));
      scene.style.setProperty('--sth-scene-p', String(p));
      const path = scene.querySelector('.sth-ai-flow path');
      const dot = scene.querySelector('.sth-flow-dot');
      if (path && dot) {
        const point = path.getPointAtLength(path.getTotalLength() * p);
        dot.setAttribute('cx', point.x); dot.setAttribute('cy', point.y);
      }
    });
    if (resolution) {
      const r = resolution.getBoundingClientRect();
      resolution.style.setProperty('--sth-system-p', String(reduced ? 1 : clamp((height-r.top)/(height+r.height*.1))));
    }
  }
  function request() { if (!raf) raf = requestAnimationFrame(render); }
  function goTo(index, smooth) {
    if (!enabled) return;
    const y = scrollY + journey.getBoundingClientRect().top - top + travel * index / (panels.length-1);
    scrollTo({top:y, behavior:smooth && !motion.matches ? 'smooth' : 'auto'});
  }
  links.forEach((link, i) => link.addEventListener('click', event => {
    if (!enabled) return;
    event.preventDefault();
    goTo(i, true);
  }));
  function hash() {
    const index = panels.findIndex(panel => `#${panel.id}` === location.hash);
    if (index >= 0) goTo(index, false);
  }
  addEventListener('scroll', request, {passive:true});
  addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(measure,180); }, {passive:true});
  addEventListener('hashchange', hash);
  if (motion.addEventListener) motion.addEventListener('change', measure);
  else motion.addListener(measure);
  measure();
  if (document.fonts) document.fonts.ready.then(() => { measure(); hash(); });
  addEventListener('load', () => { measure(); hash(); }, {once:true});
})();
