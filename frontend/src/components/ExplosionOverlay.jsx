import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Radiation, Skull, Wind, Flame, CircleDot } from 'lucide-react';

export const ExplosionOverlay = ({ 
  isActive, 
  warhead, 
  targetCity,
  casualties,
  onComplete 
}) => {
  const [phase, setPhase] = useState('initial');
  const [particles, setParticles] = useState([]);

  // Generate particles for the explosion
  useEffect(() => {
    if (isActive) {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        angle: Math.random() * 360,
        distance: 50 + Math.random() * 200,
        size: 2 + Math.random() * 6,
        delay: Math.random() * 0.3,
        duration: 0.5 + Math.random() * 1,
        hue: 30 + Math.random() * 30,
        lightness: 50 + Math.random() * 30
      }));
      setParticles(newParticles);
      
      // Phase progression
      setPhase('flash');
      setTimeout(() => setPhase('fireball'), 200);
      setTimeout(() => setPhase('shockwave'), 600);
      setTimeout(() => setPhase('mushroom'), 1500);
      setTimeout(() => setPhase('aftermath'), 4000);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 8000);
    } else {
      setPhase('initial');
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
        {/* Initial flash */}
        {phase !== 'initial' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: phase === 'flash' ? [0, 1, 0.8, 0] : 0 
            }}
            transition={{ duration: 0.4, times: [0, 0.1, 0.3, 1] }}
            className="absolute inset-0 bg-white"
          />
        )}

        {/* Main explosion container - centered */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Fireball */}
          <AnimatePresence>
            {(phase === 'fireball' || phase === 'shockwave' || phase === 'mushroom') && (
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ 
                  scale: phase === 'fireball' ? [0, 1.5, 1.2] : [1.2, 0.8, 0.6],
                  opacity: phase === 'mushroom' ? [1, 0.8, 0.6] : 1
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: phase === 'fireball' ? 0.8 : 2 }}
                className="absolute"
              >
                {/* Fireball core */}
                <div 
                  className="rounded-full"
                  style={{
                    width: '200px',
                    height: '200px',
                    background: 'radial-gradient(circle, hsl(50 100% 90%) 0%, hsl(40 100% 60%) 30%, hsl(25 100% 50%) 60%, hsl(0 80% 40%) 100%)',
                    boxShadow: '0 0 100px 50px hsl(25 100% 50% / 0.6), 0 0 200px 100px hsl(0 80% 40% / 0.3)',
                    filter: 'blur(2px)'
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Shockwave rings */}
          {(phase === 'shockwave' || phase === 'mushroom' || phase === 'aftermath') && (
            <>
              {[1, 2, 3, 4].map((ring) => (
                <motion.div
                  key={ring}
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{ scale: 3 + ring, opacity: 0 }}
                  transition={{ 
                    duration: 2 + ring * 0.5,
                    delay: ring * 0.3,
                    ease: 'easeOut'
                  }}
                  className="absolute rounded-full border-2"
                  style={{
                    width: '200px',
                    height: '200px',
                    borderColor: `hsl(0 0% 90% / ${0.8 - ring * 0.15})`
                  }}
                />
              ))}
            </>
          )}

          {/* Debris particles */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ 
                x: 0, 
                y: 0, 
                scale: 1, 
                opacity: 1 
              }}
              animate={{ 
                x: Math.cos(particle.angle * Math.PI / 180) * particle.distance,
                y: Math.sin(particle.angle * Math.PI / 180) * particle.distance,
                scale: 0,
                opacity: 0
              }}
              transition={{ 
                duration: particle.duration,
                delay: 0.3 + particle.delay,
                ease: 'easeOut'
              }}
              className="absolute rounded-full"
              style={{
                width: particle.size,
                height: particle.size,
                background: `hsl(${particle.hue} 100% ${particle.lightness}%)`
              }}
            />
          ))}

          {/* Mushroom cloud (simplified) */}
          {(phase === 'mushroom' || phase === 'aftermath') && (
            <motion.div
              initial={{ scale: 0.5, y: 0, opacity: 0 }}
              animate={{ 
                scale: [0.5, 1.5, 1.3],
                y: [0, -100, -80],
                opacity: [0, 0.9, 0.7]
              }}
              transition={{ duration: 3 }}
              className="absolute"
            >
              {/* Cap */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="rounded-full"
                style={{
                  width: '300px',
                  height: '150px',
                  background: 'radial-gradient(ellipse at center, hsl(25 60% 50% / 0.8) 0%, hsl(0 40% 30% / 0.6) 50%, transparent 100%)',
                  filter: 'blur(10px)'
                }}
              />
              {/* Stem */}
              <motion.div
                className="mx-auto -mt-10"
                style={{
                  width: '80px',
                  height: '200px',
                  background: 'linear-gradient(to bottom, hsl(25 50% 45% / 0.7) 0%, hsl(0 30% 25% / 0.5) 100%)',
                  borderRadius: '20px 20px 40px 40px',
                  filter: 'blur(8px)'
                }}
              />
            </motion.div>
          )}
        </div>

        {/* Impact data overlay */}
        <AnimatePresence>
          {phase === 'aftermath' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-auto"
            >
              <div className="bg-card/95 backdrop-blur-md border border-destructive/50 rounded-lg p-8 max-w-lg mx-4 shadow-alert">
                {/* Header */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  <AlertTriangle className="w-8 h-8 text-destructive animate-pulse" />
                  <h2 className="font-display text-2xl text-destructive tracking-wider">
                    IMPACT ANALYSIS
                  </h2>
                  <AlertTriangle className="w-8 h-8 text-destructive animate-pulse" />
                </div>

                {/* Target info */}
                <div className="text-center mb-6">
                  <div className="text-muted-foreground text-sm">TARGET</div>
                  <div className="font-display text-xl text-foreground">{targetCity?.name}, {targetCity?.country}</div>
                </div>

                {/* Warhead info */}
                <div className="bg-warning/10 border border-warning/30 rounded p-4 mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Radiation className="w-5 h-5 text-warning" />
                    <span className="font-display text-warning">{warhead?.name}</span>
                  </div>
                  <div className="text-center font-mono text-lg">
                    {warhead?.yield >= 1000 
                      ? `${(warhead.yield / 1000).toFixed(1)} Megatons`
                      : `${warhead?.yield} Kilotons`
                    }
                  </div>
                </div>

                {/* Casualty stats */}
                {casualties && (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-destructive/20 rounded p-4 text-center">
                      <Skull className="w-6 h-6 text-destructive mx-auto mb-2" />
                      <div className="text-xs text-muted-foreground">FATALITIES</div>
                      <div className="font-display text-2xl text-destructive">
                        {casualties.immediate.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-warning/20 rounded p-4 text-center">
                      <Flame className="w-6 h-6 text-warning mx-auto mb-2" />
                      <div className="text-xs text-muted-foreground">INJURED</div>
                      <div className="font-display text-2xl text-warning">
                        {casualties.injured.toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}

                {/* Blast zones */}
                <div className="space-y-2 mb-6">
                  <div className="text-xs text-muted-foreground text-center mb-3">BLAST ZONES</div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="text-xs flex-1">Fireball radius</span>
                    <span className="font-mono text-sm">{warhead?.blastRadius.fireball.toFixed(1)} km</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive" />
                    <span className="text-xs flex-1">Total destruction</span>
                    <span className="font-mono text-sm">{warhead?.blastRadius.severe.toFixed(1)} km</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span className="text-xs flex-1">Severe damage</span>
                    <span className="font-mono text-sm">{warhead?.blastRadius.moderate.toFixed(1)} km</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                    <span className="text-xs flex-1">Light damage</span>
                    <span className="font-mono text-sm">{warhead?.blastRadius.light.toFixed(1)} km</span>
                  </div>
                </div>

                {/* Total area */}
                <div className="bg-secondary/50 rounded p-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <CircleDot className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">TOTAL AREA AFFECTED</span>
                  </div>
                  <div className="font-display text-xl text-primary mt-1">
                    {casualties?.areaAffected.toFixed(0)} km²
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-6 text-center text-xs text-muted-foreground">
                  <p>SIMULATION ONLY - EDUCATIONAL PURPOSES</p>
                  <p className="mt-1 opacity-70">Casualty estimates are simplified models</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
};

export default ExplosionOverlay;
