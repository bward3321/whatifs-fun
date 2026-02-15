import { useState } from "react";
import { motion } from "framer-motion";
import { 
  PawPrint, 
  Globe2, 
  Crown, 
  Utensils, 
  Rocket, 
  Gamepad2,
  Shuffle,
  Flame,
  Snowflake,
  Zap,
  Trophy
} from "lucide-react";

const CATEGORIES = [
  { id: "animals", name: "Animals & Nature", icon: PawPrint, bg: "#DCFCE7", text: "#166534", accent: "#22C55E" },
  { id: "geography", name: "Geography & Earth", icon: Globe2, bg: "#DBEAFE", text: "#1E40AF", accent: "#3B82F6" },
  { id: "history", name: "People & History", icon: Crown, bg: "#FEF9C3", text: "#854D0E", accent: "#EAB308" },
  { id: "food", name: "Food & Drink", icon: Utensils, bg: "#FFEDD5", text: "#9A3412", accent: "#F97316" },
  { id: "space", name: "Space & Science", icon: Rocket, bg: "#F3E8FF", text: "#6B21A8", accent: "#A855F7" },
  { id: "pop_culture", name: "Pop Culture & Tech", icon: Gamepad2, bg: "#FCE7F3", text: "#9D174D", accent: "#EC4899" },
];

const DIFFICULTIES = [
  { id: "chill", name: "Chill", icon: Snowflake, color: "#60A5FA" },
  { id: "spicy", name: "Spicy", icon: Flame, color: "#F97316" },
  { id: "savage", name: "Savage", icon: Zap, color: "#EF4444" },
];

export default function HomeScreen({ onStartGame, personalBests }) {
  const [selectedCategory, setSelectedCategory] = useState("mix");
  const [selectedDifficulty, setSelectedDifficulty] = useState("spicy");

  const handleStart = () => {
    onStartGame(selectedCategory, selectedDifficulty);
  };

  return (
    <div className="min-h-screen bg-[#FFF7ED] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Title */}
        <motion.div 
          className="text-center mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <h1 
            className="font-display text-5xl sm:text-6xl font-bold text-gray-800 leading-tight"
            data-testid="game-title"
          >
            TRUE
            <br />
            <span className="text-gray-500">or</span>
            <br />
            <span className="text-red-400">TOTALLY FAKE?</span>
          </h1>
          <p className="mt-4 text-gray-500 text-lg font-medium">
            Think you're smart? Let's see.
          </p>
        </motion.div>

        {/* Category Grid */}
        <motion.div
          className="mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 text-center">
            Choose Category
          </p>
          <div className="grid grid-cols-2 gap-3">
            {/* Mix All Option */}
            <motion.button
              data-testid="category-mix"
              onClick={() => setSelectedCategory("mix")}
              className={`col-span-2 category-tile flex items-center justify-center gap-3 py-4 rounded-2xl border-b-4 transition-all ${
                selectedCategory === "mix"
                  ? "bg-gray-800 border-gray-900 text-white scale-[1.02]"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <Shuffle className="w-6 h-6" />
              <span className="font-bold text-lg">Mix All Categories</span>
            </motion.button>

            {/* Category Tiles */}
            {CATEGORIES.map((cat, index) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              const bestScore = personalBests[cat.id];
              
              return (
                <motion.button
                  key={cat.id}
                  data-testid={`category-${cat.id}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`category-tile relative aspect-square flex flex-col items-center justify-center gap-2 rounded-2xl border-b-4 p-4 ${
                    isSelected 
                      ? "ring-4 ring-offset-2 scale-[1.02]" 
                      : ""
                  }`}
                  style={{ 
                    backgroundColor: cat.bg, 
                    color: cat.text,
                    borderColor: isSelected ? cat.accent : "rgba(0,0,0,0.1)",
                    ringColor: cat.accent
                  }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-10 h-10" strokeWidth={2.5} />
                  <span className="font-bold text-sm text-center leading-tight">
                    {cat.name}
                  </span>
                  {bestScore > 0 && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/80 rounded-full px-2 py-0.5">
                      <Trophy className="w-3 h-3" />
                      <span className="text-xs font-bold">{bestScore}</span>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Difficulty Selector */}
        <motion.div
          className="mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 text-center">
            Difficulty
          </p>
          <div className="flex gap-3">
            {DIFFICULTIES.map((diff) => {
              const Icon = diff.icon;
              const isSelected = selectedDifficulty === diff.id;
              
              return (
                <motion.button
                  key={diff.id}
                  data-testid={`difficulty-${diff.id}`}
                  onClick={() => setSelectedDifficulty(diff.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all border-b-4 ${
                    isSelected
                      ? "bg-gray-800 border-gray-900 text-white"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon 
                    className="w-5 h-5" 
                    style={{ color: isSelected ? diff.color : "currentColor" }}
                  />
                  <span>{diff.name}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.button
          data-testid="start-game-btn"
          onClick={handleStart}
          className="btn-3d w-full py-5 text-xl font-black uppercase tracking-wider bg-gray-900 text-white rounded-2xl shadow-[0_6px_0_rgba(0,0,0,0.3)] hover:shadow-[0_8px_0_rgba(0,0,0,0.3)] active:shadow-none active:translate-y-1.5 transition-all"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Let's Play!
        </motion.button>

        {/* Footer */}
        <motion.p
          className="text-center text-gray-400 text-sm mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Powered by AI • Infinite Questions
        </motion.p>
      </div>
    </div>
  );
}
