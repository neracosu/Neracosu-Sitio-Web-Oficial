# neracosu.com — Notas para Claude

## Estructura

Sitio estático servido desde `/home/neracosu/public_html/`. La home (`index.html`) usa el rediseño 2026. Subdominios y subdirectorios (`/blog/`, `/calculadora.html`, `/servicios/`, `ameb.app/`, `zafraclic.com/`, `glotracol.neracosu.com/`, `ourstory.lat/`) son independientes — el rediseño solo toca la home.

## Reglas de la home

- HTML estático + CSS plano + JS vanilla. **Sin React, sin Babel-CDN, sin Tailwind.**
- **La calculadora (`/calculadora.html`) es central.** Aparece destacada en el nav (pill verde, posición 3 de 6), en el overlay móvil, y como primer item del footer en verde. No quitar ni mover sin avisar al dueño.
- **SEO preservado**: meta tags completos, OpenGraph, Twitter Card, hreflang, geo tags (La Guaira: 10.6031, -66.9354), canonical, y 2 bloques JSON-LD (`ProfessionalService` + `Person`). Mantener al editar el `<head>`.

Detalles de implementación y cómo revertir: skill `home-neracosu`.

**La home no cotiza** (desde el 2026-09-27): sin tablas ni cifras de proyecto,
solo enlaces a `/para/` y a la calculadora. Tampoco lleva estadísticas genéricas
de internet ni escasez inventada («3 cupos este mes»). Correo público:
**info@neracosu.com**. Foto de «Quién soy»: `assets/img/neri/neri-foto-*.webp`
(la real; el retrato con pantallas holográficas era generado).

## Idioma

El dueño y todo el contenido público es en **español (Venezuela)**. Responder en español por defecto.

## Trayectoria: 17 años

Desde el 2026-09-12 el sitio dice **17 años** (antes «+15»), por decisión del
dueño. Aparece en `index.html` (contador `data-counter="17"`, el título y el
primer párrafo de «Quién soy»), `hoja-de-vida.html` (meta, OG,
extracto, sección 06) y en las seis páginas de `/para/`. El pie de página pasó
de «desde 2011» a **«desde 2009»**, que es lo único coherente con 17 años.

La línea de tiempo del CV cubre 2009–2011 con «Desarrollo Web Independiente»
(desde el 2026-09-12), así que el «desde 2009» del pie tiene respaldo.

## `/atalaya/` se genera: no se edita aquí

La página de Atalaya Monitor Server y sus guías salen de `/opt/atalaya/site/`
(repo de root) con `node scripts/export-site.js`, que reemplaza la carpeta
entera. Un cambio hecho directo en `public_html/atalaya/` se pierde en el
próximo export: ya pasó el 2026-09-26. Cada HTML lo avisa en la línea 2. Desde
`neracosu` no hay permiso de escritura en `/opt/atalaya`: dejar un parche en
`~/` y pedírselo a la sesión de root.

## Plataformas en producción: 26

Desde el 2026-10-21 son **26** (antes 24; decisión del dueño): 21 encargos del portafolio más cinco
productos propios en `#productos` (ArmorPay, Soporte Vipsoft, Atalaya Monitor Server, Papel Cebolla y
Mishis, este último «en versión de prueba»). **Monte** va aparte, en el bloque `#laboratorio` debajo del
portafolio, y **no suma**: es cultural, con licencia no comercial (atribución a Urbano Monte y la David
Rumsey Map Collection siempre a la vista; no nombrar la presentación). **G&G Shopping no entra**: lo
desarrolló Moisés, Neri solo lo modernizó y lo puso en línea (dicho por el dueño, 2026-10-21). También
está en `hoja-de-vida.html` (fichas 10 y 11) y en el chiste de `nera.py` («devolver 26»). El número vive en `index.html` (meta, OG, Twitter, contador
`data-counter="24"`, el texto del portafolio y la métrica de «Compruébelo»), `para/index.html` (y su fuente `build-para/body-index.html`),
`servicios/sistemas-de-gestion.html`, `build-para/seo.py` y la imagen
`assets/img/og-image.jpg`, que se renderiza desde `build-para/og-card.html`
con Chromium headless. Si cambia, cambia en todos.

