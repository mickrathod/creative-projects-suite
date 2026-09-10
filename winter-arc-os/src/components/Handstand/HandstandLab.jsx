import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '../Common/Icons';
import { HANDSTAND_STAGES } from '../../data/initial-state';
import { sounds } from '../../audio/sound-effects';
import { triggerConfetti } from '../../utils/confetti';
import { saveHandstandPR } from '../../data/storage';

export const HandstandLab = ({ handstandPRs, setHandstandPRs }) => {
  const [selectedStage, setSelectedStage] = useState(3); // Default Stage 3: Chest-to-Wall
  const [timerMode, setTimerMode] = useState('stopwatch'); // 'stopwatch' or 'interval'
  
  // Stopwatch state
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [countdown, setCountdown] = useState(null); // 3, 2, 1 pre-start countdown
  
  // Interval state (e.g. 4 sets of 25s hold, 45s rest)
  const [currentSet, setCurrentSet] = useState(1);
  const [totalSets, setTotalSets] = useState(4);
  const [intervalPhase, setIntervalPhase] = useState('ready'); // 'ready', 'hold', 'rest', 'completed'
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(25);
  const holdDuration = 25;
  const restDuration = 45;

  // Wrist warmup checklist state
  const [wristChecked, setWristChecked] = useState({
    knuckles: false,
    rocks: false,
    rotations: false,
    activeShoulders: false
  });

  const [zoomImage, setZoomImage] = useState(null);

  const timerRef = useRef(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Handle Stopwatch countdown & run
  const startStopwatch = () => {
    sounds.playClick();
    if (timerRunning) {
      // Stop
      clearInterval(timerRef.current);
      setTimerRunning(false);
      sounds.playSuccess();
    } else {
      // 3-2-1 Countdown
      setElapsedSec(0);
      setCountdown(3);
      sounds.playBeep(440, 0.1);

      let count = 3;
      const countInterval = setInterval(() => {
        count--;
        if (count > 0) {
          setCountdown(count);
          sounds.playBeep(440, 0.1);
        } else if (count === 0) {
          setCountdown('GO!');
          sounds.playBeep(880, 0.2);
        } else {
          clearInterval(countInterval);
          setCountdown(null);
          setTimerRunning(true);

          const startTime = Date.now();
          timerRef.current = setInterval(() => {
            const current = (Date.now() - startTime) / 1000;
            setElapsedSec(current);
          }, 100);
        }
      }, 900);
    }
  };

  const resetStopwatch = () => {
    sounds.playClick();
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerRunning(false);
    setElapsedSec(0);
    setCountdown(null);
  };

  const recordPR = () => {
    if (elapsedSec < 3) return;
    sounds.playFanfare();
    triggerConfetti();
    const finalSec = Math.round(elapsedSec * 10) / 10;
    const stageTitle = HANDSTAND_STAGES.find(s => s.id === selectedStage)?.title.split(':')[0] || 'Handstand';
    const updated = saveHandstandPR(finalSec, stageTitle);
    setHandstandPRs(updated);
    resetStopwatch();
  };

  // Handle Interval Trainer
  const startIntervalTrainer = () => {
    sounds.playClick();
    if (intervalPhase === 'hold' || intervalPhase === 'rest') {
      // Pause/Cancel
      clearInterval(timerRef.current);
      setIntervalPhase('ready');
      return;
    }

    // Begin set
    setCurrentSet(1);
    setIntervalPhase('hold');
    setPhaseTimeLeft(holdDuration);
    sounds.playBeep(880, 0.25);

    let currentTime = holdDuration;
    let setNumber = 1;
    let phase = 'hold';

    timerRef.current = setInterval(() => {
      currentTime--;
      setPhaseTimeLeft(currentTime);

      if (currentTime <= 3 && currentTime > 0) {
        sounds.playBeep(520, 0.08);
      }

      if (currentTime <= 0) {
        if (phase === 'hold') {
          // Switch to rest
          sounds.playSuccess();
          if (setNumber >= totalSets) {
            // Completed all sets
            clearInterval(timerRef.current);
            setIntervalPhase('completed');
            sounds.playFanfare();
            triggerConfetti();
            return;
          }
          phase = 'rest';
          setIntervalPhase('rest');
          currentTime = restDuration;
          setPhaseTimeLeft(currentTime);
        } else {
          // Switch to next hold set
          setNumber++;
          setCurrentSet(setNumber);
          phase = 'hold';
          setIntervalPhase('hold');
          currentTime = holdDuration;
          setPhaseTimeLeft(currentTime);
          sounds.playBeep(880, 0.25);
        }
      }
    }, 1000);
  };

  const resetIntervals = () => {
    sounds.playClick();
    if (timerRef.current) clearInterval(timerRef.current);
    setIntervalPhase('ready');
    setCurrentSet(1);
    setPhaseTimeLeft(holdDuration);
  };

  const toggleWrist = (key) => {
    sounds.playClick();
    setWristChecked({ ...wristChecked, [key]: !wristChecked[key] });
  };

  const allWristWarmed = Object.values(wristChecked).every(Boolean);
  const activeStageObj = HANDSTAND_STAGES.find(s => s.id === selectedStage) || HANDSTAND_STAGES[2];
  const bestPr = handstandPRs.length > 0 ? Math.max(...handstandPRs.map(p => p.sec)) : 0;

  return (
    <div className="handstand-lab-container">
      {/* Top Banner */}
      <div className="module-header-card">
        <div className="module-title-wrap">
          <span className="module-pill cyan">CALISTHENICS SKILL ENGINE</span>
          <h1 className="display-title">HANDSTAND MASTERY LAB</h1>
          <p className="module-sub">
            At 70 kg, building balance on your hands requires wrist resilience, active shoulder elevation, and consistent wall holds.
          </p>
        </div>

        <div className="pr-trophy-card">
          <div className="trophy-icon">
            <Icon name="award" size={26} color="var(--amber-primary)" />
          </div>
          <div>
            <div className="trophy-sub mono">PERSONAL RECORD</div>
            <div className="trophy-val mono">{bestPr.toFixed(1)} <small>SEC HOLD</small></div>
          </div>
        </div>
      </div>

      <div className="handstand-grid">
        {/* Left Column: Interactive Timer & Interval Engine */}
        <div className="timer-column">
          <div className="timer-card">
            <div className="timer-nav-tabs">
              <button
                className={`timer-tab-btn ${timerMode === 'stopwatch' ? 'active' : ''}`}
                onClick={() => { sounds.playClick(); setTimerMode('stopwatch'); resetIntervals(); }}
              >
                Max Hold Stopwatch
              </button>
              <button
                className={`timer-tab-btn ${timerMode === 'interval' ? 'active' : ''}`}
                onClick={() => { sounds.playClick(); setTimerMode('interval'); resetStopwatch(); }}
              >
                4x25s Interval Trainer
              </button>
            </div>

            {timerMode === 'stopwatch' ? (
              <div className="stopwatch-display-panel">
                <div className="timer-meta-label mono">
                  {countdown ? 'PREPARE TO HOLD...' : timerRunning ? 'HOLD ACTIVE — PUSH FLOOR AWAY' : 'READY TO RECORD HOLD'}
                </div>

                <div className="digital-clock-display mono">
                  {countdown !== null ? (
                    <span className="countdown-text animate-pulse">{countdown}</span>
                  ) : (
                    <span>{elapsedSec.toFixed(1)}<span className="sub-clock">s</span></span>
                  )}
                </div>

                <div className="timer-controls-row">
                  <button
                    className={`timer-action-btn primary ${timerRunning ? 'danger' : 'cyan'}`}
                    onClick={startStopwatch}
                  >
                    <Icon name={timerRunning ? 'pause' : 'play'} size={20} />
                    <span>{timerRunning ? 'DROP & STOP' : 'START HOLD'}</span>
                  </button>

                  <button className="timer-action-btn secondary" onClick={resetStopwatch}>
                    <Icon name="rotate-ccw" size={18} />
                    <span>RESET</span>
                  </button>

                  {elapsedSec >= 3 && !timerRunning && (
                    <button className="timer-action-btn record-pr animate-bounce" onClick={recordPR}>
                      <Icon name="award" size={18} color="#fff" />
                      <span>LOG AS PR</span>
                    </button>
                  )}
                </div>

                <p className="timer-hint">
                  Tip: Use your fingertips like brakes. Press pads down if you feel yourself falling forward.
                </p>
              </div>
            ) : (
              <div className="interval-display-panel">
                <div className="interval-set-tracker">
                  <div className="set-badge mono">
                    SET {currentSet} OF {totalSets}
                  </div>
                  <div className={`phase-badge ${intervalPhase} mono`}>
                    {intervalPhase === 'hold' ? '🔥 HOLD ACTIVE' : intervalPhase === 'rest' ? '💤 REST INTERVAL' : intervalPhase === 'completed' ? '🎉 ALL SETS COMPLETE' : 'READY'}
                  </div>
                </div>

                <div className="digital-clock-display mono">
                  <span>{phaseTimeLeft}<span className="sub-clock">s</span></span>
                </div>

                <div className="timer-controls-row">
                  {intervalPhase === 'ready' || intervalPhase === 'completed' ? (
                    <button className="timer-action-btn primary cyan" onClick={startIntervalTrainer}>
                      <Icon name="play" size={20} />
                      <span>START 4-SET INTERVAL</span>
                    </button>
                  ) : (
                    <button className="timer-action-btn primary danger" onClick={resetIntervals}>
                      <Icon name="pause" size={20} />
                      <span>ABORT INTERVAL</span>
                    </button>
                  )}

                  <button className="timer-action-btn secondary" onClick={resetIntervals}>
                    <Icon name="rotate-ccw" size={18} />
                    <span>RESET</span>
                  </button>
                </div>

                <div className="interval-structure-pill mono">
                  4 Sets × 25s Chest-to-Wall Hold • 45s Rest
                </div>
              </div>
            )}
          </div>

          {/* Wrist Warmup Checkbox Card */}
          <div className="wrist-armor-card">
            <div className="wrist-title-row">
              <div className="wrist-heading">
                <span className="card-tag cyan">WRIST ARMOR</span>
                <h3>Mandatory Pre-Handstand Warmup</h3>
              </div>
              <span className={`wrist-status-badge ${allWristWarmed ? 'ready' : ''}`}>
                {allWristWarmed ? '✓ WRISTS READY' : 'INCOMPLETE'}
              </span>
            </div>

            <div className="wrist-checks-grid">
              <div
                className={`wrist-check-item ${wristChecked.knuckles ? 'checked' : ''}`}
                onClick={() => toggleWrist('knuckles')}
              >
                <button className="check-box-mini">
                  {wristChecked.knuckles && <Icon name="check" size={12} />}
                </button>
                <span>First-knuckle pushups (3x10 on knees)</span>
              </div>

              <div
                className={`wrist-check-item ${wristChecked.rocks ? 'checked' : ''}`}
                onClick={() => toggleWrist('rocks')}
              >
                <button className="check-box-mini">
                  {wristChecked.rocks && <Icon name="check" size={12} />}
                </button>
                <span>Palm rocks: fingers back, front & sideways (2 mins)</span>
              </div>

              <div
                className={`wrist-check-item ${wristChecked.rotations ? 'checked' : ''}`}
                onClick={() => toggleWrist('rotations')}
              >
                <button className="check-box-mini">
                  {wristChecked.rotations && <Icon name="check" size={12} />}
                </button>
                <span>Fist rotations & interlocked finger waves</span>
              </div>

              <div
                className={`wrist-check-item ${wristChecked.activeShoulders ? 'checked' : ''}`}
                onClick={() => toggleWrist('activeShoulders')}
              >
                <button className="check-box-mini">
                  {wristChecked.activeShoulders && <Icon name="check" size={12} />}
                </button>
                <span>Scapular shrugs (ears between shoulders)</span>
              </div>
            </div>
          </div>

          {/* Handstand PR History Log */}
          <div className="pr-history-card">
            <div className="pr-history-header">
              <span className="card-tag amber">PROGRESSION LOG</span>
              <h4>Hold History</h4>
            </div>

            {handstandPRs.length === 0 ? (
              <p className="no-prs">No holds recorded yet. Start the stopwatch above!</p>
            ) : (
              <div className="pr-items-list">
                {handstandPRs.slice(-4).reverse().map((pr, idx) => (
                  <div key={idx} className="pr-history-row mono">
                    <span className="pr-date">{pr.date}</span>
                    <span className="pr-mode">{pr.mode}</span>
                    <span className="pr-sec bold">{pr.sec.toFixed(1)}s</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: 5-Stage Progression Roadmap */}
        <div className="roadmap-column">
          <div className="stages-nav-card">
            <div className="stages-title-row">
              <span className="card-tag cyan">SKILL TREE</span>
              <h3>The 5-Stage Handstand Progression</h3>
            </div>

            <div className="stages-pill-selector">
              {HANDSTAND_STAGES.map((s) => (
                <button
                  key={s.id}
                  className={`stage-select-btn ${selectedStage === s.id ? 'active' : ''}`}
                  onClick={() => { sounds.playClick(); setSelectedStage(s.id); }}
                >
                  <span className="stage-num mono">L{s.id}</span>
                  <span className="stage-name">{s.title.split(':')[1]?.trim() || s.title}</span>
                </button>
              ))}
            </div>

            {/* Active Stage Detail */}
            <div className="active-stage-details">
              <div className="stage-hero-row">
                <div>
                  <span className="stage-level-badge mono">STAGE 0{activeStageObj.id} // {activeStageObj.difficulty}</span>
                  <h2 className="stage-headline">{activeStageObj.title}</h2>
                </div>
                <div className="target-hold-box mono">
                  <span className="target-label">TARGET HOLD</span>
                  <span className="target-val">{activeStageObj.targetHoldSec}s</span>
                </div>
              </div>

              <p className="stage-description">{activeStageObj.description}</p>

              {activeStageObj.image && (
                <div
                  className="stage-image-preview-card clickable"
                  onClick={() => { sounds.playClick(); setZoomImage(activeStageObj); }}
                  title="Click to view full resolution technique guide"
                >
                  <img src={activeStageObj.image} alt={activeStageObj.title} className="stage-guide-img" />
                  <div className="stage-image-tag mono">
                    <Icon name="sparkles" size={14} color="var(--cyan-primary)" />
                    <span>BIOMECHANICAL ALIGNMENT GUIDE (CLICK TO ENLARGE)</span>
                  </div>
                </div>
              )}

              <div className="cues-card">
                <div className="cues-header">
                  <Icon name="sparkles" size={16} color="var(--amber-primary)" />
                  <span className="mono bold">CRITICAL FORM CUES</span>
                </div>
                <ul className="cues-list">
                  {activeStageObj.cues.map((cue, idx) => (
                    <li key={idx} className="cue-item">
                      <span className="cue-bullet mono">0{idx + 1}</span>
                      <span>{cue}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pro Form Advice Box */}
              <div className="pro-advice-box">
                <div className="advice-title mono">⚠️ MISTAKE TO AVOID AT 70 KG:</div>
                <p>
                  Do <strong>NOT</strong> kick up with your back to the wall. This causes an arched lower back ("banana handstand") which dumps stress on your lumbar spine. Always walk your feet up <strong>facing the wall (chest-to-wall)</strong> to force active shoulder elevation and straight posterior pelvic tilt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Resolution Stage Guide Lightbox Modal */}
      {zoomImage && (
        <div className="modal-backdrop" onClick={() => setZoomImage(null)}>
          <div className="modal-content-card exercise-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="card-tag cyan mono">HANDSTAND SKILL TREE // STAGE 0{zoomImage.id}</span>
                <h3 className="display-title">{zoomImage.title}</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setZoomImage(null)}>✕</button>
            </div>

            <div className="modal-exercise-body">
              <div className="modal-image-container">
                <img
                  src={zoomImage.image}
                  alt={zoomImage.title}
                  className="modal-exercise-full-img"
                />
              </div>

              <div className="modal-cue-details">
                <div className="mc-title mono">TECHNIQUE & HOLD DIRECTIVE</div>
                <p className="mc-desc">{zoomImage.description}</p>
                <div className="mc-stat-tags">
                  <span className="stat-pill cyan mono">DIFFICULTY: {zoomImage.difficulty}</span>
                  <span className="stat-pill amber mono">TARGET HOLD: {zoomImage.targetHoldSec}s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
