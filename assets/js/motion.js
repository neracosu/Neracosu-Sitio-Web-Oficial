/* ============================================================
   neracosu.com — Motion layer 2026
   Built on Anime.js v4 (loaded from CDN as ES module).
   Patterns: A·orbs · B·grid-wave · D·counters · E·headline-mask · G·scroll-stagger
   All patterns respect prefers-reduced-motion.
   ============================================================ */

import {
  animate,
  createTimeline,
  stagger,
  utils,
} from 'https://cdn.jsdelivr.net/npm/animejs@4.0.2/+esm';

const PREFERS_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------
   A — Floating orbs in hero background
   Injects 4 absolutely-positioned glow orbs into [data-motion-orbs]
   and animates each on a unique loop. Pure transform — composited.
   ------------------------------------------------------------ */
function setupOrbs() {
  const host = document.querySelector('[data-motion-orbs]');
  if (!host) return;

  const orbs = [
    { hue: '#5ed29c', size: 480, x: 8,  y: 18, dx: 6,  dy: -4, dur: 14000 },
    { hue: '#22d3ee', size: 380, x: 72, y: 12, dx: -5, dy: 6,  dur: 17000 },
    { hue: '#5ed29c', size: 320, x: 58, y: 64, dx: 5,  dy: -3, dur: 12000 },
    { hue: '#a78bfa', size: 280, x: 18, y: 72, dx: -4, dy: 4,  dur: 16000 },
  ];

  for (const o of orbs) {
    const el = document.createElement('div');
    el.className = 'motion-orb';
    el.style.cssText = `
      position:absolute;
      width:${o.size}px;height:${o.size}px;
      left:${o.x}%;top:${o.y}%;
      border-radius:50%;
      background:radial-gradient(circle at center, ${o.hue}40 0%, ${o.hue}00 60%);
      filter:blur(40px);
      mix-blend-mode:screen;
      pointer-events:none;
      will-change:transform;
      transform:translate3d(0,0,0);
    `;
    host.appendChild(el);

    if (PREFERS_REDUCED) continue;

    animate(el, {
      translateX: [`${-o.dx}%`, `${o.dx}%`],
      translateY: [`${-o.dy}%`, `${o.dy}%`],
      ease: 'inOutSine',
      duration: o.dur,
      alternate: true,
      loop: true,
    });
  }
}

/* ------------------------------------------------------------
   B — Animated grid wave
   Looks for [data-motion-grid]; injects an SVG grid; runs a
   horizontal wave of opacity across columns continuously.
   ------------------------------------------------------------ */
