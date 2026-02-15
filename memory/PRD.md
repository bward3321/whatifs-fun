# How Deep Is the Ocean... Really? - PRD

## Original Problem Statement
Build a premium, immersive, scroll-driven cinematic vertical experience showing ocean descent from surface (0m) to Mariana Trench (10,984m).

## Architecture
- **Frontend-only** React app (no backend needed)
- Framer-motion for scroll-triggered animations
- Canvas-based particle system
- Web Audio API for procedural ambient sound
- SVG marine life illustrations

## User Personas
- Science enthusiasts, curious minds
- Museum visitors, educational content consumers
- Anyone fascinated by ocean depth and marine life

## Core Requirements
- 10 depth sections from 0m to 10,984m
- Gradual background gradient (bright blue → black)
- 18 SVG marine creature illustrations with hover facts
- Live depth counter + "YOU ARE HERE" gauge
- Floating particle effects increasing with depth
- Ambient audio with mute/unmute toggle
- Cinematic ending with restart option
- Mobile responsive

## What's Been Implemented (Feb 2026)
- [x] Title section with sunlight rays, wave animation, seagull
- [x] 10 depth sections (0m, 10m, 50m, 200m, 1000m, 2500m, 4000m, 6000m, 8848m, 10984m)
- [x] 18 SVG marine creatures with hover tooltips
- [x] Depth markers with dotted lines (e.g., "49 METERS DEEP")
- [x] Background gradient transitions (blue → teal → dark → black)
- [x] Canvas particle system (density increases with depth)
- [x] Fixed depth gauge with "YOU ARE HERE" indicator
- [x] Web Audio API ambient drone (muted by default)
- [x] Stats, comparisons, and notes at each section
- [x] Cinematic ending with 3 reveal texts
- [x] "Explore Another Wonder" button (loops to surface)
- [x] Bioluminescent glow effects (jellyfish, anglerfish)
- [x] Responsive mobile design
- [x] Framer-motion scroll animations

## Prioritized Backlog
### P0 - Done
All core features implemented and tested

### P1 - Potential Enhancements
- Add more marine creatures (sea turtle, whale, etc.)
- Enhanced bioluminescent effects with CSS filters
- Parallax movement on creatures as user scrolls
- Sound effects on creature hover

### P2 - Nice to Have
- Social sharing (share your depth screenshot)
- Visitor analytics (track average scroll depth)
- Additional ocean facts between sections
- Smooth scroll speed control (slower descent option)

## Next Tasks
- Refine sunlight rays effect for more organic feel
- Add whale/sea turtle at intermediate depths
- Potential: Social share card at ending
