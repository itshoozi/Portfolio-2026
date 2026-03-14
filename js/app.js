document.addEventListener('DOMContentLoaded', () => {
  // SCROLL REVEAL - APPLE CALIBRATED
  const rio = new IntersectionObserver(entries => {
    entries.forEach(e => { 
      if (e.isIntersecting) { 
        e.target.classList.add('in'); 
      } 
    });
  }, { 
    threshold: 0.1, 
    rootMargin: '0px 0px -10% 0px' 
  });
  
  document.querySelectorAll('.reveal').forEach(el => rio.observe(el));

  // PARALLAX MOTION LOGIC
  const heroVisual = document.querySelector('.hero-visual');
  const scene = document.querySelector('.geo');
  const orbs = document.querySelectorAll('.orb');
  
  let scrollY = window.scrollY;
  let targetScrollY = scrollY;
  
  window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY;
  }, { passive: true });

  function tick() {
    scrollY += (targetScrollY - scrollY) * 0.1;
    
    // Parallax background elements
    if (scene) {
      scene.style.transform = `translate3d(0, ${scrollY * 0.15}px, 0)`;
    }
    
    // Parallax orbs
    orbs.forEach((orb, i) => {
      const depth = (i + 1) * 0.1;
      orb.style.transform = `translate3d(0, ${scrollY * depth}px, 0)`;
    });

    // Tilt hero visual cards on scroll
    if (heroVisual) {
      const cards = heroVisual.querySelectorAll('.vcard');
      cards.forEach((card, i) => {
        const speed = (i + 1) * 0.05;
        const rotate = (scrollY * 0.02);
        const currentTransform = window.getComputedStyle(card).transform;
        // Apply delicate parallax to cards
        card.style.transform = `${currentTransform} translateY(${scrollY * speed}px)`;
      });
    }

    requestAnimationFrame(tick);
  }
  tick();

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
    (function cursorLoop() {
      cx += (mx - cx) * 0.14; cy += (my - cy) * 0.14;
      cur.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(cursorLoop);
    })();
  }

  // Smooth Spotlight effect
  document.querySelectorAll('.svc, .bc').forEach(item => {
    item.addEventListener('mousemove', e => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      item.style.setProperty('--mx', `${x}px`);
      item.style.setProperty('--my', `${y}px`);
    });
  });

  // Magnetic Premium Buttons
  document.querySelectorAll('.btn-p, .btn-g, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const h = rect.width / 2;
      const v = rect.height / 2;
      const x = (e.clientX - rect.left - h) * 0.2;
      const y = (e.clientY - rect.top - v) * 0.2;
      btn.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.04)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate3d(0, 0, 0) scale(1)';
    });
  });
});
