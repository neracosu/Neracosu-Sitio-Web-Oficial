/* ============================================================
   neracosu.com — Sliders de las calculadoras de fuga
   ------------------------------------------------------------
   Se encarga solo de la parte visual y compartida de los
   input[type=range]: el numero grande de arriba y el relleno de
   la pista. La formula de cada pagina vive en su propio script
   y sigue leyendo `.value` como antes.

   Cada slider declara:
     data-salida="id-del-numero"   donde se escribe el valor
     data-formato="bs|pct|n"       como se formatea (opcional, n por defecto)
     data-sufijo="min"             texto detras del numero (opcional)
   ============================================================ */
(function () {
  'use strict';

  var fmt = new Intl.NumberFormat('es-VE', { maximumFractionDigits: 0 });

  function formatear(valor, formato, sufijo) {
    var n = fmt.format(valor);
    if (formato === 'bs') n = 'Bs ' + n;
    else if (formato === 'pct') n = n + ' %';
    if (sufijo) n = n + ' ' + sufijo;
    return n;
  }

  function refrescar(input) {
    var min = parseFloat(input.min) || 0;
    var max = parseFloat(input.max);
    var val = parseFloat(input.value);
    if (!isFinite(max) || max === min) return;

    // Relleno de la pista (WebKit lo necesita; Firefox usa ::-moz-range-progress)
    input.style.setProperty('--pct', (((val - min) / (max - min)) * 100).toFixed(2) + '%');

    var texto = formatear(
      val,
      input.getAttribute('data-formato'),
      input.getAttribute('data-sufijo')
    );

    var salida = document.getElementById(input.getAttribute('data-salida'));
    if (salida) salida.textContent = texto;

    /* El numero visible esta aria-hidden porque lo duplicaria el slider.
       Con aria-valuetext el lector de pantalla dice «Bs 12.600» y no
       «12600», que es lo que hace falta entender. */
    input.setAttribute('aria-valuetext', texto);
  }

  function arrancar() {
    var sliders = document.querySelectorAll('.calcfuga-field input[type="range"]');
    for (var i = 0; i < sliders.length; i++) {
      var s = sliders[i];
      s.addEventListener('input', function () { refrescar(this); });
      refrescar(s);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', arrancar);
  } else {
    arrancar();
  }
})();
