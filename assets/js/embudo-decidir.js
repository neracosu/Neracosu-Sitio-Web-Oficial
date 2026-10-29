/* embudo-decidir.js — reglas puras del embudo /empezar (29-oct-2026).
   Sin DOM: se prueba en Node (~/build-para/pruebas/embudo/decidir.test.cjs) y lo
   usa embudo.js en el navegador como window.ncEmbudo.
   Las reglas de decidir() son las del asistente de /para/ (asistente.js), mas dos:
   quien ya vende en linea y confirma pagos a mano va a la validacion de pagos, y
   «vender en linea o que me encuentren» va a comercio salvo en comercio y hoteles.
   Sin cifras de proyecto: los precios viven solo en /para/. */
(function (raiz, fabrica) {
  if (typeof module === 'object' && module.exports) module.exports = fabrica();
  else raiz.ncEmbudo = fabrica();
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  var RUBROS = [
    { v: 'citas', t: 'Servicios con cita', ej: 'peluquería, odontología, taller, spa, veterinaria' },
    { v: 'comercio', t: 'Tienda o comercio', ej: 'ropa, farmacia, ferretería, repuestos, joyería' },
    { v: 'restaurantes', t: 'Comida', ej: 'restaurante, bar, delivery, panadería, food truck' },
    { v: 'hoteles', t: 'Hospedaje', ej: 'hotel, posada, cabañas, apartamentos' },
    { v: 'reservas', t: 'Espacios y eventos', ej: 'canchas, salones, coworking, entradas' },
    { v: 'logistica', t: 'Logística y carga', ej: 'almacén, aduana, transporte, distribución' },
    { v: 'otro', t: 'Otra cosa', ej: 'o varias de estas a la vez' }
  ];

  var ACTUAL = [
    { v: 'manual', t: 'Cuaderno, Excel y WhatsApp' },
    { v: 'mensualidad', t: 'Pago una mensualidad por un sistema' },
    { v: 'propio', t: 'Tengo un sistema propio o comprado' },
    { v: 'web', t: 'Tengo página o tienda en línea, pero confirmo los pagos a mano' }
  ];

  var OBJETIVOS = [
    { v: 'cobros', t: 'Cobrar sin revisar el banco a mano' },
    { v: 'ventas', t: 'No perder reservas ni pedidos de noche' },
    { v: 'operacion', t: 'Saber qué pasa en mi operación sin estar encima' },
    { v: 'sistemas', t: 'Que mis sistemas se hablen entre sí' },
    { v: 'web', t: 'Vender en línea o que me encuentren en Google' }
  ];

  /* Ejemplos de tamano por rubro: salen de los alcances publicados en /para/. */
  var EJEMPLOS_TAMANO = {
    hoteles: ['hasta 15 habitaciones', '16 a 40 habitaciones', 'más de 40 o varias sedes'],
    comercio: ['un local, mostrador', 'un local grande o dos', 'varias sedes o mucho movimiento'],
    restaurantes: ['hasta 10 mesas o solo delivery', '11 a 30 mesas', 'más de 30 o varias sedes'],
    citas: ['hasta 3 profesionales', '4 a 10 profesionales', 'más de 10 o varias sedes'],
    reservas: ['1 o 2 espacios', '3 a 6 espacios', 'más de 6 o varias sedes'],
    logistica: ['pocos movimientos al día', 'decenas al día', 'cientos al día o varias sedes'],
    otro: ['un local, poco personal', 'un local grande o dos chicos', 'varias sedes o mucho movimiento']
  };
  var NOMBRES_TAMANO = ['Chica', 'Mediana', 'Grande'];

  function tamanos(rubro) {
    var ej = EJEMPLOS_TAMANO[rubro] || EJEMPLOS_TAMANO.otro;
    return [0, 1, 2].map(function (v) { return { v: v, t: NOMBRES_TAMANO[v], ej: ej[v] }; });
  }

  /* img: nombre base en assets/img/portafolio/ (…-800.webp). slug: pagina de /para/. */
  var SISTEMAS = {
    hoteles: {
      nombre: 'Sistema de hotel con reservas y cobro validado', slug: 'hoteles', img: 'pms-hotelero',
      pie: 'Sistema hotelero en operación en un hotel de alta rotación en Valencia, Carabobo.',
      ya: ['Calendario de habitaciones con check-in y limpieza', 'Pago Móvil validado contra el banco', 'Reservas desde su página, sin portales']
    },
    comercio: {
      nombre: 'Tienda con inventario y cobro validado', slug: 'comercio-y-tienda', img: 'adastram',
      pie: 'Tienda en línea propia, con cobro validado, en operación.',
      ya: ['Catálogo, carrito y pedido desde el teléfono', 'Pago Móvil que se confirma solo', 'Inventario que descuenta al vender']
    },
    restaurantes: {
      nombre: 'Sistema de restaurante con caja y cocina', slug: 'restaurantes-y-bares', img: 'armorpay',
      pie: 'Plataforma de validación de pagos en operación en un complejo deportivo de Caracas.',
      ya: ['Mesas, cuentas y cierre de caja', 'Pedidos a cocina sin papel', 'Cobro validado contra el banco']
    },
    citas: {
      nombre: 'Agenda por profesional con anticipo validado', slug: 'citas-y-servicios', img: null,
      pie: '',
      ya: ['Calendario y cupo retenido (ya construidos)', 'Anticipo validado contra el banco (ya construido)', 'Agenda por profesional: se termina con los primeros negocios']
    },
    reservas: {
      nombre: 'Reservas con pago validado y cupo retenido', slug: 'reservas', img: 'terrazas-vip',
      pie: 'Reservas con pago validado en operación en un complejo deportivo de Caracas.',
      ya: ['Reserva de noche sin que nadie conteste', 'Cupo retenido mientras paga', 'Validación automática del Pago Móvil']
    },
    logistica: {
      nombre: 'Plataforma de costado de buque y seguimiento', slug: 'logistica-y-aduana', img: 'ocls',
      pie: 'Plataforma de costado de buque, construida y en demostración.',
      ya: ['Contenedores con estado en tiempo real', 'Seguimiento para su cliente', 'Por fases, cada una operando']
    },
    cobros: {
      nombre: 'Plataforma de validación de pagos', slug: 'cobros-y-pagos', img: 'armorpay',
      pie: 'Plataforma de validación de pagos en operación en Caracas.',
      ya: ['Pago Móvil validado contra el banco', 'Enlace de cobro para ventas por Instagram y WhatsApp', 'Se conecta a lo que ya tiene']
    },
    integraciones: {
      nombre: 'Integración de sus sistemas', slug: 'integraciones-api-y-bots', img: 'armorpay-interno',
      pie: 'Panel interno de la plataforma de validación de pagos.',
      ya: ['Sus sistemas se hablan entre sí', 'Bot de WhatsApp conectado a su operación', 'Sin cambiar lo que ya funciona']
    },
    medida: {
      nombre: 'Un sistema a la medida, por fases', slug: '', img: null,
      pie: '',
      ya: ['Reviso cómo trabaja hoy', 'Le digo qué conviene primero', 'Cada fase queda operando']
    }
  };

  var COBRO_INCLUIDO = ['restaurantes', 'hoteles', 'comercio'];

  function decidir(r) {
    var rubro = r.rubro, o = r.objetivo, clave = rubro;
    if (rubro === 'otro') {
      clave = o === 'cobros' ? 'cobros' : o === 'sistemas' ? 'integraciones' : o === 'web' ? 'comercio' : 'medida';
    } else if (o === 'sistemas') {
      clave = 'integraciones';
    } else if (o === 'cobros' && COBRO_INCLUIDO.indexOf(rubro) === -1) {
      clave = 'cobros';
    } else if (o === 'web' && rubro !== 'comercio' && rubro !== 'hoteles') {
      clave = 'comercio';
    }
    if (r.actual === 'web' && (rubro === 'comercio' || rubro === 'otro')) clave = 'cobros';
    var demo = (Number(r.tamano) >= 1) || r.actual === 'web';
    if (clave === 'medida') demo = false;
    return { clave: clave, sistema: SISTEMAS[clave], demo: demo };
  }

  /* Sujeto con genero para concordar el tamano: [sustantivo, femenino] */
  var SUJETO = {
    citas: ['un negocio de citas', false],
    comercio: ['una tienda', true],
    restaurantes: ['un negocio de comida', false],
    hoteles: ['un hospedaje', false],
    reservas: ['un negocio de reservas', false],
    logistica: ['una operación logística', true],
    otro: ['su negocio', false]
  };
  var TAMANO_ADJ = [['chico', 'chica'], ['mediano', 'mediana'], ['grande', 'grande']];
  var HOY = {
    manual: 'trabaja en cuaderno y WhatsApp',
    mensualidad: 'paga un sistema por mensualidad',
    propio: 'tiene un sistema propio',
    web: 'vende en línea y confirma pagos a mano'
  };

  function fraseResultado(r, sistema) {
    var s = SUJETO[r.rubro] || SUJETO.otro;
    var t = TAMANO_ADJ[Number(r.tamano)] || null;
    var adj = t ? ' ' + t[s[1] ? 1 : 0] : '';
    return 'Para ' + s[0] + adj + ' que hoy ' + (HOY[r.actual] || 'trabaja como puede') + ', lo primero es: ' + sistema.nombre + '.';
  }

  function texto(lista, v) {
    for (var i = 0; i < lista.length; i++) if (lista[i].v === v) return lista[i].t;
    return String(v);
  }

  function resumenWhatsApp(r, d, marca) {
    var lineas = ['Hola Neri, usé /empezar.'];
    if (marca) lineas.push('Negocio: ' + marca);
    lineas.push('Rubro: ' + texto(RUBROS, r.rubro));
    lineas.push('Hoy: ' + texto(ACTUAL, r.actual));
    lineas.push('Quiero: ' + texto(OBJETIVOS, r.objetivo));
    lineas.push('Tamaño: ' + (NOMBRES_TAMANO[Number(r.tamano)] || '') + ' (' + (tamanos(r.rubro)[Number(r.tamano)] || {}).ej + ')');
    lineas.push('Me recomendó: ' + d.sistema.nombre);
    lineas.push(d.demo ? 'Quiero ver mi demostración con mi marca y el diagnóstico gratis.' : 'Quiero mi diagnóstico gratis.');
    return lineas.join('\n');
  }

  return {
    RUBROS: RUBROS, ACTUAL: ACTUAL, OBJETIVOS: OBJETIVOS, SISTEMAS: SISTEMAS,
    tamanos: tamanos, decidir: decidir, fraseResultado: fraseResultado, resumenWhatsApp: resumenWhatsApp
  };
});
