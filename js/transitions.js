document.addEventListener('DOMContentLoaded', () => {
  // PAGE TRANSITION ORCHESTRATION - SEQUENTIAL SWEEP
  const curtain = document.querySelector('.pt-curtain');
  if (!curtain) return;

  // Check if we just arrived from another page transition
  const isTransitioning = sessionStorage.getItem('pt_active') === 'true' || document.documentElement.classList.contains('pt-loading');

  if (isTransitioning) {
    // Start the reveal animation on the next frame to guarantee CSS animations trigger correctly
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        curtain.classList.add('revealing');
      });
    });
    
    sessionStorage.removeItem('pt_active');
    
    setTimeout(() => {
      curtain.classList.remove('revealing');
      document.documentElement.classList.remove('pt-loading');
    }, 850);
  }

  const handlePageExit = (e, url) => {
    e.preventDefault();
    sessionStorage.setItem('pt_active', 'true');
    curtain.classList.add('active');
    
    setTimeout(() => {
      window.location.href = url;
    }, 750);
  };

  // Attach to all internal links
  document.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('http') && !href.startsWith('mailto') && !href.startsWith('#') && !href.includes(':')) {
      link.addEventListener('click', (e) => handlePageExit(e, href));
    }
  });
});
