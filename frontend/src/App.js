import "@/App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import GamePage from "@/components/game/GamePage";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<GamePage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
