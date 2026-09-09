import React, { useState } from 'react';
import { Smartphone, Monitor, X, RefreshCw } from 'lucide-react';
import { CustomerSignup } from './CustomerSignup';
import { useBox } from '../context/BoxContext';

export function FunnelSimulator({ onClose }) {
  const { boxConfig, themes } = useBox();
  const [viewMode, setViewMode] = useState('phone');
  const [key, setKey] = useState(0);

  return (
    <div style={{
      background: '#040711',
      minHeight: '100vh',
      padding: '24px',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{
        maxWidth: '800px', width: '100%',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: '#0f172a', padding: '12px 20px', borderRadius: '16px',
        border: '1px solid var(--card-border)', marginBottom: '28px',
        flexWrap: 'wrap', gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#a78bfa', boxShadow: '0 0 10px #a78bfa' }}></div>
          <span style={{ fontWeight: 800, fontSize: '14px' }}>Customer Signup Simulator</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setViewMode('phone')}
            className={`btn ${viewMode === 'phone' ? 'btn-indigo' : 'btn-secondary'}`}
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            <Smartphone size={14} />
            <span>Phone Frame</span>
          </button>

          <button
            onClick={() => setViewMode('standalone')}
            className={`btn ${viewMode === 'standalone' ? 'btn-indigo' : 'btn-secondary'}`}
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            <Monitor size={14} />
            <span>Standalone</span>
          </button>

          <button
            onClick={() => setKey(k => k + 1)}
            className="btn btn-secondary"
            style={{ fontSize: '12px', padding: '6px 10px' }}
            title="Reset Funnel State"
          >
            <RefreshCw size={14} />
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="btn btn-secondary"
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              <X size={14} />
              <span>Exit Demo</span>
            </button>
          )}
        </div>
      </div>

      {viewMode === 'phone' ? (
        <div className="phone-simulator-frame">
          <div className="phone-notch">
            <div className="notch-camera"></div>
            <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: '#334155' }}></div>
          </div>
          <div className="phone-screen">
            <CustomerSignup key={key} customConfig={boxConfig} customThemes={themes} />
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: '440px', width: '100%', margin: '40px auto' }}>
          <CustomerSignup key={key} customConfig={boxConfig} customThemes={themes} />
        </div>
      )}
    </div>
  );
}
