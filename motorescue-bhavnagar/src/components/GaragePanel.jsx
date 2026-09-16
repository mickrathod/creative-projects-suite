import React, { useState } from 'react';
import { Building2, Wrench, CheckCircle2, Clock, AlertCircle, Phone, ArrowRight, DollarSign, ChevronRight, X, LogOut, User } from 'lucide-react';
import { PARTNER_GARAGES, WORKSHOP_REFERRED_JOBS } from '../data/garages';

export default function GaragePanel({ onSwitchPortal, currentGarageUser, onLogout, lang }) {
  const defaultGarageId = currentGarageUser?.garageId || 'garage-1';
  const [selectedGarageId, setSelectedGarageId] = useState(defaultGarageId);
  const [jobsList, setJobsList] = useState(WORKSHOP_REFERRED_JOBS);

  const activeGarage = PARTNER_GARAGES.find(g => g.id === selectedGarageId) || PARTNER_GARAGES[0];
  const garageJobs = jobsList.filter(j => j.garageId === selectedGarageId);

  const handleAdvanceStatus = (jobId) => {
    setJobsList(prev => prev.map(job => {
      if (job.id === jobId) {
        let nextStatus = job.status;
        if (job.status === 'ESTIMATE_PENDING') nextStatus = 'APPROVED';
        else if (job.status === 'APPROVED') nextStatus = 'IN_REPAIR';
        else if (job.status === 'IN_REPAIR') nextStatus = 'READY';
        else if (job.status === 'READY') nextStatus = 'DELIVERED';
        return { ...job, status: nextStatus };
      }
      return job;
    }));
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '24px 0 60px' }}>
      <div className="container">
        {/* Header & Portal Switcher */}
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
                backgroundColor: '#fef3c7',
                color: '#92400e',
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.4px'
              }}>
                LOGGED IN AS GARAGE PARTNER
              </span>
              <span style={{ fontSize: '13px', color: '#64748b' }}>
                {currentGarageUser?.name ? `${currentGarageUser.name} (${currentGarageUser.phone})` : activeGarage.owner}
              </span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
              {activeGarage.name}
            </h1>
            <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>
              📍 {activeGarage.locality} • Workshop Manager: {activeGarage.owner} ({activeGarage.phone})
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Garage Switcher Dropdown */}
            <select
              value={selectedGarageId}
              onChange={(e) => setSelectedGarageId(e.target.value)}
              style={{ padding: '8px 12px', fontSize: '13px', fontWeight: 600 }}
            >
              {PARTNER_GARAGES.map(g => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.locality.split(' ')[0]})
                </option>
              ))}
            </select>

            <button
              onClick={() => onSwitchPortal('customer')}
              className="btn-secondary"
              style={{ padding: '8px 14px', fontSize: '12.5px' }}
            >
              <span>Customer View</span>
            </button>

            <button
              onClick={onLogout}
              className="btn-secondary"
              style={{ padding: '8px 14px', fontSize: '12.5px', color: '#dc2626', borderColor: '#fca5a5' }}
              title="Log out of Garage Portal"
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Workshop Overview Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
          marginBottom: '26px'
        }}>
          <div className="clean-card" style={{ padding: '18px' }}>
            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
              Workshop Service Bays
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
              {activeGarage.occupiedBays} / {activeGarage.activeBays} <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>Occupied</span>
            </div>
            <div style={{ fontSize: '12px', color: '#059669', marginTop: '2px', fontWeight: 600 }}>
              {activeGarage.activeBays - activeGarage.occupiedBays} Bays Available
            </div>
          </div>

          <div className="clean-card" style={{ padding: '18px' }}>
            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
              Referred Active Jobs
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#b45309', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
              {garageJobs.length} Tickets
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              From Mobile Patrol referrals
            </div>
          </div>

          <div className="clean-card" style={{ padding: '18px' }}>
            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
              Platform Commission Rate
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#2563eb', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
              15%
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              MotoRescue keeps 15% of gross bill
            </div>
          </div>

          <div className="clean-card" style={{ padding: '18px' }}>
            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
              Total Completed Jobs
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#059669', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
              {activeGarage.totalCompletedJobs}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              ★ {activeGarage.rating} Workshop Rating
            </div>
          </div>
        </div>

        {/* Referred Heavy Jobs Queue */}
        <div className="clean-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '17px', color: '#0f172a', fontWeight: 700 }}>
                Referred Breakdown Repair Tickets (Heavy Workshop Jobs)
              </h3>
              <p style={{ fontSize: '12.5px', color: '#64748b' }}>
                Vehicles towed from roadside requiring workshop bays & specialized tools
              </p>
            </div>
            <span className="badge-emerald">{garageJobs.length} Active in Workshop</span>
          </div>

          {garageJobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
              No active referred repair jobs in this workshop. Check back when patrol mechanics dispatch towed vehicles.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {garageJobs.map(job => (
                <div key={job.id} style={{
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: 'var(--radius-md)',
                  padding: '18px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    borderBottom: '1px solid #f1f5f9',
                    paddingBottom: '12px',
                    marginBottom: '12px'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
                          {job.id}
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#334155' }}>
                          {job.vehicle} ({job.regNo})
                        </span>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor:
                            job.status === 'READY' ? '#dcfce7' :
                            job.status === 'IN_REPAIR' ? '#dbeafe' :
                            job.status === 'DELIVERED' ? '#f1f5f9' : '#fef3c7',
                          color:
                            job.status === 'READY' ? '#166534' :
                            job.status === 'IN_REPAIR' ? '#1e40af' :
                            job.status === 'DELIVERED' ? '#64748b' : '#92400e'
                        }}>
                          {job.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                        Customer: <strong>{job.customerName}</strong> ({job.customerPhone}) • Referred by {job.referredByMechanic}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Assigned Service Bay</div>
                      <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#b45309' }}>{job.bayNumber}</div>
                    </div>
                  </div>

                  {/* Problem Description */}
                  <div style={{ backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '6px', fontSize: '12.5px', color: '#334155', marginBottom: '14px' }}>
                    <strong>Mechanic Triage Note:</strong> {job.issueDescription}
                  </div>

                  {/* Bill Split & Status Action */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', gap: '20px', fontSize: '13px' }}>
                      <div>
                        <span style={{ color: '#64748b' }}>Parts Est: </span>
                        <strong style={{ color: '#0f172a' }}>₹{job.partsEstimate}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b' }}>Labour Est: </span>
                        <strong style={{ color: '#0f172a' }}>₹{job.labourEstimate}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b' }}>Platform Fee (15%): </span>
                        <strong style={{ color: '#dc2626' }}>-₹{job.platformFee}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b' }}>Garage Net Payout: </span>
                        <strong style={{ color: '#059669', fontSize: '14px' }}>₹{job.garagePayout}</strong>
                      </div>
                    </div>

                    {job.status !== 'DELIVERED' && (
                      <button
                        onClick={() => handleAdvanceStatus(job.id)}
                        className="btn-routine"
                        style={{ padding: '7px 16px', fontSize: '12.5px' }}
                      >
                        <span>
                          {job.status === 'ESTIMATE_PENDING' && 'Send Quote to Customer'}
                          {job.status === 'APPROVED' && 'Start Bay Repair'}
                          {job.status === 'IN_REPAIR' && 'Mark Ready for Pickup'}
                          {job.status === 'READY' && 'Mark Delivered & Paid'}
                        </span>
                        <ArrowRight size={13} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
