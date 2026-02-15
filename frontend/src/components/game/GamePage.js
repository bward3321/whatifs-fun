import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useMemoryGame } from '@/hooks/useMemoryGame';
import { useSoundEngine } from '@/hooks/useSoundEngine';
import { StartScreen } from './StartScreen';
import { GameScreen } from './GameScreen';
import { GameOverModal } from './GameOverModal';
import { FAQSection } from './FAQSection';

export default function GamePage() {
  const game = useMemoryGame();
  const sound = useSoundEngine();
  const [selectedMode, setSelectedMode] = useState('classic');
  const prevActiveTile = useRef(null);
  const prevFailed = useRef(null);
  const prevRound = useRef(0);

  // Sound on tile activation
  useEffect(() => {
    if (game.activeTile !== null && game.activeTile !== prevActiveTile.current) {
      sound.playTone(game.activeTile);
    }
    prevActiveTile.current = game.activeTile;
  }, [game.activeTile, sound]);

  // Sound on failure
  useEffect(() => {
    if (game.failedTile !== null && game.failedTile !== prevFailed.current) {
      sound.playFail();
    }
    prevFailed.current = game.failedTile;
  }, [game.failedTile, sound]);

  // Sound on round advance
  useEffect(() => {
    if (game.round > 1 && game.round > prevRound.current) {
      sound.playSuccess();
    }
    prevRound.current = game.round;
  }, [game.round, sound]);

  // Unlock audio on any user tap (needed for iOS/Android)
  const handleUserInteraction = useCallback(() => {
    sound.unlock();
  }, [sound]);

  const handleStart = useCallback((mode) => {
    sound.unlock();
    game.startGame(mode);
  }, [sound, game]);

  const handleRestart = useCallback(() => {
    sound.unlock();
    game.startGame(game.mode);
  }, [sound, game]);

  const handleTileClick = useCallback((index) => {
    sound.unlock();
    game.handleTileClick(index);
  }, [sound, game]);

  const bestForMode = game.bestScores?.[game.mode] || 0;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-body relative overflow-x-hidden" data-testid="game-page">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-[-30%] left-[-20%] w-[500px] h-[500px] rounded-full bg-cyan-500/[0.03] blur-[100px]" />
        <div className="absolute bottom-[-30%] right-[-20%] w-[400px] h-[400px] rounded-full bg-violet-500/[0.025] blur-[100px]" />
      </div>

      <main className="flex-1 flex items-center justify-center relative z-10 min-h-screen">
        <AnimatePresence mode="wait">
          {game.gameState === 'idle' ? (
            <StartScreen
              key="start"
              onStart={game.startGame}
              selectedMode={selectedMode}
              onModeChange={setSelectedMode}
              bestScores={game.bestScores}
            />
          ) : (
            <GameScreen
              key="game"
              round={game.round}
              tileCount={game.tileCount}
              tileOrder={game.tileOrder}
              activeTile={game.activeTile}
              failedTile={game.failedTile}
              correctTile={game.correctTile}
              gameState={game.gameState}
              onTileClick={game.handleTileClick}
              mode={game.mode}
              timeLeft={game.timeLeft}
              onRestart={handleRestart}
              soundEnabled={sound.soundEnabled}
              onToggleSound={() => sound.setSoundEnabled(p => !p)}
              seqLength={game.seqLength}
              inputCount={game.inputCount}
              shaking={game.shaking}
            />
          )}
        </AnimatePresence>

        {game.gameState === 'gameOver' && (
          <GameOverModal
            score={game.score}
            bestScore={bestForMode}
            stats={game.stats}
            mode={game.mode}
            onReplay={handleRestart}
            isNewBest={game.isNewBest}
          />
        )}
      </main>

      <FAQSection />

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Remember the Order - Memory Test Game",
            "description": "Test your memory by repeating tile sequences. Free online memory game.",
            "genre": "Puzzle",
            "gamePlatform": "Web Browser",
            "applicationCategory": "Game",
            "operatingSystem": "Any",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "What is average memory span?", "acceptedAnswer": { "@type": "Answer", "text": "The average human short-term memory span holds about 7 items, known as Miller's Law." } },
              { "@type": "Question", "name": "How many items can humans remember?", "acceptedAnswer": { "@type": "Answer", "text": "Short-term memory typically holds 4-7 chunks of information." } },
              { "@type": "Question", "name": "How to improve short-term memory?", "acceptedAnswer": { "@type": "Answer", "text": "Practice with sequence games, get adequate sleep, exercise, and use mnemonic strategies." } },
              { "@type": "Question", "name": "What is working memory?", "acceptedAnswer": { "@type": "Answer", "text": "Working memory is the cognitive system for holding and manipulating information temporarily." } },
            ],
          }),
        }}
      />
    </div>
  );
}
