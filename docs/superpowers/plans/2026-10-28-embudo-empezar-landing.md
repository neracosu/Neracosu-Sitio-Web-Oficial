# Embudo /empezar — parte 2: la landing

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar `neracosu.com/empezar`: cuatro preguntas con el teléfono que se convierte en el sistema del visitante, recomendación con captura real, remate según califique, tres datos al panel y medición por paso.

**Architecture:** Una página estática más del sitio (`empezar.html` en la raíz, servida como `/empezar` por las reglas del `.htaccess`), con tres archivos propios: `assets/js/embudo-decidir.js` (reglas puras: decidir, calificar, textos; se puede probar en Node), `assets/js/embudo-pantallas.js` (las pantallas del teléfono y sus efectos) y `assets/js/embudo.js` (motor: pasos, navegación, envío, medición), más `assets/css/embudo.css`. Atropos y parallax.js alojados en `assets/js/lib/` y `assets/css/lib/`. El boceto de `boceto-empezar/` es la referencia visual: se reescribe, no se copia.

**Tech Stack:** HTML + CSS + JS vanilla (sin React/Tailwind/GSAP/anime/Lenis). Atropos 2.0.2, parallax.js 3.1.0. Pruebas: `node --test` con Playwright (el Chromium que ya está instalado en la cuenta, en `~/.cache/ms-playwright/`, y el módulo `playwright` de `public_html/hotelmarte.neracosu.com/node_modules`) contra `python3 -m http.server` sirviendo `public_html`, en `~/build-para/pruebas/embudo/` (fuera del docroot, como todo lo de `build-para`). Lighthouse con `npx -y lighthouse@12`.

**Spec:** `docs/superpowers/specs/2026-10-28-embudo-empezar-design.md`. Requiere la parte 1 (panel) desplegada: `prospectos.neracosu.com/docs/superpowers/plans/2026-10-28-embudo-empezar-panel.md`.

## Global Constraints

- Voz de usted, español de Venezuela, sin jerga, sin escasez inventada, sin testimonios, sin llamadas. ArmorPay = «plataforma de validación de pagos». Hotel anonimizado y sin número de habitaciones. Sin nombres de prospectos en ningún archivo (repo público).
- Sin cifras de proyecto: la única cifra es «26 plataformas en producción» y la promoción «hasta el 31 de diciembre de 2026, 40 % de descuento en el pago único», que se esconde sola al vencer (`new Date() > new Date("2027-01-01T04:00:00Z")`, como en `precios.py`).
- CSP del sitio: scripts y estilos propios o inline; `connect-src` solo `prospectos.neracosu.com`. Nada desde CDN.
- Fuentes alojadas (`/assets/css/fuentes.css`); no enlazar Google Fonts. Precargar `inter-latin-3100e775.woff2` e `instrument-serif-italica-latin-5a51946d.woff2` como en `head.tpl`.
- Solo se animan `transform` y `opacity`; duraciones 180–320 ms (el flujo de pago, ~4 s); `prefers-reduced-motion` apaga transiciones.
- Librerías: menos de 30 KB en total, con `defer`.
- Medición: ruta reportada `/empezar.html`; eventos `paso` con `p1`, `p2`, `p3`, `p4`, `resultado`, `datos`, `enviado`, una vez cada uno por visita.
- Envío: `POST https://prospectos.neracosu.com/api/web/solicitud` con `{ nombre, phone, type: "embudo", message, respuestas: {rubro, actual, objetivo, tamano, sistema}, calificacion, origen, pagina: "/empezar.html", sesion, sitio }`. Nunca decir «enviado» sin `ok: true`; si falla, botón de WhatsApp (`584222707095`) con el resumen escrito.
- Al terminar cualquier cambio en `empezar.html` o sus assets: `python3 ~/build-para/nera.py && python3 ~/build-para/medir.py && python3 ~/build-para/versionar-assets.py`.
- Un solo build a la vez en la cuenta (aquí no hay build, pero no correr Lighthouse mientras otro proyecto compila: mete ruido).

## Review Focus

