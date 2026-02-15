import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Rocket, Target, Zap, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const MissionTimer = ({
  isLaunched,
  flightProgress,
  timeRemaining,
  totalTime,
  launchOrigin,
  launchTarget,
  selectedWarhead,
  explosionActive,
  speedMultiplier,
  setSpeedMultiplier
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return { mins, secs, ms };
  };

  const time = formatTime(timeRemaining);
  const progressPercent = flightProgress * 100;

  // Mission phases
  const getMissionPhase = () => {
    if (!isLaunched) return 'standby';
    if (explosionActive) return 'impact';
    if (flightProgress >= 0.95) return 'terminal';
    if (flightProgress >= 0.7) return 'descent';
    if (flightProgress >= 0.3) return 'cruise';
    if (flightProgress >= 0.1) return 'boost';
    return 'launch';
  };

  const phase = getMissionPhase();
  const phaseInfo = {
    standby: { label: 'STANDBY', color: 'text-muted-foreground', bgColor: 'bg-muted' },
    launch: { label: 'LAUNCH', color: 'text-success', bgColor: 'bg-success/20' },
    boost: { label: 'BOOST', color: 'text-primary', bgColor: 'bg-primary/20' },
    cruise: { label: 'CRUISE', color: 'text-primary', bgColor: 'bg-primary/20' },
    descent: { label: 'RE-ENTRY', color: 'text-warning', bgColor: 'bg-warning/20' },
    terminal: { label: 'TERMINAL', color: 'text-destructive', bgColor: 'bg-destructive/20' },
    impact: { label: 'IMPACT', color: 'text-destructive', bgColor: 'bg-destructive/30' }
  };

  const currentPhase = phaseInfo[phase];

  return (
    <div className="absolute top-0 left-0 right-0 z-30">
      {/* Top status bar */}
      <div className="bg-card/95 backdrop-blur-sm border-b border-primary/30 pointer-events-auto">
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 py-2 sm:py-3">
          {/* Mobile Layout (stacked) */}
          <div className="flex flex-col gap-2 sm:hidden">
            {/* Row 1: Origin -> Target */}
            <div className="flex items-center justify-between gap-2">
              {/* Origin */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="w-8 h-8 rounded bg-success/20 flex items-center justify-center flex-shrink-0">
                  <Rocket className="w-4 h-4 text-success" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-muted-foreground">FROM</div>
                  <div className="font-display text-xs text-success truncate">
                    {launchOrigin?.name || '---'}
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <Zap className="w-4 h-4 text-primary flex-shrink-0" />

              {/* Target */}
              <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                <div className="min-w-0 text-right">
                  <div className="text-[10px] text-muted-foreground">TO</div>
                  <div className="font-display text-xs text-destructive truncate">
                    {launchTarget?.name || '---'}
                  </div>
                </div>
                <div className="w-8 h-8 rounded bg-destructive/20 flex items-center justify-center flex-shrink-0">
                  <Target className="w-4 h-4 text-destructive" />
                </div>
              </div>
            </div>

            {/* Row 2: Phase, Timer, Speed */}
            <div className="flex items-center justify-between gap-2">
              {/* Phase */}
              <motion.div
                className={`px-2 py-1 rounded-full ${currentPhase.bgColor}`}
                animate={{ scale: isLaunched ? [1, 1.02, 1] : 1 }}
                transition={{ repeat: isLaunched ? Infinity : 0, duration: 1 }}
              >
                <span className={`font-display text-[10px] tracking-wider ${currentPhase.color}`}>
                  {currentPhase.label}
                </span>
              </motion.div>

              {/* Timer */}
              {isLaunched && !explosionActive ? (
                <div className="flex items-baseline gap-0.5 font-mono">
                  <span className="text-lg font-bold text-foreground tabular-nums">
                    {String(time.mins).padStart(2, '0')}
                  </span>
                  <span className="text-sm text-primary animate-blink">:</span>
                  <span className="text-lg font-bold text-foreground tabular-nums">
                    {String(time.secs).padStart(2, '0')}
                  </span>
                </div>
              ) : explosionActive ? (
                <span className="font-display text-sm text-destructive">IMPACT</span>
              ) : null}

              {/* Speed controls */}
              <div className="flex gap-1">
                {[1, 2, 5, 10].map(speed => (
                  <Button
                    key={speed}
                    variant={speedMultiplier === speed ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSpeedMultiplier(speed)}
                    className={`w-10 h-10 font-mono text-xs ${
                      speedMultiplier === speed 
                        ? 'bg-primary text-primary-foreground' 
                        : 'border-primary/30 hover:bg-primary/20'
                    }`}
                    disabled={!isLaunched}
                  >
                    {speed}x
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Layout (horizontal) */}
          <div className="hidden sm:flex items-center justify-between">
            {/* Left - Mission info */}
            <div className="flex items-center gap-4 lg:gap-6">
              {/* Origin */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-success/20 flex items-center justify-center">
                  <Rocket className="w-4 h-4 text-success" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">ORIGIN</div>
                  <div className="font-display text-sm text-success">
                    {launchOrigin?.name || '---'}
                  </div>
                </div>
              </div>

              {/* Arrow/connection */}
              <div className="hidden md:flex items-center gap-2 px-4">
                <div className="h-px w-8 bg-gradient-to-r from-success to-primary" />
                <Zap className="w-4 h-4 text-primary" />
                <div className="h-px w-8 bg-gradient-to-r from-primary to-destructive" />
              </div>

              {/* Target */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-destructive/20 flex items-center justify-center">
                  <Target className="w-4 h-4 text-destructive" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">TARGET</div>
                  <div className="font-display text-sm text-destructive">
                    {launchTarget?.name || '---'}
                  </div>
                </div>
              </div>
            </div>

            {/* Center - Timer */}
            <div className="flex flex-col items-center">
              <motion.div
                className={`px-4 py-1 rounded-full ${currentPhase.bgColor} mb-1`}
                animate={{ scale: isLaunched ? [1, 1.02, 1] : 1 }}
                transition={{ repeat: isLaunched ? Infinity : 0, duration: 1 }}
              >
                <span className={`font-display text-xs tracking-widest ${currentPhase.color}`}>
                  {currentPhase.label}
                </span>
              </motion.div>
              
              {isLaunched && !explosionActive && (
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-3xl font-bold text-foreground tabular-nums">
                    {String(time.mins).padStart(2, '0')}
                  </span>
                  <span className="text-xl text-primary animate-blink">:</span>
                  <span className="text-3xl font-bold text-foreground tabular-nums">
                    {String(time.secs).padStart(2, '0')}
                  </span>
                  <span className="text-lg text-muted-foreground">.</span>
                  <span className="text-lg text-muted-foreground tabular-nums">
                    {String(time.ms).padStart(2, '0')}
                  </span>
                </div>
              )}

              {explosionActive && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <AlertTriangle className="w-5 h-5 text-destructive animate-pulse" />
                  <span className="font-display text-2xl text-destructive">IMPACT CONFIRMED</span>
                </motion.div>
              )}
            </div>

            {/* Right - Speed controls & Warhead */}
            <div className="flex items-center gap-4 lg:gap-6">
              {/* Speed controls */}
              <div className="flex items-center gap-2">
                <div className="hidden lg:flex items-center gap-1 mr-2">
                  <Gauge className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground font-display">SPEED</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 5, 10].map(speed => (
                    <Button
                      key={speed}
                      variant={speedMultiplier === speed ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSpeedMultiplier(speed)}
                      className={`w-10 h-8 font-mono text-xs min-h-[44px] ${
                        speedMultiplier === speed 
                          ? 'bg-primary text-primary-foreground' 
                          : 'border-primary/30 hover:bg-primary/20'
                      }`}
                      disabled={!isLaunched}
                    >
                      {speed}x
                    </Button>
                  ))}
                </div>
              </div>

              {/* Warhead */}
              <div className="hidden lg:flex items-center gap-2">
                <div>
                  <div className="text-xs text-muted-foreground text-right">WARHEAD</div>
                  <div className="font-display text-sm text-warning text-right">
                    {selectedWarhead?.name || '---'}
                  </div>
                </div>
                <div className="w-8 h-8 rounded bg-warning/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-warning" />
                </div>
              </div>
            </div>
          </div>

          {/* Progress bar - show on all sizes when launched */}
          {isLaunched && (
            <div className="mt-2 sm:mt-3">
              <div className="relative h-1.5 sm:h-2 bg-secondary/50 rounded-full overflow-hidden">
                {/* Background glow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-success via-primary to-destructive opacity-20"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                />
                
                {/* Progress fill */}
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-success via-primary to-destructive"
                  style={{ width: `${progressPercent}%` }}
                  initial={{ width: 0 }}
                />
                
                {/* Missile indicator */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-foreground shadow-glow"
                  style={{ left: `calc(${progressPercent}% - 4px)` }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                />
              </div>

              {/* Phase markers - hidden on mobile */}
              <div className="hidden sm:flex justify-between mt-1 text-xs text-muted-foreground font-mono">
                <span>LAUNCH</span>
                <span>BOOST</span>
                <span>CRUISE</span>
                <span>RE-ENTRY</span>
                <span>IMPACT</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Alert banner for terminal phase */}
      <AnimatePresence>
        {(phase === 'terminal' || phase === 'impact') && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-destructive/90 backdrop-blur-sm py-1.5 sm:py-2 pointer-events-auto"
          >
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-destructive-foreground">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
              <span className="font-display text-xs sm:text-sm tracking-wider">
                {phase === 'impact' 
                  ? 'DETONATION CONFIRMED'
                  : 'IMPACT IMMINENT'
                }
              </span>
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MissionTimer;
