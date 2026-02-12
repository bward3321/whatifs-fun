import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, RefreshCcw, Trophy, Play, AlertTriangle, Target, Clock } from "lucide-react";
import { Button } from "./components/ui/button";
import sounds from "./utils/sounds";
import "./App.css";

// Game states
const STATES = {
  IDLE: 'idle',
  WAITING: 'waiting',
  READY: 'ready',
  FINISHED: 'finished',
  EARLY_CLICK: 'early_click'
};

// Comparison data with images from design guidelines
const COMPARISONS = [
  { name: "Robot", speed: 1, emoji: "🤖", url: "https://images.unsplash.com/photo-1750096319146-6310519b5af2?w=100&h=100&fit=crop" },
  { name: "Housefly", speed: 20, emoji: "🪰", url: "https://images.unsplash.com/photo-1644987768994-d9f56eb93498?w=100&h=100&fit=crop" },
  { name: "Hummingbird", speed: 60, emoji: "🐦", url: "https://images.unsplash.com/photo-1695036178611-8e6c20d2573f?w=100&h=100&fit=crop" },
  { name: "Cat", speed: 70, emoji: "🐱", url: "https://images.unsplash.com/photo-1690335466266-ae8e5a470ada?w=100&h=100&fit=crop" },
  { name: "Cheetah", speed: 100, emoji: "🐆", url: "https://images.unsplash.com/photo-1559303970-6d3f3a61b1b4?w=100&h=100&fit=crop" },
  { name: "Fighter Pilot", speed: 150, emoji: "🛩️", url: "https://images.unsplash.com/photo-1632813934009-9f3f78896717?w=100&h=100&fit=crop" },
  { name: "Gamer", speed: 180, emoji: "🎮", url: "https://images.unsplash.com/photo-1758410473619-c204b1bcf13a?w=100&h=100&fit=crop" },
  { name: "F1 Driver", speed: 200, emoji: "🏎️", url: "https://images.unsplash.com/photo-1761751237853-7489598b7498?w=100&h=100&fit=crop" },
  { name: "Average Human", speed: 250, emoji: "🧑", url: "https://images.unsplash.com/photo-1758272134196-1ab895629bce?w=100&h=100&fit=crop" },
  { name: "Sloth", speed: 500, emoji: "🦥", url: "https://images.unsplash.com/photo-1693174758533-8470a48cf49c?w=100&h=100&fit=crop" }
];

// Fun quips based on reaction time
const getQuip = (time) => {
  if (time < 150) return "Are you even human?! Insane reflexes!";
  if (time < 180) return "Lightning fast! You'd make a great fighter pilot!";
  if (time < 200) return "Pro gamer material right here!";
  if (time < 230) return "Impressive! Faster than most!";
  if (time < 270) return "Right on the mark! Solid reflexes!";
  if (time < 350) return "Not bad! Keep practicing!";
  if (time < 450) return "A bit sleepy today? Try again!";
  return "Wake up! Time for some coffee? ☕";
};

// Calculate percentile based on reaction time
const getPercentile = (time) => {
  // Rough distribution based on typical human reaction times
  if (time < 150) return 99;
  if (time < 180) return 95;
  if (time < 200) return 85;
  if (time < 230) return 70;
  if (time < 260) return 50;
  if (time < 300) return 35;
  if (time < 350) return 20;
  if (time < 400) return 10;
  return 5;
};

