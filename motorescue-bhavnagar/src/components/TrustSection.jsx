import React from 'react';
import { ShieldCheck, CheckCircle2, Star, Award, MapPin } from 'lucide-react';
import { BHAVNAGAR_LOCALITIES } from '../data/localities';

export default function TrustSection({ lang }) {
  const testimonials = [
    {
      name: 'Dr. Parth Dave',
      locality: 'Kaliyabid, Bhavnagar',
      vehicle: 'Honda Activa 6G',
      review: 'My scooter battery completely died at 10:45 PM near Waghawadi Road. Ramesh arrived with his portable lithium pack in 15 minutes. Pure lifesaver!',
      rating: 5
    },
    {
      name: 'Hardik Patel',
      locality: 'Chitra GIDC',
      vehicle: 'Hero Splendor Plus',
      review: 'Booked routine servicing at my factory in Chitra. Mechanic came with full toolkit, changed Castrol oil in front of me, tightened chain and adjusted brakes. Zero garage hassle.',
      rating: 5
    },
    {
      name: 'Nehalben Shah',
      locality: 'Sardarnagar',
      vehicle: 'TVS Jupiter 125',
      review: 'As a working professional, taking my scooter to a garage on weekends was frustrating. MotoRescue serviced it in our apartment parking. Very polite and professional!',
      rating: 5
    }
  ];

  return (
    <section style={{ padding: '64px 0', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
      <div className="container">
        {/* Anti-Counterfeit Guarantee Highlight */}
        <div className="clean-card" style={{
          padding: '32px',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: '#ffffff',
          border: '1.5px solid #bbf7d0',
          marginBottom: '50px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '28px',
            alignItems: 'center'
          }}>
            <div>
              <span className="badge-emerald" style={{ marginBottom: '12px' }}>
                GENUINE SPARES ASSURANCE
              </span>
              <h2 style={{ fontSize: 'clamp(22px, 3.2vw, 30px)', color: '#0f172a', marginBottom: '12px' }}>
                {lang === 'gu' ? 'નકલી ઓઇલ અને ડુપ્લિકેટ પાર્ટ્સથી મુક્તિ' : 'Zero Fake Oil. Zero Duplicate Spares.'}
              </h2>
              <p style={{ color: '#475569', fontSize: '14.5px', lineHeight: 1.6, marginBottom: '18px' }}>
                {lang === 'gu'
                  ? 'ભાવનગરમાં ઘણા અનઓફિશિયલ ગેરેજ રીસાઇકલ ઓઇલ કે ડુપ્લિકેટ બ્રેક શૂઝ વાપરે છે. અમે માત્ર બ્રાન્ડેડ સીલબંધ કેન (Castrol/Motul) તમારી આંખ સામે જ ઓપન કરીએ છીએ.'
                  : 'Counterfeit engine oil ruins thousands of two-wheelers across Saurashtra every year. With MotoRescue, our technician breaks the manufacturer seal right in front of your eyes.'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
                  <CheckCircle2 size={16} color="#059669" />
                  <span>Sealed 10W-30 / 20W-40 can with anti-counterfeit holographic seal</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
                  <CheckCircle2 size={16} color="#059669" />
                  <span>Official Amaron / Exide manufacturer battery warranties</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
                  <CheckCircle2 size={16} color="#059669" />
                  <span>30-day free post-service rework guarantee if any issue persists</span>
                </div>
              </div>
            </div>

            {/* Visual Trust Stamp Card */}
            <div style={{
              backgroundColor: '#f0fdf4',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              border: '1px solid #bbf7d0',
              textAlign: 'center'
            }}>
              <Award size={44} color="#059669" style={{ margin: '0 auto 10px' }} />
              <div style={{ fontSize: '17px', fontWeight: 800, color: '#065f46', marginBottom: '4px' }}>
                100% Genuine Seal
              </div>
              <p style={{ fontSize: '12.5px', color: '#166534', marginBottom: '16px' }}>
                Every spare part logged with serial number to your vehicle's digital registration log
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', fontSize: '12px', color: '#047857', fontWeight: 600 }}>
                <span>✓ Police Verified</span>
                <span>✓ Trained Technicians</span>
                <span>✓ Fixed Bhavnagar MRP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Testimonials Grid */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 32px' }}>
          <span className="badge-amber" style={{ marginBottom: '10px' }}>
            LOCAL BHAVNAGAR FEEDBACK
          </span>
          <h2 style={{ fontSize: 'clamp(24px, 3.2vw, 32px)', color: '#0f172a', marginBottom: '10px' }}>
            Trusted by 1,200+ Vehicle Owners in Bhavnagar
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '18px',
          marginBottom: '50px'
        }}>
          {testimonials.map((t, idx) => (
            <div key={idx} className="clean-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', gap: '3px', marginBottom: '10px' }}>
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={15} fill="#eab308" color="#eab308" />
                  ))}
                </div>
                <p style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.6, marginBottom: '14px' }}>
                  "{t.review}"
                </p>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>{t.name}</div>
                <div style={{ fontSize: '12px', color: '#b45309' }}>{t.vehicle} • {t.locality}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bhavnagar Local Coverage Strip */}
        <div className="clean-card" style={{
          padding: '22px',
          textAlign: 'center'
        }}>
          <h4 style={{ fontSize: '13px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px', fontWeight: 700 }}>
            CURRENT RAPID RESPONSE ZONES IN BHAVNAGAR
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
            {BHAVNAGAR_LOCALITIES.map((loc) => (
              <span
                key={loc.id}
                style={{
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  color: '#334155',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '12px',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <MapPin size={11} color="#d97706" />
                <span>{loc.name}</span>
                <span style={{ fontSize: '10.5px', color: '#64748b' }}>({loc.etaMins}m)</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
