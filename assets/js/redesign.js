/* NERI.DEV redesign — vanilla interactivity */
(function () {
  'use strict';

  // ---------- Nav scroll state ----------
  var nav = document.querySelector('.site-nav');
  if (nav) {
    var onScroll = function () {
      if (window.scrollY > 20) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---------- Mobile menu ----------
  var overlay = document.querySelector('.mobile-overlay');
  var openBtn = document.querySelector('[data-action="open-menu"]');
  var closeBtn = document.querySelector('[data-action="close-menu"]');
  function openMenu() {
    if (!overlay) return;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (openBtn) openBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (overlay) {
    overlay.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  // ---------- FAQ accordion ----------
  document.querySelectorAll('.faq-item').forEach(function (item, idx) {
    var btn = item.querySelector('.faq-q');
    if (!btn) return;
    if (idx === 0) item.classList.add('open');
    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (el) {
        el.classList.remove('open');
      });
      if (!isOpen) item.classList.add('open');
    });
  });

  // ---------- HLS video (hero) ----------
  var video = document.querySelector('.hero-video');
  if (video) {
    var src = 'https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8';
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({ enableWorker: false });
      hls.loadSource(src);
      hls.attachMedia(video);
    }
  }

  // ---------- Split-text reveal for headline ----------
  document.querySelectorAll('[data-split-text]').forEach(function (el) {
    var baseDelay = parseFloat(el.getAttribute('data-split-delay') || '0');
    var text = el.textContent;
    el.textContent = '';
    text.split(' ').forEach(function (w, i) {
      var wrap = document.createElement('span');
      wrap.className = 'split-line';
      wrap.style.marginRight = '0.25em';
      var inner = document.createElement('span');
      inner.textContent = w;
      inner.style.animationDelay = (baseDelay + i * 0.05) + 's';
      wrap.appendChild(inner);
      el.appendChild(wrap);
    });
  });

  // ---------- Contact form (graceful) ----------
  var form = document.querySelector('[data-contact-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var label = form.querySelector('[data-submit-label]');
      var name = (form.elements['name'] && form.elements['name'].value) || '';
      var email = (form.elements['email'] && form.elements['email'].value) || '';
      var phone = (form.elements['phone'] && form.elements['phone'].value) || '';
      var type = (form.elements['type'] && form.elements['type'].value) || '';
      var budget = (form.elements['budget'] && form.elements['budget'].value) || '';
      var msg = (form.elements['message'] && form.elements['message'].value) || '';

      var body = [
        'Hola Neri, soy ' + name + '.',
        '',
        'Email: ' + email,
        phone ? 'WhatsApp: ' + phone : '',
        'Tipo de proyecto: ' + type,
        budget ? 'Presupuesto: ' + budget : '',
        '',
        'Detalles:',
        msg,
      ].filter(Boolean).join('\n');

      var wa = 'https://wa.me/584222707095?text=' + encodeURIComponent(body);
      window.open(wa, '_blank', 'noopener');

      if (label) label.textContent = 'Mensaje enviado';
      if (btn) btn.classList.add('sent');
      setTimeout(function () {
        if (label) label.textContent = 'Enviar mensaje';
        if (btn) btn.classList.remove('sent');
      }, 4000);
    });
  }

  // ---------- Smooth scroll for hash links ----------
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (!href || href.length < 2) return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();
