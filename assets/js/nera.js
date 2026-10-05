/* Nera 0.3.1 - la broma del codigo fuente (ver ~/build-para/nera.py). Solo habla en la consola. */
(function () {
  'use strict';
  if (!window.console || !console.log) return;
  var t = 'font-family: ui-monospace, Menlo, Consolas, monospace;';
  console.log('%cNera 0.3.1 «Arepa Estable»', t + 'font-weight:700; font-size:14px; color:#2e7d32;');
  console.log('%cCompilado sin errores, con 3 advertencias y 1 premonición.', t + 'color:#888;');
  console.log('%cadvertencia: usted abrió la consola. Aquí no hay nada que ver.', t + 'color:#c77700;');
  console.log('%cadvertencia: bueno, sí. Pruebe Ctrl+U. Ahí está el código de verdad.', t + 'color:#c77700;');
  console.log('%cpremonición: va a querer saber quién hizo esto. https://neracosu.com/#contacto', t + 'color:#555;');
  // Para el que llegue a escribir nera en la consola.
  try {
    window.nera = {
      version: '0.3.1',
      nombre: 'Arepa Estable',
      compilar: function () { return 'ya estaba compilado. ¿Qué más quiere?'; },
      ayuda: function () { return 'Nera no tiene documentación. Tiene fe.'; },
      cafe: function () { return 'servido. Grande.'; }
    };
  } catch (e) { /* nada */ }
})();
