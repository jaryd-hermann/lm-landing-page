(function () {
  function isDesktop() {
    var ua = /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent || '');
    var coarse = window.matchMedia && window.matchMedia('(pointer:coarse)').matches;
    return !ua && !coarse && window.innerWidth >= 860;
  }
  function openModal() {
    var m = document.getElementById('lm-modal');
    if (!m) return;
    m.style.display = 'flex';
    requestAnimationFrame(function () { m.classList.add('lm-open'); });
  }
  function closeModal() {
    var m = document.getElementById('lm-modal');
    if (!m) return;
    m.classList.remove('lm-open');
    setTimeout(function () { m.style.display = 'none'; }, 260);
  }
  // Click delegation on document survives React re-mounting the nodes.
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    if (t.closest('[data-close]')) { closeModal(); return; }
    if (t.id === 'lm-modal') { closeModal(); return; }
    // On desktop, App Store links open the scan-to-download QR modal instead of
    // navigating. On mobile/tablet they fall through to the real App Store URL.
    var a = t.closest('a[data-appstore], a[href="#get"]');
    if (a && isDesktop()) { e.preventDefault(); openModal(); }
  }, false);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

  // Reveal-on-scroll + floating CTA. Re-queries live DOM each tick so it is
  // robust to mount timing and any re-render.
  function tick() {
    if (!document.body.classList.contains('lm-animate')) document.body.classList.add('lm-animate');
    var vh = window.innerHeight || 800;
    var els = document.querySelectorAll('.lm-feat>div');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.classList.contains('lm-in')) continue;
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.88 && r.bottom > 0) el.classList.add('lm-in');
    }
    var fc = document.getElementById('lm-float');
    if (fc) {
      var getEl = document.getElementById('get');
      var nearEnd = getEl && getEl.getBoundingClientRect().top < vh * 0.85;
      if ((window.scrollY || window.pageYOffset) > 520 && !nearEnd) fc.classList.add('lm-show');
      else fc.classList.remove('lm-show');
    }
  }
  window.addEventListener('scroll', tick, { passive: true });
  window.addEventListener('resize', tick);
  window.addEventListener('load', function () { tick(); setTimeout(tick, 300); setTimeout(tick, 1000); });
  var n = 0, iv = setInterval(function () { tick(); if (++n > 24) clearInterval(iv); }, 180);
})();
