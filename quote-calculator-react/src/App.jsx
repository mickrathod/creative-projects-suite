import React, { useState } from 'react';
import { Table, Sliders, Laptop, Code2, BookOpen, Plus, Download, Sparkles } from 'lucide-react';
import { ToastProvider, useToast } from './components/common/Toast';
import { QuoteProvider, useQuote } from './context/QuoteContext';
import { Header } from './components/common/Header';
import { LeadsCRM } from './components/LeadsCRM';
import { CalculatorBuilder } from './components/CalculatorBuilder';
import { ClientDemoSite } from './components/ClientDemoSite';
import { EmbedGenerator } from './components/EmbedGenerator';
import { SalesPlaybook } from './components/SalesPlaybook';

function QuoteApp() {
  const [activeTab, setActiveTab] = useState('leads'); // 'leads', 'builder', 'embed', 'sales', 'demo'
  const { totalLeadsCount, pipelineValue, conversionRate, config, simulateLead } = useQuote();
  const { addToast } = useToast();

  const handleSimulate = () => {
    const lead = simulateLead();
    addToast(`🚀 Test lead simulated: ${lead.name} ($${lead.totalPrice})`, 'success');
  };

  if (activeTab === 'demo') {
    return <ClientDemoSite onClose={() => setActiveTab('leads')} />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDemo={() => setActiveTab('demo')}
      />

      {/* Sub-Header Navigation Tabs */}
      <div className="subnav-bar">
        <div className="tabs-group">
          <button
            className={`tab-btn ${activeTab === 'leads' ? 'active' : ''}`}
            onClick={() => setActiveTab('leads')}
          >
            <Table size={15} />
            <span>Leads Inbox (CRM)</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'builder' ? 'active' : ''}`}
            onClick={() => setActiveTab('builder')}
          >
            <Sliders size={15} />
            <span>Calculator Builder</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'embed' ? 'active' : ''}`}
            onClick={() => setActiveTab('embed')}
          >
            <Code2 size={15} />
            <span>Embed Code</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'sales' ? 'active' : ''}`}
            onClick={() => setActiveTab('sales')}
          >
            <BookOpen size={15} />
            <span>Sales Playbook</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={() => setActiveTab('demo')}>
            <Laptop size={15} color="#38bdf8" />
            <span>Open Full Client Demo Page</span>
          </button>
          <button className="btn btn-primary" onClick={handleSimulate}>
            <Plus size={15} />
            <span>Simulate Lead</span>
          </button>
        </div>
      </div>

      <div className="dashboard-container" style={{ flex: 1 }}>
        {/* Top Metric Cards */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-card-top">
              <span className="metric-label">Total Inbound Leads</span>
              <div className="metric-icon-wrap">📥</div>
            </div>
            <div className="metric-value">{totalLeadsCount}</div>
            <div className="metric-sub">
              <span>↑ Active</span> Inbound submissions
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-card-top">
              <span className="metric-label">Pipeline Quote Value</span>
              <div className="metric-icon-wrap">💰</div>
            </div>
            <div className="metric-value" style={{ color: 'var(--accent-emerald)' }}>
              {config.currency}{pipelineValue.toLocaleString()}
            </div>
            <div className="metric-sub">
              <span>Calculated</span> Real-time estimates
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-card-top">
              <span className="metric-label">Conversion Rate</span>
              <div className="metric-icon-wrap">📈</div>
            </div>
            <div className="metric-value" style={{ color: '#38bdf8' }}>
              {conversionRate}%
            </div>
            <div className="metric-sub">
              <span>+14.2%</span> vs static inquiry forms
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-card-top">
              <span className="metric-label">Client Subscription ROI</span>
              <div className="metric-icon-wrap">⚡</div>
            </div>
            <div className="metric-value">
              $39<span style={{ fontSize: '15px', color: 'var(--text-muted)' }}>/mo</span>
            </div>
            <div className="metric-sub">
              <span>Zero API Cost</span> 100% pure recurring profit
            </div>
          </div>
        </div>

        {/* Tab Content Panel */}
        <div className="card-panel">
          {activeTab === 'leads' && <LeadsCRM />}
          {activeTab === 'builder' && <CalculatorBuilder />}
          {activeTab === 'embed' && <EmbedGenerator />}
          {activeTab === 'sales' && <SalesPlaybook />}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <QuoteProvider>
        <QuoteApp />
      </QuoteProvider>
    </ToastProvider>
  );
}
