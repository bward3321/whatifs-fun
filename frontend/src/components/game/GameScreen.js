import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { GameTile } from './GameTile';

function TimerBar({ value }) {
  const isLow = value < 25;
  return (
    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden" data-testid="speed-timer">
      <div
        className={`h-full rounded-full transition-[width] duration-100 ease-linear ${isLow ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.4)]'}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function GameScreen({
  round, tileCount, tileOrder, activeTile, failedTile, correctTile,
  gameState, onTileClick, mode, timeLeft, onRestart,
  soundEnabled, onToggleSound, seqLength, inputCount, shaking,
}) {
  const gridCols = tileCount <= 4 ? 2 : tileCount <= 6 ? 3 : tileCount <= 9 ? 3 : 4;
  const isInputDisabled = gameState !== 'playing';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`flex flex-col items-center gap-5 w-full max-w-md mx-auto px-4 py-6 ${shaking ? 'animate-shake' : ''}`}
      data-testid="game-screen"
    >
      {/* Top bar */}
      <div className="w-full flex items-center justify-between">
        <button
          data-testid="restart-btn"
          onClick={onRestart}
          className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-slate-200 hover:bg-white/[0.08] transition-all"
          aria-label="Restart"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div data-testid="round-display" className="px-5 py-2 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/[0.08] flex items-center gap-3">
          <span className="text-slate-500 text-xs uppercase tracking-widest font-medium">Round</span>
          <span className="text-cyan-400 font-bold text-xl font-heading">{round}</span>
        </div>

        <button
          data-testid="sound-toggle"
          onClick={onToggleSound}
          className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-slate-200 hover:bg-white/[0.08] transition-all"
          aria-label="Toggle sound"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
          gameState === 'watching' ? 'bg-amber-400 animate-pulse' :
          gameState === 'playing' ? 'bg-emerald-400' :
          'bg-rose-400'
        }`} />
        <span className="text-[11px] text-slate-500 uppercase tracking-[0.15em] font-semibold">
          {gameState === 'watching' ? 'Watch' : gameState === 'playing' ? 'Your turn' : '...'}
        </span>
      </div>

      {/* Speed mode timer */}
      {mode === 'speed' && gameState === 'playing' && <TimerBar value={timeLeft} />}

      {/* Tile Grid */}
      <div
        data-testid="tile-grid"
        className="grid gap-4 sm:gap-5 w-full mx-auto"
        style={{
          gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
          maxWidth: gridCols <= 2 ? '320px' : gridCols <= 3 ? '420px' : '480px',
        }}
      >
        <AnimatePresence mode="popLayout">
          {tileOrder.map((logicalIndex) => (
            <motion.div
              key={`tile-${logicalIndex}`}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <GameTile
                index={logicalIndex}
                isActive={activeTile === logicalIndex}
                isFailed={failedTile === logicalIndex}
                isCorrect={correctTile === logicalIndex}
                onClick={onTileClick}
                disabled={isInputDisabled}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      {gameState === 'playing' && seqLength > 0 && (
        <div className="flex gap-1.5 items-center justify-center flex-wrap" data-testid="progress-dots">
          {Array.from({ length: seqLength }, (_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                i < inputCount ? 'bg-cyan-400 scale-125' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
