// LocalStorage synchronization and import/export utility for WinterArc OS

import { INITIAL_USER_PROFILE, INITIAL_DAILY_DATA, SKATE_SKILLS } from './initial-state';

const STORAGE_KEYS = {
  PROFILE: 'winterarc_profile_v1',
  DAILY: 'winterarc_daily_v1',
  HISTORY: 'winterarc_history_v1',
  HANDSTAND_PRS: 'winterarc_handstand_prs_v1',
  SKATE_LOGS: 'winterarc_skate_logs_v1',
  SKATE_PROGRESS: 'winterarc_skate_skills_v1',
  STREAK: 'winterarc_streak_v1'
};

export function loadProfile() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return saved ? { ...INITIAL_USER_PROFILE, ...JSON.parse(saved) } : INITIAL_USER_PROFILE;
  } catch (e) {
    console.error(e);
    return INITIAL_USER_PROFILE;
  }
}

export function saveProfile(profile) {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error(e);
  }
}

export function loadDailyData() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem(STORAGE_KEYS.DAILY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.date === today) {
        return parsed;
      }
    }
    // Return fresh daily data for today
    return { ...INITIAL_DAILY_DATA, date: today };
  } catch (e) {
    return INITIAL_DAILY_DATA;
  }
}

export function saveDailyData(data) {
  try {
    localStorage.setItem(STORAGE_KEYS.DAILY, JSON.stringify(data));
  } catch (e) {
    console.error(e);
  }
}

export function loadHandstandPRs() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.HANDSTAND_PRS);
    if (saved) return JSON.parse(saved);
    // Initial default seed PRs for realistic progression curve
    return [
      { date: 'Day -3', sec: 12, mode: 'Chest-to-Wall' },
      { date: 'Day -1', sec: 18, mode: 'Chest-to-Wall' },
      { date: 'Today', sec: 24, mode: 'Chest-to-Wall' }
    ];
  } catch (e) {
    return [];
  }
}

export function saveHandstandPR(sec, mode = 'Chest-to-Wall') {
  try {
    const prs = loadHandstandPRs();
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const updated = [...prs, { date: today, sec, mode }];
    localStorage.setItem(STORAGE_KEYS.HANDSTAND_PRS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error(e);
    return [];
  }
}

export function loadSkateLogs() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SKATE_LOGS);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 1,
        date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
        durationMins: 35,
        spot: "Local Parking Lot / Smooth Asphalt",
        notes: "Found regular stance. Practiced pushing and foot brake stopping smoothly.",
        caloriesBurned: 205
      }
    ];
  } catch (e) {
    return [];
  }
}

export function saveSkateLog(log) {
  try {
    const logs = loadSkateLogs();
    const updated = [log, ...logs];
    localStorage.setItem(STORAGE_KEYS.SKATE_LOGS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error(e);
    return [];
  }
}

export function loadSkateSkills() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SKATE_PROGRESS);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with SKATE_SKILLS to always guarantee image, name, description, and steps are up-to-date
      return SKATE_SKILLS.map(skill => {
        const found = Array.isArray(parsed) ? parsed.find(s => s.id === skill.id) : null;
        return found ? { ...skill, unlocked: !!found.unlocked } : skill;
      });
    }
    return SKATE_SKILLS;
  } catch (e) {
    return SKATE_SKILLS;
  }
}

export function saveSkateSkills(skills) {
  try {
    localStorage.setItem(STORAGE_KEYS.SKATE_PROGRESS, JSON.stringify(skills));
  } catch (e) {
    console.error(e);
  }
}

export function loadJournalHistory() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (saved) return JSON.parse(saved);
    return [
      {
        date: new Date().toISOString().split('T')[0],
        weightKg: 70.0,
        proteinG: 130,
        completedAll: true,
        mood: "Locked In 🔥",
        reflection: "Started the Winter Arc at 70kg. Target 62kg lean physique with solid handstand hold and confident skateboard cruising."
      }
    ];
  } catch (e) {
    return [];
  }
}

export function saveJournalEntry(entry) {
  try {
    const history = loadJournalHistory();
    // Replace if same date exists, else prepend
    const filtered = history.filter(h => h.date !== entry.date);
    const updated = [entry, ...filtered];
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error(e);
    return [];
  }
}

export function exportBackup() {
  const data = {
    profile: loadProfile(),
    daily: loadDailyData(),
    handstandPRs: loadHandstandPRs(),
    skateLogs: loadSkateLogs(),
    skateSkills: loadSkateSkills(),
    history: loadJournalHistory(),
    exportDate: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `winterarc-protocol-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importBackup(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (data.profile) localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(data.profile));
    if (data.daily) localStorage.setItem(STORAGE_KEYS.DAILY, JSON.stringify(data.daily));
    if (data.handstandPRs) localStorage.setItem(STORAGE_KEYS.HANDSTAND_PRS, JSON.stringify(data.handstandPRs));
    if (data.skateLogs) localStorage.setItem(STORAGE_KEYS.SKATE_LOGS, JSON.stringify(data.skateLogs));
    if (data.skateSkills) localStorage.setItem(STORAGE_KEYS.SKATE_PROGRESS, JSON.stringify(data.skateSkills));
    if (data.history) localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(data.history));
    return true;
  } catch (e) {
    console.error("Failed to import backup", e);
    return false;
  }
}
