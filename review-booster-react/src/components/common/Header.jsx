import React from 'react';
import { QrCode, Smartphone, Printer, Star, Download } from 'lucide-react';
import { useReview } from '../../context/ReviewContext';
import { useToast } from './Toast';

export function Header({ activeTab, setActiveTab, onOpenFunnel }) {
  const { exportFeedbackCSV, feedbackList } = useReview();
  const { addToast } = useToast();

  const handleExport = () => {
    if (feedbackList.length === 0) {
      addToast('No private feedback to export.', 'info');
      return;
    }
    exportFeedbackCSV();
    addToast('📥 Exported private feedback to CSV!', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="master-header">
      <div className="suite-logo-badge" onClick={() => setActiveTab('qr')}>
        <div className="suite-logo-icon">⭐</div>
        <div>
          <div className="suite-title">
            ReviewBooster SaaS
            <span className="suite-subtag">Local Business Edition</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Smart QR Stand Designer & Negative Review Intercept CRM
          </div>
        </div>
      </div>

      <div className="header-right-actions">
        <button
          className="btn btn-secondary"
          onClick={handleExport}
          title="Download private complaints log"
          style={{ padding: '8px 14px', fontSize: '12px' }}
        >
          <Download size={14} />
          <span>Export Feedback</span>
        </button>

        <button
          className="btn btn-secondary"
          onClick={handlePrint}
          title="Print Counter Stand (Ctrl + P)"
          style={{ padding: '8px 14px', fontSize: '12px' }}
        >
          <Printer size={14} color="#a5b4fc" />
          <span>Print Stand (Ctrl+P)</span>
        </button>

        <button
          className="btn btn-indigo"
          onClick={onOpenFunnel}
          style={{ padding: '8px 16px', fontSize: '12px' }}
        >
          <Smartphone size={14} />
          <span>Mobile Funnel Simulator</span>
        </button>
      </div>
    </header>
  );
}
