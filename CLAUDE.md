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

## Marca

La marca es **NERACOSU**, no «Neri.dev». El logotipo se escribe `NERACOSU` con
el punto final en verde (`#5ed29c`). Se corrigió el 2026-09-12 en `index.html`,
`hoja-de-vida.html` y `calculadora.html`; si aparece «NERI.DEV» en algún lado,
es un resto viejo.

## Páginas por nicho — `/para/`

Hay **ocho** landings por industria más su índice: `citas-y-servicios`,
`comercio-y-tienda`, `hoteles`, `restaurantes-y-bares`, `reservas`,
`cobros-y-pagos`, `logistica-y-aduana`, `integraciones-api-y-bots`.

Los rubros no son 24 páginas: son **arquetipos de sistema**. Una peluquería,
una odontología y un taller mecánico comparten el mismo sistema (cita con
profesional); una farmacia, una zapatería y una joyería comparten otro
(comercio con inventario). El asistente de `/para/#asistente` agrupa así en su
primera pregunta, con ejemplos debajo de cada opción.

**`citas-y-servicios` no lleva precio cerrado, a propósito.** La agenda por
profesional es lo único del catálogo que **no está construido** (se verificó:
cero coincidencias de patrón de cita en los 5 proyectos). Lo que sí se reutiliza
es el calendario, el cupo retenido, el cobro validado y el personal con PIN. La
página lo dice de frente y ofrece el diagnóstico de $170. **No ponerle una tabla
de precios sin construir primero ese módulo.**

**No se editan a mano.** Se ensamblan con `/home/neracosu/build-para/build.py`
(fuera del docroot); ver `build-para/LEEME.md`. Editar el `.html` de `/para/`
directamente se pierde en la próxima regeneración.

Estilos en `assets/css/nicho.css`, que extiende `redesign.css`. La home también
lo carga, para la sección `#industrias`.

### Reglas de contenido de estas páginas

- **Voz: tuteo**, español de Venezuela llano, sin jerga técnica de cara al
  cliente. El cierre honesto («si no te sirve, te lo digo yo primero») es parte
  del tono, no un adorno.
- **Las cifras son verificables o no van.** Cada número sale de leer el código
  o la operación real. Si no se puede sostener, se quita.
- **ArmorPay se nombra siempre «plataforma de validación de pagos»**, nunca
  «pasarela» ni «gateway»: el regulador usa esas palabras para una categoría
  con obligaciones. La regla viene del `CLAUDE.md` de `armorpay-cloud`.
- **ZafraClic y Gustito Xpress no se nombran** — son de un amigo. Sus
  capacidades se describen sin identificar el proyecto.
- **Hotel Marte va anonimizado** («un hotel de 12 habitaciones en Valencia,
  Carabobo», referencia a pedido), siguiendo el criterio del propio dueño.
- **Revisar siempre a 390 px de ancho**: la mayoría del tráfico es móvil.

## Piezas nuevas (2026-09-12)

| Archivo | Qué es |
|---|---|
| `assets/js/testimonios.js` | Testimonios. **Editar solo el array de arriba.** La sección se autooculta mientras esté vacío, así nunca se publica uno inventado. Guía para pedirlos: `~/build-para/COMO-PEDIR-TESTIMONIOS.md`. |
| `assets/js/asistente.js` | Asistente guiado de 4 preguntas en `/para/#asistente`. Sin IA ni backend: reglas en el navegador y salida a WhatsApp con el resumen. `NICHOS` es la única copia de los precios; si cambian en `/para/`, cambian ahí. |
| `assets/js/calc-fuga.js` | Sliders de las calculadoras de fuga: número grande, relleno de la pista y `aria-valuetext`. La **fórmula** de cada página sigue en su script propio. |
| `assets/css/nicho.css` | Estilos de todo lo anterior más planes, calculadoras y bloques de conversión. |

**Regla de los testimonios: no se inventa ninguno.** Si el cliente lo desmiente
cuesta más que no tener ninguno, y contradice el tono honesto del resto.

**Productos propios vs. encargos.** ArmorPay y Soporte Vipsoft salieron del
portafolio de clientes y tienen su bloque `#productos` en la home: los construyó
y los opera él. El portafolio de encargos quedó en 16; sumados dan las 18.

### Sliders de las calculadoras

Las calculadoras usan `<input type="range">` nativo, no una librería: HTML lo
hace mejor, es accesible de fábrica y pesa 0 KB.

**Trampa que ya costó una vez:** si el `value` no cae en la rejilla del `step`,
**el navegador lo redondea en silencio** y la cuenta da otro número. Pasó con
`cf-precio` (12.600 con `step="500"` → el navegador servía 12.500 y el
resultado bajaba de Bs 340.200 a Bs 337.500).

Antes de publicar un cambio de sliders, correr:

```bash
python3 /home/neracosu/build-para/verificar-sliders.py
```

Comprueba que cada `value` esté dentro del rango, que caiga en la rejilla del
`step` y que el recorrido no sea tan fino que no se pueda arrastrar.

### La calculadora principal

`/calculadora.html` es un asistente de 3 pasos, no un formulario de números.
Desde el 2026-09-12 el **nivel de complejidad** es un slider de 3 posiciones
(`calc__nivel-slider`) en vez de tres tarjetas en grid, que entre 480 y 768 px
quedaban apretadas y debajo ocupaban media pantalla. Los **adicionales siguen
siendo casillas**: son multi-selección y un slider no puede expresarlas.

La tarifa vive en `var TARIFA_HORA = 17` al principio de `calculator.js` y el
precio de cada opción se **deriva** de sus horas. Es la única fuente: cambiarla
ahí actualiza todo.

### Al regenerar precios

`precios.py` es **idempotente por secciones** (`secciones.py`), no por regex.
La versión con regex abarcaba de más: al reejecutarla dejaba la tabla de tres
años duplicada y se comía el bloque de entrada en 5 páginas. El bloque de
entrada de $170 vive **dentro** de la plantilla de `precios.py`, que es su única
fuente: no agregarlo por separado.

Orden seguro para republicar todo:

```bash
python3 /home/neracosu/build-para/precios.py
python3 /home/neracosu/build-para/verificar-sliders.py
python3 /home/neracosu/build-para/build.py
```

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
quedaran publicadas a la vez con precios distintos: la primera con el modelo
viejo (pago único, 90 días de garantía, tabla de costo a 3 años) y la segunda
con pago único más mensualidad. Un visitante podía caer en cualquiera.

- **`/servicios/`** describe capacidades por tecnología y **no cotiza**: manda a
  `/para/` y a la calculadora. La única cifra que conserva es el hosting a
  $8/mes, que es un servicio aparte y no contradice nada.
- **`/servicios/hoteles.html` ya no existe**: 301 a `/para/hoteles.html` desde
  el `.htaccess` de `servicios/`. El original quedó en
  `~/backups/web-20260912-072243/servicios-hoteles-original.html`.
- La **calculadora** deriva sus precios de `TARIFA_HORA`, así que también sale
  de la misma fuente.

**Antes de publicar una cifra nueva, preguntarse dónde más vive ese número.**
