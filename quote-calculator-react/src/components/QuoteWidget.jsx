import React, { useState } from 'react';
import { Check, ArrowRight, ArrowLeft, Send, Sparkles, MessageSquare, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useQuote } from '../context/QuoteContext';
import { useToast } from './common/Toast';

export function QuoteWidget({ customConfig, onSubmitted, isInline = false }) {
  const { config: globalConfig, addLead } = useQuote();
  const config = customConfig || globalConfig;
  const { addToast } = useToast();

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(config.services[0] || {});
  const [quantity, setQuantity] = useState(config.quantityDefault || 1500);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '', notes: '' });
  const [submittedLead, setSubmittedLead] = useState(null);

  // Price Calculation
  const basePrice = selectedService.basePrice || 0;
  const extraQty = Math.max(0, quantity - (config.quantityMin || 0));
  const qtyExtraPrice = Math.round(extraQty * (config.quantityRatePerUnit || 0));
  
  let addonsTotal = 0;
  selectedAddons.forEach(aName => {
    const found = (config.addons || []).find(a => a.name === aName);
    if (found) addonsTotal += found.price;
  });

  const subtotal = basePrice + qtyExtraPrice + addonsTotal;
  const discountPercent = config.discountPercent || 0;
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const finalTotal = subtotal - discountAmount;

  const handleToggleAddon = (addonName) => {
    if (selectedAddons.includes(addonName)) {
      setSelectedAddons(selectedAddons.filter(a => a !== addonName));
    } else {
      setSelectedAddons([...selectedAddons, addonName]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customer.name.trim() || !customer.phone.trim()) {
      addToast('Please provide your name and phone number', 'error');
      return;
    }

    const leadPayload = {
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      serviceName: selectedService.name || 'Custom Service',
      quantity,
      quantityLabel: config.quantityLabel,
      addons: selectedAddons,
      totalPrice: finalTotal,
      notes: customer.notes
    };

    const newLead = addLead(leadPayload);
    setSubmittedLead(newLead);
    addToast('Quote estimate submitted successfully!', 'success');

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {}

    if (onSubmitted) onSubmitted(newLead);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedService(config.services[0] || {});
    setQuantity(config.quantityDefault || 1500);
    setSelectedAddons([]);
    setCustomer({ name: '', phone: '', email: '', notes: '' });
    setSubmittedLead(null);
  };

  const whatsappMessage = encodeURIComponent(
    `Hi ${config.businessName}, I just calculated an instant quote on your website for "${selectedService.name}" (${finalTotal} ${config.currency}). My name is ${customer.name}.`
  );
  const whatsappUrl = `https://wa.me/${(config.whatsappNumber || '').replace(/\D/g, '')}?text=${whatsappMessage}`;

  return (
    <div style={{
      background: '#0d1322',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
      padding: '24px',
      color: '#f8fafc',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
      fontFamily: 'var(--font-main)',
      maxWidth: '100%',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Top Banner Discount */}
      {config.discountText && (
        <div style={{
          background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.15), rgba(234, 88, 12, 0.15))',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          color: '#fbbf24',
          borderRadius: '10px',
          padding: '8px 14px',
          fontSize: '12px',
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px'
        }}>
          <Sparkles size={14} /> {config.discountText}
        </div>
      )}

      {/* Stepper Header */}
      {!submittedLead && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          {[
            { num: 1, label: 'Select Service' },
            { num: 2, label: 'Scope & Add-ons' },
            { num: 3, label: 'Lock In Price' }
          ].map(s => (
            <div
              key={s.num}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: step >= s.num ? 1 : 0.4,
                cursor: step > s.num ? 'pointer' : 'default'
              }}
              onClick={() => step > s.num && setStep(s.num)}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: step === s.num ? (config.primaryColor || '#2563eb') : step > s.num ? '#10b981' : '#1e293b',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700
              }}>
                {step > s.num ? <Check size={14} /> : s.num}
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600 }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* STEP 1: SERVICE PICKER */}
      {!submittedLead && step === 1 && (
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>Step 1: Choose Your Service</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '18px' }}>
            Select the primary service you require:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            {(config.services || []).map(svc => {
              const isSelected = selectedService.id === svc.id;
              return (
                <div
                  key={svc.id}
                  onClick={() => setSelectedService(svc)}
                  style={{
                    background: isSelected ? 'rgba(37, 99, 235, 0.12)' : '#090d16',
                    border: `2px solid ${isSelected ? (config.primaryColor || '#2563eb') : 'rgba(255, 255, 255, 0.08)'}`,
                    borderRadius: '14px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>{svc.icon || '⚡'}</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>{svc.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', minHeight: '34px' }}>{svc.desc}</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: config.primaryColor || '#38bdf8' }}>
                    From {config.currency}{svc.basePrice}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="btn btn-primary"
              style={{ background: config.primaryColor || '#2563eb' }}
              onClick={() => setStep(2)}
            >
              <span>Next: Customize Scope</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: QUANTITY & ADDONS */}
      {!submittedLead && step === 2 && (
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>Step 2: Customize Dimensions & Add-ons</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '18px' }}>
            Adjust your property size and include optional enhancements.
          </p>

          {/* Range Slider */}
          <div style={{ background: '#090d16', padding: '16px', borderRadius: '14px', border: '1px solid var(--card-border)', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#cbd5e1' }}>{config.quantityLabel}:</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: config.primaryColor || '#38bdf8' }}>
                {quantity} {config.quantityLabel.toLowerCase().includes('sq') ? 'sq ft' : ''}
              </span>
            </div>
            <input
              type="range"
              min={config.quantityMin || 500}
              max={config.quantityMax || 5000}
              step={config.quantityStep || 100}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              style={{ width: '100%', accentColor: config.primaryColor || '#2563eb', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>
              <span>{config.quantityMin} min</span>
              <span>{config.quantityMax} max</span>
            </div>
          </div>

          {/* Add-ons List */}
          {(config.addons || []).length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#cbd5e1', marginBottom: '10px' }}>
                Optional Add-on Services:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                {config.addons.map(addon => {
                  const isChecked = selectedAddons.includes(addon.name);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => handleToggleAddon(addon.name)}
                      style={{
                        background: isChecked ? 'rgba(16, 185, 129, 0.12)' : '#090d16',
                        border: `1px solid ${isChecked ? '#10b981' : 'var(--card-border)'}`,
                        borderRadius: '10px',
                        padding: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '4px',
                          border: `1px solid ${isChecked ? '#10b981' : '#475569'}`,
                          background: isChecked ? '#10b981' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {isChecked && <Check size={12} color="#000" />}
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 600 }}>{addon.name}</span>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8' }}>
                        +{config.currency}{addon.price}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Subtotal preview bar */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--card-border)',
            borderRadius: '12px',
            padding: '12px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Estimated Price so far:</span>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>
              {config.currency}{finalTotal}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn btn-secondary" onClick={() => setStep(1)}>
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
            <button
              className="btn btn-primary"
              style={{ background: config.primaryColor || '#2563eb' }}
              onClick={() => setStep(3)}
            >
              <span>Next: Lock In Estimate</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CONTACT FORM & SUMMARY */}
      {!submittedLead && step === 3 && (
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>Step 3: Lock In Your Instant Estimate</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '18px' }}>
            Enter your details to receive this official price breakdown and schedule your appointment.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            {/* Estimate Summary Box */}
            <div style={{
              background: '#090d16',
              border: '1px solid var(--card-border)',
              borderRadius: '14px',
              padding: '18px'
            }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
                Quote Summary
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span>{selectedService.name}</span>
                <span style={{ fontWeight: 700 }}>{config.currency}{basePrice}</span>
              </div>
              {qtyExtraPrice > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', color: 'var(--text-muted)' }}>
                  <span>Extra Dimensions ({quantity})</span>
                  <span>+{config.currency}{qtyExtraPrice}</span>
                </div>
              )}
              {selectedAddons.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', color: 'var(--text-muted)' }}>
                  <span>{selectedAddons.length} Add-on(s)</span>
                  <span>+{config.currency}{addonsTotal}</span>
                </div>
              )}
              {discountPercent > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', color: '#fbbf24' }}>
                  <span>{discountPercent}% Online Booking Discount</span>
                  <span>-{config.currency}{discountAmount}</span>
                </div>
              )}
              <div style={{
                borderTop: '1px solid var(--card-border)',
                marginTop: '12px',
                paddingTop: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline'
              }}>
                <span style={{ fontSize: '14px', fontWeight: 700 }}>Locked Total:</span>
                <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                  {config.currency}{finalTotal}
                </span>
              </div>
            </div>

            {/* Contact Details Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <input
                  type="text"
                  placeholder="Your Full Name *"
                  className="form-input"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Phone Number (for SMS confirmation) *"
                  className="form-input"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email Address (Optional)"
                  className="form-input"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Preferred date / special requests"
                  className="form-input"
                  value={customer.notes}
                  onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setStep(2)}>
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  className="btn btn-emerald"
                  style={{ flex: 1 }}
                >
                  <Send size={16} />
                  <span>Lock In Quote Estimate</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION STATE */}
      {submittedLead && (
        <div style={{ textAlign: 'center', padding: '24px 10px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.2)',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)'
          }}>
            <CheckCircle2 size={36} />
          </div>

          <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>
            Quote Locked & Received!
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 20px', lineHeight: 1.6 }}>
            Thank you <strong style={{ color: '#fff' }}>{submittedLead.name}</strong>. Your estimate of <strong style={{ color: 'var(--accent-emerald)' }}>{config.currency}{submittedLead.totalPrice}</strong> for {submittedLead.serviceName} has been transmitted to our dispatch team.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-emerald"
              style={{ textDecoration: 'none' }}
            >
              <MessageSquare size={16} />
              <span>Connect on WhatsApp Now</span>
            </a>
            <button className="btn btn-secondary" onClick={handleReset}>
              <span>Calculate Another Quote</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
