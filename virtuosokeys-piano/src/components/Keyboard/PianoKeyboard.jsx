import React, { useState } from 'react';
import { ALL_PIANO_KEYS, KEYBOARD_KEY_MAP } from '../../audio/piano-synth';

export const PianoKeyboard = ({
  onStartNote,
  onStopNote,
  activePressedMidi = new Set(), // active pressed keys
  startOctave = 3, // starting octave for 3-octave view (e.g. 3 = C3 to B5)
  octaveCount = 3, // 3 octaves = 36 notes
  showLabels = 'notes', // 'notes', 'keys', 'sargam', 'none'
  onShiftOctave
}) => {
  const [isMouseDown, setIsMouseDown] = useState(false);

  // Compute active visible keys (from startOctave to startOctave + octaveCount)
  const startMidi = (startOctave + 1) * 12; // C3 is MIDI 48
  const endMidi = startMidi + octaveCount * 12 - 1; // B5 is MIDI 83

  const visibleKeys = ALL_PIANO_KEYS.filter((k) => k.midi >= startMidi && k.midi <= endMidi);
  const whiteKeys = visibleKeys.filter((k) => !k.isBlack);

  // Inverse mapping of MIDI to computer keyboard key
  const midiToKeyChar = {};
  Object.entries(KEYBOARD_KEY_MAP).forEach(([char, midi]) => {
    midiToKeyChar[midi] = char.toUpperCase();
  });

  const handleKeyMouseDown = (midi) => {
    setIsMouseDown(true);
    onStartNote(midi, 0.9);
  };

  const handleKeyMouseEnter = (midi) => {
    if (isMouseDown) {
      onStartNote(midi, 0.85);
    }
  };

  const handleKeyMouseUp = (midi) => {
    onStopNote(midi);
  };

  const handleKeyMouseLeave = (midi) => {
    if (isMouseDown) {
      onStopNote(midi);
    }
  };

  return (
    <div
      className="piano-keyboard-chassis"
      onMouseUp={() => setIsMouseDown(false)}
      onMouseLeave={() => setIsMouseDown(false)}
    >
      {/* Octave Shift Strip */}
      <div className="keyboard-octave-bar">
        <div className="octave-controls-left">
          <button
            className="btn-octave"
            disabled={startOctave <= 1}
            onClick={() => onShiftOctave(startOctave - 1)}
            title="Shift down 1 octave to deeper bass"
          >
            ◀ Octave Down (C{startOctave - 1})
          </button>
          <span className="current-octave-badge">
            VIEW: Octaves C{startOctave} – B{startOctave + octaveCount - 1}
          </span>
          <button
            className="btn-octave"
            disabled={startOctave >= 5}
            onClick={() => onShiftOctave(startOctave + 1)}
            title="Shift up 1 octave to higher treble"
          >
            Octave Up (C{startOctave + 1}) ▶
          </button>
        </div>

        <div className="keyboard-guide-tip">
          <span>💡 Tip: Press keys <strong>A, S, D, F, G, H, J, K, L</strong> on your keyboard to play!</span>
        </div>
      </div>

      {/* Main Piano Bed */}
      <div className="piano-keys-bed">
        {/* White Keys Layer */}
        <div className="white-keys-layer">
          {whiteKeys.map((key) => {
            const isPressed = activePressedMidi.has(key.midi);
            const keyChar = midiToKeyChar[key.midi];

            return (
              <div
                key={`white-${key.midi}`}
                className={`piano-key white-key ${isPressed ? 'pressed active-white' : ''}`}
                onMouseDown={() => handleKeyMouseDown(key.midi)}
                onMouseEnter={() => handleKeyMouseEnter(key.midi)}
                onMouseUp={() => handleKeyMouseUp(key.midi)}
                onMouseLeave={() => handleKeyMouseLeave(key.midi)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleKeyMouseDown(key.midi);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleKeyMouseUp(key.midi);
                }}
              >
                <div className="key-bottom-label">
                  {showLabels === 'notes' && <span className="note-text">{key.name}</span>}
                  {showLabels === 'keys' && keyChar && <span className="key-char-badge">{keyChar}</span>}
                  {showLabels === 'sargam' && <span className="sargam-text">{key.sargam}</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Black Keys Layer */}
        <div className="black-keys-layer">
          {whiteKeys.map((wKey, wIdx) => {
            // Check if there is a black key directly following this white key
            const nextMidi = wKey.midi + 1;
            const blackKey = visibleKeys.find((k) => k.midi === nextMidi && k.isBlack);
            if (!blackKey) return null;

            const isPressed = activePressedMidi.has(blackKey.midi);
            const keyChar = midiToKeyChar[blackKey.midi];
            const whiteKeyWidthPercent = 100 / whiteKeys.length;
            const leftPercent = (wIdx + 1) * whiteKeyWidthPercent - (whiteKeyWidthPercent * 0.32);

            return (
              <div
                key={`black-${blackKey.midi}`}
                className={`piano-key black-key ${isPressed ? 'pressed active-black' : ''}`}
                style={{
                  left: `${leftPercent}%`,
                  width: `${whiteKeyWidthPercent * 0.64}%`
                }}
                onMouseDown={() => handleKeyMouseDown(blackKey.midi)}
                onMouseEnter={() => handleKeyMouseEnter(blackKey.midi)}
                onMouseUp={() => handleKeyMouseUp(blackKey.midi)}
                onMouseLeave={() => handleKeyMouseLeave(blackKey.midi)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleKeyMouseDown(blackKey.midi);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleKeyMouseUp(blackKey.midi);
                }}
              >
                <div className="black-key-top-shine" />
                <div className="key-bottom-label">
                  {showLabels === 'notes' && <span className="black-note-text">{blackKey.name}</span>}
                  {showLabels === 'keys' && keyChar && <span className="black-key-char-badge">{keyChar}</span>}
                  {showLabels === 'sargam' && <span className="black-sargam-text">{blackKey.sargam}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
