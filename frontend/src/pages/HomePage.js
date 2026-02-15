import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { categories } from "../data/gameData";
import Header from "../components/Header";
import { Globe, Film, Trophy, PawPrint, TrendingUp, Zap, ArrowRight } from "lucide-react";

const iconMap = {
  Globe: Globe,
  Film: Film,
  Trophy: Trophy,
  PawPrint: PawPrint,
  TrendingUp: TrendingUp,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
};

export default function HomePage() {
  const getBestScore = (slug) => {
    try {
      return localStorage.getItem(`hol-best-${slug}`) || "—";
    } catch {
      return "—";
    }
  };

  return (
    <div className="home-page" data-testid="home-page">
      <Header score={0} highScore={0} isPlaying={false} />

      <main className="home-main">
        <motion.div
          className="hero-section"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="hero-badge" data-testid="hero-badge">
            <Zap size={18} />
            <span>GUESS & COMPETE</span>
          </div>
          <h1 className="hero-title" data-testid="hero-title">
            HIGHER<br />OR LOWER
          </h1>
          <p className="hero-subtitle" data-testid="hero-subtitle">
            Compare real-world statistics. Guess correctly. Build your streak. How far can you go?
          </p>
        </motion.div>

        <motion.div
          className="categories-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          data-testid="categories-grid"
        >
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || Globe;
            const best = getBestScore(cat.slug);
            return (
              <motion.div key={cat.slug} variants={cardVariants}>
                <Link
                  to={`/higher-or-lower/${cat.slug}`}
                  className="category-card"
                  style={{ "--cat-color": cat.color }}
                  data-testid={`category-card-${cat.slug}`}
                >
                  <div
                    className="category-card-bg"
                    style={{ backgroundImage: `url(${cat.image})` }}
                  />
                  <div className="category-card-overlay" />
                  <div className="category-card-content">
                    <div className="category-card-icon">
                      <Icon size={28} />
                    </div>
                    <h2 className="category-card-title">{cat.name}</h2>
                    <p className="category-card-desc">{cat.description}</p>
                    <div className="category-card-footer">
                      {best !== "—" && (
                        <span className="category-best-score">Best: {best}</span>
                      )}
                      <span className="category-play-btn">
                        Play Now <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        <footer className="home-footer" data-testid="home-footer">
          <p>A free, fun, and addictive guessing game. No login required.</p>
        </footer>
      </main>
    </div>
  );
}
