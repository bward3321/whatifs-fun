// Audio Context utility for zero-latency sounds
let audioContext = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume if suspended (required for mobile browsers)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
};

// Play a beep sound with given frequency and duration
const playTone = (frequency, duration, type = 'sine', volume = 0.3) => {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    // Quick attack, smooth decay
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn('Audio playback failed:', e);
  }
};

// Sound effects
export const sounds = {
  // High pitch beep for "GO" - the green screen
  go: () => playTone(880, 0.15, 'sine', 0.25),
  
  // Low buzz for early click / fail
  fail: () => {
    playTone(150, 0.3, 'sawtooth', 0.2);
  },
  
  // Success sound - ascending notes
  success: () => {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Play a quick ascending arpeggio
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.15, 'sine', 0.2), i * 80);
    });
  },
  
  // Click sound for button presses
  click: () => playTone(600, 0.05, 'sine', 0.15),
  
  // Initialize audio context on first user interaction
  init: () => {
    getAudioContext();
  }
};

export default sounds;
