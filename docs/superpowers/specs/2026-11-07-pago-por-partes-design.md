# Pago por partes: la tercera forma de pagar en /para/, en /empezar y en una landing propia

Fecha: 2026-11-07. Decisión de Neri. Estado: diseño aprobado en conversación, revisado por un constructor y con las
cuatro decisiones de Neri incorporadas; pendiente de plan.

## Intención y por qué

El sitio ofrece hoy dos formas de empezar: el pago único (con la promoción de contado) o el diagnóstico gratis. A
muchos negocios lo que los frena no es el sistema sino poner todo el dinero de una vez. Neri decidió ofrecer una
tercera forma, un **alquiler con opción a compra**: una inicial, cuotas mensuales fijas, el sistema funcionando
desde el primer día alojado con Neri, y entregado en el dominio del cliente con su código al pagar la última cuota.
Las condiciones completas están en `~/propuestas/condiciones-pago-por-partes.md` (copia local del Claude Doc
«Condiciones de pago en cuotas», con las decisiones del 2026-11-07); este diseño las lleva al sitio.

De cara al cliente se llama **«pago por partes»** (y la otra opción, **«sistema propio, de una vez»**). Nunca
«crédito», «financiamiento» ni «alquiler» en texto público: el cliente no debe sentir que pide un préstamo ni que no
es dueño de lo que paga.

Tres piezas, en este orden de dependencia:

1. **`/para/`** publica las cifras (inicial y cuota por plan) y es la única fuente de esos números.
2. **`/empezar`** ofrece la elección entre las dos formas, sin cifras, antes de pedir los datos.
3. **`/por-partes`**, landing de campaña que vende solo esa forma, con las cifras generadas desde la misma fuente.

## Objetivos

- Que quien llega con poco dinero vea desde el primer contacto que sí puede empezar, con cifras concretas en
  `/para/` y en la landing.
- Que Neri sepa, en cada solicitud del embudo, con qué expectativa de pago escribe la persona.
- Que las cifras de cuotas vivan en un solo lugar (`~/build-para/precios.py`) y todo lo demás se derive de ahí.
- Que la landing sirva para campañas con origen medido (`?de=tiktok`, etc.), igual que `/empezar`.

## No objetivos

- No se cambia el precio de lista ni la promoción de contado (40 % hasta el 31-dic-2026).
- No se construye el cobro automático de las cuotas en el panel: los cobros se crean como proyecto con sus cuotas
  fechadas, con lo que el panel ya tiene (recordatorio, recibo). La pausa por mora es manual.
- No se publica el contrato en la web: es un documento que Neri manda por escrito.
- No se tocan las propuestas por correo automáticas más allá de la fila de cuotas en las plantillas.
- No se descalifica a nadie en `/empezar` por elegir una forma u otra.

## Anti-objetivos (lo que lo convertiría en fracaso aunque funcione)

- Cifras distintas entre `/para/`, la landing y las propuestas.
- Texto que suene a banco o a deuda («crédito», «financiamiento», «mora», «intereses»), o muletillas coloquiales
  («se lo digo de una vez», «se lo digo claro»).
- Un paso más en `/empezar` que rompa las 45 pruebas o el CLS 0 de la portada.
- Que la landing cargue `redesign.css` o fuentes externas (la regla de `/empezar` sobre rendimiento vale aquí).

## Decisiones de Neri tras la revisión del constructor (2026-11-07)

1. **Rubros**: el pago por partes se ofrece solo en los sistemas que se alojan con Neri: **hoteles, restaurantes y
   bares, comercio y tienda, citas y servicios y reservas**. No en cobros y pagos ni integraciones (capa sobre lo que
   el cliente ya tiene, sin mensualidad), ni en logística y aduana (precio por diagnóstico), ni en Colombia, ni en los
   planes de emprendimiento (`EXTRAS`, 290/590/890, que viven bajo el dominio de Neri). Esos siguen con pago único o
   diagnóstico, y sus tarjetas no llevan la línea por partes.
2. **Mensualidad de servicio**: corre **aparte desde el mes 2**, la del plan (USD 100 / 130 / 170), igual que en el
   contado. Las partes solo reparten el pago único. La cuota NO incluye el servicio.
3. **Descuento de USD 1.000** por dejar otro sistema: **solo con el pago de una vez**. Las partes van al precio de
   lista sin ningún descuento, y el texto lo dice en los tres sitios.
4. **Planes de emprendimiento**: **sin** pago por partes.

## Las cifras y las reglas (fuente: condiciones-pago-por-partes.md)

Viven como constantes en `~/build-para/precios.py`, junto a `PROMO_PCT`:

