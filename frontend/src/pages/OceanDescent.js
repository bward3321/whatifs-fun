import { useState, useEffect, useCallback } from 'react';
import { SECTIONS, interpolateDepth, getBackgroundColor } from '@/data/oceanData';
import { OceanSection } from '@/components/ocean/OceanSection';
import { DepthGauge } from '@/components/ocean/DepthGauge';
import { ParticleCanvas } from '@/components/ocean/ParticleCanvas';
import { AudioController } from '@/components/ocean/AudioController';

export default function OceanDescent() {
  const [depth, setDepth] = useState(0);
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const top = window.scrollY;
          const total = document.documentElement.scrollHeight - window.innerHeight;
          const pct = total > 0 ? Math.min(top / total, 1) : 0;
          setScrollPct(pct);
          setDepth(interpolateDepth(pct));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const bgColor = getBackgroundColor(depth);

  const handleRestart = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <div
        className="ocean-bg"
        style={{ backgroundColor: bgColor }}
        data-testid="ocean-background"
      />
      <ParticleCanvas depth={depth} />
      <DepthGauge depth={depth} progress={scrollPct} />
      <AudioController />
      <main className="ocean-content" data-testid="ocean-content">
        {SECTIONS.map(section => (
          <OceanSection
            key={section.id}
            section={section}
            onRestart={handleRestart}
          />
        ))}
      </main>
    </>
  );
}
