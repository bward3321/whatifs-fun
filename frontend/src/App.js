import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { WorldMap } from '@/components/WorldMap';
import { ControlPanel } from '@/components/ControlPanel';
import { MissionTimer } from '@/components/MissionTimer';
import { ExplosionOverlay } from '@/components/ExplosionOverlay';
import { nuclearWarheads, calculateDistance, calculateFlightTime, estimateCasualties } from '@/data/cities';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

function App() {
  // Mission state
  const [launchOrigin, setLaunchOrigin] = useState(null);
  const [launchTarget, setLaunchTarget] = useState(null);
  const [selectedWarhead, setSelectedWarhead] = useState(null);
  const [selectionMode, setSelectionMode] = useState(null); // 'origin' | 'target' | null

  // Launch state
  const [isLaunched, setIsLaunched] = useState(false);
  const [flightProgress, setFlightProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalFlightTime, setTotalFlightTime] = useState(0);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [explosionActive, setExplosionActive] = useState(false);

  // Refs for animation
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

  // Handle location selection from map
  const handleLocationSelect = useCallback((location) => {
    if (selectionMode === 'origin') {
      setLaunchOrigin(location);
      setSelectionMode(null);
      toast.success(`Launch origin set: ${location.name}`, {
        description: `${location.country} • ${location.lat.toFixed(2)}°, ${location.lng.toFixed(2)}°`
      });
    } else if (selectionMode === 'target') {
      setLaunchTarget(location);
      setSelectionMode(null);
      toast.error(`Target acquired: ${location.name}`, {
        description: `${location.country} • Population: ${(location.population / 1000000).toFixed(2)}M`
      });
    } else {
      // Default behavior - toggle between origin and target
      if (!launchOrigin) {
        setLaunchOrigin(location);
        toast.success(`Launch origin set: ${location.name}`);
      } else if (!launchTarget) {
        setLaunchTarget(location);
        toast.error(`Target acquired: ${location.name}`);
      }
    }
  }, [selectionMode, launchOrigin, launchTarget]);

  // Calculate flight time when origin/target changes
  useEffect(() => {
    if (launchOrigin && launchTarget) {
      const distance = calculateDistance(
        launchOrigin.lat, launchOrigin.lng,
        launchTarget.lat, launchTarget.lng
      );
      const time = calculateFlightTime(distance);
      setTotalFlightTime(time);
      setTimeRemaining(time);
    }
  }, [launchOrigin, launchTarget]);

  // Launch animation
  useEffect(() => {
    if (!isLaunched || explosionActive) return;

    const baseInterval = 50; // 50ms base update interval
    let lastUpdate = Date.now();

    const animate = () => {
      const now = Date.now();
      const delta = (now - lastUpdate) / 1000; // Convert to seconds
      lastUpdate = now;

      setTimeRemaining(prev => {
        const newTime = Math.max(0, prev - delta * speedMultiplier);
        
        // Calculate progress
        const progress = 1 - (newTime / totalFlightTime);
        setFlightProgress(progress);

        // Check if missile has reached target
        if (newTime <= 0) {
          setExplosionActive(true);
          return 0;
        }

        return newTime;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isLaunched, speedMultiplier, totalFlightTime, explosionActive]);

  // Handle launch
  const handleLaunch = useCallback(() => {
    if (!launchOrigin || !launchTarget || !selectedWarhead) {
      toast.warning('Incomplete mission parameters');
      return;
    }

    toast.success('🚀 MISSILE LAUNCHED', {
      description: `${selectedWarhead.name} en route to ${launchTarget.name}`,
      duration: 5000
    });

    setIsLaunched(true);
    setFlightProgress(0);
  }, [launchOrigin, launchTarget, selectedWarhead]);

  // Handle reset
  const handleReset = useCallback(() => {
    setIsLaunched(false);
    setFlightProgress(0);
    setExplosionActive(false);
    setTimeRemaining(totalFlightTime);
    toast.info('Mission reset');
  }, [totalFlightTime]);

  // Handle explosion complete
  const handleExplosionComplete = useCallback(() => {
    // Keep explosion overlay visible for analysis
  }, []);

  // Calculate casualties for current selection
  const casualties = launchTarget && selectedWarhead 
    ? estimateCasualties(selectedWarhead, launchTarget)
    : null;

  return (
    <div className="h-screen w-screen overflow-hidden bg-background flex flex-col">
      {/* Mission Timer - Top overlay */}
      <MissionTimer
        isLaunched={isLaunched}
        flightProgress={flightProgress}
        timeRemaining={timeRemaining}
        totalTime={totalFlightTime}
        launchOrigin={launchOrigin}
        launchTarget={launchTarget}
        selectedWarhead={selectedWarhead}
        explosionActive={explosionActive}
        speedMultiplier={speedMultiplier}
      />

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden pt-[140px]">
        {/* Map area */}
        <div className="flex-1 relative">
          <WorldMap
            onLocationSelect={handleLocationSelect}
            launchOrigin={launchOrigin}
            launchTarget={launchTarget}
            missilePosition={isLaunched ? flightProgress : null}
            isLaunched={isLaunched}
            explosionActive={explosionActive}
            blastRadius={selectedWarhead?.blastRadius}
            selectionMode={selectionMode}
          />

          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-primary/30 pointer-events-none" />
          <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-primary/30 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-primary/30 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-primary/30 pointer-events-none" />

          {/* Classification banner */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
            <div className="bg-card/80 backdrop-blur-sm border border-primary/30 rounded px-6 py-2">
              <span className="font-display text-xs tracking-[0.3em] text-primary/70">
                NUCLEAR STRIKE SIMULATION • CLASSIFIED
              </span>
            </div>
          </div>
        </div>

        {/* Control Panel - Right side */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-96 flex-shrink-0"
        >
          <ControlPanel
            launchOrigin={launchOrigin}
            launchTarget={launchTarget}
            setLaunchOrigin={setLaunchOrigin}
            setLaunchTarget={setLaunchTarget}
            selectedWarhead={selectedWarhead}
            setSelectedWarhead={setSelectedWarhead}
            onLaunch={handleLaunch}
            isLaunched={isLaunched}
            flightProgress={flightProgress}
            timeRemaining={timeRemaining}
            speedMultiplier={speedMultiplier}
            setSpeedMultiplier={setSpeedMultiplier}
            onReset={handleReset}
            selectionMode={selectionMode}
            setSelectionMode={setSelectionMode}
          />
        </motion.div>
      </div>

      {/* Explosion Overlay */}
      <ExplosionOverlay
        isActive={explosionActive}
        warhead={selectedWarhead}
        targetCity={launchTarget}
        casualties={casualties}
        onComplete={handleExplosionComplete}
      />

      {/* Toast notifications */}
      <Toaster 
        position="bottom-left" 
        toastOptions={{
          className: 'bg-card border-primary/30 text-foreground',
        }}
      />
    </div>
  );
}

export default App;
