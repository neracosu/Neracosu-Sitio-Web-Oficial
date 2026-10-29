# Landing del embudo de captación: `/empezar`

Fecha: 2026-10-28. Estado: diseño para corregir, nada construido.

## Para qué

Tener una sola dirección corta para publicar en TikTok, grupos de WhatsApp y Facebook, Instagram y
respuestas de IA, que reciba a alguien que no conoce a NERACOSU y en un minuto le diga qué sistema le
conviene, le muestre uno real funcionando y le ofrezca el diagnóstico gratis y, si su caso califica,
una demostración con su marca. Que lo que responda quede guardado en el panel de prospección aunque la
persona no abra WhatsApp.

Por qué ahora: el 78 % de quien llega a la home se va sin tocar nada (medición de octubre), y lo único
que convirtió rápido en el mes fue un prototipo con la marca del prospecto. El diagnóstico gratis con
demostración ya está publicado en /para/ y en la home desde el 2026-10-28; esta landing es la puerta
pensada para tráfico frío.

Éxito (cifras mías, para comparar en el panel, no promesas): de cada 10 que abren, 3 terminan las cuatro
preguntas y 1 deja sus datos. Se mide desde el día uno en `prospectos.neracosu.com/web`.

## Lo que no es

- No es una página de precios. Ninguna cifra de proyecto: los precios siguen viviendo solo en /para/,
  y la landing enlaza allí.
- No promete demostración a todo el que escribe. La demostración es «si su caso califica», y la
  landing lo dice en esas palabras.
- No pide datos antes de dar algo. Primero la recomendación y la prueba; los datos al final.
- No lleva escasez inventada, contador de cupos, testimonios ni «últimas plazas». Tampoco llamadas:
  todo por escrito.
- No lleva IA, chat, login ni backend nuevo: se apoya en el panel de prospección que ya existe.
- No reemplaza al asistente de /para/#asistente ni a la calculadora; comparte sus reglas.

## Quién la abre y con qué promesa llega

Dueño o encargado de un negocio pequeño o mediano en Venezuela (o venezolano afuera), en el teléfono,
desde un video o un mensaje que le dijo algo como: «Responda cuatro preguntas en neracosu.com/empezar y
le digo qué sistema le conviene. Si su caso califica, le armo una demostración con su marca, gratis,
antes de que pague nada». La landing tiene que cumplir exactamente eso, ni más ni menos.

El enlace que se publica lleva el origen: `neracosu.com/empezar?de=tiktok` (también `de=whatsapp`,
`de=facebook`, `de=instagram`; `utm_source` sigue valiendo). Sin parámetro cuenta como directo.

## La idea que la hace distinta: la demostración empieza en la landing

Neri (2026-10-28): «el landing debe ser brutal, nada de web genérica hecha con IA, debe llamar la
atención, debe ser muy interactivo, navegación brutal». La respuesta a eso no es más animación
encima de una página normal: es que **la landing sea la primera demostración**.

En pantalla hay un teléfono (un marco dibujado en HTML y CSS, no una imagen) que **se va
convirtiendo en el sistema de la persona a medida que responde**:

- Al tocar un rubro en el paso 1, la pantalla del teléfono cambia al sistema de ese rubro: la
  recepción de un hotel con su calendario de habitaciones, la caja de un restaurante con mesas, la
  tienda con su catálogo, la agenda con profesionales. Con solo pasar el dedo por una opción ya se
  ve el cambio (vista previa al tocar o al pasar el cursor), antes de confirmar.
- En el paso 2, lo que la persona tiene hoy aparece dentro del teléfono tal como lo vive: chats de
  WhatsApp con capturas de pago sueltas, una hoja de cuaderno, un Excel. Al elegir, eso se barre y
  queda el sistema.
- En el paso 3, la función elegida **cobra vida** en el teléfono: si pide cobrar sin revisar el
  banco, el teléfono recorre solo el flujo real de la validación de pagos (datos → últimos seis
  dígitos → «Validando…» → «¡Pago exitoso!», el mismo recorrido que opera hoy en los sistemas en
  producción); si pide no perder reservas de noche, entra una reserva a las 2:14 a. m. con su cupo
  retenido; si pide ver su operación, aparece el panel con el día en números que suben.
- En el paso 4, el tamaño se nota: más habitaciones, más mesas, más sedes en el teléfono.
- Al final, el teléfono dice **«Su marca aquí»** y, cuando la persona escribe el nombre de su
  negocio en el formulario, el nombre aparece en vivo en la cabecera del sistema. Ese es el momento
  de la landing: ya está viendo su sistema con su nombre antes de tocar «Enviar».

