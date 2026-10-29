/* embudo-pantallas.js — las pantallas del telefono de /empezar (29-oct-2026).
   Maquetas en HTML de los sistemas reales (hotel, tienda, comida, agenda, espacios,
   logistica, panel) y los efectos del paso 3 (pago validado, reserva de madrugada,
   contadores, sistemas conectados, Google). Todo lleva la marca del visitante o
   «Su marca aqui». Lo usa embudo.js como window.ncPantallas. */
(function () {
  'use strict';

  function escapar(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }
  function n(x) { return Number(x).toLocaleString('es-VE'); }
  function tam(r) { var t = Number(r && r.tamano); return t === 1 || t === 2 ? t : (t === 0 ? 0 : 1); }

  function cab(marca, extra) {
    var m = marca ? escapar(marca) : 'Su marca aquí';
    return '<div class="cab"><span class="marca' + (marca ? '' : ' vacia') + '">' + m + '</span><span>' + (extra || 'hoy') + '</span></div>';
  }

  /* ---------- sistemas por rubro ---------- */
  function hoteles(r, marca) {
    var habs = [8, 14, 20][tam(r)], est = ['ok', 'ocu', 'ok', 'ok', 'mal', 'ocu', 'ok', 'ok', 'ocu', 'ok', 'ok', 'ok', 'mal', 'ok', 'ocu', 'ok', 'ok', 'ok', 'ocu', 'ok'];
    var h = cab(marca, 'Recepción') + '<div class="tit">Habitaciones</div><div class="sub">' + n(habs) + ' en total · ' + n(Math.round(habs * 0.6)) + ' ocupadas</div>';
    h += '<div class="cuad" style="grid-template-columns:repeat(' + (habs > 10 ? 5 : 4) + ',1fr)">';
    for (var i = 0; i < habs; i++) { var e = est[i % est.length]; h += '<div class="cel ' + e + '"><b>' + (101 + i) + '</b>' + (e === 'ok' ? 'lista' : e === 'ocu' ? 'ocupada' : 'limpieza') + '</div>'; }
    return h + '</div><div class="barra"><div class="btn">Check-in</div><div class="btn sec">Cobrar</div></div>';
  }
  function comercio(r, marca) {
    var prods = [4, 6, 8][tam(r)], nom = ['Camisa lino', 'Zapato cuero', 'Bolso', 'Pantalón', 'Vestido', 'Gorra', 'Cinturón', 'Reloj'];
    var h = cab(marca, 'Catálogo') + '<div class="tit">Nuevos</div><div class="cuad" style="grid-template-columns:1fr 1fr">';
    for (var i = 0; i < prods; i++) h += '<div class="cel"><div class="foto" style="height:' + (prods > 6 ? 22 : 34) + 'px"></div><b>' + nom[i] + '</b>$' + (18 + i * 7) + '</div>';
    return h + '</div><div class="barra"><div class="btn">Pagar · Pago Móvil</div></div>';
  }
  function restaurantes(r, marca) {
    var mesas = [6, 12, 20][tam(r)];
    var h = cab(marca, 'Salón') + '<div class="tit">Mesas</div><div class="sub">' + n(mesas) + ' mesas · ' + n(Math.round(mesas * 0.5)) + ' con cuenta abierta</div>';
    h += '<div class="cuad" style="grid-template-columns:repeat(' + (mesas > 8 ? 5 : 3) + ',1fr)">';
    for (var i = 0; i < mesas; i++) { var e = i % 3 === 0 ? 'ocu' : i % 4 === 0 ? 'ok' : ''; h += '<div class="cel ' + e + '"><b>M' + (i + 1) + '</b>' + (e === 'ocu' ? 'abierta' : e === 'ok' ? 'pagada' : 'libre') + '</div>'; }
    return h + '</div><div class="barra"><div class="btn">Caja del día</div><div class="btn sec">Cocina</div></div>';
  }
  function citas(r, marca) {
    var prof = [2, 4, 6][tam(r)];
    var h = '<div class="cinta">En construcción</div>' + cab(marca, 'Agenda') + '<div class="tit">Hoy</div><div class="sub">' + n(prof) + ' profesionales</div>';
    h += '<div class="cuad" style="grid-template-columns:repeat(' + Math.min(prof, 3) + ',1fr)">';
    for (var i = 0; i < prof; i++) h += '<div class="cel"><b>Prof. ' + (i + 1) + '</b>9:00 ✓ · 10:30 · 12:00 ✓</div>';
    return h + '</div><div class="fila"><span>Anticipo validado</span><span class="g">sí</span></div><div class="barra"><div class="btn">Nueva cita</div></div>';
  }
  function reservas(r, marca) {
    var can = [2, 4, 6][tam(r)];
    var h = cab(marca, 'Reservas') + '<div class="tit">Canchas</div><div class="sub">' + n(can) + ' espacios · cupo retenido 10 min</div>';
    for (var i = 0; i < can; i++) h += '<div class="fila"><b>Cancha ' + (i + 1) + '</b>' + (i % 2 ? '<span class="pill g">libre 8 pm</span>' : '<span class="pill a">reservada</span>') + '</div>';
    return h + '<div class="barra"><div class="btn">Reservar y pagar</div></div>';
  }
  function logistica(r, marca) {
    var h = cab(marca, 'Operación') + '<div class="tit">Contenedores</div><div class="sub">costado de buque · ' + n([12, 40, 120][tam(r)]) + ' hoy</div>';
    var est = [['MSKU 48·21', 'en patio', 'a'], ['TCLU 90·07', 'despachado', 'g'], ['CMAU 11·56', 'en aduana', 'a'], ['HLXU 77·02', 'entregado', 'g']];
    for (var i = 0; i < est.length; i++) h += '<div class="fila"><b>' + est[i][0] + '</b><span class="pill ' + est[i][2] + '">' + est[i][1] + '</span></div>';
    return h + '<div class="barra"><div class="btn">Seguimiento</div></div>';
  }
  function otro(r, marca) {
    var t = tam(r);
    return cab(marca, 'Panel') + '<div class="tit">Su operación</div><div class="cuad" style="grid-template-columns:1fr 1fr">'
      + '<div class="cel ok"><b>$ ' + n([840, 3200, 11800][t]) + '</b>cobrado hoy</div><div class="cel"><b>' + n([12, 38, 140][t]) + '</b>pedidos</div>'
      + '<div class="cel"><b>' + n([3, 9, 27][t]) + '</b>pendientes</div><div class="cel ocu"><b>2</b>por revisar</div></div>'
      + '<div class="barra"><div class="btn">Ver todo</div></div>';
  }
  var POR_RUBRO = { hoteles: hoteles, comercio: comercio, restaurantes: restaurantes, citas: citas, reservas: reservas, logistica: logistica, otro: otro };

  function sistema(r, marca) { return (POR_RUBRO[r && r.rubro] || otro)(r || {}, marca); }

  /* ---------- lo que tiene hoy (paso 2) ---------- */
  function hoy(actual, marca) {
    if (actual === 'manual') {
      return cab(marca, 'WhatsApp') + '<div class="chat">'
        + '<div class="bur">Buenas, ¿me confirma el pago?<span class="img">captura.jpg</span><span class="h">10:42 p. m.</span></div>'
        + '<div class="bur yo">Déjame revisar el banco…<span class="h">10:51 p. m.</span></div>'
        + '<div class="bur">¿Hay cupo mañana a las 3?<span class="h">11:07 p. m.</span></div>'
        + '<div class="bur yo">Mañana le digo<span class="h">11:40 p. m.</span></div></div>'
        + '<div class="fila abajo"><span>Cuaderno</span><span class="pill r">3 sin anotar</span></div>';
    }
    if (actual === 'web') {
      return cab(marca, 'Mi tienda') + '<div class="tit">Pedidos</div>'
        + '<div class="fila"><b>#1.281</b><span class="pill a">pago por confirmar</span></div>'
        + '<div class="fila"><b>#1.282</b><span class="pill a">pago por confirmar</span></div>'
        + '<div class="fila"><b>#1.283</b><span class="pill a">pago por confirmar</span></div>'
        + '<div class="sub abajo">Revisar el banco y marcar a mano: 3 pendientes.</div>';
    }
    if (actual === 'mensualidad') {
      return cab(marca, 'Sistema actual') + '<div class="tit">Factura mensual</div>'
        + '<div class="fila"><b>Licencia</b><span class="g">$ 95 / mes</span></div>'
        + '<div class="fila"><span>Pago Móvil</span><span class="pill r">no incluido</span></div>'
        + '<div class="fila"><span>Soporte</span><span class="pill a">tickets</span></div>'
        + '<div class="sub abajo">Lo que ya pagó no se pierde: se migra.</div>';
    }
    return cab(marca, 'Sistema propio') + '<div class="tit">v2.3 · 2017</div>'
      + '<div class="fila"><span>Última actualización</span><span class="pill a">hace 4 años</span></div>'
      + '<div class="fila"><span>WhatsApp</span><span class="pill r">no conecta</span></div>'
      + '<div class="fila"><span>Datos</span><span class="g">se conservan</span></div>'
      + '<div class="sub abajo">Se conecta o se reemplaza por fases.</div>';
  }

  /* ---------- portada: tres pantallas reales ---------- */
  function portada(i, marca) {
    var k = ((i % 3) + 3) % 3;
    if (k === 0) return hoteles({ tamano: 1 }, marca);
    if (k === 1) return comercio({ tamano: 1 }, marca);
    return cab(marca, 'Pago Móvil') + '<div class="tit">Bs 12.450,00</div><div class="sub">Referencia validada contra el banco</div>'
      + '<div class="fila"><b>Pedido #1.284</b><span class="pill g">pagado</span></div>'
      + '<div class="fila"><b>Pedido #1.285</b><span class="pill g">pagado</span></div>'
      + '<div class="fila"><b>Reserva 2:14 a. m.</b><span class="pill g">confirmada</span></div>'
      + '<div class="barra"><div class="btn">Todo cuadra</div></div>';
  }

  /* ---------- efectos del paso 3 ---------- */
  var timers = [];
  function luego(ms, f) { timers.push(setTimeout(f, ms)); }
  function limpiar(raiz) {
    timers.forEach(clearTimeout); timers = [];
    if (raiz.fx) raiz.fx.classList.remove('on');
    if (raiz.toast) raiz.toast.classList.remove('on');
  }
  var sinMovimiento = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var V = sinMovimiento ? 0.35 : 1; // acelera los tiempos sin saltarse los estados

  function fxCobros(fx) {
    fx.innerHTML = '<div class="k">Pago Móvil</div><div class="n">Bs 12.450,00</div><div class="sub">Últimos 6 dígitos de la referencia</div>'
      + '<div class="dig">' + '<span></span><span></span><span></span><span></span><span></span><span></span>' + '</div><div class="est sub"></div>';
    fx.classList.add('on');
    var d = '493021'.split(''), cel = fx.querySelectorAll('.dig span');
    d.forEach(function (c, i) { luego((500 + i * 140) * V, function () { cel[i].textContent = c; cel[i].classList.add('l'); }); });
    luego(1600 * V, function () { fx.querySelector('.est').innerHTML = '<span class="val"><span class="sp"></span> Validando con el banco…</span>'; });
    luego(3100 * V, function () {
      fx.innerHTML = '<div class="chk">✓</div><div class="n ok">¡Pago exitoso!</div><div class="sub">Pedido confirmado solo. Nadie revisó el banco.</div>';
      var chk = fx.querySelector('.chk');
      requestAnimationFrame(function () { chk.classList.add('on'); });
    });
    luego(5600 * V, function () { fx.classList.remove('on'); });
  }
  function fxVentas(fx, toast) {
    toast.innerHTML = '<b>Nueva reserva · 2:14 a. m.</b><br>Cupo retenido 10 min · pago validado';
    luego(300 * V, function () { toast.classList.add('on'); });
    luego(4200 * V, function () { toast.classList.remove('on'); });
  }
  function fxOperacion(fx, toast, r) {
    var t = tam(r), f1 = [840, 3200, 11800][t], f2 = [12, 38, 140][t];
    fx.innerHTML = '<div class="k">Hoy, en vivo</div><div class="n c1">$ 0</div><div class="sub">cobrado</div><div class="n c2">0</div><div class="sub">pedidos atendidos</div>';
    fx.classList.add('on');
    var c1 = fx.querySelector('.c1'), c2 = fx.querySelector('.c2'), t0 = performance.now(), dur = 1400 * V;
    (function anim() {
      var p = Math.min(1, (performance.now() - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      c1.textContent = '$ ' + n(Math.round(f1 * e)); c2.textContent = n(Math.round(f2 * e));
      if (p < 1 && fx.classList.contains('on')) requestAnimationFrame(anim);
    })();
    luego(3800 * V, function () { fx.classList.remove('on'); });
  }
  function fxSistemas(fx) {
    fx.innerHTML = '<div class="k">Conectado</div><div class="fila"><b>Tienda</b><span class="g">⇄ Inventario</span></div><div class="fila"><b>Banco</b><span class="g">⇄ Pedidos</span></div><div class="fila"><b>WhatsApp</b><span class="g">⇄ Reservas</span></div><div class="sub">Un solo dato, una sola vez.</div>';
    fx.classList.add('on'); luego(3600 * V, function () { fx.classList.remove('on'); });
  }
  function fxWeb(fx, toast, r, marca) {
    var m = marca || 'Su marca aquí';
    fx.innerHTML = '<div class="k">Google</div><div class="fila col"><b class="azul">' + escapar(m) + ' · Pedidos en línea</b><span class="sub">neracosu.com › tienda</span><span class="sub">Abierto ahora · Pago Móvil y Zelle</span></div><div class="sub">Lo encuentran y le compran sin escribirle.</div>';
    fx.classList.add('on'); luego(3600 * V, function () { fx.classList.remove('on'); });
  }
  var FX = { cobros: fxCobros, ventas: fxVentas, operacion: fxOperacion, sistemas: fxSistemas, web: fxWeb };

  function efecto(objetivo, r, marca, raiz) {
    limpiar(raiz);
    var f = FX[objetivo];
    if (f) f(raiz.fx, raiz.toast, r || {}, marca);
  }

  window.ncPantallas = { sistema: sistema, hoy: hoy, portada: portada, efecto: efecto, limpiar: limpiar, escapar: escapar };
})();
