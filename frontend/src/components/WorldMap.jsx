import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
  ZoomableGroup
} from 'react-simple-maps';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Target, Crosshair } from 'lucide-react';
import { worldCities } from '@/data/cities';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export const WorldMap = ({ 
  onLocationSelect, 
  launchOrigin, 
  launchTarget,
  missilePosition,
  isLaunched,
  explosionActive,
  blastRadius,
  selectionMode 
}) => {
  const [hoveredCity, setHoveredCity] = useState(null);
  const [clickCoords, setClickCoords] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState([0, 20]);

  const handleMapClick = useCallback((event) => {
    if (event.target.classList.contains('rsm-geography') || event.target.tagName === 'svg') {
      // Get click position relative to the map
      const svg = event.currentTarget.querySelector('svg');
      if (!svg) return;
      
      const rect = svg.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Convert pixel coordinates to geographic coordinates
      // This is a simplified projection conversion
      const width = rect.width;
      const height = rect.height;
      
      const lng = ((x / width) * 360 - 180) / zoom + center[0];
      const lat = (90 - (y / height) * 180) / zoom + center[1] - 20;
      
      setClickCoords({ lat: lat.toFixed(4), lng: lng.toFixed(4) });
      
      setTimeout(() => setClickCoords(null), 3000);
    }
  }, [zoom, center]);

  const handleCityClick = useCallback((city) => {
    onLocationSelect({
      name: city.name,
      country: city.country,
      lat: city.lat,
      lng: city.lng,
      population: city.population
    });
  }, [onLocationSelect]);

  // Generate missile path as great circle arc
  const missilePath = useMemo(() => {
    if (!launchOrigin || !launchTarget) return null;
    return {
      from: [launchOrigin.lng, launchOrigin.lat],
      to: [launchTarget.lng, launchTarget.lat]
    };
  }, [launchOrigin, launchTarget]);

  // Calculate position along great circle arc
  const interpolateGreatCircle = useCallback((start, end, fraction) => {
    // Convert to radians
    const lat1 = start.lat * Math.PI / 180;
    const lng1 = start.lng * Math.PI / 180;
    const lat2 = end.lat * Math.PI / 180;
    const lng2 = end.lng * Math.PI / 180;

    // Calculate angular distance
    const d = 2 * Math.asin(Math.sqrt(
      Math.pow(Math.sin((lat1 - lat2) / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin((lng1 - lng2) / 2), 2)
    ));

    if (d === 0) return [start.lng, start.lat];

    const A = Math.sin((1 - fraction) * d) / Math.sin(d);
    const B = Math.sin(fraction * d) / Math.sin(d);

    const x = A * Math.cos(lat1) * Math.cos(lng1) + B * Math.cos(lat2) * Math.cos(lng2);
    const y = A * Math.cos(lat1) * Math.sin(lng1) + B * Math.cos(lat2) * Math.sin(lng2);
    const z = A * Math.sin(lat1) + B * Math.sin(lat2);

    const lat = Math.atan2(z, Math.sqrt(x * x + y * y)) * 180 / Math.PI;
    const lng = Math.atan2(y, x) * 180 / Math.PI;

    return [lng, lat];
  }, []);

  // Calculate missile current position along the great circle path
  const currentMissilePos = useMemo(() => {
    if (!missilePosition || !launchOrigin || !launchTarget) return null;
    
    return interpolateGreatCircle(launchOrigin, launchTarget, missilePosition);
  }, [missilePosition, launchOrigin, launchTarget, interpolateGreatCircle]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg tactical-border">
      {/* Scanline overlay */}
      <div className="absolute inset-0 scanline z-10 pointer-events-none" />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-tactical opacity-30 z-10 pointer-events-none" />
      
      {/* Click coordinates display */}
      <AnimatePresence>
        {clickCoords && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 left-4 z-20 bg-card/95 border border-primary/40 rounded px-3 py-2 font-mono text-sm"
          >
            <span className="text-muted-foreground">LAT:</span>{' '}
            <span className="text-primary">{clickCoords.lat}°</span>
            <span className="text-muted-foreground ml-3">LNG:</span>{' '}
            <span className="text-primary">{clickCoords.lng}°</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selection mode indicator */}
      {selectionMode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 right-4 z-20 bg-card/95 border border-primary/40 rounded px-4 py-2"
        >
          <div className="flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-primary animate-pulse" />
            <span className="font-display text-sm text-primary tracking-wider">
              SELECT {selectionMode.toUpperCase()}
            </span>
          </div>
        </motion.div>
      )}

      {/* Map */}
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 150,
          center: [0, 20]
        }}
        className="w-full h-full bg-background"
        onClick={handleMapClick}
      >
        <ZoomableGroup
          zoom={zoom}
          center={center}
          onMoveEnd={({ coordinates, zoom: newZoom }) => {
            setCenter(coordinates);
            setZoom(newZoom);
          }}
          minZoom={1}
          maxZoom={8}
        >
          {/* Countries */}
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  className="rsm-geography"
                  style={{
                    default: {
                      fill: 'hsl(var(--secondary))',
                      stroke: 'hsl(var(--primary) / 0.2)',
                      strokeWidth: 0.5,
                      outline: 'none',
                    },
                    hover: {
                      fill: 'hsl(var(--primary) / 0.15)',
                      stroke: 'hsl(var(--primary) / 0.4)',
                      strokeWidth: 0.5,
                      outline: 'none',
                    },
                    pressed: {
                      fill: 'hsl(var(--primary) / 0.2)',
                      outline: 'none',
                    },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Missile trajectory path */}
          {missilePath && (
            <>
              {/* Trail path - dashed */}
              <Line
                from={missilePath.from}
                to={missilePath.to}
                stroke="hsl(var(--primary) / 0.3)"
                strokeWidth={1.5}
                strokeDasharray="5,5"
                strokeLinecap="round"
              />
              
              {/* Active path - glowing */}
              {isLaunched && missilePosition > 0 && (
                <Line
                  from={missilePath.from}
                  to={currentMissilePos || missilePath.to}
                  stroke="hsl(var(--missile-trail))"
                  strokeWidth={2}
                  strokeLinecap="round"
                  className="missile-glow"
                />
              )}
            </>
          )}

          {/* City markers */}
          {worldCities.map((city) => {
            const isOrigin = launchOrigin?.name === city.name;
            const isTarget = launchTarget?.name === city.name;
            
            return (
              <Marker
                key={`${city.name}-${city.country}`}
                coordinates={[city.lng, city.lat]}
                onClick={() => handleCityClick(city)}
                onMouseEnter={() => setHoveredCity(city)}
                onMouseLeave={() => setHoveredCity(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Marker circle */}
                <circle
                  r={isOrigin || isTarget ? 6 : 3}
                  fill={
                    isOrigin 
                      ? 'hsl(var(--success))' 
                      : isTarget 
                        ? 'hsl(var(--destructive))' 
                        : 'hsl(var(--primary))'
                  }
                  stroke={
                    isOrigin || isTarget 
                      ? 'hsl(var(--foreground))' 
                      : 'hsl(var(--primary) / 0.5)'
                  }
                  strokeWidth={isOrigin || isTarget ? 2 : 1}
                  className={isOrigin || isTarget ? 'target-pulse' : ''}
                />
                
                {/* Outer ring for selected markers */}
                {(isOrigin || isTarget) && (
                  <circle
                    r={12}
                    fill="none"
                    stroke={isOrigin ? 'hsl(var(--success) / 0.5)' : 'hsl(var(--destructive) / 0.5)'}
                    strokeWidth={1}
                    strokeDasharray="3,3"
                    className="animate-spin"
                    style={{ animationDuration: '10s' }}
                  />
                )}
                
                {/* City label */}
                {(hoveredCity?.name === city.name || isOrigin || isTarget || zoom > 2) && (
                  <text
                    textAnchor="middle"
                    y={-12}
                    className="font-body text-[8px] fill-foreground pointer-events-none"
                    style={{ fontWeight: isOrigin || isTarget ? 600 : 400 }}
                  >
                    {city.name}
                  </text>
                )}
              </Marker>
            );
          })}

          {/* Missile marker */}
          {isLaunched && currentMissilePos && !explosionActive && (
            <Marker coordinates={currentMissilePos}>
              <motion.g
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                {/* Missile glow */}
                <circle
                  r={8}
                  fill="hsl(var(--missile-trail) / 0.3)"
                  className="missile-glow"
                />
                {/* Missile body */}
                <circle
                  r={4}
                  fill="hsl(var(--missile-trail))"
                  className="missile-glow"
                />
                {/* Missile trail particles */}
                <circle
                  r={3}
                  fill="hsl(var(--foreground))"
                />
              </motion.g>
            </Marker>
          )}

          {/* Explosion effect */}
          {explosionActive && launchTarget && (
            <Marker coordinates={[launchTarget.lng, launchTarget.lat]}>
              <ExplosionEffect blastRadius={blastRadius} zoom={zoom} />
            </Marker>
          )}
        </ZoomableGroup>
      </ComposableMap>

      {/* Hover tooltip */}
      <AnimatePresence>
        {hoveredCity && !selectionMode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-4 left-4 z-20 bg-card/95 border border-primary/40 rounded px-4 py-3"
          >
            <div className="font-display text-primary text-sm tracking-wider">
              {hoveredCity.name}
            </div>
            <div className="text-muted-foreground text-xs mt-1">
              {hoveredCity.country} • Pop: {(hoveredCity.population / 1000000).toFixed(2)}M
            </div>
            <div className="font-mono text-xs text-primary/70 mt-1">
              {hoveredCity.lat.toFixed(4)}°, {hoveredCity.lng.toFixed(4)}°
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={() => setZoom(Math.min(zoom * 1.5, 8))}
          className="w-8 h-8 bg-card/90 border border-primary/40 rounded flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
        >
          +
        </button>
        <button
          onClick={() => setZoom(Math.max(zoom / 1.5, 1))}
          className="w-8 h-8 bg-card/90 border border-primary/40 rounded flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
        >
          −
        </button>
        <button
          onClick={() => { setZoom(1); setCenter([0, 20]); }}
          className="w-8 h-8 bg-card/90 border border-primary/40 rounded flex items-center justify-center text-primary hover:bg-primary/20 transition-colors text-xs"
        >
          ⟲
        </button>
      </div>
    </div>
  );
};

// Explosion effect component
const ExplosionEffect = ({ blastRadius, zoom }) => {
  const scale = Math.max(0.5, zoom);
  const baseSize = blastRadius?.severe || 5;
  
  return (
    <motion.g>
      {/* Fireball core */}
      <motion.circle
        initial={{ r: 0, opacity: 1 }}
        animate={{ 
          r: [0, baseSize * 2, baseSize * 1.5],
          opacity: [1, 1, 0.8]
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        fill="url(#fireballGradient)"
      />
      
      {/* Shockwave rings */}
      {[1, 2, 3].map((i) => (
        <motion.circle
          key={i}
          initial={{ r: 0, opacity: 0.8, strokeWidth: 3 }}
          animate={{ 
            r: baseSize * (i * 3),
            opacity: 0,
            strokeWidth: 0.5
          }}
          transition={{ 
            duration: 1.5 + i * 0.3,
            delay: i * 0.2,
            ease: "easeOut"
          }}
          fill="none"
          stroke="hsl(var(--shockwave))"
        />
      ))}
      
      {/* Blast zone indicator */}
      <motion.circle
        initial={{ r: 0, opacity: 0 }}
        animate={{ 
          r: baseSize * 4,
          opacity: [0, 0.3, 0.2]
        }}
        transition={{ duration: 2, delay: 0.5 }}
        fill="hsl(var(--destructive) / 0.2)"
        stroke="hsl(var(--destructive) / 0.5)"
        strokeWidth={1}
        strokeDasharray="4,4"
      />
      
      {/* Gradient definitions */}
      <defs>
        <radialGradient id="fireballGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(50 100% 90%)" />
          <stop offset="30%" stopColor="hsl(40 100% 60%)" />
          <stop offset="60%" stopColor="hsl(25 100% 50%)" />
          <stop offset="100%" stopColor="hsl(0 80% 40%)" />
        </radialGradient>
      </defs>
    </motion.g>
  );
};

export default WorldMap;
