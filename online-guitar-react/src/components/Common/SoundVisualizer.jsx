import React, { useRef, useEffect } from 'react';

export const SoundVisualizer = ({ synth }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!synth) return;

    let animId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const render = () => {
      animId = requestAnimationFrame(render);
      const data = synth.getSpectrumData();
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Draw glowing sound wave ribbon
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#f59e0b';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#d97706';

      const sliceWidth = w / (data.length / 2);
      let x = 0;

      for (let i = 0; i < data.length / 2; i++) {
        const v = data[i] / 255.0;
        const y = h - (v * (h - 6)) - 3;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      ctx.stroke();

      // Subtle warm gradient fill under wave
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, 'rgba(245, 158, 11, 0.25)');
      grad.addColorStop(1, 'rgba(245, 158, 11, 0.0)');
      ctx.fillStyle = grad;
      ctx.shadowBlur = 0;
      ctx.fill();
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [synth]);

  return (
    <div className="visualizer-container">
      <div className="visualizer-label">ACOUSTIC RESONANCE SPECTRUM</div>
      <canvas ref={canvasRef} width={340} height={42} className="visualizer-canvas" />
    </div>
  );
};
