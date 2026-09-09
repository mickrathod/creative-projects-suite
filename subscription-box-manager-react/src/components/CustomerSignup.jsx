import React, { useState } from 'react';
import { Send, CheckCircle, Sparkles, Lock, Package } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useBox } from '../context/BoxContext';
import { useToast } from './common/Toast';

const PLAN_PRICE = { Monthly: 34, Quarterly: 96, Annual: 384 };

export function CustomerSignup({ customConfig, customThemes }) {
  const { boxConfig: globalConfig, themes: globalThemes, addSubscriber } = useBox();
  const boxConfig = customConfig || globalConfig;
  const themes = customThemes || globalThemes;
  const { addToast } = useToast();

  const [plan, setPlan] = useState('Monthly');
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const nextTheme = themes[0];

  const handleChoosePlan = (p) => {
    setPlan(p);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      addToast('Please add your email to subscribe', 'error');
      return;
    }
    addSubscriber({ name, email, plan });
    setIsSubmitted(true);
    try {
      confetti({ particleCount: 70, spread: 65, origin: { y: 0.6 } });
    } catch (e) {}
    addToast('Subscription started!', 'success');
  };

  const handleReset = () => {
    setShowForm(false);
    setIsSubmitted(false);
    setName('');
    setEmail('');
  };

  return (
    <div style={{
      background: '#0d1322',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '24px',
      padding: '24px 18px',
      color: '#ffffff',
      fontFamily: 'var(--font-main)',
      maxWidth: '440px',
      margin: '0 auto',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '16px',
          background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', margin: '0 auto 10px',
          boxShadow: '0 8px 20px rgba(124, 58, 237, 0.4)'
        }}>
          {boxConfig.icon || '📦'}
        </div>
        <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px' }}>{boxConfig.name}</h2>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{boxConfig.tagline}</p>
      </div>

      {!showForm && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {nextTheme && (
            <div style={{
              background: `linear-gradient(135deg, ${nextTheme.color}33, ${nextTheme.color}11)`,
              border: `1px solid ${nextTheme.color}55`,
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '8px' }}>{nextTheme.emoji}</div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-dim)', marginBottom: '4px' }}>
                This Month's Box
              </div>
              <div style={{ fontSize: '16px', fontWeight: 800 }}>{nextTheme.title}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {nextTheme.itemCount} curated items · Ships {boxConfig.shipDay}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(PLAN_PRICE).map(([p, price]) => (
              <button
                key={p}
                onClick={() => handleChoosePlan(p)}
                className="btn"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--card-border)',
                  color: '#ffffff',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  fontSize: '14px'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Package size={16} color="#a78bfa" />
                  {p}
                </span>
                <strong>${p === 'Quarterly' ? (price / 3).toFixed(0) : p === 'Annual' ? (price / 12).toFixed(0) : price}/mo</strong>
              </button>
            ))}
          </div>
        </div>
      )}

      {showForm && !isSubmitted && (
        <div style={{
          background: 'linear-gradient(180deg, rgba(124, 58, 237, 0.1) 0%, rgba(124, 58, 237, 0.02) 100%)',
          border: '1px solid rgba(124, 58, 237, 0.3)',
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'left'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '4px' }}>Start Your Subscription</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
            Plan selected: <strong style={{ color: '#c4b5fd' }}>{plan}</strong>. Cancel anytime.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="text"
              placeholder="Your Name"
              className="form-input"
              style={{ fontSize: '13px', padding: '8px 12px' }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email *"
              className="form-input"
              style={{ fontSize: '13px', padding: '8px 12px' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '10px', fontSize: '13px', width: '100%', justifyContent: 'center' }}>
              <Send size={14} />
              <span>Subscribe Now</span>
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', fontSize: '11px', cursor: 'pointer' }}
            >
              Back to Plans
            </button>
          </form>
        </div>
      )}

      {isSubmitted && (
        <div style={{ padding: '20px 10px', textAlign: 'center' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.2)', color: '#10b981',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px'
          }}>
            <CheckCircle size={32} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>Welcome aboard!</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
            Your first {boxConfig.name} box ships {boxConfig.shipDay}.
          </p>
          <button className="btn btn-secondary" onClick={handleReset} style={{ fontSize: '12px' }}>
            Start Over
          </button>
        </div>
      )}

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
        marginTop: '20px', fontSize: '11px', color: 'var(--text-dim)'
      }}>
        <Lock size={12} />
        <span>Powered by BoxOps</span>
      </div>
    </div>
  );
}
