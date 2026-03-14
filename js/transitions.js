document.addEventListener('DOMContentLoaded', () => {
  // PAGE TRANSITION ORCHESTRATION - SEQUENTIAL SWEEP
  const curtain = document.createElement('div');
  curtain.className = 'pt-curtain';
  curtain.innerHTML = '<div class="pt-panel"></div><div class="pt-panel"></div><div class="pt-panel"></div>';
  document.body.appendChild(curtain);

  // Check if we just arrived from another page transition
  // We can use session storage or just always do the reveal on load
  const isTransitioning = sessionStorage.getItem('pt_active') === 'true';

  if (isTransitioning) {
    // Start covered and reveal to the right
    curtain.classList.add('reveal-pt');
    // Force reflow
    curtain.offsetHeight;
    curtain.classList.add('revealing');
    
    sessionStorage.removeItem('pt_active');
    
    setTimeout(() => {
      curtain.classList.remove('reveal-pt', 'revealing');
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
