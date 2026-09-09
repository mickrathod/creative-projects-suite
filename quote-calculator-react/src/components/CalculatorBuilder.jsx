import React, { useState } from 'react';
import { Settings, Sparkles, Plus, Trash2, Palette, CheckCircle2, RotateCcw } from 'lucide-react';
import { useQuote } from '../context/QuoteContext';
import { INDUSTRY_PRESETS } from '../utils/presets';
import { QuoteWidget } from './QuoteWidget';
import { useToast } from './common/Toast';

export function CalculatorBuilder() {
  const { config, updateConfig, selectPreset, activePresetKey } = useQuote();
  const { addToast } = useToast();

  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState(99);
  const [newServiceIcon, setNewServiceIcon] = useState('✨');
  const [newServiceDesc, setNewServiceDesc] = useState('');

  const [newAddonName, setNewAddonName] = useState('');
  const [newAddonPrice, setNewAddonPrice] = useState(30);

  const handleAddService = (e) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    const newSvc = {
      id: 'svc-' + Date.now().toString(36),
      name: newServiceName.trim(),
      icon: newServiceIcon || '⚡',
      basePrice: Number(newServicePrice) || 50,
      desc: newServiceDesc.trim() || 'Custom service package'
    };

    updateConfig({ services: [...config.services, newSvc] });
    setNewServiceName('');
    setNewServiceDesc('');
    addToast(`Added service: ${newSvc.name}`, 'success');
  };

  const handleRemoveService = (id) => {
    if (config.services.length <= 1) {
      addToast('You must have at least one service', 'error');
      return;
    }
    updateConfig({ services: config.services.filter(s => s.id !== id) });
    addToast('Service removed', 'info');
  };

  const handleAddAddon = (e) => {
    e.preventDefault();
    if (!newAddonName.trim()) return;

    const newAdd = {
      id: 'add-' + Date.now().toString(36),
      name: newAddonName.trim(),
      price: Number(newAddonPrice) || 25
    };

    updateConfig({ addons: [...(config.addons || []), newAdd] });
    setNewAddonName('');
    addToast(`Added add-on: ${newAdd.name}`, 'success');
  };

  const handleRemoveAddon = (id) => {
    updateConfig({ addons: (config.addons || []).filter(a => a.id !== id) });
    addToast('Add-on removed', 'info');
  };

  return (
    <div>
      {/* Header */}
      <div className="panel-header" style={{ marginBottom: '20px' }}>
        <div>
          <h2 className="panel-title">Calculator & Pricing Engine Builder</h2>
          <p className="panel-desc">
            Customize services, base pricing, dimension scaling, brand styling, and test changes in the live preview sandbox.
          </p>
        </div>
      </div>

      {/* Preset Selector Bar */}
      <div style={{
        background: '#090d16',
        border: '1px solid var(--card-border)',
        borderRadius: '14px',
        padding: '16px 20px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="#38bdf8" />
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>Load Industry Preset:</span>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {Object.entries(INDUSTRY_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => {
                selectPreset(key);
                addToast(`Switched to ${preset.name} template`, 'success');
              }}
              style={{
                background: activePresetKey === key ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${activePresetKey === key ? '#3b82f6' : 'var(--card-border)'}`,
                color: activePresetKey === key ? '#60a5fa' : 'var(--text-muted)',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <span>{preset.icon}</span>
              <span>{preset.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Grid: Form Settings (Left) vs Live Sandbox (Right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '32px',
        alignItems: 'start'
      }}>
        
        {/* Left Column: Settings Accordion/Panels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* General Branding */}
          <div style={{ background: '#090d16', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Palette size={18} color="#38bdf8" /> Business Identity & Branding
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Business Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={config.businessName}
                  onChange={(e) => updateConfig({ businessName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Currency Symbol</label>
                <input
                  type="text"
                  className="form-input"
                  value={config.currency}
                  onChange={(e) => updateConfig({ currency: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">WhatsApp Number (e.g. 15552345678)</label>
                <input
                  type="text"
                  className="form-input"
                  value={config.whatsappNumber}
                  onChange={(e) => updateConfig({ whatsappNumber: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Theme Accent Color</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }}
                    value={config.primaryColor || '#2563eb'}
                    onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                  />
                  <input
                    type="text"
                    className="form-input"
                    value={config.primaryColor}
                    onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Discount Banner Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={config.discountText}
                  onChange={(e) => updateConfig({ discountText: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Discount %</label>
                <input
                  type="number"
                  className="form-input"
                  value={config.discountPercent}
                  onChange={(e) => updateConfig({ discountPercent: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>

          {/* Quantity / Scope Slider Config */}
          <div style={{ background: '#090d16', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px', color: '#ffffff' }}>
              📏 Dimension / Quantity Scaling
            </h3>

            <div className="form-group">
              <label className="form-label">Quantity Dimension Label</label>
              <input
                type="text"
                className="form-input"
                value={config.quantityLabel}
                onChange={(e) => updateConfig({ quantityLabel: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '12px' }}>
              <div>
                <label className="form-label">Min Value</label>
                <input
                  type="number"
                  className="form-input"
                  value={config.quantityMin}
                  onChange={(e) => updateConfig({ quantityMin: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="form-label">Max Value</label>
                <input
                  type="number"
                  className="form-input"
                  value={config.quantityMax}
                  onChange={(e) => updateConfig({ quantityMax: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="form-label">Step Size</label>
                <input
                  type="number"
                  className="form-input"
                  value={config.quantityStep}
                  onChange={(e) => updateConfig({ quantityStep: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Price Rate Per Unit ({config.currency} per unit above min)</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                value={config.quantityRatePerUnit}
                onChange={(e) => updateConfig({ quantityRatePerUnit: Number(e.target.value) })}
              />
            </div>
          </div>

          {/* Service Items Management */}
          <div style={{ background: '#090d16', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px', color: '#ffffff' }}>
              ⚡ Available Services (Step 1)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {(config.services || []).map(svc => (
                <div
                  key={svc.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--card-border)',
                    padding: '10px 14px',
                    borderRadius: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>{svc.icon}</span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700 }}>{svc.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{svc.desc}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                      {config.currency}{svc.basePrice}
                    </span>
                    <button
                      className="btn btn-danger"
                      style={{ padding: '4px 8px' }}
                      onClick={() => handleRemoveService(svc.id)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Service Sub-Form */}
            <form onSubmit={handleAddService} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '10px', border: '1px dashed var(--card-border)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>+ Add New Service</div>
              <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 90px', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Icon"
                  value={newServiceIcon}
                  onChange={(e) => setNewServiceIcon(e.target.value)}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Service Name"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                />
                <input
                  type="number"
                  className="form-input"
                  placeholder="Base $"
                  value={newServicePrice}
                  onChange={(e) => setNewServicePrice(e.target.value)}
                />
              </div>
              <input
                type="text"
                className="form-input"
                placeholder="Short Description"
                value={newServiceDesc}
                onChange={(e) => setNewServiceDesc(e.target.value)}
                style={{ marginBottom: '8px' }}
              />
              <button type="submit" className="btn btn-secondary" style={{ width: '100%', fontSize: '12px' }}>
                <Plus size={14} /> Add Service
              </button>
            </form>
          </div>

          {/* Add-ons Management */}
          <div style={{ background: '#090d16', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px', color: '#ffffff' }}>
              ✨ Optional Add-ons (Step 2)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {(config.addons || []).map(addon => (
                <div
                  key={addon.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--card-border)',
                    padding: '8px 12px',
                    borderRadius: '8px'
                  }}
                >
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{addon.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#38bdf8' }}>
                      +{config.currency}{addon.price}
                    </span>
                    <button
                      className="btn btn-danger"
                      style={{ padding: '4px 6px' }}
                      onClick={() => handleRemoveAddon(addon.id)}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Addon Form */}
            <form onSubmit={handleAddAddon} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Add-on Name (e.g. Window Scrub)"
                value={newAddonName}
                onChange={(e) => setNewAddonName(e.target.value)}
                style={{ flex: 2 }}
              />
              <input
                type="number"
                className="form-input"
                placeholder="Price"
                value={newAddonPrice}
                onChange={(e) => setNewAddonPrice(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-secondary">
                <Plus size={14} />
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Sticky Live Sandbox Preview */}
        <div style={{ position: 'sticky', top: '90px' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(9, 13, 22, 0.95))',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
                <span style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Live Sandbox Preview</span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Instant Real-time Sync</span>
            </div>

            <QuoteWidget customConfig={config} isInline={true} />
          </div>
        </div>

      </div>
    </div>
  );
}
