import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useToast } from './common/Toast';
import { INDUSTRY_PRESETS } from '../utils/presets';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_OPTS = Array.from({ length: 28 }, (_, i) => {
  const m = 7 * 60 + i * 30;
  const h = Math.floor(m / 60), mm = m % 60;
  return { value: `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`, label: `${(h % 12) || 12}:${String(mm).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}` };
});

export function BusinessSetup() {
  const {
    activePresetKey, config, availability,
    selectPreset, updateConfig, updateService, addService, removeService, updateAvailability
  } = useBooking();
  const { addToast } = useToast();

  return (
    <div>
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Business Setup</h2>
          <p className="panel-desc">Configure the client's services, prices, deposit and weekly hours. Everything here drives the live booking widget.</p>
        </div>
      </div>

      {/* Industry preset */}
      <div className="form-group">
        <label className="form-label">Industry preset</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Object.values(INDUSTRY_PRESETS).map(p => (
            <button
              key={p.id}
              className={`btn ${activePresetKey === p.id ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => { selectPreset(p.id); addToast(`Loaded ${p.label} preset`, 'success'); }}
            >
              <span>{p.icon}</span> {p.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        <div className="form-group">
          <label className="form-label">Business name</label>
          <input className="form-input" value={config.businessName} onChange={e => updateConfig({ businessName: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Widget tagline</label>
          <input className="form-input" value={config.tagline} onChange={e => updateConfig({ tagline: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input className="form-input" value={config.phone} onChange={e => updateConfig({ phone: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Brand accent color</label>
          <input type="color" className="form-input" style={{ height: 42, padding: 4 }} value={config.accent} onChange={e => updateConfig({ accent: e.target.value })} />
        </div>
      </div>

      {/* Deposit */}
      <div style={{ background: '#090d16', border: '1px solid var(--card-border)', borderRadius: 14, padding: 18, margin: '10px 0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: config.depositEnabled ? 14 : 0 }}>
          <button
            className={`avail-toggle ${config.depositEnabled ? 'on' : ''}`}
            onClick={() => updateConfig({ depositEnabled: !config.depositEnabled })}
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Require a deposit to book</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Cuts no-shows. Bookings with a deposit auto-confirm.</div>
          </div>
        </div>
        {config.depositEnabled && (
          <div className="form-group" style={{ maxWidth: 200, margin: 0 }}>
            <label className="form-label">Deposit amount ($)</label>
            <input type="number" className="form-input" value={config.depositAmount} onChange={e => updateConfig({ depositAmount: Number(e.target.value) })} />
          </div>
        )}
      </div>

      {/* Services */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800 }}>Services</h3>
          <button className="btn btn-secondary" style={{ fontSize: 12, padding: '6px 12px' }} onClick={addService}>
            <Plus size={13} /> Add service
          </button>
        </div>
        {config.services.map(s => (
          <div key={s.id} className="service-editor-row">
            <input className="form-input" style={{ padding: '8px', textAlign: 'center' }} value={s.icon} onChange={e => updateService(s.id, { icon: e.target.value })} maxLength={2} />
            <input className="form-input" style={{ padding: '8px 10px' }} value={s.name} onChange={e => updateService(s.id, { name: e.target.value })} />
            <input className="form-input" style={{ padding: '8px 10px' }} type="number" value={s.duration} onChange={e => updateService(s.id, { duration: Number(e.target.value) })} placeholder="min" />
            <input className="form-input" style={{ padding: '8px 10px' }} type="number" value={s.price} onChange={e => updateService(s.id, { price: Number(e.target.value) })} placeholder="$" />
            <button className="btn btn-danger" style={{ padding: 8 }} onClick={() => removeService(s.id)}><Trash2 size={14} /></button>
          </div>
        ))}
        <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>Columns: icon · name · duration (min) · price ($)</div>
      </div>

      {/* Weekly hours */}
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>Weekly availability</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>The widget only offers slots inside these windows.</p>
        {DAYS.map((name, dow) => {
          const rule = availability[dow];
          return (
            <div key={dow} className="avail-day-row">
              <span className="avail-day-name">{name}</span>
              <button className={`avail-toggle ${rule.open ? 'on' : ''}`} onClick={() => updateAvailability(dow, { open: !rule.open })} />
              {rule.open ? (
                <>
                  <select className="avail-time-select" value={rule.start} onChange={e => updateAvailability(dow, { start: e.target.value })}>
                    {TIME_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <span style={{ color: 'var(--text-dim)' }}>to</span>
                  <select className="avail-time-select" value={rule.end} onChange={e => updateAvailability(dow, { end: e.target.value })}>
                    {TIME_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </>
              ) : (
                <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>Closed</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