## Terrazas VIP Sport Park reabrió (2026-10-26)

Estuvo en pausa del 2026-10-06 al 23-oct. El 2026-10-26 Neri lanzó **Terrazas 2.0**: imagen nueva, web más
optimizada (igual que VIP Play) e integrada con las APIs de **INVU POS**. Se quitó el «en pausa» de la home y de
`/para/` (reservas, cobros-y-pagos, integraciones-api-y-bots, citas-y-servicios e índice) revirtiendo solo los
fragmentos de la pausa en `~/build-para/body-*.html` contra `~/backups/web-para-20261006-terrazas`; lo cambiado
después (26 plataformas, URLs sin .html) se conservó. Respaldo previo: `~/backups/urls-limpias-20261026/`.
Terrazas y VIP Play tienen validación automática de pagos y bot de WhatsApp (Neri, 2026-10-26).

## Marca

La marca es **NERACOSU**, no «Neri.dev». El logotipo se escribe `NERACOSU` con
el punto final en verde (`#5ed29c`). Se corrigió el 2026-09-12 en `index.html`,
`hoja-de-vida.html` y `calculadora.html`; si aparece «NERI.DEV» en algún lado,
es un resto viejo.

## Páginas por nicho — `/para/`

Hay **ocho** landings por industria más su índice: `citas-y-servicios`,
`comercio-y-tienda`, `hoteles`, `restaurantes-y-bares`, `reservas`,
`cobros-y-pagos`, `logistica-y-aduana`, `integraciones-api-y-bots`.

**Antes de editar o regenerar `/para/`, las calculadoras o `/calculadora.html`,
cargar la skill `para-neracosu`**: piezas JS/CSS, la trampa de los sliders
(`verificar-sliders.py`), `TARIFA_HORA` y el orden seguro de `precios.py` →
`build.py`.

**Desde el 2026-10-05 `citas-y-servicios` SÍ lleva precio cerrado** (decisión del dueño: «cada nicho ya debería ir
con un precio o 3 precios definidos»): Esencial hasta 3 profesionales $2.400, Profesional de 4 a 10 $3.800, Completo
más de 10 o varias sedes $5.700, con $100/$130/$170 al mes. La página sigue diciendo de frente que la agenda por
profesional se termina de construir con los primeros negocios, que el precio no se mueve y que lo que queda por
escrito es el plazo. El sistema completo de gimnasios va en `/para/cobros-y-pagos.html` a los mismos tres precios
(hasta 150, hasta 500, más de 500 alumnos). Lo que sigue es la regla anterior, que ya no rige:
~~`citas-y-servicios` no lleva precio cerrado, a propósito.~~ La agenda por
profesional es lo único del catálogo que **no está construido** (se verificó:
cero coincidencias de patrón de cita en los 5 proyectos). Lo que sí se reutiliza
es el calendario, el cupo retenido, el cobro validado y el personal con PIN. La
página lo dice de frente y ofrece el diagnóstico (gratis desde el 2026-10-28; antes $250). **No ponerle una tabla
de precios sin construir primero ese módulo.**

**No se editan a mano.** Se ensamblan con `/home/neracosu/build-para/build.py`
(fuera del docroot); ver `build-para/LEEME.md`. Editar el `.html` de `/para/`
directamente se pierde en la próxima regeneración.

### Reglas de contenido de estas páginas

- **Voz: usted** (desde el 2026-09-12, commit 38ead1d; antes era tuteo),
  español de Venezuela llano, sin jerga técnica de cara al cliente y sin
  órdenes. El cierre honesto («se lo digo de una vez») es parte del tono, no
  un adorno.
- **Las cifras son verificables o no van.** Cada número sale de leer el código
  o la operación real. Si no se puede sostener, se quita.
- **ArmorPay se nombra siempre «plataforma de validación de pagos»**, nunca
  «pasarela» ni «gateway»: el regulador usa esas palabras para una categoría
  con obligaciones. La regla viene del `CLAUDE.md` de `armorpay-cloud`.
