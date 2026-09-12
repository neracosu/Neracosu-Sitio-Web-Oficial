/* =========================================================================
   /servicios/hoteles.html — mapa de habitaciones y calculadora de tiempo
   =========================================================================
   JS vanilla, sin dependencias, como el resto del sitio. Si algo falla, la
   pagina sigue leyendose: el mapa es ilustrativo y la calculadora nace con
   sus numeros ya escritos en el HTML. */

(function () {
  "use strict";

  // ---------------------------------------------------------- calculadora
  //
  // Aritmetica simple con los numeros de quien mira: minutos perdidos por
  // entrada, por entradas al dia, por 30 dias. Nada de proyecciones.
  var entradas = document.getElementById("hoteles-entradas");
  var minutos = document.getElementById("hoteles-minutos");
  var precio = document.getElementById("hoteles-precio");
  var salidaHoras = document.getElementById("hoteles-horas");
  var salidaPlata = document.getElementById("hoteles-plata");

  if (entradas && minutos && precio && salidaHoras && salidaPlata) {
    var formato = new Intl.NumberFormat("es-VE", { maximumFractionDigits: 0 });

    var calcular = function () {
      var e = Math.max(0, Number(entradas.value) || 0);
      var m = Math.max(0, Number(minutos.value) || 0);
      var p = Math.max(0, Number(precio.value) || 0);

      var horasMes = (e * m * 30) / 60;
      salidaHoras.textContent = formato.format(Math.round(horasMes)) + " h";

      // El bloque mas vendido en este tipo de hotel son 4 horas: la hora
      // suelta se valora como una cuarta parte de ese bloque.
      salidaPlata.textContent = "Bs " + formato.format(Math.round(horasMes * (p / 4)));
    };

    [entradas, minutos, precio].forEach(function (campo) {
      campo.addEventListener("input", calcular);
    });
    calcular();
  }

  // ------------------------------------------------------------- el mapa
  //
  // Se dibuja con los tiempos ya puestos: la pagina se entiende en la
  // primera foto, sin esperar a que nada se mueva.
  var grilla = document.getElementById("hoteles-grilla");
  var relojBarra = document.getElementById("hoteles-reloj");
  if (!grilla) return;

  var CUARTOS = [
    { num: "101", estado: "ocupada", restan: 9240 },
    { num: "102", estado: "vence", restan: 1080 },
    { num: "103", estado: "libre" },
    { num: "104", estado: "vencida", restan: -1500 },
    { num: "105", estado: "ocupada", restan: 6300 },
    { num: "106", estado: "limpieza" },
    { num: "107", estado: "libre" },
    { num: "108", estado: "ocupada", restan: 12600 },
    { num: "109", estado: "vence", restan: 1500 },
    { num: "110", estado: "libre" },
    { num: "111", estado: "ocupada", restan: 3900 },
    { num: "112", estado: "libre" }
  ];

  var ETIQUETA = {
    libre: "Libre",
    ocupada: "Ocupada",
    vence: "Por vencer",
    vencida: "Vencida",
    limpieza: "Limpieza"
  };

  function reloj(segundos) {
    var s = Math.abs(segundos);
    var h = Math.floor(s / 3600);
    var m = Math.floor((s % 3600) / 60);
    var cuerpo = h > 0 ? h + " h " + String(m).padStart(2, "0") : m + " min";
    return segundos < 0 ? "+" + cuerpo : cuerpo;
  }

  grilla.innerHTML = CUARTOS.map(function (c) {
    var pie =
      c.estado === "libre"
        ? "lista"
        : c.estado === "limpieza"
          ? "esperando"
          : '<span data-restan="' + c.restan + '">' + reloj(c.restan) + "</span>";
    return (
      '<div class="hoteles-cuarto hoteles-cuarto--' + c.estado + '">' +
      '<span class="hoteles-cuarto__num">' + c.num + "</span>" +
      '<span class="hoteles-cuarto__estado">' + ETIQUETA[c.estado] + "</span>" +
      '<span class="hoteles-cuarto__tiempo hoteles-mono">' + pie + "</span>" +
      "</div>"
    );
  }).join("");

  function pintarReloj() {
    if (!relojBarra) return;
    var ahora = new Date();
    relojBarra.textContent =
      String(ahora.getHours()).padStart(2, "0") + ":" + String(ahora.getMinutes()).padStart(2, "0");
  }
  pintarReloj();

  // Los relojes corren de a un minuto: es lo que hace distinto a un hotel de
  // alta rotacion, y se ve sin que nada salte. Se respeta a quien pidio menos
  // movimiento.
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setInterval(function () {
      var marcas = grilla.querySelectorAll("[data-restan]");
      for (var i = 0; i < marcas.length; i++) {
        var v = Number(marcas[i].getAttribute("data-restan")) - 60;
        marcas[i].setAttribute("data-restan", String(v));
        marcas[i].textContent = reloj(v);
      }
      pintarReloj();
    }, 60000);
  }
})();
