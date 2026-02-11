import { useState, useRef, useEffect, useCallback } from 'react';
import { Twitter, Copy } from 'lucide-react';
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

// Calculate circularity score - measures how perfectly circular the drawn shape is
const calculateCircleScore = (points) => {
  if (points.length < 20) return 0;
  
  // Find centroid of the drawn shape
  let sumX = 0, sumY = 0;
  points.forEach(p => {
    sumX += p.x;
    sumY += p.y;
  });
  const centerX = sumX / points.length;
  const centerY = sumY / points.length;
  
  // Calculate distances from centroid to each point
  const distances = points.map(p => 
    Math.sqrt(Math.pow(p.x - centerX, 2) + Math.pow(p.y - centerY, 2))
  );
  
  // Average radius (what a perfect circle would have)
  const avgRadius = distances.reduce((a, b) => a + b, 0) / distances.length;
  
  if (avgRadius < 30) return 0; // Too small to evaluate
  
  // 1. RADIUS CONSISTENCY: How consistent is the distance from center?
  // Perfect circle = all points equidistant from center
  const maxDeviation = Math.max(...distances.map(d => Math.abs(d - avgRadius)));
  const avgDeviation = distances.reduce((sum, d) => sum + Math.abs(d - avgRadius), 0) / distances.length;
  const radiusConsistency = Math.max(0, 1 - (avgDeviation / avgRadius) * 3);
  
  // 2. SMOOTHNESS: Check for jagged edges by measuring angle changes
  let smoothnessScore = 1;
  if (points.length > 10) {
    let totalAngleChange = 0;
    for (let i = 2; i < points.length; i++) {
      const v1 = { x: points[i-1].x - points[i-2].x, y: points[i-1].y - points[i-2].y };
      const v2 = { x: points[i].x - points[i-1].x, y: points[i].y - points[i-1].y };
      
      const dot = v1.x * v2.x + v1.y * v2.y;
      const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
      const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
      
      if (mag1 > 0.1 && mag2 > 0.1) {
        const cosAngle = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
        const angle = Math.acos(cosAngle);
        totalAngleChange += angle;
      }
    }
    // A perfect circle has smooth, consistent angle changes
    const expectedAngleChange = 2 * Math.PI; // 360 degrees total
    const angleDeviation = Math.abs(totalAngleChange - expectedAngleChange) / expectedAngleChange;
    smoothnessScore = Math.max(0, 1 - angleDeviation * 0.5);
  }
  
  // 3. CLOSURE: Does the circle close properly?
  const startPoint = points[0];
  const endPoint = points[points.length - 1];
  const closureDistance = Math.sqrt(
    Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2)
  );
  const closureScore = Math.max(0, 1 - (closureDistance / avgRadius) * 2);
  
  // 4. ROUNDNESS: Check if shape is elongated (ellipse vs circle)
  // Sample points at different angles and compare distances
  let minRadius = Infinity, maxRadius = 0;
  distances.forEach(d => {
    if (d < minRadius) minRadius = d;
    if (d > maxRadius) maxRadius = d;
  });
  const aspectRatio = minRadius / maxRadius;
  const roundnessScore = aspectRatio; // 1 = perfect circle, lower = more elliptical
  
  // Combine all factors with weights
  const finalScore = (
    radiusConsistency * 0.45 +  // Most important - are all points same distance from center?
    roundnessScore * 0.30 +     // Is it round, not elliptical?
    smoothnessScore * 0.15 +    // Is it smooth, not jagged?
    closureScore * 0.10         // Does it close properly?
  ) * 100;
  
  return Math.max(0, Math.min(99.9, finalScore));
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
      const container = canvas.parentElement;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Redraw if we have points
      if (points.length > 0) {
        drawCanvas();
      }
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [gameState]);
  
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
      <div className="relative z-10 flex flex-col items-center justify-center gap-4">
        {/* Current score (during drawing or result) */}
        {(gameState === 'drawing' || gameState === 'result' || gameState === 'failed') && (
          <div className="text-center">
            <div 
              data-testid="current-score"
              className={`font-pixel text-5xl md:text-7xl animate-score-pop ${getScoreClass(currentScore)}`}
            >
              {currentScore.toFixed(1)}%
            </div>
            {/* Best score shown below current score */}
            {(gameState === 'result' || gameState === 'failed') && (
              <div className="mt-4 font-body text-sm text-zinc-500 tracking-wider">
                BEST: <span className="font-pixel text-lg text-[#00FFFF] glow-cyan">{bestScore.toFixed(1)}%</span>
              </div>
            )}
          </div>
        )}
        
        {/* Canvas container - full screen drawing area */}
        <div className="relative w-[90vw] h-[60vh] max-w-[800px] max-h-[600px]">
          {/* Center reference dot */}
          <div 
            data-testid="center-dot"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full z-0"
            style={{ boxShadow: '0 0 20px rgba(255, 255, 255, 0.6)' }}
          />
          
          <canvas
            ref={canvasRef}
            data-testid="game-canvas"
            className="game-canvas bg-transparent absolute inset-0 w-full h-full z-10"
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
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 animate-fade-in z-20">
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
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-pulse-glow z-20">
              <p className="font-body text-lg text-zinc-400 text-center">
                Start drawing your circle!
              </p>
            </div>
          )}
          
          {/* Failed message - above canvas */}
          {gameState === 'failed' && (
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center">
              <div className="font-pixel text-xl md:text-2xl text-[#FF3B30] glow-red animate-shake">
                FAILED!
              </div>
              <p className="font-body text-sm text-zinc-400 mt-2">
                Complete the circle without releasing!
              </p>
            </div>
          )}
          
          {/* Result screen - just show new best indicator above canvas if achieved */}
          {gameState === 'result' && isNewBest && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
              <div 
                data-testid="new-best-indicator"
                className="font-body text-lg text-[#39FF14] tracking-wider uppercase animate-pulse-glow whitespace-nowrap"
              >
                New Best Score!
              </div>
            </div>
          )}
        </div>
        
        {/* Draw again hint - OUTSIDE canvas, below it */}
        {(gameState === 'result' || gameState === 'failed') && (
          <p className="font-body text-sm text-zinc-500 text-center mt-2 animate-pulse-glow">
            Draw again to play
          </p>
        )}
        
        {/* Share buttons - only on result */}
        {gameState === 'result' && (
          <div className="flex gap-4 animate-slide-up mt-4">
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
        )}
      </div>
      
    </div>
  );
};