1. Recarga a mitad del recorrido con `#3` en la dirección pero sin respuestas guardadas: vuelve a la pregunta 1 sin error. → Tarea 2, test «hash sin respuestas».
2. Nombre del negocio con HTML, emoji o 200 caracteres: en el teléfono sale escapado y recortado a 28; al panel va completo (hasta 120). → Tarea 5, test «nombre raro».
3. Pulsar «Enviar» dos veces seguidas manda una sola solicitud. → Tarea 5, test «doble toque».
4. El panel responde 500 o no responde: aparece el botón de WhatsApp con el resumen y no se marca `enviado`. → Tarea 5, tests «panel caído» y «sin red».
5. `prefers-reduced-motion`: se recorre todo igual, sin transiciones, y el flujo de pago llega a «¡Pago exitoso!». → Tarea 3, test «sin movimiento».

---

### Task 1: Arnés de pruebas, librerías alojadas y `medir.js` con `ncEvento` y `de=`

**Files:**
- Create: `/home/neracosu/build-para/pruebas/embudo/servidor.cjs`, `navegador.cjs` (copiados del arnés de pruebas del prototipo de tienda del 28-oct, cuya ruta está en la memoria del proyecto; con `SALIDA = /home/neracosu/public_html`, puerto `8098`, y en `conPagina` un `addInitScript` que define `navigator.webdriver` como `false` para que `medir.js` no se apague)
- Create: `assets/js/lib/atropos.min.js`, `assets/js/lib/parallax.min.js`, `assets/css/lib/atropos.css` (desde `boceto-empezar/lib/`, mismas versiones)
- Modify: `assets/js/medir.js`
- Test: `/home/neracosu/build-para/pruebas/embudo/medir.test.cjs`

**Interfaces:**
- Produces: `window.ncEvento(tipo: string, detalle: string): void` (manda `{t, d}` por el mismo `enviar`); el origen de la vista toma `?de=` antes que `utm_source`; `window.ncSesion()` ya existe.

- [ ] **Step 1: Test que falla** (`medir.test.cjs`): abre `/calculadora.html?de=tiktok` interceptando `https://prospectos.neracosu.com/api/web/evento` con `page.route` (responde 200 y guarda los cuerpos); afirma que la vista lleva `o: "tiktok"`; luego `page.evaluate(() => window.ncEvento("paso", "p1"))` y afirma que llegó `{ t: "paso", d: "p1", r: "/calculadora.html" }`. `sendBeacon` no pasa por `page.route`: en el `addInitScript` del arnés, reemplazar `navigator.sendBeacon` por una función que devuelve `false`, así `medir.js` cae al `fetch`.

- [ ] **Step 2: Correr y ver que falla.** Run: `cd ~/build-para/pruebas/embudo && node --test medir.test.cjs`. Expected: FAIL (`ncEvento` no es función).

- [ ] **Step 3: Implementar** en `medir.js`: antes del `utm`, `var de = /[?&]de=([^&#]+)/.exec(q); if (de) origen = decodeURIComponent(de[1])` (con try); al final, `window.ncEvento = function (t, d) { enviar({ t: String(t), d: String(d).slice(0, 40) }); };`. Copiar las tres librerías a su sitio.

