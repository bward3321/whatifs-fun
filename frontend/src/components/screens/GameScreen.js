import { Heart, Pause, Play, Volume2, VolumeX } from 'lucide-react';

export default function GameScreen({ game, sounds }) {
  const {
    score,
    lives,
    streak,
    gameTime,
    speed,
    rule,
    objects,
    ruleFlash,
    handleClick,
    pauseGame,
    resumeGame,
    gameState,
  } = game;

  const isPaused = gameState === 'paused';

  return (
    <div className="game-screen" data-testid="game-screen">
      {/* HUD */}
      <div className="hud" data-testid="game-hud">
        <div className="hud-left">
          <span className="hud-score" data-testid="score-display">
            {score}
          </span>
          <span className="hud-label">SCORE</span>
        </div>

        <div className="hud-center">
          <div className="hud-lives" data-testid="lives-display">
            {[0, 1, 2].map((i) => (
              <Heart
                key={i}
                size={22}
                className={`heart-icon ${i < lives ? 'heart-active' : 'heart-lost'}`}
                fill={i < lives ? '#f43f5e' : 'transparent'}
                data-testid={`heart-${i}`}
              />
            ))}
          </div>
        </div>

        <div className="hud-right">
          <div className="speed-indicator" data-testid="speed-indicator">
            <span className="speed-label">SPD</span>
            <div className="speed-bar">
              <div
                className="speed-fill"
                style={{
                  width: `${Math.min(100, (speed / 3.5) * 100)}%`,
                  backgroundColor:
                    speed < 1.5
                      ? '#22c55e'
                      : speed < 2
                        ? '#eab308'
                        : speed < 2.5
                          ? '#f97316'
                          : '#ef4444',
                }}
              />
            </div>
          </div>
          <span className="hud-time" data-testid="time-display">
            {gameTime}s
          </span>
        </div>
      </div>

      {/* Rule Display */}
      <div
        className={`rule-display ${ruleFlash ? 'rule-flash' : ''}`}
        data-testid="rule-display"
      >
        {rule?.text || 'GET READY'}
      </div>

      {/* Game Area */}
      <div className="game-area" data-testid="game-area">
        {objects.map((obj) => (
          <div
            key={obj.id}
            className={`game-object-wrapper${
              obj.clicked ? ` clicked-${obj.clickResult}` : ''
            }${obj.missed ? ' missed' : ''}`}
            style={{
              left: `${obj.x}%`,
              top: `${obj.y}%`,
              animationDelay: `${obj.animDelay}s`,
            }}
            data-testid={`game-object-${obj.id}`}
          >
            <div
              className={`game-object${obj.isGlowing ? ' glowing' : ''}${
                obj.isRed ? ' red-tint' : ''
              }`}
              style={{
                animationDuration: `${obj.bobSpeed}s`,
                animationDelay: `${obj.bobOffset}s`,
              }}
              onClick={() => !obj.clicked && !obj.missed && handleClick(obj.id)}
              data-testid="game-target"
            >
              <span className="object-emoji">{obj.emoji}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Controls */}
      <div className="game-controls" data-testid="game-controls">
        <button
          className="control-btn"
          onClick={() => (isPaused ? resumeGame() : pauseGame())}
          data-testid="pause-btn"
        >
          {isPaused ? <Play size={20} /> : <Pause size={20} />}
        </button>
        <button
          className="control-btn"
          onClick={sounds.toggleMute}
          data-testid="sound-toggle-btn"
        >
          {sounds.muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>

      {/* Pause Overlay */}
      {isPaused && (
        <div className="pause-overlay" data-testid="pause-overlay">
          <div className="pause-content">
            <h2>PAUSED</h2>
            <button
              className="resume-btn"
              onClick={resumeGame}
              data-testid="resume-btn"
            >
              <Play size={24} /> RESUME
            </button>
          </div>
        </div>
      )}

      {/* Streak indicator */}
      {streak >= 3 && (
        <div className="streak-indicator" data-testid="streak-display">
          {streak} STREAK
        </div>
      )}
    </div>
  );
}
