import { motion } from 'framer-motion';

const TILE_COLORS = [
  { color: '#22d3ee', rgb: '34, 211, 238' },   // Cyan
  { color: '#a78bfa', rgb: '167, 139, 250' },   // Violet
  { color: '#fb7185', rgb: '251, 113, 133' },   // Rose
  { color: '#fbbf24', rgb: '251, 191, 36' },    // Amber
  { color: '#34d399', rgb: '52, 211, 153' },    // Emerald
  { color: '#60a5fa', rgb: '96, 165, 250' },    // Blue
  { color: '#fb923c', rgb: '251, 146, 60' },    // Orange
  { color: '#f472b6', rgb: '244, 114, 182' },   // Pink
  { color: '#a3e635', rgb: '163, 230, 53' },    // Lime
  { color: '#818cf8', rgb: '129, 140, 248' },   // Indigo
  { color: '#2dd4bf', rgb: '45, 212, 191' },    // Teal
  { color: '#f87171', rgb: '248, 113, 113' },   // Red
];

export { TILE_COLORS };

export function GameTile({ index, isActive, isFailed, isCorrect, onClick, disabled }) {
  const { color, rgb } = TILE_COLORS[index % TILE_COLORS.length];
  const highlighted = isActive || isFailed || isCorrect;

  const getStyles = () => {
    if (isActive) {
      return {
        backgroundColor: `rgba(${rgb}, 0.35)`,
        borderColor: color,
        boxShadow: `0 0 30px rgba(${rgb}, 0.5), 0 0 60px rgba(${rgb}, 0.25), inset 0 0 30px rgba(${rgb}, 0.15)`,
      };
    }
    if (isFailed) {
      return {
        backgroundColor: 'rgba(244, 63, 94, 0.35)',
        borderColor: '#f43f5e',
        boxShadow: '0 0 30px rgba(244, 63, 94, 0.5), inset 0 0 20px rgba(244, 63, 94, 0.15)',
      };
    }
    if (isCorrect) {
      return {
        backgroundColor: 'rgba(16, 185, 129, 0.35)',
        borderColor: '#10b981',
        boxShadow: '0 0 30px rgba(16, 185, 129, 0.5), inset 0 0 20px rgba(16, 185, 129, 0.15)',
      };
    }
    // Idle state - visible glass effect
    return {
      backgroundColor: `rgba(${rgb}, 0.08)`,
      borderColor: `rgba(${rgb}, 0.3)`,
      boxShadow: `0 0 15px rgba(${rgb}, 0.05), inset 0 1px 0 rgba(255,255,255,0.05)`,
    };
  };

  return (
    <motion.button
      data-testid={`game-tile-${index}`}
      onClick={() => !disabled && onClick(index)}
      className="w-full aspect-square rounded-2xl cursor-pointer border-2 backdrop-blur-sm select-none touch-manipulation outline-none focus:outline-none relative overflow-hidden"
      style={getStyles()}
      animate={{ scale: highlighted ? 1.06 : 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      whileHover={!disabled ? { scale: 1.04, borderColor: `rgba(${rgb}, 0.5)` } : undefined}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      disabled={disabled}
      aria-label={`Tile ${index + 1}`}
    >
      {/* Inner glow gradient for visibility */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: highlighted
            ? `radial-gradient(circle at 40% 40%, rgba(255,255,255,0.15), transparent 60%)`
            : `radial-gradient(circle at 40% 40%, rgba(${rgb}, 0.08), transparent 70%)`,
        }}
      />
    </motion.button>
  );
}
