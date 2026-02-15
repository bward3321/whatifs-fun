# Nuclear Strike Simulation - Product Requirements Document

## Original Problem Statement
Build a sophisticated nuclear simulation website with:
- Sleek, interactive global map as the main interface
- Users can select launch location and target destination (clicking map or selecting from ~120 pinned cities)
- Various nuclear warheads (historical, modern) with different yields
- Missile travel timer with speed controls (1x, 2x, 5x, 10x)
- High-quality "CIA/NSA briefing style" animations:
  - Rocket trail animation following curved great-circle path
  - Detailed explosion animation with mushroom cloud and blast radii
- Impact Analysis screen with casualty estimates and blast zone details
- Dark tactical theme with cyan/teal accents
- Fully mobile-responsive
- Google Analytics integration
- Production build ready for Vercel deployment

## Tech Stack
- **Frontend**: React 18
- **Styling**: Tailwind CSS, shadcn/ui components
- **Mapping**: react-simple-maps, d3-geo
- **Animation**: framer-motion
- **State Management**: React Hooks (useState, useEffect, useRef)
- **Build Tool**: CRACO (Create React App Configuration Override)

## Architecture
```
/app
├── frontend
│   ├── public/index.html
│   ├── src
│   │   ├── components
│   │   │   ├── ui/ (shadcn components)
│   │   │   ├── ControlPanel.jsx - Mission control panel with tabs
│   │   │   ├── ExplosionOverlay.jsx - Impact analysis modal
│   │   │   ├── MissionTimer.jsx - Header with timer and speed controls
│   │   │   └── WorldMap.jsx - Interactive map with markers
│   │   ├── data/cities.js - City data and calculations
│   │   ├── App.js - Main component
│   │   └── index.css - Global styles and CSS tokens
│   └── tailwind.config.js
└── vercel-deploy
    ├── nuclear-simulation/ (production build)
    └── vercel.json
```

## Data (All MOCKED on Client Side)
- ~120 world cities with coordinates and populations
- 6 nuclear warhead types (Little Boy, Fat Man, W76-1, W87-1, B83, Tsar Bomba, RS-28 Sarmat)
- Casualty estimation algorithms
- Blast radius calculations
- Flight time calculations based on distance

## What's Been Implemented

### Core Features ✅
- [x] Interactive world map with 120+ cities
- [x] City search and selection (origin/target)
- [x] Multiple warhead selection with yield specifications
- [x] Custom warhead creation
- [x] Missile launch with real-time countdown timer
- [x] Speed controls (1x, 2x, 5x, 10x)
- [x] Great-circle arc missile trajectory
- [x] Animated missile flight with trail
- [x] Explosion animation with mushroom cloud effect
- [x] Impact Analysis overlay with:
  - Fatality and injury estimates
  - Blast zone visualization (fireball, severe, moderate, light damage)
  - Total area affected calculation
- [x] Reset/New Simulation functionality

### Mobile Responsiveness ✅ (Fixed Feb 15, 2025)
- [x] Vertical stacked layout on mobile (map above, controls below)
- [x] Collapsible "Mission Control" panel
- [x] Touch-friendly buttons (min 44px height)
- [x] Larger zoom controls on mobile (44x44px)
- [x] Responsive header with origin/target display
- [x] Speed control buttons accessible on mobile
- [x] Impact analysis overlay fully scrollable on mobile

### Integration ✅
- [x] Google Analytics (ID: G-13KHBC5TPS for production)
- [x] "Made with Emergent" badge removed

### Vercel Deployment ✅ (Feb 15, 2025)
- [x] Production build at `/app/vercel-deploy/nuclear-simulation/`
- [x] Relative asset paths (./static/...)
- [x] Google Analytics ID updated to G-13KHBC5TPS
- [x] Emergent/PostHog scripts removed
- [x] vercel.json with trailingSlash: true

## Testing Status
- Frontend: 100% pass rate
- Mobile responsiveness verified at 375px and 390px viewports
- Full simulation flow tested end-to-end

## Deployment Instructions
1. The production build is located at `/app/vercel-deploy/`
2. Upload the `nuclear-simulation` folder contents to Vercel
3. Configure `vercel.json` (already included) for proper routing
4. Domain configuration as needed

## Future Enhancements (Backlog)
- [ ] Refactor App.js - extract animation logic into custom hook
- [ ] Add more cities to the database
- [ ] Historical nuclear test data visualization
- [ ] Fallout simulation
- [ ] Multiple simultaneous strikes
- [ ] Sound effects (optional toggle)
