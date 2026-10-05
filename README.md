# neracosu.com — Sitio Web Oficial

> Sitio personal y portafolio profesional de **Neri Rafael Colón Suárez** — Lead Developer & Platform Architect en La Guaira, Venezuela.

🌐 **Producción**: [neracosu.com](https://neracosu.com)

---

## Stack

Sitio estático con stack vanilla — sin build, sin frameworks de runtime, sin Babel/CDN.

- **HTML5** + **CSS plano** + **JavaScript vanilla**
- **Fuentes**: Inter, Plus Jakarta Sans, Instrument Serif (Google Fonts)
- **Motion**: [Anime.js v4](https://animejs.com/) (módulo ESM desde jsDelivr, ~24 KB)
- **Video hero**: HLS.js (stream Mux)
- **Server**: Apache · cPanel

## Estructura

```
public_html/
├── index.html                  Home (rediseño 2026)
├── hoja-de-vida.html           CV editorial completo (imprimible a PDF)
├── calculadora.html            Wizard de presupuesto interactivo
├── para/                       Landings por nicho (8), ensambladas con build-para/ (fuera del repo)
├── blog/                       Blog estático (15 artículos)
├── servicios/                  Páginas por servicio (7); los precios viven en /para/
└── assets/
    ├── css/
    │   ├── redesign.css        Stack principal del rediseño 2026
    │   ├── unify-2026.css      Override aplicado a blog/ y servicios/ legacy
    │   ├── style.css           Legacy (cargado por blog/servicios)
    │   ├── blog.css            Estilos de artículos
    │   ├── landing.css         Estilos de páginas de servicios
    │   └── calculator.css      Wizard de calculadora
    └── js/
        ├── motion.js           Capa de motion design (Anime.js v4)
        ├── redesign.js         Interactividad del rediseño 2026 (nav, FAQ, form)
        ├── calculator.js       Lógica del wizard de presupuesto
        ├── asistente.js        Asistente de 4 preguntas de /para/ (sin backend)
        ├── calc-fuga.js        Calculadoras «con sus números» de /para/
        ├── nera.js             El mensaje de Nera en la consola (ver abajo)
        └── countdown.js        Countdown legacy
```

## Diseño

- **Paleta**: `--bg: #070b0a` · `--accent: #5ed29c` (verde) · acentos cyan/violeta/dorado en portfolio
- **Tipografía**: Inter para body/headings, Plus Jakarta Sans para nav/labels, **Instrument Serif italic** como acento editorial
- **Motion patterns** (inspirados en [motionsites.ai](https://motionsites.ai/)):
  - Floating orbs en hero (`mix-blend-mode: screen`)
  - Grid lines wave animation
  - Number counters al entrar viewport
  - Headline mask reveal char-by-char
  - Scroll-triggered stagger en grids
  - Respeta `prefers-reduced-motion`

## Cómo desarrollar localmente

No hay paso de build. Cualquier server estático sirve:

```bash
# Opción 1: Python
python3 -m http.server 8000

# Opción 2: PHP (igual al server de producción)
php -S localhost:8000

# Opción 3: Node
npx serve .
```

Abrir [http://localhost:8000](http://localhost:8000).

## Despliegue

Es producción directa — el cambio en disco es el cambio en vivo. Backup antes de tocar `index.html`, `hoja-de-vida.html` o `calculadora.html`:

```bash
cp index.html index.html.backup-$(date +%Y-%m-%d)
```

## El código fuente está «escrito en Nera»

Abra cualquier página y pulse Ctrl+U: lo primero que verá es un programa en
**Nera 0.3.1 «Arepa Estable»**, un lenguaje que no existe. Es una broma para
quien husmea. El HTML real sigue debajo, intacto: lo que se antepone es un
comentario, que los buscadores y las vistas previas ignoran, así que el SEO no
cambia. La consola de F12 también habla (`nera.ayuda()`).

Lo genera `build-para/nera.py` (fuera del repo) en cada regeneración. El
servidor manda `charset=UTF-8` en la cabecera porque el comentario desplaza el
`<meta charset>` fuera de los primeros 1024 bytes.

## Características destacadas

- **Calculadora** (`/calculadora.html`) — wizard de 3 pasos que estima presupuesto y envía a WhatsApp
- **Hoja de Vida** (`/hoja-de-vida.html`) — CV editorial de 7 secciones, descargable como PDF desde el navegador (`?print=1` auto-imprime). Cubre 17 años de oficio, 24 plataformas en producción, 12 entradas de experiencia, 14 certificaciones
- **Portafolio**: 24 plataformas en producción en la home, con captura de la página pública donde la hay
- **Landings por nicho** (`/para/`): precios publicados, calculadoras con los números del cliente y asistente guiado que sale a WhatsApp
- **SEO**: meta tags completos, OpenGraph, Twitter Card, hreflang, geo tags La Guaira, canonical, 2 bloques JSON-LD (`ProfessionalService` + `Person`)
- **Idioma**: Español de Venezuela

## Licencia

Código del sitio © 2026 Neri Rafael Colón Suárez. Reusable como referencia educativa con atribución; el contenido (textos, imágenes, marca personal) es de uso exclusivo del autor.

## Contacto

- 📧 [info@neracosu.com](mailto:info@neracosu.com)
- 📱 [+58 422 270 7095](tel:+584222707095)
- 💼 [linkedin.com/in/ingnrcs](https://linkedin.com/in/ingnrcs)
- 🐙 [github.com/neracosu](https://github.com/neracosu)
- 🌐 [neracosu.com](https://neracosu.com)
