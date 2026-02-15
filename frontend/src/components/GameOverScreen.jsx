import { motion } from "framer-motion";
import { 
  Trophy, 
  Target, 
  RotateCcw, 
  Share2,
  Flame,
  Star,
  PawPrint, 
  Globe2, 
  Crown, 
  Utensils, 
  Rocket, 
  Gamepad2,
  Shuffle
} from "lucide-react";
import { toast } from "sonner";

const CATEGORY_CONFIG = {
  mix: { icon: Shuffle, bg: "#F3F4F6", text: "#374151", name: "Mix" },
  animals: { icon: PawPrint, bg: "#DCFCE7", text: "#166534", name: "Animals" },
  geography: { icon: Globe2, bg: "#DBEAFE", text: "#1E40AF", name: "Geography" },
  history: { icon: Crown, bg: "#FEF9C3", text: "#854D0E", name: "History" },
  food: { icon: Utensils, bg: "#FFEDD5", text: "#9A3412", name: "Food" },
  space: { icon: Rocket, bg: "#F3E8FF", text: "#6B21A8", name: "Space" },
  pop_culture: { icon: Gamepad2, bg: "#FCE7F3", text: "#9D174D", name: "Pop Culture" },
};

export default function GameOverScreen({ 
  streak, 
  category, 
  difficulty,
  accuracy, 
  questionsAnswered,
  categoryStats,
  personalBest,
  onPlayAgain 
}) {
  const isNewBest = streak >= personalBest && streak > 0;
  const categoryConfig = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.mix;
  const CategoryIcon = categoryConfig.icon;

  // Find best and worst performing categories
  const sortedCategories = Object.entries(categoryStats)
    .map(([cat, stats]) => ({
      category: cat,
      accuracy: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
      ...stats
    }))
    .sort((a, b) => b.accuracy - a.accuracy);

  const bestCategory = sortedCategories[0];
  const worstCategory = sortedCategories[sortedCategories.length - 1];

  // Generate share text
  const shareText = `I got a ${streak} streak in True or Totally Fake (${categoryConfig.name})! Can you beat me? 🎮`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "True or Totally Fake?",
          text: shareText,
          url: window.location.href
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText + "\n" + window.location.href);
      toast.success("Copied to clipboard!");
    } catch (err) {
      // Fallback for browsers without clipboard permissions
      toast.info("Share this score with your friends!");
    }
  };

  // Get fun summary line
  const getSummaryLine = () => {
    if (streak === 0) return "Better luck next time! 🍀";
    if (streak < 5) return "Not bad for a warmup! 🔥";
    if (streak < 10) return "You're getting good at this! 💪";
    if (streak < 15) return "Impressive knowledge! 🧠";
    if (streak < 20) return "You're a trivia master! 👑";
    return "LEGENDARY performance! 🏆";
  };

  const getCategoryComment = () => {
    if (!bestCategory || !worstCategory) return null;
    if (sortedCategories.length < 2) return null;
    
    if (bestCategory.accuracy > 80) {
      return `You dominated ${CATEGORY_CONFIG[bestCategory.category]?.name || bestCategory.category}!`;
    }
    if (worstCategory.accuracy < 40 && worstCategory.total >= 2) {
      return `${CATEGORY_CONFIG[worstCategory.category]?.name || worstCategory.category} humbled you.`;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#FFF7ED] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        
        {/* Game Over Title */}
        <motion.div
          className="text-center mb-6"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <h1 className="font-display text-4xl font-bold text-gray-800 mb-2">
            Game Over!
          </h1>
          <p className="text-xl text-gray-500 font-medium">
            {getSummaryLine()}
          </p>
        </motion.div>

        {/* Main Score Card */}
        <motion.div
          className="bg-white rounded-3xl shadow-xl p-6 mb-6 border-b-8 border-gray-200"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          data-testid="game-over-card"
        >
          {/* New Best Badge */}
          {isNewBest && (
            <motion.div
              className="flex items-center justify-center gap-2 bg-amber-100 text-amber-700 py-2 px-4 rounded-full mb-4 mx-auto w-fit"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <Star className="w-5 h-5 fill-amber-500" />
              <span className="font-bold">NEW PERSONAL BEST!</span>
            </motion.div>
          )}

          {/* Category Badge */}
          <div 
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-full mx-auto w-fit mb-6"
            style={{ backgroundColor: categoryConfig.bg, color: categoryConfig.text }}
          >
            <CategoryIcon className="w-5 h-5" />
            <span className="font-bold">{categoryConfig.name}</span>
          </div>

          {/* Streak Display */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Flame className="w-10 h-10 text-amber-500" />
              <motion.span 
                className="text-7xl font-black text-gray-800"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
                data-testid="final-streak"
              >
                {streak}
              </motion.span>
            </div>
            <p className="text-xl font-bold text-gray-500">Final Streak</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 rounded-2xl p-4 text-center">
              <Target className="w-6 h-6 text-blue-500 mx-auto mb-1" />
              <p className="text-2xl font-black text-gray-800">{accuracy}%</p>
              <p className="text-sm font-medium text-gray-500">Accuracy</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 text-center">
              <Trophy className="w-6 h-6 text-amber-500 mx-auto mb-1" />
              <p className="text-2xl font-black text-gray-800">{personalBest}</p>
              <p className="text-sm font-medium text-gray-500">Best Streak</p>
            </div>
          </div>

          {/* Questions Answered */}
          <p className="text-center text-gray-500 font-medium">
            {questionsAnswered} questions answered
          </p>

          {/* Category Comment */}
          {getCategoryComment() && (
            <motion.p
              className="text-center text-gray-600 font-semibold mt-4 py-2 px-4 bg-gray-50 rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {getCategoryComment()}
            </motion.p>
          )}
        </motion.div>

        {/* Category Breakdown */}
        {sortedCategories.length > 1 && (
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-4 mb-6"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
              Category Breakdown
            </p>
            <div className="space-y-2">
              {sortedCategories.map((stat) => {
                const config = CATEGORY_CONFIG[stat.category] || CATEGORY_CONFIG.mix;
                const Icon = config.icon;
                return (
                  <div key={stat.category} className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: config.bg }}
                    >
                      <Icon className="w-4 h-4" style={{ color: config.text }} />
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ 
                            width: `${stat.accuracy}%`,
                            backgroundColor: stat.accuracy >= 50 ? '#4ADE80' : '#F87171'
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-600 w-12 text-right">
                      {stat.correct}/{stat.total}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <motion.button
            data-testid="play-again-btn"
            onClick={onPlayAgain}
            className="btn-3d w-full py-5 text-xl font-black uppercase tracking-wider bg-gray-900 text-white rounded-2xl shadow-[0_6px_0_rgba(0,0,0,0.3)] hover:shadow-[0_8px_0_rgba(0,0,0,0.3)] active:shadow-none active:translate-y-1.5 transition-all"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center justify-center gap-2">
              <RotateCcw className="w-6 h-6" />
              Play Again
            </span>
          </motion.button>

          <motion.button
            data-testid="share-btn"
            onClick={handleShare}
            className="w-full py-4 text-lg font-bold bg-white text-gray-700 rounded-2xl border-2 border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Share2 className="w-5 h-5" />
            Share Score
          </motion.button>
        </div>
      </div>
    </div>
  );
}