- **ZafraClic y Gustito Xpress no se nombran** — son de un amigo. Sus
  capacidades se describen sin identificar el proyecto.
- **Hotel Marte va anonimizado** («un hotel de alta rotación en Valencia,
  Carabobo», referencia a pedido), siguiendo el criterio del propio dueño.
  **Sin el número de habitaciones** (Neri, 2026-09-16: «da la impresión que
  estoy iniciando con esto»). Para decir dónde funciona: «Mis sistemas funcionan
  hoy en empresas de Caracas, Valencia y el exterior». No afirmar que el sistema
  de hoteles corre en varias partes del país: hoy es un solo hotel.
- **Revisar siempre a 390 px de ancho**: la mayoría del tráfico es móvil.

**Regla de los testimonios: no se inventa ninguno.** Si el cliente lo desmiente
cuesta más que no tener ninguno, y contradice el tono honesto del resto.
`assets/js/testimonios.js` se autooculta mientras su array esté vacío.

## ⚠️ Dos trampas del servidor que ya tumbaron el sitio

### 1. El grupo de `public_html` es `nobody`, no `neracosu`

```
drwxr-x--- neracosu:nobody 750  public_html/
```

Apache corre como `nobody` y **entra al sitio por el grupo**. Un
`chown -R neracosu:neracosu .` dentro del docroot le cambia el grupo al
directorio raíz y **todo el sitio pasa a 403 al instante** — pasó el
2026-09-12.

Los archivos de adentro sí van `neracosu:neracosu`. El que no se toca es el
directorio `public_html` en sí. Si hace falta corregir permisos:

```bash
chown -R neracosu:neracosu /home/neracosu/public_html/<subdirectorio>
chown neracosu:nobody /home/neracosu/public_html   # restaurar el raíz
chmod 750 /home/neracosu/public_html
```

### 2. El HTML no se cachea; los assets sí, pero con sello

`ExpiresDefault "access plus 1 month"` le estaba aplicando **30 días de caché
al HTML**: quien ya había visitado el sitio no veía ningún cambio, por mucho que
se publicara. Corregido con `ExpiresByType text/html "access plus 0 seconds"`
más un `Cache-Control: no-cache` por `mod_headers`.

El CSS y el JS siguen a un año, pero las páginas los piden con
`?v=<hash del contenido>`. Ese sello lo pone
`~/build-para/versionar-assets.py`, que **`build.py` ya ejecuta al terminar**.
Si tocas un asset fuera del build, córrelo a mano o el cambio no le llega a
quien ya visitó el sitio.

## El código fuente empieza con un programa en «Nera» (broma, desde 2026-10-05)

Al abrir Ctrl+U en cualquier página propia, antes del `<!DOCTYPE>` hay un
comentario HTML con un programa en Nera 0.3.1 «Arepa Estable», un lenguaje que
no existe, seguido de 60 líneas en blanco. Es una broma para quien husmee; el
dueño la pidió **con la condición de no afectar el SEO**, así que:

- **El HTML real no se toca.** Solo se antepone el comentario y se agrega
  `assets/js/nera.js` antes de `</body>` (habla en la consola de F12 y define
  `window.nera`). Nada se minifica ni se reordena.
- Lo pone `~/build-para/nera.py`, que **`build.py` ya corre** antes de
  `versionar-assets.py`. Es idempotente: reemplaza todo lo que haya antes del
  `<!DOCTYPE>`. Para cambiar el texto, editá `PROGRAMA` y `ADVERTENCIAS` ahí.
- **Dentro del comentario no puede ir `--`**: cierra el comentario y el HTML
  se desarma. El script lo asevera y se niega a escribir.
- El `.htaccess` manda **`AddDefaultCharset UTF-8`** para neracosu.com porque
  el comentario saca el `<meta charset>` de los primeros 1024 bytes, que es lo
  único que el navegador revisa antes de decidir la codificación. **No lo
  quites**: los acentos saldrían mal.
