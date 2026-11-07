# Pago por partes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar la tercera forma de pago («pago por partes») en `/para/`, ofrecer la elección en `/empezar` y lanzar la landing generada `/por-partes`, con las cifras naciendo solo de `precios.py`.

**Architecture:** `~/build-para/precios.py` gana las constantes y `partes()`, y escribe la línea por plan y el bloque común en los cinco cuerpos con partes y la tabla en `body-por-partes.html`; `build.py` ensambla `/para/` y, con una entrada nueva en `pages.json`, la landing en la raíz. `/empezar` suma el paso `pago` (hash #6) que viaja en `respuestas.pago` al panel, cuyo contrato puro etiqueta la clave y el paso nuevo. Todo lo público se verifica a 390 px.

**Tech Stack:** Python 3 (scripts de build, `unittest`), HTML/CSS/JS vanilla (ES5 en `embudo.js`), `node --test` con Playwright (pruebas del embudo), Next 15 + Vitest (panel de prospección).

**Spec:** `docs/superpowers/specs/2026-11-07-pago-por-partes-design.md` (y las condiciones en `~/propuestas/condiciones-pago-por-partes.md`).

## Global Constraints

- Cifras: `PARTES_INICIAL_PCT = 25`, `PARTES_CUOTAS = 12`, `PARTES_VENTANA_CONTADO = 4`; precio base = precio de lista; la mensualidad de servicio del plan va **aparte desde el mes 2**; sin promoción de contado ni descuento de USD 1.000 en las partes.
- Rubros con partes: `body-hoteles.html`, `body-restaurantes.html`, `body-comercio.html`, `body-citas.html`, `body-reservas.html`. Sin partes: cobros, integraciones, logística, Colombia y `EXTRAS`.
- Texto público: «pago por partes» y «sistema propio, de una vez»; prohibido «crédito», «financiamiento», «alquiler», «mora», «intereses», «se lo digo de una vez», «se lo digo claro». Voz de usted, en positivo, Neri en primera persona.
- `/empezar`: sin montos ni porcentajes en la pantalla `pago`; CLS 0 de la portada se conserva; el paso no se muestra cuando `R.rubro === 'logistica'`.
- Un build a la vez en todo el servidor; `precios.py` siempre antes de `build.py`; nunca desde un subagente. Comentarios en el código sin acentos.
- Repo público: sin nombres de prospectos en ningún archivo commiteado.
- Panel: `npm test` y `PROSPECTOS_TEST_DB=1 npm test` en verde antes de desplegar; pausar el automático de correos antes de reiniciar; `pm2 list` antes de `pm2 restart prospectos`.

## Review Focus

1. **Volver atrás desde `datos` (#7) cae en `pago` (#6) con la opción marcada** y no en `resultado`: prueba en Task 4.
2. **`/empezar?pago=partes` con rubro logística**: el paso se salta y `respuestas.pago` llega vacío, sin error: prueba en Task 4.
3. **Una solicitud vieja o ajena sin clave `pago`** sigue mostrándose en el panel sin chip ni línea de correo: prueba en Task 5.
4. **`partes()` con un precio que no divide exacto (por ejemplo 4.300)** muestra la cuota con dos decimales y la suma cuadra al centavo: prueba en Task 1.
5. **La landing con `?de=tiktok`** manda la solicitud con `origen = tiktok`, y sin `de` manda `por-partes`: pruebas en Task 4 y Task 6.

---

### Task 1: `partes()` y el formato con decimales en `precios.py`

**Files:**
- Modify: `/home/neracosu/build-para/precios.py` (junto a `PROMO_PCT`, líneas 14-16, y `money`, línea 25)
- Test: `/home/neracosu/build-para/pruebas/partes.test.py`

**Interfaces:**
- Produces: `PARTES_INICIAL_PCT: int`, `PARTES_CUOTAS: int`, `PARTES_VENTANA_CONTADO: int`; `partes(precio: int) -> tuple[float, float]` (inicial, cuota) con la cuota redondeada a dos decimales; `money_dec(n: float) -> str` que devuelve `money(n)` si `n` es entero y, si no, `"$156,25"` (punto de miles, coma decimal, dos decimales).
- `precios.py` hoy ejecuta su bucle al importarse: la prueba lo importa con `PRECIOS_SOLO_DEFINICIONES=1` en el entorno, y el bucle final se envuelve en `if not os.environ.get("PRECIOS_SOLO_DEFINICIONES"):`.

- [ ] **Step 1: Write the failing test**

```python
# pruebas/partes.test.py  (correr: cd ~/build-para && PRECIOS_SOLO_DEFINICIONES=1 python3 -m unittest pruebas/partes.test.py)
import os, unittest
os.environ["PRECIOS_SOLO_DEFINICIONES"] = "1"
import precios

class Partes(unittest.TestCase):
    def test_comercio_esencial(self):
        self.assertEqual(precios.partes(2500), (625.0, 156.25))
    def test_suma_cuadra_al_centavo(self):
        for p in (2500, 4000, 6200, 2800, 4300, 6600, 2400, 3800, 5700):
            ini, cuota = precios.partes(p)
            self.assertAlmostEqual(ini + cuota * precios.PARTES_CUOTAS, p, delta=0.06)
    def test_money_dec(self):
        self.assertEqual(precios.money_dec(250), "$250")
        self.assertEqual(precios.money_dec(156.25), "$156,25")
        self.assertEqual(precios.money_dec(1550), "$1.550")
    def test_constantes(self):
        self.assertEqual((precios.PARTES_INICIAL_PCT, precios.PARTES_CUOTAS, precios.PARTES_VENTANA_CONTADO), (25, 12, 4))
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd ~/build-para && PRECIOS_SOLO_DEFINICIONES=1 python3 -m unittest pruebas/partes.test.py`
Expected: FAIL (AttributeError: module 'precios' has no attribute 'partes') o el bucle de `precios.py` escribiendo cuerpos al importar.

- [ ] **Step 3: Implement** las tres constantes, `partes()` y `money_dec()` en `precios.py`, y el guardado `if not os.environ.get("PRECIOS_SOLO_DEFINICIONES"):` alrededor de los dos bucles (`for archivo, cfg in NICHOS.items()` y `for archivo, cfg in EXTRAS.items()`), sin cambiar su contenido.

- [ ] **Step 4: Run test to verify it passes**

Run: igual que el paso 2. Expected: `OK` (4 tests).

- [ ] **Step 5: Comprobar que `precios.py` sin la variable sigue siendo idempotente**

Run: `cd ~/build-para && python3 precios.py | tail -3 && git -C ~/public_html status --short para/ | wc -l`
Expected: las líneas `OK body-*.html ...` de siempre; `0` (no escribe en `/para/`: solo toca los `body-*.html` de `~/build-para`, que no son repo).

- [ ] **Step 6: Commit** (no hay repo en `~/build-para`; se anota en el commit del sitio de Task 2).

---

### Task 2: La línea por plan y el bloque común en `/para/`

**Files:**
- Modify: `/home/neracosu/build-para/precios.py` (`NICHOS` líneas 28-310: campo `partes=True` en hoteles, restaurantes, comercio, citas y reservas; `DESCUENTO` 458-465; `plan_html` 466-485; `SECCION` 312; bucle 598-630)
- Modify: `/home/neracosu/build-para/body-index.html` (debajo de la tabla comparativa de precios, cerca de la línea 204)
- Modify: `/home/neracosu/public_html/assets/css/nicho.css` (estilos `.plan-partes`, `#por-partes`)
- Test: `/home/neracosu/build-para/pruebas/partes.test.py` (se amplía) y `/home/neracosu/build-para/verificar-sliders.py` (ya existe)

**Interfaces:**
- Consumes: `partes()`, `money_dec()` de Task 1.
- Produces: `plan_html(nombre, alcance, precio, items, destacado, mensual=0, con_partes=False)`; `PARTES_LINEA = '<div class="plan-partes">Por partes: inicial de {inicial} y {n} cuotas de {cuota}; la mensualidad de servicio va aparte.</div>'`; `PARTES_BLOQUE` (sección `id="por-partes"` con título «Empiece ya y pague por partes», tres reglas y enlace a `/por-partes`); `SECCION` gana el marcador `{partes_html}` justo antes de `{descuento_html}`.

- [ ] **Step 1: Write the failing test** (añadir a `pruebas/partes.test.py`)

```python
    def test_plan_html_con_partes(self):
        h = precios.plan_html("Esencial", "un local", 2500, ["a"], False, 100, con_partes=True)
        self.assertIn('class="plan-partes"', h)
        self.assertIn("inicial de $625 y 12 cuotas de $156,25", h)
        self.assertIn("la mensualidad de servicio va aparte", h)
    def test_plan_html_sin_partes(self):
        self.assertNotIn("plan-partes", precios.plan_html("Esencial", "un local", 2500, ["a"], False, 0))
    def test_nichos_con_partes(self):
        con = sorted(k for k, c in precios.NICHOS.items() if c.get("partes"))
        self.assertEqual(con, ["body-citas.html", "body-comercio.html", "body-hoteles.html", "body-reservas.html", "body-restaurantes.html"])
    def test_descuento_solo_contado(self):
        self.assertIn("solo con el pago de una vez", precios.DESCUENTO)
```

- [ ] **Step 2: Run test to verify it fails.** Run: como Task 1. Expected: FAIL (`TypeError: plan_html() got an unexpected keyword argument 'con_partes'`).

- [ ] **Step 3: Implement** en `precios.py`: `partes=True` en los cinco nichos; `plan_html` con `con_partes` que inserta `PARTES_LINEA` después de `{recurrente}`; `PARTES_BLOQUE` (texto de usted con las tres reglas del spec: precio de lista sin descuentos, mensualidad aparte desde el mes 2, alojado con Neri y suyo al terminar; enlace «Cómo funciona el pago por partes» a `/por-partes`); `SECCION` con `{partes_html}`; en el bucle, `plan_html(*pl, cfg["mensual"][i], con_partes=cfg.get("partes", False))` y `partes_html=PARTES_BLOQUE if cfg.get("partes") else ""`; `DESCUENTO` con la frase «Este descuento es solo con el pago de una vez.». En `body-index.html`, el mismo bloque escrito a mano con las cifras de comercio como ejemplo (625 + 12 × 156,25) debajo de la tabla comparativa. En `nicho.css`: `.plan-partes` (fuente 0,85 em, color atenuado, margen superior 8 px) y `#por-partes` con el estilo de `.plan-cambio`.

- [ ] **Step 4: Run tests.** Run: como Task 1. Expected: `OK` (8 tests).

- [ ] **Step 5: Regenerar y verificar.** Run: `cd ~/build-para && python3 precios.py | grep -c OK && python3 build.py | tail -3 && python3 verificar-sliders.py 2>&1 | tail -2 && grep -c 'plan-partes' ~/public_html/para/comercio-y-tienda.html ~/public_html/para/cobros-y-pagos.html ~/public_html/para/logistica-y-aduana.html`
Expected: `11` (9 nichos + 2 extras) · `OK /para/...` · sliders sin fallos · `comercio: 3`, `cobros: 0`, `logistica: 0`. Y `grep -c 'id="por-partes"' ~/public_html/para/*.html` da 1 en los cinco rubros con partes y en `index.html`, 0 en los demás.

- [ ] **Step 6: Mirar a 390 px.** Capturar `https://neracosu.com/para/comercio-y-tienda#precios` con Playwright (viewport 390) y revisar que la línea quepa en la tarjeta y el bloque no se solape con `.plan-cambio`.

- [ ] **Step 7: Commit**

```bash
cd ~/public_html && mkdir -p ~/backups/por-partes-20261107 && cp -r para ~/backups/por-partes-20261107/ && cp ~/build-para/precios.py ~/backups/por-partes-20261107/
git add para/ assets/css/nicho.css && git commit -m "feat(para): pago por partes: linea por plan y bloque #por-partes en los cinco rubros alojados; descuento de 1.000 solo de contado"
```

---

### Task 3: `embudo-decidir.js`: quién tiene partes y la línea del resumen

**Files:**
- Modify: `/home/neracosu/public_html/assets/js/embudo-decidir.js` (líneas 107-170 y el `return` final)
- Test: `/home/neracosu/build-para/pruebas/embudo/decidir.test.cjs`

**Interfaces:**
- Produces: `tienePartes(r) -> boolean` (`false` solo si `r.rubro === 'logistica'`); `resumenWhatsApp(r, d, marca, donde)` agrega, antes de la última línea, `'Prefiero pagar por partes.'` si `r.pago === 'partes'`, `'Prefiero pagar de una vez.'` si `r.pago === 'propio'`, y nada si no hay `r.pago`. `decidir()` no cambia.

- [ ] **Step 1: Write the failing test** (añadir a `decidir.test.cjs`, mismo estilo que las pruebas existentes)

```js
test('tienePartes: todos los rubros menos logistica', () => {
  assert.equal(D.tienePartes({ rubro: 'comercio' }), true);
  assert.equal(D.tienePartes({ rubro: 'otro' }), true);
  assert.equal(D.tienePartes({ rubro: 'logistica' }), false);
});
test('resumenWhatsApp dice la forma de pago elegida', () => {
  const r = { rubro: 'comercio', actual: 'manual', objetivo: 'cobros', tamano: 1, pago: 'partes' };
  const d = D.decidir(r);
  const lineas = D.resumenWhatsApp(r, d, 'Mi tienda', '').split('\n');
  assert.equal(lineas[lineas.length - 2], 'Prefiero pagar por partes.');
  assert.ok(!D.resumenWhatsApp({ ...r, pago: undefined }, d, 'Mi tienda', '').includes('Prefiero'));
});
```

- [ ] **Step 2: Run test to verify it fails.** Run: `cd ~/build-para/pruebas/embudo && node --test decidir.test.cjs`. Expected: FAIL (`D.tienePartes is not a function`).

- [ ] **Step 3: Implement** `tienePartes` y la línea en `resumenWhatsApp`; exportar `tienePartes` en el `return`.

- [ ] **Step 4: Run test to verify it passes.** Expected: todas en verde.

- [ ] **Step 5: Commit**: `git add assets/js/embudo-decidir.js && git commit -m "feat(empezar): tienePartes y la forma de pago en el resumen de WhatsApp"` (la prueba vive fuera del repo).

---

### Task 4: El paso `pago` en `/empezar`

**Files:**
- Modify: `/home/neracosu/public_html/assets/js/embudo.js` (PASOS 105-176; `ir` 198-215; `volver` 216; `origenEnlace` 235-239; `enviar` 261-266; el arranque que lee el hash, 326-345)
- Modify: `/home/neracosu/public_html/assets/css/embudo.css` (solo si `.op` necesita variante de dos líneas)
- Modify: `/home/neracosu/build-para/pruebas/embudo/envio.test.cjs`, `revision.test.cjs`, `recorrido.test.cjs`, `portada.test.cjs`, `medicion.test.cjs` (renumerar `#6`→`#7`, `#7`→`#8`; el `data-ir="6"` del resultado sigue siendo 6, que ahora es `pago`)
- Test: `/home/neracosu/build-para/pruebas/embudo/pago.test.cjs` (nuevo)

**Interfaces:**
- Consumes: `D.tienePartes(R)` y `D.resumenWhatsApp` de Task 3.
- Produces: paso `{ id: 'pago', clave: 'pago', ... }` en índice 6 de `PASOS`; `datos` en 7, `gracias` en 8; `R.pago` ∈ `'partes' | 'propio' | undefined`; en el envío, `respuestas.pago = R.pago || ''`; evento de medición `paso` con detalle `pago`; `origenEnlace()` devuelve `'por-partes'` cuando no hay `de`/`utm_source` y `document.referrer` contiene `/por-partes`; `?pago=partes` en la URL de `/empezar` pone `R.pago = 'partes'` al cargar si no había valor.

- [ ] **Step 1: Write the failing tests** (`pago.test.cjs`, con el arnés de `servidor.cjs` y `navegador.cjs` como las demás)

```js
test('tras el resultado aparece el paso de pago en #6 con dos opciones y sin cifras', async () => {
  // responder las cuatro con rubro comercio mediano, tocar el boton del resultado
  // assert hash === '#6'; assert 2 botones .op con data-v 'partes' y 'propio'
  // assert !/\$|USD|%/.test(textoDelPanel)
});
test('elegir partes lleva a datos (#7), guarda R.pago y lo manda en respuestas.pago', async () => {
  // interceptar POST /api/web/solicitud; assert body.respuestas.pago === 'partes'
  // assert sessionStorage nc_embudo .pago === 'partes'
});
test('atras desde datos cae en pago con la opcion marcada', async () => {
  // page.goBack(); assert hash '#6'; assert .op[data-v=partes].elegida
});
test('con rubro logistica el paso pago se salta: #6 pinta datos y respuestas.pago llega vacio', async () => {});
test('/empezar?pago=partes preselecciona partes sin saltar el paso', async () => {});
test('origen: sin de y con referrer /por-partes manda por-partes; con ?de=tiktok manda tiktok', async () => {
  // page.setExtraHTTPHeaders({ referer: URL() + '/por-partes' }) ... assert body.origen
});
test('medicion: los pasos son p1..p4, resultado, pago, datos, enviado', async () => {});
```

- [ ] **Step 2: Run tests to verify they fail.** Run: `cd ~/build-para/pruebas/embudo && node --test --test-concurrency=1 pago.test.cjs`. Expected: FAIL (hash `#6` pinta el formulario de datos).

- [ ] **Step 3: Implement** en `embudo.js`: insertar en `PASOS` después de `resultado` el paso `pago` (`clave: 'pago'`, `render` con ojo «¿Cómo prefiere pagar?», h2 «Dos formas de empezar», `opciones([{v:'partes', t:'Empiezo hoy y pago por partes', ...}, {v:'propio', t:'Mi sistema propio, de una vez', ...}])` con las dos descripciones del spec y el enlace pequeño a `/para/<slug del sistema>` o `/para/`; `despues: function(){ medir('pago'); ... }`; `espera: 420`); en `ir()`: `if (n === 6 && !D.tienePartes(R)) n = (dir||1) < 0 ? 5 : 7;` y cambiar `if (n === 6 && R.enviado) n = 7` por `if (n === 7 && R.enviado) n = 8`; en `volver()`: `paso < 8`; en el resultado, `data-ir="6"` queda (ahora es `pago`); en `enviar()`: `respuestas: {..., pago: R.pago || ''}`; `origenEnlace()` con el respaldo del `referrer`; al cargar: leer `?pago=partes` una vez y `if (!R.pago) { R.pago = 'partes'; guardar(); }`. Renumerar las cinco pruebas existentes.

- [ ] **Step 4: Run all embudo tests.** Run: `cd ~/build-para/pruebas/embudo && node --test --test-concurrency=1` (con `?nomedir` no: el arnés local no mide de verdad). Expected: 45 + 7 en verde.

- [ ] **Step 5: Portada y CLS.** Run: `node --test --test-concurrency=1 portada.test.cjs` y un Lighthouse móvil de `/empezar` tras publicar (Task 9). Expected: portada en verde; CLS 0.

- [ ] **Step 6: Sellar y commit.** Run: `cd ~/build-para && python3 versionar-assets.py | tail -1`. Luego: `cd ~/public_html && git add assets/js/embudo.js assets/css/embudo.css empezar.html && git commit -m "feat(empezar): paso pago (#6): por partes o sistema propio; viaja en respuestas.pago; preseleccion ?pago=partes; origen por-partes"`.

---

### Task 5: El panel entiende `pago` y `por-partes`

**Files:**
- Modify: `/home/neracosu/public_html/prospectos.neracosu.com/src/lib/web-contrato.ts` (`PASOS_EMBUDO` 16-24; `CLAVES_RESPUESTAS` 28-31; `clasificarOrigen` 156-169)
- Modify: `src/lib/correo.ts` (líneas 17-30), `src/componentes/TarjetaSolicitud.tsx` (línea 20)
- Test: `tests/web-contrato.test.ts`, `tests/correo.test.ts` (o donde viva `armarCorreo`)

**Interfaces:**
- Produces: `CLAVES_RESPUESTAS` incluye `"pago"` al final; `NOMBRES_RESPUESTA.pago = "Forma de pago"`; `respuestasLegibles` devuelve el valor legible (`"por partes"` para `partes`, `"de una vez"` para `propio`, y el crudo para cualquier otro texto); `PASOS_EMBUDO` con `{ id: "pago", nombre: "Eligieron forma de pago" }` entre `resultado` y `datos`; `clasificarOrigen("por-partes") === "Landing pago por partes"`; `armarCorreo` agrega la línea `Forma de pago: por partes` cuando viene; `TarjetaSolicitud` muestra el chip «Pago por partes» cuando `pago === "partes"`.

- [ ] **Step 1: Write the failing tests**

```ts
it("respuestasLegibles etiqueta la forma de pago", () => {
  expect(respuestasLegibles(JSON.stringify({ rubro: "comercio", pago: "partes" }))).toEqual([
    { clave: "Rubro", valor: "comercio" }, { clave: "Forma de pago", valor: "por partes" }]);
  expect(respuestasLegibles(JSON.stringify({ rubro: "comercio" }))).toEqual([{ clave: "Rubro", valor: "comercio" }]);
});
it("normalizarSolicitud conserva pago dentro de respuestas", () => {
  const r = normalizarSolicitud({ ...solicitudEmbudoValida, respuestas: { rubro: "comercio", pago: "propio" } });
  expect(r.ok && JSON.parse(r.datos.respuestas).pago).toBe("propio");
});
it("PASOS_EMBUDO lleva pago entre resultado y datos", () => {
  expect(PASOS_EMBUDO.map((p) => p.id)).toEqual(["p1", "p2", "p3", "p4", "resultado", "pago", "datos", "enviado"]);
});
it("clasificarOrigen reconoce la landing", () => { expect(clasificarOrigen("por-partes")).toBe("Landing pago por partes"); });
it("el correo dice la forma de pago solo cuando viene", () => {
  expect(armarCorreo({ ...solicitudEmbudo, respuestas: JSON.stringify({ rubro: "comercio", pago: "partes" }) })).toContain("Forma de pago: por partes");
  expect(armarCorreo({ ...solicitudEmbudo, respuestas: JSON.stringify({ rubro: "comercio" }) })).not.toContain("Forma de pago");
});
```

- [ ] **Step 2: Run tests to verify they fail.** Run: `cd ~/public_html/prospectos.neracosu.com && npx vitest run tests/web-contrato.test.ts`. Expected: FAIL en las nuevas.

- [ ] **Step 3: Implement** en `web-contrato.ts`, `correo.ts` y `TarjetaSolicitud.tsx` (chip con la clase `etiqueta` existente, texto «Pago por partes»).

- [ ] **Step 4: Run the whole suite.** Run: `npm test && PROSPECTOS_TEST_DB=1 npm test`. Expected: todo en verde.

- [ ] **Step 5: Commit y desplegar.** `git add src tests && git commit -m "feat(web): forma de pago del embudo (pago) en respuestas, correo, tarjeta y pasos; origen por-partes"`. Desplegar según el CLAUDE.md del panel: pausar `correos_automatico` en Ajustes, `set -a; . ~/.config/prospectos/env; set +a; npm run build && pm2 list && pm2 restart prospectos`, comprobar `pm2 list` (online, contador +1), `curl -s -o /dev/null -w '%{http_code}' https://prospectos.neracosu.com/entrar` = 200, reactivar el automático. `git push origin main`.

---

### Task 6: La landing `/por-partes` generada

**Files:**
- Create: `/home/neracosu/build-para/body-por-partes.html`, `/home/neracosu/build-para/head-por-partes.tpl`, `/home/neracosu/build-para/jsonld-por-partes.json`, `/home/neracosu/public_html/assets/css/por-partes.css`
- Modify: `/home/neracosu/build-para/pages.json` (entrada nueva), `/home/neracosu/build-para/build.py` (campos opcionales `out` y `head`), `/home/neracosu/build-para/precios.py` (bloque `PARTES_TABLA` escrito en `body-por-partes.html`, idempotente por `id="cuanto"`), `/home/neracosu/build-para/nera.py` y `medir.py` (línea 36 y 19: sumar `"por-partes.html"`), `/home/neracosu/public_html/sitemap.xml`, `/home/neracosu/public_html/llms.txt`
- Test: `/home/neracosu/build-para/pruebas/partes.test.py` (tabla) y `/home/neracosu/build-para/pruebas/embudo/por-partes.test.cjs` (nuevo, publicación y botones)

**Interfaces:**
- Consumes: `partes()`, `money_dec()`, `NICHOS` (los cinco con `partes=True`, sus `planes` y `mensual`) de Task 1-2.
- Produces: `pages.json` acepta `"out": "/home/neracosu/public_html/por-partes.html"` y `"head": "head-por-partes.tpl"`; `build.py` usa `OUT / slug` cuando no hay `out`; `precios.py` expone `tabla_partes() -> str` (un `<details>` por rubro, comercio abierto, filas plan · precio de lista · inicial · 12 cuotas de · mensualidad aparte) y lo escribe entre `<!--partes-tabla-->` y `<!--fin-partes-tabla-->` en `body-por-partes.html`.

- [ ] **Step 1: Write the failing tests**

```python
    def test_tabla_partes(self):
        h = precios.tabla_partes()
        self.assertEqual(h.count("<details"), 5)
        self.assertIn("<details open", h)          # comercio abierto
        self.assertIn("$156,25", h); self.assertIn("$100 / mes", h)
        self.assertNotIn("290", h)                  # sin planes de emprendimiento
```

```js
// por-partes.test.cjs (pega contra el servidor local 8098)
test('la landing carga sin redesign.css ni fuentes externas y con los dos botones a /empezar?pago=partes', ...);
test('el script en linea propaga ?de=tiktok a los botones', ...); // visitar /por-partes.html?de=tiktok, leer href
test('las cifras de comercio coinciden con /para/comercio-y-tienda', ...); // $625 y $156,25 en ambas
```

- [ ] **Step 2: Run tests to verify they fail.** Expected: `AttributeError: tabla_partes` y 404 de `/por-partes.html`.

- [ ] **Step 3: Implement.** `build.py`: `dest = pathlib.Path(p["out"]) if p.get("out") else OUT / p["slug"]`, `HEAD` por página si `p.get("head")`, y `url_slug` = `"por-partes"` para esa entrada (el `canonical` del head propio es literal). `head-por-partes.tpl`: copia de `head.tpl` sin `redesign.css` ni `nicho.css`, con `fuentes.css`, `por-partes.css`, canonical `https://neracosu.com/por-partes`, OG `assets/img/og-por-partes.jpg`, y el script en línea (6 líneas) que lee `de`/`utm_source` de `location.search` y lo agrega a cada `a[href^="/empezar"]`. `body-por-partes.html`: las siete secciones del spec con las clases de `embudo.css` adaptadas en `por-partes.css` (tokens copiados, sin animaciones). `precios.py`: `tabla_partes()` y su escritura idempotente. `nera.py`/`medir.py`: sumar la página. `sitemap.xml`: `<url>` con `lastmod` de hoy; `llms.txt`: una línea en la sección de páginas.

- [ ] **Step 4: Generar.** Run: `cd ~/build-para && python3 precios.py | tail -2 && python3 build.py | tail -4`. Expected: `OK /home/neracosu/public_html/por-partes.html (...)` sin placeholders, Nera y medición con `modificadas: 1` más.

- [ ] **Step 5: Run tests.** Python como Task 1; `node --test --test-concurrency=1 por-partes.test.cjs`. Expected: verde.

- [ ] **Step 6: Tarjeta OG.** Crear `~/build-para/og-card-por-partes.html` (copia de `og-card-empezar.html` con el titular «Empiece hoy con su sistema y páguelo mes a mes») y renderizarla a `assets/img/og-por-partes.jpg` (1200×630, JPG calidad 85) con el Chromium de Playwright, como en el plan de `/empezar` (línea 221 de ese plan).

- [ ] **Step 7: En vivo y Lighthouse.** Run: `curl -s -o /dev/null -w '%{http_code}\n' https://neracosu.com/por-partes` = 200 y `.../por-partes.html` = 301; Lighthouse móvil como en el plan de `/empezar` (línea 225) → `performance ≥ 0.90`, `accessibility = 1`. Captura a 390 px de las siete secciones y revisión visual.

- [ ] **Step 8: Commit.** `git add por-partes.html assets/css/por-partes.css assets/img/og-por-partes.jpg sitemap.xml llms.txt && git commit -m "feat: landing /por-partes generada desde precios.py, con tabla por rubro, OG propia y origen de campana"`.

---

### Task 7: El asistente de `/para/` menciona las dos formas

**Files:**
- Modify: `/home/neracosu/public_html/assets/js/asistente.js` (`NICHOS` líneas 19-105: campo `partes: true` en hoteles, restaurantes, reservas, comercio y citas; la función que pinta el resultado)

**Interfaces:**
- Produces: en el resultado de un nicho con `partes`, el párrafo «Puede pagarlo de una vez, con la promoción de contado, o empezar hoy y pagar por partes: <a href="/por-partes">cómo funciona</a>.»; en cobros, logística, encargo e instagram, nada.

- [ ] **Step 1: Comprobación previa.** Run: `grep -c 'por-partes' ~/public_html/assets/js/asistente.js`. Expected: `0`.
- [ ] **Step 2: Implement** el campo y el párrafo.
- [ ] **Step 3: Verificar en el navegador.** Recorrer `/para/#asistente` a 390 px eligiendo comercio y luego cobros; el párrafo aparece solo en el primero.
- [ ] **Step 4: Sellar y commit.** `cd ~/build-para && python3 versionar-assets.py | tail -1`; `git add assets/js/asistente.js para/ && git commit -m "feat(asistente): las dos formas de pago en los nichos con partes"`.

---

### Task 8: Fila «Por partes» en las plantillas de propuestas

**Files:**
- Modify: `/home/neracosu/public_html/prospectos.neracosu.com/plantillas/base/{hoteles,hoteles-estadia,restaurantes-y-bares,comercio-y-tienda,farmacias,citas-y-servicios,reservas}.cuerpo.html` (tabla de precios: después de la fila «Servicio mensual», como la línea 220 de comercio) y `plantillas/base/condiciones.html` (dos `<li>` dentro de `<!--si:ve-->`)
- Test: `scripts/verificar-plantillas.mts` (existe) y `tests/propuesta-contrato.test.ts` (si asevera filas)

**Interfaces:**
- Produces: fila `<tr><th scope="row">Por partes: inicial y 12 cuotas (mensualidad aparte)</th><td>$625 + 12 × $156,25</td>...` con las cifras de cada plan calculadas con `partes()` de Task 1 (a mano, como ya están los precios); en condiciones: «Pago por partes: 25 % de inicial y 12 cuotas mensuales sobre el precio de lista, sin la promoción de contado; el sistema queda alojado con NERACOSU hasta la última cuota y se entrega en su dominio al terminar.» y «La mensualidad de servicio corre aparte desde el mes siguiente a la puesta en marcha, también por partes.»

- [ ] **Step 1: Implement** las siete filas y las dos líneas (nunca en `cobros-y-pagos`, `cobros-y-pagos-co`, `comida-por-encargo`, `tienda-por-instagram`; la fila va dentro de `<!--si:ve-->…<!--fin:ve-->` donde la plantilla tenga versión Colombia).
- [ ] **Step 2: Regenerar y verificar.** Run: `python3 scripts/armar-plantillas.py | tail -3 && npx tsx scripts/verificar-plantillas.mts 2>&1 | tail -12`. Expected: `ok` en todas; farmacias 10 hojas, las demás 9 (ninguna se desborda).
- [ ] **Step 3: Run the suite.** `npm test`. Expected: verde.
- [ ] **Step 4: Commit y push.** `git add plantillas && git commit -m "feat(plantillas): fila de pago por partes y condiciones en las siete propuestas alojadas" && git push origin main`.

---

### Task 9: Contrato, documentación y recorrido final

**Files:**
- Create: `~/propuestas/PLANTILLA-CUOTAS.md` (fuera del repo; desde `~/propuestas/condiciones-pago-por-partes.md`)
- Modify: `/home/neracosu/public_html/CLAUDE.md` (sección «Los precios viven en un solo sitio»: párrafo «Pago por partes» con las constantes, los cinco rubros, la landing generada, y la regla de enero de 2027), `prospectos.neracosu.com/CLAUDE.md` (una nota sobre `respuestas.pago` y la fila de las plantillas), memoria del proyecto

- [ ] **Step 1: Escribir el contrato** de una página en español llano con las condiciones (sin «crédito», sin nombres de clientes).
- [ ] **Step 2: Documentar** en los dos `CLAUDE.md` y en `~/.claude/projects/-home-neracosu-public-html/memory/project_pago_en_cuotas.md`.
- [ ] **Step 3: Recorrido final a 390 px** con Playwright: `/para/comercio-y-tienda#precios` (línea y bloque), `/empezar` completo por el camino de partes hasta «Recibido» con la solicitud interceptada, `/por-partes` de arriba abajo, y la ficha de una solicitud en el panel con el chip. Capturas revisadas a ojo.
- [ ] **Step 4: Verificación mínima de la cuenta.** `pm2 list` con `prospectos` online y sin reinicios de más; `curl` 200 a `/`, `/para/`, `/empezar`, `/por-partes`, `prospectos.neracosu.com/entrar`.
- [ ] **Step 5: Commit y push final.** `git add CLAUDE.md docs/ && git commit -m "docs: pago por partes publicado; reglas y fuente de las cifras" && git push origin main`.
