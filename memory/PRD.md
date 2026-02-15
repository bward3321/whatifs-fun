# Higher or Lower - PRD

## Original Problem Statement
Build an interactive browser game called "Higher or Lower" — a fast, addictive, replayable guessing game where users compare real-world statistics and decide whether the second item is higher or lower than the first. 5 categories, mobile-optimized, SEO-friendly, no login required.

## Architecture
- **Frontend**: React (CRA + Craco) with Tailwind CSS, Framer Motion, Canvas Confetti, React CountUp
- **Backend**: FastAPI (minimal, game is frontend-driven with static JSON data)
- **Database**: MongoDB (available but unused for MVP — game uses localStorage)
- **Hosting**: Kubernetes on Emergent

## User Personas
- Casual gamers looking for quick entertainment
- Trivia/quiz enthusiasts
- Students learning geography/economics/pop culture
- Mobile-first users aged 13-45

## Core Requirements (Static)
- 5 launch categories: Population, Box Office, NBA Salary, Animal Weight, GDP
- Survival-based scoring (game ends on wrong guess)
- Classic Mode + Hard Mode toggle
- Local storage for best scores
- Share to clipboard, Twitter/X, WhatsApp
- SEO pages with FAQ schema per category
- Mobile + desktop optimized

## What's Been Implemented (Feb 15, 2026)
- Full game loop: Card A (visible) vs Card B (hidden) → guess → reveal → transition
- All 5 categories with 40-60 entities each
- Smart pairing logic (difficulty scales with score)
- Hard Mode toggle
- Animated number reveal (CountUp), confetti on correct, shake on wrong
- Game Over screen with: final score, best score, closest call, tier system
- Share buttons (Copy Link, Twitter/X, WhatsApp)
- SEO: dynamic page titles, meta descriptions, FAQ accordion with schema markup
- Responsive: vertical stack on mobile, side-by-side on desktop
- Bento grid landing page with category cards
- Score/Best score pills in header
- Instant replay under 3 seconds

## Prioritized Backlog
### P0 (Done)
- [x] Core game loop
- [x] 5 categories
- [x] Scoring & local storage
- [x] Share feature
- [x] Mobile optimization
- [x] SEO structure

### P1 (Next)
- [ ] Daily Challenge mode (same sequence for all users)
- [ ] Backend score persistence (MongoDB)
- [ ] Sound effects (correct/wrong/click)
- [ ] Keyboard shortcuts (Up=Higher, Down=Lower)
- [ ] Prefers-reduced-motion accessibility

### P2 (Future)
- [ ] Global leaderboard
- [ ] Multiplayer challenge links
- [ ] More categories (Celebrity Net Worth, Spotify Streams, etc.)
- [ ] Time Attack mode
- [ ] User-submitted datasets
- [ ] PWA support for offline play
