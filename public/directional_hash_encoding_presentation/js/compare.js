/* compare.js — image comparison components for results slides.
 *
 * Wipe slider:  <div class="cmp-wipe" data-left="a.png" data-right="b.png"
 *                    data-label-left="Ours" data-label-right="Rath et al."></div>
 * Pointer-driven; auto-sweeps once when its slide is shown.
 */
(() => {
  function buildWipe(el) {
    const left = el.dataset.left, right = el.dataset.right;
    el.innerHTML = `
      <img src="${right}" draggable="false">
      <div class="cmp-top"><img src="${left}" draggable="false"></div>
      <div class="cmp-handle"></div>
      ${el.dataset.labelLeft ? `<div class="cmp-label left">${el.dataset.labelLeft}</div>` : ''}
      ${el.dataset.labelRight ? `<div class="cmp-label right">${el.dataset.labelRight}</div>` : ''}`;
    const top = el.querySelector('.cmp-top');
    const handle = el.querySelector('.cmp-handle');
    let pos = 0.5;
    function set(p) {
      pos = Math.max(0, Math.min(1, p));
      top.style.clipPath = `inset(0 ${100 - pos * 100}% 0 0)`;
      handle.style.left = `${pos * 100}%`;
    }
    set(0.5);
    el.addEventListener('pointermove', (e) => {
      if (e.buttons || e.pointerType === 'mouse') {
        const r = el.getBoundingClientRect();
        set((e.clientX - r.left) / r.width);
      }
    });
    // auto sweep on activation
    el._sweep = () => {
      const t0 = performance.now(), D = 2200, start = 0.08, end = 0.7;
      function anim(t) {
        const u = Math.min(1, (t - t0) / D);
        const e = 0.5 - 0.5 * Math.cos(Math.PI * u); // ease
        set(start + (end - start) * e);
        if (u < 1) requestAnimationFrame(anim);
      }
      requestAnimationFrame(anim);
    };
  }

  function initAll() {
    document.querySelectorAll('.cmp-wipe').forEach(buildWipe);
    Reveal.on('slidechanged', (e) => {
      e.currentSlide.querySelectorAll('.cmp-wipe').forEach((w) => w._sweep && w._sweep());
    });
  }

  if (window.Reveal && Reveal.isReady && Reveal.isReady()) initAll();
  else if (window.Reveal) Reveal.on('ready', initAll);
  else document.addEventListener('DOMContentLoaded', initAll);
})();
