// Custom cursor — dot follows pointer, morphs on link/project hover.
// Uses rAF-interpolated translate3d for smoothness; no mix-blend-mode.
(function () {
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isTouch || reduced) return;

  const cursor = document.querySelector('.cursor');
  if (!cursor) return;
  const label = cursor.querySelector('.cursor__label');
  document.documentElement.classList.add('has-cursor');

  // Initialize off-screen; show only after first real mousemove to avoid a
  // spurious "jump" from 0,0 on page load.
  let mx = -100, my = -100;
  let cx = mx, cy = my;
  let ready = false;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    if (!ready) {
      // Snap initial position so the first frame is in the right place.
      cx = mx; cy = my;
      ready = true;
      cursor.classList.add('is-ready');
    }
  }, { passive: true });

  document.addEventListener('mouseleave', () => { cursor.classList.remove('is-ready'); });
  document.addEventListener('mouseenter', (e) => {
    if (e.clientX || e.clientY) {
      mx = cx = e.clientX;
      my = cy = e.clientY;
    }
    cursor.classList.add('is-ready');
  });

  function tick() {
    // Tighter interpolation for a responsive feel. No perceptible lag.
    cx += (mx - cx) * 0.35;
    cy += (my - cy) * 0.35;
    cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // Hover morph detection
  function setState(type) {
    cursor.classList.toggle('is-link', type === 'link');
    cursor.classList.toggle('is-project', type === 'project');
    if (label) label.textContent = type === 'project' ? 'view →' : '';
  }

  document.addEventListener('mouseover', (e) => {
    const el = e.target.closest('[data-cursor], a, button');
    if (!el) return setState(null);
    const kind = el.getAttribute('data-cursor');
    if (kind === 'project') setState('project');
    else setState('link');
  });
  document.addEventListener('mouseout', (e) => {
    const to = e.relatedTarget;
    if (!to || !(to instanceof Element)) { setState(null); return; }
    const stillIn = to.closest('[data-cursor], a, button');
    if (!stillIn) setState(null);
  });

  // Press feedback — handled via class + CSS (no transform collision)
  document.addEventListener('mousedown', () => cursor.classList.add('is-down'));
  document.addEventListener('mouseup', () => cursor.classList.remove('is-down'));
})();
