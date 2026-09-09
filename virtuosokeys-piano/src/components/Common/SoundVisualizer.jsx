import React, { useRef, useEffect } from 'react';

export const SoundVisualizer = ({ synth }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    let animId;
    const canvas = canvasRef.current;
    if (!canvas || !synth || !synth.analyser) return;
    const ctx = canvas.getContext('2d');
    const analyser = synth.analyser;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      const barCount = 36;
      const barWidth = (width / barCount) - 1.5;

      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor(Math.pow(i / barCount, 1.5) * (bufferLength / 2.5));
        const val = dataArray[dataIndex] / 255.0;
        const barHeight = Math.max(2, val * height * 0.95);
        const x = i * (barWidth + 1.5);
        const y = height - barHeight;

        const ratio = i / barCount;
        ctx.fillStyle = ratio < 0.5 ? '#f59e0b' : '#38bdf8';
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [synth]);

  return (
    <div className="piano-visualizer-box" title="Live Piano Soundboard Resonance">
      <canvas ref={canvasRef} width={220} height={32} />
    </div>
  );
};
