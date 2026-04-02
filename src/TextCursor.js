// Text Cursor Effect - Vanilla JS Implementation
(function() {
  let trail = [];
  let containerRef = null;
  let lastMoveTime = Date.now();
  let idCounter = 0;

  const config = {
    text: '✨',
    spacing: 80,
    followMouseDirection: true,
    randomFloat: true,
    exitDuration: 300,
    removalInterval: 20,
    maxPoints: 10
  };

  const createRandomData = () => ({
    randomX: Math.random() * 10 - 5,
    randomY: Math.random() * 10 - 5,
    randomRotate: Math.random() * 10 - 5
  });

  const handleMouseMove = (e) => {
    if (!containerRef) return;

    const rect = containerRef.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (trail.length === 0) {
      trail.push({
        id: idCounter++,
        x: mouseX,
        y: mouseY,
        angle: 0,
        opacity: 1,
        scale: 1,
        createdAt: Date.now(),
        ...createRandomData()
      });
      renderTrail();
    } else {
      const last = trail[trail.length - 1];
      const dx = mouseX - last.x;
      const dy = mouseY - last.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance >= config.spacing) {
        let rawAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
        const computedAngle = config.followMouseDirection ? rawAngle : 0;
        const steps = Math.floor(distance / config.spacing);

        for (let i = 1; i <= steps; i++) {
          const t = (config.spacing * i) / distance;
          const newX = last.x + dx * t;
          const newY = last.y + dy * t;

          trail.push({
            id: idCounter++,
            x: newX,
            y: newY,
            angle: computedAngle,
            opacity: 1,
            scale: 1,
            createdAt: Date.now(),
            ...createRandomData()
          });
        }

        if (trail.length > config.maxPoints) {
          trail = trail.slice(trail.length - config.maxPoints);
        }
        renderTrail();
      }
    }

    lastMoveTime = Date.now();
  };

  const renderTrail = () => {
    const container = document.querySelector('.text-cursor-inner');
    if (!container) return;

    container.innerHTML = '';
    
    trail.forEach((item) => {
      const element = document.createElement('div');
      element.className = 'text-cursor-item';
      element.textContent = config.text;
      element.style.left = item.x + 'px';
      element.style.top = item.y + 'px';
      element.style.transform = `rotate(${item.angle}deg) scale(${item.scale})`;
      element.style.opacity = item.opacity;
      container.appendChild(element);

      if (config.randomFloat) {
        const startTime = Date.now();
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = (elapsed % 2000) / 2000;
          const floatX = Math.sin(progress * Math.PI * 2) * (item.randomX || 0);
          const floatY = Math.sin(progress * Math.PI * 2) * (item.randomY || 0);
          const floatRotate = Math.sin(progress * Math.PI * 2) * (item.randomRotate || 0);
          
          if (element.parentNode) {
            element.style.transform = `translate(${floatX}px, ${floatY}px) rotate(${item.angle + floatRotate}deg) scale(${item.scale})`;
            requestAnimationFrame(animate);
          }
        };
        animate();
      }
    });
  };

  const removeOldItems = () => {
    if (Date.now() - lastMoveTime > 100 && trail.length > 0) {
      const now = Date.now();
      trail = trail.filter(item => {
        const age = now - item.createdAt;
        return age < config.exitDuration;
      });
      renderTrail();
    }
  };

  const init = () => {
    containerRef = document.querySelector('.text-cursor-container');
    if (!containerRef) return;

    containerRef.addEventListener('mousemove', handleMouseMove);
    setInterval(removeOldItems, config.removalInterval);
  };

  // Initialize on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

