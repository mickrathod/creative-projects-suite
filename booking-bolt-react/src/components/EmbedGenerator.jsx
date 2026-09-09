import React, { useState } from 'react';
import { Copy, Check, Code2 } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useToast } from './common/Toast';

export function EmbedGenerator() {
  const { config } = useBooking();
  const { addToast } = useToast();
  const [copied, setCopied] = useState(null);

  const slug = config.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const inlineSnippet = `<!-- BookingBolt widget for ${config.businessName} -->
<div id="bookingbolt-widget" data-client="${slug}"></div>
<script src="https://cdn.bookingbolt.app/embed.js" async></script>`;

  const buttonSnippet = `<!-- BookingBolt "Book Now" button -->
<a href="https://book.bookingbolt.app/${slug}"
   class="bookingbolt-btn"
   style="background:${config.accent};color:#fff;padding:12px 22px;border-radius:10px;
          font-weight:700;text-decoration:none;font-family:sans-serif;">
  📅 Book Now
</a>`;

  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    addToast('Embed code copied!', 'success');
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Embed Code</h2>
          <p className="panel-desc">One line to drop the booking widget onto the client's existing website — Wix, Squarespace, WordPress, plain HTML, anything.</p>
        </div>
      </div>

      <Block
        title="Option A — Inline widget (recommended)"
        desc="Renders the full booking flow right on their page."
        code={inlineSnippet}
        copied={copied === 'inline'}
        onCopy={() => copy(inlineSnippet, 'inline')}
      />

      <Block
        title="Option B — Book Now button"
        desc="Opens the booking page in a new tab. Best for tight layouts."
        code={buttonSnippet}
        copied={copied === 'button'}
        onCopy={() => copy(buttonSnippet, 'button')}
      />

      <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 14, padding: 18, marginTop: 8 }}>
        <div style={{ fontWeight: 800, marginBottom: 6, color: 'var(--accent-emerald)' }}>Hosted booking link</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#93c5fd' }}>
          https://book.bookingbolt.app/{slug}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
          Put this in their Instagram bio, Google Business Profile, and email signature — no website needed.
        </div>
      </div>
    </div>
  );
}

function Block({ title, desc, code, copied, onCopy }) {
  return (
    <div style={{ background: '#090d16', border: '1px solid var(--card-border)', borderRadius: 16, padding: 20, marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Code2 size={16} color="#60a5fa" />
          <h3 style={{ fontSize: 15, fontWeight: 800 }}>{title}</h3>
        </div>
        <button className="btn btn-secondary" style={{ fontSize: 12, padding: '6px 12px' }} onClick={onCopy}>
          {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>{desc}</div>
      <div className="code-block" style={{ whiteSpace: 'pre-wrap' }}>{code}</div>
    </div>
  );
}
