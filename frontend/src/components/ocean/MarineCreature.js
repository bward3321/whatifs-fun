import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CREATURE_SVGS } from './creatures';

export function MarineCreature({ creatureKey, name, x, y, size, fact, glow }) {
  const [showFact, setShowFact] = useState(false);
  const Svg = CREATURE_SVGS[creatureKey];

  const anim = useMemo(() => ({
    duration: 4 + Math.random() * 4,
    delay: Math.random() * 2,
  }), []);

  if (!Svg) return null;

  return (
    <motion.div
      className={`marine-creature ${glow ? 'bioluminescent' : ''}`}
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.9 }}
      onMouseEnter={() => setShowFact(true)}
      onMouseLeave={() => setShowFact(false)}
      onClick={() => setShowFact(p => !p)}
      data-testid={`creature-${creatureKey}`}
    >
      <div
        className="creature-swim"
        style={{
          animation: `float ${anim.duration}s ease-in-out ${anim.delay}s infinite`,
        }}
      >
        {Svg(size)}
      </div>
      <span className="creature-label">{name}</span>
      {showFact && fact && (
        <div className="creature-fact" data-testid={`fact-${creatureKey}`}>
          {fact}
        </div>
      )}
    </motion.div>
  );
}
