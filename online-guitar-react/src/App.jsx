import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GuitarSynth, TUNINGS, CHORDS } from './audio/guitar-synth';
import { Fretboard } from './components/Fretboard/Fretboard';
import { ChordBar } from './components/Controls/ChordBar';
import { ToneSelector } from './components/Controls/ToneSelector';
import { SoundVisualizer } from './components/Common/SoundVisualizer';
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
  const [selectedChord, setSelectedChord] = useState('G major');
  const [activeFretPlucks, setActiveFretPlucks] = useState({});
  const [showNoteNames, setShowNoteNames] = useState(true);
  const [volume, setVolume] = useState(0.85);

  const currentStrings = TUNINGS[tuningKey].strings;

  const handleStart = () => {
    synth.ensureContext();
    setIsStarted(true);
  };

  // Pluck a specific string at a specific fret
  const handlePluckFret = useCallback((stringIdx, fret = 0) => {
    synth.ensureContext();
    const str = currentStrings[stringIdx];
    if (!str) return;

    const freq = str.freq * Math.pow(2, fret / 12);
    synth.pluckString(freq, stringIdx, 3.8);

    setActiveFretPlucks((prev) => ({
      ...prev,
      [stringIdx]: fret
    }));

    setTimeout(() => {
      setActiveFretPlucks((prev) => {
        const next = { ...prev };
        delete next[stringIdx];
        return next;
      });
    }, 450);
  }, [synth, currentStrings]);

  // Strum a chord
  const handleStrumChord = useCallback((chordName) => {
    synth.ensureContext();
    const fretOffsets = CHORDS[chordName];
    if (!fretOffsets) return;

    setActiveChord(chordName);
    setSelectedChord(chordName);

    const activeIndices = synth.strumChord(fretOffsets, currentStrings, strumDirection, 24);

    // Light up frets on the fretboard
    const plucks = {};
    fretOffsets.forEach((fret, sIdx) => {
      if (fret !== null) plucks[sIdx] = fret;
    });
    setActiveFretPlucks(plucks);

    setTimeout(() => {
      setActiveChord(null);
      setActiveFretPlucks({});
    }, 550);
  }, [synth, currentStrings, strumDirection]);

  const handleSelectChordFingering = (chordName) => {
    setSelectedChord(chordName);
  };

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

  const handleVolumeChange = (newVol) => {
    setVolume(newVol);
    synth.setVolume(newVol);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

      const key = e.key;

      // 1-6 for strings (plucks the fretted note of currently selected chord)
      if (['1', '2', '3', '4', '5', '6'].includes(key)) {
        const idx = parseInt(key, 10) - 1;
        const frets = selectedChord ? CHORDS[selectedChord] : null;
        const fret = frets && frets[idx] !== null ? frets[idx] : 0;
        handlePluckFret(idx, fret);
      }

      // Chord shortcuts
      const upper = key.toUpperCase();
      if (upper === 'E') handleStrumChord('E major');
      else if (upper === 'A') handleStrumChord('A major');
      else if (upper === 'D') handleStrumChord('D major');
      else if (upper === 'G') handleStrumChord('G major');
      else if (upper === 'C') handleStrumChord('C major');
      else if (upper === 'F') handleStrumChord('F major');
      else if (upper === 'B') handleStrumChord('B major');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePluckFret, handleStrumChord, selectedChord]);

  const activeFingerings = selectedChord ? CHORDS[selectedChord] : null;

  return (
    <div className="guitar-app">
      {!isStarted && <StartOverlay onStart={handleStart} />}

      <header className="guitar-header">
        <div className="badge">AURASTRINGS PRO • KARPLUS-STRONG DSP</div>
        <h1 className="guitar-title">AuraStrings Virtual Guitar</h1>
        <p className="guitar-subtitle">
          Studio-grade physical string modeling with interactive 12-fret neck & chord jammer
        </p>
      </header>

      <main className="guitar-main">
        {/* Top Controls Strip: Tone, Tuning, Direction, Volume, Note Labels */}
        <ToneSelector
          toneMode={toneMode}
          onToneChange={handleToneChange}
          tuningKey={tuningKey}
          onTuningChange={handleTuningChange}
          strumDirection={strumDirection}
          onDirectionToggle={handleDirectionToggle}
          showNoteNames={showNoteNames}
          onToggleNoteNames={() => setShowNoteNames(!showNoteNames)}
          volume={volume}
          onVolumeChange={handleVolumeChange}
        />

        {/* Guitar Body Housing */}
        <div className="guitar-chassis">
          {/* Top Chassis Bar with Visualizer */}
          <div className="chassis-top-bar">
            <div className="active-chord-indicator">
              <span className="chord-indicator-label">ACTIVE CHORD VOICING</span>
              <div className="chord-indicator-name">
                {selectedChord || 'Free Fretboard'}
              </div>
            </div>

            <SoundVisualizer synth={synth} />
          </div>

          {/* Fully Interactive 12-Fret Fretboard & Strumming Zone */}
          <Fretboard
            strings={currentStrings}
            onPluckFret={handlePluckFret}
            activeFretPlucks={activeFretPlucks}
            activeChordFingerings={activeFingerings}
            showNoteNames={showNoteNames}
          />

          {/* Categorized Chord Matrix & Rhythm Jam Progressions */}
          <ChordBar
            onStrumChord={handleStrumChord}
            activeChord={activeChord}
            selectedChord={selectedChord}
            onSelectChordFingering={handleSelectChordFingering}
          />
        </div>

        {/* Tactile Keyboard Guide */}
        <footer className="footer-guide">
          <div className="guide-item">
            <kbd>1</kbd>&ndash;<kbd>6</kbd>
            <span>Pluck Fretted Strings</span>
          </div>
          <div className="guide-item">
            <kbd>C</kbd> <kbd>D</kbd> <kbd>E</kbd> <kbd>F</kbd> <kbd>G</kbd> <kbd>A</kbd> <kbd>B</kbd>
            <span>Instant Major Chords</span>
          </div>
          <div className="guide-item">
            <span className="tip-highlight">Fretboard Tip:</span>
            <span>Click any fret on any string to play custom notes & solos!</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
