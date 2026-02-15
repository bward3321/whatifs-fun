import React from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import { getDisplayNumber, formatValue } from "../data/gameData";

export default function GameCard({
  entity,
  category,
  isHidden,
  isRevealing,
  isCorrect,
  isWrong,
  side,
  hardMode,
}) {
  if (!entity) return null;

  const displayNum = getDisplayNumber(entity.value, category);
  const formattedVal = formatValue(entity.value, category);

  const cardVariants = {
    initial: side === "b" ? { x: "100%", opacity: 0 } : { x: 0, opacity: 1 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  };

  return (
    <motion.div
      className={`game-card game-card--${side} ${isCorrect ? "game-card--correct" : ""} ${isWrong ? "game-card--wrong" : ""}`}
      variants={cardVariants}
      initial={side === "b" ? "initial" : false}
      animate="animate"
      exit="exit"
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      data-testid={`game-card-${side}`}
    >
      <div className="card-content">
        <span className="card-entity-name" data-testid={`entity-name-${side}`}>
          {entity.name}
        </span>

        <div className="card-stat-area">
          {isHidden && !isRevealing ? (
            <div className="card-hidden-value" data-testid="hidden-value">
              <span className="question-marks">???</span>
              {hardMode && (
                <span className="hard-mode-hint" data-testid="hard-mode-hint">
                  (Hard Mode)
                </span>
              )}
            </div>
          ) : isRevealing ? (
            <div className="card-reveal-value" data-testid="revealing-value">
              <span className="stat-prefix">{displayNum.prefix || ""}</span>
              <CountUp
                start={0}
                end={displayNum.end}
                duration={1.5}
                decimals={displayNum.decimals}
                separator=","
                className="stat-number"
              />
              <span className="stat-suffix">{displayNum.suffix || ""}</span>
            </div>
          ) : (
            <div className="card-value" data-testid={`value-${side}`}>
              <span className="stat-display">{formattedVal}</span>
            </div>
          )}
        </div>

        <span className="card-category-label" data-testid={`category-label-${side}`}>
          {category === "population" && "Population"}
          {category === "box-office" && "Worldwide Box Office"}
          {category === "nba-salary" && "Annual Salary"}
          {category === "animals" && "Average Weight"}
          {category === "gdp" && "GDP (Nominal)"}
        </span>
      </div>
    </motion.div>
  );
}
