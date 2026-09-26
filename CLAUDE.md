# neracosu.com — Notas para Claude

## Estructura

Sitio estático servido desde `/home/neracosu/public_html/`. La home (`index.html`) usa el rediseño 2026. Subdominios y subdirectorios (`/blog/`, `/calculadora.html`, `/servicios/`, `ameb.app/`, `zafraclic.com/`, `glotracol.neracosu.com/`, `ourstory.lat/`) son independientes — el rediseño solo toca la home.

## Reglas de la home

- HTML estático + CSS plano + JS vanilla. **Sin React, sin Babel-CDN, sin Tailwind.**
- **La calculadora (`/calculadora.html`) es central.** Aparece destacada en el nav (pill verde, posición 3 de 6), en el overlay móvil, y como primer item del footer en verde. No quitar ni mover sin avisar al dueño.
- **SEO preservado**: meta tags completos, OpenGraph, Twitter Card, hreflang, geo tags (La Guaira: 10.6031, -66.9354), canonical, y 2 bloques JSON-LD (`ProfessionalService` + `Person`). Mantener al editar el `<head>`.

Detalles de implementación, placeholders y cómo revertir: skill `home-neracosu`.

## Idioma

El dueño y todo el contenido público es en **español (Venezuela)**. Responder en español por defecto.

## Trayectoria: 17 años

Desde el 2026-09-12 el sitio dice **17 años** (antes «+15»), por decisión del
dueño. Aparece en `index.html` (meta, OG, Twitter, tarjeta del hero, descripción,
contador `data-counter="17"`, dos títulos), `hoja-de-vida.html` (meta, OG,
extracto, sección 06) y en las seis páginas de `/para/`. El pie de página pasó
de «desde 2011» a **«desde 2009»**, que es lo único coherente con 17 años.

⚠️ **Pendiente:** la línea de tiempo del CV arranca en **2011 — 2012 (LEFP
Consultores)**. Con 17 años quedan 2009–2011 sin respaldo visible. Si alguien
resta, ve el hueco. Hay que agregar esa entrada al CV o dejar el pie sin año.

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
`data-counter="24"`, el texto del portafolio, el título de capacidades y la
métrica del cierre), `para/index.html` (y su fuente `build-para/body-index.html`),
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

**`citas-y-servicios` no lleva precio cerrado, a propósito.** La agenda por
profesional es lo único del catálogo que **no está construido** (se verificó:
cero coincidencias de patrón de cita en los 5 proyectos). Lo que sí se reutiliza
es el calendario, el cupo retenido, el cobro validado y el personal con PIN. La
página lo dice de frente y ofrece el diagnóstico de $170. **No ponerle una tabla
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
