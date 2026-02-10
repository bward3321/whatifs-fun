import { useState, useRef, useEffect, useCallback } from 'react';
import { Twitter, Copy, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

// Sound manager using Web Audio API
const createSoundManager = () => {
  let audioContext = null;
  
  const getContext = () => {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
  };
  
  const playTone = (frequency, duration, type = 'sine', volume = 0.1) => {
    try {
      const ctx = getContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      console.log('Audio not available');
    }
  };
  
  return {
    tick: () => playTone(800, 0.05, 'square', 0.03),
    complete: () => {
      playTone(523.25, 0.15, 'sine', 0.1);
      setTimeout(() => playTone(659.25, 0.15, 'sine', 0.1), 100);
      setTimeout(() => playTone(783.99, 0.2, 'sine', 0.1), 200);
    },
    newBest: () => {
      playTone(523.25, 0.1, 'sine', 0.1);
      setTimeout(() => playTone(659.25, 0.1, 'sine', 0.1), 80);
      setTimeout(() => playTone(783.99, 0.1, 'sine', 0.1), 160);
      setTimeout(() => playTone(1046.50, 0.3, 'sine', 0.15), 240);
    },
    fail: () => playTone(150, 0.3, 'sawtooth', 0.1),
    start: () => playTone(440, 0.1, 'sine', 0.08)
  };
};

const soundManager = createSoundManager();

// Calculate circularity score
const calculateCircleScore = (points) => {
  if (points.length < 20) return 0;
  
  // Find centroid
  let sumX = 0, sumY = 0;
  points.forEach(p => {
    sumX += p.x;
    sumY += p.y;
  });
  const centerX = sumX / points.length;
  const centerY = sumY / points.length;
  
  // Calculate distances from center
  const distances = points.map(p => 
    Math.sqrt(Math.pow(p.x - centerX, 2) + Math.pow(p.y - centerY, 2))
  );
  
  // Average radius
  const avgRadius = distances.reduce((a, b) => a + b, 0) / distances.length;
  
  if (avgRadius < 30) return 0; // Too small
  
  // Calculate standard deviation of distances
  const variance = distances.reduce((sum, d) => sum + Math.pow(d - avgRadius, 2), 0) / distances.length;
  const stdDev = Math.sqrt(variance);
  
  // Coefficient of variation (normalized)
  const cv = stdDev / avgRadius;
  
  // Check if the shape is closed (start and end points are near)
  const startPoint = points[0];
  const endPoint = points[points.length - 1];
  const closureDistance = Math.sqrt(
    Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2)
  );
  const closurePenalty = Math.min(closureDistance / avgRadius, 0.5);
  
  // Convert to percentage (lower cv = better circle)
  // Map cv from 0-0.3 to 100%-50%
  let score = Math.max(0, Math.min(100, (1 - cv * 2) * 100));
  
  // Apply closure penalty
  score = score * (1 - closurePenalty * 0.3);
  
  // Bonus for good closure
  if (closureDistance < avgRadius * 0.15) {
    score = Math.min(100, score * 1.05);
  }
  
  return Math.max(0, Math.min(99.9, score));
};

// Get color based on score
const getScoreColor = (score) => {
  if (score >= 90) return '#39FF14'; // Green
  if (score >= 75) return '#FFFF00'; // Yellow
  if (score >= 60) return '#FF8C00'; // Orange
  return '#FF3B30'; // Red
};

const getScoreClass = (score) => {
  if (score >= 90) return 'score-excellent glow-green';
  if (score >= 75) return 'score-good';
  if (score >= 60) return 'score-okay';
  return 'score-poor glow-red';
};

