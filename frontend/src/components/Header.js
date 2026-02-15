import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Zap } from "lucide-react";

export default function Header({ score, highScore, hardMode, onToggleHardMode, isPlaying }) {
  const location = useLocation();
  const isGamePage = location.pathname.startsWith("/higher-or-lower/");

  return (
    <header className="header-bar" data-testid="game-header">
      <div className="header-inner">
        <div className="header-left">
          {isGamePage ? (
            <Link to="/" className="back-link" data-testid="back-to-home">
              <ArrowLeft size={20} />
              <span className="back-text">Categories</span>
            </Link>
          ) : (
            <div className="logo-area" data-testid="logo">
              <Zap size={22} className="logo-icon" />
              <span className="logo-text">HIGHER OR LOWER</span>
            </div>
          )}
        </div>

        <div className="header-right">
          {isPlaying && (
            <>
              <div className="score-pill" data-testid="current-score">
                <span className="score-label">SCORE</span>
                <span className="score-value">{score}</span>
              </div>
              <div className="best-pill" data-testid="high-score">
                <span className="score-label">BEST</span>
                <span className="score-value">{highScore}</span>
              </div>
            </>
          )}
          {isGamePage && (
            <button
              className={`hard-mode-btn ${hardMode ? "active" : ""}`}
              onClick={onToggleHardMode}
              data-testid="hard-mode-toggle"
              title={hardMode ? "Hard Mode ON" : "Hard Mode OFF"}
            >
              <Zap size={14} />
              <span>HARD</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
