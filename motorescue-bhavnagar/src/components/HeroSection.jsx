import React from 'react';
import { Zap, Wrench, ShieldCheck, Clock, Star } from 'lucide-react';

export default function HeroSection({ onOpenEmergency, onOpenRoutine, lang }) {
  return (
    <section className="hero-texture" style={{
      position: 'relative',
      padding: '48px 0 56px',
      backgroundColor: '#f8fafc',
      borderBottom: '1px solid #e2e8f0',
      overflow: 'hidden'
    }}>
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '860px',
          margin: '0 auto'
        }}>
          {/* Top urgency pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#fee2e2',
            border: '1px solid #fecaca',
            padding: '5px 16px',
            borderRadius: 'var(--radius-full)',
            marginBottom: '18px'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#dc2626',
              animation: 'radar-pulse 1.8s infinite'
            }} />
            <span style={{ color: '#b91c1c', fontSize: '12.5px', fontWeight: 700, letterSpacing: '0.4px', textTransform: 'uppercase' }}>
              {lang === 'gu' ? 'ભાવનગર ૨૪/૭ રોડસાઇડ & હોમ સર્વિસ' : 'Bhavnagar Doorstep Service & 24/7 Roadside Assistance'}
            </span>
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 54px)',
            fontWeight: 800,
            letterSpacing: '-1px',
            lineHeight: 1.18,
            color: '#0f172a',
            marginBottom: '16px'
          }}>
            {lang === 'gu' ? (
              <>
                ગાડી બંધ પડી? ધક્કો ન મારો! <br />
                <span style={{ color: '#dc2626' }}>
                  ૧૫ મિનિટમાં મિકેનિક તમારી પાસે.
                </span>
              </>
            ) : (
              <>
                Don't Push Your Bike. Don't Search For Garages. <br />
                <span style={{ color: '#dc2626' }}>
                  Doorstep Service & Rapid Roadside Rescue.
                </span>
              </>
            )}
          </h1>

          <p style={{
            fontSize: 'clamp(15px, 2vw, 18px)',
            color: '#475569',
            maxWidth: '660px',
            margin: '0 auto 30px',
            fontWeight: 400,
            lineHeight: 1.6
          }}>
            {lang === 'gu'
              ? 'પંચર, બેટરી ડાઉન, ઓઇલ સર્વિસ કે રાત્રે ગાડી અટકી ગઈ હોય — અમારો વેરિફાઇડ મિકેનિક તમારા લોકેશન પર આવીને રીપેર કરી આપશે.'
              : 'Flat tyre, dead battery, routine 3,000 km oil service, or late-night breakdown—our verified Bhavnagar mechanics arrive at your exact doorstep or roadside location.'}
          </p>

          {/* High-Impact CTA Action Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '14px',
            marginBottom: '32px'
          }}>
            <button
              onClick={onOpenEmergency}
              id="hero-emergency-sos-btn"
              className="btn-emergency"
              style={{ padding: '15px 30px', fontSize: '16px' }}
            >
              <Zap size={20} color="#fff" />
              <span>{lang === 'gu' ? 'ઈમરજન્સી હેલ્પ (અત્યારે જ)' : 'Roadside Emergency SOS'}</span>
            </button>

            <button
              onClick={onOpenRoutine}
              id="hero-routine-book-btn"
              className="btn-routine"
              style={{ padding: '15px 30px', fontSize: '16px' }}
            >
              <Wrench size={19} color="#fff" />
              <span>{lang === 'gu' ? 'ઘરે બેઠા સર્વિસ બુક કરો' : 'Book Doorstep Service (₹299)'}</span>
            </button>
          </div>

          {/* Micro stats banner */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            fontSize: '13px',
            color: '#64748b'
          }}>
            <div className="stat-chip">
              <Clock size={15} color="#d97706" />
              <span><strong style={{ color: '#0f172a' }}>12–18 Mins</strong> Avg Arrival</span>
            </div>
            <div className="stat-chip">
              <ShieldCheck size={15} color="#059669" />
              <span><strong style={{ color: '#0f172a' }}>100% Genuine Sealed Oil</strong></span>
            </div>
            <div className="stat-chip">
              <Star size={15} color="#eab308" fill="#eab308" />
              <span><strong style={{ color: '#0f172a' }}>4.9★</strong> (1,200+ Jobs)</span>
            </div>
          </div>
        </div>

        {/* 3 Core Value Pillars Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginTop: '44px'
        }}>
          {/* Card 1 */}
          <div className="clean-card" style={{ padding: '24px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Zap size={22} color="#dc2626" />
            </div>
            <h3 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '8px' }}>
              {lang === 'gu' ? '૨૪/૭ અને રાત્રિ સહાય (૯ PM – ૧ AM)' : '24/7 & Night Emergency SOS'}
            </h3>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>
              {lang === 'gu'
                ? 'જ્યારે બધા ગેરેજ બંધ હોય ત્યારે નારી ચોકડી, ચિત્રા કે વાઘાવાડી રોડ પર ગાડી અટકે તો 1-કલિકમાં મિકેનિક મેળવો.'
                : 'When local shops shut down, get fast jumpstarts, tubeless puncture plugs, and starting assistance anywhere in Bhavnagar within 20 mins.'}
            </p>
            <div style={{ marginTop: '16px' }}>
              <span className="badge-emergency">Call-out from ₹149</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="clean-card" style={{ padding: '24px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Wrench size={22} color="#d97706" />
            </div>
            <h3 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '8px' }}>
              {lang === 'gu' ? 'ઘરે બેઠા ૧૮-પોઇન્ટ બાઇક સર્વિસ' : 'Doorstep Routine Bike Service'}
            </h3>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>
              {lang === 'gu'
                ? 'તમારી સામે સીલબંધ બ્રાન્ડેડ ઓઇલ (Castrol/Motul) બદલો, બ્રેક-ચેન ટ્યુનિંગ અને ૧૮ ચેકલિસ્ટ માત્ર ₹૨૯૯ લેબરમાં.'
                : 'No waiting at crowded workshops. Sealed branded oil opened in front of you, brake dust blowout, chain lubing, all at your home.'}
            </p>
            <div style={{ marginTop: '16px' }}>
              <span className="badge-amber">Standard Labour ₹299</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="clean-card" style={{ padding: '24px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: '#d1fae5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <ShieldCheck size={22} color="#059669" />
            </div>
            <h3 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '8px' }}>
              {lang === 'gu' ? 'ડિજિટલ બિલ & ૩૦ દિવસ વોરંટી' : 'Transparent Bill & 30-Day Warranty'}
            </h3>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>
              {lang === 'gu'
                ? 'કોઈ છુપો ચાર્જ નહિ. ગાડી નંબરથી ઓનલાઇન સર્વિસ હિસ્ટ્રી ચેક કરો અને ૩૦ દિવસની સર્વિસ ગેરંટી મેળવો.'
                : '100% itemized digital invoice on WhatsApp. Look up past repairs by number plate, with 30 days warranty on workmanship.'}
            </p>
            <div style={{ marginTop: '16px' }}>
              <span className="badge-emerald">100% Genuine Spares</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
