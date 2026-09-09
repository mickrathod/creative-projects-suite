import React from 'react';

export const StartOverlay = ({ onStart }) => {
  return (
    <div className="start-overlay-backdrop">
      <div className="start-overlay-card">
        <div className="overlay-badge">STEINWAY ACOUSTIC MODELING</div>
        <h2 className="overlay-title">VirtuosoKeys Piano Academy</h2>
        <p className="overlay-desc">
          Experience physical grand piano acoustic harmonics, falling notes sheet music, and interactive masterclasses for Bollywood & Indie classics.
        </p>

        <div className="features-preview-row">
          <div className="feat-chip">🎹 88-Key Grand Model</div>
          <div className="feat-chip">🎼 Synthesia Falling Notes</div>
          <div className="feat-chip">❤️ Tum Hi Ho & Tum Mere Ho</div>
          <div className="feat-chip">🔌 USB MIDI Keyboard Support</div>
        </div>

        <button className="btn-enter-piano" onClick={onStart}>
          ▶️ OPEN PIANO CONCERT GRAND
        </button>

        <span className="audio-context-hint">Clicking enables browser high-definition Web Audio</span>
      </div>
    </div>
  );
};
