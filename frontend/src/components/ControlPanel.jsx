import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, 
  Target, 
  MapPin, 
  AlertTriangle, 
  Zap, 
  Timer,
  ChevronDown,
  ChevronUp,
  Search,
  Plus,
  X,
  Play,
  Pause,
  FastForward,
  RotateCcw,
  Radiation,
  Skull,
  Users,
  CircleDot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { worldCities, nuclearWarheads, calculateDistance, calculateFlightTime, estimateCasualties } from '@/data/cities';

export const ControlPanel = ({
  launchOrigin,
  launchTarget,
  setLaunchOrigin,
  setLaunchTarget,
  selectedWarhead,
  setSelectedWarhead,
  onLaunch,
  isLaunched,
  flightProgress,
  timeRemaining,
  speedMultiplier,
  setSpeedMultiplier,
  onReset,
  selectionMode,
  setSelectionMode
}) => {
  const [searchOrigin, setSearchOrigin] = useState('');
  const [searchTarget, setSearchTarget] = useState('');
  const [customWarhead, setCustomWarhead] = useState({ name: '', yield: 100 });
  const [showCustomWarhead, setShowCustomWarhead] = useState(false);
  const [activeTab, setActiveTab] = useState('launch');

  // Filter cities based on search
  const filteredOriginCities = worldCities.filter(city => 
    city.name.toLowerCase().includes(searchOrigin.toLowerCase()) ||
    city.country.toLowerCase().includes(searchOrigin.toLowerCase())
  ).slice(0, 10);

  const filteredTargetCities = worldCities.filter(city => 
    city.name.toLowerCase().includes(searchTarget.toLowerCase()) ||
    city.country.toLowerCase().includes(searchTarget.toLowerCase())
  ).slice(0, 10);

  // Calculate mission stats
  const distance = launchOrigin && launchTarget 
    ? calculateDistance(launchOrigin.lat, launchOrigin.lng, launchTarget.lat, launchTarget.lng)
    : 0;
  
  const flightTime = distance ? calculateFlightTime(distance) : 0;
  
  const casualties = launchTarget && selectedWarhead 
    ? estimateCasualties(selectedWarhead, launchTarget)
    : null;

  // Handle custom warhead creation
  const handleCreateCustomWarhead = () => {
    if (customWarhead.name && customWarhead.yield > 0) {
      const yieldKt = customWarhead.yield;
      const blastFactor = Math.pow(yieldKt / 15, 1/3); // Cube root scaling
      
      const newWarhead = {
        id: `custom-${Date.now()}`,
        name: customWarhead.name,
        yield: yieldKt,
        unit: 'kt',
        description: 'Custom warhead',
        type: 'custom',
        blastRadius: {
          fireball: 0.2 * blastFactor,
          severe: 1.2 * blastFactor,
          moderate: 2.4 * blastFactor,
          light: 4.8 * blastFactor
        }
      };
      
      setSelectedWarhead(newWarhead);
      setShowCustomWarhead(false);
      setCustomWarhead({ name: '', yield: 100 });
    }
  };

  const canLaunch = launchOrigin && launchTarget && selectedWarhead && !isLaunched;

  return (
    <div className="h-full flex flex-col bg-card/50 border-l border-primary/20 overflow-hidden lg:border-l">
      {/* Header - hidden on mobile since we have the toggle */}
      <div className="hidden lg:block p-4 border-b border-primary/20 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center">
            <Radiation className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-lg text-primary tracking-wider">MISSION CONTROL</h2>
            <p className="text-xs text-muted-foreground">Nuclear Strike Simulator</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="mx-2 sm:mx-4 mt-2 sm:mt-4 bg-secondary/50 flex-shrink-0">
          <TabsTrigger value="launch" className="flex-1 font-body min-h-[44px] text-xs sm:text-sm">Launch</TabsTrigger>
          <TabsTrigger value="warhead" className="flex-1 font-body min-h-[44px] text-xs sm:text-sm">Warhead</TabsTrigger>
          <TabsTrigger value="intel" className="flex-1 font-body min-h-[44px] text-xs sm:text-sm">Intel</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 px-2 sm:px-4 min-h-0">
          {/* Launch Tab */}
          <TabsContent value="launch" className="mt-2 sm:mt-4 space-y-3 sm:space-y-4 pb-4">
            {/* Origin Selection */}
            <Card className="bg-card/80 border-primary/20">
              <CardHeader className="py-2 sm:py-3 px-3 sm:px-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Rocket className="w-4 h-4 text-success" />
                    <CardTitle className="text-xs sm:text-sm font-display tracking-wider text-success">
                      LAUNCH ORIGIN
                    </CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectionMode(selectionMode === 'origin' ? null : 'origin')}
                    className={`min-h-[44px] min-w-[44px] ${selectionMode === 'origin' ? 'text-success' : ''}`}
                  >
                    <MapPin className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search city..."
                      value={searchOrigin}
                      onChange={(e) => setSearchOrigin(e.target.value)}
                      className="pl-9 bg-secondary/50 border-primary/20"
                    />
                  </div>
                  
                  {searchOrigin && (
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {filteredOriginCities.map(city => (
                        <button
                          key={`${city.name}-${city.country}`}
                          onClick={() => {
                            setLaunchOrigin(city);
                            setSearchOrigin('');
                          }}
                          className="w-full text-left px-3 py-2 text-sm rounded bg-secondary/30 hover:bg-primary/20 transition-colors"
                        >
                          <span className="text-foreground">{city.name}</span>
                          <span className="text-muted-foreground ml-2 text-xs">{city.country}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {launchOrigin && (
                    <div className="bg-success/10 border border-success/30 rounded p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-display text-success text-sm">{launchOrigin.name}</div>
                          <div className="text-xs text-muted-foreground">{launchOrigin.country}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setLaunchOrigin(null)}
                          className="h-6 w-6"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="font-mono text-xs text-success/70 mt-1">
                        {launchOrigin.lat.toFixed(4)}°, {launchOrigin.lng.toFixed(4)}°
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Target Selection */}
            <Card className="bg-card/80 border-primary/20">
              <CardHeader className="py-3 px-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-destructive" />
                    <CardTitle className="text-sm font-display tracking-wider text-destructive">
                      TARGET DESTINATION
                    </CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectionMode(selectionMode === 'target' ? null : 'target')}
                    className={selectionMode === 'target' ? 'text-destructive' : ''}
                  >
                    <MapPin className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search city..."
                      value={searchTarget}
                      onChange={(e) => setSearchTarget(e.target.value)}
                      className="pl-9 bg-secondary/50 border-primary/20"
                    />
                  </div>
                  
                  {searchTarget && (
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {filteredTargetCities.map(city => (
                        <button
                          key={`${city.name}-${city.country}`}
                          onClick={() => {
                            setLaunchTarget(city);
                            setSearchTarget('');
                          }}
                          className="w-full text-left px-3 py-2 text-sm rounded bg-secondary/30 hover:bg-primary/20 transition-colors"
                        >
                          <span className="text-foreground">{city.name}</span>
                          <span className="text-muted-foreground ml-2 text-xs">{city.country}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {launchTarget && (
                    <div className="bg-destructive/10 border border-destructive/30 rounded p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-display text-destructive text-sm">{launchTarget.name}</div>
                          <div className="text-xs text-muted-foreground">{launchTarget.country}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setLaunchTarget(null)}
                          className="h-6 w-6"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="font-mono text-xs text-destructive/70 mt-1">
                        {launchTarget.lat.toFixed(4)}°, {launchTarget.lng.toFixed(4)}°
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Mission Stats */}
            {distance > 0 && (
              <Card className="bg-card/80 border-primary/20">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm font-display tracking-wider text-primary">
                    MISSION PARAMETERS
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Distance</span>
                    <span className="font-mono text-sm text-primary">{distance.toFixed(0)} km</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Est. Flight Time</span>
                    <span className="font-mono text-sm text-primary">
                      {Math.floor(flightTime / 60)}m {Math.floor(flightTime % 60)}s
                    </span>
                  </div>
                  {selectedWarhead && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Warhead</span>
                      <Badge variant="outline" className="font-mono text-xs">
                        {selectedWarhead.name}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Warhead Tab */}
          <TabsContent value="warhead" className="mt-4 space-y-4 pb-4">
            <Card className="bg-card/80 border-primary/20">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm font-display tracking-wider text-warning flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  SELECT WARHEAD
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-3">
                {nuclearWarheads.map(warhead => (
                  <button
                    key={warhead.id}
                    onClick={() => setSelectedWarhead(warhead)}
                    className={`w-full text-left p-3 rounded border transition-all ${
                      selectedWarhead?.id === warhead.id
                        ? 'bg-warning/20 border-warning/50'
                        : 'bg-secondary/30 border-primary/20 hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-display text-sm">{warhead.name}</div>
                        <div className="text-xs text-muted-foreground">{warhead.description}</div>
                      </div>
                      <Badge 
                        variant={warhead.type === 'historical' ? 'secondary' : 'default'}
                        className="font-mono"
                      >
                        {warhead.yield >= 1000 
                          ? `${(warhead.yield / 1000).toFixed(0)} MT` 
                          : `${warhead.yield} kt`}
                      </Badge>
                    </div>
                  </button>
                ))}

                {/* Custom warhead toggle */}
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => setShowCustomWarhead(!showCustomWarhead)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Custom Warhead
                  {showCustomWarhead ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
                </Button>

                <AnimatePresence>
                  {showCustomWarhead && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-3 pt-3">
                        <div>
                          <Label className="text-xs">Warhead Name</Label>
                          <Input
                            value={customWarhead.name}
                            onChange={(e) => setCustomWarhead(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g., Custom W-90"
                            className="mt-1 bg-secondary/50"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Yield (kilotons)</Label>
                          <div className="flex items-center gap-4 mt-2">
                            <Slider
                              value={[customWarhead.yield]}
                              onValueChange={([val]) => setCustomWarhead(prev => ({ ...prev, yield: val }))}
                              min={1}
                              max={100000}
                              step={1}
                              className="flex-1"
                            />
                            <Input
                              type="number"
                              value={customWarhead.yield}
                              onChange={(e) => setCustomWarhead(prev => ({ ...prev, yield: parseInt(e.target.value) || 0 }))}
                              className="w-24 bg-secondary/50"
                            />
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            = {customWarhead.yield >= 1000 
                              ? `${(customWarhead.yield / 1000).toFixed(2)} Megatons`
                              : `${customWarhead.yield} Kilotons`}
                          </div>
                        </div>
                        <Button
                          onClick={handleCreateCustomWarhead}
                          className="w-full"
                          disabled={!customWarhead.name || customWarhead.yield <= 0}
                        >
                          Create Warhead
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Selected warhead details */}
            {selectedWarhead && (
              <Card className="bg-warning/10 border-warning/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Radiation className="w-5 h-5 text-warning" />
                    <span className="font-display text-warning">{selectedWarhead.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-muted-foreground block">Yield</span>
                      <span className="font-mono text-foreground">
                        {selectedWarhead.yield >= 1000 
                          ? `${(selectedWarhead.yield / 1000).toFixed(1)} MT` 
                          : `${selectedWarhead.yield} kt`}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Type</span>
                      <span className="font-mono text-foreground capitalize">{selectedWarhead.type}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Fireball Radius</span>
                      <span className="font-mono text-foreground">{selectedWarhead.blastRadius.fireball.toFixed(1)} km</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Severe Damage</span>
                      <span className="font-mono text-foreground">{selectedWarhead.blastRadius.severe.toFixed(1)} km</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Intel Tab */}
          <TabsContent value="intel" className="mt-4 space-y-4 pb-4">
            {casualties ? (
              <>
                <Card className="bg-destructive/10 border-destructive/30">
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-sm font-display tracking-wider text-destructive flex items-center gap-2">
                      <Skull className="w-4 h-4" />
                      CASUALTY ESTIMATE
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-card/50 rounded p-3">
                        <div className="text-xs text-muted-foreground mb-1">Immediate Deaths</div>
                        <div className="font-display text-xl text-destructive">
                          {casualties.immediate.toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-card/50 rounded p-3">
                        <div className="text-xs text-muted-foreground mb-1">Injured</div>
                        <div className="font-display text-xl text-warning">
                          {casualties.injured.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 bg-card/50 rounded p-3">
                      <div className="text-xs text-muted-foreground mb-1">Total Affected</div>
                      <div className="font-display text-2xl text-foreground">
                        {casualties.total.toLocaleString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/80 border-primary/20">
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-sm font-display tracking-wider text-primary flex items-center gap-2">
                      <CircleDot className="w-4 h-4" />
                      BLAST ZONES
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-amber-500" />
                      <span className="text-xs text-muted-foreground flex-1">Fireball</span>
                      <span className="font-mono text-sm">{selectedWarhead?.blastRadius.fireball.toFixed(1)} km</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-destructive" />
                      <span className="text-xs text-muted-foreground flex-1">Severe Damage</span>
                      <span className="font-mono text-sm">{selectedWarhead?.blastRadius.severe.toFixed(1)} km</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-orange-500" />
                      <span className="text-xs text-muted-foreground flex-1">Moderate Damage</span>
                      <span className="font-mono text-sm">{selectedWarhead?.blastRadius.moderate.toFixed(1)} km</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-yellow-500/50" />
                      <span className="text-xs text-muted-foreground flex-1">Light Damage</span>
                      <span className="font-mono text-sm">{selectedWarhead?.blastRadius.light.toFixed(1)} km</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-primary/20">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground flex-1">Total Area Affected</span>
                        <span className="font-mono text-sm text-primary">{casualties.areaAffected.toFixed(0)} km²</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {launchTarget && (
                  <Card className="bg-card/80 border-primary/20">
                    <CardHeader className="py-3 px-4">
                      <CardTitle className="text-sm font-display tracking-wider text-primary flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        TARGET INTEL
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">City Population</span>
                        <span className="font-mono text-sm">{launchTarget.population.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Country</span>
                        <span className="font-mono text-sm">{launchTarget.country}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Coordinates</span>
                        <span className="font-mono text-sm">{launchTarget.lat.toFixed(2)}°, {launchTarget.lng.toFixed(2)}°</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground text-sm">
                  Select a target and warhead to view intelligence data
                </p>
              </div>
            )}
          </TabsContent>
        </ScrollArea>

        {/* Launch Controls - Fixed at bottom */}
        <div className="p-2 sm:p-4 border-t border-primary/20 bg-card/95 flex-shrink-0">
          {/* Launch/Reset buttons */}
          <div className="flex gap-2 sm:gap-3">
            {!isLaunched ? (
              <Button
                variant="launch"
                size="xl"
                className="flex-1 min-h-[52px] text-base"
                onClick={onLaunch}
                disabled={!canLaunch}
              >
                <Rocket className="w-5 h-5 mr-2" />
                LAUNCH
              </Button>
            ) : (
              <Button
                variant="outline"
                size="xl"
                className="flex-1 min-h-[52px] text-base"
                onClick={onReset}
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                RESET
              </Button>
            )}
          </div>

          {!canLaunch && !isLaunched && (
            <p className="text-[10px] sm:text-xs text-muted-foreground text-center mt-2">
              {!launchOrigin && "Select origin • "}
              {!launchTarget && "Select target • "}
              {!selectedWarhead && "Select warhead"}
            </p>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default ControlPanel;
