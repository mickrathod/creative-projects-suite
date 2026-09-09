import React from 'react';
import { PIANO_SONGS } from '../../audio/piano-songs';

export const SongPlayer = ({
  activeSongIndex,
  onSelectSong,
  isPlaying,
  onTogglePlay,
  onRestartSong,
  playbackSpeed,
  onChangePlaybackSpeed,
  waitForKeyMode,
  onToggleWaitForKey,
  currentTimeMs,
  currentLyric
}) => {
  const song = PIANO_SONGS[activeSongIndex];

  return (
    <div className="song-player-panel">
      {/* Top Header: Song Selection & Details */}
      <div className="song-player-header">
        <div className="song-meta-left">
          <span className="song-genre-badge">{song.movie}</span>
          <h3 className="song-main-title">{song.title}</h3>
          <span className="song-artist-sub">{song.artist} • {song.keySignature} • {song.tempoBpm} BPM</span>
        </div>

        {/* Dropdown Selector */}
        <div className="song-dropdown-box">
          <span className="dropdown-label">SONG REPERTOIRE:</span>
          <select
            className="song-picker-dropdown"
            value={activeSongIndex}
            onChange={(e) => onSelectSong(parseInt(e.target.value, 10))}
          >
            {PIANO_SONGS.map((s, idx) => (
              <option key={s.id} value={idx}>
                🎹 {s.title} ({s.movie})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Karaoke / Melodic Lyrics Strip */}
      <div className="karaoke-lyrics-strip">
        <div className="karaoke-text">
          {currentLyric ? (
            <span className="active-lyric">♪ {currentLyric}</span>
          ) : (
            <span className="idle-lyric">Watch the falling notes or play along with the melody!</span>
          )}
        </div>
      </div>

      {/* Playback Controls Bar */}
      <div className="song-playback-bar">
        <div className="playback-buttons">
          <button
            className={`btn-play-toggle ${isPlaying ? 'playing' : ''}`}
            onClick={onTogglePlay}
          >
            {isPlaying ? '⏸️ PAUSE SONG' : '▶️ PLAY SYNTHESIA SONG'}
          </button>

          <button
            className="btn-control-secondary"
            onClick={onRestartSong}
            title="Restart song from beginning"
          >
            ⏮️ RESTART
          </button>

          <button
            className={`btn-control-secondary ${waitForKeyMode ? 'active-practice' : ''}`}
            onClick={onToggleWaitForKey}
            title="Pause song until you strike the matching piano key"
          >
            🎯 {waitForKeyMode ? 'WAIT-FOR-KEY: ON' : 'PRACTICE MODE: OFF'}
          </button>
        </div>

        {/* Speed Adjustment */}
        <div className="speed-selector">
          <span className="speed-label">SPEED:</span>
          {[0.6, 0.8, 1.0, 1.2].map((spd) => (
            <button
              key={spd}
              className={`speed-pill ${playbackSpeed === spd ? 'active' : ''}`}
              onClick={() => onChangePlaybackSpeed(spd)}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
