# Páginas de respuesta en /servicios/ — diseño

Fecha: 2026-10-26 · Dueño: Neri Colón · Sitio: neracosu.com (estático, `public_html/`)

## Por qué

El 26-oct-2026 llegó por WhatsApp una prospecta de una marca de ropa con 13 locales.
La medición propia (`EventoWeb` del panel de prospección) muestra de dónde vino: **chatgpt.com →
`/servicios/pasarelas-de-pago.html` → clic a WhatsApp en un minuto**. ChatGPT la mandó porque esa
página responde casi literal lo que ella preguntó («integrar una pasarela de pago en mi web de Shopify»).

Neri quiere repetir eso a propósito: páginas que respondan preguntas concretas que la gente le hace a
Google y a los asistentes de IA, para que lo recomienden. Más visitas que terminen en un contacto.

## Qué es

Una capa nueva de páginas en `/servicios/`, una por pregunta. No reemplaza las nueve páginas de categoría
que ya existen (apps, desarrollo web, ecommerce, pasarelas, sistemas de gestión, ciberseguridad, hosting,
optimización, índice): se cuelga de ellas.

- **Público** (Neri): cualquier tamaño y nicho, «desde una tiendita hasta la marca ZARA».
- **Alcance** (Neri): **toda Latinoamérica**, no solo Venezuela.
- **Pagos por país** (Neri): Venezuela → Pago Móvil y C2P (validación automática con la plataforma de
  validación de pagos); Colombia → Wompi (Neri ya lo integra); el resto → Stripe.
- **Temas** (Neri: «me gusta todo»): las 18 de la lista de abajo, «y más que abarquen mis habilidades».

## Las 18 páginas, en tandas

Orden de construcción. Cada tanda se publica, se mide unos días y se ajusta lo que haga falta antes de la siguiente.

| # | Página (la pregunta que responde) | Página madre | Prueba real que puede citar |
|---|---|---|---|
| **Tanda 1** | | | |
| 1 | Cómo cobrar con Pago Móvil en Shopify | pasarelas-de-pago | VIP Play y Terrazas validan solos hoy. La conexión con Shopify **no está construida**: se explica cómo se hace, no se cita una tienda que ya lo use |
| **Tanda 2 · Pagos** | | | |
| 2 | Pago Móvil y C2P en WooCommerce o WordPress | pasarelas-de-pago | Plugin WooCommerce de Glotracol (sin decir que es de pagos si no lo es) |
| 3 | Cómo validar pagos móviles sin revisar capturas | pasarelas-de-pago | VIP Play, Terrazas |
| 4 | Cómo integrar Wompi en su web (Colombia) | pasarelas-de-pago | Neri ya integra Wompi; **sin nombrar clientes ni proyectos** (Neri, 2026-10-26) |
| 5 | Cómo cobrar con Stripe desde Latinoamérica: qué se necesita | pasarelas-de-pago | Requisitos públicos de Stripe |
| **Tanda 3 · Apps y web** | | | |
| 6 | Qué hace falta para hacer la app de su negocio | aplicaciones-moviles | Papel Cebolla, Mishis, Hotel Marte (anónimo) |
| 7 | App instalable desde la web o app en las tiendas: cuál le conviene | aplicaciones-moviles | Papel Cebolla, Mishis |
| 8 | Qué debe tener la página web de un negocio que vende | desarrollo-web | neracosu.com (PageSpeed 95/100) |
| 9 | Tienda virtual: Shopify, WooCommerce o a la medida | ecommerce | Glotracol (WooCommerce, cotizaciones B2B); Adastram (a la medida). Ninguna tienda Shopify propia que citar |
| **Tanda 4 · Bots y automatización** | | | |
| 10 | Bot de WhatsApp para atender y cobrar | sistemas-de-gestion | Hotel VIP La Guaira, VIP Play y Terrazas VIP (Neri, 2026-10-26) |
| 11 | Qué tareas de su negocio se pueden automatizar | sistemas-de-gestion | Tasa BCV automática, avisos push, cierres (Hotel Marte) |
| 12 | Conectar sus sistemas por API | sistemas-de-gestion | LobbyPMS, GoHighLevel, TTLock |
| **Tanda 5 · Sistemas por actividad** | | | |
| 13 | Sistema de reservas en línea | sistemas-de-gestion → `/para/reservas` | Terrazas |
| 14 | Pedidos en línea para restaurante o bar | sistemas-de-gestion → `/para/restaurantes-y-bares` | VIP Play |
| 15 | Sistema para hotel | sistemas-de-gestion → `/para/hoteles` | Hotel Marte, **anónimo** |
| **Tanda 6 · Infraestructura y seguridad** | | | |
| 16 | Qué hacer si hackearon su web | ciberseguridad | Consejo general |
| 17 | Monitorear sus servidores | hosting | Atalaya Monitor Server |
| 18 | Por qué su web carga lento y cómo se arregla | optimizacion-web-y-seo | neracosu.com 83 → 95 |

