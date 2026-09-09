import React from 'react';
import { CHORDS } from '../../audio/guitar-synth';

export const ChordBar = ({ onStrumChord, activeChord }) => {
  return (
    <div className="chord-container">
      <div className="chord-bar-header">
        <span className="chord-bar-title">QUICK CHORDS</span>
        <span className="chord-bar-hint">Click a chord to strum all strings</span>
      </div>

      <div className="controls">
        {Object.keys(CHORDS).map((chordName) => (
          <button
            key={chordName}
            className={`chord-btn ${activeChord === chordName ? 'active' : ''}`}
            onClick={() => onStrumChord(chordName)}
            title={`Strum ${chordName}`}
          >
            {chordName}
          </button>
        ))}
      </div>
    </div>
  );
};