function setupGridWave() {
  const host = document.querySelector('[data-motion-grid]');
  if (!host) return;

  const COLS = 24;
  const ROWS = 12;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${COLS} ${ROWS}`);
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';

  const lines = [];
  for (let i = 1; i < COLS; i++) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', i); line.setAttribute('y1', 0);
    line.setAttribute('x2', i); line.setAttribute('y2', ROWS);
    line.setAttribute('stroke', '#5ed29c');
    line.setAttribute('stroke-width', '0.01');
    line.setAttribute('opacity', '0.08');
    line.setAttribute('vector-effect', 'non-scaling-stroke');
    svg.appendChild(line);
    lines.push(line);
  }
  for (let j = 1; j < ROWS; j++) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', 0); line.setAttribute('y1', j);
    line.setAttribute('x2', COLS); line.setAttribute('y2', j);
    line.setAttribute('stroke', '#ffffff');
    line.setAttribute('stroke-width', '0.005');
    line.setAttribute('opacity', '0.04');
    line.setAttribute('vector-effect', 'non-scaling-stroke');
    svg.appendChild(line);
  }
  host.appendChild(svg);

  if (PREFERS_REDUCED) return;

  animate(lines, {
    opacity: [
      { to: 0.08, duration: 0 },
      { to: 0.45, duration: 600, ease: 'outQuad' },
      { to: 0.08, duration: 1200, ease: 'inOutSine' },
    ],
    delay: stagger(180, { from: 'first' }),
    loop: true,
    loopDelay: 2400,
  });
}

/* ------------------------------------------------------------
   D — Number counters (hero stats + any [data-counter])
   Looks for any [data-counter] with an integer target.
   ------------------------------------------------------------ */
function setupCounters() {
  const targets = document.querySelectorAll('[data-counter]');
  if (!targets.length) return;

  if (PREFERS_REDUCED) {
    targets.forEach((el) => {
      el.textContent = el.dataset.prefix
        ? `${el.dataset.prefix}${el.dataset.counter}`
        : el.dataset.counter;
    });
    return;
  }

  // Set initial state so layout doesn't shift
  targets.forEach((el) => {
    el.textContent = el.dataset.prefix ? `${el.dataset.prefix}0` : '0';
  });

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target;
        const target = parseFloat(el.dataset.counter);
        const prefix = el.dataset.prefix || '';

        const state = { v: 0 };
        animate(state, {
          v: { to: target, modifier: utils.round(1) },
          duration: 1800,
          ease: 'outExpo',
          onUpdate: () => {
            el.textContent = `${prefix}${state.v}`;
          },
          onComplete: () => {
            el.textContent = `${prefix}${target}`;
          },
        });
        io.unobserve(el);
      }
    },
    { threshold: 0.4 },
  );

  targets.forEach((el) => io.observe(el));
}

/* ------------------------------------------------------------
   E — Headline mask reveal
   Finds [data-motion-headline] and splits its words/chars into
   stagger-revealed elements via clip-path.
   ------------------------------------------------------------ */
function setupHeadlineReveal() {
  const headlines = document.querySelectorAll('[data-motion-headline]');
  if (!headlines.length) return;

  headlines.forEach((root, idx) => {
    // Split each [data-motion-line] into per-character spans
    const lines = root.querySelectorAll('[data-motion-line]');
    const allChars = [];

    lines.forEach((line) => {
      const original = line.textContent;
      line.textContent = '';
      line.style.display = 'inline-block';
      line.style.overflow = 'hidden';
      line.style.verticalAlign = 'top';
      // Build per-char inner spans wrapped to allow vertical translate masking
      for (const ch of original) {
        const wrap = document.createElement('span');
        wrap.style.display = 'inline-block';
        wrap.style.overflow = 'hidden';
        wrap.style.verticalAlign = 'top';
        const inner = document.createElement('span');
        inner.style.display = 'inline-block';
        inner.textContent = ch === ' ' ? ' ' : ch;
        if (PREFERS_REDUCED) {
          inner.style.transform = 'translateY(0)';
          inner.style.opacity = '1';
        } else {
          inner.style.transform = 'translateY(110%)';
          inner.style.opacity = '0';
        }
        wrap.appendChild(inner);
        line.appendChild(wrap);
        allChars.push(inner);
      }
    });

    if (PREFERS_REDUCED) return;

    animate(allChars, {
      translateY: ['110%', '0%'],
      opacity: [0, 1],
      duration: 900,
      ease: 'outExpo',
      delay: stagger(28, { start: 200 + idx * 80 }),
    });
  });
}

/* ------------------------------------------------------------
   G — Scroll-triggered stagger reveal
   Any container with [data-stagger-group] reveals its direct
   children with a small stagger when it enters the viewport.
   ------------------------------------------------------------ */
function setupScrollStagger() {
  const groups = document.querySelectorAll('[data-stagger-group]');
  if (!groups.length) return;

  if (PREFERS_REDUCED) {
    groups.forEach((g) => g.classList.add('motion-revealed'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const group = entry.target;
        const children = Array.from(group.children);
        animate(children, {
          translateY: [32, 0],
          opacity: [0, 1],
          duration: 700,
          ease: 'outQuart',
          delay: stagger(80),
        });
        group.classList.add('motion-revealed');
        io.unobserve(group);
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  );

  groups.forEach((g) => {
    if (!PREFERS_REDUCED) {
      Array.from(g.children).forEach((c) => {
        c.style.opacity = '0';
        c.style.willChange = 'transform, opacity';
      });
    }
    io.observe(g);
  });
}

/* ------------------------------------------------------------
   Boot
   ------------------------------------------------------------ */
function boot() {
  try {
    setupOrbs();
    setupGridWave();
    setupCounters();
    setupHeadlineReveal();
    setupScrollStagger();
  } catch (err) {
    // Non-blocking — site stays functional without motion
    console.warn('[motion] init failed:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
