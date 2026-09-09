import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_REVIEW_CONFIG, INITIAL_FEEDBACK_ITEMS } from '../utils/presets';

const ReviewContext = createContext(null);

export function ReviewProvider({ children }) {
  const [bizConfig, setBizConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('rb_biz_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_REVIEW_CONFIG;
  });

  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem('rb_stats');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { scans: 142, positives: 128, privates: 14 };
  });

  const [feedbackList, setFeedbackList] = useState(() => {
    try {
      const saved = localStorage.getItem('rb_feedback_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_FEEDBACK_ITEMS;
  });

  // Persist state
  useEffect(() => {
    localStorage.setItem('rb_biz_config', JSON.stringify(bizConfig));
  }, [bizConfig]);

  useEffect(() => {
    localStorage.setItem('rb_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('rb_feedback_list', JSON.stringify(feedbackList));
  }, [feedbackList]);

  // Actions
  const updateBizConfig = (newFields) => {
    setBizConfig(prev => ({ ...prev, ...newFields }));
  };

  const trackScan = () => {
    setStats(prev => ({ ...prev, scans: prev.scans + 1 }));
  };

  const recordPositiveReview = () => {
    setStats(prev => ({ ...prev, positives: prev.positives + 1 }));
  };

  const submitPrivateFeedback = ({ customerName, contact, feedback, rating }) => {
    const newItem = {
      id: 'fb-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      createdAt: new Date().toISOString(),
      customerName: customerName || 'Anonymous Customer',
      contact: contact || 'Not Provided',
      feedback: feedback || '',
      rating: rating || 2,
      status: 'Pending',
      resolved: false
    };

    setFeedbackList(prev => [newItem, ...prev]);
    setStats(prev => ({ ...prev, privates: prev.privates + 1 }));
    return newItem;
  };

  const updateFeedbackStatus = (id, status) => {
    setFeedbackList(prev => prev.map(item => item.id === id ? { ...item, status, resolved: status === 'Resolved' } : item));
  };

  const toggleResolved = (id) => {
    setFeedbackList(prev => prev.map(item => {
      if (item.id === id) {
        const nextResolved = !item.resolved;
        return {
          ...item,
          resolved: nextResolved,
          status: nextResolved ? 'Resolved' : 'Pending'
        };
      }
      return item;
    }));
  };

  const deleteFeedback = (id) => {
    setFeedbackList(prev => prev.filter(item => item.id !== id));
  };

  const exportFeedbackCSV = () => {
    if (feedbackList.length === 0) return false;
    const headers = ['ID', 'Date', 'Rating', 'Customer Name', 'Contact Info', 'Feedback Message', 'Status', 'Resolved'];
    const rows = feedbackList.map(f => [
      f.id,
      new Date(f.createdAt).toLocaleDateString() + ' ' + new Date(f.createdAt).toLocaleTimeString(),
      `${f.rating} Stars`,
      `"${(f.customerName || '').replace(/"/g, '""')}"`,
      `"${(f.contact || '').replace(/"/g, '""')}"`,
      `"${(f.feedback || '').replace(/"/g, '""')}"`,
      f.status,
      f.resolved ? 'Yes' : 'No'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `feedback_${bizConfig.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  };

  const positivePercent = (stats.positives + stats.privates > 0)
    ? ((stats.positives / (stats.positives + stats.privates)) * 100).toFixed(1)
    : '90.1';

  return (
    <ReviewContext.Provider value={{
      bizConfig,
      stats,
      feedbackList,
      positivePercent,
      updateBizConfig,
      trackScan,
      recordPositiveReview,
      submitPrivateFeedback,
      updateFeedbackStatus,
      toggleResolved,
      deleteFeedback,
      exportFeedbackCSV
    }}>
      {children}
    </ReviewContext.Provider>
  );
}

export function useReview() {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReview must be used within a ReviewProvider');
  }
  return context;
}