// Floating decoration component
const FloatingIcon = ({ icon: Icon, className, delay = 0 }) => (
  <motion.div
    className={`floating-icon ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 0.15, y: 0 }}
    transition={{ delay, duration: 0.5 }}
  >
    <Icon size={80} className="animate-float" style={{ animationDelay: `${delay}s` }} />
  </motion.div>
);

// Comparison bar component
const ComparisonBar = ({ item, maxSpeed, isUser, delay }) => {
  const width = Math.min((item.speed / maxSpeed) * 100, 100);
  const barColor = isUser 
    ? 'bg-gradient-to-r from-cyan-500 to-purple-500' 
    : 'bg-slate-600';
  
  return (
    <motion.div
      className="flex items-center gap-3 mb-3"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay * 0.08, duration: 0.4 }}
    >
      <img 
        src={item.url} 
        alt={item.name}
        className={`comparison-avatar ${isUser ? 'user-marker' : ''}`}
        onError={(e) => { e.target.style.display = 'none'; }}
      />
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className={`text-sm font-medium ${isUser ? 'text-cyan-400' : 'text-slate-300'}`}>
            {item.emoji} {item.name} {isUser && <span className="text-purple-400">(You!)</span>}
          </span>
          <span className={`font-mono text-sm ${isUser ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}>
            {item.speed}ms
          </span>
        </div>
        <div className="comparison-bar bg-slate-800/50">
          <motion.div
            className={`comparison-bar-fill ${barColor}`}
            initial={{ width: 0 }}
            animate={{ width: `${width}%` }}
            transition={{ delay: delay * 0.08 + 0.2, duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// Results Modal Component
const ResultsModal = ({ reactionTime, onTryAgain }) => {
  const percentile = getPercentile(reactionTime);
  const quip = getQuip(reactionTime);
  
  // Create sorted list with user's time inserted
  const allResults = [...COMPARISONS, { name: "You", speed: reactionTime, emoji: "⚡", url: "", isUser: true }]
    .sort((a, b) => a.speed - b.speed);
  
  const maxSpeed = Math.max(...allResults.map(r => r.speed), 500);
  
  return (
    <motion.div 
      className="results-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="results-backdrop" />
      <motion.div 
        className="results-content"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.3 }}
      >
        <div className="p-6 md:p-8">
          {/* Header with time */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            >
              <div className="timer-display text-cyan-400 mb-2" data-testid="result-time">
                {reactionTime}<span className="text-4xl md:text-5xl">ms</span>
              </div>
            </motion.div>
            
            <motion.p 
              className="text-lg md:text-xl text-slate-300 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              data-testid="result-quip"
            >
              {quip}
            </motion.p>
            
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              data-testid="percentile-badge"
            >
              <Trophy className="w-5 h-5 text-purple-400" />
              <span className="text-purple-300 font-semibold">
                Faster than {percentile}% of people
              </span>
            </motion.div>
          </div>
          
          {/* Comparison chart */}
          <div className="mb-8">
            <h3 className="font-heading text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" />
              How you compare
            </h3>
            <div className="space-y-1" data-testid="comparison-chart">
              {allResults.map((item, index) => (
                <ComparisonBar 
                  key={item.name}
                  item={item}
                  maxSpeed={maxSpeed}
                  isUser={item.isUser}
                  delay={index}
                />
              ))}
            </div>
          </div>
          
          {/* Try again button */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button
              onClick={onTryAgain}
              className="start-button flex items-center gap-2"
              data-testid="try-again-btn"
            >
              <RefreshCcw className="w-5 h-5" />
              Try Again
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main App Component
function App() {
  const [gameState, setGameState] = useState(STATES.IDLE);
  const [reactionTime, setReactionTime] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const greenTimestamp = useRef(null);
  const timeoutRef = useRef(null);

  // Initialize audio on mount
  useEffect(() => {
    sounds.init();
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Handle keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const startGame = useCallback(() => {
    sounds.click();
    setGameState(STATES.WAITING);
    setReactionTime(null);
    setShowResults(false);
    
    // Random delay between 1-4 seconds
    const delay = Math.random() * 3000 + 1000;
    
    timeoutRef.current = setTimeout(() => {
      greenTimestamp.current = performance.now();
      setGameState(STATES.READY);
      sounds.go();
    }, delay);
  }, []);

  const handleClick = useCallback(() => {
    if (gameState === STATES.IDLE) {
      startGame();
    } else if (gameState === STATES.WAITING) {
      // Early click!
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      sounds.fail();
      setGameState(STATES.EARLY_CLICK);
      
      // Reset after a moment
      setTimeout(() => {
        setGameState(STATES.IDLE);
      }, 1500);
    } else if (gameState === STATES.READY) {
      // Calculate reaction time
      const clickTime = performance.now();
      const time = Math.round(clickTime - greenTimestamp.current);
      setReactionTime(time);
      setGameState(STATES.FINISHED);
      sounds.success();
      
      // Show results modal after a brief moment
      setTimeout(() => {
        setShowResults(true);
      }, 300);
    }
  }, [gameState, startGame]);

  const handleTryAgain = useCallback(() => {
    setShowResults(false);
    setGameState(STATES.IDLE);
    sounds.click();
  }, []);

  // Get state-specific styling
  const getStateClass = () => {
    switch (gameState) {
      case STATES.WAITING: return 'state-waiting';
      case STATES.READY: return 'state-ready';
      case STATES.EARLY_CLICK: return 'state-early animate-shake';
      default: return 'state-idle';
    }
  };

  return (
    <div className={`game-container ${getStateClass()}`} data-testid="game-container">
      {/* Main game area */}
      <div 
        className="click-area"
        onMouseDown={handleClick}
        onTouchStart={(e) => { e.preventDefault(); handleClick(); }}
        data-testid="click-area"
      >
        {/* IDLE State - Instructions */}
        {gameState === STATES.IDLE && (
          <motion.div
            className="text-center px-6 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Floating decorations */}
            <FloatingIcon icon={Zap} className="top-10 left-10 text-purple-500" delay={0.2} />
            <FloatingIcon icon={Target} className="top-20 right-16 text-cyan-500" delay={0.4} />
            <FloatingIcon icon={Clock} className="bottom-32 left-20 text-pink-500" delay={0.6} />
            
            <motion.h1 
              className="font-heading text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              data-testid="game-title"
            >
              REFLEX TEST
            </motion.h1>
            
            <motion.p 
              className="instruction-text text-slate-300 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Test your reaction time and see how you compare to the average human, a gamer, a fighter pilot… and a housefly.
            </motion.p>
            
            <motion.div 
              className="glass rounded-2xl p-6 max-w-md mx-auto mb-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-slate-300 text-left space-y-2">
                <span className="block">
                  <span className="text-emerald-400 font-semibold">1.</span> When the screen turns <span className="text-emerald-400 font-bold">green</span>, click as fast as you can!
                </span>
                <span className="block">
                  <span className="text-rose-400 font-semibold">2.</span> Don't click while it's <span className="text-rose-400 font-bold">red</span> — wait for green!
                </span>
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button 
                className="start-button flex items-center gap-3 mx-auto"
                onClick={(e) => { e.stopPropagation(); startGame(); }}
                data-testid="start-btn"
              >
                <Play className="w-6 h-6" />
                Start
              </button>
            </motion.div>
            
            <motion.p 
              className="text-slate-500 text-sm mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Or press <kbd className="px-2 py-1 bg-slate-800 rounded text-slate-300 font-mono text-xs">Space</kbd> to start
            </motion.p>
          </motion.div>
        )}

        {/* WAITING State - Red Screen */}
        {gameState === STATES.WAITING && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            data-testid="waiting-screen"
          >
            <motion.div
              className="animate-pulse-glow inline-block"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <h2 className="font-heading text-4xl md:text-6xl font-bold text-white mb-4 uppercase tracking-wider">
                Wait for green...
              </h2>
            </motion.div>
            <p className="text-white/80 text-lg">Don't click yet!</p>
          </motion.div>
        )}

        {/* READY State - Green Screen */}
        {gameState === STATES.READY && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.1 }}
            data-testid="ready-screen"
          >
            <h2 className="font-heading text-5xl md:text-7xl font-bold text-white mb-4 uppercase tracking-wider neon-text">
              CLICK NOW!
            </h2>
            <Zap className="w-20 h-20 mx-auto text-white animate-pulse" />
          </motion.div>
        )}

        {/* EARLY CLICK State */}
        {gameState === STATES.EARLY_CLICK && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            data-testid="early-click-screen"
          >
            <AlertTriangle className="w-24 h-24 mx-auto text-white mb-4" />
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4 uppercase">
              Too Soon!
            </h2>
            <p className="text-white/90 text-xl">Wait for the green screen!</p>
          </motion.div>
        )}

        {/* FINISHED State - Brief flash before results */}
        {gameState === STATES.FINISHED && !showResults && reactionTime && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            data-testid="finished-screen"
          >
            <div className="timer-display text-cyan-400">
              {reactionTime}<span className="text-4xl">ms</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Results Modal */}
      <AnimatePresence>
        {showResults && reactionTime && (
          <ResultsModal 
            reactionTime={reactionTime} 
            onTryAgain={handleTryAgain}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
