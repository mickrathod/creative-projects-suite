import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GuitarSynth, TUNINGS, CHORDS } from './audio/guitar-synth';
import { Fretboard } from './components/Fretboard/Fretboard';
import { ChordBar } from './components/Controls/ChordBar';
import { ToneSelector } from './components/Controls/ToneSelector';
import { SongPlayer } from './components/SongBook/SongPlayer';
import { LearnAcademy } from './components/LearnAcademy/LearnAcademy';
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
  const [activeTab, setActiveTab] = useState('songbook'); // 'songbook' or 'freeplay'
  const [tuningKey, setTuningKey] = useState('standard');
  const [toneMode, setToneMode] = useState('acoustic');
  const [strumDirection, setStrumDirection] = useState('down');
  const [activeChord, setActiveChord] = useState(null);
  const [selectedChord, setSelectedChord] = useState('E minor');
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

    synth.strumChord(fretOffsets, currentStrings, strumDirection, 24);

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

      // 1-6 for strings
      if (['1', '2', '3', '4', '5', '6'].includes(key)) {
        const idx = parseInt(key, 10) - 1;
        const frets = selectedChord ? CHORDS[selectedChord] : null;
        const fret = frets && frets[idx] !== null ? frets[idx] : 0;
        handlePluckFret(idx, fret);
      }

      // Chord shortcuts
      const upper = key.toUpperCase();
      if (upper === 'E') handleStrumChord('E minor');
      else if (upper === 'A') handleStrumChord('A minor');
      else if (upper === 'D') handleStrumChord('D major');
      else if (upper === 'G') handleStrumChord('G major');
      else if (upper === 'C') handleStrumChord('C major');
      else if (upper === 'F') handleStrumChord('F major');
      else if (upper === 'B') handleStrumChord('B minor');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePluckFret, handleStrumChord, selectedChord]);

  const activeFingerings = selectedChord ? CHORDS[selectedChord] : null;

  return (
    <div className="guitar-app">
      {!isStarted && <StartOverlay onStart={handleStart} />}

      <header className="guitar-header">
        <div className="badge">AURASTRINGS PRO • ANUV JAIN ACOUSTIC EDITION</div>
        <h1 className="guitar-title">AuraStrings Virtual Guitar</h1>
        <p className="guitar-subtitle">
          Play along with <strong>Tum Mere Ho (Anuv Jain)</strong>, Husn, Baarishein & Acoustic Classics
        </p>

        {/* View Mode Switcher */}
        <div className="view-mode-tabs">
          <button
            className={`mode-tab-btn ${activeTab === 'learn' ? 'active' : ''}`}
            onClick={() => setActiveTab('learn')}
          >
            🎓 Learn Academy & Lessons
          </button>
          <button
            className={`mode-tab-btn ${activeTab === 'songbook' ? 'active' : ''}`}
            onClick={() => setActiveTab('songbook')}
          >
            🎵 Song Book (Tum Mere Ho)
          </button>
          <button
            className={`mode-tab-btn ${activeTab === 'freeplay' ? 'active' : ''}`}
            onClick={() => setActiveTab('freeplay')}
          >
            🎸 Free Play & Chords
          </button>
        </div>
      </header>

      <main className="guitar-main">
        {/* Top Controls Strip */}
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
              <span className="chord-indicator-label">CURRENT CHORD & FINGERINGS</span>
              <div className="chord-indicator-name">
                {selectedChord || 'Free Fretboard'}
              </div>
            </div>

            <SoundVisualizer synth={synth} />
          </div>

          {/* Interactive 12-Fret Fretboard & Strum Zone */}
          <Fretboard
            strings={currentStrings}
            onPluckFret={handlePluckFret}
            activeFretPlucks={activeFretPlucks}
            activeChordFingerings={activeFingerings}
            showNoteNames={showNoteNames}
          />

          {/* Tab 1: Learn Academy Mode */}
          {activeTab === 'learn' && (
            <LearnAcademy
              onStrumChord={handleStrumChord}
              onPluckFret={handlePluckFret}
              onSelectChordFingering={handleSelectChordFingering}
              currentStrings={currentStrings}
            />
          )}

          {/* Tab 2: Song Book Mode (Tum Mere Ho, Husn, etc.) */}
          {activeTab === 'songbook' && (
            <SongPlayer
              onStrumChord={handleStrumChord}
              onPluckFret={handlePluckFret}
              onSelectChordFingering={handleSelectChordFingering}
              currentStrings={currentStrings}
            />
          )}

          {/* Tab 3: Free Play Chords & Jam Progressions */}
          {activeTab === 'freeplay' && (
            <ChordBar
              onStrumChord={handleStrumChord}
              activeChord={activeChord}
              selectedChord={selectedChord}
              onSelectChordFingering={handleSelectChordFingering}
            />
          )}
        </div>

        {/* Footer Keyboard Guide */}
        <footer className="footer-guide">
          <div className="guide-item">
            <kbd>1</kbd>&ndash;<kbd>6</kbd>
            <span>Pluck Fretted Strings</span>
          </div>
          <div className="guide-item">
            <kbd>E</kbd> <kbd>B</kbd> <kbd>C</kbd> <kbd>D</kbd> <kbd>A</kbd> <kbd>G</kbd>
            <span>Tum Hi Ho Chords</span>
          </div>
          <div className="guide-item">
            <span className="tip-highlight">Karaoke Tip:</span>
            <span>Click any lyric line in the songbook to instantly jump and strum that chord!</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
