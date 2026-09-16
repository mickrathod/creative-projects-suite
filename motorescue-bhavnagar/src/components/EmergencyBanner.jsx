import React from 'react';
import { Clock, MapPin } from 'lucide-react';

export default function EmergencyBanner({ lang }) {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const hours = currentTime.getHours();
  const isNight = hours >= 21 || hours < 2;

  return (
    <div style={{
      backgroundColor: isNight ? '#fff5f5' : '#f8fafc',
      borderBottom: '1px solid #e2e8f0',
      padding: '7px 0',
      fontSize: '12.5px'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '6px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isNight ? '#dc2626' : '#16a34a',
            display: 'inline-block',
            flexShrink: 0,
            animation: 'radar-pulse 1.8s infinite'
          }} />
          <span style={{ fontWeight: 700, color: isNight ? '#991b1b' : '#15803d', whiteSpace: 'nowrap' }}>
            {isNight ? '🌙 Night Shift Active (9 PM–1 AM)' : '☀️ Daytime Mechanics On-Duty'}
          </span>
          <span className="banner-sep" style={{ color: '#94a3b8' }}>•</span>
          <span className="banner-detail" style={{ color: '#475569' }}>
            {lang === 'gu'
              ? 'ભાવનગર શહેર & બાયપાસ: ૧૨-૧૮ મિનિટમાં પહોંચ'
              : 'Avg 12–18 min arrival across Bhavnagar & Bypass roads'}
          </span>
        </div>

        <div className="banner-zones" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '12px' }}>
          <MapPin size={12} color="#dc2626" />
          <span>Kaliyabid • Waghawadi • Chitra • Nari Chokdi • Ghogha Circle</span>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .banner-detail, .banner-sep { display: none; }
          }
          @media (max-width: 640px) {
            .banner-zones { display: none; }
          }
        `}</style>
      </div>
    </div>
  );
}
