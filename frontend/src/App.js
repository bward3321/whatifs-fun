import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GamePage from "@/components/game/GamePage";

function App() {
  return (
    <BrowserRouter basename="/memory-test">
      <Routes>
        <Route path="/" element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
