// Custom cursor — dot follows pointer, morphs on link/project hover.
(function () {
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isTouch || reduced) return;

  const cursor = document.querySelector('.cursor');
  if (!cursor) return;
  const label = cursor.querySelector('.cursor__label');
  document.documentElement.classList.add('has-cursor');

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let cx = mx, cy = my;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
  }, { passive: true });

  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });

  function tick() {
    // slight lag on the ring = gooey feel
    cx += (mx - cx) * 0.25;
    cy += (my - cy) * 0.25;
    cursor.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(tick);
  }
  tick();

  // Hover morph detection via data-cursor attr and common tags
  function setState(type, text) {
    cursor.classList.toggle('is-link', type === 'link');
    cursor.classList.toggle('is-project', type === 'project');
    if (label) label.textContent = text || '';
  }

  document.addEventListener('mouseover', (e) => {
    const el = e.target.closest('[data-cursor], a, button');
    if (!el) return setState(null);
    const kind = el.getAttribute('data-cursor');
    if (kind === 'project') setState('project', 'view →');
    else setState('link');
  });
  document.addEventListener('mouseout', (e) => {
    if (!e.relatedTarget || !(e.relatedTarget instanceof Element)) { setState(null); return; }
    const stillIn = e.relatedTarget.closest('[data-cursor], a, button');
    if (!stillIn) setState(null);
  });

  // Click feedback
  document.addEventListener('mousedown', () => { cursor.style.scale = '.8'; });
  document.addEventListener('mouseup', () => { cursor.style.scale = '1'; });
})();
