import React, { useState } from 'react';
import { Package, Plus, Trash2, Save, Palette } from 'lucide-react';
import { useBox } from '../context/BoxContext';
import { useToast } from './common/Toast';

const STATUS_OPTIONS = ['Planning', 'In Production', 'Shipped'];

export function BoxThemeBuilder() {
  const { boxConfig, updateBoxConfig, themes, addTheme, updateThemeStatus, deleteTheme } = useBox();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({ ...boxConfig });
  const [newTheme, setNewTheme] = useState({ title: '', emoji: '📦', color: '#7c3aed', itemCount: 6 });

  const handleSaveConfig = (e) => {
    e.preventDefault();
    updateBoxConfig(formData);
    addToast('Box branding updated!', 'success');
  };

  const handleAddTheme = (e) => {
    e.preventDefault();
    if (!newTheme.title.trim()) {
      addToast('Give this month\'s box a theme title', 'error');
      return;
    }
    addTheme(newTheme);
    setNewTheme({ title: '', emoji: '📦', color: '#7c3aed', itemCount: 6 });
    addToast('New box theme added!', 'success');
  };

  return (
    <div>
      <div className="panel-header" style={{ marginBottom: '24px' }}>
        <div>
          <h2 className="panel-title">Box Theme Builder</h2>
          <p className="panel-desc">
            Plan upcoming box themes, track production status, and update your brand details.
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
        gap: '32px',
        alignItems: 'start',
        marginBottom: '32px'
      }}>
        <div style={{ background: '#090d16', padding: '24px', borderRadius: '18px', border: '1px solid var(--card-border)' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '18px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Palette size={18} color="#a78bfa" /> Brand & Pricing
          </h3>

          <form onSubmit={handleSaveConfig} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Box Business Name</label>
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
                <label className="form-label">Tagline</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Monthly Price ($)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.priceMonthly}
                  onChange={(e) => setFormData({ ...formData, priceMonthly: Number(e.target.value) })}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Ship Day</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.shipDay}
                  onChange={(e) => setFormData({ ...formData, shipDay: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Checkout Link (Stripe/Shopify subscription page)</label>
              <input
                type="url"
                className="form-input"
                value={formData.checkoutUrl}
                onChange={(e) => setFormData({ ...formData, checkoutUrl: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-indigo" style={{ padding: '12px' }}>
              <Save size={16} />
              <span>Save Branding</span>
            </button>
          </form>
        </div>

        <div style={{ background: '#090d16', padding: '24px', borderRadius: '18px', border: '1px solid var(--card-border)' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '18px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} color="#a78bfa" /> Plan New Box Theme
          </h3>

          <form onSubmit={handleAddTheme} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Theme Title (e.g. "Cozy Winter Nights")</label>
              <input
                type="text"
                className="form-input"
                value={newTheme.title}
                onChange={(e) => setNewTheme({ ...newTheme, title: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '12px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Emoji</label>
                <input
                  type="text"
                  className="form-input"
                  value={newTheme.emoji}
                  onChange={(e) => setNewTheme({ ...newTheme, emoji: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Item Count</label>
                <input
                  type="number"
                  className="form-input"
                  value={newTheme.itemCount}
                  onChange={(e) => setNewTheme({ ...newTheme, itemCount: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Accent Color</label>
              <input
                type="color"
                className="form-input"
                style={{ height: '42px', padding: '4px' }}
                value={newTheme.color}
                onChange={(e) => setNewTheme({ ...newTheme, color: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-emerald" style={{ padding: '12px' }}>
              <Package size={16} />
              <span>Add Box Theme</span>
            </button>
          </form>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '18px', color: '#ffffff' }}>
          Box Theme Pipeline ({themes.length})
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {themes.map(item => (
            <div key={item.id} className="box-theme-card">
              <div className="box-theme-cover" style={{ background: `linear-gradient(135deg, ${item.color}33, ${item.color}11)` }}>
                {item.emoji}
              </div>
              <div style={{ padding: '16px' }}>
                <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>{item.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '12px' }}>
                  {item.itemCount} curated items
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                  <select
                    className="form-select"
                    style={{ padding: '5px 8px', fontSize: '12px', width: 'auto' }}
                    value={item.status}
                    onChange={(e) => updateThemeStatus(item.id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button
                    className="btn btn-danger"
                    style={{ padding: '5px 9px', fontSize: '11px' }}
                    onClick={() => { deleteTheme(item.id); addToast('Theme removed', 'info'); }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {themes.length === 0 && (
            <div style={{ color: 'var(--text-dim)', fontSize: '13px', padding: '20px' }}>
              No box themes yet. Plan your first month above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
