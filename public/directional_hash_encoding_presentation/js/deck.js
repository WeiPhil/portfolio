/* Deck initialization — HashGridSphere SIGGRAPH 2026 talk */

/* Backup slides (everything from the "Backup" divider on) are hidden from
   the slide count and the progress bar — the audience only ever sees N/N. */
const MAIN_SLIDE_COUNT = (() => {
  const all = Array.from(document.querySelectorAll('.reveal .slides > section'));
  const div = all.findIndex((s) => s.dataset.slide === 'backup-divider');
  return div === -1 ? all.length : div;   // slides 0 .. div-1 are the talk
})();

Reveal.initialize({
  width: 1920,
  height: 1080,
  margin: 0.04,
  hash: true,
  controls: false,
  progress: false,         // custom bar below, capped at the main deck
  center: true,            // native vertical centering (kickers pinned via JS)
  // bottom-right page number, total = main deck only; blank on backup slides
  slideNumber: (slide) => {
    const h = Reveal.getHorizontalSlides().indexOf(slide) + 1;
    return h > MAIN_SLIDE_COUNT ? [''] : [h];
  },
  transition: 'fade',
  transitionSpeed: 'fast',
  backgroundTransition: 'fade',
  fragmentInURL: true,
  // Videos with data-autoplay start when their fragment shows / slide appears
  autoPlayMedia: null,
  preloadIframes: true,
});

/* Custom progress bar over the MAIN deck only: full on the last talk slide,
   hidden on backup slides. */
(() => {
  const bar = document.createElement('div');
  Object.assign(bar.style, {
    position: 'fixed', left: 0, bottom: 0, height: '4px', width: '0%',
    background: 'var(--c-ours)', zIndex: 60, transition: 'width 0.25s ease',
    pointerEvents: 'none',
  });
  document.body.appendChild(bar);
  const update = () => {
    const h = Reveal.getIndices().h;
    if (h >= MAIN_SLIDE_COUNT) { bar.style.display = 'none'; return; }
    bar.style.display = 'block';
    bar.style.width = (100 * h / Math.max(1, MAIN_SLIDE_COUNT - 1)) + '%';
  };
  Reveal.on('ready', update);
  Reveal.on('slidechanged', update);
})();

/* Fixed chrome outside the slide flow: SIGGRAPH badge, top right.
   (Vector approximation of the official logo — drop the real file at
   assets/logos/siggraph2026.png to use it instead.) */
(() => {
  const badge = document.createElement('div');
  Object.assign(badge.style, {
    position: 'fixed', top: '14px', right: '18px', zIndex: 50,
    display: 'flex', alignItems: 'center', gap: '10px',
    opacity: 0.75, pointerEvents: 'none',
  });
  badge.innerHTML = `
    <svg width="34" height="34" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="46" fill="#9aa3b2"/>
      <ellipse cx="50" cy="50" rx="40" ry="16" fill="none" stroke="#0e1116" stroke-width="7"
               transform="rotate(-32 50 50)"/>
      <path d="M 20 72 A 46 46 0 0 0 82 22" fill="none" stroke="#0e1116" stroke-width="7"/>
    </svg>
    <div style="font-family: 'Segoe UI', Arial, sans-serif; color:#9aa3b2; line-height:1.2; text-align:left">
      <div style="font-size:15px; font-weight:800; letter-spacing:0.02em">SIGGRAPH 2026</div>
      <div style="font-size:11px">Los Angeles · 19–23 JUL</div>
    </div>`;
  const img = new Image();
  img.onload = () => {
    badge.innerHTML = '';
    // official logo (cream-on-transparent SVG) — use as-is, no filter
    Object.assign(img.style, { height: '38px' });
    badge.appendChild(img);
  };
  img.src = 'assets/logos/siggraph_logo.svg';
  document.body.appendChild(badge);
})();

/* Videos play exactly ONCE: first reveal plays them; once ended they stay
   on their last frame no matter how reveal re-triggers autoplay. */
document.addEventListener('ended', (e) => {
  if (e.target.tagName === 'VIDEO') e.target.dataset.played = '1';
}, true);
document.addEventListener('play', (e) => {
  const v = e.target;
  if (v.tagName === 'VIDEO' && v.dataset.played === '1') {
    v.pause();
    if (isFinite(v.duration)) v.currentTime = Math.max(0, v.duration - 0.03);
  }
}, true);
Reveal.on('fragmentshown', (e) => {
  const frags = e.fragments && e.fragments.length ? e.fragments : [e.fragment];
  for (const f of frags) {
    const vid = f.matches('video') ? f : f.querySelector('video');
    if (vid && vid.dataset.played !== '1') { vid.currentTime = 0; vid.play().catch(() => {}); }
  }
});
/* Leaving a video slide re-arms its videos so revisiting replays them */
Reveal.on('slidechanged', (e) => {
  if (!e.previousSlide) return;
  e.previousSlide.querySelectorAll('video').forEach((v) => {
    delete v.dataset.played;
    v.pause(); v.currentTime = 0;
  });
});

/* Widget lifecycle hooks: widgets register themselves here (phases 3-4).
   Each entry: { slide: '<data-slide value>', init(container), activate(), deactivate() } */
window.DeckWidgets = window.DeckWidgets || [];

function syncWidgets(slide) {
  const name = slide && slide.dataset.slide;
  window.DeckWidgets.forEach((w) => {
    if (w.slide === name) { if (!w._inited) { w.init(); w._inited = true; } w.activate && w.activate(); }
    else if (w._inited) { w.deactivate && w.deactivate(); }
  });
}
Reveal.on('slidechanged', (e) => syncWidgets(e.currentSlide));
/* widgets register after Reveal is ready when loading directly on their
   slide (via URL hash) — sync once everything has loaded */
window.addEventListener('load', () => setTimeout(() => syncWidgets(Reveal.getCurrentSlide()), 60));

/* Kickers pinned to the same viewport spot on every slide: compensate the
   vertical offset reveal's center:true gives each section. */
(() => {
  function pin() {
    document.querySelectorAll('.reveal .slides section .kicker').forEach((k) => {
      const sec = k.closest('section');
      k.style.top = (14 - (parseFloat(sec.style.top) || 0)) + 'px';
    });
  }
  Reveal.on('ready', pin);
  Reveal.on('slidechanged', pin);
  Reveal.on('resize', pin);
  window.addEventListener('load', () => setTimeout(pin, 100));
})();

/* Speaker view and timer removed for public distribution */
