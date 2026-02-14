import { useState, useRef, useEffect, useCallback } from 'react';

const INITIAL_SEQ_LENGTH = 3;

const getTileCount = (round) => {
  if (round <= 4) return 4;
  if (round <= 8) return 6;
  if (round <= 11) return 9;
  return 12;
};

const getPlaybackSpeed = (round) => {
  if (round <= 4) return 500;
  if (round <= 8) return 400;
  return 300;
};

const getTimerDuration = (round) => Math.max(3000, 8000 - (round - 1) * 300);

const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export function useMemoryGame() {
  const [gameState, setGameState] = useState('idle');
  const [round, setRound] = useState(0);
  const [tileCount, setTileCount] = useState(4);
  const [activeTile, setActiveTile] = useState(null);
  const [failedTile, setFailedTile] = useState(null);
  const [correctTile, setCorrectTile] = useState(null);
  const [score, setScore] = useState(0);
  const [bestScores, setBestScores] = useState(() => {
    try { return JSON.parse(localStorage.getItem('rto_best') || '{}'); }
    catch { return {}; }
  });
  const [totalClicks, setTotalClicks] = useState(0);
  const [correctClicks, setCorrectClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(100);
  const [tileOrder, setTileOrder] = useState([0, 1, 2, 3]);
  const [mode, setMode] = useState('classic');
  const [shaking, setShaking] = useState(false);
  const [seqLength, setSeqLength] = useState(0);
  const [inputCount, setInputCount] = useState(0);
  const [isNewBest, setIsNewBest] = useState(false);

  // Refs for async callbacks
  const seqRef = useRef([]);
  const inputRef = useRef([]);
  const roundRef = useRef(0);
  const tcRef = useRef(4);
  const modeRef = useRef('classic');
  const aliveRef = useRef(false);
  const timerRef = useRef(null);
  const stateRef = useRef('idle');
  const bestRef = useRef({});

  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { stateRef.current = gameState; }, [gameState]);
  useEffect(() => { bestRef.current = bestScores; }, [bestScores]);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const endGame = useCallback((finalRound) => {
    cleanup();
    aliveRef.current = false;
    const finalScore = Math.max(0, finalRound - 1);
    setScore(finalScore);
    setGameState('gameOver');
    stateRef.current = 'gameOver';
    setShaking(true);
    setTimeout(() => setShaking(false), 500);

    const m = modeRef.current;
    const prevBest = bestRef.current[m] || 0;
    setIsNewBest(finalScore > prevBest);

    setBestScores(prev => {
      const next = { ...prev };
      if (finalScore > (next[m] || 0)) {
        next[m] = finalScore;
        localStorage.setItem('rto_best', JSON.stringify(next));
      }
      return next;
    });
  }, [cleanup]);

  const playSequence = useCallback(async (seq, currentRound) => {
    setGameState('watching');
    stateRef.current = 'watching';
    inputRef.current = [];
    setInputCount(0);

    const speed = getPlaybackSpeed(currentRound);
    await new Promise(r => setTimeout(r, 500));

    for (let i = 0; i < seq.length; i++) {
      if (!aliveRef.current) return;
      setActiveTile(seq[i]);
      await new Promise(r => setTimeout(r, speed));
      if (!aliveRef.current) return;
      setActiveTile(null);
      await new Promise(r => setTimeout(r, 130));
    }

    if (!aliveRef.current) return;
    setGameState('playing');
    stateRef.current = 'playing';

    if (modeRef.current === 'speed') {
      const duration = getTimerDuration(currentRound);
      const start = performance.now();
      setTimeLeft(100);
      timerRef.current = setInterval(() => {
        const elapsed = performance.now() - start;
        const pct = Math.max(0, 100 * (1 - elapsed / duration));
        setTimeLeft(pct);
        if (pct <= 0) {
          endGame(roundRef.current);
        }
      }, 50);
    }
  }, [endGame]);

  const startGame = useCallback((selectedMode) => {
    cleanup();
    const m = selectedMode || 'classic';
    setMode(m);
    modeRef.current = m;

    const tc = 4;
    const seq = Array.from({ length: INITIAL_SEQ_LENGTH }, () =>
      Math.floor(Math.random() * tc)
    );

    seqRef.current = seq;
    inputRef.current = [];
    roundRef.current = 1;
    tcRef.current = tc;
    aliveRef.current = true;

    setRound(1);
    setTileCount(tc);
    setScore(0);
    setTotalClicks(0);
    setCorrectClicks(0);
    setFailedTile(null);
    setCorrectTile(null);
    setTimeLeft(100);
    setActiveTile(null);
    setShaking(false);
    setSeqLength(INITIAL_SEQ_LENGTH);
    setInputCount(0);
    setIsNewBest(false);

    const order = Array.from({ length: tc }, (_, i) => i);
    setTileOrder(m === 'random' ? shuffleArray(order) : order);

    playSequence(seq, 1);
  }, [cleanup, playSequence]);

  const handleTileClick = useCallback((logicalIndex) => {
    if (stateRef.current !== 'playing' || !aliveRef.current) return;

    setTotalClicks(prev => prev + 1);
    const step = inputRef.current.length;
    const expected = seqRef.current[step];

    if (logicalIndex === expected) {
      setCorrectClicks(prev => prev + 1);
      inputRef.current = [...inputRef.current, logicalIndex];
      setInputCount(inputRef.current.length);

      setActiveTile(logicalIndex);
      setTimeout(() => {
        if (aliveRef.current) setActiveTile(null);
      }, 200);

      if (inputRef.current.length === seqRef.current.length) {
        cleanup();

        const newRound = roundRef.current + 1;
        roundRef.current = newRound;
        setRound(newRound);

        const newTc = getTileCount(newRound);
        tcRef.current = newTc;
        setTileCount(newTc);

        const newTile = Math.floor(Math.random() * newTc);
        const newSeq = [...seqRef.current, newTile];
        seqRef.current = newSeq;
        setSeqLength(newSeq.length);

        const order = Array.from({ length: newTc }, (_, i) => i);
        setTileOrder(modeRef.current === 'random' ? shuffleArray(order) : order);
        setTimeLeft(100);

        setTimeout(() => {
          if (aliveRef.current) playSequence(newSeq, newRound);
        }, 800);
      }
    } else {
      stateRef.current = 'failing';
      setGameState('failing');
      setFailedTile(logicalIndex);
      setCorrectTile(expected);
      cleanup();

      setTimeout(() => {
        setFailedTile(null);
        setCorrectTile(null);
        endGame(roundRef.current);
      }, 1200);
    }
  }, [cleanup, playSequence, endGame]);

  useEffect(() => {
    return () => {
      cleanup();
      aliveRef.current = false;
    };
  }, [cleanup]);

  return {
    gameState, mode, round, tileCount, activeTile,
    failedTile, correctTile, score, bestScores,
    totalClicks, correctClicks, timeLeft, tileOrder, shaking,
    seqLength, inputCount, isNewBest,
    startGame, handleTileClick, setMode,
    stats: {
      roundsCompleted: score,
      accuracy: totalClicks > 0 ? Math.round((correctClicks / totalClicks) * 100) : 0,
      totalClicks,
    },
  };
}