- [ ] **Step 4: Correr test.** Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add assets/js/medir.js assets/js/lib assets/css/lib
git commit -m "feat(medir): ncEvento y origen por ?de=; Atropos y parallax.js alojados"
```

---

### Task 2: Reglas puras: `embudo-decidir.js`

**Files:**
- Create: `assets/js/embudo-decidir.js`
- Test: `~/build-para/pruebas/embudo/decidir.test.cjs` (Node puro: `const D = require('/home/neracosu/public_html/assets/js/embudo-decidir.js')`)

**Interfaces:**
- Produces (UMD mínimo: `module.exports` si existe, si no `window.ncEmbudo`):
  - `RUBROS: {v, t, ej}[]` (los siete del asistente, mismos `v`: `citas, comercio, restaurantes, hoteles, reservas, logistica, otro`)
  - `ACTUAL: {v, t}[]` con `manual, mensualidad, propio, web`
  - `OBJETIVOS: {v, t}[]` con `cobros, ventas, operacion, sistemas, web`
  - `tamanos(rubro): {v: 0|1|2, t, ej}[]` con los ejemplos por rubro del diseño (hospedaje: «hasta 15 habitaciones», «16 a 40 habitaciones», «más de 40 o varias sedes»; comercio: «un local, mostrador», «un local grande o dos», «varias sedes o mucho movimiento»; comida: «hasta 10 mesas o solo delivery», «11 a 30 mesas», «más de 30 o varias sedes»; citas: «hasta 3 profesionales», «4 a 10», «más de 10 o varias sedes»; espacios: «1 o 2 espacios», «3 a 6», «más de 6 o varias sedes»; logística: «pocos movimientos al día», «decenas al día», «cientos al día o varias sedes»; otro: «un local, poco personal», «un local grande o dos chicos», «varias sedes o mucho movimiento»)
  - `SISTEMAS: Record<clave, {nombre, slug, img|null, pie, ya: string[3]}>` con claves `hoteles, comercio, restaurantes, citas, reservas, logistica, cobros, integraciones, medida`; `img` es el nombre base en `assets/img/portafolio/` (`pms-hotelero`, `adastram`, `armorpay`, `terrazas-vip`, `ocls`, `armorpay-interno`; `citas` y `medida` sin imagen); `slug` el de `/para/` (`medida` sin slug). Textos de `ya` y `pie` del diseño (el hotel: «un hotel de alta rotación en Valencia, Carabobo», sin habitaciones).
  - `decidir(r: {rubro, actual, objetivo, tamano}) → {clave, sistema, demo: boolean}`: las reglas del asistente (`otro` → por objetivo: cobros→cobros, sistemas→integraciones, web→comercio, resto→medida; objetivo `sistemas`→integraciones; objetivo `cobros` fuera de restaurantes/hoteles/comercio→cobros; objetivo `web` fuera de comercio/hoteles→comercio) más: `actual === "web"` y rubro comercio u otro → cobros. `demo = tamano >= 1 || actual === "web"`, y `false` si la clave es `medida`.
  - `fraseResultado(r, sistema) → string` («Para una tienda mediana que hoy vende en línea y confirma pagos a mano, lo primero es: …»; género y número correctos: «un hospedaje grande», «un negocio de comida chico», «una operación logística mediana»).
  - `resumenWhatsApp(r, d, marca) → string` (texto para el botón de respaldo: «Hola Neri, usé /empezar. Negocio: … Rubro: … Hoy: … Quiero: … Tamaño: … Me recomendó: … Quiero el diagnóstico gratis / ver mi demostración.»)

- [ ] **Step 1: Tests que fallan** (`decidir.test.cjs`), uno por regla:

```js
assert.equal(D.decidir({rubro:'comercio',actual:'web',objetivo:'cobros',tamano:0}).clave, 'cobros');
assert.equal(D.decidir({rubro:'comercio',actual:'web',objetivo:'cobros',tamano:0}).demo, true);
assert.equal(D.decidir({rubro:'hoteles',actual:'manual',objetivo:'cobros',tamano:0}).clave, 'hoteles');
assert.equal(D.decidir({rubro:'hoteles',actual:'manual',objetivo:'cobros',tamano:0}).demo, false);
assert.equal(D.decidir({rubro:'citas',actual:'manual',objetivo:'sistemas',tamano:2}).clave, 'integraciones');
assert.equal(D.decidir({rubro:'otro',actual:'propio',objetivo:'operacion',tamano:2}).clave, 'medida');
assert.equal(D.decidir({rubro:'otro',actual:'propio',objetivo:'operacion',tamano:2}).demo, false);
assert.equal(D.decidir({rubro:'restaurantes',actual:'mensualidad',objetivo:'web',tamano:1}).clave, 'comercio');
assert.equal(D.tamanos('hoteles')[1].ej, '16 a 40 habitaciones');
assert.match(D.fraseResultado({rubro:'comercio',actual:'web',objetivo:'cobros',tamano:1}, D.SISTEMAS.cobros), /^Para una tienda mediana que hoy vende en línea y confirma pagos a mano, lo primero es: /);
assert.match(D.fraseResultado({rubro:'logistica',actual:'propio',objetivo:'operacion',tamano:2}, D.SISTEMAS.logistica), /una operación logística grande/);
for (const k of Object.keys(D.SISTEMAS)) assert.equal(D.SISTEMAS[k].ya.length, 3);
assert.ok(!/\d+\s*habitaciones/.test(D.SISTEMAS.hoteles.pie)); // el hotel va anonimizado y sin numero de habitaciones
```

- [ ] **Step 2: Correr y ver que falla.** Run: `node --test decidir.test.cjs`. Expected: FAIL (módulo no existe).
- [ ] **Step 3: Implementar** `assets/js/embudo-decidir.js` con lo del bloque Interfaces.
- [ ] **Step 4: Correr test.** Expected: PASS.
- [ ] **Step 5: Commit** `git add assets/js/embudo-decidir.js && git commit -m "feat(empezar): reglas puras del embudo (decidir, calificar, textos)"`

---

### Task 3: Página, motor de pasos y teléfono

**Files:**
- Create: `empezar.html` (con `<meta name="robots" content="noindex, nofollow">` **hasta la Tarea 7**), `assets/css/embudo.css`, `assets/js/embudo.js`, `assets/js/embudo-pantallas.js`
- Test: `~/build-para/pruebas/embudo/recorrido.test.cjs`

**Interfaces:**
- Consumes: `window.ncEmbudo` (Tarea 2), Atropos y parallax.js (Tarea 1).
- Produces:
  - `embudo-pantallas.js` → `window.ncPantallas = { sistema(r, marca) → html, hoy(actual, marca) → html, portada(i, marca) → html, efecto(objetivo, r, marca, raiz: {fx, toast}) → void (limpia y arranca), limpiar(raiz) → void }`. Los `html` llevan `.cab .marca` con la marca o «Su marca aquí» (clase `vacia`). Pantallas por rubro como en el boceto (habitaciones, catálogo, mesas, agenda con cinta «En construcción», canchas, contenedores, panel), escaladas por `tamano`. Efectos: `cobros` (datos → seis dígitos → «Validando con el banco…» → «¡Pago exitoso!», total ~4 s), `ventas` (aviso «Nueva reserva · 2:14 a. m. · cupo retenido 10 min · pago validado»), `operacion` (contadores), `sistemas` (tres pares conectados), `web` (resultado de Google con la marca).
  - `embudo.js`: estado `R = {rubro, actual, objetivo, tamano, marca}` en `sessionStorage` (`nc_embudo`), paso en `location.hash` (`#1`…`#7`; `0` = portada), `data-paso` en `<main>`. Pasos: `0` portada, `1` rubro, `2` actual, `3` objetivo, `4` tamaño, `5` resultado, `6` datos, `7` gracias. Tocar una opción avanza (sin «Siguiente»); espera 420 ms (900 en el paso 2, 2.600 en el 3 para que se vea el efecto); «Volver», deslizar a la derecha, Escape/flecha izquierda y «atrás» del navegador retroceden; teclas 1–7 eligen. Barra `#prog` de 2 px arriba. Vibración `navigator.vibrate(12)` dentro de `try`. En escritorio, pasar el cursor por una opción de los pasos 1, 2 y 4 previsualiza en el teléfono.
  - Hash sin respuestas (p. ej. abrir `#3` en limpio) → se va a `#1`. Hash `#5`+ sin las cuatro respuestas → `#1`.

