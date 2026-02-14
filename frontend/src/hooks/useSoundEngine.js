import { useRef, useState, useCallback } from 'react';

const FREQS = [
  261.63, 329.63, 392.00, 523.25, 587.33, 659.25,
  783.99, 880.00, 987.77, 1046.50, 1174.66, 1318.51,
];

export function useSoundEngine() {
  const ctxRef = useRef(null);
  const [enabled, setEnabled] = useState(true);

  const getCtx = useCallback(() => {
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const playTone = useCallback((tileIndex, duration = 180) => {
    if (!enabled) return;
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = FREQS[tileIndex % FREQS.length];
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration / 1000);
    } catch (e) { /* silent fail */ }
  }, [enabled, getCtx]);

  const playSuccess = useCallback(() => {
    if (!enabled) return;
    [0, 2, 4].forEach((idx, i) => setTimeout(() => playTone(idx, 100), i * 80));
  }, [enabled, playTone]);

  const playFail = useCallback(() => {
    if (!enabled) return;
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = 150;
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) { /* silent fail */ }
  }, [enabled, getCtx]);

  return { playTone, playSuccess, playFail, soundEnabled: enabled, setSoundEnabled: setEnabled };
}
