document.addEventListener('DOMContentLoaded', () => {
  // SCROLL REVEAL
  const rio = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } });
  }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => rio.observe(el));

  // CURSOR LOGIC
  const cur = document.getElementById('cur');
  if (window.matchMedia('(pointer:fine)').matches && cur) {
    let mx = -100, my = -100, cx = -100, cy = -100;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY });
    document.addEventListener('mousedown', () => cur.classList.add('c'));
    document.addEventListener('mouseup', () => cur.classList.remove('c'));
    document.querySelectorAll('a, button, .wcard, .svc, .hstat, .bc, .btn-p, .btn-g').forEach(el => {
      el.addEventListener('mouseenter', () => cur.classList.add('h'));
      el.addEventListener('mouseleave', () => cur.classList.remove('h'));
    });
    (function loop() {
      cx += (mx - cx) * 0.16; cy += (my - cy) * 0.16;
      cur.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();
  }

  // Spotlight effect for bento items
  document.querySelectorAll('.bento-item, .svc').forEach(item => {
    item.addEventListener('mousemove', e => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      item.style.setProperty('--mx', `${x}px`);
      item.style.setProperty('--my', `${y}px`);
      // Standardize variables
      item.style.setProperty('--mouse-x', `${x}px`);
      item.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // Magnetic Buttons
  document.querySelectorAll('.btn-p, .btn-g').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const h = rect.width / 2;
      const v = rect.height / 2;
      const x = e.clientX - rect.left - h;
      const y = e.clientY - rect.top - v;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.02)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
});
