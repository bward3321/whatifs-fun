import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { 
  Heart, 
  Flame,
  PawPrint, 
  Globe2, 
  Crown, 
  Utensils, 
  Rocket, 
  Gamepad2,
  X,
  Check,
  Loader2
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CATEGORY_CONFIG = {
  animals: { icon: PawPrint, bg: "#DCFCE7", text: "#166534", accent: "#22C55E", name: "Animals & Nature" },
  geography: { icon: Globe2, bg: "#DBEAFE", text: "#1E40AF", accent: "#3B82F6", name: "Geography & Earth" },
  history: { icon: Crown, bg: "#FEF9C3", text: "#854D0E", accent: "#EAB308", name: "People & History" },
  food: { icon: Utensils, bg: "#FFEDD5", text: "#9A3412", accent: "#F97316", name: "Food & Drink" },
  space: { icon: Rocket, bg: "#F3E8FF", text: "#6B21A8", accent: "#A855F7", name: "Space & Science" },
  pop_culture: { icon: Gamepad2, bg: "#FCE7F3", text: "#9D174D", accent: "#EC4899", name: "Pop Culture & Tech" },
};

export default function GameScreen({ 
  category, 
  difficulty, 
  streak, 
  lives, 
  onAnswer, 
  onGameOver,
  recentQuestionIds,
  addRecentQuestion 
}) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answerState, setAnswerState] = useState(null); // null, 'correct', 'wrong'
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [sessionQuestionIds, setSessionQuestionIds] = useState([]); // Track this session's questions

  // Fetch a new question with progressive difficulty based on streak
  const fetchQuestion = useCallback(async () => {
    setLoading(true);
    setAnswerState(null);
    setShowExplanation(false);
    
    try {
      // Combine session questions with recent questions for maximum exclusion
      const allExcludeIds = [...new Set([...recentQuestionIds, ...sessionQuestionIds])];
      
      const response = await fetch(`${API}/questions/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          difficulty,
          exclude_ids: allExcludeIds,
          streak // Pass streak for progressive difficulty
        })
      });
      
      if (!response.ok) throw new Error("Failed to fetch question");
      
      const question = await response.json();
      setCurrentQuestion(question);
      
      // Track in both session and global recent
      setSessionQuestionIds(prev => [...prev, question.id]);
      addRecentQuestion(question.id);
    } catch (error) {
      console.error("Error fetching question:", error);
      // Retry after a short delay
      setTimeout(fetchQuestion, 1000);
    } finally {
      setLoading(false);
    }
  }, [category, difficulty, streak, recentQuestionIds, sessionQuestionIds, addRecentQuestion]);

  useEffect(() => {
    fetchQuestion();
  }, []);

  // Trigger confetti on correct answer
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4ADE80', '#22C55E', '#86EFAC', '#FCD34D', '#FBBF24']
    });
  };

  const handleAnswer = async (userAnswer) => {
    if (isAnimating || loading || !currentQuestion) return;
    
    setIsAnimating(true);
    const isCorrect = userAnswer === currentQuestion.is_true;
    
    setAnswerState(isCorrect ? 'correct' : 'wrong');
    
    if (isCorrect) {
      triggerConfetti();
    }
    
    // Show explanation
    setTimeout(() => {
      setShowExplanation(true);
    }, 400);
    
    // Call parent handler
    onAnswer(isCorrect, currentQuestion.category);
    
    // Check if game over (lives will be 0 after this wrong answer)
    if (!isCorrect && lives <= 1) {
      setTimeout(() => {
        onGameOver();
      }, 2000);
      return;
    }
    
    // Auto advance to next question
    setTimeout(() => {
      setIsAnimating(false);
      fetchQuestion();
    }, 2200);
  };

  const questionCategory = currentQuestion?.category || category;
  const categoryConfig = CATEGORY_CONFIG[questionCategory] || CATEGORY_CONFIG.animals;
  const CategoryIcon = categoryConfig.icon;

  return (
    <div 
      className="min-h-screen min-h-[100dvh] flex flex-col items-center p-3 sm:p-4 transition-colors duration-500 touch-manipulation"
      style={{ backgroundColor: answerState === 'wrong' ? '#FEE2E2' : '#FFF7ED' }}
    >
      <div className="w-full max-w-md mx-auto flex flex-col h-[calc(100dvh-1.5rem)] sm:h-[calc(100vh-2rem)]">
        
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          {/* Category Badge */}
          <div 
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full"
            style={{ backgroundColor: categoryConfig.bg, color: categoryConfig.text }}
          >
            <CategoryIcon className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-bold truncate max-w-[100px] sm:max-w-none">{categoryConfig.name}</span>
          </div>
          
          {/* Lives */}
          <div className="flex gap-0.5 sm:gap-1" data-testid="lives-display">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={false}
                animate={{ 
                  scale: i <= lives ? 1 : 0.8,
                  opacity: i <= lives ? 1 : 0.3
                }}
              >
                <Heart 
                  className={`w-6 h-6 sm:w-7 sm:h-7 ${i <= lives ? 'fill-rose-500 text-rose-500' : 'text-gray-300'}`}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Streak Counter with Difficulty Indicator */}
        <motion.div 
          className="flex items-center justify-center gap-2 mb-4 sm:mb-6"
          key={streak}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
          <span className="text-2xl sm:text-3xl font-black text-gray-800" data-testid="streak-counter">
            {streak}
          </span>
          <span className="text-base sm:text-lg font-bold text-gray-500">streak</span>
          {/* Difficulty indicator */}
          {streak >= 10 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full"
            >
              HARD
            </motion.span>
          )}
          {streak >= 5 && streak < 10 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-600 text-xs font-bold rounded-full"
            >
              HEATING UP
            </motion.span>
          )}
        </motion.div>

        {/* Question Card */}
        <div className="flex-1 flex items-center justify-center px-1">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 animate-spin" />
                <p className="text-gray-500 font-medium text-sm sm:text-base">Generating question...</p>
              </motion.div>
            ) : currentQuestion && (
              <motion.div
                key={currentQuestion.id}
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className={`question-card relative w-full bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 border-4 ${
                  answerState === 'correct' ? 'correct border-green-400' :
                  answerState === 'wrong' ? 'wrong border-red-400 animate-shake' :
                  'border-gray-100'
                }`}
                data-testid="question-card"
              >
                {/* Category Icon */}
                <div 
                  className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6"
                  style={{ backgroundColor: categoryConfig.bg }}
                >
                  <CategoryIcon 
                    className="w-8 h-8 sm:w-12 sm:h-12" 
                    style={{ color: categoryConfig.accent }}
                    strokeWidth={2}
                  />
                </div>

                {/* Statement */}
                <p 
                  className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-800 text-center leading-snug mb-3 sm:mb-4"
                  data-testid="question-statement"
                >
                  "{currentQuestion.statement}"
                </p>

                {/* Answer Indicator */}
                <AnimatePresence>
                  {answerState && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className={`absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
                        answerState === 'correct' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    >
                      {answerState === 'correct' ? (
                        <Check className="w-6 h-6 sm:w-8 sm:h-8 text-white" strokeWidth={3} />
                      ) : (
                        <X className="w-6 h-6 sm:w-8 sm:h-8 text-white" strokeWidth={3} />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Explanation */}
                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100"
                    >
                      <p className={`text-xs sm:text-sm font-bold uppercase tracking-wider mb-1 ${
                        currentQuestion.is_true ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {currentQuestion.is_true ? '✓ This is TRUE' : '✗ This is FAKE'}
                      </p>
                      <p className="text-gray-600 text-sm sm:text-base" data-testid="question-explanation">
                        {currentQuestion.explanation}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Answer Buttons - Optimized for mobile touch */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6 pb-2 sm:pb-4">
          <motion.button
            data-testid="btn-true"
            onClick={() => handleAnswer(true)}
            disabled={isAnimating || loading}
            className="btn-3d py-5 sm:py-6 text-lg sm:text-xl font-black uppercase tracking-wider bg-green-400 text-white rounded-xl sm:rounded-2xl shadow-[0_5px_0_rgb(21,128,61)] sm:shadow-[0_6px_0_rgb(21,128,61)] hover:bg-green-500 active:shadow-none active:translate-y-1 sm:active:translate-y-1.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all select-none"
            whileHover={{ scale: isAnimating ? 1 : 1.02 }}
            whileTap={{ scale: isAnimating ? 1 : 0.95 }}
          >
            <span className="flex items-center justify-center gap-1.5 sm:gap-2">
              <Check className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={3} />
              TRUE
            </span>
          </motion.button>
          
          <motion.button
            data-testid="btn-fake"
            onClick={() => handleAnswer(false)}
            disabled={isAnimating || loading}
            className="btn-3d py-5 sm:py-6 text-lg sm:text-xl font-black uppercase tracking-wider bg-red-400 text-white rounded-xl sm:rounded-2xl shadow-[0_5px_0_rgb(185,28,28)] sm:shadow-[0_6px_0_rgb(185,28,28)] hover:bg-red-500 active:shadow-none active:translate-y-1 sm:active:translate-y-1.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all select-none"
            whileHover={{ scale: isAnimating ? 1 : 1.02 }}
            whileTap={{ scale: isAnimating ? 1 : 0.95 }}
          >
            <span className="flex items-center justify-center gap-1.5 sm:gap-2">
              <X className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={3} />
              FAKE
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
