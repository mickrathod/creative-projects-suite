import React, { useState } from 'react';
import { Icon } from '../Common/Icons';
import { sounds } from '../../audio/sound-effects';
import { triggerConfetti } from '../../utils/confetti';
import { SKATE_SKILLS } from '../../data/initial-state';
import { saveSkateLog, saveSkateSkills, saveProfile } from '../../data/storage';

export const SkateLog = ({
  profile,
  setProfile,
  skateSkills,
  setSkateSkills,
  skateLogs,
  setSkateLogs,
  onMarkSkateDone
}) => {
  const [showLogModal, setShowLogModal] = useState(false);
  const [zoomSkateSkill, setZoomSkateSkill] = useState(null);
  const [durationMins, setDurationMins] = useState(45);
  const [spotName, setSpotName] = useState('Smooth Asphalt / Local Lot');
  const [tricksPracticed, setTricksPracticed] = useState('Pushing balance & carving heel/toe');

  const handleStanceChange = (stance) => {
    sounds.playClick();
    const updated = { ...profile, skateStance: stance };
    setProfile(updated);
    saveProfile(updated);
  };

  const toggleSkill = (skillId) => {
    sounds.playClick();
    const updated = skateSkills.map(s => {
      if (s.id === skillId) {
        const nextState = !s.unlocked;
        if (nextState) {
          sounds.playSuccess();
          triggerConfetti();
        }
        return { ...s, unlocked: nextState };
      }
      return s;
    });
    setSkateSkills(updated);
    saveSkateSkills(updated);
  };

  const handleLogSession = (e) => {
    e.preventDefault();
    sounds.playFanfare();
    triggerConfetti();

    // 350 kcal per 60 mins -> ~5.83 kcal per min
    const caloriesBurned = Math.round(durationMins * 5.83);
    const newLog = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      durationMins: Number(durationMins),
      spot: spotName,
      notes: tricksPracticed,
      caloriesBurned
    };

    const updated = saveSkateLog(newLog);
    setSkateLogs(updated);
    setShowLogModal(false);

    if (onMarkSkateDone) {
      onMarkSkateDone();
    }
  };

  const totalMinutes = skateLogs.reduce((acc, curr) => acc + (curr.durationMins || 0), 0);
  const totalCalories = skateLogs.reduce((acc, curr) => acc + (curr.caloriesBurned || 0), 0);
  const masteredCount = skateSkills.filter(s => s.unlocked).length;

  const isRegular = profile.skateStance === 'regular';

  return (
    <div className="skate-hub-container">
      {/* Top Banner */}
      <div className="module-header-card">
        <div className="module-title-wrap">
          <span className="module-pill blue">BALANCE & CARDIO ENGINE</span>
          <h1 className="display-title">SKATEBOARDING HUB</h1>
          <p className="module-sub">
            Skateboarding burns 300–400 kcal/hr, builds ironclad ankle and calf stability, and keeps your Winter Arc active and exhilarating.
          </p>
        </div>

        <div className="skate-metrics-card">
          <div className="sm-item">
            <span className="sm-label mono">TOTAL TIME</span>
            <span className="sm-val mono">{(totalMinutes / 60).toFixed(1)} <small>HOURS</small></span>
          </div>
          <div className="sm-sep"></div>
          <div className="sm-item">
            <span className="sm-label mono">CALORIES BURNED</span>
            <span className="sm-val mono">{totalCalories} <small>KCAL</small></span>
          </div>
          <div className="sm-sep"></div>
          <div className="sm-item">
            <span className="sm-label mono">SKILLS MASTERED</span>
            <span className="sm-val mono">{masteredCount} / 5</span>
          </div>
        </div>
      </div>

      <div className="skate-main-grid">
        {/* Left: Stance Selector & Visual Deck Graphic */}
        <div className="deck-visualizer-col">
          <div className="stance-card">
            <div className="stance-header">
              <span className="card-tag blue">RIDER CONFIGURATION</span>
              <h3>Choose Your Riding Stance</h3>
            </div>

            <div className="stance-buttons-row">
              <button
                className={`stance-btn ${isRegular ? 'active' : ''}`}
                onClick={() => handleStanceChange('regular')}
              >
                <div className="stance-title">REGULAR</div>
                <div className="stance-desc mono">Left Foot Forward • Right Foot Pushes</div>
              </button>

              <button
                className={`stance-btn ${!isRegular ? 'active' : ''}`}
                onClick={() => handleStanceChange('goofy')}
              >
                <div className="stance-title">GOOFY</div>
                <div className="stance-desc mono">Right Foot Forward • Left Foot Pushes</div>
              </button>
            </div>

            {/* Skateboard Graphic Visualizer */}
            <div className="deck-art-box">
              <div className="deck-direction mono">
                ▲ NOSE (FORWARD DIRECTION)
              </div>

              <div className="board-deck-shape">
                <div className="truck-bolts front">
                  <span></span><span></span>
                  <span></span><span></span>
                </div>

                {/* Foot placement visual overlays */}
                <div className={`footprint front-foot ${isRegular ? 'regular' : 'goofy'}`}>
                  <span className="foot-label mono">{isRegular ? 'LEFT (FRONT)' : 'RIGHT (FRONT)'}</span>
                  <span className="foot-deg mono">30° ANGLE</span>
                </div>

                <div className="deck-logo-center mono">
                  WINTERARC // DECK
                </div>

                <div className={`footprint back-foot ${isRegular ? 'regular' : 'goofy'}`}>
                  <span className="foot-label mono">{isRegular ? 'RIGHT (TAIL)' : 'LEFT (TAIL)'}</span>
                  <span className="foot-deg mono">PUSH & BRAKE</span>
                </div>

                <div className="truck-bolts rear">
                  <span></span><span></span>
                  <span></span><span></span>
                </div>
              </div>

              <div className="deck-direction tail mono">
                ▼ TAIL (REAR)
              </div>
            </div>

            {/* Cruising Rules */}
            <div className="cruising-rules-card">
              <div className="rule-title mono">🛹 GOLDEN SKATE RULES:</div>
              <ul>
                <li>Bend both knees—never skate with locked, stiff legs.</li>
                <li>Keep 80% weight on front foot while pushing with back foot.</li>
                <li>Wear flat-soled sneakers (Vans/Converse/skate shoes).</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Skill Tree & Session Logger */}
        <div className="skills-and-logs-col">
          {/* Skill Tree */}
          <div className="skill-tree-card">
            <div className="st-header-row">
              <div>
                <span className="card-tag cyan">PROGRESSION TREE</span>
                <h3>The 5 Skateboarding Milestones</h3>
              </div>
              <button
                className="log-session-btn"
                onClick={() => { sounds.playClick(); setShowLogModal(true); }}
              >
                <Icon name="skateboard" size={16} />
                <span>LOG TODAY'S SESSION</span>
              </button>
            </div>

            <div className="skills-list">
              {skateSkills.map((sk) => (
                <div key={sk.id} className={`skill-row-card ${sk.unlocked ? 'unlocked' : 'locked'}`}>
                  <div className="sr-top">
                    <div className="sr-lvl mono">LEVEL 0{sk.level}</div>
                    <h4 className="sr-name">{sk.name}</h4>
                    <button
                      className={`skill-toggle-btn ${sk.unlocked ? 'mastered' : ''}`}
                      onClick={() => toggleSkill(sk.id)}
                    >
                      {sk.unlocked ? '✓ MASTERED' : 'MARK COMPLETE'}
                    </button>
                  </div>

                  <p className="sr-desc">{sk.description}</p>

                  {(() => {
                    const skillImage = sk.image || SKATE_SKILLS.find(s => s.id === sk.id)?.image;
                    if (!skillImage) return null;
                    return (
                      <div
                        className="sk-image-preview-box clickable"
                        onClick={() => {
                          sounds.playClick();
                          setZoomSkateSkill({ ...sk, image: skillImage });
                        }}
                        title="Click to view full technique infographic"
                      >
                        <img src={skillImage} alt={sk.name} className="sk-guide-img" />
                        <div className="sk-image-overlay-label mono">
                          <Icon name="sparkles" size={14} color="#38bdf8" />
                          <span>TECHNIQUE & STANCE INFOGRAPHIC (CLICK TO ENLARGE)</span>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="sr-steps-list">
                    {sk.steps.map((st, i) => (
                      <div key={i} className="sr-step-item">
                        <span className="step-num mono">{i + 1}.</span>
                        <span>{st}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skate Sessions History */}
          <div className="sessions-history-card">
            <div className="sh-header">
              <span className="card-tag amber">SESSION HISTORY</span>
              <h4>Recorded Cruises</h4>
            </div>

            {skateLogs.length === 0 ? (
              <p className="no-sessions">No sessions logged yet. Log your first cruise above!</p>
            ) : (
              <div className="sessions-list">
                {skateLogs.map((log) => (
                  <div key={log.id} className="session-item-card">
                    <div className="sic-header">
                      <span className="sic-date mono">{log.date}</span>
                      <span className="sic-spot">{log.spot}</span>
                      <span className="sic-cal mono">🔥 {log.caloriesBurned} kcal</span>
                      <span className="sic-duration mono">⏱️ {log.durationMins}m</span>
                    </div>
                    <p className="sic-notes">{log.notes}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Log Session Modal */}
      {showLogModal && (
        <div className="modal-backdrop" onClick={() => setShowLogModal(false)}>
          <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="display-title">LOG SKATEBOARDING CRUISE</h3>
              <button className="modal-close-btn" onClick={() => setShowLogModal(false)}>✕</button>
            </div>

            <form onSubmit={handleLogSession} className="modal-form">
              <div className="form-group">
                <label className="form-label mono">DURATION (MINUTES)</label>
                <input
                  type="number"
                  min="5"
                  max="300"
                  className="mono"
                  value={durationMins}
                  onChange={(e) => setDurationMins(e.target.value)}
                  required
                />
                <span className="form-hint mono">Estimated burn: ~{Math.round(durationMins * 5.83)} kcal</span>
              </div>

              <div className="form-group">
                <label className="form-label mono">SKATE SPOT / LOCATION</label>
                <input
                  type="text"
                  value={spotName}
                  onChange={(e) => setSpotName(e.target.value)}
                  placeholder="e.g. Park, Empty Asphalt Lot, Street"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label mono">SKILLS & TRICKS PRACTICED</label>
                <textarea
                  rows="3"
                  value={tricksPracticed}
                  onChange={(e) => setTricksPracticed(e.target.value)}
                  placeholder="e.g., Pushing smoothly, carving turns, foot braking from moderate speed"
                ></textarea>
              </div>

              <div className="modal-actions-row">
                <button type="button" className="btn-cancel" onClick={() => setShowLogModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit-log">
                  Confirm & Save Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Resolution Skate Skill Lightbox Modal */}
      {zoomSkateSkill && (
        <div className="modal-backdrop" onClick={() => setZoomSkateSkill(null)}>
          <div className="modal-content-card exercise-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="card-tag blue mono">SKATE PROGRESSION // LEVEL 0{zoomSkateSkill.level}</span>
                <h3 className="display-title">{zoomSkateSkill.name}</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setZoomSkateSkill(null)}>✕</button>
            </div>

            <div className="modal-exercise-body">
              <div className="modal-image-container">
                <img
                  src={zoomSkateSkill.image}
                  alt={zoomSkateSkill.name}
                  className="modal-exercise-full-img"
                />
              </div>

              <div className="modal-cue-details">
                <div className="mc-title mono" style={{ color: '#38bdf8' }}>TECHNIQUE INSTRUCTION</div>
                <p className="mc-desc">{zoomSkateSkill.description}</p>
                <div className="mc-stat-tags">
                  <span className="stat-pill blue mono">LEVEL 0{zoomSkateSkill.level}</span>
                  <span className="stat-pill cyan mono">STANCE: {profile.skateStance.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
