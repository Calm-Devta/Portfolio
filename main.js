const canvas = document.getElementById('bg');
  if (!canvas) {
  console.error("Canvas not found");
} else {

  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();

  const particles = [];

  function initParticles() {
    particles.length = 0;
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
      });
    }
  }

  initParticles();

  const spotlight = { x: 0, y: 0 };

  canvas.addEventListener('mousemove', (e) => {
    spotlight.x = e.clientX;
    spotlight.y = e.clientY;
  });

  function animate() {
    ctx.fillStyle = 'rgba(14, 14, 14, 0.4)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // particles
    for (let p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    }

    // spotlight (merged properly)
    const gradient = ctx.createRadialGradient(
      spotlight.x,
      spotlight.y,
      0,
      spotlight.x,
      spotlight.y,
      120
    );

    gradient.addColorStop(0, 'rgba(255,255,255,0.1)');
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    requestAnimationFrame(animate);
  }

  animate();

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resizeCanvas();
      initParticles();
    }, 100);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute('id');
        const dot = document.querySelector(
          `.sidebar .dot[data-target="${id}"]`
        );

        if (entry.isIntersecting && dot) {
          document
            .querySelectorAll('.sidebar .dot')
            .forEach((d) => d.classList.remove('active'));

          dot.classList.add('active');
        }
      });
    },
    {
      threshold: 0.3,
    }
  );

  document.querySelectorAll('header, section').forEach((section) => {
    observer.observe(section);
  });

  // sidebar click scroll (you were missing this)
  document.querySelectorAll('.dot').forEach((dot) => {
    dot.addEventListener('click', () => {
      const target = document.getElementById(dot.dataset.target);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
