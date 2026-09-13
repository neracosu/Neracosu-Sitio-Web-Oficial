/* ============================================================
   neracosu.com — Asistente de diagnostico (guiado, sin IA)
   ------------------------------------------------------------
   Cuatro preguntas, una recomendacion. Sin backend ni llaves:
   todo se resuelve con reglas en el navegador y termina en un
   WhatsApp con el resumen ya escrito.

   Los precios salen de las mismas tablas publicadas en /para/,
   que a su vez salen de horas x $17/h (ver ~/PRECIOS-Y-COSTOS.md).
   Si cambian alla, cambian aca: NICHOS es la unica copia.
   ============================================================ */
(function () {
  'use strict';

  var WA = '584222707095';

  /* Precios publicados. El descuento por dejar otro sistema solo
     aplica donde hay una mensualidad que soltar. */
  var NICHOS = {
    hoteles: {
      nombre: 'Hoteles y posadas',
      url: '/para/hoteles.html',
      descuento: true,
      planes: [
        { nombre: 'Esencial', alcance: 'hasta 15 habitaciones', precio: 2800, mes: 100 },
        { nombre: 'Profesional', alcance: '16 a 40 habitaciones', precio: 4300, mes: 130 },
        { nombre: 'Completo', alcance: 'más de 40 habitaciones', precio: 6600, mes: 170 },
      ],
    },
    restaurantes: {
      nombre: 'Restaurantes y bares',
      url: '/para/restaurantes-y-bares.html',
      descuento: true,
      planes: [
        { nombre: 'Esencial', alcance: 'un local', precio: 2500, mes: 100 },
        { nombre: 'Profesional', alcance: 'con delivery y POS', precio: 4000, mes: 130 },
        { nombre: 'Completo', alcance: 'multi-sede y fiscal', precio: 6200, mes: 170 },
      ],
    },
    reservas: {
      nombre: 'Reservas, eventos y taquilla',
      url: '/para/reservas.html',
      descuento: true,
      planes: [
        { nombre: 'Esencial', alcance: 'un espacio', precio: 2400, mes: 100 },
        { nombre: 'Profesional', alcance: 'varios espacios y eventos', precio: 3800, mes: 130 },
        { nombre: 'Completo', alcance: 'con taquilla y bot', precio: 5700, mes: 170 },
      ],
    },
    cobros: {
      nombre: 'Cobros y pagos',
      url: '/para/cobros-y-pagos.html',
      descuento: false,
      planes: [
        { nombre: 'Un método', alcance: 'validación de pago móvil', precio: 1300, mes: 0 },
        { nombre: 'Paquete', alcance: 'con C2P y tasa oficial', precio: 2400, mes: 0 },
        { nombre: 'Completo', alcance: 'con USDT y conciliación', precio: 3500, mes: 0 },
      ],
    },
    logistica: {
      nombre: 'Logística y aduana',
      url: '/para/logistica-y-aduana.html',
      descuento: true,
      planes: [
        { nombre: 'Fase 1', alcance: 'solicitudes y recaudos', precio: 4700, mes: 170 },
        { nombre: 'Fase 2', alcance: 'con portal de clientes', precio: 7000, mes: 220 },
        { nombre: 'Completo', alcance: 'con trazabilidad', precio: 11000, mes: 300 },
      ],
    },
    comercio: {
      nombre: 'Comercio e inventario',
      url: '/para/comercio-y-tienda.html',
      descuento: true,
      planes: [
        { nombre: 'Esencial', alcance: 'un local, mostrador', precio: 2500, mes: 100 },
        { nombre: 'Profesional', alcance: 'con tienda en línea', precio: 4000, mes: 130 },
        { nombre: 'Completo', alcance: 'varias sucursales', precio: 6200, mes: 170 },
      ],
    },
    /* Citas no lleva precio cerrado: la agenda por profesional es lo unico
       del catalogo que todavia no esta construido, asi que el numero sale
       del diagnostico y no de una tabla. */
    citas: {
      nombre: 'Servicios con cita',
      url: '/para/citas-y-servicios.html',
      descuento: false,
      sinPrecio: true,
      planes: [
        { nombre: 'Diagnóstico primero', alcance: 'plan por fases antes de cotizar', precio: 250 },
        { nombre: 'Diagnóstico primero', alcance: 'plan por fases antes de cotizar', precio: 250 },
        { nombre: 'Diagnóstico primero', alcance: 'plan por fases antes de cotizar', precio: 250 },
      ],
    },
    /* No es un plan: es la respuesta honesta cuando el caso no encaja
       en nada de lo que ya esta construido. Se ofrece el diagnostico. */
    medida: {
      nombre: 'Un sistema a la medida',
      url: '/para/',
      descuento: false,
      aMedida: true,
      planes: [
        { nombre: 'Diagnóstico primero', alcance: 'plan por fases antes de cotizar', precio: 250 },
        { nombre: 'Diagnóstico primero', alcance: 'plan por fases antes de cotizar', precio: 250 },
        { nombre: 'Diagnóstico primero', alcance: 'plan por fases antes de cotizar', precio: 250 },
      ],
    },
    integraciones: {
      nombre: 'API, bots e integraciones',
      url: '/para/integraciones-api-y-bots.html',
      descuento: false,
      planes: [
        { nombre: 'Un conector', alcance: 'un sistema', precio: 1200, mes: 0 },
        { nombre: 'API para bot', alcance: 'hasta 12 rutas', precio: 2600, mes: 0 },
        { nombre: 'Capa completa', alcance: 'varios sistemas', precio: 5200, mes: 0 },
      ],
    },
  };

  var PREGUNTAS = [
    {
      id: 'rubro',
      titulo: '¿A qué se dedica su negocio?',
      ayuda: 'Busque el suyo entre los ejemplos. Si no aparece, elige «otra cosa» y seguimos igual.',
      opciones: [
        { v: 'citas', t: 'Servicios con cita',
          ej: 'peluquería, barbería, spa, uñas, odontología, clínica, veterinaria, taller mecánico, fisioterapia, psicología' },
        { v: 'comercio', t: 'Tienda o comercio',
          ej: 'farmacia, ropa, zapatos, joyería, ferretería, mascotas, óptica, licorería, repuestos, librería' },
        { v: 'restaurantes', t: 'Comida',
          ej: 'restaurante, bar, comida rápida, panadería, heladería, delivery, cocina oculta, food truck' },
        { v: 'hoteles', t: 'Hospedaje',
          ej: 'hotel, posada, cabañas, apartamentos, hospedaje por horas' },
        { v: 'reservas', t: 'Espacios y eventos',
          ej: 'canchas, bowling, salón de fiestas, quinta, coworking, piscina, venta de entradas' },
        { v: 'logistica', t: 'Logística y carga',
          ej: 'almacén, aduana, transporte, courier, agro, distribución' },
        { v: 'otro', t: 'Otra cosa',
          ej: 'no aparece lo mío, o hago varias de estas a la vez' },
      ],
    },
    {
      id: 'dolor',
      titulo: '¿Qué es lo que más le está costando hoy?',
      ayuda: 'Elija lo que más le haga ruido. Por ahí empezamos.',
      opciones: [
        { v: 'operacion', t: 'No sé qué pasa en mi operación hasta que es tarde' },
        { v: 'cobros', t: 'Verificar pagos a mano y que no cuadre la caja' },
        { v: 'ventas', t: 'Se pierden reservas o pedidos, sobre todo de noche' },
        { v: 'sistemas', t: 'Tengo sistemas que no se hablan entre sí' },
      ],
    },
    {
      id: 'tamano',
      titulo: '¿De qué tamaño es la operación?',
      ayuda: 'Defina el plan que le queda, no la calidad del sistema.',
      opciones: [
        { v: 0, t: 'Chica: un local, poco personal' },
        { v: 1, t: 'Mediana: un local grande o dos chicos' },
        { v: 2, t: 'Grande: varias sedes o mucho movimiento' },
      ],
    },
    {
      id: 'actual',
      titulo: '¿Con qué trabaja hoy?',
      ayuda: 'Sin juicio: la mayoría empieza en cuaderno y WhatsApp.',
      opciones: [
        { v: 'mensualidad', t: 'Pago una mensualidad por un sistema' },
        { v: 'propio', t: 'Tengo un sistema propio o comprado' },
        { v: 'manual', t: 'Cuaderno, Excel y WhatsApp' },
      ],
    },
  ];

  /* ---------- Decision ---------- */
  function decidir(r) {
    var nicho = r.rubro;

    /* Rubros cuyo sistema ya trae los cobros adentro: si el dolor es cobrar,
       no hay que mandarlos a la capa de pagos, ya la incluyen. */
    var COBRO_INCLUIDO = ['restaurantes', 'hoteles', 'comercio'];

    if (nicho === 'otro') {
      // Sin rubro conocido, manda el dolor. Si el dolor tampoco encaja en algo
      // construido, se dice de frente en vez de forzar una recomendacion.
      nicho = r.dolor === 'cobros' ? 'cobros'
            : r.dolor === 'sistemas' ? 'integraciones'
            : 'medida';
    } else if (r.dolor === 'sistemas') {
      nicho = 'integraciones';
    } else if (r.dolor === 'cobros' && COBRO_INCLUIDO.indexOf(r.rubro) === -1) {
      nicho = 'cobros';
    }

    var datos = NICHOS[nicho];
    var idx = typeof r.tamano === 'number' ? r.tamano : 1;
    if (idx > datos.planes.length - 1) idx = datos.planes.length - 1;
    var plan = datos.planes[idx];

    var descuento = (r.actual === 'mensualidad' && datos.descuento && !datos.sinPrecio) ? 1000 : 0;
    if (descuento && plan.precio - descuento < 900) descuento = 0; // no regalar el trabajo

    return {
      nicho: nicho, datos: datos, plan: plan,
      descuento: descuento, total: plan.precio - descuento,
    };
  }

  function money(n) { return '$' + n.toLocaleString('es-VE'); }

  /* ---------- Render ---------- */
  function iniciar(raiz) {
    var paso = 0;
    var resp = {};

    function pintarPregunta() {
      var q = PREGUNTAS[paso];
      var h = '<div class="asis-cab">';
      h += '<span class="asis-paso">Pregunta ' + (paso + 1) + ' de ' + PREGUNTAS.length + '</span>';
      h += '<div class="asis-barra"><span style="width:' + ((paso / PREGUNTAS.length) * 100) + '%"></span></div>';
      h += '</div>';
      h += '<h3 class="asis-titulo">' + q.titulo + '</h3>';
      h += '<p class="asis-ayuda">' + q.ayuda + '</p>';
      h += '<div class="asis-opciones">';
      for (var i = 0; i < q.opciones.length; i++) {
        h += '<button type="button" class="asis-opcion" data-v="' + q.opciones[i].v + '">';
        h += '<span class="asis-opcion-t">' + q.opciones[i].t + '</span>';
        if (q.opciones[i].ej) {
          h += '<span class="asis-opcion-ej">' + q.opciones[i].ej + '</span>';
        }
        h += '</button>';
      }
      h += '</div>';
      if (paso > 0) h += '<button type="button" class="asis-atras" data-atras>&larr; Volver</button>';
      raiz.innerHTML = h;
    }

    function pintarResultado() {
      var d = decidir(resp);
      var texto = 'Hola Neri, usé el asistente de su web.\n\n'
        + '• Rubro: ' + d.datos.nombre + '\n'
        + (d.datos.sinPrecio
            ? '• Entiendo que acá se empieza por el diagnóstico ($170)\n'
            : d.datos.aMedida
              ? '• El asistente dice que mi caso no encaja en un plan cerrado\n'
              : '• Plan sugerido: ' + d.plan.nombre + ' (' + d.plan.alcance + ')\n')
        + (d.datos.sinPrecio ? '' : '• Estimado: ' + money(d.total)
            + (d.plan.mes ? ' + ' + money(d.plan.mes) + '/mes de servicio' : '')
            + (d.descuento ? ' (ya con el descuento por dejar mi sistema actual)' : '') + '\n')
        + '• Hoy trabajo con: ' + ({
            mensualidad: 'un sistema por mensualidad',
            propio: 'un sistema propio o comprado',
            manual: 'cuaderno, Excel y WhatsApp',
          })[resp.actual] + '\n\n'
        + 'Quisiera conversarlo.';

      var h = '<div class="asis-resultado">';
      h += '<span class="asis-eyebrow">Lo que le recomiendo</span>';
      if (d.datos.sinPrecio) {
        h += '<h3 class="asis-titulo">' + d.datos.nombre + ' &mdash; empezamos por el diagnóstico</h3>';
        h += '<p class="asis-ayuda">Este es el único rubro donde no le doy un precio cerrado, y prefiero '
           + 'decírselo de una: la agenda por profesional es lo único de mi catálogo que todavía no está '
           + 'construido. Lo demás &mdash;calendario, cobro validado contra el banco, personal con permisos&mdash; '
           + 'ya opera en otros negocios. Por eso el precio sale del diagnóstico y no de una tabla.</p>';
      } else if (d.datos.aMedida) {
        h += '<h3 class="asis-titulo">Su caso no encaja en un plan cerrado</h3>';
        h += '<p class="asis-ayuda">Y prefiero decírselo antes que venderle uno que no le sirve. '
           + 'Lo que le conviene es empezar por el diagnóstico: reviso su operación y le entrego un '
           + 'plan por fases con costos, le sirva conmigo o con cualquier otro. Si después contrata, '
           + 'se le descuenta completo.</p>';
      } else {
        h += '<h3 class="asis-titulo">' + d.datos.nombre + ' &mdash; plan ' + d.plan.nombre + '</h3>';
        h += '<p class="asis-ayuda">' + d.plan.alcance.charAt(0).toUpperCase() + d.plan.alcance.slice(1)
           + '. Es un punto de partida para conversar, no una cotización cerrada.</p>';
      }

      h += '<div class="asis-precio">';
      if (d.datos.sinPrecio) {
        h += '<span class="asis-n">$250</span>';
        h += '<span class="asis-d">diagnóstico técnico y plan por fases &middot; se descuenta completo '
           + 'si después contrata</span>';
        h += '</div>';
      } else {
      if (d.descuento) {
        h += '<span class="asis-tachado">' + money(d.plan.precio) + '</span>';
      }
      h += '<span class="asis-n">' + money(d.total) + '</span>';
      h += '<span class="asis-d">desarrollo, 50 % al aprobar y 50 % contra entrega'
         + (d.descuento ? ' &middot; incluye $1.000 de descuento por dejar su sistema actual' : '')
         + '</span>';
      if (d.plan.mes) {
        h += '<span class="asis-mes">+ ' + money(d.plan.mes) + ' / mes de servicio'
           + '<small>hosting, dominio, respaldos, seguridad y soporte. No es el permiso de usarlo: '
           + 'si lo cancela, el sistema sigue siendo suyo.</small></span>';
      } else {
        h += '<span class="asis-mes asis-mes-no">Sin mensualidad: esta capa se monta sobre el sistema '
           + 'que ya tiene.</span>';
      }
      h += '</div>';
      }

      h += '<div class="asis-acciones">';
      h += '<a class="btn-primary" target="_blank" rel="noopener" href="https://wa.me/' + WA
         + '?text=' + encodeURIComponent(texto) + '">Conversarlo por WhatsApp</a>';
      h += '<a class="btn-ghost" href="' + d.datos.url + '">Ver todo lo que incluye</a>';
      h += '</div>';

      h += '<p class="asis-nota">¿No le cuadra? <button type="button" class="asis-reiniciar" data-reiniciar>'
         + 'Responder de nuevo</button> o escribime y lo vemos: nada de esto es definitivo.</p>';
      h += '</div>';
      raiz.innerHTML = h;
    }

    raiz.addEventListener('click', function (e) {
      var op = e.target.closest('.asis-opcion');
      if (op) {
        var v = op.getAttribute('data-v');
        resp[PREGUNTAS[paso].id] = isNaN(Number(v)) ? v : Number(v);
        paso++;
        if (paso >= PREGUNTAS.length) pintarResultado(); else pintarPregunta();
        raiz.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        return;
      }
      if (e.target.closest('[data-atras]')) { paso--; pintarPregunta(); return; }
      if (e.target.closest('[data-reiniciar]')) { paso = 0; resp = {}; pintarPregunta(); }
    });

    pintarPregunta();
  }

  function arrancar() {
    var nodos = document.querySelectorAll('[data-asistente]');
    for (var i = 0; i < nodos.length; i++) iniciar(nodos[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', arrancar);
  } else {
    arrancar();
  }
})();
