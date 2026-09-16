import React, { useState } from 'react';
import { Calculator, ShieldCheck } from 'lucide-react';
import { VEHICLE_MODELS } from '../data/services';

export default function CostCalculator({ onOpenEmergency, onOpenRoutine, lang }) {
  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLE_MODELS[0]);
  const [includeOilChange, setIncludeOilChange] = useState(true);
  const [includeBrakes, setIncludeBrakes] = useState(false);
  const [includeChainLube, setIncludeChainLube] = useState(true);
  const [includeAirFilter, setIncludeAirFilter] = useState(false);
  const [isNightEmergency, setIsNightEmergency] = useState(false);

  const baseLabour = isNightEmergency ? 349 : 299;
  const oilCost = includeOilChange ? selectedVehicle.oilCost : 0;
  const brakeCost = includeBrakes ? 180 : 0;
  const chainCost = includeChainLube ? 80 : 0;
  const filterCost = includeAirFilter ? 120 : 0;

  const totalEstimate = baseLabour + oilCost + brakeCost + chainCost + filterCost;
  const traditionalGarageApprox = Math.round(totalEstimate * 1.25);

  return (
    <section id="calculator" style={{ padding: '64px 0', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 36px' }}>
          <span className="badge-amber" style={{ marginBottom: '10px' }}>
            {lang === 'gu' ? '૧૦૦% પારદર્શક ભાવ' : 'Zero Hidden Charges'}
          </span>
          <h2 style={{ fontSize: 'clamp(26px, 3.8vw, 36px)', color: '#0f172a', marginBottom: '12px' }}>
            {lang === 'gu' ? 'જાણો તમારી ગાડીનો વાજબી સર્વિસ ખર્ચ' : 'Transparent Cost Calculator'}
          </h2>
          <p style={{ color: '#475569', fontSize: '15px' }}>
            {lang === 'gu'
              ? 'સ્થાનિક ગેરેજમાં અનિશ્ચિત બિલિંગથી બચો. અહીં તમારું વાહન અને જરૂરી કામ પસંદ કરો અને વાસ્તવિક MRP ભાવ મેળવો.'
              : 'Calculate your exact bill before booking. See labor, genuine OEM parts, and oil split cleanly with no surprises.'}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          maxWidth: '980px',
          margin: '0 auto'
        }}>
          {/* Controls Card */}
          <div className="clean-card" style={{ padding: '26px' }}>
            <h3 style={{ fontSize: '17px', color: '#0f172a', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calculator size={18} color="#d97706" />
              <span>Configure Your Vehicle & Work</span>
            </h3>

            {/* Vehicle Model */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                Select Vehicle:
              </label>
              <select
                value={selectedVehicle.id}
                onChange={(e) => {
                  const found = VEHICLE_MODELS.find(m => m.id === e.target.value);
                  if (found) setSelectedVehicle(found);
                }}
                style={{ width: '100%' }}
              >
                {VEHICLE_MODELS.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Checklist of services */}
            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '10px' }}>
                Select Required Work & Consumables:
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  border: includeOilChange ? '1.5px solid #d97706' : '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="checkbox"
                      checked={includeOilChange}
                      onChange={(e) => setIncludeOilChange(e.target.checked)}
                      style={{ accentColor: '#d97706', width: '16px', height: '16px' }}
                    />
                    <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: 600 }}>
                      Genuine Oil ({selectedVehicle.oilGrade})
                    </span>
                  </div>
                  <span style={{ fontSize: '13px', color: '#b45309', fontWeight: 700 }}>+₹{selectedVehicle.oilCost}</span>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  border: includeChainLube ? '1.5px solid #d97706' : '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="checkbox"
                      checked={includeChainLube}
                      onChange={(e) => setIncludeChainLube(e.target.checked)}
                      style={{ accentColor: '#d97706', width: '16px', height: '16px' }}
                    />
                    <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: 600 }}>
                      Chain Cleaning & High-Tack Lube
                    </span>
                  </div>
                  <span style={{ fontSize: '13px', color: '#b45309', fontWeight: 700 }}>+₹80</span>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  border: includeBrakes ? '1.5px solid #d97706' : '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="checkbox"
                      checked={includeBrakes}
                      onChange={(e) => setIncludeBrakes(e.target.checked)}
                      style={{ accentColor: '#d97706', width: '16px', height: '16px' }}
                    />
                    <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: 600 }}>
                      New OEM Brake Shoes (Front/Rear)
                    </span>
                  </div>
                  <span style={{ fontSize: '13px', color: '#b45309', fontWeight: 700 }}>+₹180</span>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  border: includeAirFilter ? '1.5px solid #d97706' : '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="checkbox"
                      checked={includeAirFilter}
                      onChange={(e) => setIncludeAirFilter(e.target.checked)}
                      style={{ accentColor: '#d97706', width: '16px', height: '16px' }}
                    />
                    <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: 600 }}>
                      Fresh OEM Air Filter Element
                    </span>
                  </div>
                  <span style={{ fontSize: '13px', color: '#b45309', fontWeight: 700 }}>+₹120</span>
                </label>
              </div>
            </div>

            {/* Night emergency surcharge toggle */}
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#991b1b' }}>
                  Night Emergency Breakdown? (9 PM - 1 AM)
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  Adds specialized night technician call-out retainer
                </div>
              </div>
              <input
                type="checkbox"
                checked={isNightEmergency}
                onChange={(e) => setIsNightEmergency(e.target.checked)}
                style={{ accentColor: '#dc2626', width: '18px', height: '18px' }}
              />
            </div>
          </div>

          {/* Quotation & Comparison Card */}
          <div className="clean-card" style={{ padding: '26px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <span className="badge-emerald">ITEMIZED QUOTATION</span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Bhavnagar District Rate</span>
              </div>

              {/* Itemized list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#475569' }}>
                    {isNightEmergency ? 'Night Emergency Call-Out & Labour' : 'Standard 18-Pt Service Labour'}
                  </span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>₹{baseLabour}</span>
                </div>

                {includeOilChange && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#475569' }}>Sealed Engine Oil ({selectedVehicle.oilGrade})</span>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>₹{oilCost}</span>
                  </div>
                )}

                {includeChainLube && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#475569' }}>Drive Chain Clean & Lube</span>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>₹{chainCost}</span>
                  </div>
                )}

                {includeBrakes && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#475569' }}>OEM Brake Shoes</span>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>₹{brakeCost}</span>
                  </div>
                )}

                {includeAirFilter && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#475569' }}>OEM Air Filter</span>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>₹{filterCost}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#475569' }}>Doorstep Travel Fee</span>
                  <span style={{ fontWeight: 700, color: '#059669' }}>FREE (₹0)</span>
                </div>
              </div>

              {/* Total Callout Box */}
              <div style={{
                backgroundColor: '#f8fafc',
                border: '1.5px solid #e2e8f0',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                marginBottom: '18px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                      MOTORESCUE ESTIMATE
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
                      ₹{totalEstimate}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', textDecoration: 'line-through' }}>
                      Local Garage: ~₹{traditionalGarageApprox}
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#059669', fontWeight: 700 }}>
                      Save ~₹{traditionalGarageApprox - totalEstimate} + 2 Hours
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div>
              {isNightEmergency ? (
                <button
                  onClick={onOpenEmergency}
                  className="btn-emergency"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Book Night Rescue (₹{totalEstimate})
                </button>
              ) : (
                <button
                  onClick={onOpenRoutine}
                  className="btn-routine"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Book Doorstep Service (₹{totalEstimate})
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
