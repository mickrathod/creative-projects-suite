import React, { useState, useMemo } from 'react';
import { ChevronLeft, Check, Clock, CalendarDays } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { upcomingDays, slotsForDay, minutesToLabel, fmtDate } from '../utils/slots';

/**
 * The customer-facing widget the local business embeds on their site.
 * `customConfig` lets the simulator preview unsaved edits; falls back to live config.
 */
export function BookingWidget({ customConfig, onBooked }) {
  const ctx = useBooking();
  const config = customConfig || ctx.config;
  const { availability, appointments, bookAppointment } = ctx;
  const accent = config.accent || '#3b82f6';

  const [step, setStep] = useState(0); // 0 service, 1 date+time, 2 details, 3 done
  const [service, setService] = useState(null);
  const [day, setDay] = useState(null);
  const [slot, setSlot] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '' });
  const [confirmed, setConfirmed] = useState(null);

  const days = useMemo(() => upcomingDays(availability, 10), [availability]);

  const slots = useMemo(() => {
    if (!day || !service) return [];
    return slotsForDay(day, availability, config.slotMinutes || 60, service.duration, appointments);
  }, [day, service, availability, config.slotMinutes, appointments]);

  const canSubmit = form.name.trim() && form.phone.trim() && slot != null;

  const submit = () => {
    if (!canSubmit) return;
    const start = new Date(day);
    start.setHours(0, slot, 0, 0);
    const appt = bookAppointment({
      start: start.toISOString(),
      customerName: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      serviceName: service.name,
      notes: form.notes.trim()
    });
    setConfirmed({ ...appt, startDate: start });
    setStep(3);
    if (onBooked) onBooked(appt);
  };

  const reset = () => {
    setStep(0); setService(null); setDay(null); setSlot(null);
    setForm({ name: '', phone: '', email: '', notes: '' }); setConfirmed(null);
  };

  return (
    <div className="bw-root" style={{ '--bw-accent': accent }}>
      <div className="bw-header" style={{ background: `linear-gradient(135deg, ${accent}, ${shade(accent, -18)})` }}>
        <div className="bw-biz-name">{config.businessName}</div>
        <div className="bw-biz-tag">{config.tagline}</div>
      </div>

      {step < 3 && (
        <div className="bw-steps">
          {[0, 1, 2].map(i => (
            <div key={i} className={`bw-step-dot ${step >= i ? 'done' : ''}`} />
          ))}
        </div>
      )}

      <div className="bw-body">
        {/* STEP 0 — choose service */}
        {step === 0 && (
          <>
            <div className="bw-section-title">Choose a service</div>
            <div className="bw-section-sub">Pick what you'd like to book.</div>
            {config.services.map(s => (
              <div
                key={s.id}
                className={`bw-service-card ${service?.id === s.id ? 'selected' : ''}`}
                onClick={() => { setService(s); setSlot(null); }}
              >
                <div className="bw-service-icon">{s.icon}</div>
                <div>
                  <div className="bw-service-name">{s.name}</div>
                  <div className="bw-service-meta">
                    <Clock size={11} style={{ verticalAlign: '-1px' }} /> {s.duration} min
                  </div>
                </div>
                <div className="bw-service-price">{s.price > 0 ? `$${s.price}` : 'Free'}</div>
              </div>
            ))}
            <button
              className="bw-cta"
              style={{ background: accent, marginTop: 8 }}
              disabled={!service}
              onClick={() => setStep(1)}
            >
              Continue
            </button>
          </>
        )}

        {/* STEP 1 — date + time */}
        {step === 1 && (
          <>
            <button className="bw-back" onClick={() => setStep(0)}>
              <ChevronLeft size={14} style={{ verticalAlign: '-2px' }} /> Back
            </button>
            <div className="bw-section-title">Pick a date &amp; time</div>
            <div className="bw-section-sub">{service.name} · {service.duration} min</div>

            <div className="bw-date-strip">
              {days.map((d, i) => (
                <div
                  key={i}
                  className={`bw-date-pill ${day && sameDayLocal(d, day) ? 'selected' : ''}`}
                  onClick={() => { setDay(d); setSlot(null); }}
                >
                  <div className="bw-date-dow">{d.toLocaleDateString(undefined, { weekday: 'short' })}</div>
                  <div className="bw-date-num">{d.getDate()}</div>
                  <div className="bw-date-mon">{d.toLocaleDateString(undefined, { month: 'short' })}</div>
                </div>
              ))}
            </div>

            {!day && (
              <div style={{ fontSize: 13, color: '#94a3b8', padding: '10px 0' }}>
                <CalendarDays size={14} style={{ verticalAlign: '-2px' }} /> Select a day above.
              </div>
            )}

            {day && slots.length === 0 && (
              <div style={{ fontSize: 13, color: '#94a3b8', padding: '10px 0' }}>
                No open times on this day. Try another date.
              </div>
            )}

            {day && slots.length > 0 && (
              <div className="bw-slot-grid">
                {slots.map(s => (
                  <div
                    key={s.minutes}
                    className={`bw-slot ${s.disabled ? 'disabled' : ''} ${slot === s.minutes ? 'selected' : ''}`}
                    onClick={() => !s.disabled && setSlot(s.minutes)}
                  >
                    {s.label}
                  </div>
                ))}
              </div>
            )}

            <button
              className="bw-cta"
              style={{ background: accent, marginTop: 16 }}
              disabled={slot == null}
              onClick={() => setStep(2)}
            >
              Continue
            </button>
          </>
        )}

        {/* STEP 2 — details */}
        {step === 2 && (
          <>
            <button className="bw-back" onClick={() => setStep(1)}>
              <ChevronLeft size={14} style={{ verticalAlign: '-2px' }} /> Back
            </button>
            <div className="bw-section-title">Your details</div>
            <div className="bw-section-sub">We'll send a confirmation to your phone.</div>

            <div className="bw-summary">
              <div className="bw-summary-row"><span className="lbl">Service</span><span className="val">{service.name}</span></div>
              <div className="bw-summary-row"><span className="lbl">When</span><span className="val">{fmtDate(day)}, {minutesToLabel(slot)}</span></div>
              <div className="bw-summary-row"><span className="lbl">Price</span><span className="val">{service.price > 0 ? `$${service.price}` : 'Free'}</span></div>
              {config.depositEnabled && (
                <div className="bw-summary-row"><span className="lbl">Deposit today</span><span className="val" style={{ color: accent }}>${config.depositAmount}</span></div>
              )}
            </div>

            <div className="bw-field">
              <label>Full name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" />
            </div>
            <div className="bw-field">
              <label>Mobile number *</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="(555) 123-4567" />
            </div>
            <div className="bw-field">
              <label>Email</label>
              <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="jane@email.com" />
            </div>
            <div className="bw-field">
              <label>Notes for the team</label>
              <textarea rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Gate code, parking, special requests…" />
            </div>

            <button className="bw-cta" style={{ background: accent }} disabled={!canSubmit} onClick={submit}>
              {config.depositEnabled ? `Pay $${config.depositAmount} & Confirm Booking` : 'Confirm Booking'}
            </button>
          </>
        )}

        {/* STEP 3 — success */}
        {step === 3 && confirmed && (
          <div className="bw-success">
            <div className="bw-success-check"><Check size={32} /></div>
            <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 4 }}>You're booked!</div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 18 }}>
              {service.name} · {fmtDate(confirmed.startDate)} at {minutesToLabel(slot)}
            </div>
            <div className="bw-summary" style={{ textAlign: 'left' }}>
              <div className="bw-summary-row"><span className="lbl">Name</span><span className="val">{confirmed.customerName}</span></div>
              <div className="bw-summary-row"><span className="lbl">Phone</span><span className="val">{confirmed.phone}</span></div>
              <div className="bw-summary-row"><span className="lbl">Status</span><span className="val" style={{ color: '#16a34a' }}>{confirmed.status}</span></div>
            </div>
            <button className="bw-cta" style={{ background: accent }} onClick={reset}>Book another</button>
          </div>
        )}
      </div>

      <div className="bw-powered">Powered by BookingBolt</div>
    </div>
  );
}

function sameDayLocal(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

// darken/lighten a hex color by percent
function shade(hex, percent) {
  const n = parseInt(hex.replace('#', ''), 16);
  let r = (n >> 16) + Math.round(2.55 * percent);
  let g = ((n >> 8) & 0xff) + Math.round(2.55 * percent);
  let b = (n & 0xff) + Math.round(2.55 * percent);
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}