- [ ] **Step 1: Tests que fallan** (`recorrido.test.cjs`, móvil 390×844 salvo donde se diga):

```js
test('portada → 4 preguntas → resultado, con el telefono cambiando', ...)   // tras tocar hoteles, .pant contiene «Habitaciones»; tras manual, contiene «captura.jpg»; tras cobros, en ≤5 s .fx contiene «¡Pago exitoso!»; tras tamaño 2, .pant contiene «20 en total»; main[data-paso]=5 y #maq termina con la clase .fin con el nombre del sistema
test('hash sin respuestas vuelve a la pregunta 1', ...)                      // goto /empezar#3 en contexto limpio → location.hash === '#1'
test('volver: boton, deslizar y tecla', ...)                                  // en #2, click .atras → #1; en #2, touch swipe +90px → #1; escritorio: ArrowLeft → #1
test('teclas 1-7 eligen en escritorio', ...)                                  // en #1, press '4' → R.rubro === 'hoteles' (leer sessionStorage nc_embudo)
test('sin movimiento se recorre igual', ...)                                  // contexto con reducedMotion: 'reduce'; mismo recorrido que el primero hasta «¡Pago exitoso!»
test('no hay desplazamiento horizontal ni errores de consola a 390', ...)     // scrollWidth === 390; pageerror vacío
```

- [ ] **Step 2: Correr y ver que fallan.** Run: `node --test recorrido.test.cjs`. Expected: FAIL (404 de `/empezar`).

