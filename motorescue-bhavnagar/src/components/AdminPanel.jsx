import React, { useState } from 'react';
import { LayoutDashboard, Users, AlertTriangle, CheckCircle, Clock, MapPin, DollarSign, TrendingUp, Phone, ShieldCheck, X, Settings, Wrench, Building2, Sliders, LogOut } from 'lucide-react';
import { MECHANICS, DISPATCHER_METRICS, INITIAL_DISPATCH_QUEUE } from '../data/mechanics';
import { PARTNER_GARAGES, WORKSHOP_REFERRED_JOBS } from '../data/garages';

export default function AdminPanel({ onSwitchPortal, currentUser, onLogout, lang }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [mechanicsList, setMechanicsList] = useState(MECHANICS);
  const [dispatchQueue, setDispatchQueue] = useState(INITIAL_DISPATCH_QUEUE);
  const [metrics, setMetrics] = useState(DISPATCHER_METRICS);

  const [daytimeFee, setDaytimeFee] = useState(149);
  const [nighttimeFee, setNighttimeFee] = useState(349);
  const [standardServiceFee, setStandardServiceFee] = useState(299);
  const [garageCommissionPct, setGarageCommissionPct] = useState(15);

  const handleToggleMechanic = (id) => {
    setMechanicsList(prev => prev.map(m => {
      if (m.id === id) {
        const nextStatus = m.status === 'AVAILABLE' ? 'ON_JOB' : m.status === 'ON_JOB' ? 'STANDBY' : 'AVAILABLE';
        const color = nextStatus === 'AVAILABLE' ? '#059669' : nextStatus === 'ON_JOB' ? '#2563eb' : '#d97706';
        return { ...m, status: nextStatus, statusColor: color };
      }
      return m;
    }));
  };

  const handleResolveJob = (id) => {
    setDispatchQueue(prev => prev.map(j => j.id === id ? { ...j, status: 'COMPLETED', eta: 'Closed' } : j));
    setMetrics(prev => ({
      ...prev,
      todayJobsCount: prev.todayJobsCount + 1,
      todayGrossRevenue: prev.todayGrossRevenue + 349,
      todayGrossProfit: prev.todayGrossProfit + 140
    }));
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '24px 0 60px' }}>
      <div className="container">
        {/* Top Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '18px',
          marginBottom: '24px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                backgroundColor: '#dbeafe',
                color: '#1d4ed8',
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.4px'
              }}>
                AUTHENTICATED AS SUPER ADMIN
              </span>
              <span style={{ fontSize: '13px', color: '#64748b' }}>
                {currentUser?.email || 'admin@motorescue.in'}
              </span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
              Platform Admin Dashboard
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => onSwitchPortal('garage')}
              className="btn-secondary"
              style={{ padding: '8px 14px', fontSize: '12.5px' }}
            >
              <Building2 size={14} color="#d97706" />
              <span>Garage Portal</span>
            </button>
            <button
              onClick={() => onSwitchPortal('customer')}
              className="btn-secondary"
              style={{ padding: '8px 14px', fontSize: '12.5px' }}
            >
              <span>Customer Website</span>
            </button>
            <button
              onClick={onLogout}
              className="btn-secondary"
              style={{ padding: '8px 14px', fontSize: '12.5px', color: '#dc2626', borderColor: '#fca5a5' }}
              title="Log out of Admin"
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '12px',
          marginBottom: '24px'
        }}>
          {[
            { id: 'overview', label: '📊 Overview & Analytics' },
            { id: 'dispatch', label: '🚨 Live Dispatch Queue' },
            { id: 'mechanics', label: '🛵 Mobile Mechanics Roster' },
            { id: 'garages', label: '🏢 Partner Garages Network' },
            { id: 'pricing', label: '⚙️ Pricing & Surge Settings' }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isActive ? '#0f172a' : '#ffffff',
                  color: isActive ? '#ffffff' : '#475569',
                  border: isActive ? '1px solid #0f172a' : '1px solid #e2e8f0',
                  fontSize: '13px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '14px',
              marginBottom: '24px'
            }}>
              <div className="clean-card" style={{ padding: '18px' }}>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                  Today's Completed Jobs
                </div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                  {metrics.todayJobsCount}
                </div>
                <div style={{ fontSize: '12px', color: '#059669', marginTop: '2px', fontWeight: 600 }}>
                  +2 from yesterday
                </div>
              </div>

              <div className="clean-card" style={{ padding: '18px' }}>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                  Today's Gross Billing
                </div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                  ₹{metrics.todayGrossRevenue.toLocaleString()}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Avg Ticket: ₹{Math.round(metrics.todayGrossRevenue / metrics.todayJobsCount)}
                </div>
              </div>

              <div className="clean-card" style={{ padding: '18px' }}>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                  Net Platform Margin
                </div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#059669', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                  ₹{metrics.todayGrossProfit.toLocaleString()}
                </div>
                <div style={{ fontSize: '12px', color: '#059669', marginTop: '2px', fontWeight: 600 }}>
                  ~37.6% Gross Margin
                </div>
              </div>

              <div className="clean-card" style={{ padding: '18px' }}>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                  Active Mechanics On-Duty
                </div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#2563eb', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                  3 Patrol Units
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Waghawadi • Chitra • Central
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              <div className="clean-card" style={{ padding: '22px' }}>
                <h3 style={{ fontSize: '16px', color: '#0f172a', marginBottom: '16px', fontWeight: 700 }}>
                  Revenue Breakdown by Channel (Today)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                    <span style={{ color: '#475569' }}>🚨 Roadside Emergency SOS Callouts (3 jobs)</span>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>₹1,047</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                    <span style={{ color: '#475569' }}>🛵 Doorstep Routine Servicing (5 jobs)</span>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>₹3,146</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                    <span style={{ color: '#475569' }}>🏢 Workshop Major Repairs Referral (15% fee)</span>
                    <span style={{ fontWeight: 700, color: '#059669' }}>₹697</span>
                  </div>
                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '14.5px', fontWeight: 800 }}>
                    <span>Total GMV Invoiced</span>
                    <span style={{ color: '#0f172a' }}>₹4,890</span>
                  </div>
                </div>
              </div>

              <div className="clean-card" style={{ padding: '22px' }}>
                <h3 style={{ fontSize: '16px', color: '#0f172a', marginBottom: '16px', fontWeight: 700 }}>
                  Target Bhavnagar Unit Economics Model
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Target Monthly Breakeven Volume:</span>
                    <strong style={{ color: '#0f172a' }}>105 Jobs / Month (3.5 jobs/day)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Estimated Customer Acquisition Cost (CAC):</span>
                    <strong style={{ color: '#059669' }}>₹45 (Guerrilla Stickers & Society Camps)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Mechanic Retainer + Job Incentive:</span>
                    <strong style={{ color: '#0f172a' }}>₹10,000 base + ₹75/job</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Sealed Oil Wholesale Margin:</span>
                    <strong style={{ color: '#b45309' }}>20% margin via Danapith distributor</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE DISPATCH QUEUE */}
        {activeTab === 'dispatch' && (
          <div className="clean-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '17px', color: '#0f172a', fontWeight: 700 }}>
                  Active Roadside & Doorstep Bookings
                </h3>
                <p style={{ fontSize: '12.5px', color: '#64748b' }}>
                  Manage live dispatch calls across all Bhavnagar wards
                </p>
              </div>
              <span className="badge-emergency">Real-Time Dispatching</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {dispatchQueue.map(job => (
                <div key={job.id} style={{
                  backgroundColor: '#ffffff',
                  border: job.status === 'DISPATCHED' ? '1.5px solid #fca5a5' : '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '14px'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: job.type === 'EMERGENCY' ? '#fee2e2' : '#fef3c7',
                        color: job.type === 'EMERGENCY' ? '#b91c1c' : '#92400e'
                      }}>
                        {job.id}
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>{job.time}</span>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: job.status === 'DISPATCHED' ? '#dc2626' : '#059669' }}>
                        ● {job.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                      {job.customer} ({job.phone})
                    </div>
                    <div style={{ fontSize: '13px', color: '#b45309', fontWeight: 600 }}>
                      {job.vehicle} — {job.issue}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <MapPin size={12} color="#dc2626" />
                      <span>{job.locality}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', color: '#475569', marginBottom: '8px' }}>
                      Assigned: <strong style={{ color: '#0f172a' }}>{job.assignedTo}</strong> ({job.eta})
                    </div>
                    {job.status === 'DISPATCHED' ? (
                      <button
                        onClick={() => handleResolveJob(job.id)}
                        style={{
                          backgroundColor: '#dcfce7',
                          border: '1px solid #86efac',
                          color: '#166534',
                          padding: '6px 14px',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '12px',
                          fontWeight: 700
                        }}
                      >
                        Confirm Job Resolved & Invoiced
                      </button>
                    ) : (
                      <span className="badge-emerald">✓ Completed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MECHANICS ROSTER */}
        {activeTab === 'mechanics' && (
          <div className="clean-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '17px', color: '#0f172a', fontWeight: 700 }}>
                  Mobile Patrol Technicians Roster
                </h3>
                <p style={{ fontSize: '12.5px', color: '#64748b' }}>
                  Click status pill to toggle availability (Available / On Job / Standby)
                </p>
              </div>
              <span className="badge-emerald">3 Active Technicians</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {mechanicsList.map(m => (
                <div key={m.id} style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-md)',
                  padding: '18px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div>
                      <span style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{m.name}</span>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{m.role} • {m.experience}</div>
                    </div>

                    <button
                      onClick={() => handleToggleMechanic(m.id)}
                      style={{
                        backgroundColor: m.status === 'AVAILABLE' ? '#dcfce7' : m.status === 'ON_JOB' ? '#dbeafe' : '#fef3c7',
                        border: `1px solid ${m.statusColor}`,
                        color: m.status === 'AVAILABLE' ? '#166534' : m.status === 'ON_JOB' ? '#1e40af' : '#92400e',
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '11px',
                        fontWeight: 800
                      }}
                    >
                      {m.status}
                    </button>
                  </div>

                  <div style={{ fontSize: '12.5px', color: '#334155', marginTop: '8px' }}>
                    📍 Stationed: <strong>{m.currentLocation}</strong>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                    Coverage: {m.sector}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                    Vehicle: {m.bike}
                  </div>

                  <div style={{
                    marginTop: '12px',
                    paddingTop: '10px',
                    borderTop: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px'
                  }}>
                    <span style={{ color: '#b45309', fontWeight: 600 }}>★ {m.rating} Rating ({m.jobsCompleted} jobs)</span>
                    <a href={`tel:${m.phone}`} style={{ color: '#2563eb', fontWeight: 600 }}>{m.phone}</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PARTNER GARAGES NETWORK */}
        {activeTab === 'garages' && (
          <div className="clean-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '17px', color: '#0f172a', fontWeight: 700 }}>
                  Approved Workshop & Garage Partners (Bhavnagar)
                </h3>
                <p style={{ fontSize: '12.5px', color: '#64748b' }}>
                  Partners handling heavy overhaul, lathe, and chassis straightening jobs
                </p>
              </div>
              <button
                onClick={() => onSwitchPortal('garage')}
                className="btn-routine"
                style={{ padding: '6px 14px', fontSize: '12px' }}
              >
                Open Garage Portal
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginBottom: '28px' }}>
              {PARTNER_GARAGES.map(g => (
                <div key={g.id} style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-md)',
                  padding: '18px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <h4 style={{ fontSize: '15.5px', color: '#0f172a', fontWeight: 700 }}>{g.name}</h4>
                    <span className="badge-emerald">{g.commissionRate}</span>
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#64748b' }}>Owner: {g.owner} • {g.phone}</div>
                  <div style={{ fontSize: '12px', color: '#334155', marginTop: '4px' }}>
                    📍 {g.locality}
                  </div>
                  <div style={{ fontSize: '12px', color: '#b45309', marginTop: '4px' }}>
                    Specialty: {g.specialty}
                  </div>

                  <div style={{
                    marginTop: '12px',
                    paddingTop: '10px',
                    borderTop: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px'
                  }}>
                    <span style={{ color: '#475569' }}>
                      Bays: <strong>{g.occupiedBays}/{g.activeBays} Busy</strong>
                    </span>
                    <span style={{ color: '#059669', fontWeight: 700 }}>
                      {g.totalCompletedJobs} Referred Jobs
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <h4 style={{ fontSize: '15px', color: '#0f172a', fontWeight: 700, marginBottom: '12px' }}>
              Active Workshop Referral Tickets
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {WORKSHOP_REFERRED_JOBS.map(job => (
                <div key={job.id} style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ color: '#0f172a' }}>{job.id}</strong>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>({job.vehicle} • {job.regNo})</span>
                      <span className="badge-amber">{job.status}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                      {job.issueDescription}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                      Garage: <strong>{job.assignedGarage}</strong> ({job.bayNumber})
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', fontSize: '13px' }}>
                    <div>Total Est: <strong>₹{job.totalBill}</strong></div>
                    <div style={{ fontSize: '11.5px', color: '#059669', fontWeight: 600 }}>
                      Platform Share (15%): ₹{job.platformFee}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PRICING & SURGE SETTINGS */}
        {activeTab === 'pricing' && (
          <div className="clean-card" style={{ padding: '26px', maxWidth: '720px' }}>
            <h3 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '8px', fontWeight: 700 }}>
              Dynamic Pricing & Surcharge Controls
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '22px' }}>
              Configure base fees, night emergency multipliers, and garage commission shares
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Daytime Roadside Emergency Visit Fee: ₹{daytimeFee}
                </label>
                <input
                  type="range"
                  min="99"
                  max="299"
                  step="10"
                  value={daytimeFee}
                  onChange={(e) => setDaytimeFee(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#dc2626' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
                  <span>₹99 (Promo)</span>
                  <span>Current: ₹{daytimeFee}</span>
                  <span>₹299 (Peak)</span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Night Emergency Breakdown Visit Fee (9 PM - 1 AM): ₹{nighttimeFee}
                </label>
                <input
                  type="range"
                  min="249"
                  max="499"
                  step="10"
                  value={nighttimeFee}
                  onChange={(e) => setNighttimeFee(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#dc2626' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Doorstep Routine Bike Service Base Labour: ₹{standardServiceFee}
                </label>
                <input
                  type="range"
                  min="199"
                  max="399"
                  step="10"
                  value={standardServiceFee}
                  onChange={(e) => setStandardServiceFee(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#d97706' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Partner Garage Heavy Repair Commission: {garageCommissionPct}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="25"
                  step="1"
                  value={garageCommissionPct}
                  onChange={(e) => setGarageCommissionPct(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#059669' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
