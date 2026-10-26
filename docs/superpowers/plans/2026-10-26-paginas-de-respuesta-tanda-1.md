# Páginas de respuesta, tanda 1 · Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar `/servicios/pago-movil-en-shopify.html` y dejar montada la infraestructura común (verificador, enlaces desde la página madre y el índice, `llms.txt`, sitemap) que repetirán las tandas 2 a 6.

**Architecture:** HTML estático escrito a mano en `public_html/servicios/`, con la estructura y los CSS de `servicios/optimizacion-web-y-seo.html` y sin scripts de animación. Un verificador en Python (`~/build-para/verificar-respuesta.py`) hace de prueba: revisa cada página contra las reglas del sitio y, con Playwright, que no haya desborde horizontal a 390 px. Los scripts existentes de `build-para` ponen la broma de Nera, la medición y el sello de los assets.

**Tech Stack:** HTML + CSS del sitio, Python 3 (stdlib), Playwright de `/home/neracosu/public_html/hotelmarte.neracosu.com/node_modules/playwright`.

**Spec:** `docs/superpowers/specs/2026-10-26-paginas-de-respuesta-design.md`

## Global Constraints

- Sin precios propios en `/servicios/`. Sin cifras de terceros (comisiones): se enlaza su página oficial de precios.
- Voz de usted, español llano. Las páginas de Venezuela (1, 2, 3) pueden usar «bolívares», «Pago Móvil» y «tasa BCV».
- ArmorPay se nombra «plataforma de validación de pagos». «Pasarela» solo en lo que el cliente busca, nunca para ArmorPay.
- La conexión con Shopify **no está construida**: la página explica el método. No dice que ya corre en una tienda. No nombra al prospecto.
- Validación automática hoy: VIP Play (vipplaysportbar.com) y Terrazas VIP (terrazasvip.com). Bancos: Banco de Venezuela, Banco del Tesoro y Banco Digital de los Trabajadores. Valida Pago Móvil y C2P, no transferencias.
- Nada de GSAP, ScrollTrigger, Lenis ni anime.js. Nada de `fonts.googleapis.com`.
- `<head>` completo: title, description, canonical, OG, Twitter Card, hreflang, geo de La Guaira (10.6031, -66.9354), JSON-LD `Service` + `FAQPage`.
- Página 1 es de Venezuela: `og:locale` `es_VE`; `hreflang` `es-VE` y `x-default`.
- Botones de WhatsApp a `https://wa.me/584222707095?text=` con texto que nombra el tema: «Hola Neri, vengo de la página de Pago Móvil en Shopify».
- No usar `--` dentro de comentarios HTML (rompe el comentario de Nera).
- Un build a la vez. Ningún subagente corre `build.py` de `/para/`; este plan no lo necesita.

## Review Focus

- **Un teléfono de 390 px con tablas o bloques de código anchos:** la página no debe desbordar a lo ancho. → prueba `desborde_390` en la Tarea 1, corrida en la Tarea 2.
- **Alguien que copia el texto a una IA o lo lee un buscador sin CSS:** la respuesta tiene que estar en el primer `<p>` después del `<h1>`. → chequeo `respuesta_al_inicio` en la Tarea 1.
- **Un visitante que entra a `/servicios/pasarelas-de-pago.html`:** debe encontrar el enlace a la página nueva sin bajar hasta el pie. → chequeo de enlace en la Tarea 3.
- **Volver a correr `nera.py` o `medir.py`:** no deben duplicar el comentario ni el script. → la Tarea 4 los corre dos veces y compara.
- **Un navegador que ya visitó el sitio:** debe recibir el CSS nuevo si se tocó (sello `?v=`). → la Tarea 4 corre `versionar-assets.py` y el verificador comprueba que todo `assets/` lleva `?v=`.

---

### Task 1: Verificador de páginas de respuesta

**Files:**
- Create: `/home/neracosu/build-para/verificar-respuesta.py`

**Interfaces:**
- Produces: `python3 ~/build-para/verificar-respuesta.py <ruta.html> [--pais VE|LATAM]` → imprime una línea `OK`/`FALLA` por chequeo, sale con código 0 solo si todo pasa. Las tandas 2 a 6 lo reutilizan.

