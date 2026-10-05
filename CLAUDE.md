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

## Plataformas en producción: 24

Desde el 2026-09-26 son **24** (antes 23): 21 encargos del portafolio más tres
productos propios en `#productos` (ArmorPay, Soporte Vipsoft y Atalaya Monitor
Server). El número vive en `index.html` (meta, OG, Twitter, contador
`data-counter="24"`, el texto del portafolio y la métrica de «Compruébelo»), `para/index.html` (y su fuente `build-para/body-index.html`),
`servicios/sistemas-de-gestion.html`, `build-para/seo.py` y la imagen
`assets/img/og-image.jpg`, que se renderiza desde `build-para/og-card.html`
con Chromium headless. Si cambia, cambia en todos.

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
página lo dice de frente y ofrece el diagnóstico de $250. **No ponerle una tabla
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
