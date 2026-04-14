// Main: Lenis smooth scroll, GSAP scroll-driven reveals, theme toggle, nav, hero rotator.
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

  // --- Lenis smooth scroll
  if (!reduced && window.Lenis) {
    const lenis = new window.Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // Anchor links via Lenis
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (!id || id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80, duration: 1.2 });
      });
    });

    // Keep GSAP ScrollTrigger in sync with Lenis
    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', window.ScrollTrigger.update);
      window.gsap.ticker.add((time) => lenis.raf(time * 1000));
      window.gsap.ticker.lagSmoothing(0);
    }
  }

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

  // --- GSAP parallax on project thumbs
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
      // Clear the "is-out" flag on the previous previous, to reset
      const prev = (i - 2 + items.length) % items.length;
      items[prev].classList.remove('is-out');
    }, 2600);
  }
})();
