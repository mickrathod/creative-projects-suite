import React, { useState, useEffect } from 'react';

export const GuitarString = ({
  index,
  stringData,
  thickness,
  onPluck,
  isPluckedExternal
}) => {
  const [isPlucked, setIsPlucked] = useState(false);

  useEffect(() => {
    if (isPluckedExternal) {
      setIsPlucked(true);
      const timer = setTimeout(() => setIsPlucked(false), 350);
      return () => clearTimeout(timer);
    }
  }, [isPluckedExternal]);

  const handleTrigger = () => {
    setIsPlucked(true);
    onPluck(index);
    setTimeout(() => setIsPlucked(false), 350);
  };

  return (
    <div className="string-row">
      <span className="string-label">{stringData.note}</span>

      <div
        className="string-track"
        onMouseEnter={(e) => {
          // If mouse button is pressed while hovering over string, pluck it!
          if (e.buttons === 1) handleTrigger();
        }}
        onMouseDown={handleTrigger}
        onTouchStart={handleTrigger}
        title={`String ${index + 1} (${stringData.note}) [Key: ${stringData.key}]`}
      >
        <div
          className={`string-line ${isPlucked ? 'plucked' : ''}`}
          style={{ height: `${thickness}px` }}
        />
      </div>

      <span className="key-hint">{stringData.key}</span>
    </div>
  );
};
