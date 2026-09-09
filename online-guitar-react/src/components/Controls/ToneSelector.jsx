import React from 'react';
import { TUNINGS } from '../../audio/guitar-synth';

export const ToneSelector = ({
  toneMode,
  onToneChange,
  tuningKey,
  onTuningChange,
  strumDirection,
  onDirectionToggle,
  showNoteNames,
  onToggleNoteNames,
  volume,
  onVolumeChange
}) => {
  const tones = [
    { id: 'acoustic', label: '🌲 Dreadnought', desc: 'Warm spruce tone' },
    { id: 'warm', label: '🪵 Classical', desc: 'Deep nylon warmth' },
    { id: 'bright', label: '✨ 12-String', desc: 'Bright shimmer' },
    { id: 'overdrive', label: '⚡ Tube Amp', desc: 'Crunchy electric' }
  ];

  return (
    <div className="studio-control-strip">
      {/* Tone Mode Presets */}
      <div className="control-cell">
        <span className="control-label">Acoustic Body & Amp</span>
        <div className="tone-pill-selector">
          {tones.map((t) => (
            <button
              key={t.id}
              className={`tone-pill-btn ${toneMode === t.id ? 'active' : ''}`}
              onClick={() => onToneChange(t.id)}
              title={t.desc}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Alternate Tunings */}
      <div className="control-cell">
        <span className="control-label">Tuning Profile</span>
        <select
          className="tuning-dropdown"
          value={tuningKey}
          onChange={(e) => onTuningChange(e.target.value)}
        >
          {Object.entries(TUNINGS).map(([key, data]) => (
            <option key={key} value={key}>
              {data.name}
            </option>
          ))}
        </select>
      </div>

      {/* Strum Pick Direction */}
      <div className="control-cell">
        <span className="control-label">Pick Strum</span>
        <button
          className="direction-toggle-btn"
          onClick={onDirectionToggle}
          title="Toggle upstroke / downstroke pick angle"
        >
          {strumDirection === 'down' ? '⬇️ DOWNSTROKE' : '⬆️ UPSTROKE'}
        </button>
      </div>

      {/* Fret Note Labels Toggle */}
      <div className="control-cell">
        <span className="control-label">Fret Markers</span>
        <button
          className={`notes-toggle-btn ${showNoteNames ? 'active' : ''}`}
          onClick={onToggleNoteNames}
        >
          {showNoteNames ? '💡 NOTES: ON' : '🌑 NOTES: OFF'}
        </button>
      </div>

      {/* Master Volume */}
      <div className="control-cell volume-cell">
        <span className="control-label">Master: {Math.round(volume * 100)}%</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="volume-slider"
        />
      </div>
    </div>
  );
};
