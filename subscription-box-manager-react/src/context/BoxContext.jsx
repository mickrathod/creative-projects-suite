import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_BOX_CONFIG, INITIAL_BOX_THEMES, INITIAL_SUBSCRIBERS } from '../utils/presets';

const BoxContext = createContext(null);

const PLAN_PRICE = { Monthly: 34, Quarterly: 96, Annual: 384 };

export function BoxProvider({ children }) {
  const [boxConfig, setBoxConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('sbm_box_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_BOX_CONFIG;
  });

  const [themes, setThemes] = useState(() => {
    try {
      const saved = localStorage.getItem('sbm_themes');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_BOX_THEMES;
  });

  const [subscribers, setSubscribers] = useState(() => {
    try {
      const saved = localStorage.getItem('sbm_subscribers');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_SUBSCRIBERS;
  });

  useEffect(() => {
    localStorage.setItem('sbm_box_config', JSON.stringify(boxConfig));
  }, [boxConfig]);

  useEffect(() => {
    localStorage.setItem('sbm_themes', JSON.stringify(themes));
  }, [themes]);

  useEffect(() => {
    localStorage.setItem('sbm_subscribers', JSON.stringify(subscribers));
  }, [subscribers]);

  const updateBoxConfig = (newFields) => {
    setBoxConfig(prev => ({ ...prev, ...newFields }));
  };

  const addTheme = (item) => {
    const newItem = {
      id: 'theme-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      createdAt: new Date().toISOString(),
      status: 'Planning',
      ...item
    };
    setThemes(prev => [newItem, ...prev]);
    return newItem;
  };

  const updateThemeStatus = (id, status) => {
    setThemes(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const deleteTheme = (id) => {
    setThemes(prev => prev.filter(t => t.id !== id));
  };

  const addSubscriber = ({ name, email, plan }) => {
    const newSub = {
      id: 'sub-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      createdAt: new Date().toISOString(),
      name: name || 'New Subscriber',
      email: email || '',
      plan: plan || 'Monthly',
      status: 'Active',
      lifetimeValue: 0
    };
    setSubscribers(prev => [newSub, ...prev]);
    return newSub;
  };

  const updateSubscriberStatus = (id, status) => {
    setSubscribers(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const deleteSubscriber = (id) => {
    setSubscribers(prev => prev.filter(s => s.id !== id));
  };

  const exportSubscribersCSV = () => {
    if (subscribers.length === 0) return false;
    const headers = ['ID', 'Joined', 'Name', 'Email', 'Plan', 'Status', 'Lifetime Value'];
    const rows = subscribers.map(s => [
      s.id,
      new Date(s.createdAt).toLocaleDateString(),
      `"${(s.name || '').replace(/"/g, '""')}"`,
      s.email,
      s.plan,
      s.status,
      s.lifetimeValue
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `subscribers_${boxConfig.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  };

  const activeSubscribers = subscribers.filter(s => s.status === 'Active');
  const pausedSubscribers = subscribers.filter(s => s.status === 'Paused');
  const cancelledSubscribers = subscribers.filter(s => s.status === 'Cancelled');

  const mrr = activeSubscribers.reduce((sum, s) => {
    const price = PLAN_PRICE[s.plan] || 0;
    const monthly = s.plan === 'Quarterly' ? price / 3 : s.plan === 'Annual' ? price / 12 : price;
    return sum + monthly;
  }, 0);

  const churnRate = subscribers.length > 0
    ? ((cancelledSubscribers.length / subscribers.length) * 100).toFixed(1)
    : '0.0';

  const avgLTV = subscribers.length > 0
    ? (subscribers.reduce((sum, s) => sum + s.lifetimeValue, 0) / subscribers.length).toFixed(0)
    : '0';

  return (
    <BoxContext.Provider value={{
      boxConfig,
      themes,
      subscribers,
      activeSubscribers,
      pausedSubscribers,
      cancelledSubscribers,
      mrr,
      churnRate,
      avgLTV,
      updateBoxConfig,
      addTheme,
      updateThemeStatus,
      deleteTheme,
      addSubscriber,
      updateSubscriberStatus,
      deleteSubscriber,
      exportSubscribersCSV
    }}>
      {children}
    </BoxContext.Provider>
  );
}

export function useBox() {
  const context = useContext(BoxContext);
  if (!context) {
    throw new Error('useBox must be used within a BoxProvider');
  }
  return context;
}
