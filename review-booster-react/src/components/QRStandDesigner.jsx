import React, { useState, useEffect, useRef } from 'react';
import { QrCode, Printer, Save, Palette } from 'lucide-react';
import { useReview } from '../context/ReviewContext';
import { renderQRToCanvas } from '../utils/qrGenerator';
import { useToast } from './common/Toast';

export function QRStandDesigner() {
  const { bizConfig, updateBizConfig } = useReview();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({ ...bizConfig });
  const [standTemplate, setStandTemplate] = useState('dark'); // 'dark' or 'light' or 'gold'
  const canvasRef = useRef(null);

  // Re-render QR code whenever canvas or Google URL changes
  useEffect(() => {
    if (canvasRef.current) {
      renderQRToCanvas(canvasRef.current, formData.googleUrl || window.location.href, {
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        },
        width: 170
      });
    }
  }, [formData.googleUrl]);

  const handleSave = (e) => {
    e.preventDefault();
    updateBizConfig(formData);
    addToast('Business details & QR Code updated!', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="panel-header" style={{ marginBottom: '24px' }}>
        <div>
          <h2 className="panel-title">Smart QR Code & Counter Stand Generator</h2>
          <p className="panel-desc">
            Customize the business profile, generate a high-resolution QR code, and print tabletop display tents for front desks, restaurant tables, or reception counters.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={handlePrint}>
            <Printer size={15} />
            <span>Print Counter Table Stand</span>
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
        gap: '32px',
        alignItems: 'start'
      }}>
        
        {/* Left Column: Config Form */}
        <div style={{ background: '#090d16', padding: '24px', borderRadius: '18px', border: '1px solid var(--card-border)' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '18px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Palette size={18} color="#818cf8" /> Business Branding & Destination
          </h3>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Business Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '12px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Emoji / Icon</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Tagline (e.g. Dental & Spa)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Official Google Review Link (Where 5-star reviews go)</label>
              <input
                type="url"
                className="form-input"
                value={formData.googleUrl}
                onChange={(e) => setFormData({ ...formData, googleUrl: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Manager WhatsApp Number (for urgent escalation)</label>
              <input
                type="text"
                className="form-input"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              />
            </div>

            {/* Stand Template Switcher */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Stand Card Visual Theme</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setStandTemplate('dark')}
                  className={`btn ${standTemplate === 'dark' ? 'btn-indigo' : 'btn-secondary'}`}
                  style={{ fontSize: '12px', padding: '6px 12px', flex: 1 }}
                >
                  Dark Luxe
                </button>
                <button
                  type="button"
                  onClick={() => setStandTemplate('light')}
                  className={`btn ${standTemplate === 'light' ? 'btn-indigo' : 'btn-secondary'}`}
                  style={{ fontSize: '12px', padding: '6px 12px', flex: 1 }}
                >
                  Minimalist Clean
                </button>
                <button
                  type="button"
                  onClick={() => setStandTemplate('gold')}
                  className={`btn ${standTemplate === 'gold' ? 'btn-indigo' : 'btn-secondary'}`}
                  style={{ fontSize: '12px', padding: '6px 12px', flex: 1 }}
                >
                  Emerald / Gold
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" className="btn btn-indigo" style={{ flex: 1, padding: '12px' }}>
                <Save size={16} />
                <span>Save & Update QR Stand</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Printable Tabletop Counter Tent Stand Preview */}
        <div style={{ position: 'sticky', top: '90px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>
              🖨️ Printable Tabletop Stand Preview (4" x 6" Tent)
            </span>
            <button className="btn btn-secondary" style={{ fontSize: '11px', padding: '4px 10px' }} onClick={handlePrint}>
              <Printer size={12} /> Print
            </button>
          </div>

          {/* Stand Render Card */}
          <div
            className="printable-stand-container"
            style={{
              background: standTemplate === 'light' ? '#ffffff' :
                          standTemplate === 'gold' ? 'linear-gradient(135deg, #064e3b, #022c22)' :
                          'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
              color: standTemplate === 'light' ? '#0f172a' : '#ffffff',
              border: `2px solid ${standTemplate === 'light' ? '#cbd5e1' : standTemplate === 'gold' ? '#10b981' : 'rgba(99, 102, 241, 0.4)'}`,
              borderRadius: '24px',
              padding: '32px 24px',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
              maxWidth: '360px',
              margin: '0 auto',
              position: 'relative'
            }}
          >
            {/* Top Stand Header */}
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: standTemplate === 'light' ? '#f1f5f9' : 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              margin: '0 auto 12px'
            }}>
              {formData.icon || '⭐'}
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '4px' }}>
              {formData.name || 'Your Business Name'}
            </h3>
            <p style={{
              fontSize: '12px',
              color: standTemplate === 'light' ? '#64748b' : 'rgba(255, 255, 255, 0.7)',
              marginBottom: '20px'
            }}>
              {formData.tagline || 'We appreciate your valuable feedback'}
            </p>

            {/* Stars row */}
            <div style={{ color: '#fbbf24', fontSize: '20px', letterSpacing: '4px', marginBottom: '18px' }}>
              ★★★★★
            </div>

            {/* QR Code Canvas Card */}
            <div style={{
              background: '#ffffff',
              padding: '16px',
              borderRadius: '18px',
              display: 'inline-block',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
              marginBottom: '18px'
            }}>
              <canvas ref={canvasRef} style={{ width: '170px', height: '170px', display: 'block' }}></canvas>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Scan with Camera
              </div>
            </div>

            <div style={{
              fontSize: '13px',
              fontWeight: 700,
              color: standTemplate === 'light' ? '#0f172a' : '#ffffff',
              marginBottom: '6px'
            }}>
              How was your experience today?
            </div>
            <p style={{
              fontSize: '11px',
              color: standTemplate === 'light' ? '#94a3b8' : 'rgba(255, 255, 255, 0.6)',
              lineHeight: 1.4
            }}>
              Point your smartphone camera at the QR code above to share your rating in 15 seconds.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
