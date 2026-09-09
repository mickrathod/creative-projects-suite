import React from 'react';
import { Smartphone, Printer, Download } from 'lucide-react';
import { useBox } from '../../context/BoxContext';
import { useToast } from './Toast';

export function Header({ activeTab, setActiveTab, onOpenFunnel }) {
  const { exportSubscribersCSV, subscribers } = useBox();
  const { addToast } = useToast();

  const handleExport = () => {
    if (subscribers.length === 0) {
      addToast('No subscribers to export yet.', 'info');
      return;
    }
    exportSubscribersCSV();
    addToast('📥 Exported subscriber list to CSV!', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="master-header">
      <div className="suite-logo-badge" onClick={() => setActiveTab('themes')}>
        <div className="suite-logo-icon">📦</div>
        <div>
          <div className="suite-title">
            BoxOps SaaS
            <span className="suite-subtag">Subscription Box Edition</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Box Builder, Subscriber CRM & Recurring Revenue Dashboard
          </div>
        </div>
      </div>

      <div className="header-right-actions">
        <button
          className="btn btn-secondary"
          onClick={handleExport}
          title="Download subscriber list"
          style={{ padding: '8px 14px', fontSize: '12px' }}
        >
          <Download size={14} />
          <span>Export Subscribers</span>
        </button>

        <button
          className="btn btn-secondary"
          onClick={handlePrint}
          title="Print packing sheet (Ctrl + P)"
          style={{ padding: '8px 14px', fontSize: '12px' }}
        >
          <Printer size={14} color="#c4b5fd" />
          <span>Print Packing Sheet</span>
        </button>

        <button
          className="btn btn-indigo"
          onClick={onOpenFunnel}
          style={{ padding: '8px 16px', fontSize: '12px' }}
        >
          <Smartphone size={14} />
          <span>Mobile Signup Preview</span>
        </button>
      </div>
    </header>
  );
}
