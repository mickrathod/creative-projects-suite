import React, { useState, useEffect, useRef } from 'react';
import { SONGS } from '../../audio/songs-data';

export const SongPlayer = ({
  onStrumChord,
  onPluckFret,
  onSelectChordFingering,
  currentStrings
}) => {
  const [selectedSongIndex, setSelectedSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [playMode, setPlayMode] = useState('chords'); // 'chords' or 'intro'
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  const timerRef = useRef(null);
  const activeSong = SONGS[selectedSongIndex];

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Stop playback when song changes
  const handleSelectSong = (idx) => {
    stopPlayback();
    setSelectedSongIndex(idx);
    setCurrentLineIndex(0);
    const firstChord = SONGS[idx].lines[0].chord;
    onSelectChordFingering(firstChord);
  };

  const stopPlayback = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsPlaying(false);
  };

  // Play full song chords with lyrics karaoke sync
  const startSongPlayback = () => {
    if (isPlaying) {
      stopPlayback();
      return;
    }

    setIsPlaying(true);
    let lineIdx = currentLineIndex;

    const playStep = () => {
      const line = activeSong.lines[lineIdx];
      if (!line) {
        // Loop back to start
        lineIdx = 0;
      }

      setCurrentLineIndex(lineIdx);
      onSelectChordFingering(line.chord);
      onStrumChord(line.chord);

      const duration = (line.durationMs || 3000) / playbackSpeed;
      lineIdx = (lineIdx + 1) % activeSong.lines.length;

      timerRef.current = setTimeout(playStep, duration);
    };

    playStep();
  };

  // Play iconic intro riff
  const playIntroRiff = () => {
    stopPlayback();
    const tabs = activeSong.introTabs;
    if (!tabs || tabs.length === 0) return;

    tabs.forEach((tab, i) => {
      setTimeout(() => {
        onPluckFret(tab.string, tab.fret);
      }, i * 320);
    });
  };

  // User manually strums current line and advances
  const handleManualStrumAndAdvance = () => {
    const line = activeSong.lines[currentLineIndex];
    onSelectChordFingering(line.chord);
    onStrumChord(line.chord);

    const nextIdx = (currentLineIndex + 1) % activeSong.lines.length;
    setCurrentLineIndex(nextIdx);
  };

  return (
    <div className="song-studio-card">
      <div className="song-studio-header">
        <div className="song-title-group">
          <span className="song-badge">BOLLYWOOD ACOUSTIC SONGBOOK</span>
          <h2 className="current-song-name">
            {activeSong.title}
          </h2>
          <span className="song-artist-meta">{activeSong.movie} • {activeSong.artist}</span>
        </div>

        {/* Song Selector Dropdown */}
        <div className="song-select-wrap">
          <label className="song-select-label">SELECT SONG:</label>
          <select
            className="song-picker-dropdown"
            value={selectedSongIndex}
            onChange={(e) => handleSelectSong(parseInt(e.target.value, 10))}
          >
            {SONGS.map((song, idx) => (
              <option key={song.id} value={idx}>
                {song.title} ({song.movie})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Karaoke Lyrics & Active Chord Prompter */}
      <div className="lyrics-karaoke-stage">
        <div className="lyrics-display-track">
          {activeSong.lines.map((line, idx) => {
            const isCurrent = currentLineIndex === idx;
            const isPast = idx < currentLineIndex;

            return (
              <div
                key={idx}
                className={`lyric-row ${isCurrent ? 'active-singing' : ''} ${isPast ? 'past-line' : ''}`}
                onClick={() => {
                  setCurrentLineIndex(idx);
                  onSelectChordFingering(line.chord);
                  onStrumChord(line.chord);
                }}
              >
                <div className="line-chord-badge">
                  {line.chord.replace(' major', '').replace(' minor', 'm')}
                </div>
                <div className="line-text">{line.lyric}</div>
                {isCurrent && <div className="now-playing-wave">♪ NOW PLAYING</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Playback Controls & Strum Assistant */}
      <div className="song-controls-bar">
        <div className="song-buttons-left">
          <button
            className={`btn-play-song ${isPlaying ? 'playing' : ''}`}
            onClick={startSongPlayback}
          >
            {isPlaying ? '⏸️ PAUSE SONG' : '▶️ AUTO-PLAY SONG & LYRICS'}
          </button>

          <button
            className="btn-intro-riff"
            onClick={playIntroRiff}
            title="Play acoustic intro lead tab"
          >
            🎸 PLAY INTRO TAB RIFF
          </button>

          <button
            className="btn-manual-advance"
            onClick={handleManualStrumAndAdvance}
            title="Strum this chord and jump to next lyric"
          >
            👆 STRUM & NEXT LINE
          </button>
        </div>

        {/* Speed / Strum Pattern Telemetry */}
        <div className="song-telemetry">
          <div className="pattern-badge">
            <span className="tel-label">STRUM PATTERN:</span>
            <span className="tel-val">{activeSong.strumPattern}</span>
          </div>

          <div className="speed-pills">
            <span className="tel-label">SPEED:</span>
            {[0.8, 1.0, 1.2].map((spd) => (
              <button
                key={spd}
                className={`speed-btn ${playbackSpeed === spd ? 'active' : ''}`}
                onClick={() => setPlaybackSpeed(spd)}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
