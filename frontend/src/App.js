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
  const timeRemainingRef = useRef(0);
  const speedRef = useRef(1);

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

  // Calculate flight data for display (distance, estimated time)
  const flightData = React.useMemo(() => {
    if (launchOrigin && launchTarget) {
      const distance = calculateDistance(
        launchOrigin.lat, launchOrigin.lng,
        launchTarget.lat, launchTarget.lng
      );
      const time = calculateFlightTime(distance);
      return { distance, time };
    }
    return { distance: 0, time: 0 };
  }, [launchOrigin, launchTarget]);

  // Keep speed ref in sync
  useEffect(() => {
    speedRef.current = speedMultiplier;
  }, [speedMultiplier]);

  // Launch animation using interval for reliability
  useEffect(() => {
    if (!isLaunched || explosionActive) return;
    
    // Make sure we have valid flight time
    if (timeRemainingRef.current <= 0 || totalFlightTime <= 0) return;

    const intervalId = setInterval(() => {
      const currentSpeed = speedRef.current;
      const delta = 0.05 * currentSpeed; // 50ms interval * speed
      
      timeRemainingRef.current = Math.max(0, timeRemainingRef.current - delta);
      
      const progress = timeRemainingRef.current > 0 
        ? 1 - (timeRemainingRef.current / totalFlightTime)
        : 1;
      
      setTimeRemaining(timeRemainingRef.current);
      setFlightProgress(progress);

      // Check if missile has reached target
      if (timeRemainingRef.current <= 0) {
        clearInterval(intervalId);
        setExplosionActive(true);
      }
    }, 50);

    return () => {
      clearInterval(intervalId);
    };
  }, [isLaunched, totalFlightTime, explosionActive]);

  // Handle launch
  const handleLaunch = useCallback(() => {
    if (!launchOrigin || !launchTarget || !selectedWarhead) {
      toast.warning('Incomplete mission parameters');
      return;
    }

    // Calculate flight time for this mission
    const distance = calculateDistance(
      launchOrigin.lat, launchOrigin.lng,
      launchTarget.lat, launchTarget.lng
    );
    const flightTime = calculateFlightTime(distance);
    
    // Set all state for launch
    setTotalFlightTime(flightTime);
    setTimeRemaining(flightTime);
    timeRemainingRef.current = flightTime;
    setFlightProgress(0);
    setExplosionActive(false);
    
    toast.success('🚀 MISSILE LAUNCHED', {
      description: `${selectedWarhead.name} en route to ${launchTarget.name}`,
      duration: 5000
    });

    // Set launched AFTER setting up all the state
    setIsLaunched(true);
  }, [launchOrigin, launchTarget, selectedWarhead]);

  // Handle reset
  const handleReset = useCallback(() => {
    // Cancel any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    setIsLaunched(false);
    setFlightProgress(0);
    setExplosionActive(false);
    setTimeRemaining(totalFlightTime);
    timeRemainingRef.current = totalFlightTime;
    toast.info('Mission reset - Ready for new simulation');
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
        setSpeedMultiplier={setSpeedMultiplier}
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
        onReset={handleReset}
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
