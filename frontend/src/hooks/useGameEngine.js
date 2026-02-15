import { useState, useRef, useCallback, useEffect } from 'react';

// ============ GAME DATA ============

const OBJECT_PACKS = {
  animals: [
    { emoji: '🐱', name: 'Cat' },
    { emoji: '🦈', name: 'Shark' },
    { emoji: '🐘', name: 'Elephant' },
    { emoji: '🦉', name: 'Owl' },
    { emoji: '🐯', name: 'Tiger' },
    { emoji: '🐕', name: 'Dog' },
    { emoji: '🦊', name: 'Fox' },
    { emoji: '🐧', name: 'Penguin' },
  ],
  food: [
    { emoji: '🍕', name: 'Pizza' },
    { emoji: '🍌', name: 'Banana' },
    { emoji: '🍔', name: 'Burger' },
    { emoji: '🍎', name: 'Apple' },
    { emoji: '🍣', name: 'Sushi' },
    { emoji: '🌮', name: 'Taco' },
    { emoji: '🍩', name: 'Donut' },
    { emoji: '🍇', name: 'Grapes' },
  ],
  objects: [
    { emoji: '📱', name: 'Phone' },
    { emoji: '🕐', name: 'Clock' },
    { emoji: '📷', name: 'Camera' },
    { emoji: '👟', name: 'Shoe' },
    { emoji: '🎸', name: 'Guitar' },
    { emoji: '🔑', name: 'Key' },
    { emoji: '🎧', name: 'Headphones' },
    { emoji: '☂️', name: 'Umbrella' },
  ],
};

const ALL_OBJECTS = Object.entries(OBJECT_PACKS).flatMap(([category, items]) =>
  items.map((item) => ({ ...item, category }))
);

// ============ RULES ============

const RULES_EASY = [
  { id: 'animals_only', text: 'CLICK ONLY THE ANIMALS', check: (o) => o.category === 'animals' },
  { id: 'food_only', text: 'CLICK ONLY THE FOOD', check: (o) => o.category === 'food' },
];

const RULES_MEDIUM = [
  { id: 'objects_only', text: 'CLICK ONLY THE OBJECTS', check: (o) => o.category === 'objects' },
  { id: 'not_animals', text: 'CLICK EVERYTHING EXCEPT ANIMALS', check: (o) => o.category !== 'animals' },
  { id: 'not_food', text: 'CLICK EVERYTHING EXCEPT FOOD', check: (o) => o.category !== 'food' },
];

const RULES_HARD = [
  { id: 'glowing', text: 'CLICK ONLY THE GLOWING OBJECTS', check: (o) => o.isGlowing === true },
  { id: 'red', text: 'CLICK ONLY THE RED OBJECTS', check: (o) => o.isRed === true },
  { id: 'not_objects', text: 'CLICK EVERYTHING EXCEPT OBJECTS', check: (o) => o.category !== 'objects' },
];

// ============ HELPERS ============

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generatePositions = (count) => {
  const positions = [];
  const minDist = 18;
  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let x, y;
    do {
      x = 8 + Math.random() * 72;
      y = 5 + Math.random() * 78;
      attempts++;
    } while (
      attempts < 40 &&
      positions.some((p) => Math.abs(p.x - x) < minDist && Math.abs(p.y - y) < minDist)
    );
    positions.push({ x, y });
  }
  return positions;
};

const getDifficulty = (gameTime, mode) => {
  const chaos = mode === 'chaos' ? 1.4 : 1;
  if (gameTime < 15) {
    return {
      minObj: 3,
      maxObj: Math.round(4 * chaos),
      waveDuration: Math.round(3500 / chaos),
      rulePool: 'easy',
      speed: 1,
    };
  } else if (gameTime < 30) {
    return {
      minObj: 4,
      maxObj: Math.round(5 * chaos),
      waveDuration: Math.round(2800 / chaos),
      rulePool: 'medium',
      speed: 1.5,
    };
  } else if (gameTime < 60) {
    return {
      minObj: 5,
      maxObj: Math.round(7 * chaos),
      waveDuration: Math.round(2200 / chaos),
      rulePool: 'medium',
      speed: 2,
    };
  } else {
    return {
      minObj: Math.round(7 * chaos),
      maxObj: Math.round(10 * chaos),
      waveDuration: Math.round(1800 / chaos),
      rulePool: 'hard',
      speed: Math.min(4, 2.5 + (gameTime - 60) / 60),
    };
  }
};

