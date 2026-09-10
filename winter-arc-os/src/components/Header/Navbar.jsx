import React from 'react';
import { Icon } from '../Common/Icons';
import { sounds } from '../../audio/sound-effects';

export const Navbar = ({
  activeTab,
  setActiveTab,
  profile,
  streak,
  isMuted,
  setIsMuted,
  onOpenBackup
}) => {
  const tabs = [
    { id: 'hud', label: 'Command HUD', icon: 'target', tag: 'DAILY' },
    { id: 'handstand', label: 'Handstand Lab', icon: 'handstand', tag: 'SKILL' },
    { id: 'workout', label: 'Home Circuit', icon: 'dumbbell', tag: '165CM/70KG' },
    { id: 'skate', label: 'Skate Hub', icon: 'skateboard', tag: 'BOARD' },
    { id: 'journal', label: 'Logs & Charts', icon: 'book-open', tag: 'DATA' }
  ];

  const handleTabClick = (tabId) => {
    sounds.playClick();
    setActiveTab(tabId);
  };

  const toggleAudio = () => {
    const next = !isMuted;
    sounds.setMuted(next);
    setIsMuted(next);
    if (!next) sounds.playClick();
  };

  // Calculate day of Winter Arc
  const startDate = new Date(profile.winterArcStartDate || Date.now());
  const now = new Date();
  const diffTime = Math.abs(now - startDate);
  const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand & Protocol Status */}
        <div className="navbar-brand-section">
          <div className="brand-logo-wrap">
            <span className="brand-frost-icon">
              <Icon name="snowflake" size={22} color="var(--cyan-primary)" />
            </span>
            <div>
              <div className="brand-title">WINTER ARC <span className="brand-badge">PROTOCOL</span></div>
              <div className="brand-subtitle mono">70KG $\rightarrow$ 62KG // HANDSTAND // SKATE</div>
            </div>
          </div>

          <div className="brand-stats-row">
            <div className="stat-pill cyan">
              <span className="dot animate-pulse"></span>
              <span className="mono">DAY {diffDays}</span>
              <span className="pill-sub">/ 90</span>
            </div>

            <div className="stat-pill amber">
              <Icon name="flame" size={14} color="var(--amber-primary)" />
              <span className="mono">{streak || 1} DAY STREAK</span>
            </div>
          </div>
        </div>

        {/* Global Controls: Sound, Backup, Profile summary */}
        <div className="navbar-actions">
          <button
            className={`action-btn ${isMuted ? 'muted' : ''}`}
            onClick={toggleAudio}
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
            aria-label="Toggle Audio"
          >
            <Icon name={isMuted ? "volume-x" : "volume-2"} size={17} />
          </button>

          <button
            className="action-btn backup"
            onClick={() => { sounds.playClick(); onOpenBackup(); }}
            title="Backup / Restore Winter Arc Data"
          >
            <Icon name="download" size={16} />
            <span className="btn-text">DATA</span>
          </button>
        </div>
      </div>

      {/* Main Tab Navigation Bar */}
      <nav className="navbar-tabs-scroll">
        <div className="navbar-tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`nav-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleTabClick(tab.id)}
              >
                <span className="tab-icon-wrap">
                  <Icon
                    name={tab.icon}
                    size={18}
                    color={isActive ? 'var(--cyan-primary)' : 'var(--text-muted)'}
                  />
                </span>
                <span className="tab-label">{tab.label}</span>
                <span className={`tab-tag ${isActive ? 'active' : ''}`}>{tab.tag}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