## Metas

- Que Google y los asistentes de IA citen estas páginas al responder esas preguntas.
- Que cada página termine en un contacto: WhatsApp, `/para/` o la calculadora.
- Medible con lo que ya existe: `EventoWeb` guarda la ruta y el origen de cada vista y los clics a WhatsApp.
  Éxito = visitas con origen de buscador o de IA en estas rutas, y clics a WhatsApp desde ellas.

## Lo que no es

- No es un blog. Cada página responde una pregunta y vende un servicio. El blog (`/blog/`) sigue aparte.
- No cambia las nueve páginas de categoría, salvo para agregar enlaces a sus páginas hijas.
- No toca la home ni `/para/`, salvo enlaces si hicieran falta, siempre por el armado (`build-para`).

## Lo que la haría fracasar aunque funcione

- **Prometer lo que no está hecho.** Regla del sitio: cada cifra y cada afirmación sale de algo verificable
  o no va. Fuera de Venezuela, solo se ofrece como hecho lo que Neri ya hizo (Wompi en Colombia). Stripe se
  explica con sus requisitos reales: abre cuentas a negocios de pocos países de la región (p. ej. México y
  Brasil); en el resto se necesita una empresa en EE. UU.
- **Texto de relleno escrito para robots.** Si no le sirve a una persona, tampoco lo va a citar una IA.
  Cada página contesta la pregunta en su primer párrafo.
- **Que parezcan generadas por IA** (preferencia de Neri: tono humano, sin exceso de emojis).
- **Páginas lentas.** La de optimización bajó de 97 a 67 en móvil con las librerías de animación.

## Reglas del sitio que aplican (de `public_html/CLAUDE.md`)

- **Sin precios** en `/servicios/`. Mandan a `/para/` y a la calculadora. La única cifra permitida es el hosting a $8/mes.
- **Voz: usted**, español llano, sin jerga de cara al cliente, con el cierre honesto («se lo digo de una vez»).
  Contenido para toda Latinoamérica: neutro, sin modismos que solo entienda un venezolano, salvo en las páginas
  que son de Venezuela (la 1, la 2 y la 3).
- **ArmorPay** se llama siempre «plataforma de validación de pagos», nunca «pasarela» ni «gateway». La palabra
  «pasarela» sí puede aparecer en lo que el cliente busca («¿necesita una pasarela de pago?»), como ya hace
  `pasarelas-de-pago.html`.
- **Hotel Marte anónimo** («un hotel de alta rotación en Valencia, Carabobo», sin número de habitaciones).
  **ZafraClic y Gustito Xpress no se nombran. G&G Shopping no se presenta como trabajo propio.**
- **No decir que neracosu.com fue hackeado** (página 16: consejo general).
- **Sin testimonios inventados.**
- **Ninguna librería de animación** (GSAP, ScrollTrigger, Lenis, anime.js) en estas páginas.
- **Fuentes alojadas en el sitio** (`assets/css/fuentes.css`), nunca Google Fonts.
- **SEO completo en el `<head>`**: meta, canonical, OpenGraph, Twitter Card, hreflang y JSON-LD.
- Al crear cada página, correr `python3 ~/build-para/nera.py`, `python3 ~/build-para/medir.py` y
  `python3 ~/build-para/versionar-assets.py` (broma de Nera, medición y sello de los assets).
- Revisar cada página **a 390 px** en un navegador headless antes de publicarla.
- Agregar cada página a `sitemap.xml` con la fecha del día.

## Cómo se hacen (decisiones mías)

- **Plantilla:** la estructura de `servicios/optimizacion-web-y-seo.html` (la ligera): `landing-hero`,
  secciones `landing-features` / `landing-pain`, `landing-faq` y `landing-cta`, con los mismos CSS y sin
  scripts de animación.
