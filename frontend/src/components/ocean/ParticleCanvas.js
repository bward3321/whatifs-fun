import { useEffect, useRef } from 'react';

export function ParticleCanvas({ depth }) {
  const canvasRef = useRef(null);
  const depthRef = useRef(0);
  depthRef.current = depth;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const count = 80;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * (canvas.width || 1920),
        y: Math.random() * (canvas.height || 1080),
        size: Math.random() * 2 + 0.5,
        speedY: Math.random() * 0.4 + 0.08,
        speedX: (Math.random() - 0.5) * 0.12,
        baseOpacity: Math.random() * 0.22 + 0.04,
      });
    }

    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const d = depthRef.current;
      const depthFactor = Math.min(d / 3500, 1);

      particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.004) * 0.12;
        if (p.y > canvas.height) {
          p.y = -4;
          p.x = Math.random() * canvas.width;
        }
        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;

        const opacity = p.baseOpacity * (0.35 + depthFactor * 0.65);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" data-testid="particle-canvas" />;
}
