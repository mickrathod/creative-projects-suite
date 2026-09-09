import React from 'react';
import { TUNINGS } from '../../audio/guitar-synth';

export const ToneSelector = ({
  toneMode,
  onToneChange,
  tuningKey,
  onTuningChange,
  strumDirection,
  onDirectionToggle
}) => {
  return (
    <div className="settings-bar">
      {/* Tone Presets */}
      <div className="setting-group">
        <span className="setting-label">TONE</span>
        <div className="pill-selector">
          <button
            className={`pill-btn ${toneMode === 'acoustic' ? 'active' : ''}`}
            onClick={() => onToneChange('acoustic')}
          >
            Acoustic Warm
          </button>
          <button
            className={`pill-btn ${toneMode === 'bright' ? 'active' : ''}`}
            onClick={() => onToneChange('bright')}
          >
            Bright Steel
          </button>
          <button
            className={`pill-btn ${toneMode === 'overdrive' ? 'active' : ''}`}
            onClick={() => onToneChange('overdrive')}
          >
            ⚡ Overdrive
          </button>
        </div>
      </div>

      {/* Tunings */}
      <div className="setting-group">
        <span className="setting-label">TUNING</span>
        <select
          className="tuning-select"
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

      {/* Strum Direction */}
      <div className="setting-group">
        <span className="setting-label">STRUM</span>
        <button
          className="direction-btn"
          onClick={onDirectionToggle}
          title="Toggle Downstroke / Upstroke"
        >
          {strumDirection === 'down' ? '↓ Downstroke' : '↑ Upstroke'}
        </button>
      </div>
    </div>
  );
};
