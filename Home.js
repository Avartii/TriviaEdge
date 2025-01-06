import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [difficulty, setDifficulty] = useState("easy");
  const navigate = useNavigate();

  const startQuiz = () => {
    navigate("/quiz", { state: { difficulty } });
  };

  return (
    <div className="home-page">
      <h1>Welcome to Trivia Quiz</h1>
      <label>Select Difficulty:</label>
      <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <button onClick={startQuiz}>Start Quiz</button>
    </div>
  );
}

export default Home;
