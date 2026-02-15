import React from "react";
import { motion } from "framer-motion";
import { RotateCcw, Grid3X3, Trophy, Flame, Target } from "lucide-react";
import ShareButtons from "./ShareButtons";

export default function GameOverScreen({
  score,
  highScore,
  closestCall,
  categoryName,
  categorySlug,
  onReplay,
  onChangeCategory,
}) {
  const getTier = (s) => {
    if (s >= 20) return { label: "LEGENDARY", color: "#F59E0B" };
    if (s >= 15) return { label: "ELITE", color: "#10B981" };
    if (s >= 10) return { label: "GREAT", color: "#3B82F6" };
    if (s >= 5) return { label: "GOOD", color: "#8B5CF6" };
    return { label: "ROOKIE", color: "#6B7280" };
  };

  const tier = getTier(score);

  return (
    <motion.div
      className="game-over-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-testid="game-over-screen"
    >
      <motion.div
        className="game-over-card"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="game-over-header">
          <span className="game-over-title">GAME OVER</span>
          <motion.span
            className="game-over-tier"
            style={{ color: tier.color }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            data-testid="tier-label"
          >
            {tier.label}
          </motion.span>
        </div>

        <div className="game-over-stats">
          <div className="stat-item stat-item--main" data-testid="final-score">
            <Trophy size={24} />
            <span className="stat-item-label">Final Score</span>
            <span className="stat-item-value">{score}</span>
          </div>
          <div className="stat-row">
            <div className="stat-item" data-testid="best-score">
              <Flame size={18} />
              <span className="stat-item-label">Best</span>
              <span className="stat-item-value">{highScore}</span>
            </div>
            {closestCall !== null && (
              <div className="stat-item" data-testid="closest-call">
                <Target size={18} />
                <span className="stat-item-label">Closest</span>
                <span className="stat-item-value">{closestCall}%</span>
              </div>
            )}
          </div>
        </div>

        <div className="game-over-tiers-info">
          <span className="tier-info-title">Score Tiers</span>
          <div className="tier-list">
            <span className="tier-item" style={{ color: "#6B7280" }}>0-4 Rookie</span>
            <span className="tier-item" style={{ color: "#8B5CF6" }}>5-9 Good</span>
            <span className="tier-item" style={{ color: "#3B82F6" }}>10-14 Great</span>
            <span className="tier-item" style={{ color: "#10B981" }}>15-19 Elite</span>
            <span className="tier-item" style={{ color: "#F59E0B" }}>20+ Legendary</span>
          </div>
        </div>

        <ShareButtons score={score} categoryName={categoryName} categorySlug={categorySlug} />

        <div className="game-over-actions">
          <button
            className="action-btn action-btn--replay"
            onClick={onReplay}
            data-testid="replay-btn"
          >
            <RotateCcw size={20} />
            <span>Play Again</span>
          </button>
          <button
            className="action-btn action-btn--categories"
            onClick={onChangeCategory}
            data-testid="change-category-btn"
          >
            <Grid3X3 size={20} />
            <span>Categories</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
