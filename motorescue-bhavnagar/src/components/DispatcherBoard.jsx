import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, MapPin, DollarSign, TrendingUp, Users, X } from 'lucide-react';
import { MECHANICS, DISPATCHER_METRICS, INITIAL_DISPATCH_QUEUE } from '../data/mechanics';

export default function DispatcherBoard({ onClose, lang }) {
  const [mechanicsList, setMechanicsList] = useState(MECHANICS);
  const [dispatchQueue, setDispatchQueue] = useState(INITIAL_DISPATCH_QUEUE);
  const [metrics, setMetrics] = useState(DISPATCHER_METRICS);

  const handleToggleMechanicStatus = (id) => {
    setMechanicsList(prev => prev.map(m => {
      if (m.id === id) {
        const nextStatus = m.status === 'AVAILABLE' ? 'ON_JOB' : m.status === 'ON_JOB' ? 'STANDBY' : 'AVAILABLE';
        const color = nextStatus === 'AVAILABLE' ? '#059669' : nextStatus === 'ON_JOB' ? '#2563eb' : '#d97706';
        return { ...m, status: nextStatus, statusColor: color };
      }
      return m;
    }));
  };

  const handleCompleteJob = (jobId) => {
    setDispatchQueue(prev => prev.map(job => {
      if (job.id === jobId) {
        return { ...job, status: 'COMPLETED', eta: 'Closed & Invoiced' };
      }
      return job;
    }));

    setMetrics(prev => ({
      ...prev,
      todayJobsCount: prev.todayJobsCount + 1,
      todayGrossRevenue: prev.todayGrossRevenue + 349,
      todayGrossProfit: prev.todayGrossProfit + 140
    }));
  };

  return (
    <div style={{
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      padding: '30px 20px',
      borderTop: '3px solid #2563eb'
    }}>
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
          marginBottom: '26px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                backgroundColor: '#dbeafe',
                color: '#1d4ed8',
                padding: '3px 9px',
                borderRadius: '5px',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.4px'
              }}>
                FOUNDER OPS CONSOLE
              </span>
              <span style={{ fontSize: '13px', color: '#64748b' }}>
                Bhavnagar Hub Operations
              </span>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
              Dispatcher & Ops Command Center
            </h2>
          </div>

          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            <X size={15} />
            <span>Return to Customer View</span>
          </button>
        </div>

        {/* Live Metrics Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '14px',
          marginBottom: '28px'
        }}>
          <div className="clean-card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '11.5px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Today's Jobs</span>
              <CheckCircle size={17} color="#059669" />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
              {metrics.todayJobsCount}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              {metrics.emergencySosCount} Roadside • {metrics.doorstepServiceCount} Routine
            </div>
          </div>

          <div className="clean-card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '11.5px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Avg Response Time</span>
              <Clock size={17} color="#d97706" />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#b45309', fontFamily: 'var(--font-mono)' }}>
              {metrics.avgResponseTimeMins}m
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              Bhavnagar target: &lt; 20 mins
            </div>
          </div>

          <div className="clean-card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '11.5px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Gross Revenue</span>
              <DollarSign size={17} color="#2563eb" />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
              ₹{metrics.todayGrossRevenue.toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              Avg ticket: ₹{Math.round(metrics.todayGrossRevenue / metrics.todayJobsCount)}
            </div>
          </div>

          <div className="clean-card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '11.5px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Net Contribution</span>
              <TrendingUp size={17} color="#059669" />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#047857', fontFamily: 'var(--font-mono)' }}>
              ₹{metrics.todayGrossProfit.toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              ~38% gross contribution margin
            </div>
          </div>
        </div>

        {/* Two-Column Ops Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '20px',
          alignItems: 'start'
        }}>
          {/* Left Column: Live Dispatch Queue */}
          <div className="clean-card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={17} color="#dc2626" />
                <span>Live Breakdown Dispatch Queue</span>
              </h3>
              <span style={{ fontSize: '11.5px', color: '#64748b' }}>Real-time</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {dispatchQueue.map((job) => (
                <div key={job.id} style={{
                  backgroundColor: '#f8fafc',
                  border: job.status === 'DISPATCHED' ? '1.5px solid #fca5a5' : '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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
                      <span style={{ fontSize: '11.5px', color: '#64748b' }}>{job.time}</span>
                    </div>

                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: job.status === 'DISPATCHED' ? '#dc2626' : '#059669'
                    }}>
                      ● {job.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>
                    {job.customer} ({job.phone})
                  </div>
                  <div style={{ fontSize: '13px', color: '#b45309', fontWeight: 600 }}>
                    {job.vehicle} — {job.issue}
                  </div>
                  <div style={{ fontSize: '12px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
                    <MapPin size={12} />
                    <span>{job.locality}</span>
                  </div>

                  <div style={{
                    marginTop: '10px',
                    paddingTop: '8px',
                    borderTop: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                      Tech: <strong style={{ color: '#0f172a' }}>{job.assignedTo}</strong> ({job.eta})
                    </span>

                    {job.status === 'DISPATCHED' && (
                      <button
                        onClick={() => handleCompleteJob(job.id)}
                        style={{
                          backgroundColor: '#dcfce7',
                          border: '1px solid #86efac',
                          color: '#166534',
                          padding: '4px 10px',
                          borderRadius: '5px',
                          fontSize: '11.5px',
                          fontWeight: 700
                        }}
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Mechanics On Patrol */}
          <div className="clean-card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={17} color="#2563eb" />
                <span>Bhavnagar Mechanic Roster</span>
              </h3>
              <span style={{ fontSize: '11.5px', color: '#64748b' }}>Click status to toggle</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {mechanicsList.map((m) => (
                <div key={m.id} style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div>
                      <span style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a' }}>{m.name}</span>
                      <span style={{ fontSize: '11.5px', color: '#64748b', marginLeft: '6px' }}>({m.experience})</span>
                    </div>

                    <button
                      onClick={() => handleToggleMechanicStatus(m.id)}
                      style={{
                        backgroundColor: m.status === 'AVAILABLE' ? '#dcfce7' : m.status === 'ON_JOB' ? '#dbeafe' : '#fef3c7',
                        border: `1px solid ${m.statusColor}`,
                        color: m.status === 'AVAILABLE' ? '#166534' : m.status === 'ON_JOB' ? '#1e40af' : '#92400e',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '10.5px',
                        fontWeight: 800
                      }}
                    >
                      {m.status}
                    </button>
                  </div>

                  <div style={{ fontSize: '12px', color: '#475569' }}>
                    {m.role} • {m.sector}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                    📍 Stationed: {m.currentLocation}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#b45309', marginTop: '2px', fontWeight: 600 }}>
                    ★ {m.rating} Rating • {m.jobsCompleted} Rescues Logged
                  </div>
                </div>
              ))}
            </div>

            {/* Quality Checklist Inspector Preview */}
            <div style={{
              marginTop: '16px',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe'
            }}>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1e40af', marginBottom: '3px' }}>
                🛡️ Quality & Anti-Leakage Protocol
              </div>
              <p style={{ fontSize: '11.5px', color: '#3b82f6', lineHeight: 1.5, margin: 0 }}>
                Mechanics record a 5-second video opening the sealed oil can and an odometer photo before releasing the customer digital invoice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
