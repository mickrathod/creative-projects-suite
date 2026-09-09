import React, { useState } from 'react';
import { Code2, Copy, Check } from 'lucide-react';
import { useQuote } from '../context/QuoteContext';
import { useToast } from './common/Toast';

export function EmbedGenerator() {
  const { config } = useQuote();
  const { addToast } = useToast();
  const [copiedKey, setCopiedKey] = useState(null);
  const [embedMode, setEmbedMode] = useState('modal'); // 'modal' or 'inline'

  const originUrl = window.location.origin;

  const scriptEmbedCode = `<!-- InstantQuote SaaS Calculator Widget -->
<script 
  src="${originUrl}/quote-widget.js" 
  data-business-name="${config.businessName}"
  data-primary-color="${config.primaryColor || '#2563eb'}"
  data-currency="${config.currency || '$'}"
  data-mode="${embedMode}"
  async>
</script>`;

  const iframeEmbedCode = `<iframe 
  src="${originUrl}/widget-embed?biz=${encodeURIComponent(config.businessName)}"
  width="100%" 
  height="620px" 
  style="border: none; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);"
  title="${config.businessName} Quote Calculator">
</iframe>`;

  const reactSnippet = `import { QuoteWidget } from './components/QuoteWidget';

export function QuoteSection() {
  return (
    <div className="max-w-2xl mx-auto my-12">
      <QuoteWidget 
        customConfig={{
          businessName: "${config.businessName}",
          primaryColor: "${config.primaryColor || '#2563eb'}",
          currency: "${config.currency || '$'}",
          discountPercent: ${config.discountPercent || 10}
        }} 
      />
    </div>
  );
}`;

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    addToast('Embed code copied to clipboard!', 'success');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div>
      <div className="panel-header" style={{ marginBottom: '20px' }}>
        <div>
          <h2 className="panel-title">Embed Code & Integration Hub</h2>
          <p className="panel-desc">
            Copy and paste this snippet onto any client website (WordPress, Webflow, Squarespace, Shopify, Custom HTML/React).
          </p>
        </div>
      </div>

      {/* Embed Mode Toggle */}
      <div style={{
        background: '#090d16',
        padding: '16px 20px',
        borderRadius: '14px',
        border: '1px solid var(--card-border)',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>Widget Display Mode</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Choose how the estimator renders on the client's page.</div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setEmbedMode('modal')}
            className={`btn ${embedMode === 'modal' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '12px', padding: '6px 14px' }}
          >
            Floating Launcher Button (Modal)
          </button>
          <button
            onClick={() => setEmbedMode('inline')}
            className={`btn ${embedMode === 'inline' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '12px', padding: '6px 14px' }}
          >
            Inline Embedded Card
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* Method 1: HTML Script Tag */}
        <div style={{ background: '#090d16', padding: '20px', borderRadius: '16px', border: '1px solid var(--card-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code2 size={18} color="#38bdf8" />
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Option 1: Universal 1-Line Script Tag (Recommended)</h3>
            </div>
            <button
              className="btn btn-secondary"
              style={{ fontSize: '12px', padding: '6px 12px' }}
              onClick={() => copyToClipboard(scriptEmbedCode, 'script')}
            >
              {copiedKey === 'script' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copiedKey === 'script' ? 'Copied!' : 'Copy Script'}</span>
            </button>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Paste this snippet into the {'<head>'} or before the closing {'</body>'} tag of any website:
          </p>
          <div className="code-block">{scriptEmbedCode}</div>
        </div>

        {/* Method 2: iFrame */}
        <div style={{ background: '#090d16', padding: '20px', borderRadius: '16px', border: '1px solid var(--card-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code2 size={18} color="#818cf8" />
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Option 2: Responsive HTML iFrame</h3>
            </div>
            <button
              className="btn btn-secondary"
              style={{ fontSize: '12px', padding: '6px 12px' }}
              onClick={() => copyToClipboard(iframeEmbedCode, 'iframe')}
            >
              {copiedKey === 'iframe' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copiedKey === 'iframe' ? 'Copied!' : 'Copy iFrame'}</span>
            </button>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Embed directly in custom HTML blocks on platforms like Wix, Squarespace, or Webflow:
          </p>
          <div className="code-block">{iframeEmbedCode}</div>
        </div>

        {/* Method 3: React / Next.js Component */}
        <div style={{ background: '#090d16', padding: '20px', borderRadius: '16px', border: '1px solid var(--card-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code2 size={18} color="#34d399" />
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Option 3: Native React / Next.js Component</h3>
            </div>
            <button
              className="btn btn-secondary"
              style={{ fontSize: '12px', padding: '6px 12px' }}
              onClick={() => copyToClipboard(reactSnippet, 'react')}
            >
              {copiedKey === 'react' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copiedKey === 'react' ? 'Copied!' : 'Copy React'}</span>
            </button>
          </div>
          <div className="code-block">{reactSnippet}</div>
        </div>

      </div>
    </div>
  );
}
