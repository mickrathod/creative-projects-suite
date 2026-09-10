import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Header/Navbar';
import { OverviewTab } from './components/HUD/OverviewTab';
import { HandstandLab } from './components/Handstand/HandstandLab';
import { WorkoutEngine } from './components/Workout/WorkoutEngine';
import { SkateLog } from './components/Skate/SkateLog';
import { JournalTab } from './components/Journal/JournalTab';
import { BackupModal } from './components/Modals/BackupModal';
import { sounds } from './audio/sound-effects';
import {
  loadProfile,
  saveProfile,
  loadDailyData,
  saveDailyData,
  loadHandstandPRs,
  loadSkateSkills,
  loadSkateLogs,
  loadJournalHistory
} from './data/storage';
import './App.css';

export function App() {
  const [activeTab, setActiveTab] = useState('hud');
  const [profile, setProfile] = useState(loadProfile);
  const [dailyData, setDailyData] = useState(loadDailyData);
  const [handstandPRs, setHandstandPRs] = useState(loadHandstandPRs);
  const [skateSkills, setSkateSkills] = useState(loadSkateSkills);
  const [skateLogs, setSkateLogs] = useState(loadSkateLogs);
  const [history, setHistory] = useState(loadJournalHistory);
  const [isMuted, setIsMuted] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);

  // Sync profile changes
  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  // Sync daily changes
  useEffect(() => {
    saveDailyData(dailyData);
  }, [dailyData]);

  const reloadAllData = () => {
    setProfile(loadProfile());
    setDailyData(loadDailyData());
    setHandstandPRs(loadHandstandPRs());
    setSkateSkills(loadSkateSkills());
    setSkateLogs(loadSkateLogs());
    setHistory(loadJournalHistory());
  };

  const handleMarkWorkoutDone = () => {
    setDailyData(prev => ({
      ...prev,
      completedProtocols: {
        ...prev.completedProtocols,
        workout: true
      }
    }));
  };

  const handleMarkSkateDone = () => {
    setDailyData(prev => ({
      ...prev,
      completedProtocols: {
        ...prev.completedProtocols,
        skate: true
      }
    }));
  };

  return (
    <div className="app-layout">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        streak={3}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        onOpenBackup={() => setShowBackupModal(true)}
      />

      {/* Main Content Area */}
      <main className="main-content-wrapper">
        {activeTab === 'hud' && (
          <OverviewTab
            profile={profile}
            setProfile={setProfile}
            dailyData={dailyData}
            setDailyData={setDailyData}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'handstand' && (
          <HandstandLab
            handstandPRs={handstandPRs}
            setHandstandPRs={setHandstandPRs}
          />
        )}

        {activeTab === 'workout' && (
          <WorkoutEngine
            onMarkWorkoutDone={handleMarkWorkoutDone}
          />
        )}

        {activeTab === 'skate' && (
          <SkateLog
            profile={profile}
            setProfile={setProfile}
            skateSkills={skateSkills}
            setSkateSkills={setSkateSkills}
            skateLogs={skateLogs}
            setSkateLogs={setSkateLogs}
            onMarkSkateDone={handleMarkSkateDone}
          />
        )}

        {activeTab === 'journal' && (
          <JournalTab
            profile={profile}
            history={history}
            setHistory={setHistory}
            handstandPRs={handstandPRs}
            dailyData={dailyData}
          />
        )}
      </main>

      {/* Footer / Status Bar */}
      <footer className="footer-bar">
        <div className="footer-inner">
          <div className="footer-left mono">
            <span className="footer-status-dot"></span>
            <span>SYSTEM ACTIVE // 165CM • 70KG RECOMP PROTOCOL</span>
          </div>
          <div className="footer-center mono">
            "Suffer the pain of discipline or suffer the pain of regret."
          </div>
          <div className="footer-right mono">
            WINTER ARC OS v1.0
          </div>
        </div>
      </footer>

      {/* Data Backup Modal */}
      <BackupModal
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
        onDataReloaded={reloadAllData}
      />
    </div>
  );
}

export default App;
