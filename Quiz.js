import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch questions from API
  useEffect(() => {
    axios
      .get("https://opentdb.com/api.php?amount=10&type=multiple")
      .then((response) => {
        setQuestions(response.data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
        setLoading(false);
      });
  }, []);

  const handleAnswer = (answer) => {
    if (answer === questions[currentQuestion].correct_answer) {
      setScore(score + 1);
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitScore();
    }
  };

  const submitScore = async () => {
    const username = prompt("Enter your username:");
    try {
      await axios.post("http://localhost:5000/leaderboard", {
        username: username || "Anonymous",
        score: score,
      });
      navigate("/leaderboard");
    } catch (error) {
      console.error("Error submitting score:", error);
    }
  };

  if (loading) {
    return <div className="spinner">Loading...</div>;
  }

  return (
    <div className="quiz-container">
      <h2>Question {currentQuestion + 1}</h2>
      <p className="question">{questions[currentQuestion].question}</p>
      <div className="answers">
        {questions[currentQuestion].incorrect_answers
          .concat(questions[currentQuestion].correct_answer)
          .sort(() => Math.random() - 0.5) // Shuffle answers
          .map((answer, index) => (
            <button
              key={index}
              className="answer-btn"
              onClick={() => handleAnswer(answer)}
            >
              {answer}
            </button>
          ))}
      </div>
    </div>
  );
}

export default Quiz;
