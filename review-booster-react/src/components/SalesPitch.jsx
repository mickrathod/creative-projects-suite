import React, { useState } from 'react';
import { ShieldCheck, DollarSign, Target, Copy, Check, MessageSquare } from 'lucide-react';
import { useToast } from './common/Toast';

export function SalesPitch() {
  const { addToast } = useToast();
  const [copiedKey, setCopiedKey] = useState(null);

  const reviewPitchScript = `Subject: Quick question about {{Business Name}}'s Google review rating

Hi {{Owner/Manager Name}},

I noticed {{Business Name}} has great service, but your Google rating could easily be 4.9+ stars if more of your happy customers left reviews at the checkout counter.

The problem is that unhappy customers are 10x more likely to post on Google than happy ones.

I set up a "Smart Review Booster" table tent system specifically for {{Industry}} businesses:
1. When happy customers (4-5 stars) scan your counter stand, they are routed straight to Google Maps with 1 tap.
2. If someone had a bad visit (1-3 stars), it intercepts their complaint privately to your manager's WhatsApp before it ever touches Google.

I generated a custom demo stand for {{Business Name}} here:
{{Live Demo Link}}

Takes 5 minutes to set up on your front desk. Can I drop off a printed test stand this week?

Best,
{{Your Name}}`;

  const copyScript = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    addToast('Pitch script copied to clipboard!', 'success');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div>
      <div className="panel-header" style={{ marginBottom: '24px' }}>
        <div>
          <h2 className="panel-title">ReviewBooster SaaS Sales & Pitch Playbook</h2>
          <p className="panel-desc">
            How to pitch and sell this reputation protection software to local restaurants, dental clinics, salons, and retail shops for $49/mo recurring profit.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        {/* Pricing Strategy */}
        <div style={{ background: '#090d16', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <DollarSign size={22} color="#10b981" />
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Recommended Pricing</h3>
          </div>
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.2)', marginBottom: '16px' }}>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#818cf8', marginBottom: '4px' }}>
              $199 Setup + $49/mo
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Includes printed acrylic table stands & private management dashboard
            </div>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#cbd5e1' }}>
            <li>✓ <strong>Setup Fee ($199):</strong> Covers branded stand design, print fulfillment & Google PlaceID configuration.</li>
            <li>✓ <strong>Monthly Fee ($49/mo):</strong> Software subscription for the smart filtering gateway & private complaint inbox.</li>
            <li>✓ <strong>Zero API Costs:</strong> Pure recurring profit margin with no ongoing software licensing fees.</li>
          </ul>
        </div>

        {/* High Converting Niches */}
        <div style={{ background: '#090d16', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Target size={22} color="#818cf8" />
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Best Target Niches</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
              <strong>🦷 Dental, MedSpa & Aesthetic Clinics:</strong> Extremely sensitive to 1-star reviews. High lifetime patient value.
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
              <strong>🍽️ High-End Restaurants & Cafes:</strong> Table tent QR codes capture diners right as they pay the bill.
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
              <strong>🚗 Auto Repair & Detailing Shops:</strong> Placed at the customer pickup counter with immediate impact.
            </div>
          </div>
        </div>

      </div>

      {/* Cold Pitch Script */}
      <div style={{ background: '#090d16', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageSquare size={20} color="#818cf8" />
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Business Owner Pitch Template</h3>
          </div>
          <button
            className="btn btn-secondary"
            style={{ fontSize: '12px', padding: '6px 14px' }}
            onClick={() => copyScript(reviewPitchScript, 'reviewScript')}
          >
            {copiedKey === 'reviewScript' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            <span>{copiedKey === 'reviewScript' ? 'Copied!' : 'Copy Script'}</span>
          </button>
        </div>
        <div className="code-block" style={{ whiteSpace: 'pre-wrap' }}>
          {reviewPitchScript}
        </div>
      </div>

    </div>
  );
}
