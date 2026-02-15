import React, { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { categories, datasets, formatValue, getDisplayNumber } from "../data/gameData";
import Header from "../components/Header";
import GameCard from "../components/GameCard";
import GameOverScreen from "../components/GameOverScreen";
import FAQSection from "../components/FAQSection";
import CountUp from "react-countup";
import { ArrowUp, ArrowDown } from "lucide-react";

// States: idle -> guessing -> revealing -> transitioning -> gameOver
const STATES = { IDLE: "idle", GUESSING: "guessing", REVEALING: "revealing", TRANSITIONING: "transitioning", GAME_OVER: "gameOver" };

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickNextEntity(pool, usedRecently, currentA, hardMode, score) {
  // Filter out recently used and current
  const recentNames = usedRecently.map(e => e.name);
  let candidates = pool.filter(e => e.name !== currentA.name && !recentNames.includes(e.name));
  if (candidates.length < 3) {
    candidates = pool.filter(e => e.name !== currentA.name);
  }

  // Smart difficulty: as score increases, prefer closer values
  if (hardMode || score > 8) {
    // Sort by closeness to currentA
    candidates.sort((a, b) => {
      const diffA = Math.abs(a.value - currentA.value) / Math.max(currentA.value, 1);
      const diffB = Math.abs(b.value - currentA.value) / Math.max(currentA.value, 1);
      return diffA - diffB;
    });
    // Pick from top 40% closest, but with some randomness
    const topCount = Math.max(3, Math.floor(candidates.length * 0.4));
    const closeCandidates = candidates.slice(0, topCount);
    return closeCandidates[Math.floor(Math.random() * closeCandidates.length)];
  }

  // Early rounds: more variety
  if (score < 4) {
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  // Medium difficulty: moderate closeness
  candidates.sort((a, b) => {
    const diffA = Math.abs(a.value - currentA.value) / Math.max(currentA.value, 1);
    const diffB = Math.abs(b.value - currentA.value) / Math.max(currentA.value, 1);
    return diffA - diffB;
  });
  const topCount = Math.max(3, Math.floor(candidates.length * 0.6));
  const pool2 = candidates.slice(0, topCount);
  return pool2[Math.floor(Math.random() * pool2.length)];
}

export default function GamePage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const category = categories.find((c) => c.slug === slug);
  const data = datasets[slug];

  const [gameState, setGameState] = useState(STATES.IDLE);
  const [cardA, setCardA] = useState(null);
  const [cardB, setCardB] = useState(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [hardMode, setHardMode] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [closestCall, setClosestCall] = useState(null);
  const [usedRecently, setUsedRecently] = useState([]);
  const [roundKey, setRoundKey] = useState(0);
  const inputLocked = useRef(false);

  // Load best score
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`hol-best-${slug}`);
      if (stored) setHighScore(parseInt(stored, 10));
    } catch {}
  }, [slug]);

  // Initialize game
  const initGame = useCallback(() => {
    if (!data || data.length < 2) return;
    const shuffled = shuffleArray(data);
    setCardA(shuffled[0]);
    setCardB(shuffled[1]);
    setScore(0);
    setIsCorrect(null);
    setClosestCall(null);
    setUsedRecently([]);
    setGameState(STATES.GUESSING);
    setRoundKey((k) => k + 1);
    inputLocked.current = false;
  }, [data]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Update page title
  useEffect(() => {
    if (category) {
      document.title = category.seoTitle;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", category.seoMeta);
    }
    return () => { document.title = "Higher or Lower"; };
  }, [category]);

  const fireConfetti = () => {
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };
    confetti({ ...defaults, particleCount: 80, origin: { x: 0.3, y: 0.6 } });
    confetti({ ...defaults, particleCount: 80, origin: { x: 0.7, y: 0.6 } });
    setTimeout(() => {
      confetti({ ...defaults, particleCount: 50, origin: { x: 0.5, y: 0.4 } });
    }, 200);
  };

  const handleGuess = (guess) => {
    if (inputLocked.current || gameState !== STATES.GUESSING) return;
    inputLocked.current = true;
    setGameState(STATES.REVEALING);

    const correct =
      guess === "higher"
        ? cardB.value >= cardA.value
        : cardB.value <= cardA.value;

    // Track closest call
    const diff = Math.abs(cardA.value - cardB.value);
    const pctDiff = Math.round((diff / Math.max(cardA.value, cardB.value, 1)) * 100);
    setClosestCall((prev) => (prev === null ? pctDiff : Math.min(prev, pctDiff)));

    setTimeout(() => {
      setIsCorrect(correct);
      if (correct) {
        fireConfetti();
        const newScore = score + 1;
        setScore(newScore);

        // Update high score
        if (newScore > highScore) {
          setHighScore(newScore);
          try {
            localStorage.setItem(`hol-best-${slug}`, newScore.toString());
          } catch {}
        }

        // Transition: B becomes A, new B appears
        setTimeout(() => {
          setGameState(STATES.TRANSITIONING);
          const newA = cardB;
          const newUsed = [...usedRecently, cardA].slice(-5);
          setUsedRecently(newUsed);
          const newB = pickNextEntity(data, newUsed, newA, hardMode, newScore);
          setCardA(newA);
          setCardB(newB);
          setIsCorrect(null);
          setRoundKey((k) => k + 1);

          setTimeout(() => {
            setGameState(STATES.GUESSING);
            inputLocked.current = false;
          }, 400);
        }, 1200);
      } else {
        // Wrong — game over
        setTimeout(() => {
          setGameState(STATES.GAME_OVER);
          inputLocked.current = false;
        }, 1500);
      }
    }, 1500);
  };

  if (!category || !data) {
    return (
      <div className="game-not-found" data-testid="game-not-found">
        <h1>Category not found</h1>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  const displayB = getDisplayNumber(cardB?.value || 0, slug);

  return (
    <div className="game-page" data-testid="game-page">
      <Header
        score={score}
        highScore={highScore}
        hardMode={hardMode}
        onToggleHardMode={() => setHardMode((h) => !h)}
        isPlaying={gameState !== STATES.GAME_OVER}
      />

      <main className="game-arena" data-testid="game-arena">
        <div className="cards-container" key={roundKey}>
          {/* Card A — always shown */}
          <div className="card-panel card-panel--a">
            <GameCard
              entity={cardA}
              category={slug}
              isHidden={false}
              side="a"
              hardMode={hardMode}
            />
          </div>

          {/* VS Badge */}
          <div className="vs-badge" data-testid="vs-badge">
            <span>VS</span>
          </div>

          {/* Card B — hidden until reveal */}
          <div className="card-panel card-panel--b">
            <GameCard
              entity={cardB}
              category={slug}
              isHidden={gameState === STATES.GUESSING}
              isRevealing={gameState === STATES.REVEALING}
              isCorrect={isCorrect === true}
              isWrong={isCorrect === false}
              side="b"
              hardMode={hardMode}
            />

            {/* Action Buttons */}
            {gameState === STATES.GUESSING && (
              <motion.div
                className="action-buttons"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                data-testid="action-buttons"
              >
                <button
                  className="guess-btn guess-btn--higher"
                  onClick={() => handleGuess("higher")}
                  data-testid="higher-btn"
                >
                  <ArrowUp size={22} strokeWidth={3} />
                  <span>Higher</span>
                </button>
                <button
                  className="guess-btn guess-btn--lower"
                  onClick={() => handleGuess("lower")}
                  data-testid="lower-btn"
                >
                  <ArrowDown size={22} strokeWidth={3} />
                  <span>Lower</span>
                </button>
              </motion.div>
            )}

            {/* Reveal feedback */}
            {gameState === STATES.REVEALING && isCorrect !== null && (
              <motion.div
                className={`reveal-feedback ${isCorrect ? "reveal-feedback--correct" : "reveal-feedback--wrong"}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                data-testid="reveal-feedback"
              >
                <span>{isCorrect ? "CORRECT!" : "WRONG!"}</span>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* Game Over */}
      <AnimatePresence>
        {gameState === STATES.GAME_OVER && (
          <GameOverScreen
            score={score}
            highScore={highScore}
            closestCall={closestCall}
            categoryName={category.name}
            categorySlug={slug}
            onReplay={initGame}
            onChangeCategory={() => navigate("/")}
          />
        )}
      </AnimatePresence>

      {/* SEO Content */}
      {gameState === STATES.GAME_OVER && (
        <FAQSection faqs={category.faqs} intro={category.intro} />
      )}
    </div>
  );
}
