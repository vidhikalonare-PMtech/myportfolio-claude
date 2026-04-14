// Project card expand/collapse drawer
(function () {
  const cards = document.querySelectorAll('.project__card');

  function close(card) {
    const id = card.getAttribute('aria-controls');
    const drawer = document.getElementById(id);
    if (!drawer) return;
    card.setAttribute('aria-expanded', 'false');
    drawer.style.maxHeight = '0px';
  }

  function open(card) {
    const id = card.getAttribute('aria-controls');
    const drawer = document.getElementById(id);
    if (!drawer) return;
    card.setAttribute('aria-expanded', 'true');
    // measure content
    const inner = drawer.firstElementChild;
    drawer.style.maxHeight = (inner ? inner.scrollHeight : 800) + 40 + 'px';
  }

  cards.forEach((card) => {
    card.addEventListener('click', (e) => {
      // Don't toggle if clicking inside drawer (future-proof)
      const expanded = card.getAttribute('aria-expanded') === 'true';
      // Close others (single-open)
      cards.forEach((c) => { if (c !== card) close(c); });
      expanded ? close(card) : open(card);
    });
  });

  // Escape closes the expanded drawer
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = document.querySelector('.project__card[aria-expanded="true"]');
    if (open) close(open);
  });

  // Re-measure on resize (in case of reflow)
  let rAF;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(rAF);
    rAF = requestAnimationFrame(() => {
      document.querySelectorAll('.project__card[aria-expanded="true"]').forEach(open);
    });
  });
})();
