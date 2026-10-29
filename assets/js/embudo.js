/* embudo.js — motor de /empezar (29-oct-2026).
   Ocho pasos en una sola pagina: 0 portada, 1 rubro, 2 como lo lleva hoy, 3 que quiere
   lograr, 4 tamano, 5 resultado, 6 datos, 7 gracias. El paso va en el hash (#1..#7) y
   las respuestas en sessionStorage (nc_embudo). Se avanza tocando la opcion; se vuelve
   con «Volver», deslizando a la derecha, Escape/flecha izquierda o «atras» del navegador.
   Reglas en embudo-decidir.js (window.ncEmbudo); pantallas en embudo-pantallas.js. */
(function () {
  'use strict';
  var D = window.ncEmbudo, P = window.ncPantallas;
  if (!D || !P) return;

  var $ = function (s) { return document.querySelector(s); };
  var marco = $('#marco'), panel = $('#panel'), prog = $('#prog'), ui = $('#ui');
  var raiz = { fx: $('#fx'), toast: $('#toast') };
  var esc = P.escapar;

  /* ---------- estado ---------- */
  var VACIO = { rubro: null, actual: null, objetivo: null, tamano: null, marca: '' };
  var R = leer();
  var paso = 0;
  function leer() {
    try { var g = JSON.parse(sessionStorage.getItem('nc_embudo') || 'null'); if (g && typeof g === 'object') return g; } catch (e) { /* sin storage */ }
    return Object.assign({}, VACIO);
  }
  function guardar() { try { sessionStorage.setItem('nc_embudo', JSON.stringify(R)); } catch (e) { /* sin storage */ } }
  function reiniciar() { R = Object.assign({}, VACIO); guardar(); }
  // Hasta que paso se puede entrar con lo respondido: la pregunta n necesita las n-1 anteriores.
  function pasoPermitido(n) {
    var claves = ['rubro', 'actual', 'objetivo', 'tamano'];
    if (n <= 0) return 0;
    for (var i = 0; i < claves.length; i++) if (R[claves[i]] === null || R[claves[i]] === undefined) return Math.min(n, i + 1);
    return Math.min(n, 7);
  }

  /* ---------- telefono ---------- */
  function escalar() {
    var k = innerWidth < 900 ? Math.min(1, (innerHeight * 0.42) / 620, (innerWidth - 40) / 300) : Math.min(1, (innerHeight * 0.8) / 620);
    document.documentElement.style.setProperty('--k', k.toFixed(3));
  }
  escalar(); addEventListener('resize', escalar);

  var sinMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function mostrar(html) {
    if (sinMovimiento) { ui.innerHTML = html; return; }
    ui.classList.add('sale');
    setTimeout(function () {
      ui.innerHTML = html; ui.classList.remove('sale'); ui.classList.add('entra');
      requestAnimationFrame(function () { requestAnimationFrame(function () { ui.classList.remove('entra'); }); });
    }, 220);
  }
  function telefonoSistema() { mostrar(P.sistema(R, R.marca)); }
  function marcaEnVivo() {
    var m = ui.querySelector('.marca');
    if (m) { m.textContent = R.marca || 'Su marca aquí'; m.classList.toggle('vacia', !R.marca); }
  }

  /* ---------- pasos ---------- */
  function opciones(lista) {
    var h = '<div class="ops">';
    lista.forEach(function (o, i) {
      h += '<button type="button" class="op" data-v="' + esc(o.v) + '"><span class="num">' + (i + 1) + '</span><span><span class="t">' + esc(o.t) + '</span>' + (o.ej ? '<span class="ej">' + esc(o.ej) + '</span>' : '') + '</span></button>';
    });
    return h + '</div>';
  }
  function pregunta(n, titulo, ayuda, lista) {
    return '<span class="ojo">' + n + ' de 4</span><h2>' + titulo + '</h2><p class="ayuda">' + ayuda + '</p>' + opciones(lista);
  }

  var PASOS = [
    { id: 'portada', render: function () {
      return '<span class="ojo">Cuatro preguntas · un minuto</span>'
        + '<h1>Le muestro cómo <span class="it">quedaría</span> su sistema, con su marca.</h1>'
        + '<p class="ayuda">Responda cuatro preguntas tocando. Al final le digo qué le conviene y, si su caso califica, le armo una demostración con su nombre y sus productos para que la vea en su teléfono. Gratis, antes de pagar nada.</p>'
        + '<button type="button" class="btn-p" data-ir="1">Empezar</button>'
        + '<div class="resp"><span>26 plataformas en producción</span><span>Pagos validados contra el banco</span><span>Todo por escrito</span></div>';
    }, despues: function () { telefonoSistema(); } },
    { id: 'rubro', clave: 'rubro', render: function () { return pregunta(1, '¿A qué se dedica su negocio?', 'Busque el suyo en los ejemplos. Si no aparece, «otra cosa» y seguimos igual.', D.RUBROS); },
      vista: function (v) { mostrar(P.sistema({ rubro: v, tamano: R.tamano }, R.marca)); },
      espera: 420 },
    { id: 'actual', clave: 'actual', render: function () { return pregunta(2, '¿Cómo lo lleva hoy?', 'Sin juicio. La mayoría empieza en cuaderno y WhatsApp.', D.ACTUAL); },
      vista: function (v) { mostrar(P.hoy(v, R.marca)); },
      al: function () { telefonoSistema(); },
      espera: 900 },
    { id: 'objetivo', clave: 'objetivo', render: function () { return pregunta(3, '¿Qué quiere lograr primero?', 'Toque uno y mírelo pasar en el teléfono.', D.OBJETIVOS); },
      vista: function (v) { P.efecto(v, R, R.marca, raiz); },
      espera: 2600, sinVistaPrevia: true },
    { id: 'tamano', clave: 'tamano', render: function () { return pregunta(4, '¿De qué tamaño es la operación?', 'Define el plan que le queda, no la calidad del sistema.', D.tamanos(R.rubro)); },
      vista: function (v) { mostrar(P.sistema({ rubro: R.rubro, tamano: v }, R.marca)); },
      espera: 420 },
    { id: 'resultado', render: function () {
      var d = D.decidir(R); R._clave = d.clave; guardar();
      var s = d.sistema;
      var h = '<span class="ojo">Lo que le conviene</span><div class="maq" id="maq" data-txt="' + esc(D.fraseResultado(R, s)) + '" data-nombre="' + esc(s.nombre) + '"></div>';
      h += '<div class="ya">' + s.ya.map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</div>';
      if (s.img) h += '<figure class="cap"><img src="/assets/img/portafolio/' + s.img + '-800.webp" width="800" height="450" loading="lazy" alt=""><figcaption>' + esc(s.pie) + '</figcaption></figure>';
      if (s.slug) h += '<a class="enl" href="/para/' + s.slug + '" target="_blank" rel="noopener">Ver los precios publicados de este sistema</a><p class="promo">Hasta el 31 de diciembre de 2026, el pago único de cualquier plan tiene 40 % de descuento.</p>';
      if (d.demo) h += '<h2 class="remate">¿Quiere verlo <span class="it">con su marca</span>?</h2><p class="ayuda">Le armo una demostración con su nombre y sus productos para que la recorra en su teléfono, más el diagnóstico por escrito. Gratis, sin compromiso.</p><button type="button" class="btn-p" data-ir="6">Quiero ver mi demostración</button>';
      else h += '<h2 class="remate">Le entrego el diagnóstico <span class="it">gratis</span>.</h2><p class="ayuda">Reviso cómo trabaja hoy y le digo qué le conviene, en qué orden y cuánto costaría cada fase. Si de ahí sale que no le hace falta un sistema, se lo digo y le ahorro varios miles.</p><button type="button" class="btn-p" data-ir="6">Quiero mi diagnóstico gratis</button><a class="enl" href="/calculadora" target="_blank" rel="noopener">Si prefiere un número ya, la calculadora se lo da en tres pasos</a>';
      return h;
    }, despues: function () {
      var m = $('#maq'); if (!m) return;
      var t = m.getAttribute('data-txt'), nombre = m.getAttribute('data-nombre'), i = 0;
      var pintarTexto = function (s) { m.innerHTML = esc(s).replace(esc(nombre), '<span class="c">' + esc(nombre) + '</span>'); };
      if (sinMovimiento) { pintarTexto(t); m.classList.add('fin'); }
      else (function tip() { if (i > t.length) { pintarTexto(t); m.classList.add('fin'); return; } pintarTexto(t.slice(0, i)); i += 2; setTimeout(tip, 14); })();
      telefonoSistema();
    } },
    { id: 'datos', render: function () {
      return '<span class="ojo">Tres datos y listo</span><h2>Su sistema, con su nombre.</h2><p class="ayuda">El formulario se termina en la siguiente tarea.</p><button type="button" class="btn-p" data-ir="7">Enviar</button>';
    }, despues: function () { telefonoSistema(); } },
    { id: 'gracias', render: function () {
      return '<span class="ojo">Listo</span><h2>Recibido.</h2><button type="button" class="btn-g" data-ir="0">Volver al inicio</button>';
    } }
  ];

  var vencido = new Date() > new Date('2027-01-01T04:00:00Z');

  function pintar(dir) {
    var p = PASOS[paso], viejo = panel.firstElementChild, el = document.createElement('div');
    el.className = 'paso' + (sinMovimiento ? '' : ' entra');
    var h = p.render();
    if (paso > 0) h += '<div class="pie"><button type="button" class="atras">← Volver</button><span>' + (paso < 5 ? 'Deslice a la derecha para volver' : '') + '</span></div>';
    el.innerHTML = h;
    if (vencido) { var pr = el.querySelector('.promo'); if (pr) pr.remove(); }
    if (viejo) { if (sinMovimiento) viejo.remove(); else { viejo.classList.add(dir < 0 ? 'entra' : 'sale'); setTimeout(function () { viejo.remove(); }, 300); } }
    panel.appendChild(el);
    panel.scrollTop = 0;
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.remove('entra'); }); });
    prog.style.width = (Math.min(paso, 5) / 5 * 100) + '%';
    marco.setAttribute('data-paso', String(paso));
    if (p.despues) setTimeout(p.despues, 30);
  }

  var ignorarHash = false;
  function ir(n, dir) {
    if (n < 0 || n >= PASOS.length) return;
    if (n === 0) { reiniciar(); P.limpiar(raiz); }
    n = pasoPermitido(n);
    // Al avanzar, el efecto del telefono termina solo (el pago llega a «exitoso» ya en la pregunta 4);
    // al volver o reiniciar se corta.
    if ((dir || 1) < 0 || n === 0) P.limpiar(raiz);
    paso = n;
    pintar(dir || 1);
    var hash = n ? '#' + n : '';
    if (location.hash !== hash && !(n === 0 && !location.hash)) { ignorarHash = true; location.hash = hash || '#0'; }
  }
  function volver() { if (paso > 0 && paso < 7) ir(paso - 1, -1); }

  function elegir(v) {
    var p = PASOS[paso]; if (!p.clave) return;
    var val = /^\d+$/.test(v) ? Number(v) : v;
    try { if (navigator.vibrate) navigator.vibrate(12); } catch (e) { /* sin vibracion */ }
    R[p.clave] = val; guardar();
    if (p.vista) p.vista(val);
    if (p.al) setTimeout(p.al, Math.min(p.espera, 600));
    var botones = panel.querySelectorAll('.op'); botones.forEach(function (b) { b.disabled = true; b.classList.toggle('elegida', b.getAttribute('data-v') === String(v)); });
    setTimeout(function () { if (PASOS[paso] === p) ir(paso + 1); }, sinMovimiento ? Math.min(p.espera, 450) : p.espera);
  }

  /* ---------- eventos ---------- */
  panel.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-ir]'); if (b) { ir(Number(b.getAttribute('data-ir'))); return; }
    if (ev.target.closest('.atras')) { volver(); return; }
    var o = ev.target.closest('.op'); if (o && !o.disabled) elegir(o.getAttribute('data-v'));
  });
  // Vista previa al pasar el cursor (solo con raton; el paso 3 dispara efectos largos y no se previsualiza)
  panel.addEventListener('mouseover', function (ev) {
    var o = ev.target.closest('.op'); if (!o || !matchMedia('(hover: hover)').matches) return;
    var p = PASOS[paso]; if (!p.vista || p.sinVistaPrevia || o.disabled) return;
    var v = o.getAttribute('data-v'); p.vista(/^\d+$/.test(v) ? Number(v) : v);
  });
  addEventListener('keydown', function (ev) {
    var enCampo = document.activeElement && /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName);
    if ((ev.key === 'Escape' || ev.key === 'ArrowLeft') && !enCampo) { volver(); return; }
    if (PASOS[paso].clave && /^[1-7]$/.test(ev.key) && !enCampo) { var ops = panel.querySelectorAll('.op'); var b = ops[Number(ev.key) - 1]; if (b && !b.disabled) elegir(b.getAttribute('data-v')); }
  });
  var tx = null, ty = null;
  addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  addEventListener('touchend', function (e) {
    if (tx === null || !e.changedTouches.length) return;
    var dx = e.changedTouches[0].clientX - tx, dy = Math.abs(e.changedTouches[0].clientY - ty); tx = null;
    if (dx > 70 && dy < 50 && paso > 0 && paso < 6) volver();
  }, { passive: true });
  addEventListener('hashchange', function () {
    if (ignorarHash) { ignorarHash = false; return; }
    var n = parseInt((location.hash || '#0').slice(1), 10); if (isNaN(n)) n = 0;
    if (n !== paso) ir(n, n < paso ? -1 : 1);
  });

  /* ---------- arranque ---------- */
  function arrancar() {
    try { if (window.Atropos) Atropos({ el: '#atropos', shadow: false, highlight: true, rotateXMax: 10, rotateYMax: 12, activeOffset: 30, duration: 350 }); } catch (e) { /* sin 3D */ }
    try { if (window.Parallax && $('#fondo')) new Parallax($('#fondo'), { relativeInput: false, hoverOnly: false, frictionX: 0.08, frictionY: 0.08, scalarX: 6, scalarY: 6 }); } catch (e) { /* sin parallax */ }
    var n = parseInt((location.hash || '#0').slice(1), 10); if (isNaN(n) || n < 0) n = 0;
    ir(n);
  }
  arrancar();
})();