- Al crear una página nueva fuera de `/para/` (blog, servicios), correr
  `python3 ~/build-para/nera.py` para que la lleve también.

## Los precios viven en un solo sitio

`/para/` es el **único** lugar del sitio con cifras de proyecto. Se decidió el
2026-09-12, después de que `/servicios/hoteles.html` y `/para/hoteles.html`
quedaran publicadas a la vez con precios distintos. Un visitante podía caer en
cualquiera.

- **`/servicios/`** describe capacidades por tecnología y **no cotiza**: manda a
  `/para/` y a la calculadora. La única cifra que conserva es el hosting a
  $8/mes, que es un servicio aparte y no contradice nada.
- **`/servicios/hoteles.html` ya no existe** (301 a `/para/hoteles.html`).
- Copias que hay que mantener en sintonía: `NICHOS` en `assets/js/asistente.js`
  repite los precios de `/para/`; la calculadora deriva los suyos de
  `TARIFA_HORA` en `calculator.js`.

**Antes de publicar una cifra nueva, preguntarse dónde más vive ese número.**

## Diagnóstico gratis y demostración con su marca (desde el 2026-10-28)

El diagnóstico técnico **ya no cuesta $250: es gratis**, y viene con la oferta de una demostración con la marca y
los productos del prospecto «cuando el caso lo permite» (decisión del dueño tras el prototipo de una tienda que
convirtió en dos días). Vive en el bloque `.entrada` de las nueve páginas de `/para/` (plantilla de
`~/build-para/precios.py` y `body-index.html`, con botón a `/empezar` desde el 2026-10-29; antes a WhatsApp), en la tercera tarjeta de «Tres formas de
empezar» de la home, en el resultado «Diagnóstico primero» de `assets/js/asistente.js` y en las plantillas de
propuestas de `prospectos.neracosu.com/plantillas/` (casilla «Diagnóstico · gratis» y el destacado «¿Prefiere
empezar pequeño?»). **No volver a ponerle precio en un sitio sin cambiarlo en los otros tres.** La demostración se
ofrece «según el caso» a propósito: no es para todo el que escribe, se arma cuando el prospecto ya contó su
negocio y confirmó que la quiere. Respaldo de antes: `~/backups/diagnostico-gratis-20261028/`.

## Embudo `/empezar` (desde el 2026-10-29)

Landing para campañas (TikTok, grupos, redes): `neracosu.com/empezar` (alias `/demo`, 301; el enlace de campaña lleva
`?de=tiktok`, `?de=whatsapp`, etc., que `medir.js` toma como origen antes que `utm_source`). Cuatro preguntas con un
teléfono dibujado en HTML que se convierte en el sistema del visitante, recomendación con captura real, remate según
califique (mediano/grande o quien vende en línea y cobra a mano → «Quiero ver mi demostración»; el resto → diagnóstico
gratis) y cuatro datos (negocio, dónde verlo, WhatsApp y correo, todos menos «dónde verlo» obligatorios) que van al panel (`type: "embudo"`, respuestas, calificación, origen) con respaldo de WhatsApp si el
panel no responde. Sin cifras de proyecto: enlaza a `/para/`. Diseño: `docs/superpowers/specs/2026-10-28-embudo-empezar-design.md`;
plan: `docs/superpowers/plans/2026-10-28-embudo-empezar-landing.md`.

- Archivos: `empezar.html` (la portada va estática en el HTML y el `--k` del teléfono se calcula en línea en el `<head>`:
  así el CLS es 0), `assets/js/embudo-decidir.js` (reglas puras, se prueban en Node), `assets/js/embudo-pantallas.js`
  (pantallas y efectos del teléfono), `assets/js/embudo.js` (motor: pasos en el hash, respuestas en `sessionStorage`
  `nc_embudo`, envío, medición), `assets/css/embudo.css` (**con sus propios tokens: no carga `redesign.css`**, que
  costaba 790 ms bloqueantes). Librerías alojadas en `assets/js/lib/` y `assets/css/lib/` (Atropos 2.0.2, parallax.js
  3.1.0): el CSP no permite CSS desde CDN.
