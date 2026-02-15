# TRUE OR TOTALLY FAKE? - PRD

## Original Problem Statement
Build a mobile-first, highly addictive, endlessly expanding browser game called "True or Totally Fake?" - A fast, one-tap trivia survival game with infinite LLM-powered questions.

## User Personas
- **Casual Gamers**: Looking for quick 2-4 minute entertainment sessions
- **Trivia Lovers**: Enjoy testing knowledge across various categories
- **Mobile Users**: Need large tap zones and smooth mobile experience
- **Social Sharers**: Want to share scores and challenge friends

## Core Requirements (Static)
- 6 launch categories: Animals, Geography, History, Food, Space, Pop Culture
- 3 difficulty levels: Chill, Spicy, Savage
- 3 lives system
- Streak counter
- LLM-powered question generation (OpenAI GPT-5.2)
- Confetti on correct answers
- Shake animation on wrong answers
- Game over screen with stats
- Text-based sharing
- No login required

## What's Been Implemented (Feb 15, 2026)
✅ Complete game loop: Home → Gameplay → Game Over → Replay
✅ 6 colorful category tiles with distinct icons (Lucide React)
✅ Mix All Categories option
✅ 3 difficulty selectors (Chill, Spicy, Savage)
✅ OpenAI GPT-5.2 integration via Emergent LLM key
✅ Question generation with self-validation (confidence threshold 0.85)
✅ Question caching in MongoDB to prevent repeats
✅ 3 hearts life system with animations
✅ Streak counter with bounce animation
✅ Confetti burst on correct answers
✅ Shake animation on wrong answers
✅ Question card with category icon and explanation
✅ Game over screen with stats (accuracy, personal best, category breakdown)
✅ Share score functionality
✅ Personal bests stored in localStorage
✅ Recent questions tracking (last 200)
✅ Playful UI with Fredoka + Nunito fonts
✅ Light theme with warm orange background

## Architecture
- **Backend**: FastAPI with MongoDB (motor async driver)
- **Frontend**: React 19 with Framer Motion, Canvas Confetti
- **LLM**: OpenAI GPT-5.2 via emergentintegrations library
- **Database**: MongoDB for questions cache and game sessions

## API Endpoints
- `GET /api/categories` - List all categories
- `POST /api/questions/generate` - Generate new question
- `GET /api/questions/batch` - Get batch of questions
- `POST /api/sessions` - Save game session
- `GET /api/leaderboard` - Get top scores
- `GET /api/stats` - Get game statistics

## Prioritized Backlog

### P0 (Completed)
- ✅ Core game loop
- ✅ Question generation
- ✅ Scoring system

### P1 (Next Phase)
- SEO-friendly category pages (/true-or-totally-fake/animals, etc.)
- Pre-fetch next questions for faster transitions
- Sound effects toggle
- Progressive difficulty (harder questions as streak increases)

### P2 (Future)
- Global leaderboard
- Daily challenges
- Achievement badges
- Social login for persistent stats

## Next Action Items
1. Add SEO routes for each category
2. Implement question pre-fetching for smoother gameplay
3. Add optional sound effects
4. Implement progressive difficulty scaling
