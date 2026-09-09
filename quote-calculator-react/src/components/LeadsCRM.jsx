import React, { useState } from 'react';
import { Search, Download, Plus, Trash2, Eye, Phone, Mail, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { useQuote } from '../context/QuoteContext';
import { useToast } from './common/Toast';

export function LeadsCRM() {
  const {
    leads,
    crmFilter,
    searchQuery,
    setCrmFilter,
    setSearchQuery,
    updateLeadStatus,
    deleteLead,
    simulateLead,
    exportCSV,
    config
  } = useQuote();

  const { addToast } = useToast();
  const [selectedLead, setSelectedLead] = useState(null);

  // Filtering
  const filteredLeads = leads.filter(lead => {
    const matchesFilter = crmFilter === 'All' || lead.status === crmFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      (lead.name && lead.name.toLowerCase().includes(q)) ||
      (lead.phone && lead.phone.toLowerCase().includes(q)) ||
      (lead.serviceName && lead.serviceName.toLowerCase().includes(q)) ||
      (lead.email && lead.email.toLowerCase().includes(q));
    return matchesFilter && matchesSearch;
  });

  const handleSimulate = () => {
    const newLead = simulateLead();
    addToast(`Simulated incoming quote lead from ${newLead.name}!`, 'info');
  };

  const handleExport = () => {
    const success = exportCSV();
    if (success) {
      addToast('Leads exported to CSV successfully', 'success');
    } else {
      addToast('No leads available to export', 'error');
    }
  };

  return (
    <div>
      {/* Top Action Bar */}
      <div className="panel-header" style={{ marginBottom: '20px' }}>
        <div>
          <h2 className="panel-title">Captured Inbound Leads (CRM)</h2>
          <p className="panel-desc">
            All prospective clients who calculated an instant estimate and locked in their booking request.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={handleExport}>
            <Download size={15} />
            <span>Export CSV</span>
          </button>
          <button className="btn btn-primary" onClick={handleSimulate}>
            <Plus size={16} />
            <span>Simulate New Lead</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        {/* Status Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['All', 'New', 'Contacted', 'Converted', 'Lost'].map(status => (
            <button
              key={status}
              onClick={() => setCrmFilter(status)}
              style={{
                background: crmFilter === status ? '#2563eb' : 'rgba(255, 255, 255, 0.05)',
                color: crmFilter === status ? '#ffffff' : 'var(--text-muted)',
                border: '1px solid var(--card-border)',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {status} ({status === 'All' ? leads.length : leads.filter(l => l.status === status).length})
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px', height: '38px', fontSize: '13px' }}
            placeholder="Search leads by name, phone, service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Leads Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date / Time</th>
              <th>Customer</th>
              <th>Service</th>
              <th>Add-ons</th>
              <th>Quote Estimate</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>📭</div>
                  <div>No leads matching your current criteria.</div>
                  <button
                    className="btn btn-secondary"
                    style={{ marginTop: '12px', fontSize: '12px' }}
                    onClick={handleSimulate}
                  >
                    Simulate a sample lead
                  </button>
                </td>
              </tr>
            ) : (
              filteredLeads.map(lead => (
                <tr key={lead.id}>
                  <td style={{ fontSize: '12px', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                    {new Date(lead.createdAt).toLocaleDateString()} <br />
                    {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#ffffff' }}>{lead.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{lead.phone}</div>
                    {lead.email && <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{lead.email}</div>}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{lead.serviceName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                      {lead.quantity} {lead.quantityLabel ? `(${lead.quantityLabel})` : ''}
                    </div>
                  </td>
                  <td>
                    {lead.addons && lead.addons.length > 0 ? (
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '200px' }}>
                        {lead.addons.map((a, i) => (
                          <span
                            key={i}
                            style={{
                              background: 'rgba(255, 255, 255, 0.06)',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              color: '#cbd5e1'
                            }}
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>None</span>
                    )}
                  </td>
                  <td>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                      {config.currency}{lead.totalPrice}
                    </div>
                  </td>
                  <td>
                    <select
                      className="form-select"
                      style={{
                        padding: '4px 8px',
                        fontSize: '12px',
                        fontWeight: 700,
                        width: 'auto',
                        background: '#0f172a',
                        color: lead.status === 'Converted' ? '#34d399' :
                               lead.status === 'New' ? '#60a5fa' :
                               lead.status === 'Contacted' ? '#fbbf24' : '#fda4af'
                      }}
                      value={lead.status}
                      onChange={(e) => {
                        updateLeadStatus(lead.id, e.target.value);
                        addToast(`Lead status updated to ${e.target.value}`, 'success');
                      }}
                    >
                      <option value="New">🔵 New</option>
                      <option value="Contacted">🟡 Contacted</option>
                      <option value="Converted">🟢 Converted</option>
                      <option value="Lost">🔴 Lost</option>
                    </select>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '6px 8px' }}
                        title="View Full Details"
                        onClick={() => setSelectedLead(lead)}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="btn btn-danger"
                        style={{ padding: '6px 8px' }}
                        title="Delete Lead"
                        onClick={() => {
                          deleteLead(lead.id);
                          addToast('Lead deleted', 'info');
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Lead Details Modal */}
      {selectedLead && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#0f172a',
            border: '1px solid var(--card-border)',
            borderRadius: '20px',
            maxWidth: '520px',
            width: '100%',
            padding: '28px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Lead Details</h3>
              <button
                className="btn btn-secondary"
                style={{ padding: '4px 10px' }}
                onClick={() => setSelectedLead(null)}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Customer Name</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>{selectedLead.name}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Phone Number</div>
                  <a href={`tel:${selectedLead.phone}`} style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} /> {selectedLead.phone}
                  </a>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Email Address</div>
                  <div style={{ color: '#cbd5e1', fontSize: '13px' }}>{selectedLead.email || 'Not provided'}</div>
                </div>
              </div>

              <div style={{ background: '#090d16', padding: '14px', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Requested Service:</span>
                  <span style={{ fontWeight: 700 }}>{selectedLead.serviceName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Quantity / Dimension:</span>
                  <span style={{ fontWeight: 700 }}>{selectedLead.quantity}</span>
                </div>
                {selectedLead.addons && selectedLead.addons.length > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Selected Add-ons:</span>
                    <span style={{ fontWeight: 600, color: '#38bdf8' }}>{selectedLead.addons.join(', ')}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--card-border)', paddingTop: '8px', marginTop: '8px' }}>
                  <span style={{ fontWeight: 700 }}>Quoted Estimate:</span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                    {config.currency}{selectedLead.totalPrice}
                  </span>
                </div>
              </div>

              {selectedLead.notes && (
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Customer Notes</div>
                  <div style={{ background: '#090d16', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', color: '#cbd5e1', fontStyle: 'italic' }}>
                    "{selectedLead.notes}"
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href={`https://wa.me/${(selectedLead.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${selectedLead.name}, this is ${config.businessName} regarding your recent online estimate for ${selectedLead.serviceName}.`)}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-emerald"
                style={{ flex: 1, textDecoration: 'none' }}
              >
                <span>WhatsApp Prospect</span>
              </a>
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedLead(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
