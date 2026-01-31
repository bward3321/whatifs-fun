import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Radiation, Skull, Flame, CircleDot, X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ExplosionOverlay = ({ 
  isActive, 
  warhead, 
  targetCity,
  casualties,
  onComplete,
  onReset
}) => {
  const [phase, setPhase] = useState('initial');
  const [particles, setParticles] = useState([]);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Generate particles for the explosion
  useEffect(() => {
    if (isActive) {
      // Generate more particles for a richer explosion
      const newParticles = Array.from({ length: 80 }, (_, i) => ({
        id: i,
        angle: Math.random() * 360,
        distance: 30 + Math.random() * 250,
        size: 2 + Math.random() * 8,
        delay: Math.random() * 0.5,
        duration: 0.8 + Math.random() * 1.5,
        hue: 20 + Math.random() * 40,
        lightness: 40 + Math.random() * 40
      }));
      setParticles(newParticles);
      
      // Extended phase progression for more detailed animation
      setPhase('flash');
      setTimeout(() => setPhase('fireball'), 300);
      setTimeout(() => setPhase('expansion'), 1000);
      setTimeout(() => setPhase('shockwave'), 1800);
      setTimeout(() => setPhase('mushroom'), 3000);
      setTimeout(() => setPhase('blastradius'), 4500);
      setTimeout(() => {
        setPhase('aftermath');
        setShowAnalysis(true);
      }, 6000);
    } else {
      setPhase('initial');
      setShowAnalysis(false);
    }
  }, [isActive]);

  // Handle close/reset
  const handleClose = () => {
    setShowAnalysis(false);
    if (onReset) onReset();
  };

  if (!isActive) return null;

  // Calculate blast zone sizes based on warhead (scaled for visual)
  const blastScale = warhead ? Math.min(warhead.blastRadius.light / 20, 3) : 1;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Semi-transparent backdrop during aftermath */}
        {phase === 'aftermath' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
          />
        )}

        {/* Initial bright flash */}
        {phase !== 'initial' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: phase === 'flash' ? [0, 1, 0.9, 0.3, 0] : 0 
            }}
            transition={{ duration: 0.6, times: [0, 0.1, 0.2, 0.5, 1] }}
            className="absolute inset-0 bg-white pointer-events-none"
          />
        )}

        {/* Main explosion container - centered */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          
          {/* Blast radius rings visualization */}
          {(phase === 'blastradius' || phase === 'aftermath') && warhead && (
            <>
              {/* Light damage zone */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.15 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute rounded-full"
                style={{
                  width: `${200 * blastScale}px`,
                  height: `${200 * blastScale}px`,
                  background: 'radial-gradient(circle, hsl(50 80% 50% / 0.3) 0%, transparent 70%)',
                  border: '2px dashed hsl(50 80% 50% / 0.5)'
                }}
              />
              {/* Severe damage zone */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.25 }}
                transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                className="absolute rounded-full"
                style={{
                  width: `${140 * blastScale}px`,
                  height: `${140 * blastScale}px`,
                  background: 'radial-gradient(circle, hsl(25 90% 50% / 0.4) 0%, transparent 70%)',
                  border: '2px dashed hsl(25 90% 50% / 0.6)'
                }}
              />
              {/* Total destruction zone */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.35 }}
                transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                className="absolute rounded-full"
                style={{
                  width: `${80 * blastScale}px`,
                  height: `${80 * blastScale}px`,
                  background: 'radial-gradient(circle, hsl(0 80% 50% / 0.5) 0%, transparent 70%)',
                  border: '2px solid hsl(0 80% 50% / 0.7)'
                }}
              />
              {/* Fireball zone */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.5 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                className="absolute rounded-full"
                style={{
                  width: `${30 * blastScale}px`,
                  height: `${30 * blastScale}px`,
                  background: 'radial-gradient(circle, hsl(45 100% 70% / 0.8) 0%, hsl(30 100% 50% / 0.6) 100%)',
                  boxShadow: '0 0 40px hsl(40 100% 50% / 0.6)'
                }}
              />
            </>
          )}

          {/* Initial fireball - bright core */}
          <AnimatePresence>
            {(phase === 'fireball' || phase === 'expansion') && (
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ 
                  scale: phase === 'fireball' ? [0, 0.8, 1.2] : [1.2, 1.8, 2.2],
                  opacity: phase === 'expansion' ? [1, 0.9, 0.7] : 1
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2 }}
                className="absolute"
              >
                <div 
                  className="rounded-full"
                  style={{
                    width: '160px',
                    height: '160px',
                    background: 'radial-gradient(circle, hsl(50 100% 95%) 0%, hsl(45 100% 70%) 20%, hsl(35 100% 55%) 40%, hsl(20 100% 45%) 60%, hsl(0 80% 35%) 100%)',
                    boxShadow: '0 0 80px 40px hsl(40 100% 60% / 0.8), 0 0 150px 80px hsl(25 100% 50% / 0.5), 0 0 250px 120px hsl(0 80% 40% / 0.3)',
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expanding shockwave effect */}
          {(phase === 'shockwave' || phase === 'mushroom' || phase === 'blastradius') && (
            <>
              {/* Multiple shockwave rings */}
              {[1, 2, 3, 4, 5].map((ring) => (
                <motion.div
                  key={ring}
                  initial={{ scale: 0, opacity: 0.9 }}
                  animate={{ 
                    scale: [0, 2 + ring * 1.5],
                    opacity: [0.9, 0]
                  }}
                  transition={{ 
                    duration: 2.5 + ring * 0.4,
                    delay: ring * 0.25,
                    ease: "easeOut"
                  }}
                  className="absolute rounded-full border-2"
                  style={{
                    width: '120px',
                    height: '120px',
                    borderColor: `hsl(0 0% ${95 - ring * 10}% / ${0.9 - ring * 0.12})`
                  }}
                />
              ))}
              
              {/* Ground distortion ring */}
              <motion.div
                initial={{ scale: 0, opacity: 0.7 }}
                animate={{ scale: 8, opacity: 0 }}
                transition={{ duration: 3, ease: "easeOut" }}
                className="absolute rounded-full"
                style={{
                  width: '100px',
                  height: '100px',
                  background: 'radial-gradient(circle, hsl(30 80% 50% / 0.3) 0%, transparent 70%)'
                }}
              />
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
                opacity: 0.9 
              }}
              animate={{ 
                x: Math.cos(particle.angle * Math.PI / 180) * particle.distance,
                y: Math.sin(particle.angle * Math.PI / 180) * particle.distance - (particle.distance * 0.3),
                scale: 0,
                opacity: 0
              }}
              transition={{ 
                duration: particle.duration,
                delay: 0.3 + particle.delay,
                ease: "easeOut"
              }}
              className="absolute rounded-full"
              style={{
                width: particle.size,
                height: particle.size,
                background: `hsl(${particle.hue} 100% ${particle.lightness}%)`
              }}
            />
          ))}

          {/* Enhanced Mushroom cloud */}
          {(phase === 'mushroom' || phase === 'blastradius' || phase === 'aftermath') && (
            <motion.div
              initial={{ scale: 0.3, y: 50, opacity: 0 }}
              animate={{ 
                scale: [0.3, 1.2, 1.1, 1],
                y: [50, -80, -100, -90],
                opacity: [0, 0.95, 0.9, phase === 'aftermath' ? 0.4 : 0.85]
              }}
              transition={{ duration: 4, times: [0, 0.3, 0.6, 1] }}
              className="absolute flex flex-col items-center"
            >
              {/* Mushroom cap - outer glow */}
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.6, 0.8, 0.6]
                }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="rounded-full"
                style={{
                  width: '400px',
                  height: '180px',
                  background: 'radial-gradient(ellipse at center bottom, hsl(25 70% 55% / 0.7) 0%, hsl(15 60% 40% / 0.5) 40%, hsl(0 50% 30% / 0.3) 70%, transparent 100%)',
                  filter: 'blur(15px)'
                }}
              />
              {/* Mushroom cap - inner bright */}
              <motion.div
                className="rounded-full -mt-32"
                animate={{ 
                  scale: [0.95, 1, 0.95],
                }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                style={{
                  width: '280px',
                  height: '120px',
                  background: 'radial-gradient(ellipse at center bottom, hsl(40 80% 60% / 0.8) 0%, hsl(30 70% 50% / 0.6) 40%, transparent 80%)',
                  filter: 'blur(8px)'
                }}
              />
              {/* Stem - main column */}
              <motion.div
                className="-mt-16"
                style={{
                  width: '100px',
                  height: '220px',
                  background: 'linear-gradient(to bottom, hsl(30 60% 50% / 0.8) 0%, hsl(20 50% 40% / 0.7) 30%, hsl(10 40% 30% / 0.6) 70%, hsl(0 30% 20% / 0.4) 100%)',
                  borderRadius: '30px 30px 50px 50px',
                  filter: 'blur(6px)'
                }}
              />
              {/* Stem - expanding base */}
              <motion.div
                className="-mt-20"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{
                  width: '180px',
                  height: '80px',
                  background: 'radial-gradient(ellipse at center, hsl(20 50% 40% / 0.6) 0%, transparent 70%)',
                  borderRadius: '50%',
                  filter: 'blur(10px)'
                }}
              />
            </motion.div>
          )}
        </div>

        {/* Impact data overlay with close button */}
        <AnimatePresence>
          {showAnalysis && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-auto"
            >
              <div className="bg-card/95 backdrop-blur-md border border-destructive/50 rounded-lg p-6 max-w-lg mx-4 shadow-alert relative">
                {/* Close button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="absolute top-3 right-3 h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-destructive/20"
                >
                  <X className="h-5 w-5" />
                </Button>

                {/* Header */}
                <div className="flex items-center justify-center gap-3 mb-5">
                  <AlertTriangle className="w-7 h-7 text-destructive animate-pulse" />
                  <h2 className="font-display text-xl text-destructive tracking-wider">
                    IMPACT ANALYSIS
                  </h2>
                  <AlertTriangle className="w-7 h-7 text-destructive animate-pulse" />
                </div>

                {/* Target info */}
                <div className="text-center mb-5">
                  <div className="text-muted-foreground text-xs uppercase tracking-wider">TARGET</div>
                  <div className="font-display text-lg text-foreground">{targetCity?.name}, {targetCity?.country}</div>
                </div>

                {/* Warhead info */}
                <div className="bg-warning/10 border border-warning/30 rounded p-3 mb-5">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Radiation className="w-4 h-4 text-warning" />
                    <span className="font-display text-warning text-sm">{warhead?.name}</span>
                  </div>
                  <div className="text-center font-mono text-base">
                    {warhead?.yield >= 1000 
                      ? `${(warhead.yield / 1000).toFixed(1)} Megatons`
                      : `${warhead?.yield} Kilotons`
                    }
                  </div>
                </div>

                {/* Casualty stats */}
                {casualties && (
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="bg-destructive/20 rounded p-3 text-center">
                      <Skull className="w-5 h-5 text-destructive mx-auto mb-1" />
                      <div className="text-xs text-muted-foreground">FATALITIES</div>
                      <div className="font-display text-xl text-destructive">
                        {casualties.immediate.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-warning/20 rounded p-3 text-center">
                      <Flame className="w-5 h-5 text-warning mx-auto mb-1" />
                      <div className="text-xs text-muted-foreground">INJURED</div>
                      <div className="font-display text-xl text-warning">
                        {casualties.injured.toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}

                {/* Blast zones with visual indicator */}
                <div className="mb-5">
                  <div className="text-xs text-muted-foreground text-center mb-3 uppercase tracking-wider">BLAST ZONES</div>
                  
                  {/* Visual blast zone circles */}
                  <div className="relative h-24 flex items-center justify-center mb-3">
                    <div className="absolute w-24 h-24 rounded-full border-2 border-dashed border-yellow-500/50 bg-yellow-500/10" />
                    <div className="absolute w-18 h-18 rounded-full border-2 border-dashed border-orange-500/60 bg-orange-500/10" style={{ width: '72px', height: '72px' }} />
                    <div className="absolute w-12 h-12 rounded-full border-2 border-destructive/70 bg-destructive/20" />
                    <div className="absolute w-5 h-5 rounded-full bg-amber-400 shadow-lg" />
                  </div>
                  
                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <span className="text-xs flex-1">Fireball radius</span>
                      <span className="font-mono text-xs">{warhead?.blastRadius.fireball.toFixed(1)} km</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-destructive" />
                      <span className="text-xs flex-1">Total destruction</span>
                      <span className="font-mono text-xs">{warhead?.blastRadius.severe.toFixed(1)} km</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                      <span className="text-xs flex-1">Severe damage</span>
                      <span className="font-mono text-xs">{warhead?.blastRadius.moderate.toFixed(1)} km</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                      <span className="text-xs flex-1">Light damage / thermal</span>
                      <span className="font-mono text-xs">{warhead?.blastRadius.light.toFixed(1)} km</span>
                    </div>
                  </div>
                </div>

                {/* Total area */}
                <div className="bg-secondary/50 rounded p-2.5 text-center mb-4">
                  <div className="flex items-center justify-center gap-2">
                    <CircleDot className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">TOTAL AREA AFFECTED</span>
                  </div>
                  <div className="font-display text-lg text-primary mt-1">
                    {casualties?.areaAffected.toFixed(0)} km²
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleClose}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    NEW SIMULATION
                  </Button>
                </div>

                {/* Disclaimer */}
                <div className="mt-4 text-center text-xs text-muted-foreground">
                  <p>SIMULATION ONLY - EDUCATIONAL PURPOSES</p>
                  <p className="mt-0.5 opacity-70">Casualty estimates are simplified models</p>
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
