import React, { useState } from 'react';
import { Package, Users, BookOpen, Smartphone, TrendingDown, DollarSign } from 'lucide-react';
import { ToastProvider } from './components/common/Toast';
import { BoxProvider, useBox } from './context/BoxContext';
import { Header } from './components/common/Header';
import { BoxThemeBuilder } from './components/BoxThemeBuilder';
import { SubscriberCRM } from './components/SubscriberCRM';
import { FunnelSimulator } from './components/FunnelSimulator';
import { SalesPitch } from './components/SalesPitch';

function BoxApp() {
  const [activeTab, setActiveTab] = useState('themes'); // 'themes', 'subscribers', 'sales', 'funnel'
  const { activeSubscribers, subscribers, mrr, churnRate, avgLTV } = useBox();

  if (activeTab === 'funnel') {
    return <FunnelSimulator onClose={() => setActiveTab('themes')} />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenFunnel={() => setActiveTab('funnel')}
      />

      <div className="subnav-bar">
        <div className="tabs-group">
          <button
            className={`tab-btn ${activeTab === 'themes' ? 'active' : ''}`}
            onClick={() => setActiveTab('themes')}
          >
            <Package size={15} />
            <span>Box Theme Builder</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'subscribers' ? 'active' : ''}`}
            onClick={() => setActiveTab('subscribers')}
          >
            <Users size={15} />
            <span>Subscriber CRM</span>
            {subscribers.length > 0 && (
              <span
                style={{
                  background: '#7c3aed',
                  color: '#ffffff',
                  fontSize: '10px',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  fontWeight: 'bold'
                }}
              >
                {subscribers.length}
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
            <span>Test Signup Flow</span>
          </button>
        </div>
      </div>

      <div className="dashboard-container" style={{ flex: 1 }}>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-card-top">
              <span className="metric-label">Monthly Recurring Revenue</span>
              <div className="metric-icon-wrap"><DollarSign size={16} /></div>
            </div>
            <div className="metric-value">${mrr.toFixed(0)}</div>
            <div className="metric-sub">
              <span>{activeSubscribers.length}</span> active subscribers
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-card-top">
              <span className="metric-label">Churn Rate</span>
              <div className="metric-icon-wrap"><TrendingDown size={16} /></div>
            </div>
            <div className="metric-value" style={{ color: 'var(--accent-rose)' }}>{churnRate}%</div>
            <div className="metric-sub">
              <span>Tracked</span> across all-time subscribers
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-card-top">
              <span className="metric-label">Avg. Lifetime Value</span>
              <div className="metric-icon-wrap">💎</div>
            </div>
            <div className="metric-value" style={{ color: 'var(--accent-amber)' }}>${avgLTV}</div>
            <div className="metric-sub">
              <span>Per subscriber</span> historical average
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-card-top">
              <span className="metric-label">Dashboard Subscription ROI</span>
              <div className="metric-icon-wrap">💵</div>
            </div>
            <div className="metric-value">
              $79<span style={{ fontSize: '15px', color: 'var(--text-muted)' }}>/mo</span>
            </div>
            <div className="metric-sub">
              <span>Zero API Costs</span> pure recurring profit
            </div>
          </div>
        </div>

        <div className="card-panel">
          {activeTab === 'themes' && <BoxThemeBuilder />}
          {activeTab === 'subscribers' && <SubscriberCRM />}
          {activeTab === 'sales' && <SalesPitch />}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <BoxProvider>
        <BoxApp />
      </BoxProvider>
    </ToastProvider>
  );
}
