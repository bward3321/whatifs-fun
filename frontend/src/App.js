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
  const [selectionMode, setSelectionMode] = useState(null);

  // Launch state
  const [isLaunched, setIsLaunched] = useState(false);
  const [flightProgress, setFlightProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalFlightTime, setTotalFlightTime] = useState(0);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [explosionActive, setExplosionActive] = useState(false);

  // Refs
  const intervalRef = useRef(null);

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
      if (!launchOrigin) {
        setLaunchOrigin(location);
        toast.success(`Launch origin set: ${location.name}`);
      } else if (!launchTarget) {
        setLaunchTarget(location);
        toast.error(`Target acquired: ${location.name}`);
      }
    }
  }, [selectionMode, launchOrigin, launchTarget]);

  // Calculate flight data for display
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

  // Timer countdown effect
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Only run timer if launched and not exploded
    if (!isLaunched || explosionActive || totalFlightTime <= 0) {
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        const delta = 0.05 * speedMultiplier; // 50ms * speed
        const newTime = Math.max(0, prev - delta);
        
        // Update progress
        const progress = totalFlightTime > 0 ? 1 - (newTime / totalFlightTime) : 0;
        setFlightProgress(progress);
        
        // Check for impact
        if (newTime <= 0) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setExplosionActive(true);
        }
        
        return newTime;
      });
    }, 50);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isLaunched, explosionActive, totalFlightTime, speedMultiplier]);

  // Handle launch
  const handleLaunch = useCallback(() => {
    if (!launchOrigin || !launchTarget || !selectedWarhead) {
      toast.warning('Incomplete mission parameters');
      return;
    }

    // Calculate flight time
    const distance = calculateDistance(
      launchOrigin.lat, launchOrigin.lng,
      launchTarget.lat, launchTarget.lng
    );
    const flightTime = calculateFlightTime(distance);
    
    // Reset and initialize
    setExplosionActive(false);
    setFlightProgress(0);
    setTotalFlightTime(flightTime);
    setTimeRemaining(flightTime);
    
    toast.success('🚀 MISSILE LAUNCHED', {
      description: `${selectedWarhead.name} en route to ${launchTarget.name}`,
      duration: 5000
    });

    // Delay the launch flag slightly to ensure state is set
    setTimeout(() => {
      setIsLaunched(true);
    }, 100);
  }, [launchOrigin, launchTarget, selectedWarhead]);

  // Handle reset
  const handleReset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setIsLaunched(false);
    setFlightProgress(0);
    setExplosionActive(false);
    setTimeRemaining(0);
    setTotalFlightTime(0);
    toast.info('Mission reset - Ready for new simulation');
  }, []);

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