- **Dirección:** plana, `/servicios/<slug>.html`, igual que las existentes. Slug con la pregunta en palabras
  que la gente busca (p. ej. `pago-movil-en-shopify.html`).
- **Orden de cada página:**
  1. Titular con la pregunta tal como la buscan.
  2. Respuesta corta en el primer párrafo, lo que diría a un amigo en dos frases.
  3. Cómo se resuelve, paso por paso.
  4. Lo que no se puede o depende de otros, dicho de frente.
  5. Caso real, si existe.
  6. Preguntas frecuentes (con JSON-LD `FAQPage`).
  7. Cierre con WhatsApp y un enlace a la página madre, a `/para/` o a la calculadora.
- **Enlaces:** cada página madre de `/servicios/` gana un bloque «Preguntas sobre este tema» con sus hijas, y
  `servicios/index.html` las lista todas. Las hijas enlazan entre sí cuando el tema se toca.
- **Títulos:** sin «en Venezuela» salvo en las páginas que son solo de Venezuela.
- **`llms.txt`** en la raíz del sitio, con la lista de estas páginas y una línea de qué responde cada una, para
  los asistentes de IA que lo leen. Es barato. Queda a juicio del constructor si lo hace en la tanda 1 o al final.
- **WhatsApp con texto listo:** el botón de cada página abre WhatsApp con un mensaje que nombra el tema
  (p. ej. «Hola Neri, vengo de la página de Pago Móvil en Shopify»). Así Neri sabe de dónde vino cada persona,
  sin tener que preguntarlo.

## Lo que queda al constructor

- El texto de cada página, siguiendo las reglas de arriba.
- Qué imágenes usar (capturas propias en `assets/img/`, comprimidas en webp). Nada de bancos de imágenes genéricas.
- Las preguntas frecuentes de cada página.
- Los commits: uno por página o uno por tanda, en `main`, con el formato de mensajes del repo.

## Hechos verificados para escribir

- **Shopify (página 1):** Shopify no deja agregar un método de pago propio a su caja de pago sin ser socio
  aprobado. La solución es la de la propuesta a ese prospecto: pago manual en la caja de Shopify («Pago Móvil»,
  «Transferencia», «Zelle»), botón «Reportar mi pago» en la página de confirmación y en el correo del pedido,
  validación aparte y el pedido marcado como pagado por la API de Shopify. Está diseñada, no construida: la
  página lo explica como método, sin decir que ya corre en una tienda.
- **Validación automática hoy** (Neri, 2026-10-26): VIP Play (vipplaysportbar.com, pedidos en línea) y
  Terrazas VIP (terrazasvip.com, reservas; su web anuncia que reabrió el 23-oct) validan solos. Bancos en
  producción: Banco de Venezuela, Banco del Tesoro y Banco Digital de los Trabajadores. Valida Pago Móvil y C2P,
  **no transferencias**. Con otros bancos se gestiona la afiliación, sin plazo garantizado.
- **Glotracol** ya aparece con nombre en la home: se puede citar. Su plugin es de cotizaciones B2B
  (WooCommerce), no de pagos.

## Decisiones mías tras la revisión

- **Cifras de terceros** (comisiones de Stripe, Wompi, Shopify, tiendas de apps): no se escriben. Cambian y
  no hay quien las mantenga al día. Se explica de qué depende el costo y se enlaza la página oficial de precios.
- **Ritmo entre tandas:** no se espera a medir para seguir. Se construye una tanda tras otra; la medición corre
  en paralelo y se revisa al cerrar cada tanda por si algo pide cambiar el enfoque. Neri ve un resumen por tanda.
- **Locale:** las páginas para toda la región llevan `og:locale` `es_LA` y `hreflang` `es-419` y `x-default`.
  Las de Venezuela (1, 2, 3) mantienen `es_VE`. Los geo tags de La Guaira se quedan en todas: dicen dónde está
  el negocio, que es cierto.

## Datos a confirmar con Neri antes de escribir ciertas páginas

Respondido por Neri el 2026-10-26:
- Página 4: Wompi sí, pero sin datos de clientes: no se especifica con quién.
- Página 10: los bots de WhatsApp funcionan en Hotel VIP La Guaira, VIP Play y Terrazas VIP.
- Página 2: sin respuesta sobre un caso WooCommerce → decisión mía: la página explica el método (igual que
  la 1) y cita la validación de VIP Play y Terrazas.
