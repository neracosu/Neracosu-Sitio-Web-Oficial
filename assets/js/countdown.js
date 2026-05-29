/* ============================================
   COUNTDOWN TIMER - Promo Marzo 2026
   Target: 31 marzo 2026, 23:59:59 UTC-4
   ============================================ */
(function () {
  var TARGET = new Date('2026-03-31T23:59:59-04:00').getTime();
  var bar = document.getElementById('promo-bar');
  var countdownEl = document.getElementById('countdown');
  var closeBtn = document.getElementById('promo-bar-close');

  if (!bar) return;

  function update() {
    var now = Date.now();
    var diff = TARGET - now;

    if (diff <= 0) {
      hide();
      return;
    }

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (countdownEl) {
      countdownEl.textContent = days + 'd ' + String(hours).padStart(2, '0') + 'h ' + String(mins).padStart(2, '0') + 'm';
    }
  }

  function hide() {
    bar.classList.remove('is-visible');
    document.body.classList.remove('has-promo-bar');
    var header = document.getElementById('header');
    if (header) header.classList.remove('has-promo-bar');
  }

  // Already dismissed or expired — hide immediately (bar is visible by default in HTML)
  if (localStorage.getItem('promo-dismissed') || Date.now() >= TARGET) {
    hide();
    return;
  }

  // Close button
  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      localStorage.setItem('promo-dismissed', '1');
      hide();
    });
  }

  // Promo is active — update countdown
  update();
  setInterval(update, 60000);
})();
