import React from 'react';

const DifficultySelector = ({ onSelectDifficulty }) => (
  <div>
    <h3>Select Difficulty</h3>
    <button onClick={() => onSelectDifficulty('easy')}>Easy</button>
    <button onClick={() => onSelectDifficulty('medium')}>Medium</button>
    <button onClick={() => onSelectDifficulty('hard')}>Hard</button>
  </div>
);

export default DifficultySelector;
