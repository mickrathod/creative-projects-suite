import React from 'react';
import { Phone, Mail, MapPin, Wrench, Lock, Building2, Zap } from 'lucide-react';
import { EMERGENCY_HOTLINE } from '../data/localities';

export default function Footer({
  onOpenEmergency,
  onOpenRoutine,
  onOpenLogin,
  onSwitchPortal,
  adminUser,
  garageUser,
  lang
}) {
  return (
    <footer style={{
      backgroundColor: '#ffffff',
      borderTop: '1px solid #e2e8f0',
      padding: '40px 0 24px',
      color: '#475569',
      fontSize: '13.5px'
    }}>
      <div className="container">
        {/* Main Clean Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '32px',
          paddingBottom: '32px',
          borderBottom: '1px solid #f1f5f9'
        }}>
          {/* 1. Brand & Contact */}
          <div style={{ maxWidth: '320px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <Wrench size={16} strokeWidth={2.4} />
              </div>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                Moto<span style={{ color: '#dc2626' }}>Rescue</span>
              </span>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#dc2626',
                backgroundColor: '#fef2f2',
                border: '1px solid #fee2e2',
                padding: '2px 7px',
                borderRadius: '9999px'
              }}>
                Bhavnagar
              </span>
            </div>

            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, marginBottom: '14px' }}>
              {lang === 'gu'
                ? 'ભાવનગરમાં ટુ-વ્હીલર ડોરસ્ટેપ સર્વિસિંગ અને ૨૪/૭ રોડસાઇડ બ્રેકડાઉન મદદ.'
                : 'Doorstep two-wheeler care and 24/7 roadside breakdown assistance in Bhavnagar.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <a
                href={`tel:${EMERGENCY_HOTLINE.replace(/\s+/g, '')}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  color: '#0f172a',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                <Phone size={14} color="#dc2626" />
                <span>{EMERGENCY_HOTLINE} (24/7 Helpline)</span>
              </a>

              <a
                href="mailto:support@motorescuebhavnagar.in"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  color: '#64748b',
                  textDecoration: 'none'
                }}
              >
                <Mail size={14} color="#2563eb" />
                <span>support@motorescuebhavnagar.in</span>
              </a>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
              Services
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={onOpenEmergency}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  textAlign: 'left',
                  color: '#dc2626',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Zap size={14} />
                <span>24/7 Roadside SOS</span>
              </button>

              <button
                onClick={onOpenRoutine}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  textAlign: 'left',
                  color: '#475569',
                  fontSize: '13.5px',
                  cursor: 'pointer'
                }}
              >
                Doorstep Routine Service (₹299)
              </button>

              <a
                href="#calculator"
                style={{
                  color: '#475569',
                  textDecoration: 'none',
                  fontSize: '13.5px'
                }}
              >
                Price & Cost Estimator
              </a>

              <a
                href="#history"
                style={{
                  color: '#475569',
                  textDecoration: 'none',
                  fontSize: '13.5px'
                }}
              >
                Service History & Warranty
              </a>
            </div>
          </div>

          {/* 3. Coverage Areas */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
              Coverage
            </h4>
            <p style={{ fontSize: '12.5px', color: '#64748b', lineHeight: 1.6, marginBottom: '8px' }}>
              15–20 minute response across:
            </p>
            <div style={{ fontSize: '12px', color: '#334155', lineHeight: 1.8 }}>
              Kaliyabid • Waghawadi • Ghogha Circle • Sardarnagar • Chitra • Nari Chokdi • Subhashnagar • Bypass
            </div>
          </div>

          {/* 4. Partner & Admin Portals */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
              Portals
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => {
                  if (garageUser) onSwitchPortal('garage');
                  else onOpenLogin('garage');
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  backgroundColor: '#fef3c7',
                  border: '1px solid #fde68a',
                  color: '#92400e',
                  padding: '7px 12px',
                  borderRadius: '6px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  width: 'fit-content'
                }}
              >
                <Building2 size={14} />
                <span>{garageUser ? 'Garage Panel' : 'Partner Garage Login'}</span>
              </button>

              <button
                onClick={() => {
                  if (adminUser) onSwitchPortal('admin');
                  else onOpenLogin('admin');
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  color: '#1e40af',
                  padding: '7px 12px',
                  borderRadius: '6px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  width: 'fit-content'
                }}
              >
                <Lock size={14} />
                <span>{adminUser ? 'Admin Panel' : 'Admin Login'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Simple Copyright Bar */}
        <div style={{
          paddingTop: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          fontSize: '12px',
          color: '#94a3b8'
        }}>
          <div>
            © {new Date().getFullYear()} <strong>MotoRescue Bhavnagar</strong>. All rights reserved.
          </div>
          <div>
            Bhavnagar, Gujarat
          </div>
        </div>
      </div>
    </footer>
  );
}
