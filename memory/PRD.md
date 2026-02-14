# Remember the Order - Memory Game PRD

## Original Problem Statement
Build a browser game called "Remember the Order" - a clean, addictive memory challenge where objects flash on screen in a sequence and the user must click them in the same order.

## Architecture
- **Frontend**: React + Tailwind CSS + Framer Motion + Web Audio API
- **Backend**: FastAPI (minimal - game is pure frontend)
- **Storage**: localStorage for personal best scores

## User Personas
- Casual gamers looking for quick brain challenges
- Memory improvement enthusiasts
- Mobile users (optimized for touch)

## Core Requirements
- 3 game modes: Classic, Speed, Random Layout
- Soft Neon Glass dark theme with glowing tiles
- Sound feedback via Web Audio API
- SEO FAQ section with schema markup
- Personal best tracking per mode
- Score reference labels (Average: 6, Elite: 10+, Genius: 14+)
- Difficulty scaling (speed, grid expansion)

## What's Been Implemented (Feb 2026)
- [x] Start screen with mode selector (Classic/Speed/Random)
- [x] Game screen with 2x2 neon glass tiles
- [x] Sequence playback animation with tile glow
- [x] User input handling with immediate feedback
- [x] Game over modal with score, stats, score reference
- [x] Speed mode with timer bar
- [x] Random layout mode with tile shuffling
- [x] Sound engine (Web Audio API tones per tile)
- [x] Personal best per mode (localStorage)
- [x] Progress dots showing sequence progress
- [x] FAQ section with accordion (4 questions)
- [x] SEO: meta tags, JSON-LD schema (Game + FAQ)
- [x] Mobile responsive (375px+)
- [x] Grid expansion (4→6→9→12 tiles)
- [x] Difficulty scaling (sequence speed increases)
- [x] Shake animation on failure
- [x] Confetti on new personal best

## Backlog
### P0 (Critical)
- None remaining

### P1 (Important)
- Daily challenge mode
- Leaderboard (requires backend)
- Themed packs (animals, emojis, numbers)

### P2 (Nice to Have)
- Multiplayer version
- Hard mode (shorter display time)
- Kids version (simpler visuals)
- Achievement system
- Share score to social media

## Next Tasks
1. Add share score functionality (social media)
2. Implement daily challenge with seed-based sequences
3. Add more visual polish (particle effects on correct sequences)
4. Accessibility improvements (screen reader support)

## Update - Share Score Feature (Feb 2026)
- [x] Share Score button on game over modal (icon next to Play Again)
- [x] Canvas-generated score card image with dark neon theme
- [x] Share panel with 4 options: Native Share, Post on X/Twitter, Save Image, Copy Link
- [x] Score card shows: game title, score, tier label, stats, CTA, decorative tiles
- [x] Web Share API (with image file) for mobile native sharing
- [x] Twitter intent URL for direct X posting
- [x] PNG download of score card
- [x] Clipboard copy with visual feedback ("Copied!")
- [x] Back to results navigation
- [x] Mobile responsive share panel
