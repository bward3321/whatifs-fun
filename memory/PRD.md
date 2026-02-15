# How Deep Is the Ocean... Really? - PRD

## Original Problem Statement
Build a premium, immersive, scroll-driven cinematic vertical experience showing ocean descent from surface (0m) to Mariana Trench (10,984m). 5-7 minute experience with marine life, human achievements, and pressure comparisons.

## Architecture
- **Frontend-only** React app (no backend needed)
- Framer Motion for scroll-triggered animations
- Canvas-based particle system
- Web Audio API for procedural ambient sound
- SVG marine life illustrations (30+ creatures)

## User Personas
- Science enthusiasts, curious minds
- Museum visitors, educational content consumers
- Anyone fascinated by ocean depth and marine life

## Core Requirements
- 10 depth sections from 0m to 10,984m
- Gradual background gradient (bright blue to black)
- 30+ SVG marine creature illustrations with hover facts
- Live depth counter + "YOU ARE HERE" gauge
- Floating particle effects increasing with depth
- Ambient audio with mute/unmute toggle
- Cinematic ending with restart option
- Mobile responsive

## What's Been Implemented (Feb 2026)
- [x] Title section with sunlight rays, wave animation, seagull
- [x] 10 depth sections (0m, 10m, 50m, 200m, 1000m, 2500m, 4000m, 6000m, 8848m, 10984m)
- [x] 30+ SVG marine creatures with hover tooltips
- [x] Depth markers with dotted lines
- [x] Background gradient transitions (blue to teal to dark to black)
- [x] Canvas particle system (density increases with depth)
- [x] Fixed depth gauge with "YOU ARE HERE" indicator
- [x] Web Audio API ambient drone (muted by default)
- [x] Stats, comparisons, and notes at each section
- [x] Cinematic ending with 3 reveal texts
- [x] "Explore Another Wonder" button (loops to surface)
- [x] Bioluminescent glow effects (jellyfish, anglerfish, lanternfish)
- [x] Framer Motion scroll animations
- [x] Increased font sizes for desktop readability
- [x] 11 new creatures: sea turtle, blue whale, manta ray, hammerhead shark, swordfish, octopus, lanternfish, vampire squid, fangtooth, tripod fish, dumbo octopus

## Testing Status
- Iteration 1: 19/19 passed (initial build)
- Iteration 2: 38/38 passed (font size + content enhancement regression)

## Prioritized Backlog
### P1 - Next Up
- Mobile optimization (test + fix responsiveness, touch interactions)
- "Explore Another Wonder" button — add meaningful functionality
- Scroll-snap refinement for guided descent feel

### P2 - Nice to Have
- Refactor creatures.js into individual modules
- Social sharing (share depth screenshot)
- Sound effects on creature hover
- Visitor analytics (track average scroll depth)
- Smooth scroll speed control (slower descent option)
