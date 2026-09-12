/* ============================================================
   neracosu.com — Testimonios
   ------------------------------------------------------------
   EDITAR SOLO EL ARRAY DE ABAJO. Todo lo demas se encarga solo.

   Regla: aca van testimonios REALES, con nombre y negocio. Un
   testimonio inventado, si el cliente lo desmiente, cuesta mas
   que no tener ninguno. Mientras el array este vacio la seccion
   NO se muestra: la pagina se ve completa igual.

   Campos:
     texto   Lo que dijo, en sus palabras. Mejor si trae una cifra
             o un antes/despues concreto. 2-4 lineas.
     nombre  Nombre y apellido de quien lo dice.
     cargo   Su rol ("dueno", "gerente de operaciones", ...).
     negocio Nombre del negocio.
     nichos  En que paginas aparece. Valores validos:
             hoteles · restaurantes · reservas · cobros ·
             logistica · integraciones · home
             Puede ir en varias: ["hoteles", "home"].
   ============================================================ */

const TESTIMONIOS = [
  // Ejemplo del formato (borrar esta linea y descomentar cuando haya uno real):
  // {
  //   texto: 'Veniamos pagando una licencia anual y el arqueo nunca cuadraba. '
  //        + 'Desde que entro el sistema el cierre del dia sale solo y se acabaron '
  //        + 'las discusiones de caja.',
  //   nombre: 'Nombre Apellido',
  //   cargo: 'dueno',
  //   negocio: 'Hotel X, Valencia',
  //   nichos: ['hoteles', 'home'],
  // },
];

/* ------------------------------------------------------------
   Render. Cada contenedor declara su nicho:
     <div data-testimonios="hoteles"></div>
   Se pinta la seccion contenedora [data-testimonios-seccion]
   solo si hay al menos un testimonio de ese nicho.
   ------------------------------------------------------------ */
(function () {
  'use strict';

  function escapar(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function tarjeta(t) {
    return (
      '<figure class="testimonio">' +
        '<blockquote class="testimonio-texto">' + escapar(t.texto) + '</blockquote>' +
        '<figcaption class="testimonio-firma">' +
          '<span class="testimonio-nombre">' + escapar(t.nombre) + '</span>' +
          '<span class="testimonio-cargo">' +
            escapar(t.cargo) + (t.negocio ? ' &middot; ' + escapar(t.negocio) : '') +
          '</span>' +
        '</figcaption>' +
      '</figure>'
    );
  }

  function pintar() {
    var contenedores = document.querySelectorAll('[data-testimonios]');
    for (var i = 0; i < contenedores.length; i++) {
      var cont = contenedores[i];
      var nicho = cont.getAttribute('data-testimonios');
      var propios = TESTIMONIOS.filter(function (t) {
        return t && t.texto && t.nombre && Array.isArray(t.nichos) && t.nichos.indexOf(nicho) !== -1;
      });

      // La investigacion de conversion sugiere 3-5: mas satura sin sumar.
      propios = propios.slice(0, 4);

      var seccion = cont.closest('[data-testimonios-seccion]') || cont;
      if (!propios.length) {
        seccion.hidden = true;   // nada que mostrar: la seccion desaparece
        continue;
      }
      seccion.hidden = false;
      cont.innerHTML = propios.map(tarjeta).join('');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', pintar);
  } else {
    pintar();
  }
})();
