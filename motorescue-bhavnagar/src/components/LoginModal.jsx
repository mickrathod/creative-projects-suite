import React, { useState } from 'react';
import { X, Lock, KeyRound, Building2, ShieldCheck, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { ADMIN_CREDENTIALS, GARAGE_CREDENTIALS } from '../data/auth';

export default function LoginModal({ isOpen, onClose, defaultRole = 'admin', onLoginSuccess, lang }) {
  if (!isOpen) return null;

  const [role, setRole] = useState(defaultRole); // 'admin' | 'garage'

  // Admin form state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Garage form state
  const [selectedGaragePhone, setSelectedGaragePhone] = useState(GARAGE_CREDENTIALS[0].phone);
  const [garagePin, setGaragePin] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (
      adminEmail.trim().toLowerCase() === ADMIN_CREDENTIALS.email &&
      adminPassword === ADMIN_CREDENTIALS.password
    ) {
      onLoginSuccess({
        role: 'admin',
        user: ADMIN_CREDENTIALS
      });
      onClose();
    } else {
      setErrorMsg('Invalid email or password. Use demo fill or check credentials.');
    }
  };

  const handleGarageSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const matched = GARAGE_CREDENTIALS.find(
      g => g.phone === selectedGaragePhone && g.pin === garagePin.trim()
    );

    if (matched) {
      onLoginSuccess({
        role: 'garage',
        user: matched,
        garageId: matched.garageId
      });
      onClose();
    } else {
      setErrorMsg('Invalid PIN for this garage account. Default demo PIN is 1234.');
    }
  };

  const fillAdminDemo = () => {
    setAdminEmail(ADMIN_CREDENTIALS.email);
    setAdminPassword(ADMIN_CREDENTIALS.password);
    setErrorMsg('');
  };

  const fillGarageDemo = (phone) => {
    setSelectedGaragePhone(phone);
    setGaragePin('1234');
    setErrorMsg('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px', padding: '28px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              backgroundColor: role === 'admin' ? '#dbeafe' : '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {role === 'admin' ? (
                <Lock size={20} color="#1d4ed8" />
              ) : (
                <Building2 size={20} color="#b45309" />
              )}
            </div>
            <div>
              <h3 style={{ fontSize: '18px', color: '#0f172a', fontWeight: 800 }}>
                {role === 'admin' ? 'Platform Admin Login' : 'Partner Garage Owner Login'}
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b' }}>
                {role === 'admin' ? 'Super Admin & Dispatch Portal' : 'Workshop Bay & Heavy Repair Portal'}
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ color: '#64748b', padding: '6px' }} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Role Toggle Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '6px',
          backgroundColor: '#f1f5f9',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px'
        }}>
          <button
            type="button"
            onClick={() => { setRole('admin'); setErrorMsg(''); }}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              backgroundColor: role === 'admin' ? '#ffffff' : 'transparent',
              color: role === 'admin' ? '#0f172a' : '#64748b',
              fontWeight: 700,
              fontSize: '12.5px',
              boxShadow: role === 'admin' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s'
            }}
          >
            🏢 Admin Portal
          </button>

          <button
            type="button"
            onClick={() => { setRole('garage'); setErrorMsg(''); }}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              backgroundColor: role === 'garage' ? '#ffffff' : 'transparent',
              color: role === 'garage' ? '#0f172a' : '#64748b',
              fontWeight: 700,
              fontSize: '12.5px',
              boxShadow: role === 'garage' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s'
            }}
          >
            🔧 Garage Owner
          </button>
        </div>

        {errorMsg && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '12.5px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} color="#dc2626" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ADMIN FORM */}
        {role === 'admin' && (
          <form onSubmit={handleAdminSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Admin Email ID:
              </label>
              <input
                type="email"
                required
                placeholder="admin@motorescue.in"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                style={{ width: '100%', fontSize: '14px' }}
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Master Password:
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                style={{ width: '100%', fontSize: '14px' }}
              />
            </div>

            <button
              type="submit"
              className="btn-routine"
              style={{ width: '100%', justifyContent: 'center', fontSize: '14.5px', marginBottom: '12px' }}
            >
              <span>Login to Admin Dashboard</span>
              <ArrowRight size={16} />
            </button>

            {/* Demo Quick Fill Button */}
            <button
              type="button"
              onClick={fillAdminDemo}
              style={{
                width: '100%',
                padding: '9px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                color: '#1d4ed8',
                fontSize: '12.5px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Sparkles size={14} />
              <span>1-Click Demo Fill (admin@motorescue.in)</span>
            </button>
          </form>
        )}

        {/* GARAGE OWNER FORM */}
        {role === 'garage' && (
          <form onSubmit={handleGarageSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Select Your Partner Workshop:
              </label>
              <select
                value={selectedGaragePhone}
                onChange={(e) => setSelectedGaragePhone(e.target.value)}
                style={{ width: '100%', fontSize: '13.5px' }}
              >
                {GARAGE_CREDENTIALS.map(g => (
                  <option key={g.garageId} value={g.phone}>
                    {g.garageName} ({g.name} - {g.locality})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Owner 4-Digit Security PIN:
              </label>
              <input
                type="password"
                maxLength="6"
                required
                placeholder="Enter 4-digit PIN (Demo: 1234)"
                value={garagePin}
                onChange={(e) => setGaragePin(e.target.value)}
                style={{ width: '100%', fontSize: '15px', letterSpacing: '4px', textAlign: 'center', fontFamily: 'var(--font-mono)' }}
              />
            </div>

            <button
              type="submit"
              className="btn-routine"
              style={{ width: '100%', justifyContent: 'center', fontSize: '14.5px', marginBottom: '12px' }}
            >
              <span>Login to Workshop Portal</span>
              <ArrowRight size={16} />
            </button>

            {/* Demo Quick Fill Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: '#64748b', textAlign: 'center' }}>
                Quick Demo Logins (PIN: 1234):
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => fillGarageDemo('9825144102')}
                  style={{
                    padding: '7px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#fffbeb',
                    border: '1px solid #fde68a',
                    color: '#92400e',
                    fontSize: '11px',
                    fontWeight: 700
                  }}
                >
                  Shree Ram (Chitra)
                </button>
                <button
                  type="button"
                  onClick={() => fillGarageDemo('9724088319')}
                  style={{
                    padding: '7px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#fffbeb',
                    border: '1px solid #fde68a',
                    color: '#92400e',
                    fontSize: '11px',
                    fontWeight: 700
                  }}
                >
                  Mahadev (Ghogha)
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