Nada de esto es un video ni una imagen animada: son pantallas en HTML y CSS con transiciones, por
eso pueden llevar el nombre del negocio y por eso pesan poco.

### Navegación

- Cada paso ocupa la pantalla completa (altura del visor en el teléfono, sin desplazamiento): arriba
  el teléfono, abajo la pregunta y sus botones. En escritorio, teléfono a la derecha y pregunta a la
  izquierda, con mucho aire.
- **Se avanza tocando una opción; no hay botón «Siguiente».** Deslizar hacia la derecha vuelve
  atrás (gesto táctil); en escritorio, las flechas del teclado mueven entre opciones y Enter elige;
  los números 1 a 7 eligen directo. «Atrás» del navegador también vuelve un paso (el paso va en
  la dirección, `#2`).
- La pregunta entra deslizando desde la derecha y la anterior sale hacia la izquierda; el teléfono
  se queda fijo y solo cambia su pantalla. La barra de progreso es una línea verde finísima en el
  borde superior que crece; nada de «paso 2 de 4» en una cajita.
- Al elegir, una vibración corta en Android (`navigator.vibrate(12)`), nunca sonido.
- El resultado se escribe en pantalla letra a letra, rápido, como una consola (guiño al programa en
  Nera que lleva todo el sitio), y la captura real entra después, grande.
- Con `prefers-reduced-motion`, todo pasa sin transiciones y el teléfono cambia de golpe. Nada
  depende de la animación para entenderse.

### Lo que la hace no parecer «hecha con IA»

- Sin el patrón hero centrado + tres tarjetas + degradado de burbujas. La portada es tipográfica y
  asimétrica: el titular enorme en Plus Jakarta con una palabra en Instrument Serif cursiva verde,
  pegado al borde izquierdo, y el teléfono asomando por la derecha ya encendido con una pantalla
  real.
- Capturas de sistemas reales, no ilustraciones de stock ni iconos genéricos.
- Textos cortos, de usted, con la franqueza del sitio: donde algo no está construido, el teléfono
  lo muestra como «en construcción» y el texto lo dice.
- Un solo color de acento (el verde del sitio), fondo casi negro, grano sutil en el fondo, una sola
  familia de botones: los que ya tiene el sitio.

### El nivel: acabado de agencia de primer nivel, voz de NERACOSU

Neri (2026-10-28): «como agencia de gran nivel y prestigio». Se entiende como la vara de calidad
del acabado, no como un cambio de identidad: la marca sigue siendo NERACOSU y la voz sigue siendo la
de Neri en primera persona («le respondo yo, no un vendedor»). Lo que una agencia top haría distinto,
y aquí se exige:

- **Tipografía con jerarquía real.** Un titular enorme (entre 44 y 56 px en el teléfono, más de 96 en
  escritorio) con interletrado cerrado, un solo acento en cursiva, y el resto en dos tamaños, no
  cinco. Números con `font-variant-numeric: tabular-nums` en todo lo que cuenta.
- **Aire.** Márgenes generosos y una retícula fija de 8 px; nada pegado, nada centrado por defecto.
  La composición es asimétrica y se sostiene sin adornos.
- **Movimiento con intención.** Curvas de aceleración propias (una sola `cubic-bezier` para entrar,
  otra para salir), duraciones de 180 a 320 ms, y 60 cuadros por segundo en un teléfono de gama
  media: solo se animan `transform` y `opacity`. Nada rebota, nada flota porque sí.
- **Cero saltos de maquetación.** Las fuentes precargadas, los tamaños de las pantallas del
  teléfono fijos, el resultado reserva su espacio antes de escribirse. Desplazamiento acumulado
  (CLS) en cero.
- **Estados cuidados.** Cada botón tiene estado de foco visible, de pulsado y de deshabilitado; el
  envío muestra que está enviando; el error dice qué hacer. Teclado y lector de pantalla recorren
  todo (accesibilidad 100, como el resto del sitio).
- **Detalle de marca.** Grano fino en el fondo, el punto verde del logotipo como único ornamento,
  favicon y Open Graph propios de la landing (una tarjeta OG hecha para ella, con el teléfono
  encendido, generada como la del sitio con Chromium).
- **Texto de agencia.** Frases cortas, afirmaciones, sin relleno ni superlativos vacíos. La
  confianza está en mostrar el sistema, no en decir «líderes» ni «innovadores».
- **Prueba antes de publicar.** Lighthouse móvil por encima de 90 en rendimiento y 100 en
  accesibilidad; revisión en un teléfono real además del headless; capturas a 390, 768 y 1440 px.

