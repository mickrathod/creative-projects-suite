import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, CheckCircle, Download, Trash2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useReview } from '../context/ReviewContext';
import { useToast } from './common/Toast';

export function PrivateInboxCRM() {
  const {
    feedbackList,
    toggleResolved,
    deleteFeedback,
    exportFeedbackCSV,
    bizConfig
  } = useReview();

  const { addToast } = useToast();
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'resolved'

  const filteredList = feedbackList.filter(item => {
    if (filter === 'pending') return !item.resolved;
    if (filter === 'resolved') return item.resolved;
    return true;
  });

  const handleExport = () => {
    const ok = exportFeedbackCSV();
    if (ok) addToast('Exported intercepted feedback to CSV', 'success');
    else addToast('No feedback data to export', 'error');
  };

  return (
    <div>
      <div className="panel-header" style={{ marginBottom: '20px' }}>
        <div>
          <h2 className="panel-title">Private Feedback Inbox (Intercepted Complaints)</h2>
          <p className="panel-desc">
            These customers rated 1–3 stars. Their negative reviews were safely intercepted before reaching your public Google rating, giving you the chance to make it right.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={handleExport}>
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button
          className={`btn ${filter === 'all' ? 'btn-indigo' : 'btn-secondary'}`}
          style={{ fontSize: '12px', padding: '6px 14px' }}
          onClick={() => setFilter('all')}
        >
          All Messages ({feedbackList.length})
        </button>
        <button
          className={`btn ${filter === 'pending' ? 'btn-indigo' : 'btn-secondary'}`}
          style={{ fontSize: '12px', padding: '6px 14px' }}
          onClick={() => setFilter('pending')}
        >
          Unresolved ({feedbackList.filter(f => !f.resolved).length})
        </button>
        <button
          className={`btn ${filter === 'resolved' ? 'btn-indigo' : 'btn-secondary'}`}
          style={{ fontSize: '12px', padding: '6px 14px' }}
          onClick={() => setFilter('resolved')}
        >
          Resolved ({feedbackList.filter(f => f.resolved).length})
        </button>
      </div>

      {/* Feedback Data Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Rating</th>
              <th>Customer</th>
              <th>Contact</th>
              <th>Private Feedback Note</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>🛡️</div>
                  <div>No intercepted complaints in this view. Your public reputation is clean!</div>
                </td>
              </tr>
            ) : (
              filteredList.map(item => (
                <tr key={item.id} style={{ background: item.resolved ? 'transparent' : 'rgba(244, 63, 94, 0.03)' }}>
                  <td style={{ fontSize: '12px', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                    {new Date(item.createdAt).toLocaleDateString()}<br />
                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td>
                    <span style={{
                      color: item.rating === 1 ? '#f43f5e' : item.rating === 2 ? '#fb923c' : '#fbbf24',
                      fontWeight: 800,
                      fontSize: '14px'
                    }}>
                      {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, color: '#ffffff' }}>
                    {item.customerName}
                  </td>
                  <td>
                    <div style={{ fontSize: '12px', color: '#cbd5e1' }}>{item.contact}</div>
                  </td>
                  <td style={{ maxWidth: '300px' }}>
                    <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: 1.4 }}>
                      "{item.feedback}"
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        toggleResolved(item.id);
                        addToast(`Marked as ${item.resolved ? 'Pending' : 'Resolved'}`, 'info');
                      }}
                      className={`status-pill ${item.resolved ? 'resolved' : 'pending'}`}
                      style={{ cursor: 'pointer', border: 'none' }}
                    >
                      {item.resolved ? '✓ Resolved' : '● Action Needed'}
                    </button>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <a
                        href={`https://wa.me/${(item.contact || '').replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${item.customerName}, this is the manager from ${bizConfig.name}. Thank you for your honest feedback regarding your visit. We would love to make this right for you.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-emerald"
                        style={{ padding: '6px 8px', textDecoration: 'none' }}
                        title="Reach out on WhatsApp"
                      >
                        <MessageSquare size={13} />
                      </a>
                      <button
                        className="btn btn-danger"
                        style={{ padding: '6px 8px' }}
                        title="Delete record"
                        onClick={() => {
                          deleteFeedback(item.id);
                          addToast('Feedback item removed', 'info');
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