export const CircleGame = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('start'); // start, drawing, result, failed
  const [points, setPoints] = useState([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem('perfectCircleBestScore');
    return saved ? parseFloat(saved) : 0;
  });
  const [isNewBest, setIsNewBest] = useState(false);
  const [copied, setCopied] = useState(false);
  const isDrawingRef = useRef(false);
  const lastTickRef = useRef(0);
  const animationFrameRef = useRef(null);
  
  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const updateCanvasSize = () => {
      const size = Math.min(window.innerWidth * 0.9, window.innerHeight * 0.7, 500);
      canvas.width = size;
      canvas.height = size;
      
      // Redraw if we have points
      if (points.length > 0) {
        drawCanvas();
      }
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);
  
  // Draw canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (points.length < 2) return;
    
    // Draw with gradient based on progress/score
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 8;
    
    // Create gradient stroke effect
    for (let i = 1; i < points.length; i++) {
      const progress = i / points.length;
      const color = getScoreColor(currentScore);
      
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 15;
      ctx.moveTo(points[i - 1].x, points[i - 1].y);
      ctx.lineTo(points[i].x, points[i].y);
      ctx.stroke();
    }
    
    // Draw start point indicator
    if (points.length > 0 && gameState === 'drawing') {
      ctx.beginPath();
      ctx.arc(points[0].x, points[0].y, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#FFFFFF';
      ctx.shadowBlur = 20;
      ctx.fill();
    }
  }, [points, currentScore, gameState]);
  
  useEffect(() => {
    drawCanvas();
  }, [points, drawCanvas]);
  
  // Get position from event
  const getPosition = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if (e.touches) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };
  
  // Start drawing
  const handleStart = (e) => {
    // Allow starting from result or failed states too
    if (gameState === 'result' || gameState === 'failed') {
      startGame();
      // Small delay to ensure state is updated
      setTimeout(() => {
        const pos = getPosition(e);
        if (pos) {
          isDrawingRef.current = true;
          setPoints([pos]);
          setCurrentScore(0);
          soundManager.tick();
        }
      }, 10);
      return;
    }
    
    if (gameState !== 'drawing') return;
    e.preventDefault();
    
    const pos = getPosition(e);
    if (!pos) return;
    
    isDrawingRef.current = true;
    setPoints([pos]);
    setCurrentScore(0);
    soundManager.tick();
  };
  
  // Continue drawing
  const handleMove = (e) => {
    if (!isDrawingRef.current || gameState !== 'drawing') return;
    e.preventDefault();
    
    const pos = getPosition(e);
    if (!pos) return;
    
    setPoints(prev => {
      const newPoints = [...prev, pos];
      
      // Calculate score in real-time
      if (newPoints.length > 10) {
        const score = calculateCircleScore(newPoints);
        setCurrentScore(score);
        
        // Play tick sound occasionally
        const now = Date.now();
        if (now - lastTickRef.current > 100) {
          soundManager.tick();
          lastTickRef.current = now;
        }
      }
      
      return newPoints;
    });
  };
  
  // End drawing
  const handleEnd = (e) => {
    if (!isDrawingRef.current || gameState !== 'drawing') return;
    e.preventDefault();
    
    isDrawingRef.current = false;
    
    if (points.length < 30) {
      // Not enough points - failed
      soundManager.fail();
      setGameState('failed');
      return;
    }
    
    // Check if circle is closed enough
    const startPoint = points[0];
    const endPoint = points[points.length - 1];
    const distance = Math.sqrt(
      Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2)
    );
    
    // Calculate final score
    const finalScore = calculateCircleScore(points);
    setCurrentScore(finalScore);
    
    // Require the circle to be somewhat closed
    const avgRadius = points.reduce((sum, p) => {
      const centerX = points.reduce((s, pt) => s + pt.x, 0) / points.length;
      const centerY = points.reduce((s, pt) => s + pt.y, 0) / points.length;
      return sum + Math.sqrt(Math.pow(p.x - centerX, 2) + Math.pow(p.y - centerY, 2));
    }, 0) / points.length;
    
    if (distance > avgRadius * 0.5) {
      // Circle not closed enough
      soundManager.fail();
      setGameState('failed');
      return;
    }
    
    // Success!
    if (finalScore > bestScore) {
      setBestScore(finalScore);
      localStorage.setItem('perfectCircleBestScore', finalScore.toString());
      setIsNewBest(true);
      soundManager.newBest();
      
      // Celebration confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#39FF14', '#00FFFF', '#FF00FF', '#FFFF00']
      });
    } else {
      soundManager.complete();
      setIsNewBest(false);
    }
    
    setGameState('result');
  };
  
  // Handle mouse/touch leave
  const handleLeave = () => {
    if (isDrawingRef.current && gameState === 'drawing') {
      isDrawingRef.current = false;
      soundManager.fail();
      setGameState('failed');
    }
  };
  
  // Start game - now triggered by starting to draw
  const startGame = () => {
    soundManager.start();
    setPoints([]);
    setCurrentScore(0);
    setIsNewBest(false);
    setGameState('drawing');
    setCopied(false);
  };
  
  // Allow drawing to start a new game from result/failed states
  const handleStartFromAnyState = (e) => {
    if (gameState === 'result' || gameState === 'failed') {
      startGame();
    }
    handleStart(e);
  };
  
  // Reset to start
  const resetGame = () => {
    setPoints([]);
    setCurrentScore(0);
    setIsNewBest(false);
    setGameState('start');
    setCopied(false);
  };
  
  // Share functions
  const shareOnTwitter = () => {
    const text = `I drew a circle with ${currentScore.toFixed(1)}% accuracy! Can you beat me? 🎯`;
    const url = window.location.href;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank'
    );
  };
  
  const copyScore = async () => {
    const text = `I drew a circle with ${currentScore.toFixed(1)}% accuracy on Perfect Shape! Can you beat me? ${window.location.href}`;
    
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }
    } catch (e) {
      // Fallback for permission issues
    }
    
    // Fallback: Create temporary textarea
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '-9999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };
  
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-black noise-overlay">
      {/* Logo */}
      <div 
        data-testid="logo"
        className="absolute top-6 left-6 md:top-8 md:left-8 z-50 font-body font-bold text-lg md:text-xl tracking-widest text-white/80 select-none"
      >
        PERFECT SHAPE
      </div>
      
      {/* Score displays */}
      <div className="absolute top-6 right-6 md:top-8 md:right-8 z-50 text-right">
        <div className="font-body text-sm text-zinc-500 tracking-wider uppercase mb-1">Best Score</div>
        <div data-testid="best-score" className="font-pixel text-xl md:text-2xl text-white glow-cyan">
          {bestScore.toFixed(1)}%
        </div>
      </div>
      
      {/* Main game area */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-8">
        {/* Current score (during drawing or result) */}
        {(gameState === 'drawing' || gameState === 'result' || gameState === 'failed') && (
          <div 
            data-testid="current-score"
            className={`font-pixel text-5xl md:text-7xl animate-score-pop ${getScoreClass(currentScore)}`}
          >
            {currentScore.toFixed(1)}%
          </div>
        )}
        
        {/* Canvas container */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            data-testid="game-canvas"
            className="game-canvas bg-transparent"
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleLeave}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
          />
          
          {/* Start screen overlay */}
          {gameState === 'start' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 animate-fade-in">
              <div className="text-center">
                <h1 className="font-body text-2xl md:text-3xl font-bold tracking-wider text-white mb-2">
                  Can you draw a
                </h1>
                <h2 className="font-pixel text-xl md:text-2xl text-[#39FF14] glow-green animate-pulse-glow">
                  PERFECT CIRCLE?
                </h2>
              </div>
              
              <button
                data-testid="start-button"
                onClick={startGame}
                className="btn-glow bg-white text-black font-body font-bold text-xl uppercase tracking-wider rounded-full px-12 py-4 hover:bg-[#39FF14] focus:outline-none"
              >
                GO
              </button>
              
              <p className="font-body text-sm text-zinc-500 text-center max-w-xs">
                Hold and drag to draw. Release to complete.
              </p>
            </div>
          )}
          
          {/* Drawing instruction */}
          {gameState === 'drawing' && points.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-pulse-glow">
              <p className="font-body text-lg text-zinc-400 text-center">
                Start drawing your circle!
              </p>
            </div>
          )}
          
          {/* Failed screen */}
          {gameState === 'failed' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 animate-fade-in bg-black/80">
              <div className="font-pixel text-xl md:text-2xl text-[#FF3B30] glow-red animate-shake">
                FAILED!
              </div>
              <p className="font-body text-sm text-zinc-400 text-center max-w-xs">
                Complete the circle without releasing!
              </p>
              <button
                data-testid="try-again-button"
                onClick={startGame}
                className="btn-glow bg-zinc-800 text-white font-body font-bold uppercase tracking-wider rounded-full px-8 py-3 hover:bg-zinc-700 flex items-center gap-2"
              >
                <RotateCcw size={18} />
                Try Again
              </button>
            </div>
          )}
          
          {/* Result screen */}
          {gameState === 'result' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 animate-fade-in pointer-events-none">
              {isNewBest && (
                <div 
                  data-testid="new-best-indicator"
                  className="font-body text-lg text-[#39FF14] tracking-wider uppercase animate-pulse-glow"
                >
                  New Best Score!
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Result actions */}
        {gameState === 'result' && (
          <div className="flex flex-col items-center gap-6 animate-slide-up">
            <div className="flex gap-4">
              <button
                data-testid="tweet-button"
                onClick={shareOnTwitter}
                className="bg-[#1DA1F2] text-white font-body font-bold uppercase tracking-wider rounded-full px-6 py-3 flex items-center gap-2 hover:bg-[#1a91da] hover:shadow-[0_0_20px_rgba(29,161,242,0.5)] transition-shadow duration-300"
              >
                <Twitter size={18} />
                Tweet
              </button>
              
              <button
                data-testid="copy-button"
                onClick={copyScore}
                className="bg-zinc-800 text-white font-body font-bold uppercase tracking-wider rounded-full px-6 py-3 flex items-center gap-2 hover:bg-zinc-700 hover:text-[#FF00FF] border border-transparent hover:border-[#FF00FF] hover:shadow-[0_0_20px_rgba(255,0,255,0.4)] transition-all duration-300"
              >
                <Copy size={18} />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            
            <button
              data-testid="play-again-button"
              onClick={startGame}
              className="btn-glow bg-white text-black font-body font-bold uppercase tracking-wider rounded-full px-8 py-3 hover:bg-[#39FF14] flex items-center gap-2"
            >
              <RotateCcw size={18} />
              Play Again
            </button>
          </div>
        )}
      </div>
      
    </div>
  );
};
