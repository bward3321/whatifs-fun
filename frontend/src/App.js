import "@/App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GamePage from "./pages/GamePage";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/higher-or-lower/:slug" element={<GamePage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
