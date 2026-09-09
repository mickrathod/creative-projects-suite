import React, { useState } from 'react';
import { Sparkles, Phone, ShieldCheck, CheckCircle2, Star, Clock, Award, X, MessageSquare, Zap } from 'lucide-react';
import { useQuote } from '../context/QuoteContext';
import { QuoteWidget } from './QuoteWidget';

export function ClientDemoSite({ onClose }) {
  const { config } = useQuote();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div style={{
      background: '#ffffff',
      color: '#0f172a',
      minHeight: '100vh',
      fontFamily: 'var(--font-main)',
      position: 'relative'
    }}>
      {/* Top Demo Notification Ribbon */}
      <div style={{
        background: '#090d16',
        color: '#94a3b8',
        padding: '10px 24px',
        fontSize: '13px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #1e293b'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ background: '#2563eb', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>
            LIVE CLIENT DEMO
          </span>
          <span>This is how the Quote Calculator appears when embedded on a local business client's website.</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
          >
            ← Back to SaaS Dashboard
          </button>
        )}
      </div>

      {/* Contractor Header */}
      <nav style={{
        height: '76px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        borderBottom: '1px solid #e2e8f0',
        background: '#ffffff',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800, fontSize: '20px', color: '#0f172a' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: config.primaryColor || '#2563eb',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            ⚡
          </div>
          <span>{config.businessName}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '14px', fontWeight: 600, color: '#475569' }}>
          <span>Services</span>
          <span>Why Choose Us</span>
          <span>Customer Reviews</span>
          <a
            href={`tel:${config.whatsappNumber}`}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', color: config.primaryColor || '#2563eb', textDecoration: 'none', fontWeight: 700 }}
          >
            <Phone size={15} /> {config.phone || '+1 (555) 234-5678'}
          </a>
          <button
            onClick={() => setModalOpen(true)}
            style={{
              background: config.primaryColor || '#2563eb',
              color: '#ffffff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '50px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
            }}
          >
            Get Instant Price
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%)',
        padding: '60px 40px',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '48px', alignItems: 'center' }}>
          
          {/* Left Text */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 14px',
              borderRadius: '20px',
              background: 'rgba(37, 99, 235, 0.1)',
              color: config.primaryColor || '#2563eb',
              fontSize: '12px',
              fontWeight: 700,
              marginBottom: '16px'
            }}>
              <Award size={14} /> ★★★★★ #1 Rated Contractor in Your Area
            </div>

            <h1 style={{ fontSize: '46px', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-1px', marginBottom: '16px', color: '#0f172a' }}>
              Transparent, Upfront Estimates with Zero Guesswork.
            </h1>

            <p style={{ fontSize: '17px', color: '#64748b', lineHeight: 1.6, marginBottom: '28px' }}>
              Calculate your exact pricing in under 30 seconds using our real-time interactive quote estimator. Licensed, insured, and 100% satisfaction guaranteed.
            </p>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: '#334155' }}>
                <CheckCircle2 size={18} color="#10b981" /> No Hidden Fees
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: '#334155' }}>
                <CheckCircle2 size={18} color="#10b981" /> Same-Day Availability
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: '#334155' }}>
                <CheckCircle2 size={18} color="#10b981" /> Verified 5-Star Pros
              </div>
            </div>
          </div>

          {/* Right: Embedded Interactive Calculator Widget */}
          <div>
            <QuoteWidget customConfig={config} isInline={true} />
          </div>

        </div>
      </section>

      {/* Trust & Features Section */}
      <section style={{ padding: '60px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            Why Homeowners & Businesses Trust {config.businessName}
          </h2>
          <p style={{ color: '#64748b', fontSize: '15px' }}>
            Delivering five-star craftsmanship and reliable results on every single project.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div style={{ padding: '24px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🛡️</div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>100% Insured & Bonded</h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.5 }}>
              Complete peace of mind knowing your property is protected by comprehensive liability coverage.
            </p>
          </div>

          <div style={{ padding: '24px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚡</div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Instant Automated Booking</h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.5 }}>
              Lock in your exact quote online and receive instant SMS and email confirmation within minutes.
            </p>
          </div>

          <div style={{ padding: '24px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🏆</div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Satisfaction Guarantee</h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.5 }}>
              If you aren't completely thrilled with the final result, we'll re-service the job at zero additional charge.
            </p>
          </div>
        </div>
      </section>

      {/* Floating Bottom-Right Modal Launcher Widget */}
      <button
        onClick={() => setModalOpen(true)}
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          background: config.primaryColor || '#2563eb',
          color: '#ffffff',
          border: 'none',
          borderRadius: '50px',
          padding: '14px 24px',
          fontWeight: 800,
          fontSize: '15px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 10px 25px rgba(37, 99, 235, 0.5)',
          cursor: 'pointer',
          zIndex: 100,
          transition: 'transform 0.2s'
        }}
      >
        <Zap size={18} />
        <span>Instant Price Calculator</span>
      </button>

      {/* Floating Modal Container */}
      {modalOpen && (
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
          <div style={{ maxWidth: '580px', width: '100%', position: 'relative' }}>
            <button
              onClick={() => setModalOpen(false)}
              style={{
                position: 'absolute',
                top: '-14px',
                right: '-14px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
            >
              <X size={18} />
            </button>
            <QuoteWidget customConfig={config} onSubmitted={() => setTimeout(() => setModalOpen(false), 5000)} />
          </div>
        </div>
      )}
    </div>
  );
}
