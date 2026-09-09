import React, { useState } from 'react';
import { BookOpen, Copy, Check, Target, DollarSign, MessageCircle, HelpCircle } from 'lucide-react';
import { useToast } from './common/Toast';

export function SalesPlaybook() {
  const { addToast } = useToast();
  const [copiedKey, setCopiedKey] = useState(null);

  const coldEmailScript = `Subject: Quick question about {{Business Name}}'s website quote requests

Hi {{Owner Name}},

I noticed your website currently uses a standard static "Contact Us" form. 

Most homeowners who visit your site leave without contacting because they want immediate ballpark pricing before calling.

I built an interactive instant quote estimator for {{Industry}} companies that gives clients instant pricing while capturing their name and phone number directly into your CRM.

I set up a 100% free live demo customized for {{Business Name}} here:
{{Live Demo Link}}

Takes 2 minutes to plug in. Would you like me to send over the access?

Best,
{{Your Name}}`;

  const copyScript = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    addToast('Sales script copied to clipboard!', 'success');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div>
      <div className="panel-header" style={{ marginBottom: '24px' }}>
        <div>
          <h2 className="panel-title">InstantQuote SaaS Sales Playbook</h2>
          <p className="panel-desc">
            Battle-tested pitch scripts, pricing models, and objection responses to close $39/mo recurring deals with local service businesses.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        {/* Pricing Model Card */}
        <div style={{ background: '#090d16', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <DollarSign size={22} color="#10b981" />
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Recommended Pricing Structure</h3>
          </div>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)', marginBottom: '16px' }}>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent-emerald)', marginBottom: '4px' }}>
              $150 Setup + $39/mo
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              100% pure software margin • Zero recurring API or hosting expenses
            </div>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#cbd5e1' }}>
            <li>✓ <strong>Setup Fee ($150):</strong> Covers custom service pricing config & embedding onto their site.</li>
            <li>✓ <strong>Monthly Fee ($39/mo):</strong> Covers CRM leads inbox, unlimited quote submissions & WhatsApp integration.</li>
            <li>✓ <strong>Value Proposition:</strong> Just 1 single converted lead per month pays for the entire software for 1 year.</li>
          </ul>
        </div>

        {/* Target Niches Card */}
        <div style={{ background: '#090d16', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Target size={22} color="#38bdf8" />
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Top High-Converting Niches</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
              <strong>🧹 House Cleaning & Maid Services:</strong> High volume, price-sensitive shoppers, simple sqft formula.
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
              <strong>🏠 Roofing & Siding Contractors:</strong> High ticket ($5,000+), clients desperately want fast estimates.
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
              <strong>🚗 Mobile Auto Detailing:</strong> Rapid booking cycles, package & addon heavy.
            </div>
          </div>
        </div>

      </div>

      {/* Outreach Script Block */}
      <div style={{ background: '#090d16', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageCircle size={20} color="#60a5fa" />
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Cold Email & Instagram DM Template</h3>
          </div>
          <button
            className="btn btn-secondary"
            style={{ fontSize: '12px', padding: '6px 14px' }}
            onClick={() => copyScript(coldEmailScript, 'email')}
          >
            {copiedKey === 'email' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            <span>{copiedKey === 'email' ? 'Copied to Clipboard!' : 'Copy Template'}</span>
          </button>
        </div>
        <div className="code-block" style={{ whiteSpace: 'pre-wrap' }}>
          {coldEmailScript}
        </div>
      </div>

      {/* Objection Handling */}
      <div style={{ background: '#090d16', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <HelpCircle size={20} color="#fbbf24" />
          <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Common Objections & Responses</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '14px', borderRadius: '10px', border: '1px solid var(--card-border)' }}>
            <div style={{ fontWeight: 700, color: '#fbbf24', fontSize: '14px', marginBottom: '4px' }}>
              Objection: "Our prices vary too much for each job, we can't give fixed prices."
            </div>
            <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5 }}>
              <strong>Answer:</strong> "That's exactly why this widget provides estimated ballparks rather than binding contracts. It gives the client the instant reassurance they want while delivering their phone number to you so you can follow up with the final exact scope."
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '14px', borderRadius: '10px', border: '1px solid var(--card-border)' }}>
            <div style={{ fontWeight: 700, color: '#fbbf24', fontSize: '14px', marginBottom: '4px' }}>
              Objection: "We already have a contact form on our website."
            </div>
            <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5 }}>
              <strong>Answer:</strong> "Static forms suffer from an 85% abandonment rate because users don't want to wait 24 hours just to know if you're in their budget. Interactive calculators double conversion rates because they give instant gratification in exchange for contact info."
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
