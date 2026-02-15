import "@/App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import HomeScreen from "@/components/HomeScreen";
import GameScreen from "@/components/GameScreen";
import GameOverScreen from "@/components/GameOverScreen";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Game states
const GAME_STATES = {
  HOME: "home",
  PLAYING: "playing",
  GAME_OVER: "game_over"
};

function App() {
  const [gameState, setGameState] = useState(GAME_STATES.HOME);
  const [category, setCategory] = useState("mix");
  const [difficulty, setDifficulty] = useState("spicy");
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [recentQuestionIds, setRecentQuestionIds] = useState([]);
  const [categoryStats, setCategoryStats] = useState({});
  const [personalBests, setPersonalBests] = useState({});

  // Load personal bests from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("trivia_personal_bests");
    if (stored) {
      setPersonalBests(JSON.parse(stored));
    }
    const storedRecent = localStorage.getItem("trivia_recent_questions");
    if (storedRecent) {
      setRecentQuestionIds(JSON.parse(storedRecent));
    }
  }, []);

  // Save personal bests to localStorage
  const savePersonalBest = useCallback((cat, score) => {
    const newBests = { ...personalBests };
    if (!newBests[cat] || score > newBests[cat]) {
      newBests[cat] = score;
      setPersonalBests(newBests);
      localStorage.setItem("trivia_personal_bests", JSON.stringify(newBests));
    }
  }, [personalBests]);

  // Add question to recent list - keep last 500 to ensure no repeats
  const addRecentQuestion = useCallback((questionId) => {
    setRecentQuestionIds(prev => {
      const updated = [...prev, questionId].slice(-500); // Keep last 500
      localStorage.setItem("trivia_recent_questions", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Track category performance
  const updateCategoryStats = useCallback((cat, isCorrect) => {
    setCategoryStats(prev => {
      const existing = prev[cat] || { correct: 0, total: 0 };
      return {
        ...prev,
        [cat]: {
          correct: existing.correct + (isCorrect ? 1 : 0),
          total: existing.total + 1
        }
      };
    });
  }, []);

  const startGame = useCallback((selectedCategory, selectedDifficulty) => {
    setCategory(selectedCategory);
    setDifficulty(selectedDifficulty);
    setStreak(0);
    setLives(3);
    setQuestionsAnswered(0);
    setCorrectAnswers(0);
    setCategoryStats({});
    setGameState(GAME_STATES.PLAYING);
  }, []);

  const handleAnswer = useCallback((isCorrect, questionCategory) => {
    setQuestionsAnswered(prev => prev + 1);
    updateCategoryStats(questionCategory, isCorrect);
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          // Game over
          setTimeout(() => {
            setGameState(GAME_STATES.GAME_OVER);
          }, 1500);
        }
        return newLives;
      });
    }
  }, [updateCategoryStats]);

  const endGame = useCallback(() => {
    savePersonalBest(category, streak);
    
    // Save session to backend
    fetch(`${API}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category,
        difficulty,
        streak,
        accuracy: questionsAnswered > 0 ? (correctAnswers / questionsAnswered) * 100 : 0,
        questions_answered: questionsAnswered
      })
    }).catch(console.error);
    
    setGameState(GAME_STATES.GAME_OVER);
  }, [category, difficulty, streak, questionsAnswered, correctAnswers, savePersonalBest]);

  const playAgain = useCallback(() => {
    setGameState(GAME_STATES.HOME);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF7ED]">
      <BrowserRouter>
        <Routes>
          <Route path="*" element={
            <>
              {gameState === GAME_STATES.HOME && (
                <HomeScreen 
                  onStartGame={startGame}
                  personalBests={personalBests}
                />
              )}
              {gameState === GAME_STATES.PLAYING && (
                <GameScreen
                  category={category}
                  difficulty={difficulty}
                  streak={streak}
                  lives={lives}
                  onAnswer={handleAnswer}
                  onGameOver={endGame}
                  recentQuestionIds={recentQuestionIds}
                  addRecentQuestion={addRecentQuestion}
                />
              )}
              {gameState === GAME_STATES.GAME_OVER && (
                <GameOverScreen
                  streak={streak}
                  category={category}
                  difficulty={difficulty}
                  accuracy={questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0}
                  questionsAnswered={questionsAnswered}
                  categoryStats={categoryStats}
                  personalBest={personalBests[category] || 0}
                  onPlayAgain={playAgain}
                />
              )}
            </>
          } />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
