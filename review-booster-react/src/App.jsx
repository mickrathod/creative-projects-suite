import React, { useState } from 'react';
import { QrCode, Inbox, BookOpen, Smartphone, Printer, Star, ShieldCheck } from 'lucide-react';
import { ToastProvider, useToast } from './components/common/Toast';
import { ReviewProvider, useReview } from './context/ReviewContext';
import { Header } from './components/common/Header';
import { QRStandDesigner } from './components/QRStandDesigner';
import { PrivateInboxCRM } from './components/PrivateInboxCRM';
import { FunnelSimulator } from './components/FunnelSimulator';
import { SalesPitch } from './components/SalesPitch';

function ReviewApp() {
  const [activeTab, setActiveTab] = useState('qr'); // 'qr', 'inbox', 'sales', 'funnel'
  const { stats, positivePercent, feedbackList } = useReview();

  const unresolvedCount = feedbackList.filter(f => !f.resolved).length;

  if (activeTab === 'funnel') {
    return <FunnelSimulator onClose={() => setActiveTab('qr')} />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenFunnel={() => setActiveTab('funnel')}
      />

      {/* Subnav Bar */}
      <div className="subnav-bar">
        <div className="tabs-group">
          <button
            className={`tab-btn ${activeTab === 'qr' ? 'active' : ''}`}
            onClick={() => setActiveTab('qr')}
          >
            <QrCode size={15} />
            <span>QR & Stand Generator</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'inbox' ? 'active' : ''}`}
            onClick={() => setActiveTab('inbox')}
          >
            <Inbox size={15} />
            <span>Private Feedback Inbox</span>
            {unresolvedCount > 0 && (
              <span
                style={{
                  background: '#f43f5e',
                  color: '#ffffff',
                  fontSize: '10px',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  fontWeight: 'bold'
                }}
              >
                {unresolvedCount}
              </span>
            )}
          </button>

          <button
            className={`tab-btn ${activeTab === 'sales' ? 'active' : ''}`}
            onClick={() => setActiveTab('sales')}
          >
            <BookOpen size={15} />
            <span>Sales Pitch & Pricing</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-indigo" onClick={() => setActiveTab('funnel')}>
            <Smartphone size={15} />
            <span>Test Mobile Customer Funnel</span>
          </button>
        </div>
      </div>

      <div className="dashboard-container" style={{ flex: 1 }}>
        {/* Metric Cards Row */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-card-top">
              <span className="metric-label">Total Stand QR Scans</span>
              <div className="metric-icon-wrap">📱</div>
            </div>
            <div className="metric-value">{stats.scans}</div>
            <div className="metric-sub">
              <span>↑ Active</span> Customer interactions
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-card-top">
              <span className="metric-label">5-Star Google Reviews</span>
              <div className="metric-icon-wrap">🌟</div>
            </div>
            <div className="metric-value" style={{ color: 'var(--accent-amber)' }}>
              {stats.positives}
            </div>
            <div className="metric-sub">
              <span>{positivePercent}%</span> Positive satisfaction
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-card-top">
              <span className="metric-label">Negative Reviews Intercepted</span>
              <div className="metric-icon-wrap">🛡️</div>
            </div>
            <div className="metric-value" style={{ color: 'var(--accent-emerald)' }}>
              {stats.privates}
            </div>
            <div className="metric-sub">
              <span>100% saved</span> from public Google rating
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-card-top">
              <span className="metric-label">Monthly Subscription ROI</span>
              <div className="metric-icon-wrap">💵</div>
            </div>
            <div className="metric-value">
              $49<span style={{ fontSize: '15px', color: 'var(--text-muted)' }}>/mo</span>
            </div>
            <div className="metric-sub">
              <span>Zero API Costs</span> pure recurring profit
            </div>
          </div>
        </div>

        {/* Tab Content Panel */}
        <div className="card-panel">
          {activeTab === 'qr' && <QRStandDesigner />}
          {activeTab === 'inbox' && <PrivateInboxCRM />}
          {activeTab === 'sales' && <SalesPitch />}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <ReviewProvider>
        <ReviewApp />
      </ReviewProvider>
    </ToastProvider>
  );
}