- [ ] **Step 3: Escribir `empezar.html`.** `<head>` como `head.tpl` (título «Le muestro cómo quedaría su sistema, con su marca · NERACOSU», descripción «Cuatro preguntas, un minuto. Le digo qué sistema le conviene y, si su caso califica, le armo una demostración con su marca, gratis.», canonical `https://neracosu.com/empezar`, OG/Twitter con `/assets/img/og-empezar.jpg` (se genera en la Tarea 7; hasta entonces `og-image.jpg`), `hreflang`, iconos, `theme-color`, precargas, `fuentes.css`, `redesign.css`, `embudo.css`, `assets/css/lib/atropos.css`). Sin `site-nav` completo: solo el logotipo NERACOSU arriba a la izquierda enlazando a `/` (la landing no debe invitar a irse). `<main id="marco" data-paso="0">` con `#fondo` (tres capas `data-depth`), `#arriba` (Atropos con `.tel` → `.pant` → `#ui`, `#toast`, `#fx`; tres `.chip` con `data-atropos-offset`), `#panel`. Scripts al final con `defer`: `lib/atropos.min.js`, `lib/parallax.min.js`, `embudo-decidir.js`, `embudo-pantallas.js`, `embudo.js`. Textos de la portada y de las preguntas exactamente los del diseño («Le muestro cómo *quedaría* su sistema, con su marca.», «Cuatro preguntas, un minuto», las tres líneas de respaldo).

- [ ] **Step 4: Escribir `embudo.css`** sobre los tokens de `redesign.css` (`--bg`, `--accent`, `--text-muted`, `--border`): la retícula de 8 px, el titular `clamp(44px, 9.5vw, 56px)` en móvil y `clamp(56px, 6.2vw, 96px)` en escritorio con `letter-spacing: -.035em`, una sola cursiva (`Instrument Serif`), grano fino en `body::after`, el teléfono de 300×620 escalado con `--k` (JS: `min(1, 0.42·alto/620, (ancho−40)/300)` en móvil; `min(1, 0.8·alto/620)` en escritorio), `.op` con foco visible, estados `:active` y `[disabled]`, `.paso` con `overflow-y:auto`, y `@media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important } }`.

- [ ] **Step 5: Escribir `embudo-pantallas.js` y `embudo.js`** según Interfaces. El resultado (`#5`) ya se pinta en esta tarea con `fraseResultado` escrito letra a letra (`#maq`, 14 ms por dos letras, clase `fin` al terminar), las tres líneas `ya`, la captura (`<img src="/assets/img/portafolio/<img>-800.webp" loading="lazy" width="800" height="450" alt="">` con `aspect-ratio` reservado) y su pie, el enlace «Ver los precios publicados de este sistema» → `/para/<slug>` y la línea de la promoción con su fecha. El remate y el formulario se completan en la Tarea 5: aquí basta con el `h2` y el botón que lleva a `#6`.

- [ ] **Step 6: Correr tests.** Run: `node --test recorrido.test.cjs`. Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add empezar.html assets/css/embudo.css assets/js/embudo.js assets/js/embudo-pantallas.js
git commit -m "feat(empezar): landing del embudo con el telefono que se convierte en su sistema (noindex por ahora)"
```

---

### Task 4: Medición por paso

**Files:**
- Modify: `assets/js/embudo.js`
- Test: `~/build-para/pruebas/embudo/medicion.test.cjs`

**Interfaces:**
- Consumes: `window.ncEvento` (Tarea 1).
- Produces: al entrar por primera vez a cada paso, `ncEvento("paso", id)` con `p1`…`p4` (al **responder** la pregunta, no al verla), `resultado` (al pintarse), `datos` (al pintarse), `enviado` (tras `ok: true`); un `Set` en memoria evita repetir dentro de la visita. Si `ncEvento` no existe (nomedir), no pasa nada.

- [ ] **Step 1: Test que falla:** interceptar el evento como en la Tarea 1; recorrer hasta el resultado dos veces (volver y volver a responder la 4); afirmar que llegaron exactamente `p1, p2, p3, p4, resultado` una vez cada uno, y que `vista` lleva `r: "/empezar.html"`.
- [ ] **Step 2: Correr y ver que falla.** Expected: FAIL (no llega ningún `paso`).
- [ ] **Step 3: Implementar** en `embudo.js` (`function medir(id)`).
- [ ] **Step 4: Correr.** Expected: PASS.
- [ ] **Step 5: Commit** `git commit -am "feat(empezar): medicion por paso al panel"`

---

### Task 5: Remate, datos, envío al panel y gracias

**Files:**
- Modify: `assets/js/embudo.js`, `empezar.html` (plantillas de los pasos 5–7 si viven en el HTML)
- Test: `~/build-para/pruebas/embudo/envio.test.cjs`

**Interfaces:**
- Consumes: `decidir`, `resumenWhatsApp` (Tarea 2); `window.ncSesion` (medir.js).
- Produces: paso 5 con el remate según `demo` (textos exactos del diseño: «¿Quiere verlo con su marca?» + botón «Quiero ver mi demostración»; o «Le entrego el diagnóstico por escrito, gratis.» + botón «Quiero mi diagnóstico gratis» + enlace a `/calculadora`). Paso 6: tres campos (`#inMarca` nombre del negocio, `#inDonde` «¿Dónde puedo verlo? Instagram, página o dirección», `#inWa` WhatsApp con `inputmode="tel"`), campo trampa `sitio` oculto, botón con el mismo texto del remate; al escribir el nombre, `.cab .marca` del teléfono y el chip central lo muestran en vivo (recortado a 28, escapado). Validación en el navegador: nombre ≥ 2, WhatsApp con ≥ 7 dígitos; mensajes en la misma pantalla. Envío: `fetch` con el cuerpo de Global Constraints, `message` = `resumenWhatsApp(...)`, `nombre` = nombre del negocio + (` · ` + dónde verlo si lo dio), `phone` = WhatsApp; botón deshabilitado y con «Enviando…» mientras tanto; `ok` → paso 7 y `medir("enviado")`; 400 con `mensaje` → se muestra; 500 o error de red → texto «No pude guardar su solicitud en este momento. Envíemela por WhatsApp con el texto ya escrito:» y botón `https://wa.me/584222707095?text=<resumen>`. Paso 7: texto del diseño con el nombre, enlace a `/para/<slug>` y botón «Volver al inicio» (limpia `sessionStorage` y va a `#0`).

