import React, { useState } from 'react';
import { Smartphone, Monitor, X, RefreshCw } from 'lucide-react';
import { BookingWidget } from './BookingWidget';
import { useBooking } from '../context/BookingContext';
import { useToast } from './common/Toast';

export function WidgetSimulator({ onClose }) {
  const { config } = useBooking();
  const { addToast } = useToast();
  const [viewMode, setViewMode] = useState('phone');
  const [key, setKey] = useState(0);

  return (
    <div style={{
      background: '#040711', minHeight: '100vh', padding: '24px', color: '#fff',
      display: 'flex', flexDirection: 'column', alignItems: 'center'
    }}>
      <div style={{
        maxWidth: '800px', width: '100%', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', background: '#0f172a', padding: '12px 20px', borderRadius: '16px',
        border: '1px solid var(--card-border)', marginBottom: '28px', flexWrap: 'wrap', gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#60a5fa', boxShadow: '0 0 10px #60a5fa' }} />
          <span style={{ fontWeight: 800, fontSize: '14px' }}>Customer Booking Widget Preview</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={() => setViewMode('phone')} className={`btn ${viewMode === 'phone' ? 'btn-primary' : 'btn-secondary'}`} style={{ fontSize: '12px', padding: '6px 12px' }}>
            <Smartphone size={14} /><span>Phone</span>
          </button>
          <button onClick={() => setViewMode('standalone')} className={`btn ${viewMode === 'standalone' ? 'btn-primary' : 'btn-secondary'}`} style={{ fontSize: '12px', padding: '6px 12px' }}>
            <Monitor size={14} /><span>Standalone</span>
          </button>
          <button onClick={() => setKey(k => k + 1)} className="btn btn-secondary" style={{ fontSize: '12px', padding: '6px 10px' }} title="Reset widget">
            <RefreshCw size={14} />
          </button>
          {onClose && (
            <button onClick={onClose} className="btn btn-secondary" style={{ fontSize: '12px', padding: '6px 12px' }}>
              <X size={14} /><span>Exit</span>
            </button>
          )}
        </div>
      </div>

      {viewMode === 'phone' ? (
        <div className="phone-simulator-frame">
          <div className="phone-notch">
            <div className="notch-camera" />
            <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: '#334155' }} />
          </div>
          <div className="phone-screen">
            <BookingWidget key={key} customConfig={config} onBooked={(a) => addToast(`✅ Test booking captured: ${a.customerName}`, 'success')} />
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: '440px', width: '100%', margin: '20px auto', borderRadius: '18px', overflow: 'hidden', border: '1px solid var(--card-border)' }}>
          <BookingWidget key={key} customConfig={config} onBooked={(a) => addToast(`✅ Test booking captured: ${a.customerName}`, 'success')} />
        </div>
      )}
    </div>
  );
}
