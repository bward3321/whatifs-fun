import { motion } from 'framer-motion';
import { Play, Zap, Shuffle, Brain } from 'lucide-react';

const MODE_STYLES = {
  classic: {
    active: 'bg-cyan-500/15 border-cyan-400/30 text-cyan-300',
    icon: 'text-cyan-400',
  },
  speed: {
    active: 'bg-amber-500/15 border-amber-400/30 text-amber-300',
    icon: 'text-amber-400',
  },
  random: {
    active: 'bg-violet-500/15 border-violet-400/30 text-violet-300',
    icon: 'text-violet-400',
  },
};

const MODES = [
  { id: 'classic', label: 'Classic', icon: Brain, desc: 'No time limit' },
  { id: 'speed', label: 'Speed', icon: Zap, desc: 'Beat the clock' },
  { id: 'random', label: 'Random', icon: Shuffle, desc: 'Tiles shuffle' },
];

export function StartScreen({ onStart, selectedMode, onModeChange, bestScores }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center gap-10 text-center px-6 py-12"
      data-testid="start-screen"
    >
      <div className="space-y-5">
        <h1 className="font-title text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-50 tracking-tight leading-[1.1]">
          Remember<br className="sm:hidden" /> the Order
        </h1>
        <p className="text-slate-400 text-lg md:text-xl font-body">
          Watch carefully. Repeat perfectly.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
        {MODES.map(m => {
          const Icon = m.icon;
          const best = bestScores?.[m.id] || 0;
          const isSelected = selectedMode === m.id;
          const style = MODE_STYLES[m.id];
          return (
            <button
              key={m.id}
              data-testid={`mode-${m.id}`}
              onClick={() => onModeChange(m.id)}
              className={`p-3 rounded-xl border backdrop-blur-sm transition-all duration-200 flex flex-col items-center gap-1.5 ${
                isSelected
                  ? style.active
                  : 'bg-white/[0.03] border-white/[0.06] text-slate-500 hover:bg-white/[0.06] hover:text-slate-300'
              }`}
            >
              <Icon className={`w-5 h-5 ${isSelected ? style.icon : ''}`} />
              <span className="text-xs font-semibold tracking-wide">{m.label}</span>
              {best > 0 && (
                <span className="text-[10px] opacity-50">Best: {best}</span>
              )}
            </button>
          );
        })}
      </div>

      <motion.button
        data-testid="start-game-btn"
        onClick={() => onStart(selectedMode)}
        className="group flex items-center gap-2.5 px-12 py-5 rounded-full text-white font-bold text-lg start-btn-gradient shadow-[0_0_35px_rgba(6,182,212,0.3)] hover:shadow-[0_0_55px_rgba(6,182,212,0.45)] transition-shadow duration-300"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
      >
        <Play className="w-5 h-5" />
        Start Game
      </motion.button>

      <p className="text-slate-500 text-sm max-w-[300px] leading-relaxed">
        Watch the sequence, then tap the tiles in the same order
      </p>
    </motion.div>
  );
}
