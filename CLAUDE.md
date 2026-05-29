# neracosu.com — Notas para Claude

## Estructura

Sitio estático servido desde `/home/neracosu/public_html/`. La home (`index.html`) usa el rediseño 2026. Subdominios y subdirectorios (`/blog/`, `/calculadora.html`, `/servicios/`, `ameb.app/`, `zafraclic.com/`, `glotracol.neracosu.com/`, `ourstory.lat/`) son independientes — el rediseño solo toca la home.

## Stack de la home

- HTML estático + CSS plano + JS vanilla. **Sin React, sin Babel-CDN, sin Tailwind.**
- Fuentes: Inter (400–900) + Plus Jakarta Sans + Instrument Serif (italic).
- HLS.js para el video del hero (Mux stream).
- Tokens: `--bg: #070b0a`, `--accent: #5ed29c`.

## Archivos del rediseño

- `index.html` — home (12 secciones)
- `assets/css/redesign.css` — todos los estilos
- `assets/js/redesign.js` — interactividad (nav scroll, mobile menu, FAQ accordion, HLS init, contact form → WhatsApp deep-link, split-text, smooth scroll)
- `index.html.backup-pre-redesign` — copia del index.html anterior (Mar 2025)

## Decisiones importantes

- **La calculadora (`/calculadora.html`) es central.** Aparece destacada en el nav (pill verde, posición 3 de 6), en el overlay móvil, y como primer item del footer en verde. No quitar ni mover sin avisar al dueño.
- **Formulario de contacto** abre WhatsApp con el mensaje prellenado (no hay backend de email). Si se cablea Formspree/Resend, modificar `data-contact-form` handler en `assets/js/redesign.js`.
- **SEO preservado**: meta tags completos, OpenGraph, Twitter Card, hreflang, geo tags (La Guaira: 10.6031, -66.9354), canonical, y 2 bloques JSON-LD (`ProfessionalService` + `Person`). Mantener al editar el `<head>`.
- **Avatar "NC" y video HLS de Mux** son placeholders del prototipo. Reemplazar cuando haya foto real / video propio.

## Cómo revertir

```bash
cp /home/neracosu/public_html/index.html.backup-pre-redesign /home/neracosu/public_html/index.html
```

El sitio anterior (Three.js + Space Grotesk + JetBrains Mono) seguía usando `/assets/css/style.css`, `/assets/css/promo.css`, etc. Esos archivos siguen en disco — no se borraron.

## Idioma

El dueño y todo el contenido público es en **español (Venezuela)**. Responder en español por defecto.
