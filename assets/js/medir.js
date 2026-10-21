/* medir.js — medicion propia de neracosu.com (21-oct-2026). Manda al panel de prospeccion
   (prospectos.neracosu.com/web) que pagina se vio, de donde vino la persona, hasta donde bajo en
   la home y si toco WhatsApp, la calculadora o los precios. Sin cookies y sin IP: la «sesion» es
   un numero al azar en sessionStorage que muere al cerrar la pestana.
   Para no contarse a uno mismo: abrir cualquier pagina con ?nomedir=1 (se recuerda en este
   navegador); ?medir=1 lo deshace. Lo pone ~/build-para/medir.py en cada pagina. */
(function () {
  'use strict';
  var URL_EVENTO = 'https://prospectos.neracosu.com/api/web/evento';

  function guardado(almacen, clave, valor) {
    try {
      if (valor === undefined) return window[almacen].getItem(clave);
      if (valor === null) window[almacen].removeItem(clave); else window[almacen].setItem(clave, valor);
    } catch (e) { /* modo privado o almacenamiento bloqueado */ }
    return null;
  }

  var q = location.search;
  if (/[?&]nomedir=1/.test(q)) guardado('localStorage', 'nc_nomedir', '1');
  if (/[?&]medir=1/.test(q)) guardado('localStorage', 'nc_nomedir', null);
  if (navigator.webdriver || guardado('localStorage', 'nc_nomedir') === '1') return;

  var sesion = guardado('sessionStorage', 'nc_s');
  if (!sesion || !/^[a-z0-9]{8,32}$/.test(sesion)) {
    sesion = (Math.random().toString(36).slice(2) + Date.now().toString(36)).slice(0, 16);
    if (sesion.length < 8) sesion = (sesion + '00000000').slice(0, 8);
    guardado('sessionStorage', 'nc_s', sesion);
  }
  var ruta = location.pathname;

  function enviar(datos) {
    datos.s = sesion;
    datos.r = ruta;
    var cuerpo = JSON.stringify(datos);
    try {
      if (navigator.sendBeacon && navigator.sendBeacon(URL_EVENTO, new Blob([cuerpo], { type: 'text/plain;charset=UTF-8' }))) return;
    } catch (e) { /* sigue con fetch */ }
    try {
      fetch(URL_EVENTO, { method: 'POST', body: cuerpo, keepalive: true, mode: 'cors', credentials: 'omit', headers: { 'Content-Type': 'text/plain;charset=UTF-8' } });
    } catch (e) { /* sin red: no pasa nada */ }
  }

  // Origen: la utm_source si viene en el enlace; si no, el dominio de donde vino (si no es este sitio).
  var origen = '';
  var utm = /[?&]utm_source=([^&#]+)/.exec(q);
  if (utm) {
    try { origen = decodeURIComponent(utm[1]); } catch (e) { origen = utm[1]; }
  } else if (/[?&]fbclid=/.test(q)) {
    origen = 'facebook';
  } else if (document.referrer) {
    try {
      var host = new URL(document.referrer).hostname;
      if (!/(^|\.)neracosu\.com$/.test(host)) origen = host;
    } catch (e) { /* referrer raro */ }
  }
  var movil = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || (window.matchMedia && matchMedia('(pointer: coarse)').matches);
  enviar({ t: 'vista', o: origen.slice(0, 120), m: !!movil });

  // Clics que importan: el canal de contacto y los caminos al precio.
  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var destino = '';
    if (/wa\.me\/|api\.whatsapp\.com|whatsapp:/i.test(href)) destino = 'whatsapp';
    else if (/^mailto:/i.test(href)) destino = 'correo';
    else if (/^tel:/i.test(href)) destino = 'telefono';
    else if (/calculadora/i.test(href)) destino = 'calculadora';
    else if (/^(https:\/\/(www\.)?neracosu\.com)?\/para\//i.test(href)) destino = 'para';
    if (destino) enviar({ t: 'clic', d: destino });
  }, true);

  // Home: hasta donde baja la gente. Cada seccion cuenta una vez por visita.
  if (ruta === '/' && 'IntersectionObserver' in window) {
    var ids = ['industrias', 'productos', 'portafolio', 'sobre-mi', 'faq', 'blog', 'contacto'];
    var vistas = {};
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        var id = e.target.id;
        if (e.isIntersecting && !vistas[id]) {
          vistas[id] = true;
          enviar({ t: 'seccion', d: id });
          obs.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -35% 0px' });
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) obs.observe(el);
    });
  }

  // El formulario de contacto la usa para unir la solicitud con la visita.
  window.ncSesion = function () { return sesion; };
})();