- [ ] **Step 1: Tests que fallan** (`envio.test.cjs`), con `page.route` sobre `/api/web/solicitud`:

```js
test('mediano → remate de demostracion; chico y manual → diagnostico', ...)      // texto del h2 en #5
test('el nombre del negocio aparece en vivo en el telefono, escapado y recortado', ...) // type '<b>Posada</b> ' + 'x'.repeat(60) → .marca textContent sin '<', longitud 28; nombre raro
test('envia una sola solicitud aunque toquen dos veces y llega enviado', ...)    // click doble → 1 request; cuerpo con type 'embudo', respuestas {rubro:'hoteles',...,sistema:'hoteles'}, calificacion 'demo', origen 'tiktok' (goto con ?de=tiktok), pagina '/empezar.html'; luego #7 y evento enviado
test('panel caido (500) → boton de WhatsApp y sin enviado', ...)
test('sin red (route.abort) → boton de WhatsApp y sin enviado', ...)
test('400 con mensaje → se muestra el mensaje', ...)
```

- [ ] **Step 2: Correr y ver que fallan.** Expected: FAIL.
- [ ] **Step 3: Implementar.**
- [ ] **Step 4: Correr.** Expected: PASS. También `node --test` de toda la carpeta en verde.
- [ ] **Step 5: Commit** `git commit -am "feat(empezar): remate segun califique, tres datos al panel con respaldo de WhatsApp, y gracias"`

---

### Task 6: Portada viva y acabado de agencia

**Files:**
- Modify: `embudo-pantallas.js`, `embudo.js`, `embudo.css`
- Test: `recorrido.test.cjs` (dos pruebas más)

**Interfaces:** ninguna nueva.

- [ ] **Step 1: Tests que fallan:** (a) en la portada, `.pant` cambia de contenido al menos dos veces en 6 s y deja de cambiar al pasar a `#1`; (b) a 390, 768 y 1440 px, sin desplazamiento horizontal, `#atropos` entero dentro del visor (bounding box dentro de `innerHeight`), y los tres `.chip` con `opacity` 1 tras 1 s en la portada.
- [ ] **Step 2: Correr y ver que fallan.**
- [ ] **Step 3: Implementar:** el ciclo de portada (hotel → tienda → pagos validados, cada 2,6 s, se detiene al salir del paso 0); chips con texto por paso («así está hoy», «así quedaría», la marca); Atropos con `shadow: false, highlight: true, rotateXMax: 10, rotateYMax: 12, activeOffset: 30, duration: 350`; parallax.js con `relativeInput: false, hoverOnly: false, frictionX: .08, frictionY: .08, scalarX: 6, scalarY: 6`; en iOS, si `DeviceOrientationEvent.requestPermission` existe, pedirlo en el primer toque (dentro de `try`) y seguir sin él si lo niegan. Revisar el acabado contra la lista del diseño (jerarquía, aire, estados de foco, cero saltos de maquetación: dar alto fijo a `#arriba`, reservar el alto de `#maq` con `min-height`, `width`/`height` en la captura).
- [ ] **Step 4: Correr toda la carpeta.** Expected: PASS.
- [ ] **Step 5: Capturas de revisión** a 390, 768 y 1440 de portada, pregunta 3 con «¡Pago exitoso!», resultado y datos, en el scratchpad; mirarlas.
- [ ] **Step 6: Commit** `git commit -am "feat(empezar): portada viva, chips, 3D y acabado"`

