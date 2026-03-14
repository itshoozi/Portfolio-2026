document.addEventListener('DOMContentLoaded', () => {
  // PAGE TRANSITION ORCHESTRATION
  const curtain = document.createElement('div');
  curtain.className = 'pt-curtain reveal-pt';
  curtain.innerHTML = '<div class="pt-panel"></div><div class="pt-panel"></div><div class="pt-panel"></div>';
  document.body.appendChild(curtain);

  // Trigger reveal on load
  setTimeout(() => {
    setTimeout(() => {
      curtain.classList.remove('reveal-pt');
    }, 800);
  }, 50);

  const handlePageExit = (e, url) => {
    e.preventDefault();
    curtain.classList.add('active');
    setTimeout(() => {
      window.location.href = url;
    }, 700);
  };

  // Attach to all internal links
  document.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href');
    // Only internal links, excluding anchors and mailto
    if (href && !href.startsWith('http') && !href.startsWith('mailto') && !href.startsWith('#') && !href.includes(':')) {
      link.addEventListener('click', (e) => handlePageExit(e, href));
    }
  });
});
