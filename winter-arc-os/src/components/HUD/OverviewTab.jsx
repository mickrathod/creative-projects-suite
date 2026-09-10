import React, { useState } from 'react';
import { Icon } from '../Common/Icons';
import { sounds } from '../../audio/sound-effects';
import { triggerConfetti } from '../../utils/confetti';

export const OverviewTab = ({
  profile,
  setProfile,
  dailyData,
  setDailyData,
  onNavigateTab
}) => {
  const [editingWeight, setEditingWeight] = useState(false);
  const [tempWeight, setTempWeight] = useState(profile.currentWeightKg);

  const protocols = [
    {
      key: 'handstand',
      title: 'Handstand Skill Mastery',
      sub: '12m wrist conditioning + chest-to-wall holds',
      icon: 'handstand',
      tab: 'handstand',
      color: 'var(--cyan-primary)'
    },
    {
      key: 'workout',
      title: 'Zero-Equipment Calisthenics',
      sub: 'Pike pushups, rows, squats, hollow holds',
      icon: 'dumbbell',
      tab: 'workout',
      color: 'var(--amber-primary)'
    },
    {
      key: 'skate',
      title: 'Skateboarding Practice',
      sub: '30-45m cruising, balance, pushing, carving',
      icon: 'skateboard',
      tab: 'skate',
      color: '#38bdf8'
    },
    {
      key: 'nutrition',
      title: 'Locked-In Nutrition Target',
      sub: 'Under 1,800 kcal & 130-140g protein',
      icon: 'target',
      tab: 'hud',
      color: 'var(--emerald-primary)'
    }
  ];

  const toggleProtocol = (key) => {
    sounds.playClick();
    const updated = {
      ...dailyData.completedProtocols,
      [key]: !dailyData.completedProtocols[key]
    };
    
    setDailyData({
      ...dailyData,
      completedProtocols: updated
    });

    // If all completed now, celebrate!
    const allDone = Object.values(updated).filter(Boolean).length === 4;
    if (allDone && !dailyData.completedProtocols[key]) {
      sounds.playFanfare();
      triggerConfetti();
    } else if (!dailyData.completedProtocols[key]) {
      sounds.playSuccess();
    }
  };

  const addProtein = (amount) => {
    sounds.playClick();
    const next = Math.min(250, (dailyData.proteinIntakeG || 0) + amount);
    setDailyData({ ...dailyData, proteinIntakeG: next });
    if (next >= profile.dailyProteinTarget && (dailyData.proteinIntakeG || 0) < profile.dailyProteinTarget) {
      sounds.playSuccess();
    }
  };

  const addWater = (amount) => {
    sounds.playClick();
    const next = Math.min(5000, (dailyData.waterIntakeMl || 0) + amount);
    setDailyData({ ...dailyData, waterIntakeMl: next });
    if (next >= profile.dailyWaterTargetMl && (dailyData.waterIntakeMl || 0) < profile.dailyWaterTargetMl) {
      sounds.playSuccess();
    }
  };

  const handleSaveWeight = () => {
    sounds.playClick();
    const val = parseFloat(tempWeight);
    if (!isNaN(val) && val > 30 && val < 200) {
      setProfile({ ...profile, currentWeightKg: val });
      setDailyData({ ...dailyData, weightLoggedKg: val });
      setEditingWeight(false);
      sounds.playSuccess();
    }
  };

  const completedCount = Object.values(dailyData.completedProtocols || {}).filter(Boolean).length;
  const protocolPercent = Math.round((completedCount / 4) * 100);

  // Weight math: start 70kg -> goal 62kg
  const totalToLose = Math.max(0.1, profile.startWeightKg - profile.targetWeightKg);
  const lostSoFar = Math.max(0, profile.startWeightKg - profile.currentWeightKg);
  const weightProgressPct = Math.min(100, Math.round((lostSoFar / totalToLose) * 100));

  // Protein math
  const proteinPct = Math.min(100, Math.round(((dailyData.proteinIntakeG || 0) / profile.dailyProteinTarget) * 100));

  // Water math
  const waterPct = Math.min(100, Math.round(((dailyData.waterIntakeMl || 0) / profile.dailyWaterTargetMl) * 100));

  return (
    <div className="overview-container">
      {/* Hero Protocol Banner */}
      <section className="hero-banner-card">
        <div className="hero-content">
          <div className="hero-tag">
            <span className="hero-tag-glow"></span>
            WINTER ARC PROTOCOL // DISCIPLINE REIGNS
          </div>
          <h1 className="hero-headline display-title">
            TRANSFORMATION IN THE COLD
          </h1>
          <p className="hero-desc">
            At 165 cm and 70 kg, shedding 8 kg of fat makes bodyweight handstands effortless and builds razor-sharp skateboarding balance. Execute the four daily anchors without compromise.
          </p>

          {/* Daily Progress Meter */}
          <div className="protocol-progress-strip">
            <div className="progress-info-row">
              <span className="mono bold">DAILY EXECUTION SCORE</span>
              <span className="mono cyan-glow">{completedCount}/4 ANCHORS DONE ({protocolPercent}%)</span>
            </div>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill cyan"
                style={{ width: `${protocolPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="hero-quick-card">
          <div className="quick-badge">TODAY'S TARGETS</div>
          <div className="quick-metrics-row">
            <div className="quick-metric">
              <span className="qm-label">CALORIE DEFICIT</span>
              <span className="qm-val mono">{profile.dailyCalorieTarget} <small>KCAL</small></span>
            </div>
            <div className="quick-metric">
              <span className="qm-label">PROTEIN GOAL</span>
              <span className="qm-val mono">{profile.dailyProteinTarget} <small>G</small></span>
            </div>
            <div className="quick-metric">
              <span className="qm-label">HYDRATION</span>
              <span className="qm-val mono">3.5 <small>LITERS</small></span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars Interactive Checklist */}
      <section className="pillars-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-title display-title">TODAY'S 4 PROTOCOL ANCHORS</h2>
            <p className="section-sub">Tap to check off each anchor when completed. Consistency over intensity.</p>
          </div>
          {completedCount === 4 && (
            <div className="all-done-badge animate-bounce">
              <Icon name="award" size={16} color="var(--amber-primary)" />
              <span>PERFECT DAY RECORDED</span>
            </div>
          )}
        </div>

        <div className="pillars-grid">
          {protocols.map((p) => {
            const isDone = !!dailyData.completedProtocols[p.key];
            return (
              <div
                key={p.key}
                className={`pillar-card ${isDone ? 'completed' : ''}`}
                onClick={() => toggleProtocol(p.key)}
              >
                <div className="pillar-top">
                  <div className="pillar-icon" style={{ borderColor: isDone ? 'var(--emerald-primary)' : p.color }}>
                    <Icon name={p.icon} size={22} color={isDone ? 'var(--emerald-primary)' : p.color} />
                  </div>
                  <button
                    className={`checkbox-circle ${isDone ? 'checked' : ''}`}
                    aria-label="Toggle completion"
                  >
                    {isDone && <Icon name="check" size={15} color="#fff" />}
                  </button>
                </div>

                <div className="pillar-body">
                  <h3 className="pillar-title">{p.title}</h3>
                  <p className="pillar-sub">{p.sub}</p>
                </div>

                <div className="pillar-footer">
                  <span className={`status-text ${isDone ? 'done' : 'pending'}`}>
                    {isDone ? '✓ EXECUTED' : 'PENDING ACTION'}
                  </span>
                  <button
                    className="launch-tab-link"
                    onClick={(e) => {
                      e.stopPropagation();
                      sounds.playClick();
                      onNavigateTab(p.tab);
                    }}
                  >
                    Open Hub <Icon name="arrow-right" size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recomposition & Biomarkers Command Grid */}
      <section className="metrics-grid">
        {/* Card 1: Weight Drop Tracker */}
        <div className="metric-card">
          <div className="card-top-row">
            <span className="card-tag amber">BODY RECOMPOSITION</span>
            <button
              className="mini-edit-btn"
              onClick={() => { sounds.playClick(); setEditingWeight(!editingWeight); }}
            >
              {editingWeight ? 'Cancel' : 'Log Today'}
            </button>
          </div>

          <div className="weight-display-row">
            <div className="weight-block">
              <span className="metric-caption">CURRENT WEIGHT</span>
              {editingWeight ? (
                <div className="weight-input-group">
                  <input
                    type="number"
                    step="0.1"
                    className="mono weight-input"
                    value={tempWeight}
                    onChange={(e) => setTempWeight(e.target.value)}
                    autoFocus
                  />
                  <button className="save-pill-btn" onClick={handleSaveWeight}>Save</button>
                </div>
              ) : (
                <div className="weight-number mono">
                  {profile.currentWeightKg.toFixed(1)} <span className="unit">KG</span>
                </div>
              )}
            </div>

            <div className="weight-arrow-sep">
              <Icon name="trending-down" size={24} color="var(--amber-primary)" />
            </div>

            <div className="weight-block target">
              <span className="metric-caption">TARGET ATHLETIC</span>
              <div className="weight-number mono target">
                {profile.targetWeightKg.toFixed(1)} <span className="unit">KG</span>
              </div>
            </div>
          </div>

          {/* Progress towards 62kg */}
          <div className="weight-progress-wrap">
            <div className="metric-labels-row">
              <span className="mono">Progress: {lostSoFar.toFixed(1)} kg dropped</span>
              <span className="mono amber-text">{(profile.currentWeightKg - profile.targetWeightKg).toFixed(1)} kg to lean physique</span>
            </div>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill amber"
                style={{ width: `${Math.max(5, weightProgressPct)}%` }}
              ></div>
            </div>
            <div className="recomp-note">
              Height: <strong>165 cm</strong> • Target Body Fat: <strong>11% - 13%</strong> for sharp calisthenics aesthetics.
            </div>
          </div>
        </div>

        {/* Card 2: Protein Anchor */}
        <div className="metric-card">
          <div className="card-top-row">
            <span className="card-tag cyan">DAILY PROTEIN INTAKE</span>
            <span className="mono cyan-glow">{proteinPct}% OF TARGET</span>
          </div>

          <div className="protein-count-row">
            <div className="protein-main mono">
              {dailyData.proteinIntakeG || 0} <span className="unit">/ {profile.dailyProteinTarget}g</span>
            </div>
            <span className={`protein-badge ${proteinPct >= 100 ? 'met' : ''}`}>
              {proteinPct >= 100 ? 'GOAL MET 🔥' : 'PRESERVE MUSCLE'}
            </span>
          </div>

          <div className="progress-bar-track">
            <div
              className="progress-bar-fill cyan"
              style={{ width: `${proteinPct}%` }}
            ></div>
          </div>

          <div className="quick-actions-row">
            <span className="quick-action-label">Quick Add:</span>
            <button className="quick-pill" onClick={() => addProtein(12)}>+12g (2 Eggs)</button>
            <button className="quick-pill" onClick={() => addProtein(25)}>+25g (Paneer/Curd)</button>
            <button className="quick-pill" onClick={() => addProtein(32)}>+32g (Chicken/Shake)</button>
          </div>
        </div>

        {/* Card 3: Hydration Tank */}
        <div className="metric-card">
          <div className="card-top-row">
            <span className="card-tag blue">WATER INTAKE (3.5L GOAL)</span>
            <span className="mono blue-glow">{waterPct}%</span>
          </div>

          <div className="water-count-row">
            <div className="water-main mono">
              {((dailyData.waterIntakeMl || 0) / 1000).toFixed(2)} <span className="unit">/ 3.50 L</span>
            </div>
            <div className="water-drop-icon">
              <Icon name="droplet" size={24} color="#38bdf8" />
            </div>
          </div>

          <div className="progress-bar-track">
            <div
              className="progress-bar-fill blue"
              style={{ width: `${waterPct}%` }}
            ></div>
          </div>

          <div className="quick-actions-row">
            <span className="quick-action-label">Hydrate:</span>
            <button className="quick-pill" onClick={() => addWater(250)}>+250 ml</button>
            <button className="quick-pill" onClick={() => addWater(500)}>+500 ml Glass</button>
            <button
              className="quick-pill outline"
              onClick={() => { sounds.playClick(); setDailyData({ ...dailyData, waterIntakeMl: 0 }); }}
            >
              Reset
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