## Recorrido (todo en una página, una pantalla por paso)

Cada paso cabe en una pantalla de 390 px sin desplazarse, con una sola pregunta, botones grandes
para tocar, barra de progreso («2 de 4»), botón «Volver» y sin campos de texto hasta el final.

### Portada

- Titular: **Le muestro cómo quedaría su sistema, con su marca, antes de que pague nada.**
- Debajo: «Cuatro preguntas, un minuto, sin dejar datos. Al final le digo qué le conviene y, si su
  caso califica, le armo una demostración con su nombre y sus productos para que la vea en su
  teléfono. Gratis.»
- Botón: **Empezar**. El teléfono de la portada ya está encendido y pasa solo, cada pocos segundos,
  por tres pantallas reales (hotel, tienda, validación de pago), para que se entienda sin leer.
- Tres líneas de respaldo, sin adornos: «26 plataformas en producción», «Pagos que se validan contra
  el banco, en operación hoy», «Todo por escrito: sin llamadas de ventas».

### Paso 1. ¿A qué se dedica su negocio?

Las mismas siete opciones del asistente de /para/ (servicios con cita, tienda o comercio, comida,
hospedaje, espacios y eventos, logística y carga, otra cosa), con sus ejemplos debajo. Se reutiliza
la lista tal cual: es la clasificación por arquetipos que ya funciona.

### Paso 2. ¿Cómo lo lleva hoy?

- Cuaderno, Excel y WhatsApp.
- Pago una mensualidad por un sistema.
- Tengo un sistema propio o comprado.
- **Tengo página o tienda en línea, pero los pagos los confirmo a mano.** (Nueva. Es el caso que más
  convirtió en octubre y el asistente de /para/ no lo distingue.)

### Paso 3. ¿Qué quiere lograr primero?

En positivo, cinco opciones como máximo:

- Cobrar sin revisar el banco a mano.
- No perder reservas ni pedidos, sobre todo de noche.
- Saber qué pasa en mi operación sin estar encima.
- Que mis sistemas se hablen entre sí.
- Vender en línea o que me encuentren en Google.

### Paso 4. ¿De qué tamaño es la operación?

Tres opciones (chica, mediana, grande), **con el ejemplo cambiado según el rubro del paso 1**: en
hospedaje se habla de habitaciones, en comida de mesas y pedidos al día, en comercio de locales y
ventas al día, en citas de profesionales, en espacios de canchas o salas. Es la pregunta que califica,
así que los ejemplos tienen que ser concretos. Los umbrales salen de los alcances ya publicados en
/para/ (p. ej. hasta 15 / 16 a 40 / más de 40 habitaciones).

### Resultado: «Lo que le conviene»

Se decide con las mismas reglas del asistente de /para/ (`decidir()` de `asistente.js`, reutilizada
o copiada con sus comentarios), más dos ajustes: la opción nueva del paso 2 («tienda en línea con
pagos a mano») manda a cobros y pagos si el rubro trae su tienda, y «vender en línea / Google» manda a
la página de comercio o a servicios web según el rubro.

La pantalla, en este orden:

1. Nombre del sistema recomendado y una frase de por qué, con las respuestas de la persona
   reflejadas («Para una tienda de ropa con dos locales que cobra a mano, lo primero es…»).
2. **Una captura real** de ese sistema funcionando, con pie de foto honesto («Plataforma de
   validación de pagos en operación en un complejo deportivo de Caracas»). Mapa de imágenes:
   hospedaje → PMS hotelero (anonimizado, sin nombre ni número de habitaciones); comercio → tienda en
   línea propia; comida → validación de pagos; espacios y eventos → reservas con pago validado;
   cobros → plataforma de validación de pagos; integraciones → panel interno de la plataforma de
   pagos; logística → plataforma de costado de buque («construida y en demostración»); citas →
   **sin captura** y con el texto de frente: la agenda por profesional se termina de construir con
   los primeros negocios; lo que ya existe es el calendario, el cupo retenido y el cobro validado.
   Todas las imágenes salen de `assets/img/portafolio/` que ya están publicadas en la home.
3. Tres líneas de «lo que ya existe y funciona» para ese sistema, tomadas de la página de /para/
   correspondiente.
4. Enlace discreto: «Ver los precios publicados de este sistema» → `/para/<slug>`. Una línea debajo,
   real: «Hasta el 31 de diciembre de 2026 el pago único tiene 40 % de descuento» (sale de la misma
   promoción de /para/; se esconde sola al vencer, como allá).
