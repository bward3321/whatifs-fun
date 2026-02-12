# Reflex Test Game - PRD

## Original Problem Statement
Need a web app which is a reaction time test type game for users (no login needed, just one page). The homepage should be simple:
"Test your reaction time and see how you compare to the average human, a gamer, a fighter pilot… and a housefly."

## User Personas
- Casual users wanting to test their reflexes
- Gamers comparing their reaction times
- Friends competing against each other

## Core Requirements (Static)
- Single page game with no authentication
- 4 game states: Idle, Waiting (Red), Ready (Green), Results
- Random delay 1-4 seconds before green screen
- Accurate millisecond reaction time measurement
- Percentile comparison
- Visual comparison chart with 10 entities
- Playful/fun theme with vibrant colors
- Sound effects on interactions
- Keyboard (Space) and touch support

## What's Been Implemented (Feb 2026)
- [x] Full game state machine (IDLE → WAITING → READY → FINISHED → EARLY_CLICK)
- [x] 10 comparison entities: Robot (1ms), Housefly (20ms), Hummingbird (60ms), Cat (70ms), Cheetah (100ms), Fighter Pilot (150ms), Gamer (180ms), F1 Driver (200ms), Average Human (250ms), Sloth (500ms)
- [x] Playful dark theme with Chakra Petch font, neon accents
- [x] AudioContext-based sound effects (zero latency)
- [x] Animated comparison chart with framer-motion
- [x] Percentile calculation and fun quips
- [x] Early click detection with shake animation
- [x] Mobile responsive with touch-action optimization
- [x] Keyboard spacebar support

## Prioritized Backlog
### P0 (Critical) - COMPLETED
- Game flow working end-to-end ✓

### P1 (High)
- Add social sharing (share score to Twitter/X)
- Track best score in localStorage

### P2 (Medium)
- Add multiple attempts average mode
- Add difficulty modes (shorter/longer delays)
- Leaderboard with anonymous scores

## Next Tasks
1. Add social share button to results modal
2. Track and display personal best score
3. Add "Best of 5" mode