---

### Task 7: SEO, tarjeta OG, `/demo`, scripts del sitio y publicación

**Files:**
- Create: `/home/neracosu/build-para/og-card-empezar.html` (copia de `og-card.html` con el titular de la landing y el teléfono encendido), `assets/img/og-empezar.jpg` (1200×630)
- Modify: `empezar.html` (quitar `noindex`; `og:image` definitivo), `.htaccess` (raíz), `/home/neracosu/build-para/nera.py` y `medir.py` (sumar `"empezar.html"` a la tupla de `paginas()`), `sitemap.xml`, `llms.txt` (una línea con `/empezar`)
- Test: `~/build-para/pruebas/embudo/publicacion.test.cjs` (contra el dominio público)

- [ ] **Step 1: Tests que fallan** (contra `https://neracosu.com`): `/empezar` → 200 y sin `noindex`; `/demo` → 301 a `/empezar`; `/empezar.html` → 301 a `/empezar`; el HTML lleva `canonical` `https://neracosu.com/empezar`, `og:image` `…/og-empezar.jpg` (y esa imagen responde 200 con `image/jpeg`), los scripts `embudo.js`, `medir.js` y `nera.js` con `?v=`; el comentario de Nera antes del `<!DOCTYPE>`.
- [ ] **Step 2: Correr y ver que fallan.**
- [ ] **Step 3: Implementar.** `.htaccess`: junto a la regla de `servicios/hoteles`, `RewriteRule ^demo/?$ /empezar [R=301,L]` (con la misma `RewriteCond` de host). Tarjeta OG: renderizar `og-card-empezar.html` con el Chromium de Playwright a 1200×630 (`page.screenshot` → `cvt`/`PIL` a JPG calidad 85). Correr `nera.py`, `medir.py`, `versionar-assets.py`. Sitemap y `llms.txt`.
- [ ] **Step 4: Correr tests de publicación y toda la carpeta.** Expected: PASS.
- [ ] **Step 5: Lighthouse móvil**

Run: `CHROME_PATH=$(ls -d ~/.cache/ms-playwright/chromium-*/chrome-linux*/chrome | tail -1) npx -y lighthouse@12 https://neracosu.com/empezar --chrome-flags="--headless=new --no-sandbox" --only-categories=performance,accessibility --form-factor=mobile --screenEmulation.mobile --output=json --output-path=/tmp/claude-1010/-home-neracosu-public-html/*/scratchpad/lh-empezar.json --quiet` y leer `categories.performance.score` y `categories.accessibility.score`.
Expected: rendimiento ≥ 0,90, accesibilidad = 1. Si no, corregir (lo primero que suele pesar: imágenes sin tamaño, JS sin `defer`, CLS del teléfono) y repetir.

- [ ] **Step 6: Commit y notas**

```bash
git add empezar.html .htaccess sitemap.xml llms.txt assets/img/og-empezar.jpg
git commit -m "feat(empezar): publicada e indexable; /demo redirige; tarjeta OG; sitemap"
```

Agregar al `CLAUDE.md` del sitio una sección «Embudo `/empezar` (desde 2026-10-29)» con: qué es, los tres JS y el CSS, dónde corren las pruebas (`~/build-para/pruebas/embudo/`), que la ruta medida es `/empezar.html`, los campos que manda al panel, y que `nera.py`/`medir.py` ya la incluyen. Guardar en la memoria el estado.

- [ ] **Step 7: Lo que sigue (fuera de este plan, para decidir con Neri):** apuntar los botones «Pedir mi diagnóstico gratis» de `/para/` y la tarjeta de la home a `/empezar` en vez de a WhatsApp; borrar `boceto-empezar/`.
