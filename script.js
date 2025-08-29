// Simple mobile navigation for Lingle website
document.addEventListener('DOMContentLoaded', function () {
  // Mobile navbar burger toggle
  const burgers = Array.from(document.querySelectorAll('.navbar-burger'));
  burgers.forEach((burger) => {
    burger.addEventListener('click', () => {
      const targetId = burger.dataset.target || 'navbarMenu';
      const menu = document.getElementById(targetId);
      burger.classList.toggle('is-active');
      if (menu) menu.classList.toggle('is-active');
    });
  });

  // Simple 4-image carousel on home page
  const carousel = document.querySelector('.app-carousel');
  if (carousel) {
    const slides = Array.from(carousel.querySelectorAll('.app-slide'));
    const dots = Array.from(carousel.querySelectorAll('.app-dot'));
    const prev = carousel.querySelector('.app-prev');
    const next = carousel.querySelector('.app-next');
    let index = 0;
    let timer;

    function show(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach((s, idx) => s.classList.toggle('active', idx === index));
      dots.forEach((d, idx) => {
        d.classList.toggle('is-active', idx === index);
        d.setAttribute('aria-selected', idx === index ? 'true' : 'false');
      });
    }

    function nextSlide() { show(index + 1); }
    function prevSlide() { show(index - 1); }

    function start() { timer = setInterval(nextSlide, 5000); }
    function stop() { if (timer) clearInterval(timer); }

    next.addEventListener('click', () => { stop(); nextSlide(); start(); });
    prev.addEventListener('click', () => { stop(); prevSlide(); start(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { stop(); show(i); start(); }));

    // Keyboard support
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { stop(); nextSlide(); start(); }
      if (e.key === 'ArrowLeft') { stop(); prevSlide(); start(); }
    });

    // Pause on hover for desktop
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);

    show(0);
    start();
  }
});