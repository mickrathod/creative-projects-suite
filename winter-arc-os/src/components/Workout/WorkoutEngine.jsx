import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '../Common/Icons';
import { HOME_WORKOUT_CIRCUIT } from '../../data/initial-state';
import { sounds } from '../../audio/sound-effects';
import { triggerConfetti } from '../../utils/confetti';

export const WorkoutEngine = ({ onMarkWorkoutDone }) => {
  // Track completed sets for each exercise: { [exerciseId]: [true, true, false] }
  const [completedSets, setCompletedSets] = useState(() => {
    const map = {};
    HOME_WORKOUT_CIRCUIT.forEach((ex) => {
      map[ex.id] = [false, false, false];
    });
    return map;
  });

  // Rest Timer State
  const [restRunning, setRestRunning] = useState(false);
  const [restSeconds, setRestSeconds] = useState(60);
  const [activeExName, setActiveExName] = useState('');
  const restTimerRef = useRef(null);

  // Selected Image Modal
  const [activeModalEx, setActiveModalEx] = useState(null);

  useEffect(() => {
    return () => {
      if (restTimerRef.current) clearInterval(restTimerRef.current);
    };
  }, []);

  const toggleSet = (exId, setIndex, exName, restSec) => {
    sounds.playClick();
    const currentList = [...(completedSets[exId] || [false, false, false])];
    const isNowDone = !currentList[setIndex];
    currentList[setIndex] = isNowDone;

    const nextState = {
      ...completedSets,
      [exId]: currentList
    };
    setCompletedSets(nextState);

    if (isNowDone) {
      sounds.playSuccess();
      startRest(restSec || 60, exName);

      const allSetsDone = Object.values(nextState).every(sets => sets.every(Boolean));
      if (allSetsDone) {
        sounds.playFanfare();
        triggerConfetti();
        if (onMarkWorkoutDone) onMarkWorkoutDone();
      }
    }
  };

  const startRest = (duration, exName) => {
    if (restTimerRef.current) clearInterval(restTimerRef.current);
    setActiveExName(exName);
    setRestSeconds(duration);
    setRestRunning(true);

    let t = duration;
    restTimerRef.current = setInterval(() => {
      t--;
      setRestSeconds(t);
      if (t <= 3 && t > 0) {
        sounds.playBeep(600, 0.08);
      }
      if (t <= 0) {
        clearInterval(restTimerRef.current);
        setRestRunning(false);
        sounds.playBeep(900, 0.25);
      }
    }, 1000);
  };

  const cancelRest = () => {
    sounds.playClick();
    if (restTimerRef.current) clearInterval(restTimerRef.current);
    setRestRunning(false);
  };

  const resetAllSets = () => {
    sounds.playClick();
    const map = {};
    HOME_WORKOUT_CIRCUIT.forEach((ex) => {
      map[ex.id] = [false, false, false];
    });
    setCompletedSets(map);
    cancelRest();
  };

  let totalSetsCount = 0;
  let finishedSetsCount = 0;
  Object.values(completedSets).forEach(sets => {
    totalSetsCount += sets.length;
    finishedSetsCount += sets.filter(Boolean).length;
  });
  const workoutPct = Math.round((finishedSetsCount / totalSetsCount) * 100);

  return (
    <div className="workout-engine-container">
      {/* Header Banner */}
      <div className="module-header-card">
        <div className="module-title-wrap">
          <span className="module-pill amber">ZERO-EQUIPMENT CALISTHENICS</span>
          <h1 className="display-title">HOME RECOMPOSITION ENGINE</h1>
          <p className="module-sub">
            Engineered for 165 cm / 70 kg bodyweight: builds upper-body hypertrophy, bulletproof shoulders for handstands, and ankle pop for skateboarding.
          </p>
        </div>

        <div className="workout-progress-card">
          <div className="mono bold wp-label">SESSION VOLUME</div>
          <div className="mono wp-val">{finishedSetsCount} / {totalSetsCount} <small>SETS</small></div>
          <div className="progress-bar-track mini">
            <div className="progress-bar-fill amber" style={{ width: `${workoutPct}%` }}></div>
          </div>
        </div>
      </div>

      {/* Floating / Sticky Rest Timer Alert when active */}
      {restRunning && (
        <div className="rest-timer-floating-banner">
          <div className="rt-left">
            <span className="pulse-indicator"></span>
            <span className="mono bold">RESTING AFTER: {activeExName.toUpperCase()}</span>
          </div>
          <div className="rt-center mono">
            00:{restSeconds < 10 ? `0${restSeconds}` : restSeconds}
          </div>
          <div className="rt-right">
            <button className="rt-skip-btn" onClick={cancelRest}>SKIP REST</button>
          </div>
        </div>
      )}

      {/* Control Strip */}
      <div className="workout-actions-strip">
        <div className="circuit-info-pill mono">
          4 Sessions / Week • Circuit Format • Click any exercise image to view full technique breakdown
        </div>
        <button className="reset-circuit-btn" onClick={resetAllSets}>
          <Icon name="rotate-ccw" size={14} /> Reset Session Sets
        </button>
      </div>

      {/* Exercise Cards Grid */}
      <div className="exercises-grid">
        {HOME_WORKOUT_CIRCUIT.map((ex, index) => {
          const setsDone = completedSets[ex.id] || [false, false, false];
          const isExComplete = setsDone.every(Boolean);

          return (
            <div key={ex.id} className={`exercise-card ${isExComplete ? 'completed' : ''}`}>
              <div className="ex-card-header">
                <div className="ex-num-tag mono">0{index + 1}</div>
                <div className="ex-title-group">
                  <h3 className="ex-name">{ex.name}</h3>
                  <span className="ex-target mono">{ex.target}</span>
                </div>
                <span className="synergy-tag">{ex.synergy}</span>
              </div>

              {/* Visual Form Demonstration Thumbnail */}
              {ex.image && (
                <div
                  className="ex-image-thumbnail-wrap"
                  onClick={() => { sounds.playClick(); setActiveModalEx(ex); }}
                  title="Click to view full form guide"
                >
                  <img src={ex.image} alt={ex.name} className="ex-thumbnail-img" />
                  <div className="ex-image-overlay">
                    <Icon name="sparkles" size={16} color="var(--cyan-primary)" />
                    <span className="mono">VIEW FORM GUIDE</span>
                  </div>
                </div>
              )}

              <p className="ex-cues-text">{ex.cues}</p>

              <div className="ex-reps-info mono">
                TARGET: <strong>{ex.reps}</strong> • REST: <strong>{ex.restSec}s</strong>
              </div>

              {/* Set Checkboxes */}
              <div className="sets-row">
                <span className="sets-label mono">SETS:</span>
                {setsDone.map((done, setIdx) => (
                  <button
                    key={setIdx}
                    className={`set-pill-btn ${done ? 'completed' : ''}`}
                    onClick={() => toggleSet(ex.id, setIdx, ex.name, ex.restSec)}
                  >
                    <span className="set-idx mono">SET {setIdx + 1}</span>
                    {done ? (
                      <Icon name="check" size={14} color="#fff" />
                    ) : (
                      <span className="set-circle-blank"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Exercise Form Guide Modal */}
      {activeModalEx && (
        <div className="modal-backdrop" onClick={() => setActiveModalEx(null)}>
          <div className="modal-content-card exercise-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="card-tag cyan mono">CALISTHENICS FORM LAB</span>
                <h3 className="display-title">{activeModalEx.name}</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setActiveModalEx(null)}>✕</button>
            </div>

            <div className="modal-exercise-body">
              {activeModalEx.image && (
                <div className="modal-image-container">
                  <img
                    src={activeModalEx.image}
                    alt={activeModalEx.name}
                    className="modal-exercise-full-img"
                  />
                </div>
              )}

              <div className="modal-cue-details">
                <div className="mc-title mono">ANATOMY & TECHNIQUE BREAKDOWN</div>
                <p className="mc-desc">{activeModalEx.cues}</p>
                <div className="mc-stat-tags">
                  <span className="stat-pill cyan mono">TARGET: {activeModalEx.target}</span>
                  <span className="stat-pill amber mono">SYNERGY: {activeModalEx.synergy}</span>
                  <span className="stat-pill blue mono">SETS: {activeModalEx.reps}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
