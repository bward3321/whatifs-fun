import { useMemo } from 'react';
import '@/App.css';
import { useGameEngine } from '@/hooks/useGameEngine';
import { useSound } from '@/hooks/useSound';
import LandingScreen from '@/components/screens/LandingScreen';
import GameScreen from '@/components/screens/GameScreen';
import GameOverScreen from '@/components/screens/GameOverScreen';

const Particles = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 25 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 15,
        duration: 10 + Math.random() * 15,
        size: 1 + Math.random() * 2.5,
        opacity: 0.15 + Math.random() * 0.25,
      })),
    []
  );

  return (
    <div className="particles-layer" data-testid="particles">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

function App() {
  const sounds = useSound();
  const game = useGameEngine(sounds);

  return (
    <div className="app-container" data-testid="app-container">
      <div className="game-bg" />
      <Particles />

      {game.gameState === 'menu' && (
        <LandingScreen onSelectMode={game.startGame} />
      )}
      {(game.gameState === 'playing' || game.gameState === 'paused' || game.gameState === 'countdown') && (
        <GameScreen game={game} sounds={sounds} />
      )}
      {game.gameState === 'gameOver' && (
        <GameOverScreen
          game={game}
          onPlayAgain={game.startGame}
          onGoHome={game.resetGame}
        />
      )}
    </div>
  );
}

export default App;
