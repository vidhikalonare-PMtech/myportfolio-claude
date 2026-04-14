// Main: theme toggle, nav state, GSAP scroll reveals, hero rotator.
// Native smooth scroll is used (via CSS `scroll-behavior: smooth`).
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- year in footer
  const yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  // --- theme toggle
  const root = document.documentElement;
  const themeBtn = document.querySelector('.nav__theme');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('vl-theme', next); } catch (e) {}
    });
  }

  // --- nav scrolled state
  const nav = document.querySelector('.nav');
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // --- Hero title reveal on load
  window.addEventListener('load', () => {
    const title = document.querySelector('.hero__title');
    if (title) title.classList.add('is-in');
  });

  // --- Scroll-driven fade ups
  const els = document.querySelectorAll('.section__head, .about__copy, .about__timeline, .project, .exp__item, .contact__big, .contact__links');
  els.forEach((el) => el.classList.add('fade-up'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach((el) => io.observe(el));
  } else {
    els.forEach((el) => el.classList.add('is-in'));
  }

  // --- GSAP parallax on project thumbs (uses native scroll)
  if (!reduced && window.gsap && window.ScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);
    document.querySelectorAll('.project__thumb svg').forEach((svg) => {
      window.gsap.fromTo(svg, { yPercent: -4 }, {
        yPercent: 4, ease: 'none',
        scrollTrigger: { trigger: svg, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
  }

  // --- Hero rotator
  const items = document.querySelectorAll('.rotator__item');
  if (items.length > 1 && !reduced) {
    let i = 0;
    setInterval(() => {
      items[i].classList.remove('is-active');
      items[i].classList.add('is-out');
      const next = (i + 1) % items.length;
      items[next].classList.remove('is-out');
      items[next].classList.add('is-active');
      i = next;
      const prev = (i - 2 + items.length) % items.length;
      items[prev].classList.remove('is-out');
    }, 2600);
  }
})();
