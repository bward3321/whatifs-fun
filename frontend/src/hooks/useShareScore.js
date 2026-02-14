import { useCallback, useRef } from 'react';

const getScoreTier = (score) => {
  if (score >= 14) return { label: 'Genius Tier', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)' };
  if (score >= 10) return { label: 'Elite Memory', color: '#22d3ee', bg: 'rgba(34, 211, 238, 0.15)' };
  if (score >= 6) return { label: 'Above Average', color: '#34d399', bg: 'rgba(52, 211, 153, 0.15)' };
  return { label: 'Keep Practicing', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)' };
};

const MODE_LABELS = { classic: 'Classic', speed: 'Speed', random: 'Random' };

export function useShareScore() {
  const canvasRef = useRef(null);

  const generateCard = useCallback((score, stats, mode) => {
    const canvas = document.createElement('canvas');
    const w = 600;
    const h = 340;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    const tier = getScoreTier(score);

    // Background
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#0a0f1e');
    bgGrad.addColorStop(1, '#0d1424');
    ctx.fillStyle = bgGrad;
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, 20);
    ctx.fill();

    // Subtle ambient glow
    const glowGrad = ctx.createRadialGradient(w * 0.3, h * 0.4, 0, w * 0.3, h * 0.4, 250);
    glowGrad.addColorStop(0, 'rgba(6, 182, 212, 0.06)');
    glowGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, w, h);

    const glowGrad2 = ctx.createRadialGradient(w * 0.8, h * 0.7, 0, w * 0.8, h * 0.7, 200);
    glowGrad2.addColorStop(0, 'rgba(139, 92, 246, 0.04)');
    glowGrad2.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGrad2;
    ctx.fillRect(0, 0, w, h);

    // Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(0.5, 0.5, w - 1, h - 1, 20);
    ctx.stroke();

    // Title
    ctx.font = '600 13px Syne, sans-serif';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
    ctx.letterSpacing = '3px';
    ctx.textAlign = 'left';
    ctx.fillText('REMEMBER THE ORDER', 36, 42);

    // Mode badge
    ctx.font = '600 10px Manrope, sans-serif';
    const modeText = MODE_LABELS[mode] || 'Classic';
    const modeW = ctx.measureText(modeText.toUpperCase()).width + 16;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.beginPath();
    ctx.roundRect(w - 36 - modeW, 30, modeW, 22, 6);
    ctx.fill();
    ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
    ctx.textAlign = 'center';
    ctx.fillText(modeText.toUpperCase(), w - 36 - modeW / 2, 44);

    // Score - large
    ctx.textAlign = 'left';
    ctx.font = '800 96px Syne, sans-serif';
    ctx.fillStyle = '#f1f5f9';
    ctx.fillText(String(score), 36, 150);

    // Score label width for positioning
    const scoreTextW = ctx.measureText(String(score)).width;

    // Tier label
    ctx.font = '700 16px Manrope, sans-serif';
    ctx.fillStyle = tier.color;
    ctx.fillText(tier.label, 42 + scoreTextW, 130);

    // Thin separator
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.fillRect(36, 172, w - 72, 1);

    // Stats row
    const statY = 206;
    const statsData = [
      { label: 'ROUNDS', value: String(stats.roundsCompleted) },
      { label: 'ACCURACY', value: `${stats.accuracy}%` },
      { label: 'CLICKS', value: String(stats.totalClicks) },
    ];

    statsData.forEach((s, i) => {
      const sx = 36 + i * 180;
      ctx.font = '800 22px Syne, sans-serif';
      ctx.fillStyle = '#e2e8f0';
      ctx.textAlign = 'left';
      ctx.fillText(s.value, sx, statY);
      ctx.font = '600 9px Manrope, sans-serif';
      ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
      ctx.fillText(s.label, sx, statY + 18);
    });

    // CTA
    ctx.font = '600 14px Manrope, sans-serif';
    ctx.fillStyle = '#22d3ee';
    ctx.textAlign = 'left';
    ctx.fillText('Can you beat my score?', 36, 278);

    // URL
    ctx.font = '500 11px Manrope, sans-serif';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.35)';
    ctx.fillText(window.location.origin, 36, 314);

    // Small decorative tiles in bottom-right
    const tileColors = ['#22d3ee', '#a78bfa', '#fb7185', '#fbbf24'];
    tileColors.forEach((c, i) => {
      const tx = w - 36 - (4 - i) * 28;
      const ty = 290;
      ctx.fillStyle = c + '20';
      ctx.strokeStyle = c + '50';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(tx, ty, 20, 20, 4);
      ctx.fill();
      ctx.stroke();
    });

    return canvas;
  }, []);

  const shareScore = useCallback(async (score, stats, mode) => {
    const canvas = generateCard(score, stats, mode);
    const tier = getScoreTier(score);
    const shareText = `I scored ${score} on Remember the Order! (${tier.label}) Can you beat me?`;
    const shareUrl = window.location.href;

    // Try native Web Share API with image
    if (navigator.share && navigator.canShare) {
      try {
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        const file = new File([blob], 'my-score.png', { type: 'image/png' });
        const shareData = { text: shareText, url: shareUrl, files: [file] };

        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return { success: true, method: 'native' };
        }
      } catch (e) {
        if (e.name === 'AbortError') return { success: false, method: 'cancelled' };
      }
    }

    // Fallback: try sharing without image
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText, url: shareUrl });
        return { success: true, method: 'native-text' };
      } catch (e) {
        if (e.name === 'AbortError') return { success: false, method: 'cancelled' };
      }
    }

    // Final fallback: download image
    return { success: false, method: 'fallback', canvas };
  }, [generateCard]);

  const downloadCard = useCallback((score, stats, mode) => {
    const canvas = generateCard(score, stats, mode);
    const link = document.createElement('a');
    link.download = `remember-the-order-score-${score}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [generateCard]);

  const shareToTwitter = useCallback((score) => {
    const tier = getScoreTier(score);
    const text = encodeURIComponent(`I scored ${score} on Remember the Order! (${tier.label}) Can you beat me?\n\n${window.location.href}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'noopener');
  }, []);

  const copyLink = useCallback(async (score) => {
    const tier = getScoreTier(score);
    const text = `I scored ${score} on Remember the Order! (${tier.label}) Can you beat me? ${window.location.href}`;
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }, []);

  return { shareScore, downloadCard, shareToTwitter, copyLink, generateCard };
}
