import React from 'react';

export const StartOverlay = ({ onStart }) => {
  return (
    <div className="start-overlay" onClick={onStart}>
      <button className="start-button">
        🎸 Click to Start Playing Guitar
      </button>
    </div>
  );
};
