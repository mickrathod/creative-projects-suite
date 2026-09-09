import React from 'react';
import { Download, Smartphone, Plus } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useToast } from './Toast';

export function Header({ setActiveTab, onOpenSimulator }) {
  const { exportCSV, appointments, simulateBooking } = useBooking();
  const { addToast } = useToast();

  const handleExport = () => {
    if (appointments.length === 0) {
      addToast('No bookings to export yet.', 'info');
      return;
    }
    exportCSV();
    addToast('📥 Exported all bookings to CSV!', 'success');
  };

  const handleSimulate = () => {
    const a = simulateBooking();
    addToast(`📅 New booking: ${a.customerName} — ${a.serviceName}`, 'success');
  };

  return (
    <header className="master-header">
      <div className="suite-logo-badge" onClick={() => setActiveTab('calendar')}>
        <div className="suite-logo-icon">📅</div>
        <div>
          <div className="suite-title">
            BookingBolt SaaS
            <span className="suite-subtag">Local Business Edition</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Instant Appointment Widget &amp; Calendar CRM · Zero API Cost
          </div>
        </div>
      </div>

      <div className="header-right-actions">
        <button className="btn btn-secondary" onClick={handleExport} style={{ padding: '8px 14px', fontSize: '12px' }}>
          <Download size={14} />
          <span>Export Bookings</span>
        </button>
        <button className="btn btn-secondary" onClick={handleSimulate} style={{ padding: '8px 14px', fontSize: '12px' }}>
          <Plus size={14} color="#34d399" />
          <span>Simulate Booking</span>
        </button>
        <button className="btn btn-primary" onClick={onOpenSimulator} style={{ padding: '8px 16px', fontSize: '12px' }}>
          <Smartphone size={14} />
          <span>Test Booking Widget</span>
        </button>
      </div>
    </header>
  );
}
