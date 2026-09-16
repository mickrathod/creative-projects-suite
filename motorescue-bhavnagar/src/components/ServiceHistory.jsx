import React, { useState } from 'react';
import { Search, CheckCircle2, AlertTriangle } from 'lucide-react';
import { SAMPLE_VEHICLES } from '../data/sampleVehicles';

export default function ServiceHistory({ onOpenRoutine, lang }) {
  const [searchInput, setSearchInput] = useState('GJ-04-AB-1234');
  const [activeVehicle, setActiveVehicle] = useState(SAMPLE_VEHICLES['GJ-04-AB-1234']);
  const [hasSearched, setHasSearched] = useState(true);

  const handleSearch = (e) => {
    e?.preventDefault();
    const formatted = searchInput.trim().toUpperCase();
    const found = SAMPLE_VEHICLES[formatted];
    setActiveVehicle(found || null);
    setHasSearched(true);
  };

  const loadSample = (reg) => {
    setSearchInput(reg);
    setActiveVehicle(SAMPLE_VEHICLES[reg]);
    setHasSearched(true);
  };

  return (
    <section id="history" style={{ padding: '64px 0', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 36px' }}>
          <span className="badge-emerald" style={{ marginBottom: '10px' }}>
            {lang === 'gu' ? 'ડિજિટલ સર્વિસ લોગ' : 'Digital Vehicle Health Log'}
          </span>
          <h2 style={{ fontSize: 'clamp(26px, 3.8vw, 36px)', color: '#0f172a', marginBottom: '12px' }}>
            {lang === 'gu' ? 'તમારી ગાડીની સર્વિસ હિસ્ટ્રી અને વોરંટી ચેક કરો' : 'Check Service History & Active Warranty'}
          </h2>
          <p style={{ color: '#475569', fontSize: '15px' }}>
            {lang === 'gu'
              ? 'તમારો ગાડી નંબર નાખીને ભૂતકાળના રીપેર, ઓઇલ ચેન્જ અને ૩૦ દિવસની સર્વિસ વોરંટી ડિજિટલ રીતે ચકાસો.'
              : 'Enter your Bhavnagar registration number to view verified inspection checklists, parts fitted, and active warranty status.'}
          </p>
        </div>

        {/* Search Bar & Sample Chips */}
        <div style={{ maxWidth: '620px', margin: '0 auto 32px' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Enter Reg No (e.g. GJ-04-AB-1234)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{ width: '100%', paddingLeft: '40px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '15px' }}
              />
            </div>
            <button
              type="submit"
              className="btn-routine"
              style={{ padding: '12px 22px', flexShrink: 0 }}
            >
              Search Log
            </button>
          </form>

          {/* Sample quick chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '12px', color: '#64748b' }}>
            <span>Try sample Bhavnagar records:</span>
            {['GJ-04-AB-1234', 'GJ-04-DE-5678', 'GJ-04-KL-9012'].map(sample => (
              <button
                key={sample}
                type="button"
                onClick={() => loadSample(sample)}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  color: '#334155',
                  padding: '2px 8px',
                  borderRadius: '5px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 600
                }}
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Results display */}
        {hasSearched && (
          activeVehicle ? (
            <div className="clean-card" style={{ maxWidth: '860px', margin: '0 auto', padding: '28px' }}>
              {/* Vehicle Header Card */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '18px',
                marginBottom: '20px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      fontSize: '22px',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                      color: '#0f172a',
                      letterSpacing: '0.5px'
                    }}>
                      {activeVehicle.regNo}
                    </span>
                    <span className="badge-emerald">VERIFIED VEHICLE</span>
                  </div>
                  <div style={{ fontSize: '15px', color: '#334155', fontWeight: 600, marginTop: '3px' }}>
                    {activeVehicle.model} • Owner: {activeVehicle.owner}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {activeVehicle.locality}
                  </div>
                </div>

                {/* Warranty Badge */}
                <div style={{
                  backgroundColor: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 16px',
                  textAlign: 'right'
                }}>
                  <div style={{ fontSize: '10.5px', textTransform: 'uppercase', color: '#047857', fontWeight: 800 }}>
                    SERVICE WARRANTY
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#065f46', marginTop: '1px' }}>
                    Active ({activeVehicle.warrantyDaysLeft} Days Left)
                  </div>
                  <div style={{ fontSize: '11px', color: '#059669' }}>
                    Valid across Bhavnagar
                  </div>
                </div>
              </div>

              {/* Maintenance Metrics Row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                gap: '12px',
                marginBottom: '24px'
              }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11.5px', color: '#64748b' }}>Last Serviced</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                    {activeVehicle.lastServiceDate}
                  </div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11.5px', color: '#64748b' }}>Odometer Logged</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                    {activeVehicle.odometerKm.toLocaleString()} KM
                  </div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11.5px', color: '#64748b' }}>Next Service Due</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#b45309', marginTop: '2px' }}>
                    {activeVehicle.nextDueKm.toLocaleString()} KM
                  </div>
                </div>
              </div>

              {/* Timeline of Records */}
              <h3 style={{ fontSize: '16px', color: '#0f172a', marginBottom: '14px' }}>Service & Rescue History</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {activeVehicle.records.map((rec) => (
                  <div key={rec.id} style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div>
                        <span style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a' }}>{rec.package}</span>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                          {rec.date} • Assigned Tech: <strong style={{ color: '#0f172a' }}>{rec.mechanic}</strong>
                        </div>
                      </div>
                      <span style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
                        ₹{rec.totalBill}
                      </span>
                    </div>

                    {/* Inspection details */}
                    <div style={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      padding: '10px 14px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: '#475569',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                      gap: '6px'
                    }}>
                      {Object.entries(rec.inspections).map(([key, val]) => (
                        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCircle2 size={13} color="#059669" />
                          <span><strong style={{ textTransform: 'capitalize', color: '#1e293b' }}>{key.replace(/([A-Z])/g, ' $1')}:</strong> {val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="clean-card" style={{ maxWidth: '580px', margin: '0 auto', padding: '32px', textAlign: 'center' }}>
              <AlertTriangle size={32} color="#d97706" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '6px' }}>Vehicle Not Yet Registered</h3>
              <p style={{ fontSize: '13.5px', color: '#64748b', marginBottom: '18px' }}>
                Vehicle <strong>{searchInput}</strong> doesn't have digital records in MotoRescue Bhavnagar database yet. Book a doorstep routine service to start logging your maintenance.
              </p>
              <button
                onClick={onOpenRoutine}
                className="btn-routine"
                style={{ margin: '0 auto' }}
              >
                Register & Book First Service (₹299)
              </button>
            </div>
          )
        )}
      </div>
    </section>
  );
}
