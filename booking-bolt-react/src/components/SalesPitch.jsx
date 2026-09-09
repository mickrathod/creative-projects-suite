import React, { useState } from 'react';
import { DollarSign, Target, MessageCircle, HelpCircle, Copy, Check } from 'lucide-react';
import { useToast } from './common/Toast';

export function SalesPitch() {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(null);

  const coldEmail = `Subject: {{Business Name}} — missed bookings after hours?

Hi {{Owner Name}},

I called {{Business Name}} yesterday evening and got voicemail. That's normal — but most people who reach voicemail just book with the next result on Google instead of calling back.

I set up a live "Book Now" widget for {{Business Name}} that lets customers pick a service and time slot in about 30 seconds, straight from your website or Instagram bio. It drops the booking into a simple calendar for you, takes a deposit if you want one, and costs you nothing per booking.

Here's a free demo customized for you:
{{Live Demo Link}}

Worth a 5-minute look?

{{Your Name}}
{{Your Phone}}`;

  const dmScript = `Hey {{Business Name}}! 👋 Love your work. Quick one — do you take bookings through your Instagram? I build instant-booking pages for {{industry}} businesses (customer picks a time, you get it in a calendar, optional deposit to stop no-shows). Set one up for you as a free demo — want the link?`;

  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    addToast('Script copied!', 'success');
    setTimeout(() => setCopied(null), 2200);
  };

  return (
    <div>
      <div className="panel-header">
        <div>
          <h2 className="panel-title">BookingBolt Sales Playbook</h2>
          <p className="panel-desc">Scripts, pricing and objection handling to close $49/mo recurring deals with local service businesses.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20, marginBottom: 28 }}>
        <div style={{ background: '#090d16', border: '1px solid var(--card-border)', borderRadius: 16, padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <DollarSign size={20} color="#10b981" />
            <h3 style={{ fontSize: 17, fontWeight: 800 }}>Recommended Pricing</h3>
          </div>
          <div style={{ background: 'rgba(16,185,129,0.1)', padding: 14, borderRadius: 12, border: '1px solid rgba(16,185,129,0.2)', marginBottom: 14 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent-emerald)' }}>$199 setup + $49/mo</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>100% software margin · no per-booking fee · no API cost</div>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9, fontSize: 13, color: '#cbd5e1' }}>
            <li>✓ <strong>Setup ($199):</strong> service/price config, hours, branding, embed on their site.</li>
            <li>✓ <strong>Monthly ($49):</strong> unlimited bookings, calendar CRM, deposit capture, WhatsApp confirmations.</li>
            <li>✓ <strong>Pitch math:</strong> one recovered $89 booking a month more than covers it.</li>
            <li>✓ <strong>Upsell:</strong> +$20/mo for SMS reminders, +$99 to migrate their old Calendly.</li>
          </ul>
        </div>

        <div style={{ background: '#090d16', border: '1px solid var(--card-border)', borderRadius: 16, padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Target size={20} color="#60a5fa" />
            <h3 style={{ fontSize: 17, fontWeight: 800 }}>Best Target Niches</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, fontSize: 13 }}>
            {[
              ['💈 Barbers & salons', 'Chair-based, high volume, no-shows hurt — deposits are an easy yes.'],
              ['🦷 Dental & med spas', 'High-value slots, front desk is swamped, love online self-booking.'],
              ['🚗 Mobile detailers', 'Route-based, deposit filters tire-kickers, book days ahead.'],
              ['🧹 Cleaning services', 'Recurring work, owners answer phones on job sites — widget wins the after-hours lead.']
            ].map(([t, d]) => (
              <div key={t} style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--card-border)' }}>
                <strong>{t}:</strong> {d}
              </div>
            ))}
          </div>
        </div>
      </div>

      <ScriptBlock title="Cold email template" icon={<MessageCircle size={18} color="#60a5fa" />} text={coldEmail} copied={copied === 'email'} onCopy={() => copy(coldEmail, 'email')} />
      <ScriptBlock title="Instagram DM template" icon={<MessageCircle size={18} color="#a855f7" />} text={dmScript} copied={copied === 'dm'} onCopy={() => copy(dmScript, 'dm')} />

      <div style={{ background: '#090d16', border: '1px solid var(--card-border)', borderRadius: 16, padding: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <HelpCircle size={18} color="#fbbf24" />
          <h3 style={{ fontSize: 17, fontWeight: 800 }}>Objection Handling</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            ['"We already take bookings by phone."', 'Phone works during business hours. Over half of booking intent happens evenings and weekends when nobody picks up — that\'s the revenue this captures, on top of what you already do.'],
            ['"I use Calendly / Square already."', 'Great — this is the same idea but branded to you, no per-booking fee, and it drops straight into a calendar your team actually checks. I\'ll migrate your existing setup for a one-time $99.'],
            ['"My prices depend on the job."', 'The widget books a time slot, not a final price. The customer picks "Deep Clean", you confirm scope when you call. You still get their name, number and a locked-in slot.'],
            ['"I don\'t want to pay monthly for software."', 'One booking you would\'ve lost to voicemail pays for two months. Cancel anytime — but nobody does, because the calendar fills up.']
          ].map(([q, a]) => (
            <div key={q} style={{ background: 'rgba(255,255,255,0.02)', padding: 14, borderRadius: 10, border: '1px solid var(--card-border)' }}>
              <div style={{ fontWeight: 700, color: '#fbbf24', fontSize: 14, marginBottom: 4 }}>Objection: {q}</div>
              <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5 }}><strong>Answer:</strong> {a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScriptBlock({ title, icon, text, copied, onCopy }) {
  return (
    <div style={{ background: '#090d16', border: '1px solid var(--card-border)', borderRadius: 16, padding: 22, marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {icon}
          <h3 style={{ fontSize: 16, fontWeight: 800 }}>{title}</h3>
        </div>
        <button className="btn btn-secondary" style={{ fontSize: 12, padding: '6px 12px' }} onClick={onCopy}>
          {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <div className="code-block" style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--font-main)', color: '#cbd5e1' }}>{text}</div>
    </div>
  );
}
