import React, { useRef } from 'react';
import { GuitarString } from './GuitarString';

export const Fretboard = ({
  strings,
  onPluckString,
  activePluckIndices = []
}) => {
  const fretboardRef = useRef(null);

  // String thicknesses from Low E (3.8px) down to High E (1.4px)
  const thicknesses = [3.8, 3.2, 2.6, 2.1, 1.7, 1.3];

  // Touch drag strumming across fretboard
  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const elem = document.elementFromPoint(touch.clientX, touch.clientY);
    if (elem) {
      const track = elem.closest('.string-track');
      if (track && track.parentElement) {
        const rows = Array.from(track.parentElement.parentElement.children);
        const idx = rows.indexOf(track.parentElement);
        if (idx !== -1) {
          onPluckString(idx);
        }
      }
    }
  };

  return (
    <div
      className="fretboard"
      ref={fretboardRef}
      onTouchMove={handleTouchMove}
    >
      {/* Decorative Fret Lines & Inlay Dots */}
      <div className="fret-markers">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="fret-line">
            {[2, 4, 6, 8].includes(i) && <span className="fret-dot" />}
            {i === 11 && (
              <>
                <span className="fret-dot double-dot-top" />
                <span className="fret-dot double-dot-bottom" />
              </>
            )}
          </div>
        ))}
      </div>

      {/* 6 Guitar Strings */}
      <div className="strings">
        {strings.map((str, idx) => (
          <GuitarString
            key={`${str.note}-${idx}`}
            index={idx}
            stringData={str}
            thickness={thicknesses[idx] || 2}
            onPluck={onPluckString}
            isPluckedExternal={activePluckIndices.includes(idx)}
          />
        ))}
      </div>
    </div>
  );
};
