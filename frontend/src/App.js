import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WorldMap } from '@/components/WorldMap';
import { ControlPanel } from '@/components/ControlPanel';
import { MissionTimer } from '@/components/MissionTimer';
import { ExplosionOverlay } from '@/components/ExplosionOverlay';
import { nuclearWarheads, calculateDistance, calculateFlightTime, estimateCasualties } from '@/data/cities';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { ChevronUp, ChevronDown } from 'lucide-react';

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

  // Mobile state
  const [mobileControlsExpanded, setMobileControlsExpanded] = useState(true);

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
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!isLaunched || explosionActive || totalFlightTime <= 0) {
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        const delta = 0.05 * speedMultiplier;
        const newTime = Math.max(0, prev - delta);
        
        const progress = totalFlightTime > 0 ? 1 - (newTime / totalFlightTime) : 0;
        setFlightProgress(progress);
        
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

    const distance = calculateDistance(
      launchOrigin.lat, launchOrigin.lng,
      launchTarget.lat, launchTarget.lng
    );
    const flightTime = calculateFlightTime(distance);
    
    setExplosionActive(false);
    setFlightProgress(0);
    setTotalFlightTime(flightTime);
    setTimeRemaining(flightTime);
    
    toast.success('🚀 MISSILE LAUNCHED', {
      description: `${selectedWarhead.name} en route to ${launchTarget.name}`,
      duration: 5000
    });

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

      {/* Main content - Desktop: side by side, Mobile: stacked */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden pt-[100px] sm:pt-[120px] lg:pt-[140px]">
        {/* Map area - Takes priority on mobile */}
        <div className="flex-1 relative min-h-[40vh] lg:min-h-0">
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

          {/* Corner decorations - hidden on mobile */}
          <div className="hidden sm:block absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-primary/30 pointer-events-none" />
          <div className="hidden sm:block absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-primary/30 pointer-events-none" />
          <div className="hidden sm:block absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-primary/30 pointer-events-none" />
          <div className="hidden sm:block absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-primary/30 pointer-events-none" />

          {/* Classification banner - smaller on mobile */}
          <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
            <div className="bg-card/80 backdrop-blur-sm border border-primary/30 rounded px-3 sm:px-6 py-1 sm:py-2">
              <span className="font-display text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] text-primary/70">
                NUCLEAR SIMULATION
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Controls Toggle Button */}
        <div className="lg:hidden flex-shrink-0 bg-card/95 border-t border-primary/30">
          <button
            onClick={() => setMobileControlsExpanded(!mobileControlsExpanded)}
            className="w-full py-3 px-4 flex items-center justify-between text-primary min-h-[48px]"
          >
            <span className="font-display text-sm tracking-wider">MISSION CONTROL</span>
            {mobileControlsExpanded ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronUp className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Control Panel - Collapsible on mobile, fixed width on desktop */}
        <AnimatePresence>
          <motion.div
            initial={{ height: 'auto', opacity: 1 }}
            animate={{ 
              height: mobileControlsExpanded ? 'auto' : 0,
              opacity: mobileControlsExpanded ? 1 : 0
            }}
            className={`
              lg:w-96 lg:flex-shrink-0 lg:h-full
              overflow-hidden lg:overflow-visible
              ${mobileControlsExpanded ? 'flex-1 lg:flex-none' : 'h-0 lg:h-full'}
            `}
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
        </AnimatePresence>
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
