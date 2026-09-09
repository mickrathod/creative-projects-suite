import React, { useState, useEffect } from 'react';
import { Star, Send, ExternalLink, CheckCircle, ShieldAlert, Sparkles, MessageSquare, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useReview } from '../context/ReviewContext';
import { useToast } from './common/Toast';

export function CustomerFunnel({ customConfig, onSubmitted }) {
  const { bizConfig: globalConfig, trackScan, recordPositiveReview, submitPrivateFeedback } = useReview();
  const bizConfig = customConfig || globalConfig;
  const { addToast } = useToast();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Track scan when component mounts
  useEffect(() => {
    trackScan();
  }, []);

  const DESCRIPTORS = {
    1: '😞 Terribly Disappointed',
    2: '🙁 Needs Improvement',
    3: '😐 Average Experience',
    4: '😊 Great Service!',
    5: '🌟 Exceptional & 5-Star!'
  };

  const handleSelectRating = (r) => {
    setRating(r);
    if (r >= 4) {
      recordPositiveReview();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  };

  const handlePrivateSubmit = (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) {
      addToast('Please describe your feedback', 'error');
      return;
    }

    submitPrivateFeedback({
      customerName,
      contact: customerContact,
      feedback: feedbackText,
      rating
    });

    setIsSubmitted(true);
    addToast('Feedback submitted privately to management', 'success');
    if (onSubmitted) onSubmitted();
  };

  const handleReset = () => {
    setRating(0);
    setHoverRating(0);
    setCustomerName('');
    setCustomerContact('');
    setFeedbackText('');
    setIsSubmitted(false);
  };

  const activeRating = hoverRating || rating;

  return (
    <div style={{
      background: '#0d1322',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '24px',
      padding: '28px 20px',
      color: '#ffffff',
      textAlign: 'center',
      fontFamily: 'var(--font-main)',
      maxWidth: '420px',
      margin: '0 auto',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
      position: 'relative'
    }}>
      
      {/* Business Header */}
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '18px',
        background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '32px',
        margin: '0 auto 14px',
        boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)'
      }}>
        {bizConfig.icon || '🦷'}
      </div>

      <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
        {bizConfig.name}
      </h2>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
        How was your visit with our team today?
      </p>

      {/* 5-Star Selector */}
      {!isSubmitted && (
        <div style={{ marginBottom: '20px' }}>
          <div className="stars-container" style={{ margin: '10px 0' }}>
            {[1, 2, 3, 4, 5].map((starNum) => (
              <button
                key={starNum}
                type="button"
                className={`star-button ${starNum <= activeRating ? 'active' : ''}`}
                onMouseEnter={() => setHoverRating(starNum)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => handleSelectRating(starNum)}
                style={{
                  color: starNum <= activeRating ? '#fbbf24' : '#334155',
                  transform: starNum <= activeRating ? 'scale(1.15)' : 'scale(1)',
                  transition: 'all 0.15s ease'
                }}
              >
                ★
              </button>
            ))}
          </div>

          <div style={{
            fontSize: '13px',
            fontWeight: 700,
            color: activeRating >= 4 ? '#fbbf24' : activeRating > 0 ? '#cbd5e1' : 'var(--text-dim)',
            minHeight: '20px'
          }}>
            {activeRating ? DESCRIPTORS[activeRating] : 'Tap a star to rate'}
          </div>
        </div>
      )}

      {/* STATE 1: POSITIVE ROUTING (4-5 Stars -> Google Review Page) */}
      {!isSubmitted && rating >= 4 && (
        <div style={{
          background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.03) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '16px',
          padding: '20px',
          animation: 'toastIn 0.3s ease forwards',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>🎉</div>
          <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
            You made our day!
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '18px' }}>
            As a local business, positive reviews mean the world to us. Would you mind taking 15 seconds to share your experience on Google?
          </p>

          <a
            href={bizConfig.googleUrl || '#'}
            target="_blank"
            rel="noreferrer"
            className="btn"
            style={{
              background: '#ffffff',
              color: '#0f172a',
              fontWeight: 800,
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 6px 20px rgba(255, 255, 255, 0.2)',
              textDecoration: 'none',
              marginBottom: '10px'
            }}
          >
            <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Post Review on Google Maps →</span>
          </a>

          <button
            onClick={handleReset}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', fontSize: '11px', cursor: 'pointer', marginTop: '6px' }}
          >
            Change Rating
          </button>
        </div>
      )}

      {/* STATE 2: PRIVATE FEEDBACK (1-3 Stars -> Internal Form) */}
      {!isSubmitted && rating > 0 && rating <= 3 && (
        <div style={{
          background: 'linear-gradient(180deg, rgba(244, 63, 94, 0.1) 0%, rgba(244, 63, 94, 0.02) 100%)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: '16px',
          padding: '20px',
          animation: 'toastIn 0.3s ease forwards',
          textAlign: 'left'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
            We are so sorry to hear that.
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
            Your feedback goes directly to the General Manager so we can make things right immediately.
          </p>

          <form onSubmit={handlePrivateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <input
                type="text"
                placeholder="Your Name (Optional)"
                className="form-input"
                style={{ fontSize: '13px', padding: '8px 12px' }}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Phone or Email (so we can reach out)"
                className="form-input"
                style={{ fontSize: '13px', padding: '8px 12px' }}
                value={customerContact}
                onChange={(e) => setCustomerContact(e.target.value)}
              />
            </div>

            <div>
              <textarea
                placeholder="What went wrong and how can we fix it? *"
                className="form-textarea"
                style={{ fontSize: '13px', padding: '8px 12px', minHeight: '80px' }}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ background: '#f43f5e', padding: '10px', fontSize: '13px', width: '100%', justifyContent: 'center' }}
            >
              <Send size={14} />
              <span>Send Private Feedback to Owner</span>
            </button>
          </form>
        </div>
      )}

      {/* STATE 3: SUBMITTED CONFIRMATION */}
      {isSubmitted && (
        <div style={{ padding: '20px 10px', textAlign: 'center' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.2)',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px'
          }}>
            <CheckCircle size={32} />
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>
            Thank you for your honesty.
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
            Our management team has received your message and will review it right away to improve our service.
          </p>

          <button className="btn btn-secondary" onClick={handleReset} style={{ fontSize: '12px' }}>
            Rate Again
          </button>
        </div>
      )}

      {/* Footer Trust Shield */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        marginTop: '20px',
        fontSize: '11px',
        color: 'var(--text-dim)'
      }}>
        <Lock size={12} />
        <span>Verified Customer Feedback Gateway</span>
      </div>

    </div>
  );
}
