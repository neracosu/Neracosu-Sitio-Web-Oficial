// Sitio de Atalaya: iconos pixel, escena del inicio, calculadora, galeria de temas, entrar a una pantalla y guias
import { px } from './pixicons.js?v=c5d987b20f';

const $ = id => document.getElementById(id);
// capturas junto a este script: assets/img/ (funciona desde /atalaya/ y desde /atalaya/guias/)
const IMG = new URL('../img/', import.meta.url).href, V = '0.31.0';
document.querySelectorAll('[data-px]').forEach(el => { el.outerHTML = px(el.dataset.px); });

// escena pixel en vivo (simulada)
if ($('hero')) import('./hero.js?v=b4b5398393').then(m => m.hero($('hero'), $('ticker')));

// calculadora: todo en el navegador, con los numeros del visitante
const calc = $('calc');
if (calc) {
  const n = id => Math.max(0, Number($(id).value) || 0);
  const money = v => '$' + Math.round(v).toLocaleString('es-VE');
  const run = () => {
    const watch = n('c-min') * 22 / 60;          // dias habiles al mes
    const late = n('c-inc') * n('c-hrs');
    const hours = watch + late, month = hours * n('c-rate');
    $('r-h').textContent = Math.round(hours).toLocaleString('es-VE');
    $('r-m').textContent = money(month);
    $('r-y').textContent = money(month * 12);
    $('r-note').textContent = `${Math.round(watch)} h se van en revisar paneles y ${Math.round(late)} h en apagar incendios que alguien más vio primero. ` +
      `Con ${n('c-proj')} proyectos, una pantalla que ya está abierta le devuelve la mayor parte de ese tiempo.`;
  };
  calc.addEventListener('input', run);
  run();
}

// galeria de temas (capturas reales en modo publico)
const THEMES = [
  ['ciudad', 'Ciudad clásica', 'Distritos isométricos en pixel art, edificios, robots e invasores.'],
  ['villa', 'Villa', 'RPG de casillas: castillo, pueblos amurallados, aldeanos, slimes y magos.'],
  ['oficina', 'Oficina', 'Pixel art isométrico: salas, escritorios con su empleado, aviones de papel y globos de diálogo.'],
  ['castillo', 'Castillo', 'Gótico de costado: torre del reloj, vitrales, murciélagos, espectros y cazadoras.'],
  ['raid', 'Raid', 'Banda de MMO: héroes con vida y maná, números de combate y El Intruso, el jefe.'],
  ['ciudad3d', 'Ciudad 3D', 'La ciudad de noche en 3D: torres que crecen con la memoria, ventanas que se encienden con las visitas.'],
  ['acuario', 'Acuario', 'Una pared de peceras: cada cuenta en su pecera, cada proyecto un pez.'],
  ['ops', 'Ops', 'Mesa táctica holográfica: columnas, misiles y drones.'],
  ['planta', 'Planta', 'Fábrica con paleta de consola retro: naves, máquinas, cintas y drones.'],
  ['terminal', 'Terminal', 'Consola de fósforo verde: cada proyecto en su línea, visitas por tail -f.'],
];
const tabs = $('themeTabs');
if (tabs) {
  const pick = id => {
    const t = THEMES.find(x => x[0] === id);
    $('themeImg').src = `${IMG}theme-${id}.webp?v=${V}`;
    $('themeImg').alt = `Tema ${t[1]} de Atalaya`;
    $('themeCap').innerHTML = `<b>${t[1]}.</b> ${t[2]}`;
    tabs.querySelectorAll('button').forEach(b => b.setAttribute('aria-selected', b.dataset.t === id ? 'true' : 'false'));
  };
  tabs.innerHTML = THEMES.map(([id, name]) => `<button role="tab" data-t="${id}">${name}</button>`).join('');
  tabs.addEventListener('click', e => { const b = e.target.closest('button'); if (b) pick(b.dataset.t); });
  pick('ciudad');
  // se precargan de a una para que el cambio sea instantaneo
  let i = 0; const pre = () => { if (i < THEMES.length) { const im = new Image(); im.onload = im.onerror = pre; im.src = `${IMG}theme-${THEMES[i++][0]}.webp?v=${V}`; } };
  addEventListener('load', () => setTimeout(pre, 1500));
}

// entrar a una pantalla existente
$('go')?.addEventListener('submit', e => {
  e.preventDefault();
  const s = $('slug').value.trim().toLowerCase().replace(/^.*nube\.neracosu\.com\//, '').replace(/\/.*$/, '');
  if (s) location.href = '/' + encodeURIComponent(s) + '/';
});

// guias: copiar comandos y marcar la seccion visible en el indice
document.querySelectorAll('pre.cmd').forEach(pre => {
  const b = document.createElement('button');
  b.className = 'copy'; b.type = 'button'; b.textContent = 'Copiar';
  b.addEventListener('click', () => navigator.clipboard?.writeText(pre.querySelector('code')?.textContent || pre.firstChild.textContent).then(() => { b.textContent = 'Copiado'; setTimeout(() => { b.textContent = 'Copiar'; }, 1800); }));
  pre.appendChild(b);
});
const toc = document.querySelector('.toc');
if (toc) {
  const links = new Map([...toc.querySelectorAll('a[href^="#"]')].map(a => [a.getAttribute('href').slice(1), a]));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { links.forEach(a => a.classList.remove('on')); links.get(e.target.id)?.classList.add('on'); } }), { rootMargin: '-20% 0px -70% 0px' });
  document.querySelectorAll('.guide[id]').forEach(s => io.observe(s));
}
