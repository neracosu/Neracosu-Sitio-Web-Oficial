/**
 * Main.js - Site orchestrator
 * Handles: Preloader, Lenis, GSAP, ScrollTrigger, Nav, Accordion, Tilt Cards, Carousel, Counters
 */
(function () {
  'use strict';

  // Wait for DOM and all deferred scripts
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    preloader();
    initNav();
    // On initial load: if GSAP not yet available, skip animation inits (they'll run later)
    if (typeof gsap !== 'undefined') {
      initLenis();
      initHeroAnimations();
      initScrollAnimations();
    }
    initCounters();
    initTestimonialsCarousel();
    initTiltCards();
    initBackToTop();
    initCertPreview();
    initParticles();
  }

  // Called by the desktop script loader after GSAP/Lenis are loaded
  window._initDesktopFeatures = function () {
    initLenis();
    initHeroAnimations();
    initScrollAnimations();
  };

  /* =========================================
     PRELOADER
     ========================================= */
  function preloader() {
    const el = document.getElementById('preloader');
    if (!el) return;

    const isMobile = window.innerWidth < 768;

    // On mobile: hide immediately, no typewriter
    if (isMobile) {
      el.remove();
      document.body.style.overflow = '';
      return;
    }

    // Desktop: brief typewriter + hide
    const textEl = document.getElementById('preloader-text');
    const text = 'NERI COLON';
    let i = 0;

    function typeChar() {
      if (i < text.length) {
        textEl.textContent += text[i];
        i++;
        setTimeout(typeChar, 80);
      }
    }
    typeChar();

    const hide = () => {
      el.classList.add('is-hidden');
      document.body.style.overflow = '';
      setTimeout(() => { el.remove(); }, 500);
    };

    if (document.readyState === 'complete') {
      setTimeout(hide, 400);
    } else {
      window.addEventListener('load', () => setTimeout(hide, 300));
      setTimeout(hide, 1500); // Max wait
    }
  }

  /* =========================================
     LENIS SMOOTH SCROLL
     ========================================= */
  let lenisInstance;

  function initLenis() {
    if (typeof Lenis === 'undefined' || lenisInstance) return;

    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    // Sync with GSAP ticker
    if (typeof gsap !== 'undefined') {
      gsap.ticker.add((time) => {
        lenisInstance.raf(time * 1000);
      });
    } else {
      function raf(time) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    // Handle anchor clicks with smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          e.preventDefault();
          lenisInstance.scrollTo(target, { offset: -80 });
          // Close mobile nav if open
          closeMobileNav();
        }
      });
    });
  }

  /* =========================================
     NAVIGATION
     ========================================= */
  function initNav() {
    const header = document.getElementById('header');
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    let overlay;

    if (!header || !toggle || !menu) return;

    // Create overlay
    overlay = document.createElement('div');
    overlay.className = 'nav__overlay';
    document.body.appendChild(overlay);

    // Toggle mobile nav
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.contains('is-open');
      if (isOpen) {
        closeMobileNav();
      } else {
        menu.classList.add('is-open');
        toggle.classList.add('is-active');
        toggle.setAttribute('aria-expanded', 'true');
        overlay.classList.add('is-visible');
        if (lenisInstance) lenisInstance.stop();
      }
    });

    // Close on overlay click
    overlay.addEventListener('click', closeMobileNav);

    // Scroll header
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY > 50) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
      lastScroll = scrollY;
    }, { passive: true });

    // Close mobile nav on any anchor link click + smooth scroll fallback
    document.querySelectorAll('.nav__link[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          closeMobileNav();
          // If Lenis is active, it handles scrolling via its own listeners
          if (!lenisInstance) {
            e.preventDefault();
            const offset = target.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: offset, behavior: 'smooth' });
          }
        }
      });
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link:not(.nav__link--cta)');

    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        const top = section.offsetTop - 100;
        if (window.scrollY >= top) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('is-active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('is-active');
        }
      });
    }, { passive: true });
  }

  function closeMobileNav() {
    const menu = document.getElementById('nav-menu');
    const toggle = document.getElementById('nav-toggle');
    const overlay = document.querySelector('.nav__overlay');

    if (menu) menu.classList.remove('is-open');
    if (toggle) {
      toggle.classList.remove('is-active');
      toggle.setAttribute('aria-expanded', 'false');
    }
    if (overlay) overlay.classList.remove('is-visible');
    if (lenisInstance) lenisInstance.start();
  }

  /* =========================================
     HERO ANIMATIONS (GSAP)
     ========================================= */
  var _heroAnimated = false;
  function initHeroAnimations() {
    if (typeof gsap === 'undefined' || _heroAnimated) return;
    _heroAnimated = true;

    // Use GSAP.set for instant hide (no CSS class flash)
    gsap.set('.hero__kicker, .hero__subtitle, .hero__ctas, .hero__trust', { opacity: 0, y: 30 });
    gsap.set('.hero__word', { opacity: 0, y: '100%' });

    // If loaded late (deferred), use shorter delay
    const isLateLoad = document.readyState === 'complete';
    const tl = gsap.timeline({ delay: isLateLoad ? 0.2 : 1.5 });

    // Kicker
    tl.to('.hero__kicker', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    });

    // Words reveal
    tl.to('.hero__word', {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.06,
      ease: 'power3.out'
    }, '-=0.2');

    // Highlight underline
    tl.to('.hero__word--highlight::after', {
      scaleX: 1,
      duration: 0.6,
      ease: 'power2.inOut'
    }, '-=0.1');

    // For the pseudo-element, we use a class approach
    tl.add(() => {
      const highlight = document.querySelector('.hero__word--highlight');
      if (highlight) highlight.classList.add('is-revealed');
    }, '-=0.1');

    // Subtitle
    tl.to('.hero__subtitle', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.3');

    // CTAs
    tl.to('.hero__ctas', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.3');

    // Trust badges
    tl.to('.hero__trust', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.2');

    // Add CSS for the highlight reveal
    const style = document.createElement('style');
    style.textContent = '.hero__word--highlight.is-revealed::after{transform:scaleX(1);transition:transform 0.6s cubic-bezier(0.4,0,0.2,1)}';
    document.head.appendChild(style);
  }

  /* =========================================
     SCROLL ANIMATIONS (GSAP ScrollTrigger)
     ========================================= */
  var _scrollAnimated = false;
  function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || _scrollAnimated) return;
    _scrollAnimated = true;

    gsap.registerPlugin(ScrollTrigger);

    // Animate elements with data-animate attribute
    document.querySelectorAll('[data-animate]').forEach(el => {
      const delay = parseInt(el.dataset.delay) || 0;

      gsap.fromTo(el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: delay / 1000,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true
          }
        }
      );
    });

    // Section kickers and titles
    document.querySelectorAll('.section__kicker, .section__title, .section__subtitle').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true
          }
        }
      );
    });

    // Process timeline SVG line draw
    const processLine = document.querySelector('.process__line-progress');
    if (processLine) {
      gsap.to(processLine, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.process__timeline',
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: 1
        }
      });
    }

    // Nav glassmorphism on scroll
    ScrollTrigger.create({
      start: 50,
      onUpdate: (self) => {
        const header = document.getElementById('header');
        if (header) {
          if (self.scroll() > 50) {
            header.classList.add('is-scrolled');
          } else {
            header.classList.remove('is-scrolled');
          }
        }
      }
    });
  }

  /* =========================================
     ANIMATED COUNTERS
     ========================================= */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(eased * target);
      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  /* =========================================
     TESTIMONIALS CAROUSEL
     ========================================= */
  function initTestimonialsCarousel() {
    const track = document.querySelector('.testimonials__track');
    const cards = document.querySelectorAll('.testimonials__card');
    const prevBtn = document.querySelector('.testimonials__btn--prev');
    const nextBtn = document.querySelector('.testimonials__btn--next');
    const dots = document.querySelectorAll('.testimonials__dot');

    if (!track || !cards.length) return;

    let current = 0;
    let autoPlayTimer;
    const total = cards.length;

    function goTo(index) {
      current = ((index % total) + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;

      dots.forEach((dot, i) => {
        dot.classList.toggle('testimonials__dot--active', i === current);
      });
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAutoPlay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAutoPlay(); });

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        goTo(parseInt(dot.dataset.index));
        resetAutoPlay();
      });
    });

    // Auto-advance
    function startAutoPlay() {
      autoPlayTimer = setInterval(next, 5000);
    }

    function resetAutoPlay() {
      clearInterval(autoPlayTimer);
      startAutoPlay();
    }

    // Pause on hover
    const carousel = document.getElementById('testimonials-carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
      carousel.addEventListener('mouseleave', startAutoPlay);
    }

    startAutoPlay();
  }

  /* =========================================
     TILT CARDS (3D hover effect)
     ========================================= */
  function initTiltCards() {
    if (window.innerWidth < 768) return;

    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -5;
        const rotateY = (x - centerX) / centerX * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;

        // Update glow position
        const glow = card.querySelector('.services__card-glow');
        if (glow) {
          glow.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
          glow.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* =========================================
     BACK TO TOP
     ========================================= */
  function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > window.innerHeight * 0.5) {
        btn.classList.add('is-visible');
      } else {
        btn.classList.remove('is-visible');
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      if (lenisInstance) {
        lenisInstance.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  /* =========================================
     CERTIFICATE PREVIEW TOOLTIP
     ========================================= */
  function initCertPreview() {
    if (window.innerWidth < 768 || matchMedia('(hover: none)').matches) return;

    const preview = document.createElement('div');
    preview.className = 'cert-preview';
    document.body.appendChild(preview);

    document.querySelectorAll('.certs__item[data-cert]').forEach(item => {
      item.addEventListener('mouseenter', () => {
        const src = item.getAttribute('data-cert');
        if (!src) return;
        preview.style.backgroundImage = 'url(' + src + ')';
        const rect = item.getBoundingClientRect();
        let left = rect.left + rect.width / 2 - 150;
        left = Math.max(8, Math.min(left, window.innerWidth - 308));
        preview.style.left = left + 'px';
        preview.style.top = (rect.top - 225) + 'px';
        preview.classList.add('is-visible');
      });

      item.addEventListener('mouseleave', () => {
        preview.classList.remove('is-visible');
      });
    });
  }

  /* =========================================
     PARTICLES INIT
     ========================================= */
  function initParticles() {
    // particles.js is an ES module that self-initializes when loaded.
    // No action needed here — the module handles everything.
    // Do NOT add 'no-webgl' class; particles.js loads asynchronously
    // after the page load event and will initialize on its own.
  }

})();
