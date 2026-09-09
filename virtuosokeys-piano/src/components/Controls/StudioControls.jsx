import React from 'react';

export const StudioControls = ({
  sustainPedal,
  onToggleSustain,
  preset,
  onPresetChange,
  labelsMode,
  onLabelsModeChange,
  volume,
  onVolumeChange,
  isMidiConnected
}) => {
  return (
    <div className="studio-controls-bar">
      {/* Sound Preset Selector */}
      <div className="control-group">
        <span className="control-label">PIANO TONE:</span>
        <div className="pill-selector">
          {[
            { id: 'grand', label: 'Concert Grand' },
            { id: 'bright', label: 'Bright Pop' },
            { id: 'electric', label: 'Rhodes EPiano' },
            { id: 'ethereal', label: 'Ambient Shimmer' }
          ].map((p) => (
            <button
              key={p.id}
              className={`pill-btn ${preset === p.id ? 'active' : ''}`}
              onClick={() => onPresetChange(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sustain Damper Pedal */}
      <div className="control-group">
        <button
          className={`btn-sustain-pedal ${sustainPedal ? 'pedal-down' : ''}`}
          onClick={onToggleSustain}
          title="Hold Spacebar or Click to toggle damper sustain"
        >
          <span className="pedal-icon">🦶</span>
          <span className="pedal-text">{sustainPedal ? 'SUSTAIN PEDAL: ON' : 'SUSTAIN PEDAL: OFF'}</span>
          <span className="pedal-shortcut">[SPACE]</span>
        </button>
      </div>

      {/* Key Labels Mode */}
      <div className="control-group">
        <span className="control-label">KEY LABELS:</span>
        <select
          className="control-select"
          value={labelsMode}
          onChange={(e) => onLabelsModeChange(e.target.value)}
        >
          <option value="notes">Note Names (C4, D4...)</option>
          <option value="keys">Computer Keys (A, S, D, F...)</option>
          <option value="sargam">Indian Sargam (Sa, Re, Ga...)</option>
          <option value="none">Blank Real Piano</option>
        </select>
      </div>

      {/* Master Volume */}
      <div className="control-group volume-group">
        <span className="control-label">VOLUME: {Math.round(volume * 100)}%</span>
        <input
          type="range"
          min="0"
          max="1.2"
          step="0.05"
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="volume-slider"
        />
      </div>

      {/* MIDI Status Indicator */}
      <div className="control-group midi-indicator">
        <span className={`midi-dot ${isMidiConnected ? 'connected' : ''}`} />
        <span className="midi-text">
          {isMidiConnected ? '🎹 USB MIDI CONNECTED' : '🔌 USB MIDI READY'}
        </span>
      </div>
    </div>
  );
};
