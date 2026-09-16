import React, { useState } from 'react';
import { Phone, MapPin, Wrench, Menu, X, Zap, Globe } from 'lucide-react';
import { EMERGENCY_HOTLINE } from '../data/localities';

export default function Navbar({
  onOpenEmergency,
  activeSection,
  onNavigate,
  lang,
  onToggleLang,
  currentPortal,
  onSwitchPortal
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      id: 'services',
      labelEn: 'Doorstep Service',
      labelGu: 'ડોરસ્ટેપ સર્વિસ'
    },
    {
      id: 'calculator',
      labelEn: 'Price Estimator',
      labelGu: 'ભાવ કેલ્ક્યુલેટર'
    },
    {
      id: 'history',
      labelEn: 'Service History',
      labelGu: 'સર્વિસ હિસ્ટ્રી'
    }
  ];

  const handleLogoClick = () => {
    if (currentPortal !== 'customer') onSwitchPortal('customer');
    onNavigate('hero');
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 900,
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
      transition: 'all 0.2s ease'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        gap: '16px'
      }}>
        {/* Left: Brand Identity */}
        <div
          onClick={handleLogoClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{
            width: '35px',
            height: '35px',
            borderRadius: '9px',
            backgroundColor: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 2px 8px rgba(220, 38, 38, 0.25)',
            flexShrink: 0
          }}>
            <Wrench size={18} strokeWidth={2.4} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '20px',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              color: '#0f172a',
              lineHeight: 1
            }}>
              Moto<span style={{ color: '#dc2626' }}>Rescue</span>
            </span>

            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#dc2626',
              backgroundColor: '#fef2f2',
              border: '1px solid #fee2e2',
              padding: '2px 8px',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              lineHeight: 1.2
            }}>
              <MapPin size={10} color="#dc2626" />
              <span>Bhavnagar</span>
            </span>
          </div>
        </div>

        {/* Center: Clean Pill Navigation Links */}
        <nav className="desktop-nav" style={{
          display: 'none',
          alignItems: 'center',
          gap: '4px'
        }}>
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(item.id);
                }}
                className={`nav-pill-link ${isActive ? 'active' : ''}`}
                style={{
                  padding: '6px 13px',
                  borderRadius: '7px',
                  fontSize: '13.5px',
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? '#0f172a' : '#475569',
                  backgroundColor: isActive ? '#f1f5f9' : 'transparent',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                  outline: 'none'
                }}
              >
                {item.isLive && (
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#16a34a',
                    boxShadow: '0 0 0 2px rgba(22, 163, 74, 0.2)'
                  }} />
                )}
                <span>{lang === 'gu' ? item.labelGu : item.labelEn}</span>
              </a>
            );
          })}
        </nav>

        {/* Right: Hotline + Language Toggle + SOS Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Language Switcher Pill */}
          <button
            onClick={onToggleLang}
            style={{
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              color: '#334155',
              padding: '6px 11px',
              borderRadius: '7px',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.15s ease',
              outline: 'none'
            }}
            className="header-lang-btn nav-lang-btn"
            title="Switch language / ભાષા બદલો"
          >
            <Globe size={13} color="#64748b" />
            <span>{lang === 'gu' ? 'English' : 'ગુજરાતી'}</span>
          </button>

          {/* 24/7 Helpline - Clean, Single-Line Phone Badge */}
          <a
            href={`tel:${EMERGENCY_HOTLINE.replace(/\s+/g, '')}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              border: '1px solid #e2e8f0',
              padding: '6px 12px',
              borderRadius: '7px',
              fontSize: '12.5px',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
            className="header-phone-btn nav-phone-btn"
            title="24/7 Bhavnagar Breakdown Hotline"
          >
            <span style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: '#dcfce7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#16a34a',
              flexShrink: 0
            }}>
              <Phone size={11} strokeWidth={2.5} />
            </span>
            <span className="phone-number-text">{EMERGENCY_HOTLINE}</span>
          </a>

          {/* Primary High-Impact Emergency SOS Button */}
          <button
            onClick={onOpenEmergency}
            id="nav-sos-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#dc2626',
              color: '#ffffff',
              padding: '7px 15px',
              borderRadius: '7px',
              fontSize: '13px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(220, 38, 38, 0.28)',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap'
            }}
            className="header-sos-btn"
          >
            <Zap size={14} color="#ffffff" />
            <span>{lang === 'gu' ? 'ઈમરજન્સી SOS' : 'Instant SOS'}</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '7px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              cursor: 'pointer',
              padding: 0
            }}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.06)'
        }}>
          <button
            onClick={() => { onOpenEmergency(); setMobileMenuOpen(false); }}
            style={{
              backgroundColor: '#dc2626',
              color: '#ffffff',
              padding: '11px',
              borderRadius: '7px',
              fontWeight: 700,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(220, 38, 38, 0.25)'
            }}
          >
            <Zap size={16} />
            <span>🚨 {lang === 'gu' ? 'ઈમરજન્સી બ્રેકડાઉન SOS' : 'Emergency Breakdown SOS'}</span>
          </button>

          <button
            onClick={() => { onNavigate('services'); setMobileMenuOpen(false); }}
            style={{
              textAlign: 'left',
              padding: '10px 4px',
              color: '#0f172a',
              fontWeight: 600,
              fontSize: '14px',
              borderBottom: '1px solid #f1f5f9',
              cursor: 'pointer'
            }}
          >
            🛵 {lang === 'gu' ? 'ડોરસ્ટેપ સર્વિસ (₹૨૯૯)' : 'Doorstep Routine Service (₹299)'}
          </button>

          <button
            onClick={() => { onNavigate('calculator'); setMobileMenuOpen(false); }}
            style={{
              textAlign: 'left',
              padding: '10px 4px',
              color: '#0f172a',
              fontWeight: 600,
              fontSize: '14px',
              borderBottom: '1px solid #f1f5f9',
              cursor: 'pointer'
            }}
          >
            💰 {lang === 'gu' ? 'ભાવ કેલ્ક્યુલેટર' : 'Price & Cost Estimator'}
          </button>

          <button
            onClick={() => { onNavigate('history'); setMobileMenuOpen(false); }}
            style={{
              textAlign: 'left',
              padding: '10px 4px',
              color: '#0f172a',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            🔍 {lang === 'gu' ? 'સર્વિસ હિસ્ટ્રી ચેક કરો' : 'Check Service History'}
          </button>
        </div>
      )}

      <style>{`
        /* Desktop navigation visibility */
        @media (min-width: 920px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 919px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }

        /* Phone button responsive tweaks */
        @media (max-width: 680px) {
          .phone-number-text { display: none; }
          .header-phone-btn { padding: 7px 9px !important; }
        }
        @media (max-width: 480px) {
          .nav-lang-btn span { display: none; }
          .nav-phone-btn { display: none; }
        }

        /* Hover states */
        .nav-pill-link:hover {
          color: #0f172a !important;
          background-color: #f1f5f9 !important;
        }
        .nav-pill-link:focus, .nav-pill-link:active {
          outline: none !important;
        }
        .header-lang-btn:hover {
          background-color: #f8fafc !important;
          border-color: #cbd5e1 !important;
        }
        .header-phone-btn:hover {
          border-color: #cbd5e1 !important;
          background-color: #f8fafc !important;
        }
        .header-sos-btn:hover {
          background-color: #b91c1c !important;
        }
      `}</style>
    </header>
  );
}