| Constante | Valor | Qué es |
|---|---|---|
| `PARTES_INICIAL_PCT` | 25 | Porcentaje del precio de lista que se paga al aprobar |
| `PARTES_CUOTAS` | 12 | Número de cuotas mensuales iguales |
| `PARTES_VENTANA_CONTADO` | 4 | Hasta esa cuota, pagar el saldo completo recupera el precio con promoción vigente al firmar |

Reglas que el texto público repite en los tres sitios, con las mismas palabras:

- El precio por partes es el **precio de lista**, sin la promoción de contado. Inicial = 25 % del precio de lista;
  12 cuotas iguales que suman el 75 % restante. La mensualidad de servicio del plan corre aparte desde el mes 2,
  igual que en el contado; la cuota no la incluye.
- Mientras paga, el sistema está alojado con Neri en una dirección propia del negocio. Al pagar la última cuota se
  entrega en el dominio del cliente, con el código y la base de datos. Después del año, la mensualidad de servicio del
  plan es opcional.
- Puede pagar el saldo completo cuando quiera, sin recargo. Si lo hace antes de la cuarta cuota, se le aplica el precio
  con promoción que estuviera vigente al firmar.
- Sus datos son suyos: puede descargarlos a Excel en cualquier momento, también si el servicio está pausado.
- Con dos cuotas vencidas el servicio se pausa; al ponerse al día se reactiva el mismo día. Es para negocios con local
  y RIF; el contrato es de una página, en español llano.
- Ejemplos de comercio (precio de lista → inicial + cuota, más la mensualidad del plan aparte): 2.500 → 625 + 12 ×
  156,25 (+ 100/mes); 4.000 → 1.000 + 12 × 250 (+ 130/mes); 6.200 → 1.550 + 12 × 387,50 (+ 170/mes). La cuota se
  muestra con dos decimales solo cuando no es entera (`money()` ya existe).
- Si deja de pagar del todo: tres meses en pausa terminan el contrato; lo pagado no se devuelve y el sistema no se
  entrega; los datos se pueden descargar hasta 90 días después (decisión de Claude, marcada en el archivo de
  condiciones).

Los planes de emprendimiento (`EXTRAS`) **no** llevan pago por partes (decisión 4).

## Pieza 1: `/para/`

- `precios.py` gana `partes(precio) -> (inicial, cuota)` y dos fragmentos: la **línea por plan** y el **bloque común**.
- **Línea por plan**: dentro de cada tarjeta de plan de los cinco rubros con partes (`plan_html` recibe un
  indicador; las tarjetas de cobros, integraciones, logística y `EXTRAS` no la llevan), debajo del precio y de la
  mensualidad, una línea pequeña: «**Por partes:** inicial de USD 625 y 12 cuotas de USD 156,25; la mensualidad de
  servicio va aparte». Va con el precio de lista aunque la promoción esté activa; la tarjeta ya muestra el precio de
  lista tachado, así que el lector entiende de dónde sale. El bloque `.plan-cambio` (USD 1.000 menos) dice que ese
  descuento es solo para el pago de una vez.
- **Bloque común** `#por-partes`, una vez por página de los cinco rubros con partes, debajo de la tabla de planes (antes de «Siempre incluido en el
  pago único»): título «Empiece ya y pague por partes», tres frases con las reglas de arriba, y un enlace «Cómo
  funciona el pago por partes» a `/por-partes`. En `body-index.html` (el índice de `/para/`) va el mismo bloque, escrito
  a mano como la banda de la promoción, debajo de la tabla comparativa.
- Cuando venza la promoción (enero de 2027), el contado y las partes quedan al mismo precio de lista; el texto de la
  promoción ya se esconde solo y la línea por partes no cambia. Anotar en el CLAUDE.md que en enero se revisa.
- Verificación: `verificar-sliders.py` sigue pasando; se agrega una prueba pura de `partes()` en
  `~/build-para/pruebas/` (inicial + 12 × cuota = precio de lista con tolerancia de un centavo).

## Pieza 2: `/empezar`

