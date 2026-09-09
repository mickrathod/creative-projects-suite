import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GuitarSynth, TUNINGS, CHORDS } from './audio/guitar-synth';
import { Fretboard } from './components/Fretboard/Fretboard';
import { ChordBar } from './components/Controls/ChordBar';
import { ToneSelector } from './components/Controls/ToneSelector';
import { StartOverlay } from './components/Common/StartOverlay';
import './App.css';

export function App() {
  const synthRef = useRef(null);
  if (!synthRef.current) {
    synthRef.current = new GuitarSynth();
  }
  const synth = synthRef.current;

  const [isStarted, setIsStarted] = useState(false);
  const [tuningKey, setTuningKey] = useState('standard');
  const [toneMode, setToneMode] = useState('acoustic');
  const [strumDirection, setStrumDirection] = useState('down');
  const [activeChord, setActiveChord] = useState(null);
  const [activePluckIndices, setActivePluckIndices] = useState([]);

  const currentStrings = TUNINGS[tuningKey].strings;

  const handleStart = () => {
    synth.ensureContext();
    setIsStarted(true);
  };

  const handlePluckString = useCallback((index) => {
    synth.ensureContext();
    const str = currentStrings[index];
    if (str) {
      synth.pluckString(str.freq, index);
    }
  }, [synth, currentStrings]);

  const handleStrumChord = useCallback((chordName) => {
    synth.ensureContext();
    const fretOffsets = CHORDS[chordName];
    if (!fretOffsets) return;

    setActiveChord(chordName);
    const plucked = synth.strumChord(fretOffsets, currentStrings, strumDirection);
    setActivePluckIndices(plucked);

    setTimeout(() => {
      setActiveChord(null);
      setActivePluckIndices([]);
    }, 450);
  }, [synth, currentStrings, strumDirection]);

  const handleToneChange = (mode) => {
    setToneMode(mode);
    synth.setToneMode(mode);
  };

  const handleTuningChange = (key) => {
    setTuningKey(key);
  };

  const handleDirectionToggle = () => {
    setStrumDirection((d) => (d === 'down' ? 'up' : 'down'));
  };

  // Keyboard Shortcuts: Keys 1-6 for individual strings, chord shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

      const key = e.key;

      // 1-6 for strings
      if (['1', '2', '3', '4', '5', '6'].includes(key)) {
        const idx = parseInt(key, 10) - 1;
        handlePluckString(idx);
      }

      // Chord shortcuts
      const upper = key.toUpperCase();
      if (upper === 'E') handleStrumChord('E major');
      else if (upper === 'A') handleStrumChord('A major');
      else if (upper === 'D') handleStrumChord('D major');
      else if (upper === 'G') handleStrumChord('G major');
      else if (upper === 'C') handleStrumChord('C major');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePluckString, handleStrumChord]);

  return (
    <div className="guitar-app">
      {!isStarted && <StartOverlay onStart={handleStart} />}

      <header className="guitar-header">
        <div className="badge">REACT 19 EDITION</div>
        <h1 className="guitar-title">Online Guitar Pro</h1>
        <p className="guitar-subtitle">
          Interactive physically modeled acoustic & electric guitar simulator
        </p>
      </header>

      <main className="guitar-main">
        {/* Settings & Tone Selector */}
        <ToneSelector
          toneMode={toneMode}
          onToneChange={handleToneChange}
          tuningKey={tuningKey}
          onTuningChange={handleTuningChange}
          strumDirection={strumDirection}
          onDirectionToggle={handleDirectionToggle}
        />

        {/* Fretboard Container */}
        <div className="guitar-wrap">
          <Fretboard
            strings={currentStrings}
            onPluckString={handlePluckString}
            activePluckIndices={activePluckIndices}
          />

          {/* Chords Bar */}
          <ChordBar
            onStrumChord={handleStrumChord}
            activeChord={activeChord}
          />
        </div>

        {/* Keyboard Reference Footer */}
        <footer className="footer-note">
          <p>
            Pluck strings by clicking or dragging across the fretboard. Press <kbd>1</kbd>&ndash;<kbd>6</kbd> for strings, or press <kbd>E</kbd>, <kbd>A</kbd>, <kbd>D</kbd>, <kbd>G</kbd>, <kbd>C</kbd> to strum major chords.
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