- **Pruebas:** `~/build-para/pruebas/embudo/` con `node --test --test-concurrency=1` (de a uno: cada archivo levanta
  `python3 -m http.server` en 8098 sirviendo `public_html`). `publicacion.test.cjs` pega contra el dominio.
- Medición: la ruta se reporta `/empezar.html`; eventos `paso` (`p1`..`p4`, `resultado`, `datos`, `enviado`) una vez
  por visita; se ven en `prospectos.neracosu.com/web`, bloque «Embudo de /empezar».
- `nera.py` y `medir.py` ya la incluyen. Tarjeta OG propia: `assets/img/og-empezar.jpg`, desde
  `~/build-para/og-card-empezar.html` con Chromium a 1200×630.
- Lighthouse móvil 29-oct: rendimiento 96-97, accesibilidad 100 (queda HTTP/2, que es del servidor).
- **Textos de cara al cliente en positivo:** nada de «sin llamadas» ni «todo por escrito» (Neri: «suena feo»); se dice
  «Le respondo yo por WhatsApp, en menos de 24 horas hábiles».

## Vocabulario y calculadoras de `/para/` (desde el 2026-10-05)

- **Las calculadoras de fuga van en dólares**: el campo de precio (ticket, bloque, cita, hora de trabajo) se
  pregunta en USD (`data-formato="usd"`) y la pérdida sale en USD. Los montos en bolívares envejecían con la
  inflación y no cuadraban con precios en USD. Las propuestas del panel de prospección repiten los mismos ejemplos.
- La cinta del plan destacado dice **«El que recomiendo»**, no «El más pedido» (no se podía sostener).
- El pago único se llama **«pago único»** o **«adaptación»**, no «desarrollo», donde se adapta un sistema que ya
  existe. Las mismas palabras van en `prospectos.neracosu.com/plantillas/`: si cambian aquí, cambian allá.
- **Temporada promocional (decisión del dueño, 2026-10-05): 40 % de descuento en el pago único de cualquier plan
  para quien contrate hasta el 31 de diciembre de 2026.** La mensualidad no cambia y no se suma a otros descuentos.
  Sale de `PROMO_PCT` y `PROMO_HASTA` en `~/build-para/precios.py` (banda `.promo-banda` y precio de lista tachado en
  cada tarjeta) y de la banda escrita a mano en `body-index.html`. Un script de la banda la esconde al vencer, pero
  **en enero de 2027 hay que quitarla de las fuentes**. No es escasez inventada: tiene fecha real y la fijó el dueño.
  La home todavía no la menciona.

## Medición propia y formulario (desde el 2026-10-21)

El sitio no tiene Google Analytics. Mide con `assets/js/medir.js`, que manda vistas, clics (WhatsApp,
calculadora, `/para/`, correo, teléfono) y hasta dónde se baja en la home al panel de prospección
(`prospectos.neracosu.com/api/web/evento`); se ve en `prospectos.neracosu.com/web`. Sin cookies ni IP.
Lo pone `~/build-para/medir.py` en las mismas páginas que `nera.py` (`build.py` ya lo corre). `?nomedir=1`
en cualquier página deja de contar ese navegador; `?medir=1` lo deshace.

**El formulario de contacto de la home ya no abre WhatsApp**: manda la solicitud a
`prospectos.neracosu.com/api/web/solicitud`, que la guarda y avisa a info@neracosu.com. Si el panel no
responde, ofrece un botón de WhatsApp con el texto listo (nunca dice «enviado» sin haberlo guardado).
Por eso la CSP del `.htaccess` lleva `connect-src https://prospectos.neracosu.com`: **no quitarlo**.

**El `.htaccess` responde 410** a `/view/item/`, `/shop/pg/` y `/merchandises/detail/` (basura del hackeo
de agosto que Google seguía pidiendo: el 99 % de sus visitas de octubre). Solo para neracosu.com.

El hero ya no anuncia Atalaya: el aviso de arriba y el segundo botón llevan a `/para/` (21-oct, tras ver
que el 78 % se iba de la home sin abrir otra página y casi nadie llegaba a los precios).

