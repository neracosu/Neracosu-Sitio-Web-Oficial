(function () {
  'use strict';

  /* ========== TARIFA ==========
     Fuente unica de verdad del precio. Sale del costo real de operacion:
     100 horas facturables al mes (65% de 153 brutas) + $200/mes de costos
     => $17/h para un ingreso neto de $1.500/mes. El detalle esta en
     ~/PRECIOS-Y-COSTOS.md (documento interno, fuera del docroot).

     Hasta 2026-09-12 cada opcion traia su precio escrito a mano y todas
     estaban a $10/h, un 41% por debajo del costo. Ahora el precio se deriva
     de las horas: cambiar la tarifa aca lo actualiza todo de una vez y no
     puede volver a desalinearse de las paginas de /para/.

     Los planes con monthly:true (hosting) llevan precio propio y no se tocan:
     son mensualidades, no horas de trabajo. */
  var TARIFA_HORA = 17;

  /* ========== DATA ========== */
  var SERVICES = [
    {
      id: 'desarrollo-web',
      name: 'Desarrollo Web',
      icon: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
      monthly: false,
      complexity: [
        { label: 'Landing Page', hours: 20, price: 200 },
        { label: 'Sitio Corporativo', hours: 50, price: 500 },
        { label: 'Plataforma Compleja', hours: 100, price: 1000 }
      ],
      addons: [
        { label: 'Diseno personalizado', hours: 15, price: 150 },
        { label: 'SEO basico', hours: 8, price: 80 },
        { label: 'Blog/CMS', hours: 12, price: 120 },
        { label: 'Formulario avanzado', hours: 6, price: 60 },
        { label: 'Multi-idioma', hours: 15, price: 150 },
        { label: 'Panel admin', hours: 20, price: 200 }
      ]
    },
    {
      id: 'aplicaciones-moviles',
      name: 'Aplicaciones Moviles',
      icon: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
      monthly: false,
      complexity: [
        { label: 'App Simple', hours: 150, price: 1500 },
        { label: 'App Media', hours: 250, price: 2500 },
        { label: 'App Compleja', hours: 400, price: 4000 }
      ],
      addons: [
        { label: 'Login/Auth', hours: 15, price: 150 },
        { label: 'Push notifications', hours: 10, price: 100 },
        { label: 'Pasarela de pago', hours: 20, price: 200 },
        { label: 'GPS/Mapas', hours: 15, price: 150 },
        { label: 'Chat tiempo real', hours: 25, price: 250 },
        { label: 'Panel admin web', hours: 30, price: 300 }
      ]
    },
    {
      id: 'ecommerce',
      name: 'E-Commerce',
      icon: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>',
      monthly: false,
      complexity: [
        { label: 'Tienda Basica', hours: 60, price: 600 },
        { label: 'Tienda Media', hours: 120, price: 1200 },
        { label: 'Tienda Compleja', hours: 200, price: 2000 }
      ],
      addons: [
        { label: 'Pago Movil', hours: 15, price: 150 },
        { label: 'Inventario avanzado', hours: 20, price: 200 },
        { label: 'Multi-vendedor', hours: 40, price: 400 },
        { label: 'Blog', hours: 10, price: 100 },
        { label: 'App movil', hours: 80, price: 800 }
      ]
    },
    {
      id: 'sistemas-gestion',
      name: 'Sistemas de Gestion',
      icon: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
      monthly: false,
      complexity: [
        { label: 'Basico', hours: 120, price: 1200 },
        { label: 'Medio', hours: 250, price: 2500 },
        { label: 'Complejo', hours: 400, price: 4000 }
      ],
      addons: [
        { label: 'Inventario', hours: 25, price: 250 },
        { label: 'Facturacion', hours: 20, price: 200 },
        { label: 'Reportes/Dashboard', hours: 30, price: 300 },
        { label: 'API REST', hours: 20, price: 200 },
        { label: 'App movil', hours: 80, price: 800 }
      ]
    },
    {
      id: 'soluciones-pago',
      name: 'Soluciones de Pago',
      icon: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
      monthly: false,
      complexity: [
        { label: 'Integracion Basica', hours: 55, price: 0 },
        { label: 'Integracion Media', hours: 95, price: 0 },
        { label: 'Integracion Completa', hours: 145, price: 0 }
      ],
      addons: [
        { label: 'Pago Movil automatizado', hours: 15, price: 150 },
        { label: 'VPOS/Tarjetas', hours: 15, price: 150 },
        { label: 'QR', hours: 10, price: 100 },
        { label: 'Conciliacion automatica', hours: 20, price: 200 },
        { label: 'Multi-banco', hours: 25, price: 250 }
      ]
    },
    {
      id: 'plugins-wordpress',
      name: 'Plugins WordPress',
      icon: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>',
      monthly: false,
      complexity: [
        { label: 'Simple', hours: 25, price: 250 },
        { label: 'Medio', hours: 50, price: 500 },
        { label: 'Complejo', hours: 100, price: 1000 }
      ],
      addons: [
        { label: 'WooCommerce', hours: 15, price: 150 },
        { label: 'API externa', hours: 12, price: 120 },
        { label: 'Panel config', hours: 10, price: 100 },
        { label: 'Multisite', hours: 8, price: 80 }
      ]
    },
    {
      id: 'bots-automatizacion',
      name: 'Bots y Automatizacion',
      icon: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2a4 4 0 014 4c0 1.95-1.4 3.57-3.25 3.93A2 2 0 0011 12v1"/><circle cx="12" cy="17" r="4"/><path d="M10 17h4"/><path d="M2 2l2 2"/><path d="M22 2l-2 2"/><path d="M2 22l2-2"/><path d="M22 22l-2-2"/></svg>',
      monthly: false,
      complexity: [
        { label: 'Bot Simple', hours: 25, price: 250 },
        { label: 'Bot Medio', hours: 50, price: 500 },
        { label: 'Bot Complejo', hours: 100, price: 1000 }
      ],
      addons: [
        { label: 'Web scraping', hours: 10, price: 100 },
        { label: 'Integracion API', hours: 12, price: 120 },
        { label: 'Base de datos', hours: 10, price: 100 },
        { label: 'Dashboard', hours: 20, price: 200 },
        { label: 'Programacion automatica', hours: 8, price: 80 }
      ]
    },
    {
      id: 'ciberseguridad',
      name: 'Ciberseguridad',
      icon: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
      monthly: false,
      complexity: [
        { label: 'Auditoria Basica', hours: 20, price: 200 },
        { label: 'Pentesting', hours: 40, price: 400 },
        { label: 'Suite Completa', hours: 80, price: 800 }
      ],
      addons: [
        { label: 'Hardening servidor', hours: 10, price: 100 },
        { label: 'WAF', hours: 8, price: 80 },
        { label: 'Monitoreo continuo', hours: 15, price: 150 },
        { label: 'Capacitacion', hours: 8, price: 80 }
      ]
    },
    {
      id: 'hosting',
      name: 'Hosting',
      icon: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M6 6h.01M10 6h.01M6 10h12v8H6z"/></svg>',
      monthly: true,
      complexity: [
        { label: 'Compartido', hours: 0, price: 8 },
        { label: 'Corporativo', hours: 0, price: 25 },
        { label: 'VPS', hours: 0, price: 45 }
      ],
      addons: [
        { label: 'SSL premium', hours: 0, price: 5 },
        { label: 'Backup diario', hours: 0, price: 5 },
        { label: 'CDN', hours: 0, price: 10 },
        { label: 'Soporte prioritario', hours: 0, price: 15 }
      ]
    },
    {
      id: 'recuperacion-hackeados',
      name: 'Recuperacion Sitios Hackeados',
      icon: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
      monthly: false,
      complexity: [
        { label: 'Limpieza Basica', hours: 12, price: 120 },
        { label: 'Limpieza + Hardening', hours: 25, price: 250 },
        { label: 'Recuperacion Completa', hours: 50, price: 500 }
      ],
      addons: [
        { label: 'Backup/restauracion', hours: 5, price: 50 },
        { label: 'Firewall', hours: 8, price: 80 },
        { label: 'Monitoreo 30 dias', hours: 10, price: 100 },
        { label: 'Informe seguridad', hours: 5, price: 50 }
      ]
    },
    {
      id: 'diagnostico-optimizacion',
      name: 'Diagnostico y Optimizacion',
      icon: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
      monthly: false,
      complexity: [
        { label: 'Basico', hours: 10, price: 100 },
        { label: 'Medio', hours: 20, price: 200 },
        { label: 'Completo', hours: 40, price: 400 }
      ],
      addons: [
        { label: 'Core Web Vitals', hours: 8, price: 80 },
        { label: 'SEO tecnico', hours: 10, price: 100 },
        { label: 'Optimizacion imagenes', hours: 5, price: 50 },
        { label: 'Cache avanzado', hours: 8, price: 80 }
      ]
    }
  ];

  /* Deriva el precio de las horas para todo lo que se cobra por trabajo.
     Lo mensual (hosting) conserva su precio: no son horas. */
  SERVICES.forEach(function (service) {
    if (service.monthly) return;
    (service.complexity || []).forEach(function (c) {
      if (c.hours > 0) c.price = c.hours * TARIFA_HORA;
    });
    (service.addons || []).forEach(function (a) {
      if (a.hours > 0) a.price = a.hours * TARIFA_HORA;
    });
  });

  /* ========== STATE ========== */
  var state = {
    currentStep: 1,
    serviceId: null,
    complexityIndex: 0,
    addonIndexes: []
  };

  /* ========== DOM REFS ========== */
  var wizard, stepsContainer, progressDots, panels;

  /* ========== INIT ========== */
  document.addEventListener('DOMContentLoaded', function () {
    wizard = document.getElementById('calc-wizard');
    if (!wizard) return;

    stepsContainer = wizard.querySelector('.calc__steps');
    progressDots = wizard.querySelectorAll('.calc__dot');

    initNav();
    renderStep1();
    checkDeepLink();
  });

  /* ========== NAV (standalone page) ========== */
  function initNav() {
    var toggle = document.getElementById('nav-toggle');
    var menu = document.getElementById('nav-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      toggle.classList.toggle('is-active');
      toggle.setAttribute('aria-expanded', open);
    });

    menu.addEventListener('click', function (e) {
      if (e.target.classList.contains('nav__link')) {
        menu.classList.remove('is-open');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ========== DEEP LINK ========== */
  function checkDeepLink() {
    var params = new URLSearchParams(window.location.search);
    var sid = params.get('servicio');
    if (!sid) return;

    var idx = SERVICES.findIndex(function (s) { return s.id === sid; });
    if (idx === -1) return;

    state.serviceId = sid;
    state.complexityIndex = 0;
    state.addonIndexes = [];
    goToStep(2);
  }

  /* ========== PROGRESS ========== */
  function updateProgress(step) {
    progressDots.forEach(function (dot, i) {
      var n = i + 1;
      dot.classList.toggle('is-completed', n < step);
      dot.classList.toggle('is-active', n === step);
    });
  }

  /* ========== NAVIGATION ========== */
  function goToStep(step) {
    var prev = state.currentStep;
    state.currentStep = step;
    updateProgress(step);

    var panelId = 'calc-step-' + step;
    var existing = stepsContainer.querySelector('.calc__panel');
    var direction = step > prev ? 1 : -1;

    if (step === 1) renderStep1();
    else if (step === 2) renderStep2();
    else if (step === 3) renderStep3();

    var newPanel = stepsContainer.querySelector('.calc__panel');

    if (existing && existing !== newPanel && typeof gsap !== 'undefined') {
      gsap.fromTo(newPanel,
        { x: 80 * direction, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }
      );
    } else if (typeof gsap !== 'undefined') {
      gsap.fromTo(newPanel,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
  }

  /* ========== STEP 1: SELECT SERVICE ========== */
  function renderStep1() {
    var html = '<div class="calc__panel" id="calc-step-1">';
    html += '<h2 class="calc__step-title">Selecciona un servicio</h2>';
    html += '<div class="calc__services-grid">';
    SERVICES.forEach(function (s) {
      html += '<button class="calc__service-card" data-service="' + s.id + '" type="button">';
      html += '<div class="calc__service-icon">' + s.icon + '</div>';
      html += '<span class="calc__service-name">' + s.name + '</span>';
      html += '</button>';
    });
    html += '</div></div>';
    stepsContainer.innerHTML = html;

    stepsContainer.addEventListener('click', handleStep1Click);
  }

  function handleStep1Click(e) {
    var card = e.target.closest('[data-service]');
    if (!card) return;
    stepsContainer.removeEventListener('click', handleStep1Click);
    state.serviceId = card.dataset.service;
    state.complexityIndex = 0;
    state.addonIndexes = [];
    goToStep(2);
  }

  /* Texto que acompana al slider de nivel: nombre, horas y precio. */
  function lecturaNivel(service) {
    var c = service.complexity[state.complexityIndex];
    var h = '<span class="calc__nivel-nombre">' + c.label + '</span>';
    if (service.monthly) {
      h += '<span class="calc__nivel-precio">$' + c.price + '/mes</span>';
    } else {
      h += '<span class="calc__nivel-precio">' + c.hours + 'h &middot; $'
         + c.price.toLocaleString() + '</span>';
    }
    return h;
  }

  /* Rellena la pista y refresca la lectura sin repintar el paso entero:
     repintar en cada cuadro del arrastre se siente pesado. */
  function refrescarNivel(input, service) {
    var max = parseFloat(input.max) || 1;
    input.style.setProperty('--pct', ((parseFloat(input.value) / max) * 100).toFixed(2) + '%');
    var c = service.complexity[state.complexityIndex];
    input.setAttribute('aria-valuetext', c.label + ', ' + (service.monthly
      ? '$' + c.price + ' al mes'
      : c.hours + ' horas, $' + c.price.toLocaleString()));
    var lectura = document.getElementById('calc-nivel-lectura');
    if (lectura) lectura.innerHTML = lecturaNivel(service);
  }

  /* ========== STEP 2: OPTIONS ========== */
  function renderStep2() {
    var service = getService();
    if (!service) return;

    var unit = service.monthly ? '/mes' : 'h';
    var html = '<div class="calc__panel" id="calc-step-2">';
    html += '<h2 class="calc__step-title">Configura tu ' + service.name + '</h2>';

    /* Nivel de complejidad: slider de 3 posiciones.
       Antes eran tres tarjetas en grid; entre 480 y 768 px quedaban
       apretadas y debajo se apilaban ocupando media pantalla. */
    var ultimo = service.complexity.length - 1;
    html += '<h3 class="calc__option-label"><label for="calc-nivel">Nivel de complejidad</label></h3>';
    html += '<div class="calc__nivel">';
    html += '<div class="calc__nivel-lectura" id="calc-nivel-lectura">' + lecturaNivel(service) + '</div>';
    html += '<input type="range" id="calc-nivel" class="calc__nivel-slider" min="0" max="' + ultimo
         + '" step="1" value="' + state.complexityIndex + '">';
    html += '<div class="calc__nivel-topes" aria-hidden="true">';
    service.complexity.forEach(function (c) {
      html += '<span>' + c.label + '</span>';
    });
    html += '</div>';
    html += '</div>';

    /* Addons */
    if (service.addons.length) {
      html += '<h3 class="calc__option-label">Funcionalidades adicionales <span class="calc__option-hint">(opcional)</span></h3>';
      html += '<div class="calc__addons-grid">';
      service.addons.forEach(function (a, i) {
        var checked = state.addonIndexes.indexOf(i) !== -1 ? ' is-selected' : '';
        html += '<button class="calc__addon-card' + checked + '" data-addon="' + i + '" type="button">';
        html += '<span class="calc__addon-check">';
        html += '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>';
        html += '</span>';
        html += '<span class="calc__addon-name">' + a.label + '</span>';
        html += '<span class="calc__addon-price">+$' + a.price + (service.monthly ? '/mes' : '') + '</span>';
        html += '</button>';
      });
      html += '</div>';
    }

    html += '<div class="calc__nav-buttons">';
    html += '<button class="btn btn--outline calc__btn-back" data-go="1" type="button">Cambiar Servicio</button>';
    html += '<button class="btn btn--primary calc__btn-next" data-go="3" type="button">Ver Resultado</button>';
    html += '</div>';

    html += '</div>';
    stepsContainer.innerHTML = html;

    var slider = document.getElementById('calc-nivel');
    if (slider) {
      refrescarNivel(slider, service);
      slider.addEventListener('input', function () {
        state.complexityIndex = parseInt(this.value, 10);
        refrescarNivel(this, service);
      });
    }

    stepsContainer.addEventListener('click', handleStep2Click);
  }

  function handleStep2Click(e) {
    var addonCard = e.target.closest('[data-addon]');
    if (addonCard) {
      var idx = parseInt(addonCard.dataset.addon, 10);
      var pos = state.addonIndexes.indexOf(idx);
      if (pos === -1) {
        state.addonIndexes.push(idx);
        addonCard.classList.add('is-selected');
      } else {
        state.addonIndexes.splice(pos, 1);
        addonCard.classList.remove('is-selected');
      }
      return;
    }

    var navBtn = e.target.closest('[data-go]');
    if (navBtn) {
      stepsContainer.removeEventListener('click', handleStep2Click);
      goToStep(parseInt(navBtn.dataset.go, 10));
    }
  }

  /* ========== STEP 3: RESULT ========== */
  function renderStep3() {
    var service = getService();
    if (!service) return;

    var comp = service.complexity[state.complexityIndex];
    var totalHours = comp.hours;
    var totalPrice = comp.price;
    var selectedAddons = [];

    state.addonIndexes.forEach(function (i) {
      var a = service.addons[i];
      selectedAddons.push(a);
      totalHours += a.hours;
      totalPrice += a.price;
    });

    var html = '<div class="calc__panel" id="calc-step-3">';
    html += '<h2 class="calc__step-title">Tu presupuesto estimado</h2>';

    html += '<div class="calc__result-card">';
    html += '<div class="calc__result-header">';
    html += '<div class="calc__result-icon">' + service.icon + '</div>';
    html += '<div><h3 class="calc__result-service">' + service.name + '</h3>';
    html += '<p class="calc__result-level">' + comp.label + '</p></div>';
    html += '</div>';

    /* Breakdown */
    html += '<div class="calc__breakdown">';
    html += '<div class="calc__breakdown-row">';
    html += '<span>' + comp.label + '</span>';
    if (service.monthly) {
      html += '<span>$' + comp.price + '/mes</span>';
    } else {
      html += '<span>' + comp.hours + 'h &mdash; $' + comp.price.toLocaleString() + '</span>';
    }
    html += '</div>';

    selectedAddons.forEach(function (a) {
      html += '<div class="calc__breakdown-row">';
      html += '<span>' + a.label + '</span>';
      if (service.monthly) {
        html += '<span>+$' + a.price + '/mes</span>';
      } else {
        html += '<span>' + a.hours + 'h &mdash; +$' + a.price.toLocaleString() + '</span>';
      }
      html += '</div>';
    });

    html += '<div class="calc__breakdown-total">';
    if (service.monthly) {
      html += '<span>Total estimado</span>';
      html += '<span>$' + totalPrice + '/mes USD</span>';
    } else {
      html += '<span>Total estimado</span>';
      html += '<span>' + totalHours + 'h &mdash; $' + totalPrice.toLocaleString() + ' USD</span>';
    }
    html += '</div>';

    /* Transparencia de tarifa: el numero no sale de la nada */
    if (!service.monthly) {
      html += '<p class="calc__tarifa">';
      html += totalHours + ' horas de trabajo a $' + TARIFA_HORA + ' la hora. ';
      html += 'Es una estimacion para ubicarte, no una cotizacion cerrada: el numero final sale ';
      html += 'despues de conversar, y suele bajar si tu caso encaja en algo que ya tengo construido.';
      html += '</p>';
      html += '<p class="calc__tarifa">';
      html += 'Si tu negocio es un hotel, un restaurante, un centro de reservas, un almacen aduanero ';
      html += 'o necesitas cobrar por pago movil, mira los ';
      html += '<a href="/para/">planes cerrados por rubro</a>: parten de sistemas que ya estan ';
      html += 'escritos y traen migracion, capacitacion, servidor el primer anio y 90 dias de garantia.';
      html += '</p>';
    }
    html += '</div>';

    /* WhatsApp CTA */
    var waURL = buildWhatsAppURL(service, comp, selectedAddons, totalHours, totalPrice);
    html += '<a href="' + waURL + '" target="_blank" rel="noopener noreferrer" class="btn btn--whatsapp calc__btn-wa">';
    html += '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
    html += ' Enviar Cotizacion por WhatsApp';
    html += '</a>';

    html += '</div>'; /* end result-card */

    /* Nav buttons */
    html += '<div class="calc__nav-buttons">';
    html += '<button class="btn btn--outline calc__btn-back" data-go="2" type="button">Modificar Opciones</button>';
    html += '<button class="btn btn--outline calc__btn-back" data-go="1" type="button">Calcular Otro Servicio</button>';
    html += '</div>';

    html += '</div>';
    stepsContainer.innerHTML = html;

    stepsContainer.addEventListener('click', handleStep3Click);
  }

  function handleStep3Click(e) {
    var navBtn = e.target.closest('[data-go]');
    if (!navBtn) return;
    stepsContainer.removeEventListener('click', handleStep3Click);
    var target = parseInt(navBtn.dataset.go, 10);
    if (target === 1) {
      state.serviceId = null;
      state.complexityIndex = 0;
      state.addonIndexes = [];
    }
    goToStep(target);
  }

  /* ========== WHATSAPP ========== */
  function buildWhatsAppURL(service, comp, addons, totalHours, totalPrice) {
    var msg = 'Hola Neri! Me interesa cotizar:\n\n';
    msg += '*Servicio:* ' + service.name + '\n';
    msg += '*Nivel:* ' + comp.label + '\n';

    if (addons.length) {
      msg += '*Funcionalidades adicionales:*\n';
      addons.forEach(function (a) {
        msg += '  - ' + a.label + '\n';
      });
    }

    msg += '\n';
    if (service.monthly) {
      msg += '*Estimado:* $' + totalPrice + '/mes USD\n';
    } else {
      msg += '*Horas estimadas:* ' + totalHours + 'h\n';
      msg += '*Costo estimado:* $' + totalPrice.toLocaleString() + ' USD\n';
    }
    msg += '\nGenerado desde neracosu.com/calculadora';

    return 'https://wa.me/584222707095?text=' + encodeURIComponent(msg);
  }

  /* ========== HELPERS ========== */
  function getService() {
    return SERVICES.find(function (s) { return s.id === state.serviceId; }) || null;
  }

  /* ========== PROGRESS DOT NAVIGATION ========== */
  document.addEventListener('DOMContentLoaded', function () {
    var bar = document.querySelector('.calc__progress');
    if (!bar) return;
    bar.addEventListener('click', function (e) {
      var dot = e.target.closest('.calc__dot');
      if (!dot) return;
      var step = parseInt(dot.dataset.step, 10);
      if (step >= state.currentStep) return;
      if (step === 1) {
        state.serviceId = null;
        state.complexityIndex = 0;
        state.addonIndexes = [];
      }
      goToStep(step);
    });
  });

})();