- [ ] **Step 1: Escribir los chequeos como funciones `chk_<nombre>(html: str, ruta: Path) -> str | None`** (None = pasa; texto = motivo de falla):
  - `titulo`: hay `<title>` de 30 a 65 caracteres.
  - `descripcion`: `meta name="description"` de 70 a 160 caracteres.
  - `canonical`: `link rel="canonical"` igual a `https://neracosu.com/servicios/<archivo>`.
  - `og_twitter`: `og:title`, `og:description`, `og:url`, `og:image`, `twitter:card`.
  - `locale`: con `--pais VE`, `og:locale` = `es_VE` y `hreflang="es-VE"`; con `LATAM`, `es_LA` y `hreflang="es-419"`. Siempre `hreflang="x-default"`.
  - `geo`: `geo.position` contiene `10.6031;-66.9354`.
  - `jsonld`: cada `application/ld+json` parsea con `json.loads`; entre ellos hay `@type` `Service` y `FAQPage`.
  - `sin_animacion`: el HTML no contiene `gsap`, `ScrollTrigger`, `lenis` ni `anime`.
  - `sin_google_fonts`: no contiene `fonts.googleapis.com`.
  - `sin_precios`: fuera de los JSON-LD, no hay `$` ni `USD` seguidos de un número.
  - `armorpay`: ninguna oración (separada por `.`) contiene a la vez «ArmorPay» o «plataforma de validación» y «pasarela».
  - `respuesta_al_inicio`: el primer `<p>` después del `<h1>` tiene al menos 25 palabras.
  - `whatsapp`: hay al menos 2 enlaces `wa.me/584222707095?text=`.
  - `nera_y_medir`: empieza con `<!--` antes del `<!DOCTYPE` y carga `nera.js` y `medir.js`.
  - `sellos`: todo `href`/`src` a `/assets/` termina en `?v=<hex>`.
  - `sitemap`: `public_html/sitemap.xml` contiene la URL canónica.
  - `desborde_390`: con Playwright (vía `node -e`, viewport 390×844, `file://` no: usar `https://neracosu.com/servicios/<archivo>` si responde 200, si no la ruta local con `file://`), `document.documentElement.scrollWidth <= 390`.

- [ ] **Step 2: Correr contra una página que no existe y contra la página modelo**

Run: `python3 ~/build-para/verificar-respuesta.py public_html/servicios/pago-movil-en-shopify.html --pais VE`
Expected: sale con código distinto de 0 y dice que el archivo no existe.

Run: `python3 ~/build-para/verificar-respuesta.py public_html/servicios/optimizacion-web-y-seo.html --pais VE`
Expected: FALLA en `locale` (no tiene hreflang) y en `jsonld`/`whatsapp` si aplica; OK en `sin_animacion`, `sin_google_fonts`, `nera_y_medir`, `sellos`, `sitemap`, `desborde_390`. Esto prueba que los chequeos distinguen.

- [ ] **Step 3: Sin commit** (`build-para` no tiene git). Copiar a `~/backups/build-para-20261026/` como respaldo.

### Task 2: La página `servicios/pago-movil-en-shopify.html`

**Files:**
- Create: `/home/neracosu/public_html/servicios/pago-movil-en-shopify.html`

**Interfaces:**
- Consumes: el verificador de la Tarea 1.
- Produces: la URL `https://neracosu.com/servicios/pago-movil-en-shopify.html`, que enlazan las Tareas 3 y 4.

- [ ] **Step 1: Correr el verificador sobre la ruta** → falla porque no existe.

- [ ] **Step 2: Escribir la página** partiendo de `servicios/optimizacion-web-y-seo.html` (mismos CSS y `main.js`, sin el bloque de Nera ni `nera.js`/`medir.js`, que los ponen los scripts). Contenido, en este orden:
  1. `h1`: «Cómo cobrar con Pago Móvil en su tienda Shopify».
  2. Primer párrafo, la respuesta: Shopify no trabaja con bancos venezolanos dentro de su caja de pago; la forma de cobrar es dejar Pago Móvil como pago manual y conectar aparte una validación que confirma el pago y marca el pedido como pagado en Shopify.
  3. Paso a paso (4 pasos, los de la propuesta): el cliente elige Pago Móvil en la caja; ve el monto en bolívares a la tasa BCV en la confirmación y el correo, con «Reportar mi pago»; el pago se confirma (solo, con cuenta jurídica en BDV, Tesoro o BDT; con otros bancos, con un toque); Shopify marca el pedido como pagado.
  4. «Lo que Shopify no permite», de frente: tarjetas nacionales dentro de la caja; Shopify Payments (con Stripe) solo con empresa en EE. UU. y para tarjetas internacionales; transferencias y Zelle siempre con confirmación manual; C2P como lo más cercano a débito.
  5. «Dónde funciona hoy la validación»: VIP Play y Terrazas VIP, con enlace a cada sitio. Una línea honesta: la conexión con Shopify se arma para cada tienda.
  6. Preguntas frecuentes (5 a 7), las mismas en el JSON-LD `FAQPage`: ¿tengo que cambiar de plan de Shopify?, ¿el dinero pasa por ustedes?, ¿sirve con mi banco?, ¿y Zelle?, ¿y Cashea?, ¿cuánto cuesta? (sin cifra: enlace a `/para/cobros-y-pagos.html` y a la calculadora).
  7. Cierre con WhatsApp (texto «Hola Neri, vengo de la página de Pago Móvil en Shopify») y enlace a `/servicios/pasarelas-de-pago.html`.

