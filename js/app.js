document.addEventListener('DOMContentLoaded', () => {
  // IMAGE FADE-IN — pairs with the img[loading="lazy"] opacity rule in
  // style.css so images resolve smoothly instead of popping in on slow wifi
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    if (img.complete) {
      img.classList.add('img-loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('img-loaded'), { once: true });
      img.addEventListener('error', () => img.classList.add('img-loaded'), { once: true });
    }
  });

  // SCROLL REVEAL - APPLE CALIBRATED
  const rio = new IntersectionObserver(entries => {
    entries.forEach(e => { 
      if (e.isIntersecting) { 
        e.target.classList.add('in'); 
      } else {
        // Toggle out for a dynamic "living" feel if desired
        // But let's check if the user wants it to RE-animate every time
        e.target.classList.remove('in');
      }
    });
  }, { 
    threshold: 0.15, 
    rootMargin: '0px 0px -5% 0px' 
  });
  
  document.querySelectorAll('.reveal').forEach(el => rio.observe(el));

  // PARALLAX MOTION LOGIC
  const heroVisual = document.querySelector('.hero-visual');
  const orbs = document.querySelectorAll('.orb');
  const ctaOrbs = document.querySelectorAll('.cta-orb');
  
  let scrollY = window.scrollY;
  let targetScrollY = scrollY;

  // This loop used to run forever, unconditionally, 60fps for the entire
  // page lifetime — even sitting completely idle. Now it only runs while
  // actually catching up to a scroll target, and stops the instant it
  // settles, so the main thread is free the rest of the time.
  let parallaxRunning = false;
  function startParallax() {
    if (!parallaxRunning) { parallaxRunning = true; requestAnimationFrame(tick); }
  }

  window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY;
    startParallax();
  }, { passive: true });

  const heroCards = heroVisual ? Array.from(heroVisual.querySelectorAll('.vcard')) : [];

  function tick() {
    scrollY += (targetScrollY - scrollY) * 0.1;

    // Parallax global orbs (subtle background drift)
    for (let i = 0; i < orbs.length; i++) {
        const depth = 0.04 + (i * 0.02);
        orbs[i].style.transform = `translate3d(0, ${scrollY * -depth}px, 0)`;
    }

    // Parallax CTA orbs (localized to footer section)
    for (let i = 0; i < ctaOrbs.length; i++) {
        const depth = 0.08 + (i * 0.04);
        ctaOrbs[i].style.transform = `translate3d(-50%, ${scrollY * -depth}px, 0)`;
    }

    // Subtly drift hero visual cards on scroll via CSS variable
    for (let i = 0; i < heroCards.length; i++) {
        const speed = (i + 1) * 0.06;
        heroCards[i].style.setProperty('--py', `${scrollY * speed}px`);
    }

    if (Math.abs(targetScrollY - scrollY) < 0.1) {
      scrollY = targetScrollY;
      parallaxRunning = false;
      return;
    }
    requestAnimationFrame(tick);
  }
  // Page can load already scrolled (anchor link, browser scroll restore) —
  // catch that case instead of waiting for the first 'scroll' event.
  if (targetScrollY > 0) startParallax();

  // CURSOR LOGIC
  const cur = document.getElementById('cur');
  const curImg = cur?.querySelector('.cur-img');
  
  if (window.matchMedia('(pointer:fine)').matches && cur) {
    let mx = -100, my = -100, cx = -100, cy = -100;
    let cursorRunning = false;
    function startCursorLoop() {
      if (!cursorRunning) { cursorRunning = true; requestAnimationFrame(cursorLoop); }
    }
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; startCursorLoop(); });
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
        const rawImgs = card.getAttribute('data-imgs');
        if (!rawImgs || rawImgs.trim() === '') return;
        
        const imgs = rawImgs.split(',').filter(s => s.trim() !== '');
        if (imgs.length > 0 && curImg) {
          curImg.style.backgroundImage = `url(${imgs[0]})`;
          cur.classList.add('peek');
        }
      });
      card.addEventListener('mouseleave', () => {
        cur.classList.remove('peek');
      });
    });

    // Runs only while actively catching up to the pointer, same idle-stop
    // pattern as the scroll parallax above — not a perpetual 60fps loop.
    function cursorLoop() {
      const lerp = 0.14;
      cx += (mx - cx) * lerp; cy += (my - cy) * lerp;
      // Using translate3d for GPU acceleration
      cur.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate3d(-50%, -50%, 0)`;
      if (Math.abs(mx - cx) < 0.05 && Math.abs(my - cy) < 0.05) {
        cursorRunning = false;
        return;
      }
      requestAnimationFrame(cursorLoop);
    }
  }

  // Smooth Spotlight effect (only .svc actually reads --mx/--my in CSS —
  // .bc was in this selector too but nothing consumes it there, so it's
  // dropped to avoid pointless work on every mousemove over a bento card)
  document.querySelectorAll('.svc').forEach(item => {
    item.addEventListener('mousemove', e => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      item.style.setProperty('--mx', `${x}px`);
      item.style.setProperty('--my', `${y}px`);
    });
  });

  // Magnetic Premium Buttons & Elements (Mouse ONLY)
  // Bento cards (.bc) used to be in this list too — the drag-toward-cursor
  // effect is tuned for small buttons; on a large card it produces a big,
  // jittery offset that also fights the card's own CSS hover lift. They
  // get their own smoothed tilt effect below instead (see "Bento card
  // tilt"). :not(.inline) also keeps this off the plain-text footer
  // "Hire me"/email links — they share the .nav-cta class but shouldn't
  // drag-and-scale like a real button.
  if (window.matchMedia('(pointer:fine)').matches) {
    const magneticItems = document.querySelectorAll('.btn-p, .btn-g, .nav-cta:not(.inline)');
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
  }

  // Bento card tilt (Mouse ONLY) — a smoothed 3D tilt-toward-cursor,
  // replacing the old magnetic drag. Every card's target rotation is
  // recalculated on mousemove, but the actual applied transform lerps
  // toward that target once per frame in a single shared rAF loop —
  // the same smoothing technique the custom cursor dot uses — instead
  // of snapping straight to the raw mouse-diff value on every event.
  // That's what made the old version feel laggy/jumpy: no interpolation,
  // and it fought the card's CSS hover transition by setting inline
  // style dozens of times a second.
  if (window.matchMedia('(pointer:fine)').matches) {
    const tiltCards = Array.from(document.querySelectorAll('.bento .bc'));
    if (tiltCards.length) {
      const state = tiltCards.map(() => ({ tx: 0, ty: 0, tlift: 0, cx: 0, cy: 0, clift: 0, active: false }));

      let tiltRunning = false;
      function startTiltLoop() {
        if (!tiltRunning) { tiltRunning = true; requestAnimationFrame(tiltLoop); }
      }

      tiltCards.forEach((card, i) => {
        const s = state[i];
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width - 0.5;
          const py = (e.clientY - rect.top) / rect.height - 0.5;
          s.ty = px * 6;   // rotateY — max ~3deg either side
          s.tx = -py * 6;  // rotateX
          s.tlift = -8;
          s.active = true;
          startTiltLoop();
        });
        card.addEventListener('mouseleave', () => {
          s.tx = 0; s.ty = 0; s.tlift = 0;
          s.active = false;
          startTiltLoop(); // still needs to animate back to flat/rest
        });
      });

      // Same idle-stop pattern as the scroll parallax and cursor loops:
      // only ticks while at least one card is mid-transition, instead of
      // running forever regardless of whether the mouse has ever touched
      // the bento grid.
      function tiltLoop() {
        let anyActive = false;
        tiltCards.forEach((card, i) => {
          const s = state[i];
          const settled = !s.active && Math.abs(s.cx) < 0.02 && Math.abs(s.cy) < 0.02 && Math.abs(s.clift) < 0.05;
          if (settled) {
            if (card.style.transform) card.style.transform = '';
            return;
          }
          anyActive = true;
          s.cx += (s.tx - s.cx) * 0.12;
          s.cy += (s.ty - s.cy) * 0.12;
          s.clift += (s.tlift - s.clift) * 0.12;
          card.style.transform = `perspective(900px) rotateX(${s.cx}deg) rotateY(${s.cy}deg) translateY(${s.clift}px)`;
        });
        if (!anyActive) { tiltRunning = false; return; }
        requestAnimationFrame(tiltLoop);
      }
    }
  }
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

  // scrollHeight reads force a layout flush, and raw 'scroll' events can
  // fire many times per animation frame during a fast/flung scroll — batch
  // to one handleScroll() per frame instead of running it unthrottled.
  let navScrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!navScrollTicking) {
      navScrollTicking = true;
      requestAnimationFrame(() => { handleScroll(); navScrollTicking = false; });
    }
  }, { passive: true });
  handleScroll(); // Initial check

  // COUNTER ANIMATION
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        let count = 0;
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16);
        
        const update = () => {
          count += step;
          if (count < target) {
            el.innerText = Math.floor(count) + suffix;
            requestAnimationFrame(update);
          } else {
            el.innerText = target + suffix;
          }
        };
        update();
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter').forEach(c => counterObserver.observe(c));

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
        const imgs = card.getAttribute('data-imgs')?.split(',').map(s => s.trim()).filter(Boolean);
        const icon = card.getAttribute('data-icon');
        const link = card.getAttribute('data-link');

        qlTitle.textContent = title;
        qlDesc.textContent = desc;

        // Clear and add images
        qlScroll.innerHTML = '';
        if (imgs && imgs.length) {
          imgs.forEach(src => {
            const imgEl = document.createElement('img');
            imgEl.src = src;
            imgEl.alt = title;
            imgEl.loading = 'lazy';
            imgEl.decoding = 'async';
            imgEl.addEventListener('load', () => imgEl.classList.add('img-loaded'), { once: true });
            imgEl.addEventListener('error', () => imgEl.classList.add('img-loaded'), { once: true });
            qlScroll.appendChild(imgEl);
          });
        } else if (icon) {
          const iconWrap = document.createElement('div');
          iconWrap.className = 'ql-icon-fallback';
          iconWrap.textContent = icon;
          qlScroll.appendChild(iconWrap);
        }
        
        if (link) {
          qlLink.style.display = 'inline-flex';
          qlLink.href = link;
        } else {
          qlLink.style.display = 'none';
        }
        
        qlOverlay.classList.add('active');
        document.body.classList.add('modal-open');
      });
    });

    const closeQL = () => {
      qlOverlay.classList.remove('active');
      document.body.classList.remove('modal-open');
    };

    document.getElementById('qlClose')?.addEventListener('click', closeQL);
    document.getElementById('qlCloseBtn')?.addEventListener('click', closeQL);
    qlOverlay.addEventListener('click', (e) => {
      if (e.target === qlOverlay) closeQL();
    });
  }

  // FULL-SCREEN IMAGE LIGHTBOX
  // Injects its own overlay so no markup changes are needed on any page.
  // Any rendered image at least 100x100 outside nav/footer/other modals
  // becomes click-to-zoom, with drag-to-pan when zoomed and a download button.
  (() => {
    const overlay = document.createElement('div');
    overlay.className = 'lb-overlay';
    overlay.innerHTML = `
      <div class="lb-stage">
        <img class="lb-img" alt="">
      </div>
      <div class="lb-bar">
        <a class="lb-btn" id="lbDownload" download title="Download image">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v13m0 0l-5-5m5 5l5-5M4 21h16"/></svg>
        </a>
        <div class="lb-btn" id="lbClose" title="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </div>
      </div>
      <div class="lb-hint">Scroll or double-click to zoom · Drag to pan</div>
    `;
    document.body.appendChild(overlay);

    const lbImg = overlay.querySelector('.lb-img');
    const lbClose = overlay.querySelector('#lbClose');
    const lbDownload = overlay.querySelector('#lbDownload');

    let scale = 1, panX = 0, panY = 0, dragging = false, startX = 0, startY = 0;

    const applyTransform = () => {
      lbImg.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
    };
    const resetZoom = () => {
      scale = 1; panX = 0; panY = 0;
      lbImg.classList.remove('zoomed');
      applyTransform();
    };

    const openLightbox = (src, alt) => {
      lbImg.src = src;
      lbImg.alt = alt || '';
      lbDownload.href = src;
      lbDownload.download = (alt || 'image').replace(/[^a-z0-9-_]+/gi, '-').toLowerCase() || 'image';
      resetZoom();
      overlay.classList.add('active');
      document.body.classList.add('modal-open');
    };
    const closeLightbox = () => {
      overlay.classList.remove('active');
      document.body.classList.remove('modal-open');
    };

    // Attach to qualifying content images site-wide. Images inside a link
    // or a quick-look modal-trigger keep their existing click behavior
    // (navigating to the case study / opening the quick-look modal) —
    // only "dead" content images that don't already do something on
    // click become zoomable.
    const excluded = 'nav, footer, .ql-overlay, #videoModal, .lb-overlay, #cur, a[href], .modal-trigger';
    document.querySelectorAll('img').forEach(img => {
      if (img.closest(excluded)) return;
      const rect = img.getBoundingClientRect();
      const w = rect.width || img.width;
      const h = rect.height || img.height;
      if (w < 100 || h < 100) return;
      img.classList.add('lb-zoomable');
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        openLightbox(img.currentSrc || img.src, img.alt);
      });
    });

    lbClose.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeLightbox();
    });
    overlay.querySelector('.lb-stage').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) closeLightbox();
    });

    // Click-to-zoom toggle
    lbImg.addEventListener('click', (e) => {
      e.stopPropagation();
      if (scale === 1) {
        scale = 2.2;
        lbImg.classList.add('zoomed');
      } else {
        resetZoom();
      }
      applyTransform();
    });
    lbImg.addEventListener('dblclick', (e) => { e.stopPropagation(); resetZoom(); });

    // Scroll-wheel zoom
    overlay.addEventListener('wheel', (e) => {
      if (!overlay.classList.contains('active')) return;
      e.preventDefault();
      scale = Math.min(4, Math.max(1, scale - e.deltaY * 0.0025));
      lbImg.classList.toggle('zoomed', scale > 1);
      if (scale === 1) { panX = 0; panY = 0; }
      applyTransform();
    }, { passive: false });

    // Drag to pan when zoomed
    lbImg.addEventListener('pointerdown', (e) => {
      if (scale === 1) return;
      dragging = true;
      lbImg.classList.add('dragging');
      startX = e.clientX - panX;
      startY = e.clientY - panY;
      lbImg.setPointerCapture(e.pointerId);
    });
    lbImg.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      panX = e.clientX - startX;
      panY = e.clientY - startY;
      applyTransform();
    });
    ['pointerup', 'pointercancel'].forEach(ev => {
      lbImg.addEventListener(ev, () => { dragging = false; lbImg.classList.remove('dragging'); });
    });
  })();
});