## Velocidad (PageSpeed, 2026-10-21)

Las fuentes (Inter, Plus Jakarta Sans, Instrument Serif) **se alojan aquí**: `assets/fonts/*.woff2` (solo latin y
latin-ext, nombre con hash) y `assets/css/fuentes.css`. **No volver a enlazar Google Fonts**: bloqueaba la primera
pintura ~0,8 s. La plantilla de `/para/` (`~/build-para/head.tpl`) ya va así; la home precarga además las dos fuentes
del titular. El `.htaccess` comprime `text/javascript` (Apache manda el JS con ese tipo, no `application/javascript`) y
le da un año de caché al JS de `/assets/` solo en neracosu.com. Resultado en teléfono con Lighthouse: rendimiento
85 → 92-96, accesibilidad 93 → 100. Lo que queda: HTTP/2 (configuración del servidor, solo root) y anime.js desde
jsDelivr con código que no se usa.

En `/para/` (mismo día): la plantilla precarga también la cursiva del titular (sin eso, cobros-y-pagos saltaba
0,355 de CLS al llegar la fuente), el menú móvil va con `inert` mientras está cerrado (`redesign.js` lo quita al
abrir y cierra con Escape), los títulos de las notas de precio son `h3` (en `precios.py`) y los enlaces dentro del
texto van subrayados. Accesibilidad 100 en las nueve; rendimiento 85-97 según la corrida (el servidor compartido
mete ruido en el «tiempo de bloqueo»).

## Servicio de optimización web y SEO (desde el 2026-10-21)

`/servicios/optimizacion-web-y-seo.html`, con tarjeta en `#servicios` de la home y en `/servicios/`. **Sin precio**
(regla de `/servicios/`): diagnóstico y cotización por escrito. El caso real es este mismo sitio: capturas de
PageSpeed Insights de Google del 21-oct-2026 (6:39 → 6:54, móvil 83 → 95, accesibilidad 93 → 100; escritorio 100)
en `assets/img/servicios/pagespeed-*` (completa para escritorio y `-puntajes` para teléfono). Informes:
`pagespeed.web.dev/analysis/https-neracosu-com/s1tb144mb0` (antes) y `/7texqnh6hw` (después). **No decir en la
página que el sitio fue hackeado** (se vende ciberseguridad): las URL basura van como «direcciones viejas».
Esa página **no carga GSAP, ScrollTrigger, Lenis ni anime.js** (con ellos daba 67 en móvil; sin ellos, 97). El resto
de `/servicios/` y `/blog/` todavía los carga.

## URLs sin .html (desde el 2026-10-26)

neracosu.com publica sus páginas propias (raíz, `/para/`, `/servicios/`, `/blog/`) **sin `.html`**:
`/calculadora`, `/para/hoteles`, `/servicios/pago-movil-en-shopify`. Los archivos siguen llamándose `.html`.
Las reglas están en el `.htaccess` raíz (solo para neracosu.com): la dirección vieja da 301 a la limpia y la
limpia sirve el archivo. Respaldo de antes del cambio: `~/backups/urls-limpias-20261026/`.

- **Enlaces, `canonical`, `og:url`, hreflang, JSON-LD, sitemap y `llms.txt` van sin `.html`.** Un enlace con
  `.html` funciona (301), pero le cuesta un salto a cada visita y a Google.
- `/para/`: `build.py` pone `{{SLUG}}` sin `.html` (el archivo de salida sí lo lleva).
- **Ninguna subcarpeta de esas cuatro puede tener su propio `RewriteEngine On`**: anula las reglas de la raíz
  en esa carpeta. Por eso la 301 de `/servicios/hoteles` pasó al `.htaccess` raíz.
- `medir.js` sigue reportando la ruta con `.html` (`/calculadora.html`) para que el panel de prospección y lo
  medido antes cuadren.
- Páginas de respuesta nuevas: `~/build-para/verificar-respuesta.py` exige el canonical sin `.html`.