const pickRule = (pool, currentRuleId) => {
  let rules;
  if (pool === 'easy') rules = RULES_EASY;
  else if (pool === 'medium') rules = [...RULES_EASY, ...RULES_MEDIUM];
  else rules = [...RULES_EASY, ...RULES_MEDIUM, ...RULES_HARD];
  const available = rules.filter((r) => r.id !== currentRuleId);
  return available[Math.floor(Math.random() * available.length)] || rules[0];
};

const generateWave = (rule, count) => {
  const correctCount = randInt(1, Math.max(1, Math.ceil(count * 0.5)));
  const incorrectCount = count - correctCount;
  const objects = [];
  const isSpecial = rule.id === 'glowing' || rule.id === 'red';

  if (isSpecial) {
    const pool = shuffle(ALL_OBJECTS);
    for (let i = 0; i < count; i++) {
      const item = pool[i % pool.length];
      const isCorrect = i < correctCount;
      objects.push({
        ...item,
        isGlowing: rule.id === 'glowing' ? isCorrect : false,
        isRed: rule.id === 'red' ? isCorrect : false,
        isCorrect,
      });
    }
  } else {
    const correctPool = shuffle(
      ALL_OBJECTS.filter((o) => rule.check({ ...o, isGlowing: false, isRed: false }))
    );
    const incorrectPool = shuffle(
      ALL_OBJECTS.filter((o) => !rule.check({ ...o, isGlowing: false, isRed: false }))
    );
    for (let i = 0; i < correctCount; i++) {
      objects.push({
        ...correctPool[i % correctPool.length],
        isGlowing: false,
        isRed: false,
        isCorrect: true,
      });
    }
    for (let i = 0; i < incorrectCount; i++) {
      objects.push({
        ...incorrectPool[i % incorrectPool.length],
        isGlowing: false,
        isRed: false,
        isCorrect: false,
      });
    }
  }

  const positions = generatePositions(count);
  const shuffled = shuffle(objects);

  return shuffled.map((obj, i) => ({
    ...obj,
    id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`,
    x: positions[i].x,
    y: positions[i].y,
    clicked: false,
    clickResult: null,
    missed: false,
    animDelay: i * 0.07,
    bobSpeed: 2 + Math.random() * 1.5,
    bobOffset: Math.random() * 2,
  }));
};

// ============ HOOK ============

export function useGameEngine(sounds) {
  const [gameState, setGameState] = useState('menu');
  const [mode, setMode] = useState('classic');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [rule, setRule] = useState(null);
  const [objects, setObjects] = useState([]);
  const [ruleFlash, setRuleFlash] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [screenShake, setScreenShake] = useState(false);
  const [effects, setEffects] = useState([]);

  const r = useRef({
    gameState: 'menu',
    mode: 'classic',
    score: 0,
    lives: 3,
    streak: 0,
    bestStreak: 0,
    gameTime: 0,
    speed: 1,
    maxSpeed: 1,
    rule: null,
    objects: [],
    waveTimer: null,
    gameTimer: null,
    lastRuleChange: 0,
  });

  const soundsRef = useRef(sounds);
  useEffect(() => {
    soundsRef.current = sounds;
  }, [sounds]);

  const clearTimers = useCallback(() => {
    clearTimeout(r.current.waveTimer);
    clearInterval(r.current.gameTimer);
    clearInterval(r.current.countdownTimer);
  }, []);

  const endGame = useCallback(() => {
    clearTimers();
    r.current.gameState = 'gameOver';
    setGameState('gameOver');
    setObjects([]);
    r.current.objects = [];

    const s = r.current;
    const pb = JSON.parse(localStorage.getItem('tftc_pb') || '{}');
    if (!pb[s.mode] || s.score > pb[s.mode].score) {
      pb[s.mode] = { score: s.score, survivalTime: s.gameTime, bestStreak: s.bestStreak };
      localStorage.setItem('tftc_pb', JSON.stringify(pb));
    }

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    fetch(`${BACKEND_URL}/api/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: s.mode,
        score: s.score,
        longest_streak: s.bestStreak,
        survival_time: s.gameTime,
        max_speed: s.maxSpeed,
      }),
    }).catch(() => {});
  }, [clearTimers]);

  const spawnWave = useCallback(() => {
    if (r.current.gameState !== 'playing') return;
    const diff = getDifficulty(r.current.gameTime, r.current.mode);
    const count = randInt(diff.minObj, diff.maxObj);
    const currentRule = r.current.rule;
    if (!currentRule) return;

    const newObjects = generateWave(currentRule, count);
    r.current.objects = newObjects;
    setObjects(newObjects);

    r.current.waveTimer = setTimeout(() => {
      if (r.current.gameState !== 'playing') return;

      const current = r.current.objects;
      const missed = current.filter((o) => o.isCorrect && !o.clicked);

      if (missed.length > 0) {
        const updated = current.map((o) =>
          o.isCorrect && !o.clicked ? { ...o, missed: true } : o
        );
        r.current.objects = updated;
        setObjects(updated);

        r.current.lives = Math.max(0, r.current.lives - 1);
        setLives(r.current.lives);
        soundsRef.current?.playWrong?.();

        if (r.current.lives <= 0) {
          setTimeout(() => endGame(), 400);
          return;
        }
      }

      setTimeout(() => {
        r.current.objects = [];
        setObjects([]);
        setTimeout(() => {
          if (r.current.gameState === 'playing') spawnWave();
        }, 200);
      }, missed.length > 0 ? 500 : 150);
    }, diff.waveDuration);
  }, [endGame]);

  const handleClick = useCallback(
    (objectId) => {
      if (r.current.gameState !== 'playing') return;
      const obj = r.current.objects.find((o) => o.id === objectId);
      if (!obj || obj.clicked || obj.missed) return;

      if (obj.isCorrect) {
        r.current.score++;
        r.current.streak++;
        if (r.current.streak > r.current.bestStreak) {
          r.current.bestStreak = r.current.streak;
        }
        setScore(r.current.score);
        setStreak(r.current.streak);
        setBestStreak(r.current.bestStreak);
        soundsRef.current?.playCorrect?.();

        // Particle burst effect
        const eid = `e-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
        setEffects((prev) => [...prev, { id: eid, x: obj.x, y: obj.y }]);
        setTimeout(() => setEffects((prev) => prev.filter((e) => e.id !== eid)), 600);
      } else {
        r.current.streak = 0;
        r.current.lives = Math.max(0, r.current.lives - 1);
        setStreak(0);
        setLives(r.current.lives);
        soundsRef.current?.playWrong?.();

        // Screen shake effect
        setScreenShake(true);
        setTimeout(() => setScreenShake(false), 350);

        if (r.current.lives <= 0) {
          const updated = r.current.objects.map((o) =>
            o.id === objectId ? { ...o, clicked: true, clickResult: 'wrong' } : o
          );
          r.current.objects = updated;
          setObjects(updated);
          setTimeout(() => endGame(), 500);
          return;
        }
      }

      const updated = r.current.objects.map((o) =>
        o.id === objectId
          ? { ...o, clicked: true, clickResult: obj.isCorrect ? 'correct' : 'wrong' }
          : o
      );
      r.current.objects = updated;
      setObjects(updated);

      // If all correct objects clicked, end wave early
      const allCorrectClicked = updated.filter((o) => o.isCorrect).every((o) => o.clicked);
      if (allCorrectClicked) {
        clearTimeout(r.current.waveTimer);
        setTimeout(() => {
          r.current.objects = [];
          setObjects([]);
          setTimeout(() => {
            if (r.current.gameState === 'playing') spawnWave();
          }, 200);
        }, 300);
      }
    },
    [endGame, spawnWave]
  );

  const startGame = useCallback(
    (selectedMode) => {
      clearTimers();
      const m = selectedMode || 'classic';
      r.current = {
        ...r.current,
        gameState: 'playing',
        mode: m,
        score: 0,
        lives: 3,
        streak: 0,
        bestStreak: 0,
        gameTime: 0,
        speed: 1,
        maxSpeed: 1,
        lastRuleChange: 0,
        objects: [],
      };

      setMode(m);
      setScore(0);
      setLives(3);
      setStreak(0);
      setBestStreak(0);
      setGameTime(0);
      setSpeed(1);
      setObjects([]);
      setRuleFlash(false);

      const initialRule = pickRule('easy', null);
      r.current.rule = initialRule;
      setRule(initialRule);

      setGameState('countdown');
      setCountdown(3);

      let cdCount = 3;
      r.current.countdownTimer = setInterval(() => {
        cdCount--;
        if (cdCount > 0) {
          setCountdown(cdCount);
        } else if (cdCount === 0) {
          setCountdown(0);
        } else {
          clearInterval(r.current.countdownTimer);
          setCountdown(null);

          r.current.gameState = 'playing';
          setGameState('playing');

          r.current.gameTimer = setInterval(() => {
            if (r.current.gameState !== 'playing') return;
            r.current.gameTime++;
            setGameTime(r.current.gameTime);

            const diff = getDifficulty(r.current.gameTime, r.current.mode);
            r.current.speed = diff.speed;
            if (diff.speed > r.current.maxSpeed) r.current.maxSpeed = diff.speed;
            setSpeed(diff.speed);

            if (r.current.mode === 'rule_switch' || r.current.mode === 'chaos') {
              const interval = r.current.mode === 'chaos' ? 8 : 12;
              if (r.current.gameTime - r.current.lastRuleChange >= interval) {
                const newRule = pickRule(diff.rulePool, r.current.rule?.id);
                r.current.rule = newRule;
                r.current.lastRuleChange = r.current.gameTime;
                setRule(newRule);
                setRuleFlash(true);
                setTimeout(() => setRuleFlash(false), 600);
              }
            }
          }, 1000);

          setTimeout(() => spawnWave(), 300);
        }
      }, 700);
    },
    [clearTimers, spawnWave]
  );

  const pauseGame = useCallback(() => {
    if (r.current.gameState !== 'playing') return;
    r.current.gameState = 'paused';
    clearTimeout(r.current.waveTimer);
    clearInterval(r.current.gameTimer);
    setGameState('paused');
  }, []);

  const resumeGame = useCallback(() => {
    if (r.current.gameState !== 'paused') return;
    r.current.gameState = 'playing';
    setGameState('playing');

    r.current.gameTimer = setInterval(() => {
      if (r.current.gameState !== 'playing') return;
      r.current.gameTime++;
      setGameTime(r.current.gameTime);
      const diff = getDifficulty(r.current.gameTime, r.current.mode);
      r.current.speed = diff.speed;
      if (diff.speed > r.current.maxSpeed) r.current.maxSpeed = diff.speed;
      setSpeed(diff.speed);
    }, 1000);

    r.current.objects = [];
    setObjects([]);
    setTimeout(() => spawnWave(), 300);
  }, [spawnWave]);

  const resetGame = useCallback(() => {
    clearTimers();
    r.current.gameState = 'menu';
    r.current.objects = [];
    setGameState('menu');
    setObjects([]);
  }, [clearTimers]);

  const getPersonalBest = useCallback(() => {
    const pb = JSON.parse(localStorage.getItem('tftc_pb') || '{}');
    return pb[r.current.mode] || { score: 0, survivalTime: 0 };
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  return {
    gameState,
    mode,
    score,
    lives,
    streak,
    bestStreak,
    gameTime,
    speed,
    rule,
    objects,
    ruleFlash,
    startGame,
    handleClick,
    pauseGame,
    resumeGame,
    resetGame,
    getPersonalBest,
  };
}
