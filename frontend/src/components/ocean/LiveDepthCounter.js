import { memo, useRef, useEffect } from 'react';

export const LiveDepthCounter = memo(function LiveDepthCounter({ depth }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = `${depth.toLocaleString()}m`;
    }
  }, [depth]);

  return (
    <div className="live-depth-counter" data-testid="live-depth-counter">
      <span className="live-depth-label">CURRENT DEPTH</span>
      <span className="live-depth-value" ref={ref} data-testid="depth-counter">
        0m
      </span>
    </div>
  );
});
