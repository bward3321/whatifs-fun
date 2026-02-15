# Too Fast To Click - PRD

## Problem Statement
Build a mobile-first, visually rich, fast-paced reflex game called "Too Fast To Click". Rapid reaction + attention control game where objects flash on screen and players must click ONLY correct targets based on rules. 3 lives per run, speed increases, 3 game modes.

## Architecture
- **Frontend**: React (CRA) + Tailwind CSS + Shadcn UI + Pure CSS animations + Web Audio API
- **Backend**: FastAPI + MongoDB (score persistence, leaderboard, global stats)
- **State Management**: Custom React hook (useGameEngine) with refs for mutable state

## User Personas
- Casual gamers (ages 13-35) seeking quick reflex challenges
- Mobile users looking for addictive mini-games
- No login required - frictionless play

## Core Requirements
- 3 game modes: Classic, Rule Switch, Chaos
- Wave-based object spawning with difficulty scaling
- Category-based rules (animals, food, objects) + special rules (glowing, red)
- Inverse logic rules for harder modes
- 3 lives, score tracking, streak counting
- Sound effects via Web Audio API
- Personal best via localStorage
- Score submission to backend
- FAQ section for SEO

## What's Been Implemented (Feb 2026)
- Full landing screen with mode selection cards
- Complete game engine with all 3 modes
- HUD (score, lives, speed indicator, timer)
- Wave spawning with non-overlapping positions
- Click detection with correct/wrong/missed feedback
- Difficulty scaling (speed, object count, wave duration, rule complexity)
- Game Over screen with stats, tier badges, personal best tracking
- Share Score (clipboard copy)
- Pause/Resume functionality
- Sound effects (correct pop, wrong buzzer, UI clicks)
- FAQ accordion section
- Backend score API (submit, leaderboard, global stats)
- SEO meta tags
- Mobile-optimized with touch targets, no scroll interference
- Floating particle effects, neon glow aesthetic

## Prioritized Backlog
- P0: All core features implemented ✅
- P1: Leaderboard display UI on landing page
- P1: Sound toggle persists in localStorage
- P2: Animated countdown before game start (3-2-1)
- P2: Screen shake effect on wrong clicks
- P2: Particle burst effect on correct clicks
- P3: Daily/weekly challenges
- P3: Achievement badges system

## Next Tasks
- Add leaderboard tab to landing page
- Add player name input for leaderboard
- Add more visual polish (screen shake, particle bursts)
- Add 3-2-1 countdown animation
- PWA support for mobile install

## Iteration 2 Updates (Feb 2026)
- Fixed GAME OVER title centering (text-align: center, width: 100%)
- Added 3-2-1 countdown animation before game starts (countdown-pop animation, neon glow)
- Added screen shake effect on wrong clicks (CSS shake + red vignette flash)
- Added colorful particle burst effects on correct clicks (8 particles, burst-fly animation)
- Added mobile responsive breakpoints (480px, 360px) with optimized object sizes
- Added safe-area-inset support for notched phones
- Added touch optimization (tap-highlight-color, touch-callout, user-select)
