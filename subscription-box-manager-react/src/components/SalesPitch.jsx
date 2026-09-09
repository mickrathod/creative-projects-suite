import React, { useState } from 'react';
import { DollarSign, Target, Copy, Check, MessageSquare } from 'lucide-react';
import { useToast } from './common/Toast';

export function SalesPitch() {
  const { addToast } = useToast();
  const [copiedKey, setCopiedKey] = useState(null);

  const pitchScript = `Subject: Turning {{Business Name}}'s best products into a recurring subscription

Hi {{Owner/Manager Name}},

You already curate great {{Niche}} products — the part most small brands never build is the system that turns one-time buyers into recurring monthly revenue.

I set up a "Subscription Box Manager" specifically for {{Niche}} brands:
1. A branded signup page where customers pick Monthly / Quarterly / Annual plans.
2. A dashboard that tracks every subscriber, MRR, and churn in one place.
3. A box-theme planner so you always know what's shipping next and when.

I put together a live demo using your branding here:
{{Live Demo Link}}

Takes about a day to launch on top of your existing store. Want me to set it up this month?

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
          <h2 className="panel-title">BoxOps Sales & Pitch Playbook</h2>
          <p className="panel-desc">
            How to pitch and sell this subscription box management system to local makers, roasters, and boutique brands for $79/mo recurring profit.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '32px' }}>

        <div style={{ background: '#090d16', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <DollarSign size={22} color="#10b981" />
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Recommended Pricing</h3>
          </div>
          <div style={{ background: 'rgba(124, 58, 237, 0.1)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(124, 58, 237, 0.2)', marginBottom: '16px' }}>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#c4b5fd', marginBottom: '4px' }}>
              $299 Setup + $79/mo
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Includes signup page build, subscriber CRM & box planning dashboard access
            </div>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#cbd5e1' }}>
            <li>✓ <strong>Setup Fee ($299):</strong> Covers signup page, plan tiers & CRM configuration.</li>
            <li>✓ <strong>Monthly Fee ($79/mo):</strong> Dashboard access, MRR/churn tracking & unlimited box themes.</li>
            <li>✓ <strong>Zero API Costs:</strong> Client-side dashboard, pure recurring margin.</li>
          </ul>
        </div>

        <div style={{ background: '#090d16', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Target size={22} color="#a78bfa" />
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Best Target Niches</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
              <strong>☕ Coffee Roasters & Specialty Food Makers:</strong> Naturally repeat-purchase products, easy upsell to a box.
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
              <strong>🕯️ Boutique & Handmade Goods Brands:</strong> Curated variety keeps subscribers engaged month to month.
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
              <strong>🌱 Local Farms & Garden Centers:</strong> Seasonal produce/plant boxes with predictable recurring demand.
            </div>
          </div>
        </div>

      </div>

      <div style={{ background: '#090d16', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageSquare size={20} color="#a78bfa" />
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Business Owner Pitch Template</h3>
          </div>
          <button
            className="btn btn-secondary"
            style={{ fontSize: '12px', padding: '6px 14px' }}
            onClick={() => copyScript(pitchScript, 'pitchScript')}
          >
            {copiedKey === 'pitchScript' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            <span>{copiedKey === 'pitchScript' ? 'Copied!' : 'Copy Script'}</span>
          </button>
        </div>
        <div className="code-block" style={{ whiteSpace: 'pre-wrap' }}>
          {pitchScript}
        </div>
      </div>

    </div>
  );
}