- [ ] **Step 3: Correr el verificador** → solo pueden fallar `nera_y_medir`, `sellos` y `sitemap` (se resuelven en las Tareas 3 y 4).

- [ ] **Step 4: Captura a 390 px** con Playwright y mirarla: nada cortado y botones tocables.

### Task 3: Enlaces, índice, `llms.txt` y sitemap

**Files:**
- Modify: `/home/neracosu/public_html/servicios/pasarelas-de-pago.html` (nuevo bloque después del hero, antes de la primera sección)
- Modify: `/home/neracosu/public_html/servicios/index.html` (nueva sección «Preguntas que respondo»)
- Create: `/home/neracosu/public_html/llms.txt`
- Modify: `/home/neracosu/public_html/sitemap.xml`

**Interfaces:**
- Produces: el bloque `<section class="landing-features preguntas-tema" id="preguntas">` con una lista de enlaces; las tandas siguientes agregan `<li>` ahí y en el índice.

- [ ] **Step 1: Bloque en `pasarelas-de-pago.html`** con título «Preguntas sobre este tema» y el primer enlace. Debe quedar en el primer tercio de la página.
- [ ] **Step 2: Sección en `servicios/index.html`** con el mismo enlace y una línea de qué responde.
- [ ] **Step 3: `llms.txt`** en formato llmstxt.org: `# NERACOSU`, una línea de qué hace Neri y dónde, `## Servicios` con las nueve páginas de categoría y `## Preguntas` con la página nueva, cada una con una línea.
- [ ] **Step 4: `sitemap.xml`**: `<url>` de la página nueva con `lastmod` 2026-10-26; actualizar `lastmod` de `pasarelas-de-pago.html` y `servicios/index.html`.
- [ ] **Step 5: Verificar**: `curl -s https://neracosu.com/llms.txt | head -3` muestra `# NERACOSU`; `python3 -c` que parsee `sitemap.xml` con `xml.etree` sin error.

### Task 4: Nera, medición, sellos, publicación y commit

**Files:**
- Modify (por script): las páginas de `servicios/`.

- [ ] **Step 1:** `python3 ~/build-para/nera.py && python3 ~/build-para/medir.py && python3 ~/build-para/versionar-assets.py`. Correrlos una segunda vez: deben reportar 0 modificadas.
- [ ] **Step 2:** `python3 ~/build-para/verificar-respuesta.py public_html/servicios/pago-movil-en-shopify.html --pais VE` → todo OK, código 0.
- [ ] **Step 3:** `curl -s -o /dev/null -w '%{http_code}' https://neracosu.com/servicios/pago-movil-en-shopify.html` → `200`. Lo mismo para `pasarelas-de-pago.html`, `servicios/index.html` y la home.
- [ ] **Step 4:** Commit en `main` solo de lo propio (no los cambios de `atalaya/`, que son de otra sesión):

```bash
git add servicios/pago-movil-en-shopify.html servicios/pasarelas-de-pago.html servicios/index.html llms.txt sitemap.xml docs/superpowers/specs/2026-10-26-paginas-de-respuesta-design.md docs/superpowers/plans/2026-10-26-paginas-de-respuesta-tanda-1.md
git commit -m "feat(servicios): pagina de respuesta Pago Movil en Shopify, llms.txt y bloque de preguntas"
```

## Tandas 2 a 6

Mismo patrón por página: Tarea 2 (con el `--pais` que le toque), un `<li>` en el bloque de su página madre y en el índice, una línea en `llms.txt`, su `<url>` en el sitemap y la Tarea 4. La página madre de cada una está en la tabla del diseño. Un commit por tanda.
