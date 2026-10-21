/* NERACOSU redesign — vanilla interactivity */
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
  // ---------- Formulario de contacto ----------
  // Desde el 2026-10-21 la solicitud va al panel de prospeccion (le llega a Neri por
  // correo y queda en prospectos.neracosu.com/web). Antes abria WhatsApp y decia
  // «Mensaje enviado» aunque la persona no le diera a Enviar alla: se perdian.
  // Si el panel no responde, se ofrece WhatsApp con el texto listo, diciendo la verdad.
  var form = document.querySelector('[data-contact-form]');
  if (form) {
    var URL_SOLICITUD = 'https://prospectos.neracosu.com/api/web/solicitud';
    var WA = '584222707095';
    var btn = form.querySelector('button[type="submit"]');
    var label = form.querySelector('[data-submit-label]');
    var estado = form.querySelector('[data-form-estado]');
    var valor = function (n) { return (form.elements[n] && form.elements[n].value || '').trim(); };
    var decir = function (html, color) { if (estado) { estado.innerHTML = html; estado.style.color = color || 'rgba(255,255,255,0.75)'; } };
    var escapar = function (t) { return t.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    var textoWhatsApp = function () {
      return [
        'Hola Neri, soy ' + valor('name') + '.',
        '',
        valor('email') ? 'Correo: ' + valor('email') : '',
        'Tipo de proyecto: ' + valor('type'),
        valor('budget') ? 'Presupuesto: ' + valor('budget') : '',
        '',
        valor('message'),
      ].filter(function (l, i, xs) { return l !== '' || xs[i - 1] !== ''; }).join('\n');
    };
    var botonWhatsApp = function (texto) {
      return '<a class="btn-primary" style="margin-top:12px;justify-content:center;" target="_blank" rel="noopener" href="https://wa.me/' + WA + '?text=' + encodeURIComponent(textoWhatsApp()) + '">' + texto + '</a>';
    };
    var ocupado = function (si) {
      if (btn) btn.disabled = si;
      if (label) label.textContent = si ? 'Enviando…' : 'Enviar mensaje';
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!valor('email') && !valor('phone')) {
        decir('Déjeme su correo o su WhatsApp para poder responderle.', '#f0c35a');
        if (form.elements['phone']) form.elements['phone'].focus();
        return;
      }
      ocupado(true);
      decir('');
      var datos = {
        nombre: valor('name'), email: valor('email'), phone: valor('phone'), type: valor('type'),
        budget: valor('budget'), message: valor('message'), sitio: valor('sitio'),
        pagina: location.pathname, sesion: window.ncSesion ? window.ncSesion() : '',
      };
      var control = 'AbortController' in window ? new AbortController() : null;
      var plazo = setTimeout(function () { if (control) control.abort(); }, 15000);
      fetch(URL_SOLICITUD, {
        method: 'POST', mode: 'cors', credentials: 'omit',
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify(datos), signal: control ? control.signal : undefined,
      }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) { return { status: r.status, j: j }; });
      }).then(function (res) {
        clearTimeout(plazo);
        if (res.status === 200 && res.j.ok) {
          var nombre = escapar(datos.nombre.split(' ')[0] || '');
          decir('<strong style="color:#5ed29c;">Listo' + (nombre ? ', ' + nombre : '') + ': recibí su mensaje.</strong><br>Le respondo en menos de 24 horas hábiles' + (datos.phone ? ' por WhatsApp' : ' a su correo') + '.');
          form.reset();
          if (label) label.textContent = 'Mensaje recibido';
          if (btn) { btn.disabled = true; btn.classList.add('sent'); }
          return;
        }
        ocupado(false);
        if (res.status === 400 && res.j.mensaje) { decir(escapar(res.j.mensaje), '#f0c35a'); return; }
        decir(escapar(res.j.mensaje || 'No pude guardar su mensaje en este momento.') + '<br>Envíemelo por WhatsApp con el texto ya escrito:' + botonWhatsApp('Enviar por WhatsApp'), '#f0c35a');
      }).catch(function () {
        clearTimeout(plazo);
        ocupado(false);
        decir('No pude guardar su mensaje en este momento. Envíemelo por WhatsApp con el texto ya escrito:' + botonWhatsApp('Enviar por WhatsApp'), '#f0c35a');
      });
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

// Boton flotante de WhatsApp: se esconde al bajar leyendo y cuando el contacto ya esta a la vista
(function () {
  var fab = document.querySelector('.float-wa');
  if (!fab) return;
  var ultimo = window.scrollY, contactoVisible = false, vistos = new Set();
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (x) { x.isIntersecting ? vistos.add(x.target) : vistos.delete(x.target); });
      contactoVisible = vistos.size > 0;
      fab.classList.toggle('float-wa--oculto', contactoVisible);
    });
    document.querySelectorAll('#contacto, .site-footer').forEach(function (el) { obs.observe(el); });
  }
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    if (!contactoVisible && Math.abs(y - ultimo) > 8) {
      fab.classList.toggle('float-wa--oculto', y > ultimo && y > 400);
      ultimo = y;
    }
  }, { passive: true });
})();
