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
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Phase progression for explosion
  useEffect(() => {
    if (isActive) {
      // Start explosion phases
      setPhase('flash');
      setTimeout(() => setPhase('fireball'), 300);
      setTimeout(() => setPhase('shockwave'), 1500);
      setTimeout(() => setPhase('mushroom'), 3000);
      setTimeout(() => {
        setPhase('aftermath');
        setShowAnalysis(true);
      }, 5000);
    } else {
      setPhase('initial');
      setShowAnalysis(false);
    }
  }, [isActive]);

  // Handle close/reset - this MUST work
  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Close button clicked!');
    setShowAnalysis(false);
    setPhase('initial');
    if (onReset) {
      onReset();
    }
  };

  if (!isActive) return null;

  return (
    <>
      {/* Flash effect - covers screen briefly */}
      <AnimatePresence>
        {phase === 'flash' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.8, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, times: [0, 0.1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-white pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Impact Analysis Modal - ONLY this shows, explosion is on map */}
      <AnimatePresence>
        {showAnalysis && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/70 backdrop-blur-sm"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-destructive/50 rounded-lg p-6 max-w-lg mx-4 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button - PROMINENT */}
              <button
                type="button"
                onClick={handleClose}
                className="absolute top-3 right-3 w-10 h-10 rounded-full bg-destructive/20 hover:bg-destructive/40 flex items-center justify-center text-foreground transition-colors z-10 border border-destructive/30"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Header */}
              <div className="flex items-center justify-center gap-3 mb-5 pr-8">
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
                  <div className="absolute rounded-full border-2 border-dashed border-orange-500/60 bg-orange-500/10" style={{ width: '72px', height: '72px' }} />
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

              {/* Action button */}
              <Button
                variant="outline"
                className="w-full border-primary/50 hover:bg-primary/20"
                onClick={handleClose}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                NEW SIMULATION
              </Button>

              {/* Disclaimer */}
              <div className="mt-4 text-center text-xs text-muted-foreground">
                <p>SIMULATION ONLY - EDUCATIONAL PURPOSES</p>
                <p className="mt-0.5 opacity-70">Casualty estimates are simplified models</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ExplosionOverlay;
