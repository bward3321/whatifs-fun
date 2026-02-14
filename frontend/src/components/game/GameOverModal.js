import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Trophy, Target, Crosshair, Share2, Download, Twitter, Copy, Check, X } from 'lucide-react';
import { useEffect, useState, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useShareScore } from '@/hooks/useShareScore';

const getScoreLabel = (s) => {
  if (s >= 14) return { label: 'Genius Tier', color: 'text-amber-400' };
  if (s >= 10) return { label: 'Elite Memory', color: 'text-cyan-400' };
  if (s >= 6) return { label: 'Above Average', color: 'text-emerald-400' };
  return { label: 'Keep Practicing', color: 'text-slate-400' };
};

function SharePanel({ score, stats, mode, onClose }) {
  const { shareScore, downloadCard, shareToTwitter, copyLink, generateCard } = useShareScore();
  const [copied, setCopied] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const previewRef = useRef(null);

  // Generate preview on mount
  useEffect(() => {
    const canvas = generateCard(score, stats, mode);
    setPreviewUrl(canvas.toDataURL('image/png'));
  }, [score, stats, mode, generateCard]);

  const handleNativeShare = useCallback(async () => {
    const result = await shareScore(score, stats, mode);
    if (result.method === 'fallback' && result.canvas) {
      // Native share not available, download instead
      downloadCard(score, stats, mode);
    }
  }, [score, stats, mode, shareScore, downloadCard]);

  const handleCopy = useCallback(async () => {
    const tierLabel = score >= 14 ? 'Genius Tier' : score >= 10 ? 'Elite Memory' : score >= 6 ? 'Above Average' : 'Keep Practicing';
    const text = `I scored ${score} on Remember the Order! (${tierLabel}) Can you beat me? ${window.location.href}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, [score]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="space-y-4"
    >
      {/* Card Preview */}
      {previewUrl && (
        <div className="rounded-xl overflow-hidden border border-white/[0.06] shadow-lg">
          <img
            ref={previewRef}
            src={previewUrl}
            alt="Score card preview"
            className="w-full h-auto"
            data-testid="share-card-preview"
          />
        </div>
      )}

      {/* Share buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          data-testid="share-native-btn"
          onClick={handleNativeShare}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-semibold hover:bg-cyan-500/20 transition-all"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
        <button
          data-testid="share-twitter-btn"
          onClick={() => shareToTwitter(score)}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 text-sm font-semibold hover:bg-white/[0.08] transition-all"
        >
          <Twitter className="w-4 h-4" />
          Post on X
        </button>
        <button
          data-testid="share-download-btn"
          onClick={() => downloadCard(score, stats, mode)}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 text-sm font-semibold hover:bg-white/[0.08] transition-all"
        >
          <Download className="w-4 h-4" />
          Save Image
        </button>
        <button
          data-testid="share-copy-btn"
          onClick={handleCopy}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
            copied
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:bg-white/[0.08]'
          }`}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>

      {/* Back button */}
      <button
        data-testid="share-back-btn"
        onClick={onClose}
        className="w-full text-center text-xs text-slate-500 hover:text-slate-300 transition-colors py-1"
      >
        Back to results
      </button>
    </motion.div>
  );
}

export function GameOverModal({ score, bestScore, stats, mode, onReplay, isNewBest }) {
  const label = getScoreLabel(score);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    if (isNewBest && score >= 4) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22d3ee', '#a78bfa', '#34d399', '#fbbf24'],
      });
    }
  }, [isNewBest, score]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        data-testid="game-over-modal"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 25 }}
          className="bg-slate-900/90 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-8 max-w-sm w-full shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          <AnimatePresence mode="wait">
            {showShare ? (
              <SharePanel
                key="share"
                score={score}
                stats={stats}
                mode={mode}
                onClose={() => setShowShare(false)}
              />
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -20 }}
              >
          {/* Score */}
          <div className="text-center space-y-2 mb-8">
            {isNewBest && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] uppercase tracking-widest font-bold mb-2"
              >
                <Trophy className="w-3 h-3" />
                New Personal Best
              </motion.div>
            )}
            <div className="text-7xl font-heading font-bold text-slate-50 leading-none">{score}</div>
            <div className={`text-sm font-semibold tracking-wide ${label.color}`}>{label.label}</div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white/[0.03] rounded-xl p-3 text-center border border-white/[0.05]">
              <Target className="w-4 h-4 mx-auto mb-1 text-slate-500" />
              <div className="text-lg font-bold text-slate-200 font-heading">{stats.roundsCompleted}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Rounds</div>
            </div>
            <div className="bg-white/[0.03] rounded-xl p-3 text-center border border-white/[0.05]">
              <Crosshair className="w-4 h-4 mx-auto mb-1 text-slate-500" />
              <div className="text-lg font-bold text-slate-200 font-heading">{stats.accuracy}%</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Accuracy</div>
            </div>
            <div className="bg-white/[0.03] rounded-xl p-3 text-center border border-white/[0.05]">
              <Trophy className="w-4 h-4 mx-auto mb-1 text-amber-500" />
              <div className="text-lg font-bold text-slate-200 font-heading">{bestScore}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Best</div>
            </div>
          </div>

          {/* Score reference */}
          <div className="bg-white/[0.02] rounded-xl p-4 mb-8 border border-white/[0.04]">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-3 font-semibold">How you compare</div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Average Human</span>
                <span className="text-slate-300 font-semibold font-heading">6</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-cyan-500">Elite Memory</span>
                <span className="text-slate-300 font-semibold font-heading">10+</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-amber-400">Genius Tier</span>
                <span className="text-slate-300 font-semibold font-heading">14+</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <motion.button
              data-testid="replay-btn"
              onClick={onReplay}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all duration-200 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RotateCcw className="w-4 h-4" />
              Play Again
            </motion.button>
            <motion.button
              data-testid="share-score-btn"
              onClick={() => setShowShare(true)}
              className="px-5 py-3.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-slate-300 font-semibold hover:bg-white/[0.1] transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Share2 className="w-4 h-4" />
            </motion.button>
          </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
