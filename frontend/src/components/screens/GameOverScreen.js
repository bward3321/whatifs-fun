import { useState } from 'react';
import { RotateCcw, Share2, Home, Zap } from 'lucide-react';

const TIER_MESSAGES = [
  { min: 0, max: 15, label: 'Beginner', msg: 'Average player lasts 27 seconds.' },
  { min: 15, max: 30, label: 'Intermediate', msg: 'Getting warmer! Top players hit 60+.' },
  { min: 30, max: 60, label: 'Advanced', msg: 'Impressive reflexes!' },
  { min: 60, max: Infinity, label: 'Elite', msg: "Elite tier! You're in the top 1%." },
];

const MODE_LABELS = {
  classic: 'Classic',
  rule_switch: 'Rule Switch',
  chaos: 'Chaos',
};

export default function GameOverScreen({ game, onPlayAgain, onGoHome }) {
  const { score, bestStreak, gameTime, speed, mode, getPersonalBest } = game;
  const personalBest = getPersonalBest();
  const isNewBest = score > 0 && score >= personalBest.score;
  const [shareText, setShareText] = useState('');

  const tier =
    TIER_MESSAGES.find((t) => gameTime >= t.min && gameTime < t.max) ||
    TIER_MESSAGES[0];

  const handleShare = () => {
    const text = `I survived ${gameTime}s and scored ${score} points in Too Fast To Click (${MODE_LABELS[mode]} mode). Think you can beat me?\n\nPlay now: ${window.location.origin}`;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setShareText('Copied!');
        setTimeout(() => setShareText(''), 2000);
      })
      .catch(() => {});
  };

  const nextMode =
    mode === 'classic'
      ? 'rule_switch'
      : mode === 'rule_switch'
        ? 'chaos'
        : 'classic';
  const nextModeLabel =
    mode === 'classic'
      ? 'Try Rule Switch'
      : mode === 'rule_switch'
        ? 'Try Chaos Mode'
        : 'Try Classic';

  return (
    <div className="gameover-screen" data-testid="gameover-screen">
      <div className="gameover-content">
        <h1 className="gameover-title" data-testid="gameover-title">
          GAME OVER
        </h1>

        {isNewBest && (
          <div className="new-best-badge" data-testid="new-best-badge">
            NEW PERSONAL BEST
          </div>
        )}

        <div className="gameover-score" data-testid="final-score">
          {score}
        </div>
        <p className="gameover-score-label">POINTS</p>

        <div className="gameover-stats">
          <div className="stat-item">
            <span className="stat-value" data-testid="survival-time">
              {gameTime}s
            </span>
            <span className="stat-label">Survived</span>
          </div>
          <div className="stat-item">
            <span className="stat-value" data-testid="best-streak">
              {bestStreak}
            </span>
            <span className="stat-label">Best Streak</span>
          </div>
          <div className="stat-item">
            <span className="stat-value" data-testid="max-speed">
              {speed.toFixed(1)}x
            </span>
            <span className="stat-label">Max Speed</span>
          </div>
        </div>

        <div className="tier-badge" data-testid="tier-badge">
          <Zap size={14} />
          <span>{tier.label}</span>
        </div>
        <p className="tier-msg">{tier.msg}</p>

        {personalBest.score > 0 && (
          <p className="personal-best-info" data-testid="personal-best">
            Personal Best: {personalBest.score} pts ({personalBest.survivalTime}s)
          </p>
        )}

        <div className="gameover-actions">
          <button
            className="action-btn primary"
            onClick={() => onPlayAgain(mode)}
            data-testid="play-again-btn"
            autoFocus
          >
            <RotateCcw size={18} /> PLAY AGAIN
          </button>

          <button
            className="action-btn secondary"
            onClick={() => onPlayAgain(nextMode)}
            data-testid="try-mode-btn"
          >
            {nextModeLabel}
          </button>

          <div className="gameover-bottom-actions">
            <button
              className="action-btn ghost"
              onClick={handleShare}
              data-testid="share-btn"
            >
              <Share2 size={16} /> {shareText || 'Share Score'}
            </button>

            <button
              className="action-btn ghost"
              onClick={onGoHome}
              data-testid="home-btn"
            >
              <Home size={16} /> Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
