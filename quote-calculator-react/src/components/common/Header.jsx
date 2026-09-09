import React from 'react';
import { Calculator, Laptop, Plus, Download, Sparkles } from 'lucide-react';
import { useQuote } from '../../context/QuoteContext';
import { useToast } from './Toast';

export function Header({ activeTab, setActiveTab, onOpenDemo }) {
  const { simulateLead, exportCSV, leads, config } = useQuote();
  const { addToast } = useToast();

  const handleSimulate = () => {
    const lead = simulateLead();
    addToast(`🚀 Test lead simulated: ${lead.name} ($${lead.totalPrice})`, 'success');
  };

  const handleExport = () => {
    if (leads.length === 0) {
      addToast('No leads available to export.', 'info');
      return;
    }
    exportCSV();
    addToast('📥 Exported leads to CSV successfully!', 'success');
  };

  return (
    <header className="master-header">
      <div className="suite-logo-badge" onClick={() => setActiveTab('leads')}>
        <div className="suite-logo-icon">⚡</div>
        <div>
          <div className="suite-title">
            QuoteGenius SaaS
            <span className="suite-subtag">Contractor & Pro Edition</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Dynamic Instant Estimator & Inbound Leads CRM
          </div>
        </div>
      </div>

      <div className="header-right-actions">
        <button
          className="btn btn-secondary"
          onClick={handleExport}
          title="Download all leads as spreadsheet"
          style={{ padding: '8px 14px', fontSize: '12px' }}
        >
          <Download size={14} />
          <span>Export CSV</span>
        </button>

        <button
          className="btn btn-secondary"
          onClick={handleSimulate}
          title="Simulate inbound quote submission"
          style={{ padding: '8px 14px', fontSize: '12px' }}
        >
          <Plus size={14} color="#38bdf8" />
          <span>Simulate Lead</span>
        </button>

        <button
          className="btn btn-primary"
          onClick={onOpenDemo}
          style={{ padding: '8px 16px', fontSize: '12px' }}
        >
          <Laptop size={14} />
          <span>Client Showcase Site</span>
        </button>
      </div>
    </header>
  );
}
