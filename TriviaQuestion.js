import React, { useState } from 'react';

const TriviaQuestion = ({ questionData, onNextQuestion }) => {
  const { question, correct_answer, incorrect_answers } = questionData;
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const allAnswers = [...incorrect_answers, correct_answer].sort(() => Math.random() - 0.5);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setShowAnswer(true);
    setTimeout(() => {
      setShowAnswer(false);
      onNextQuestion(answer === correct_answer);
    }, 2000);
  };

  return (
    <div>
      <h3 dangerouslySetInnerHTML={{ __html: question }}></h3>
      <div>
        {allAnswers.map((answer, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(answer)}
            className={showAnswer && answer === correct_answer ? 'correct' : ''}
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        ))}
      </div>
      {showAnswer && (
        <p>
          {selectedAnswer === correct_answer ? 'Correct! 🎉' : `Wrong! 😞 The answer is ${correct_answer}`}
        </p>
      )}
    </div>
  );
};

export default TriviaQuestion;
