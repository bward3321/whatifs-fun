import { Zap, RotateCcw, Skull, ChevronDown } from 'lucide-react';
import FAQ from '@/components/landing/FAQ';

const MODES = [
  {
    id: 'classic',
    title: 'CLASSIC',
    desc: 'One rule. Increasing speed. How long can you last?',
    Icon: Zap,
    accent: '#06b6d4',
    shadow: '0 0 30px rgba(6, 182, 212, 0.3)',
  },
  {
    id: 'rule_switch',
    title: 'RULE SWITCH',
    desc: 'Rules change every 10-15s. Forces cognitive reset.',
    Icon: RotateCcw,
    accent: '#d946ef',
    shadow: '0 0 30px rgba(217, 70, 239, 0.3)',
  },
  {
    id: 'chaos',
    title: 'CHAOS',
    desc: 'Maximum speed. Decoys everywhere. Pure reflex.',
    Icon: Skull,
    accent: '#f43f5e',
    shadow: '0 0 30px rgba(244, 63, 94, 0.3)',
  },
];

export default function LandingScreen({ onSelectMode }) {
  return (
    <div className="landing-screen" data-testid="landing-screen">
      <div className="landing-content">
        <h1 className="game-title" data-testid="game-title">
          TOO FAST
          <br />
          TO CLICK
        </h1>
        <p className="game-subtitle">High-Speed Visual Reflex Game</p>

        <div className="mode-grid" data-testid="mode-grid">
          {MODES.map(({ id, title, desc, Icon, accent, shadow }) => (
            <button
              key={id}
              className="mode-card"
              data-testid={`mode-card-${id}`}
              onClick={() => onSelectMode(id)}
              style={{ '--accent': accent, '--shadow': shadow }}
            >
              <Icon size={28} style={{ color: accent }} />
              <h3 className="mode-title">{title}</h3>
              <p className="mode-desc">{desc}</p>
            </button>
          ))}
        </div>

        <div className="scroll-hint">
          <ChevronDown size={18} />
          <span>Scroll for FAQ</span>
        </div>
      </div>

      <FAQ />
    </div>
  );
}
