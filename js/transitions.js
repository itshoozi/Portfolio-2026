document.addEventListener('DOMContentLoaded', () => {
  // PAGE TRANSITION ORCHESTRATION - ROBUST SWEEP
  const curtain = document.querySelector('.pt-curtain');
  if (!curtain) return;

  // Check if we just arrived from another page transition
  const isTransitioning = sessionStorage.getItem('pt_active') === 'true' || document.documentElement.classList.contains('pt-loading');

  if (isTransitioning) {
    // 1. We are already at translateX(0) via html.pt-loading
    
    // 2. Add transition property
    curtain.classList.add('pt-enter-prepare');
    
    // 3. Force reflow so the browser logs the transition property natively
    curtain.offsetHeight;
    
    // 4. Trigger the transform change with hardware acceleration
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        curtain.classList.add('pt-enter-active');
      });
    });
    
    sessionStorage.removeItem('pt_active');
    
    setTimeout(() => {
      // 5. Clean up classes: resets to translateX(-100%) and transition: none
      curtain.classList.remove('pt-enter-prepare', 'pt-enter-active');
      document.documentElement.classList.remove('pt-loading');
    }, 850);
  }

  const handlePageExit = (e, url) => {
    e.preventDefault();
    sessionStorage.setItem('pt_active', 'true');
    curtain.classList.add('pt-exit');
    
    setTimeout(() => {
      window.location.href = url;
    }, 750);
  };

  // Handle browser back button: cleanup state if restored from bfcache
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      curtain.classList.remove('pt-exit', 'pt-enter-prepare', 'pt-enter-active');
      document.documentElement.classList.remove('pt-loading');
      sessionStorage.removeItem('pt_active');
    }
  });

  // Attach to all internal links
  document.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('http') && !href.startsWith('mailto') && !href.startsWith('#') && !href.includes(':')) {
      link.addEventListener('click', (e) => handlePageExit(e, href));
    }
  });
});
