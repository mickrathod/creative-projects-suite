import React, { useState } from 'react';
import { getNoteFromMidi } from '../../audio/guitar-synth';

export const Fretboard = ({
  strings,
  onPluckFret,
  activeFretPlucks = {}, // { stringIdx: fretNum }
  activeChordFingerings = null, // array of 6 frets e.g. [0, 2, 2, 1, 0, 0]
  showNoteNames = true
}) => {
  const [hoveredNote, setHoveredNote] = useState(null);

  // String thicknesses from Low E down to High E
  const thicknesses = [3.8, 3.2, 2.5, 2.0, 1.6, 1.2];
  const stringColors = [
    '#d4af37', // Low E (Bronze wound)
    '#d4af37', // A (Bronze wound)
    '#c8963e', // D (Bronze wound)
    '#bfa15f', // G (Light bronze)
    '#e5e7eb', // B (Steel)
    '#f3f4f6'  // High E (Steel)
  ];

  const fretWidths = [
    68, 65, 62, 59, 56, 53, 50, 48, 45, 43, 41, 39
  ];

  return (
    <div className="guitar-neck-assembly">
      {/* Headstock / Nut Zone */}
      <div className="guitar-nut-block">
        <div className="nut-label">NUT</div>
        {strings.map((str, idx) => {
          const isOpenPlucked = activeFretPlucks[idx] === 0;
          return (
            <button
              key={`open-${idx}`}
              className={`open-string-btn ${isOpenPlucked ? 'plucked' : ''}`}
              onClick={() => onPluckFret(idx, 0)}
              title={`Play open string ${str.note}`}
            >
              <span className="open-note-badge">{str.note}</span>
              <span className="key-hint">[{str.key}]</span>
            </button>
          );
        })}
      </div>

      {/* Main Fretboard Grid (12 Frets) */}
      <div className="fretboard-wood">
        {/* Fret Inlay Markers (Pearloid dots at 3, 5, 7, 9, 12) */}
        <div className="fret-inlay-layer">
          {fretWidths.map((w, fretIdx) => {
            const fretNum = fretIdx + 1;
            const hasSingleDot = [3, 5, 7, 9].includes(fretNum);
            const hasDoubleDot = fretNum === 12;

            return (
              <div
                key={`inlay-${fretNum}`}
                className="fret-column"
                style={{ width: `${w}px` }}
              >
                <div className="fret-wire" />
                <div className="fret-number-marker">{fretNum}</div>
                {hasSingleDot && <div className="inlay-dot single" />}
                {hasDoubleDot && (
                  <div className="double-inlay-wrap">
                    <div className="inlay-dot double" />
                    <div className="inlay-dot double" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 6 Horizontal Strings Layer */}
        <div className="fret-strings-layer">
          {strings.map((str, stringIdx) => {
            const isVibrating = activeFretPlucks[stringIdx] !== undefined;

            return (
              <div
                key={`string-row-${stringIdx}`}
                className={`fret-string-row ${isVibrating ? 'string-vibrating' : ''}`}
              >
                {/* Physical metal wire visual */}
                <div
                  className="string-metal-line"
                  style={{
                    height: `${thicknesses[stringIdx]}px`,
                    backgroundColor: stringColors[stringIdx],
                    boxShadow: isVibrating
                      ? `0 0 10px 1px ${stringColors[stringIdx]}, 0 0 16px rgba(245, 158, 11, 0.8)`
                      : '0 1px 2px rgba(0,0,0,0.8)'
                  }}
                />

                {/* 12 Clickable Fret Blocks on this string */}
                <div className="fret-cell-row">
                  {fretWidths.map((w, fretIdx) => {
                    const fretNum = fretIdx + 1;
                    const noteInfo = getNoteFromMidi(str.midi, fretNum);
                    const isFrettedPluck = activeFretPlucks[stringIdx] === fretNum;
                    const isChordFinger =
                      activeChordFingerings &&
                      activeChordFingerings[stringIdx] === fretNum;

                    return (
                      <button
                        key={`cell-${stringIdx}-${fretNum}`}
                        className={`fret-cell ${isFrettedPluck ? 'active-pluck' : ''} ${isChordFinger ? 'chord-finger' : ''}`}
                        style={{ width: `${w}px` }}
                        onClick={() => onPluckFret(stringIdx, fretNum)}
                        onMouseEnter={() =>
                          setHoveredNote({
                            string: str.note,
                            fret: fretNum,
                            note: noteInfo.full
                          })
                        }
                        onMouseLeave={() => setHoveredNote(null)}
                        title={`String ${str.note}, Fret ${fretNum}: ${noteInfo.full}`}
                      >
                        {isChordFinger && (
                          <div className="chord-finger-dot">
                            <span>{noteInfo.name}</span>
                          </div>
                        )}

                        {showNoteNames && !isChordFinger && (
                          <span className="subtle-note-label">
                            {noteInfo.name}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Acoustic Soundhole & Strum Pick Pad */}
      <div className="guitar-soundhole-zone">
        <div className="soundhole-rosette">
          <div className="rosette-outer-ring" />
          <div className="rosette-inner-cavity">
            <span className="soundhole-label">STRUM ZONE</span>
          </div>
        </div>

        {/* Strum Strings that run over the soundhole */}
        <div className="soundhole-strings">
          {strings.map((str, idx) => {
            const isVibrating = activeFretPlucks[idx] !== undefined;
            return (
              <div
                key={`soundhole-str-${idx}`}
                className={`soundhole-string-strip ${isVibrating ? 'active-strummed' : ''}`}
                onMouseEnter={() => onPluckFret(idx, activeChordFingerings ? (activeChordFingerings[idx] ?? 0) : 0)}
                onTouchStart={() => onPluckFret(idx, activeChordFingerings ? (activeChordFingerings[idx] ?? 0) : 0)}
              >
                <div
                  className="soundhole-wire"
                  style={{
                    height: `${thicknesses[idx] + 0.5}px`,
                    backgroundColor: stringColors[idx]
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
