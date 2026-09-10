import React, { useState } from 'react';
import { Icon } from '../Common/Icons';
import { sounds } from '../../audio/sound-effects';
import { triggerConfetti } from '../../utils/confetti';
import { saveJournalEntry, exportBackup } from '../../data/storage';

export const JournalTab = ({
  profile,
  history,
  setHistory,
  handstandPRs,
  dailyData
}) => {
  const [weightKg, setWeightKg] = useState(profile.currentWeightKg);
  const [mood, setMood] = useState('Locked In 🔥');
  const [reflection, setReflection] = useState('');
  const [dailyWin, setDailyWin] = useState('');

  const moodsList = [
    'Locked In 🔥',
    'Unstoppable ⚡',
    'Sore but Strong 💪',
    'Flow State 🛹',
    'Calm Discipline ❄️'
  ];

  const handleSaveEntry = (e) => {
    e.preventDefault();
    sounds.playFanfare();
    triggerConfetti();

    const newEntry = {
      date: new Date().toISOString().split('T')[0],
      weightKg: parseFloat(weightKg) || profile.currentWeightKg,
      mood,
      dailyWin: dailyWin || "Showed up and executed all daily protocols.",
      reflection: reflection || "Solid consistency. Day by day closer to 62kg lean aesthetic and freestanding balance.",
      completedAll: Object.values(dailyData.completedProtocols || {}).every(Boolean)
    };

    const updated = saveJournalEntry(newEntry);
    setHistory(updated);
    setReflection('');
    setDailyWin('');
  };

  // Trajectory calculations
  const bestHandstand = handstandPRs.length > 0 ? Math.max(...handstandPRs.map(p => p.sec)) : 0;

  return (
    <div className="journal-tab-container">
      {/* Top Banner */}
      <div className="module-header-card">
        <div className="module-title-wrap">
          <span className="module-pill emerald">EXPERIENCE LOG & ANALYTICS</span>
          <h1 className="display-title">JOURNAL & PROGRESS ARCHIVE</h1>
          <p className="module-sub">
            Document the transformation. Track weight drop, record mental breakthroughs, and preserve every milestone of your Winter Arc.
          </p>
        </div>

        <button className="export-pill-btn" onClick={() => { sounds.playClick(); exportBackup(); }}>
          <Icon name="download" size={16} />
          <span>EXPORT BACKUP (JSON)</span>
        </button>
      </div>

      {/* Progress Cards & Charts Overview */}
      <div className="analytics-summary-grid">
        <div className="analytics-card">
          <div className="ac-top">
            <span className="card-tag amber">WEIGHT CUT TRAJECTORY</span>
            <span className="mono">165 CM FRAME</span>
          </div>
          <div className="ac-body">
            <div className="weight-cut-graphic">
              <div className="wc-point start">
                <span className="wc-label mono">START</span>
                <span className="wc-val mono">70.0 kg</span>
              </div>
              <div className="wc-line-track">
                <div
                  className="wc-line-progress"
                  style={{
                    width: `${Math.min(100, Math.max(10, ((70.0 - profile.currentWeightKg) / (70.0 - 62.0)) * 100))}%`
                  }}
                >
                  <span className="wc-current-marker mono">{profile.currentWeightKg.toFixed(1)}kg</span>
                </div>
              </div>
              <div className="wc-point target">
                <span className="wc-label mono">LEAN GOAL</span>
                <span className="wc-val mono">62.0 kg</span>
              </div>
            </div>
            <p className="wc-desc">
              Dropping to 62 kg strips ~8 kg of body fat, revealing deep abdominal definition and slashing handstand wrist load by 11.4%.
            </p>
          </div>
        </div>

        <div className="analytics-card">
          <div className="ac-top">
            <span className="card-tag cyan">HANDSTAND ENDURANCE</span>
            <span className="mono">CHEST-TO-WALL & FREESTANDING</span>
          </div>
          <div className="ac-body">
            <div className="hs-stat-row">
              <div className="hs-metric">
                <span className="hs-label mono">CURRENT PEAK HOLD</span>
                <div className="hs-val mono cyan-glow">{bestHandstand.toFixed(1)} <small>SECONDS</small></div>
              </div>
              <div className="hs-metric">
                <span className="hs-label mono">TARGET GOAL</span>
                <div className="hs-val mono">30.0 <small>SECONDS</small></div>
              </div>
            </div>
            <div className="hs-bars-preview">
              {handstandPRs.slice(-6).map((pr, i) => {
                const heightPct = Math.min(100, Math.max(15, (pr.sec / 30) * 100));
                return (
                  <div key={i} className="hs-bar-item">
                    <div className="hs-bar-fill" style={{ height: `${heightPct}%` }}></div>
                    <span className="hs-bar-label mono">{pr.sec.toFixed(0)}s</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Form & History Timeline */}
      <div className="journal-split-grid">
        {/* Left: New Entry Form */}
        <div className="journal-form-card">
          <div className="jf-header">
            <span className="card-tag emerald">DAILY LOG</span>
            <h3>Record Today's Experience</h3>
          </div>

          <form onSubmit={handleSaveEntry} className="journal-form">
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label mono">TODAY'S WEIGHT (KG)</label>
                <input
                  type="number"
                  step="0.1"
                  className="mono"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label mono">MINDSET & ENERGY</label>
                <select value={mood} onChange={(e) => setMood(e.target.value)}>
                  {moodsList.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label mono">BIGGEST WIN OF THE DAY</label>
              <input
                type="text"
                value={dailyWin}
                onChange={(e) => setDailyWin(e.target.value)}
                placeholder="e.g. 24s chest-to-wall hold without back arch, or smooth 30min skate"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label mono">NOTES, FEELINGS & REFLECTIONS</label>
              <textarea
                rows="4"
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="How was your energy? Did your wrists feel strong? How clean was your diet today?"
              ></textarea>
            </div>

            <button type="submit" className="save-journal-btn">
              <Icon name="check" size={16} />
              <span>LOG TODAY'S WINTER ARC ENTRY</span>
            </button>
          </form>
        </div>

        {/* Right: History Timeline */}
        <div className="journal-timeline-card">
          <div className="jt-header">
            <span className="card-tag cyan">ARCHIVE</span>
            <h3>Past Daily Logs</h3>
          </div>

          {history.length === 0 ? (
            <p className="no-entries">No journal logs yet. Write your first reflection above!</p>
          ) : (
            <div className="timeline-items-list">
              {history.map((item, idx) => (
                <div key={idx} className="timeline-item">
                  <div className="ti-header">
                    <span className="ti-date mono">{item.date}</span>
                    <span className="ti-mood">{item.mood}</span>
                    <span className="ti-weight mono">{item.weightKg} kg</span>
                  </div>
                  {item.dailyWin && (
                    <div className="ti-win">
                      <Icon name="sparkles" size={14} color="var(--amber-primary)" />
                      <span>{item.dailyWin}</span>
                    </div>
                  )}
                  <p className="ti-text">{item.reflection}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
