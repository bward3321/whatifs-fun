import { memo } from 'react';

export const DepthGauge = memo(function DepthGauge({ depth, progress }) {
  return (
    <div className="depth-gauge" data-testid="depth-gauge">
      <div className="gauge-track">
        <div className="gauge-fill" style={{ height: `${progress * 100}%` }} />
        <div className="gauge-indicator" style={{ top: `${progress * 100}%` }}>
          <div className="gauge-dot" />
          <span className="gauge-label">YOU ARE HERE</span>
        </div>
      </div>
    </div>
  );
});
