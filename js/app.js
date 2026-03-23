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
  const orbs = document.querySelectorAll('.orb');
  const ctaOrbs = document.querySelectorAll('.cta-orb');
  
  let scrollY = window.scrollY;
  let targetScrollY = scrollY;
  
  window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY;
  }, { passive: true });

  function tick() {
    scrollY += (targetScrollY - scrollY) * 0.1;
    
    // Parallax global orbs (subtle background drift)
    orbs.forEach((orb, i) => {
      const depth = 0.04 + (i * 0.02);
      orb.style.transform = `translate3d(0, ${scrollY * -depth}px, 0)`;
    });

    // Parallax CTA orbs (localized to footer section)
    ctaOrbs.forEach((orb, i) => {
      const depth = 0.08 + (i * 0.04);
      // We use a relative offset so it's not "off" from the section start
      orb.style.transform = `translate3d(-50%, ${scrollY * -depth}px, 0)`;
    });

    // Subtly drift hero visual cards on scroll via CSS variable
    if (heroVisual) {
      const cards = heroVisual.querySelectorAll('.vcard');
      cards.forEach((card, i) => {
        const speed = (i + 1) * 0.06;
        card.style.setProperty('--py', `${scrollY * speed}px`);
      });
    }

    requestAnimationFrame(tick);
  }
  tick();

  // CURSOR LOGIC
  const cur = document.getElementById('cur');
  const curImg = cur?.querySelector('.cur-img');
  
  if (window.matchMedia('(pointer:fine)').matches && cur) {
    let mx = -100, my = -100, cx = -100, cy = -100;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY });
    document.addEventListener('mousedown', () => cur.classList.add('c'));
    document.addEventListener('mouseup', () => cur.classList.remove('c'));
    
    // Default hover triggers
    document.querySelectorAll('a, button, .wcard, .svc, .hstat, .bc, .btn-p, .btn-g, .nav-cta').forEach(el => {
      el.addEventListener('mouseenter', () => cur.classList.add('h'));
      el.addEventListener('mouseleave', () => cur.classList.remove('h'));
    });

    // ARCHIVE PEEK TRIGGER
    document.querySelectorAll('.arch-peek').forEach(card => {
      card.addEventListener('mouseenter', () => {
        const imgs = card.getAttribute('data-imgs')?.split(',');
        if (imgs && imgs.length > 0 && curImg) {
          curImg.style.backgroundImage = `url(${imgs[0]})`;
          cur.classList.add('peek');
        }
      });
      card.addEventListener('mouseleave', () => {
        cur.classList.remove('peek');
      });
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

  // Magnetic Premium Buttons & Elements
  const magneticItems = document.querySelectorAll('.btn-p, .btn-g, .nav-cta, .svc-item, .bento .bc');
  magneticItems.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const h = rect.width / 2;
      const v = rect.height / 2;
      
      // Increased sensitivity for footer and nav links
      const damp = btn.classList.contains('nav-cta') ? 0.35 : 0.18;
      
      const x = (e.clientX - rect.left - h) * damp;
      const y = (e.clientY - rect.top - v) * damp;
      btn.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.035)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate3d(0, 0, 0) scale(1)';
    });
  });
  // NAV SCROLL LOGIC
  const nav = document.querySelector('nav');
  const navProgress = document.querySelector('.nav-progress');
  
  const handleScroll = () => {
    const scroll = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scroll / height) * 100;
    
    // Toggle scrolled state
    if (scroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    
    // Update progress bar
    if (navProgress) {
      nav.style.setProperty('--scroll-p', `${progress}%`);
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // ACTIVE SECTION OBSERVER
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('section[id]').forEach(section => {
    sectionObserver.observe(section);
  });

  // ARCHIVE QUICK LOOK MODAL
  const qlOverlay = document.getElementById('qlOverlay');
  const qlScroll = document.getElementById('qlScroll');
  const qlTitle = document.getElementById('qlTitle');
  const qlDesc = document.getElementById('qlDesc');
  const qlLink = document.getElementById('qlLink');
  
  if (qlOverlay) {
    document.querySelectorAll('.modal-trigger').forEach(card => {
      card.addEventListener('click', () => {
        const title = card.getAttribute('data-title');
        const desc = card.getAttribute('data-desc');
        const imgs = card.getAttribute('data-imgs')?.split(',');
        const link = card.getAttribute('data-link');
        
        qlTitle.textContent = title;
        qlDesc.textContent = desc;
        
        // Clear and add images
        qlScroll.innerHTML = '';
        if (imgs) {
          imgs.forEach(src => {
            const imgEl = document.createElement('img');
            imgEl.src = src.trim();
            imgEl.alt = title;
            imgEl.loading = 'lazy';
            qlScroll.appendChild(imgEl);
          });
        }
        
        if (link) {
          qlLink.style.display = 'inline-flex';
          qlLink.href = link;
        } else {
          qlLink.style.display = 'none';
        }
        
        qlOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeQL = () => {
      qlOverlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    document.getElementById('qlClose')?.addEventListener('click', closeQL);
    document.getElementById('qlCloseBtn')?.addEventListener('click', closeQL);
    qlOverlay.addEventListener('click', (e) => {
      if (e.target === qlOverlay) closeQL();
    });
  }
});
