import React, { useState, useEffect, useRef } from 'react';
import { CHORD_CATEGORIES, PROGRESSIONS } from '../../audio/guitar-synth';

export const ChordBar = ({
  onStrumChord,
  activeChord,
  onSelectChordFingering,
  selectedChord
}) => {
  const [activeCategory, setActiveCategory] = useState('Major');
  const [isPlayingProgression, setIsPlayingProgression] = useState(false);
  const [currentProgressionIdx, setCurrentProgressionIdx] = useState(0);
  const [activeProgName, setActiveProgName] = useState(null);
  const timerRef = useRef(null);

  // Stop progression on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleStartProgression = (prog) => {
    if (isPlayingProgression && activeProgName === prog.name) {
      // Stop
      clearInterval(timerRef.current);
      setIsPlayingProgression(false);
      setActiveProgName(null);
      return;
    }

    if (timerRef.current) clearInterval(timerRef.current);

    setIsPlayingProgression(true);
    setActiveProgName(prog.name);
    let step = 0;

    // Trigger first chord immediately
    const chords = prog.chords;
    onStrumChord(chords[0]);
    onSelectChordFingering(chords[0]);
    setCurrentProgressionIdx(0);

    timerRef.current = setInterval(() => {
      step = (step + 1) % chords.length;
      setCurrentProgressionIdx(step);
      onStrumChord(chords[step]);
      onSelectChordFingering(chords[step]);
    }, 1400); // 1.4s per measure
  };

  const currentChordList = CHORD_CATEGORIES[activeCategory] || [];

  return (
    <div className="chord-command-deck">
      {/* Category Tabs */}
      <div className="chord-deck-header">
        <div className="category-tabs">
          {Object.keys(CHORD_CATEGORIES).map((cat) => (
            <button
              key={cat}
              className={`cat-tab-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="hint-pill">
          Click to strum or preview fingerings on fretboard
        </div>
      </div>

      {/* Grid of Chords in Active Category */}
      <div className="chords-grid">
        {currentChordList.map((chordName) => {
          const isFretted = selectedChord === chordName;
          const isStrumming = activeChord === chordName;

          return (
            <button
              key={chordName}
              className={`chord-key-card ${isFretted ? 'selected-fret' : ''} ${isStrumming ? 'strum-active' : ''}`}
              onClick={() => {
                onSelectChordFingering(chordName);
                onStrumChord(chordName);
              }}
              title={`Strum ${chordName}`}
            >
              <span className="chord-symbol">{chordName.replace(' major', '').replace(' minor', 'm')}</span>
              <span className="chord-full-name">{chordName}</span>
            </button>
          );
        })}
      </div>

      {/* Famous Chord Progressions Jammer */}
      <div className="progressions-container">
        <div className="progression-title">
          <span>🎵 AUTO-STRUM JAM PROGRESSIONS</span>
        </div>
        <div className="progression-buttons">
          {PROGRESSIONS.map((prog) => {
            const isThisActive = isPlayingProgression && activeProgName === prog.name;

            return (
              <button
                key={prog.name}
                className={`progression-card ${isThisActive ? 'playing-loop' : ''}`}
                onClick={() => handleStartProgression(prog)}
              >
                <div className="prog-top">
                  <span className="prog-name">{prog.name}</span>
                  <span className="prog-status-badge">
                    {isThisActive ? '● PLAYING' : 'START JAM'}
                  </span>
                </div>
                <div className="prog-chords-sequence">
                  {prog.chords.map((ch, i) => (
                    <span
                      key={i}
                      className={`prog-chord-tag ${isThisActive && currentProgressionIdx === i ? 'highlight-chord' : ''}`}
                    >
                      {ch.replace(' major', '').replace(' minor', 'm')}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
