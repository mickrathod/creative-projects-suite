import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, X, Phone, Mail, StickyNote } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useToast } from './common/Toast';
import { minutesToLabel } from '../utils/slots';

const HOURS = Array.from({ length: 13 }, (_, i) => 7 + i); // 7am..7pm

export function BookingsCalendar() {
  const { appointments, setStatus, deleteAppointment } = useBooking();
  const { addToast } = useToast();
  const [weekOffset, setWeekOffset] = useState(0);
  const [selected, setSelected] = useState(null);

  const weekStart = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay() + weekOffset * 7);
    return d;
  }, [weekOffset]);

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  }), [weekStart]);

  const today = new Date();

  const apptsByCell = useMemo(() => {
    const map = {};
    appointments.forEach(a => {
      const s = new Date(a.start);
      const key = `${s.getFullYear()}-${s.getMonth()}-${s.getDate()}-${s.getHours()}`;
      (map[key] = map[key] || []).push(a);
    });
    return map;
  }, [appointments]);

  const rangeLabel = `${weekStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${days[6].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;

  return (
    <div>
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Bookings Calendar</h2>
          <p className="panel-desc">Every appointment captured by your widget, live. Click one to confirm, complete, or cancel.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={() => setWeekOffset(w => w - 1)}><ChevronLeft size={15} /></button>
          <button className="btn btn-secondary" onClick={() => setWeekOffset(0)} style={{ minWidth: 130 }}>{rangeLabel}</button>
          <button className="btn btn-secondary" onClick={() => setWeekOffset(w => w + 1)}><ChevronRight size={15} /></button>
        </div>
      </div>

      <div className="cal-wrap">
        <div className="cal-head">
          <div className="cal-head-cell" />
          {days.map((d, i) => {
            const isToday = d.toDateString() === today.toDateString();
            return (
              <div key={i} className={`cal-head-cell ${isToday ? 'today' : ''}`}>
                {d.toLocaleDateString(undefined, { weekday: 'short' })}
                <span className="daynum">{d.getDate()}</span>
              </div>
            );
          })}
        </div>
        <div className="cal-grid">
          {HOURS.map(h => (
            <React.Fragment key={h}>
              <div className="cal-hour-label">{minutesToLabel(h * 60)}</div>
              {days.map((d, di) => {
                const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${h}`;
                const cell = apptsByCell[key] || [];
                return (
                  <div key={di} className="cal-cell">
                    {cell.map(a => (
                      <div
                        key={a.id}
                        className={`cal-appt ${a.status.toLowerCase()}`}
                        onClick={() => setSelected(a)}
                      >
                        <div className="cal-appt-name">{new Date(a.start).getMinutes() === 0 ? '' : minutesToLabel(new Date(a.start).getHours() * 60 + new Date(a.start).getMinutes()) + ' · '}{a.customerName}</div>
                        <div className="cal-appt-svc">{a.serviceName}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginTop: '14px', fontSize: '12px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
        <Legend color="var(--accent-emerald)" label="Confirmed" />
        <Legend color="var(--accent-amber)" label="Pending" />
        <Legend color="var(--primary-blue)" label="Completed" />
        <Legend color="var(--accent-rose)" label="Cancelled" />
      </div>

      {selected && (
        <ApptModal
          appt={selected}
          onClose={() => setSelected(null)}
          onStatus={(st) => { setStatus(selected.id, st); addToast(`Booking marked ${st}`, 'success'); setSelected(null); }}
          onDelete={() => { deleteAppointment(selected.id); addToast('Booking deleted', 'info'); setSelected(null); }}
        />
      )}
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 10, height: 10, borderRadius: 3, background: color, display: 'inline-block' }} />{label}
    </span>
  );
}

function ApptModal({ appt, onClose, onStatus, onDelete }) {
  const s = new Date(appt.start);
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }} onClick={onClose}>
      <div style={{
        background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)',
        padding: 28, maxWidth: 440, width: '100%', boxShadow: 'var(--shadow-lg)'
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{appt.customerName}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{appt.serviceName} · {appt.duration} min</div>
          </div>
          <button className="btn btn-secondary" style={{ padding: 6 }} onClick={onClose}><X size={15} /></button>
        </div>

        <div style={{ background: '#090d16', border: '1px solid var(--card-border)', borderRadius: 12, padding: 14, marginBottom: 16, fontSize: 13 }}>
          <Row label="When" value={s.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }) + ', ' + minutesToLabel(s.getHours() * 60 + s.getMinutes())} />
          <Row label="Price" value={appt.price > 0 ? `$${appt.price}` : 'Free'} />
          <Row label="Deposit paid" value={appt.deposit > 0 ? `$${appt.deposit}` : '—'} />
          <Row label="Status" value={appt.status} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, marginBottom: 18 }}>
          <span style={{ display: 'flex', gap: 8, alignItems: 'center', color: '#cbd5e1' }}><Phone size={14} /> {appt.phone}</span>
          {appt.email && <span style={{ display: 'flex', gap: 8, alignItems: 'center', color: '#cbd5e1' }}><Mail size={14} /> {appt.email}</span>}
          {appt.notes && <span style={{ display: 'flex', gap: 8, alignItems: 'flex-start', color: '#cbd5e1' }}><StickyNote size={14} style={{ marginTop: 2 }} /> {appt.notes}</span>}
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn btn-emerald" onClick={() => onStatus('Confirmed')}>Confirm</button>
          <button className="btn btn-primary" onClick={() => onStatus('Completed')}>Completed</button>
          <button className="btn btn-danger" onClick={() => onStatus('Cancelled')}>Cancel</button>
          <button className="btn btn-secondary" style={{ marginLeft: 'auto' }} onClick={onDelete}>Delete</button>
        </div>

        <a
          className="btn btn-secondary"
          style={{ width: '100%', marginTop: 12 }}
          href={`https://wa.me/${(appt.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${appt.customerName}, confirming your ${appt.serviceName} on ${s.toLocaleDateString()} at ${minutesToLabel(s.getHours() * 60 + s.getMinutes())}. See you then!`)}`}
          target="_blank"
          rel="noreferrer"
        >
          💬 Message customer on WhatsApp
        </a>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontWeight: 700 }}>{value}</span>
    </div>
  );
}