5. El remate, según califique:

   **Califica para demostración** (tamaño mediano o grande, o tiene página o tienda en línea con
   pagos a mano, sin importar el tamaño):
   > **¿Quiere verlo con su marca?** Le armo una demostración con su nombre y sus productos para que
   > la recorra en su teléfono, más el diagnóstico por escrito. Gratis, sin compromiso. Déjeme tres
   > datos y le escribo por WhatsApp.
   Botón: **Quiero ver mi demostración**.

   **No califica todavía** (operación chica que trabaja en cuaderno y WhatsApp, o rubro «otra cosa»
   con un objetivo que no encaja en nada construido):
   > **Le entrego el diagnóstico por escrito, gratis.** Reviso cómo trabaja hoy y le digo qué le
   > conviene, en qué orden y cuánto costaría cada fase. Si de ahí sale que no le hace falta un
   > sistema, se lo digo y le ahorro varios miles.
   Botón: **Quiero mi diagnóstico gratis**. Debajo, una línea: «Si prefiere un número ya, la
   calculadora se lo da en tres pasos» → `/calculadora`.

   En ninguno de los dos se dice «no califica» ni nada parecido. Lo que cambia es lo que se ofrece.

### Datos

Tres campos y el botón, nada más:

- Su nombre.
- ¿Dónde puedo ver su negocio? (Instagram, página web o dirección). Un solo campo libre.
- Su WhatsApp.
- Su correo (obligatorio desde el 2026-10-29, por decisión de Neri; antes no se pedía).

Más el campo trampa `sitio` oculto, como en el formulario de la home. Correo no se pide. Se envía al
panel (`POST /api/web/solicitud`) con `type: "embudo"`, las cuatro respuestas, la calificación, el
origen (`de`) y la sesión de medición. Si el panel no responde, se ofrece el botón de WhatsApp con el
resumen ya escrito, y nunca se dice «enviado» sin haberlo guardado (misma regla que la home).

### Gracias

> Listo, [nombre]. Le escribo por WhatsApp en menos de 24 horas hábiles con tres preguntas cortas
> sobre su negocio. El diagnóstico por escrito le llega en una semana. Si su caso califica para la
> demostración, se lo digo en ese primer mensaje, con la fecha.

Debajo: «Mientras tanto, esto es lo que hace el sistema que le recomendé» → `/para/<slug>`.

## Reglas de contenido (las del sitio, aplicadas aquí)

- Voz de usted, español de Venezuela llano, sin jerga. Honesto de frente: lo que no está construido
  se dice.
- Sin cifras de proyecto. La única cifra es «26 plataformas en producción» (la del sitio) y la
  promoción con su fecha real.
- ArmorPay se nombra «plataforma de validación de pagos». Hotel anonimizado y sin número de
  habitaciones. Proyectos de terceros que no se nombran, no se nombran.
- Nada de nombres de prospectos en la página ni en el repo (el repo es público).
- Sin emojis. Sin «¡Últimos cupos!». Sin llamadas.

## Medición

- `medir.js` expone `window.ncEvento(tipo, detalle)` y aprende el parámetro `de` como origen (además
  de `utm_source`).
- La landing manda un evento `paso` con detalle `p1`, `p2`, `p3`, `p4`, `resultado`, `datos`,
  `enviado`, una vez cada uno por visita.
- El panel acepta el tipo `paso` y en `/web` muestra el embudo de `/empezar` por origen: vistas →
  p1 → p4 → resultado → datos → enviado. Cada solicitud de tipo `embudo` muestra las cuatro
  respuestas y la calificación, y el correo de aviso también.

## Cómo se hace

**Sitio (repo `public_html`)**

- `empezar.html` en la raíz: la regla del `.htaccess` ya la sirve como `/empezar`. `/demo` hace 301
  a `/empezar` (para poder decir «neracosu.com/demo» en un video si conviene; la canónica es
  `/empezar`).
- `assets/js/embudo.js` (vanilla, sin librerías; estado en `sessionStorage` y paso en el `#hash`
  para que «atrás» del teléfono funcione) y `assets/css/embudo.css` sobre `redesign.css` y
  `nicho.css` (botones y tarjetas ya existen).
- Las pantallas del teléfono viven en `assets/js/embudo-pantallas.js` (plantillas HTML por rubro,
  estado y función) y su CSS en `embudo.css`. Son maquetas fieles de los sistemas reales (mismos
  colores y disposición que las capturas del portafolio), no copias de pantalla.