- Un **paso nuevo, `pago`**, entre `resultado` (hoy #5) y `datos` (hoy #6). La numeración del hash corre: `pago` #6,
  `datos` #7, `gracias` #8. `embudo.js`, `revision.test.cjs` y las demás pruebas que nombren `#6`/`#7` se actualizan.
- Pantalla: ojo «¿Cómo prefiere pagar?», título «Dos formas de empezar», dos opciones grandes (mismo componente `.op`
  que las preguntas, se elige tocando):
  1. **Empiezo hoy y pago por partes.** «Una inicial y cuotas mensuales fijas. Lo usa desde el primer día, alojado
     conmigo, y al pagar la última es suyo, en su dominio.»
  2. **Mi sistema propio, de una vez.** «Un solo pago, con la promoción de contado, instalado en su dominio desde el
     principio.»
  Debajo, en texto pequeño: «Las cifras de cada plan están en soluciones por negocio» con enlace a `/para/<rubro>`
  del rubro que respondió (o `/para/` si es «otro»). **Sin montos ni porcentajes en esta pantalla.**
- El paso se muestra para todos los rubros del embudo salvo `logistica` (que no tiene partes): ahí `ir()` salta de
  `resultado` a `datos` y `R.pago` queda vacío. Para `otro` se muestra, porque un sistema a la medida se aloja igual.
- La respuesta se guarda en `R.pago` (`'partes'` | `'propio'`) en `sessionStorage` `nc_embudo`, como las demás.
- `embudo-decidir.js`: la calificación (demo/diagnóstico) **no cambia** por la forma de pago. `resumenWhatsApp` agrega
  una línea «Prefiero pagar por partes» / «Prefiero pagar de una vez». `fraseResultado` no cambia.
- Envío: `respuestas` lleva la clave `pago` junto a `rubro, actual, objetivo, tamano, sistema`. No hay columna nueva
  ni migración: cabe en los 400 caracteres de `SolicitudWeb.respuestas`.
- Medición: evento `paso` con detalle `pago`, una vez por visita, al pintarse la pantalla (como `resultado` y `datos`).
- Preselección desde la landing: `/empezar?pago=partes` marca la opción 1 como elegida al llegar al paso `pago`
  (se muestra igual, con la opción resaltada; la persona confirma tocando o toca la otra). El parámetro se lee una
  vez al cargar y se guarda en `R.pago`; no se repite en el hash.
- **Origen de campaña**: la landing propaga su `?de=`/`utm_source` a los enlaces hacia `/empezar` con un script en
  línea mínimo (reescribe el `href` de los botones al cargar; el CSP permite `'unsafe-inline'`). Si `/empezar` llega
  sin `de` y el `document.referrer` es `/por-partes`, `origenEnlace()` devuelve `por-partes`. `clasificarOrigen` del
  panel reconoce `por-partes` como etiqueta propia.
- Si la persona vuelve atrás desde `datos`, cae en `pago` con su elección marcada (misma regla que los otros pasos).
- Portada estática y `--k`: sin cambios (CLS 0 se conserva).

## Pieza 3: la landing `/por-partes`

- Archivo `por-partes.html` en la raíz, URL limpia `/por-partes` (las reglas del `.htaccess` ya quitan el `.html` en la
  raíz). Alias de campaña: ninguno por ahora; los enlaces llevan `?de=tiktok`, `?de=whatsapp`, etc., que `medir.js` ya
  toma como origen.
- **Se genera**, no se escribe a mano: `build.py` acepta en `pages.json` una entrada con `"out": "/por-partes.html"`
  (salida fuera de `/para/`) y un cuerpo `body-por-partes.html`; las cifras entran por marcadores que `precios.py`
  rellena (`{{PARTES_TABLA}}`, `{{PARTES_REGLAS}}`). Así la landing y `/para/` nacen del mismo archivo.
- CSS: **propio** (`assets/css/por-partes.css`), con los tokens de `embudo.css` (sin `redesign.css`, sin Google Fonts;
  las fuentes alojadas de `fuentes.css`). Como `head.tpl` carga `redesign.css`, la landing usa una cabecera propia
  (`head-por-partes.tpl`) o `build.py` acepta una plantilla por página. JS: `medir.js`, `nera.js` y el script en
  línea que propaga el origen; sin animaciones.
- Estructura (todo de usted, en positivo):
  1. Hero: ojo «Pago por partes», titular «Empiece hoy con su sistema y páguelo mes a mes», subtítulo con la idea en
     dos frases, botón primario «Quiero empezar por partes» → `/empezar?pago=partes`, botón secundario «Ver cómo
     funciona» (ancla).
  2. «Cómo funciona», tres pasos: inicial y arranque; lo usa desde el primer día; al pagar la última, suyo.
  3. «Lo que incluye y lo que no»: tarjetas con las reglas (servicio del primer año incluido, alojado con Neri
     mientras paga, datos descargables, pausa a dos cuotas, pago adelantado sin recargo, entrega con código).
  4. «Cuánto es, por plan»: por cada uno de los cinco rubros con partes, un `<details>` (comercio abierto) con una
     tabla de tres filas: plan, precio de lista, inicial, cuota × 12, mensualidad de servicio aparte. Sin los planes de
     emprendimiento, cobros, integraciones ni logística (una línea dice que esos van por pago único o diagnóstico y
     enlaza a `/para/`). Sin la promoción de contado ni el descuento de USD 1.000 (una línea lo dice).
  5. «Para quién es»: negocio con local y RIF; cadenas y quien ya tiene otro sistema pagado van por diagnóstico.
  6. Párrafo honesto (clase `caso__honesto` o equivalente): «Para que lo sepa desde el principio: el sistema vive en mi
     servidor hasta la última cuota…».
  7. Cierre: el mismo botón primario, y el enlace de WhatsApp con texto «Hola Neri, vengo de la página de pago por
     partes. Mi negocio es: ».
- SEO: título, descripción, canonical `/por-partes`, OG propia `assets/img/og-por-partes.jpg` (desde
  `~/build-para/og-card-por-partes.html` con Chromium a 1200×630, como la de `/empezar`), JSON-LD `Service`,
  entrada en `sitemap.xml` y en `llms.txt`.
- `nera.py` y `medir.py` suman `por-partes.html` a sus páginas sueltas. `medir.js` reporta la ruta `/por-partes.html`.
- Verificación: `~/build-para/verificar-respuesta.py` **no aplica** (es para `/servicios/`); se agrega una prueba de
  publicación como `publicacion.test.cjs` de `/empezar` (200 por el dominio, canonical limpio, botón a
  `/empezar?pago=partes`, cifras iguales a las de `/para/comercio-y-tienda`), y Lighthouse móvil ≥ 90 como `/empezar`.

## Lo que acompaña

- **Panel de prospección** (`prospectos.neracosu.com`): `respuestasLegibles` etiqueta `pago` como «Forma de pago:
  por partes / de una vez»; `PASOS_EMBUDO` gana `{ id: "pago", nombre: "Eligieron forma de pago" }` entre `resultado`
  y `datos`; el correo de aviso (`src/lib/correo.ts`) dice la forma de pago en el asunto o la primera línea;
  `TarjetaSolicitud` la muestra como chip. Sin migración. Pruebas de `web-contrato` actualizadas.
- **Asistente de `/para/#asistente`** (`assets/js/asistente.js`): en los resultados de los cinco rubros con partes,
  una frase con las dos formas y enlace a `/por-partes`; en cobros, integraciones y logística, nada. Sin cifras nuevas.
- **Plantillas de propuestas del panel** (`plantillas/base/*.cuerpo.html` → `armar-plantillas.py`): una fila «Por
  partes: inicial USD X y 12 cuotas de USD Y» en la tabla de precios de cada plan de hoteles, hoteles-estadia,
  restaurantes-y-bares, comercio-y-tienda, farmacias (mismos precios que comercio), citas-y-servicios y reservas; no
  en cobros-y-pagos, cobros-y-pagos-co, comida-por-encargo ni tienda-por-instagram. Dos líneas en «Condiciones»
  (`condiciones.html`, solo en el bloque de Venezuela).
  `verificar-plantillas.mts` debe seguir en 9/10 hojas. Las cifras salen de las mismas de `/para/`, a mano, como ya
  están los precios.
- **Contrato de una página**: `~/propuestas/PLANTILLA-CUOTAS.md` (fuera del repo), redactado desde
  `~/propuestas/condiciones-pago-por-partes.md`.
- **CLAUDE.md** del sitio y del panel: dónde viven las cifras de partes y la regla de enero de 2027.
- **Respaldo previo**: `~/backups/por-partes-20261107/` con `/para/`, `empezar.html`, `assets/js/embudo*.js` y
  `precios.py`.

## Orden de construcción y verificación

1. `precios.py` + prueba de `partes()` → `build.py` con `out` → `/para/` regenerado (un build a la vez).
2. `/empezar`: paso `pago`, decidir, envío, medición, pruebas (`node --test --test-concurrency=1`).
3. Panel: contrato, correo, tarjeta, pruebas (`npm test` y `PROSPECTOS_TEST_DB=1 npm test`), despliegue con
   `npm run deploy`/`pm2 restart prospectos` según su CLAUDE.md (pausar el automático de correos antes).
4. Landing: cuerpo, CSS, OG, sitemap, llms, prueba de publicación, Lighthouse.
5. Asistente, plantillas, contrato, CLAUDE.md, memoria.
6. Recorrido final a 390 px: `/para/comercio-y-tienda`, `/empezar` completo por el camino de partes, `/por-partes`.

## Lo que queda al constructor

- Redondeo de las cuotas de los planes de emprendimiento (ver arriba).
- Diseño visual de la tabla por rubro en la landing y del `<details>`.
- Texto exacto de los chips y del correo del panel.
- Cómo `build.py` resuelve `out` sin romper `{{SLUG}}` ni `versionar-assets.py`.

## Decisiones tomadas por Claude (Neri puede cambiarlas)

- Nombre de la landing: `/por-partes`.
- La elección en `/empezar` se guarda dentro de `respuestas` (sin columna nueva).
- `/empezar?pago=partes` preselecciona pero no salta el paso.
- El paso `pago` no se muestra cuando el rubro es logística.
- Los datos se pueden descargar hasta 90 días después de terminado un contrato por falta de pago.
- El origen de campaña se propaga con un script en línea en la landing y con el `referrer` como respaldo.
- La promoción de contado no se aplica a las partes (regla del documento de condiciones).
