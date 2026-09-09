import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PianoSynth, KEYBOARD_KEY_MAP } from './audio/piano-synth';
import { PIANO_SONGS } from './audio/piano-songs';
import { PianoKeyboard } from './components/Keyboard/PianoKeyboard';
import { FallingNotesCanvas } from './components/FallingNotes/FallingNotesCanvas';
import { SongPlayer } from './components/SongBook/SongPlayer';
import { PianoAcademy } from './components/Academy/PianoAcademy';
import { StudioControls } from './components/Controls/StudioControls';
import { SoundVisualizer } from './components/Common/SoundVisualizer';
import { StartOverlay } from './components/Common/StartOverlay';
import './App.css';

export function App() {
  const synthRef = useRef(null);
  if (!synthRef.current) {
    synthRef.current = new PianoSynth();
  }
  const synth = synthRef.current;

  // App UI State
  const [isStarted, setIsStarted] = useState(false);
  const [activeTab, setActiveTab] = useState('songbook'); // 'songbook', 'academy', 'freeplay'
  const [startOctave, setStartOctave] = useState(3); // C3 to B5
  const [labelsMode, setLabelsMode] = useState('notes'); // 'notes', 'keys', 'sargam', 'none'
  const [sustainPedal, setSustainPedal] = useState(false);
  const [preset, setPreset] = useState('grand');
  const [volume, setVolume] = useState(0.85);
  const [isMidiConnected, setIsMidiConnected] = useState(false);

  // Active Keys (pressed set)
  const [activePressedMidi, setActivePressedMidi] = useState(new Set());

  // Song Book State
  const [activeSongIndex, setActiveSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeMs, setCurrentTimeMs] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [waitForKeyMode, setWaitForKeyMode] = useState(false);
  const [currentLyric, setCurrentLyric] = useState('');

  const activeSong = PIANO_SONGS[activeSongIndex];
  const lastTimeRef = useRef(null);
  const playTimerRef = useRef(null);
  const playedNotesRef = useRef(new Set());

  const handleStart = () => {
    synth.ensureContext();
    setIsStarted(true);
  };

  // Note Trigger Handlers
  const handleStartNote = useCallback((midi, velocity = 0.85) => {
    synth.startNote(midi, velocity);
    setActivePressedMidi((prev) => new Set([...prev, midi]));
  }, [synth]);

  const handleStopNote = useCallback((midi) => {
    synth.stopNote(midi);
    setActivePressedMidi((prev) => {
      const next = new Set(prev);
      next.delete(midi);
      return next;
    });
  }, [synth]);

  // Sustain Pedal Toggle
  const handleToggleSustain = useCallback(() => {
    setSustainPedal((prev) => {
      const next = !prev;
      synth.setSustainPedal(next);
      return next;
    });
  }, [synth]);

  // Tone preset
  const handlePresetChange = (p) => {
    setPreset(p);
    synth.setPreset(p);
  };

  // Master volume
  const handleVolumeChange = (v) => {
    setVolume(v);
    synth.setMasterVolume(v);
  };

  // Song Control: Toggle Play
  const handleTogglePlaySong = () => {
    if (isPlaying) {
      setIsPlaying(false);
      lastTimeRef.current = null;
    } else {
      synth.ensureContext();
      setIsPlaying(true);
      lastTimeRef.current = performance.now();
    }
  };

  // Restart Song
  const handleRestartSong = () => {
    setCurrentTimeMs(0);
    playedNotesRef.current.clear();
    setCurrentLyric('');
  };

  // Select Song
  const handleSelectSong = (idx) => {
    setIsPlaying(false);
    setActiveSongIndex(idx);
    setCurrentTimeMs(0);
    playedNotesRef.current.clear();
    setCurrentLyric('');
  };

  // Seek Time on canvas click
  const handleSeekTime = (timeMs) => {
    setCurrentTimeMs(timeMs);
    playedNotesRef.current.clear();
  };

  // Song Playback Loop
  useEffect(() => {
    if (!isPlaying) return;

    let frameId;
    const loop = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      setCurrentTimeMs((prevTime) => {
        const nextTime = prevTime + delta * playbackSpeed;
        const songDuration = activeSong.notes[activeSong.notes.length - 1].timeMs + 2500;

        if (nextTime > songDuration) {
          // Loop song back to beginning
          playedNotesRef.current.clear();
          return 0;
        }

        // Trigger notes whose time has arrived
        activeSong.notes.forEach((note, noteIdx) => {
          if (!playedNotesRef.current.has(noteIdx) && prevTime <= note.timeMs && nextTime >= note.timeMs) {
            playedNotesRef.current.add(noteIdx);
            handleStartNote(note.midi, note.hand === 'left' ? 0.75 : 0.9);

            if (note.lyric) {
              setCurrentLyric(note.lyric);
            }

            // Schedule release
            setTimeout(() => {
              handleStopNote(note.midi);
            }, (note.durationMs || 350) / playbackSpeed);
          }
        });

        return nextTime;
      });

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, playbackSpeed, activeSong, handleStartNote, handleStopNote]);

  // Physical Computer Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

      // Spacebar for sustain
      if (e.code === 'Space') {
        e.preventDefault();
        synth.setSustainPedal(true);
        setSustainPedal(true);
        return;
      }

      const key = e.key.toLowerCase();
      if (KEYBOARD_KEY_MAP[key] !== undefined && !e.repeat) {
        const midi = KEYBOARD_KEY_MAP[key];
        handleStartNote(midi, 0.9);
      }
    };

    const handleKeyUp = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

      if (e.code === 'Space') {
        synth.setSustainPedal(false);
        setSustainPedal(false);
        return;
      }

      const key = e.key.toLowerCase();
      if (KEYBOARD_KEY_MAP[key] !== undefined) {
        const midi = KEYBOARD_KEY_MAP[key];
        handleStopNote(midi);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [synth, handleStartNote, handleStopNote]);

  // Web MIDI Listener
  useEffect(() => {
    const unsubscribe = synth.onMIDIEvent((type, midi, velocity) => {
      setIsMidiConnected(true);
      if (type === 'noteon') {
        setActivePressedMidi((prev) => new Set([...prev, midi]));
      } else if (type === 'noteoff') {
        setActivePressedMidi((prev) => {
          const next = new Set(prev);
          next.delete(midi);
          return next;
        });
      } else if (type === 'sustain') {
        setSustainPedal(velocity);
      }
    });

    return () => unsubscribe();
  }, [synth]);

  // Highlight Midi helper for academy
  const handleHighlightMidis = (midis) => {
    midis.forEach((m) => {
      setActivePressedMidi((prev) => new Set([...prev, m]));
      setTimeout(() => {
        setActivePressedMidi((prev) => {
          const next = new Set(prev);
          next.delete(m);
          return next;
        });
      }, 750);
    });
  };

  const handlePlayMidis = (midis) => {
    midis.forEach((m) => {
      handleStartNote(m, 0.85);
      setTimeout(() => {
        handleStopNote(m);
      }, 550);
    });
  };

  return (
    <div className="piano-app-root">
      {!isStarted && <StartOverlay onStart={handleStart} />}

      {/* Main Header */}
      <header className="piano-header">
        <div className="piano-brand-badge">STEINWAY & SONS CONCERT HARMONY MODEL</div>
        <h1 className="piano-title">VirtuosoKeys Piano Academy</h1>
        <p className="piano-subtitle">
          Play along with <strong>Tum Hi Ho</strong>, <strong>Tum Mere Ho</strong>, Kal Ho Naa Ho & Master Real Piano
        </p>

        {/* View Mode Switcher */}
        <div className="view-mode-tabs">
          <button
            className={`mode-tab-btn ${activeTab === 'songbook' ? 'active' : ''}`}
            onClick={() => setActiveTab('songbook')}
          >
            🎼 Synthesia Song Book (Tum Hi Ho & Tum Mere Ho)
          </button>
          <button
            className={`mode-tab-btn ${activeTab === 'academy' ? 'active' : ''}`}
            onClick={() => setActiveTab('academy')}
          >
            🎓 Piano Academy & Lessons
          </button>
          <button
            className={`mode-tab-btn ${activeTab === 'freeplay' ? 'active' : ''}`}
            onClick={() => setActiveTab('freeplay')}
          >
            🎹 Free Concert Grand & MIDI
          </button>
        </div>
      </header>

      {/* Studio Controls Strip */}
      <StudioControls
        sustainPedal={sustainPedal}
        onToggleSustain={handleToggleSustain}
        preset={preset}
        onPresetChange={handlePresetChange}
        labelsMode={labelsMode}
        onLabelsModeChange={setLabelsMode}
        volume={volume}
        onVolumeChange={handleVolumeChange}
        isMidiConnected={isMidiConnected}
      />

      {/* Piano Grand Console Chassis */}
      <main className="piano-console-chassis">
        {/* Chassis Top Bar: Spectrum Visualizer & Metronome */}
        <div className="console-hud-bar">
          <div className="active-key-readout">
            <span className="hud-label">ACTIVE RESONANCE:</span>
            <span className="hud-value">
              {activePressedMidi.size > 0
                ? Array.from(activePressedMidi).map((m) => `MIDI ${m}`).join(', ')
                : 'Grand Soundboard Idle'}
            </span>
          </div>

          <SoundVisualizer synth={synth} />
        </div>

        {/* Mode 1: Synthesia Falling Notes Screen */}
        {activeTab === 'songbook' && (
          <div className="synthesia-stage">
            <FallingNotesCanvas
              song={activeSong}
              currentTimeMs={currentTimeMs}
              isPlaying={isPlaying}
              activeVisibleMidiRange={{
                startMidi: (startOctave + 1) * 12,
                endMidi: (startOctave + 1) * 12 + 35
              }}
              onSeekTime={handleSeekTime}
            />

            <SongPlayer
              activeSongIndex={activeSongIndex}
              onSelectSong={handleSelectSong}
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlaySong}
              onRestartSong={handleRestartSong}
              playbackSpeed={playbackSpeed}
              onChangePlaybackSpeed={setPlaybackSpeed}
              waitForKeyMode={waitForKeyMode}
              onToggleWaitForKey={() => setWaitForKeyMode(!waitForKeyMode)}
              currentTimeMs={currentTimeMs}
              currentLyric={currentLyric}
            />
          </div>
        )}

        {/* Interactive 3D Grand Piano Keyboard Bed */}
        <PianoKeyboard
          onStartNote={handleStartNote}
          onStopNote={handleStopNote}
          activePressedMidi={activePressedMidi}
          startOctave={startOctave}
          octaveCount={3}
          showLabels={labelsMode}
          onShiftOctave={setStartOctave}
        />

        {/* Mode 2: Piano Academy Interactive Lessons */}
        {activeTab === 'academy' && (
          <PianoAcademy
            onPlayMidis={handlePlayMidis}
            onHighlightMidis={handleHighlightMidis}
          />
        )}
      </main>

      {/* Footer Info */}
      <footer className="piano-footer">
        <div className="footer-guide-row">
          <div className="guide-chip">
            <kbd>A</kbd>&ndash;<kbd>L</kbd> <span>White Keys (C4 to D5)</span>
          </div>
          <div className="guide-chip">
            <kbd>W</kbd>, <kbd>E</kbd>, <kbd>T</kbd>, <kbd>Y</kbd>, <kbd>U</kbd>, <kbd>O</kbd> <span>Black Accidentals</span>
          </div>
          <div className="guide-chip">
            <kbd>SPACE</kbd> <span>Sustain Damper Pedal</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