- Librerías (investigadas el 2026-10-28 a pedido de Neri, con la lista que le pasó un colega):
  **Atropos 2.0.2** (7 KB + 2 KB de CSS, eventos de puntero: ratón y táctil) para el teléfono en 3D
  por capas, con chips que flotan a distinta profundidad; **parallax.js 3.1.0** (17 KB, giroscopio
  en el teléfono, ratón en escritorio) para los fragmentos del fondo. **Se alojan en el sitio**
  (`assets/js/lib/`), no desde CDN: el CSP solo permite hojas de estilo propias. Descartadas:
  Skrollr (archivada), Stellar.js (jQuery, sin mantenimiento), Rellax (parallax de scroll; el
  embudo no se desplaza) y simpleParallax (su versión 7 es solo React). Alternativa a Atropos si
  hace falta giroscopio en el teléfono: vanilla-tilt 1.8.1 (9 KB). Presupuesto: menos de 30 KB de
  librerías, cargadas con `defer`. Siguen fuera GSAP, ScrollTrigger, Lenis y anime.js.
- Transiciones entre pasos con CSS; el flujo de pago y los contadores con la Web Animations API o
  `requestAnimationFrame`. En iOS el giroscopio pide permiso con un gesto: si no lo da, el fondo
  responde solo al toque, sin romper nada.
- **Boceto desechable** (2026-10-28) en `neracosu.com/boceto-empezar/` (carpeta ignorada por git,
  `noindex`, nada se envía): recorre los ocho pasos con el teléfono convirtiéndose, el flujo de
  pago, el aviso de reserva de madrugada y el nombre del negocio en vivo. Sirve para corregir
  textos, orden y sensación antes del plan; el código real se escribe desde cero.
- Mismo `<head>` que las páginas rápidas: fuentes alojadas, `canonical` sin `.html`, OG con la
  imagen del sitio, indexable. **Sin GSAP, ScrollTrigger, Lenis ni anime.js** (la página de
  optimización da 97 en móvil sin ellos; la home con ellos, 92-96).
- Después de crearla: `python3 ~/build-para/nera.py`, `python3 ~/build-para/medir.py` y
  `python3 ~/build-para/versionar-assets.py`.
- Revisión a 390 px con Chromium headless antes de publicar, y Lighthouse móvil por encima de 90.

**Panel (repo `prospectos.neracosu.com`, PM2 `prospectos`, puerto 3013)**

- `web-contrato.ts`: solicitud acepta `type: "embudo"`, `respuestas` (hasta seis claves cortas),
  `calificacion` y `origen`; `TIPOS_EVENTO` suma `paso` con su lista de detalles.
- `/web`: bloque del embudo y las respuestas en cada solicitud. Correo de aviso con las respuestas.
- Un solo build, nunca en paralelo con otro; `pm2 list` antes de reiniciar y el contador de
  reinicios sin subir.

**Orden sugerido:** panel primero (acepta los campos nuevos aunque nadie los mande), después la
landing, después la medición en `/web`. Así la landing nunca manda algo que el panel rechace.

## Lo que queda al constructor

- Los textos de los ejemplos del paso 4 por rubro (con los umbrales de /para/).
- La elección exacta de cada captura dentro de `assets/img/portafolio/` y sus pies de foto.
- Las tres líneas de «lo que ya existe» por sistema, copiadas de /para/.
- La forma del bloque del embudo en `/web`.
- El detalle de cada pantalla del teléfono por rubro, estado y función (fiel a los sistemas reales;
  pedir las capturas de referencia que ya existen antes de dibujar).
- Los tiempos de las transiciones (rápidas: entre 180 y 320 ms; el flujo de pago, unos 4 s).

## Decisiones que tomé yo (para que Neri las revise)

1. La dirección es `/empezar`, con `/demo` como alias en 301.
2. Cuatro preguntas, no cinco: el tamaño es la que califica; no se pregunta volumen de ventas.
3. Califica para demostración: mediano o grande, o quien ya vende en línea y cobra a mano. El
   resto recibe diagnóstico por escrito, con el mismo tono.
4. Sin precios en la landing; enlace a /para/ y una línea con la promoción real.
5. ~~Solo tres datos al final, sin correo.~~ Neri (2026-10-29): el correo es importante; son cuatro datos y el correo es obligatorio.
6. El parámetro de origen es `de=`, más corto que `utm_source` para dictarlo en un video.
7. Panel primero, landing después.
8. La interactividad es el teléfono que se convierte en su sistema y toma su nombre, no efectos
   de desplazamiento. Sin librerías de animación, para que siga dando más de 90 en móvil.
9. Sin sonido; vibración corta al elegir, solo en Android.
10. «Agencia de gran nivel» se aplica al acabado, no a la identidad: sigue siendo NERACOSU y la voz
    de Neri en primera persona.
