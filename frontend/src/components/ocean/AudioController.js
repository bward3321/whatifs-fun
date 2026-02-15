import { useState, useRef, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export function AudioController() {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef(null);
  const gainRef = useRef(null);

  const initAudio = useCallback(() => {
    if (ctxRef.current) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    ctxRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(ctx.destination);
    gainRef.current = masterGain;

    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 55;
    osc1.connect(masterGain);
    osc1.start();

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 30;
    const o2g = ctx.createGain();
    o2g.gain.value = 0.4;
    osc2.connect(o2g);
    o2g.connect(masterGain);
    osc2.start();

    const bufLen = 2 * ctx.sampleRate;
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 180;

    const ng = ctx.createGain();
    ng.gain.value = 0.035;

    noise.connect(lp);
    lp.connect(ng);
    ng.connect(masterGain);
    noise.start();
  }, []);

  const toggle = useCallback(() => {
    if (!ctxRef.current) initAudio();
    if (ctxRef.current?.state === 'suspended') ctxRef.current.resume();

    const next = !playing;
    setPlaying(next);

    if (gainRef.current && ctxRef.current) {
      gainRef.current.gain.setTargetAtTime(
        next ? 0.22 : 0,
        ctxRef.current.currentTime,
        0.3
      );
    }
  }, [playing, initAudio]);

  return (
    <button
      className="audio-toggle"
      onClick={toggle}
      data-testid="audio-toggle"
      aria-label={playing ? 'Mute audio' : 'Unmute audio'}
    >
      {playing ? <Volume2 size={18} /> : <VolumeX size={18} />}
    </button>
  );
}
