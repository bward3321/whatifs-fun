import { motion } from 'framer-motion';

const TILE_COLORS = [
  { idle: 'rgba(34, 211, 238, 0.12)', active: '#22d3ee', glow: 'rgba(34, 211, 238, 0.5)', border: 'rgba(34, 211, 238, 0.35)', idleGlow: '0 0 20px rgba(34, 211, 238, 0.1)' },
  { idle: 'rgba(167, 139, 250, 0.12)', active: '#a78bfa', glow: 'rgba(167, 139, 250, 0.5)', border: 'rgba(167, 139, 250, 0.35)', idleGlow: '0 0 20px rgba(167, 139, 250, 0.1)' },
  { idle: 'rgba(251, 113, 133, 0.12)', active: '#fb7185', glow: 'rgba(251, 113, 133, 0.5)', border: 'rgba(251, 113, 133, 0.35)', idleGlow: '0 0 20px rgba(251, 113, 133, 0.1)' },
  { idle: 'rgba(251, 191, 36, 0.12)', active: '#fbbf24', glow: 'rgba(251, 191, 36, 0.5)', border: 'rgba(251, 191, 36, 0.35)', idleGlow: '0 0 20px rgba(251, 191, 36, 0.1)' },
  { idle: 'rgba(52, 211, 153, 0.12)', active: '#34d399', glow: 'rgba(52, 211, 153, 0.5)', border: 'rgba(52, 211, 153, 0.35)', idleGlow: '0 0 20px rgba(52, 211, 153, 0.1)' },
  { idle: 'rgba(96, 165, 250, 0.12)', active: '#60a5fa', glow: 'rgba(96, 165, 250, 0.5)', border: 'rgba(96, 165, 250, 0.35)', idleGlow: '0 0 20px rgba(96, 165, 250, 0.1)' },
  { idle: 'rgba(251, 146, 60, 0.12)', active: '#fb923c', glow: 'rgba(251, 146, 60, 0.5)', border: 'rgba(251, 146, 60, 0.35)', idleGlow: '0 0 20px rgba(251, 146, 60, 0.1)' },
  { idle: 'rgba(244, 114, 182, 0.12)', active: '#f472b6', glow: 'rgba(244, 114, 182, 0.5)', border: 'rgba(244, 114, 182, 0.35)', idleGlow: '0 0 20px rgba(244, 114, 182, 0.1)' },
  { idle: 'rgba(163, 230, 53, 0.12)', active: '#a3e635', glow: 'rgba(163, 230, 53, 0.5)', border: 'rgba(163, 230, 53, 0.35)', idleGlow: '0 0 20px rgba(163, 230, 53, 0.1)' },
  { idle: 'rgba(129, 140, 248, 0.12)', active: '#818cf8', glow: 'rgba(129, 140, 248, 0.5)', border: 'rgba(129, 140, 248, 0.35)', idleGlow: '0 0 20px rgba(129, 140, 248, 0.1)' },
  { idle: 'rgba(45, 212, 191, 0.12)', active: '#2dd4bf', glow: 'rgba(45, 212, 191, 0.5)', border: 'rgba(45, 212, 191, 0.35)', idleGlow: '0 0 20px rgba(45, 212, 191, 0.1)' },
  { idle: 'rgba(248, 113, 113, 0.12)', active: '#f87171', glow: 'rgba(248, 113, 113, 0.5)', border: 'rgba(248, 113, 113, 0.35)', idleGlow: '0 0 20px rgba(248, 113, 113, 0.1)' },
];

export { TILE_COLORS };

export function GameTile({ index, isActive, isFailed, isCorrect, onClick, disabled }) {
  const color = TILE_COLORS[index % TILE_COLORS.length];
  const highlighted = isActive || isFailed || isCorrect;

  let bg = color.idle;
  let shadow = color.idleGlow;
  let border = color.border;

  if (isActive) {
    bg = color.active;
    shadow = `0 0 25px ${color.glow}, 0 0 50px ${color.glow}`;
    border = color.active;
  } else if (isFailed) {
    bg = '#f43f5e';
    shadow = '0 0 30px rgba(244, 63, 94, 0.6)';
    border = '#f43f5e';
  } else if (isCorrect) {
    bg = '#10b981';
    shadow = '0 0 30px rgba(16, 185, 129, 0.6)';
    border = '#10b981';
  }

  return (
    <motion.button
      data-testid={`game-tile-${index}`}
      onClick={() => !disabled && onClick(index)}
      className="aspect-square rounded-2xl cursor-pointer border-2 backdrop-blur-sm select-none touch-manipulation outline-none focus:outline-none"
      style={{ backgroundColor: bg, borderColor: border, boxShadow: shadow }}
      animate={{ scale: highlighted ? 1.06 : 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      whileHover={!disabled ? { scale: 1.04, borderColor: 'rgba(255,255,255,0.2)' } : undefined}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      disabled={disabled}
      aria-label={`Tile ${index + 1}`}
    />
  );
}
