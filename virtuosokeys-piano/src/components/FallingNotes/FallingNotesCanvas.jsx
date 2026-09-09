import React, { useRef, useEffect } from 'react';
import { ALL_PIANO_KEYS } from '../../audio/piano-synth';

export const FallingNotesCanvas = ({
  song,
  currentTimeMs,
  isPlaying,
  activeVisibleMidiRange = { startMidi: 48, endMidi: 84 }, // default C3 to C6 view
  onSeekTime
}) => {
  const canvasRef = useRef(null);

  // Time window visible on screen (e.g. 2.8 seconds of upcoming notes)
  const VISIBLE_TIME_WINDOW_MS = 2800;

  useEffect(() => {
    let animId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Background subtle gradient and guide grid
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#06080e');
      bgGrad.addColorStop(1, '#0e121e');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Key lane guidelines for visible white and black keys
      const visibleKeys = ALL_PIANO_KEYS.filter(
        (k) => k.midi >= activeVisibleMidiRange.startMidi && k.midi <= activeVisibleMidiRange.endMidi
      );
      const whiteKeys = visibleKeys.filter((k) => !k.isBlack);
      const keyWidth = width / whiteKeys.length;

      // Draw vertical lane dividers
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.lineWidth = 1;
      whiteKeys.forEach((_, idx) => {
        const x = idx * keyWidth;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      });

      // Strike line at the very bottom (where keys meet canvas)
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, height - 2);
      ctx.lineTo(width, height - 2);
      ctx.stroke();

      if (!song || !song.notes) {
        animId = requestAnimationFrame(render);
        return;
      }

      // Map MIDI note to X coordinate
      const getNoteXAndWidth = (midi) => {
        const key = ALL_PIANO_KEYS.find((k) => k.midi === midi);
        if (!key) return null;

        if (!key.isBlack) {
          const wIdx = whiteKeys.findIndex((k) => k.midi === midi);
          if (wIdx === -1) return null;
          return { x: wIdx * keyWidth + 2, w: keyWidth - 4 };
        } else {
          // Black key is between two white keys
          const prevWhite = whiteKeys.filter((k) => k.midi < midi).pop();
          if (!prevWhite) return null;
          const prevIdx = whiteKeys.findIndex((k) => k.midi === prevWhite.midi);
          const bw = keyWidth * 0.65;
          const bx = (prevIdx + 1) * keyWidth - (bw / 2);
          return { x: bx, w: bw };
        }
      };

      // Draw all falling note blocks
      song.notes.forEach((note) => {
        const timeDiff = note.timeMs - currentTimeMs;
        const noteEndDiff = timeDiff + (note.durationMs || 300);

        // Check if note is inside the visible vertical time window
        if (noteEndDiff > -200 && timeDiff < VISIBLE_TIME_WINDOW_MS) {
          const pos = getNoteXAndWidth(note.midi);
          if (!pos) return;

          // Compute Y positions
          // Bottom of note lands on (height - 2) when note.timeMs === currentTimeMs
          const yBottom = height - 2 - (timeDiff / VISIBLE_TIME_WINDOW_MS) * height;
          const noteHeight = Math.max(14, ((note.durationMs || 300) / VISIBLE_TIME_WINDOW_MS) * height);
          const yTop = yBottom - noteHeight;

          // Color based on Hand
          const isRightHand = note.hand === 'right';
          const primaryColor = isRightHand ? '#f59e0b' : '#00f0ff';
          const secondaryColor = isRightHand ? '#d97706' : '#0284c7';

          // Glow shadow
          ctx.save();
          ctx.shadowColor = primaryColor;
          ctx.shadowBlur = Math.abs(timeDiff) < 60 ? 16 : 6;

          // Gradient fill
          const grad = ctx.createLinearGradient(pos.x, yTop, pos.x + pos.w, yBottom);
          grad.addColorStop(0, primaryColor);
          grad.addColorStop(1, secondaryColor);
          ctx.fillStyle = grad;

          // Rounded rectangle
          const radius = 5;
          ctx.beginPath();
          ctx.roundRect(pos.x, yTop, pos.w, noteHeight, radius);
          ctx.fill();

          // Border outline
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Note text label
          if (noteHeight > 24) {
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(note.label || '', pos.x + pos.w / 2, yBottom - 6);
          }

          // Lyrics label floating on the right side if present
          if (note.lyric && Math.abs(timeDiff) < 400) {
            ctx.fillStyle = '#fde68a';
            ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, sans-serif';
            ctx.fillText(`♪ ${note.lyric}`, pos.x + pos.w / 2, Math.max(20, yTop - 8));
          }

          ctx.restore();
        }
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [song, currentTimeMs, activeVisibleMidiRange]);

  return (
    <div className="falling-notes-container" title="Click or scrub to jump in song">
      <canvas
        ref={canvasRef}
        width={1000}
        height={220}
        className="falling-notes-canvas"
        onClick={(e) => {
          if (!song || !onSeekTime) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const ratio = clickX / rect.width;
          const maxTime = song.notes[song.notes.length - 1].timeMs + 2000;
          onSeekTime(ratio * maxTime);
        }}
      />
      <div className="falling-notes-hud">
        <span className="hud-badge right-hand">🎵 Amber: Right Hand Melody</span>
        <span className="hud-badge left-hand">🎹 Cyan: Left Hand Harmony</span>
      </div>
    </div>
  );
};
