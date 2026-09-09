import React, { useState } from 'react';
import { CalendarDays, Settings2, Code2, BookOpen, Smartphone } from 'lucide-react';
import { ToastProvider } from './components/common/Toast';
import { BookingProvider, useBooking } from './context/BookingContext';
import { Header } from './components/common/Header';
import { BookingsCalendar } from './components/BookingsCalendar';
import { BusinessSetup } from './components/BusinessSetup';
import { EmbedGenerator } from './components/EmbedGenerator';
import { SalesPitch } from './components/SalesPitch';
import { WidgetSimulator } from './components/WidgetSimulator';

function BookingApp() {
  const [activeTab, setActiveTab] = useState('calendar');
  const { config, totalUpcoming, bookedRevenue, depositsCollected, pendingCount } = useBooking();

  if (activeTab === 'simulator') {
    return <WidgetSimulator onClose={() => setActiveTab('calendar')} />;
  }

  const tabs = [
    { id: 'calendar', label: 'Bookings Calendar', icon: CalendarDays },
    { id: 'setup', label: 'Business Setup', icon: Settings2 },
    { id: 'embed', label: 'Embed Code', icon: Code2 },
    { id: 'sales', label: 'Sales Playbook', icon: BookOpen }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header setActiveTab={setActiveTab} onOpenSimulator={() => setActiveTab('simulator')} />

      <div className="subnav-bar">
        <div className="tabs-group">
          {tabs.map(t => (
            <button
              key={t.id}
              className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              <t.icon size={15} />
              <span>{t.label}</span>
              {t.id === 'calendar' && pendingCount > 0 && (
                <span style={{ background: '#f59e0b', color: '#000', fontSize: 10, padding: '1px 6px', borderRadius: 10, fontWeight: 800 }}>
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
        <button className="btn btn-primary" onClick={() => setActiveTab('simulator')}>
          <Smartphone size={15} />
          <span>Test Booking Widget</span>
        </button>
      </div>

      <div className="dashboard-container" style={{ flex: 1 }}>
        <div className="metrics-grid">
          <MetricCard label="Upcoming Bookings" icon="📅" value={totalUpcoming} sub={<><span>Live</span> from widget</>} />
          <MetricCard label="Booked Revenue (upcoming)" icon="💰" value={`$${bookedRevenue.toLocaleString()}`} valueColor="var(--accent-emerald)" sub={<><span>Scheduled</span> on the calendar</>} />
          <MetricCard label="Deposits Collected" icon="🔒" value={`$${depositsCollected.toLocaleString()}`} valueColor="#60a5fa" sub={<><span>No-show</span> protection</>} />
          <MetricCard label="Client Subscription ROI" icon="⚡" value={<>$49<span style={{ fontSize: 15, color: 'var(--text-muted)' }}>/mo</span></>} sub={<><span>Zero API cost</span> pure recurring profit</>} />
        </div>

        <div className="card-panel">
          {activeTab === 'calendar' && <BookingsCalendar />}
          {activeTab === 'setup' && <BusinessSetup />}
          {activeTab === 'embed' && <EmbedGenerator />}
          {activeTab === 'sales' && <SalesPitch />}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, icon, value, valueColor, sub }) {
  return (
    <div className="metric-card">
      <div className="metric-card-top">
        <span className="metric-label">{label}</span>
        <div className="metric-icon-wrap">{icon}</div>
      </div>
      <div className="metric-value" style={valueColor ? { color: valueColor } : undefined}>{value}</div>
      <div className="metric-sub">{sub}</div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <BookingProvider>
        <BookingApp />
      </BookingProvider>
    </ToastProvider>
  );
}
