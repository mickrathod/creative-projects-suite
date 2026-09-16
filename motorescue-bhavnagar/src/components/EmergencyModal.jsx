import React, { useState } from 'react';
import { X, Zap, Phone, Clock, BatteryCharging, Disc, Wrench, Fuel, Truck } from 'lucide-react';
import { BHAVNAGAR_LOCALITIES, EMERGENCY_HOTLINE, BHAVNAGAR_CENTER } from '../data/localities';
import { EMERGENCY_SERVICES, VEHICLE_MODELS } from '../data/services';
import { createEmergencyWhatsAppLink } from '../utils/whatsappHelper';
import LiveLocationPicker from './LiveLocationPicker';

export default function EmergencyModal({ isOpen, onClose, onDispatchSuccess, lang }) {
  if (!isOpen) return null;

  const [locationData, setLocationData] = useState({
    lat: BHAVNAGAR_CENTER.lat,
    lng: BHAVNAGAR_CENTER.lng,
    locality: BHAVNAGAR_LOCALITIES[0],
    customLandmark: 'Waghawadi Road, Bhavnagar',
    googleMapsLink: `https://maps.google.com/?q=${BHAVNAGAR_CENTER.lat},${BHAVNAGAR_CENTER.lng}`,
    etaMins: '7',
    roadDistanceKm: 1.9,
    mechanic: null,
    routeCoords: []
  });

  const [selectedIssue, setSelectedIssue] = useState(EMERGENCY_SERVICES[0]);
  const [vehicleModel, setVehicleModel] = useState('Honda Activa (3G/4G/5G/6G)');
  const [customVehicle, setCustomVehicle] = useState('');

  const currentHour = new Date().getHours();
  const isNight = currentHour >= 21 || currentHour < 2;
  const visitFee = isNight ? selectedIssue.nightFee : selectedIssue.dayFee;

  const handleLocationUpdate = (loc) => {
    setLocationData(prev => ({ ...prev, ...loc }));
  };

  const handleTriggerDispatch = () => {
    const bookingId = 'SOS-' + Math.floor(1000 + Math.random() * 9000);
    const chosenVehicle = vehicleModel === 'Other' ? customVehicle : vehicleModel;

    const waLink = createEmergencyWhatsAppLink({
      locality: locationData.locality,
      customLandmark: locationData.customLandmark,
      vehicleModel: chosenVehicle,
      issueName: selectedIssue.name,
      isNightTime: isNight,
      bookingId,
      lat: locationData.lat,
      lng: locationData.lng,
      roadDistanceKm: locationData.roadDistanceKm,
      etaMins: locationData.etaMins,
      mechanicName: locationData.mechanic?.name
    });

    window.open(waLink, '_blank');

    onDispatchSuccess({
      bookingId,
      locality: locationData.locality,
      customLandmark: locationData.customLandmark,
      vehicleModel: chosenVehicle,
      issue: selectedIssue,
      visitFee,
      isNight,
      lat: locationData.lat,
      lng: locationData.lng,
      etaMins: locationData.etaMins || '7',
      roadDistanceKm: locationData.roadDistanceKm || 1.9,
      mechanic: locationData.mechanic,
      routeCoords: locationData.routeCoords || []
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px', padding: '26px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              backgroundColor: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Zap size={20} color="#dc2626" />
            </div>
            <div>
              <h2 style={{ fontSize: '19px', color: '#0f172a', fontWeight: 800 }}>
                {lang === 'gu' ? 'રોડસાઇડ ઈમરજન્સી મદદ' : 'Instant Roadside Assistance'}
              </h2>
              <p style={{ fontSize: '12px', color: '#64748b' }}>
                {lang === 'gu' ? 'ભાવનગરમાં ગમે ત્યાં ૧૫ મિનિટમાં મદદ' : 'Live GPS Location Dispatch Across Bhavnagar'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ color: '#64748b', padding: '6px', borderRadius: '50%', cursor: 'pointer' }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Night / Day Pricing Alert */}
        <div style={{
          backgroundColor: isNight ? '#fef2f2' : '#f0fdf4',
          border: isNight ? '1px solid #fecaca' : '1px solid #bbf7d0',
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '13px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} color={isNight ? '#dc2626' : '#16a34a'} />
            <span style={{ color: isNight ? '#991b1b' : '#166534', fontWeight: 600 }}>
              {isNight ? '🌙 Night Emergency Window (9 PM - 1 AM)' : '☀️ Daytime Rapid Patrol Active'}
            </span>
          </div>
          <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>
            Visit Fee: ₹{visitFee}
          </span>
        </div>

        {/* Step 1: LIVE INTERACTIVE MAP LOCATION PICKER */}
        <div style={{ marginBottom: '20px' }}>
          <LiveLocationPicker
            onLocationChange={handleLocationUpdate}
            initialLocality={locationData.locality}
            lang={lang}
          />
        </div>

        {/* Step 2: Problem Selection */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
            2. {lang === 'gu' ? 'શું સમસ્યા છે?' : 'What is the breakdown issue?'}
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {EMERGENCY_SERVICES.map((serv) => {
              const isSelected = selectedIssue.id === serv.id;
              return (
                <div
                  key={serv.id}
                  onClick={() => setSelectedIssue(serv)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '1.5px solid #dc2626' : '1px solid #e2e8f0',
                    backgroundColor: isSelected ? '#fff5f5' : '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ color: isSelected ? '#dc2626' : '#64748b' }}>
                      {serv.id === 'wont_start' && <BatteryCharging size={18} />}
                      {serv.id === 'puncture' && <Disc size={18} />}
                      {serv.id === 'chain_cable' && <Wrench size={18} />}
                      {serv.id === 'fuel_assist' && <Fuel size={18} />}
                      {serv.id === 'towing' && <Truck size={18} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 600, color: isSelected ? '#0f172a' : '#334155' }}>
                        {serv.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        {serv.description.slice(0, 60)}...
                      </div>
                    </div>
                  </div>

                  <span style={{ fontSize: '13px', fontWeight: 700, color: isSelected ? '#dc2626' : '#475569' }}>
                    ₹{isNight ? serv.nightFee : serv.dayFee}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: Vehicle Model */}
        <div style={{ marginBottom: '22px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
            3. {lang === 'gu' ? 'તમારી ગાડી મોડેલ:' : 'Your Vehicle Model:'}
          </label>
          <select
            value={vehicleModel}
            onChange={(e) => setVehicleModel(e.target.value)}
            style={{ width: '100%', fontSize: '14px' }}
          >
            {VEHICLE_MODELS.map(m => (
              <option key={m.id} value={m.name}>{m.name}</option>
            ))}
            <option value="Other">Other Two-Wheeler / Car</option>
          </select>

          {vehicleModel === 'Other' && (
            <input
              type="text"
              placeholder="Enter your vehicle name (e.g. Yamaha FZ, Suzuki Access, Swift)"
              value={customVehicle}
              onChange={(e) => setCustomVehicle(e.target.value)}
              style={{ width: '100%', marginTop: '8px' }}
            />
          )}
        </div>

        {/* Dispatch Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={handleTriggerDispatch}
            id="modal-dispatch-whatsapp-btn"
            className="btn-whatsapp"
            style={{ width: '100%', fontSize: '15px' }}
          >
            <Zap size={18} />
            <span>
              {lang === 'gu'
                ? `વોટ્સએપ પર ઈમરજન્સી SOS મોકલો (વિઝિટ ફી: ₹${visitFee})`
                : `Send Emergency SOS via WhatsApp (Visit Fee: ₹${visitFee})`}
            </span>
          </button>

          <a
            href={`tel:${EMERGENCY_HOTLINE.replace(/\s+/g, '')}`}
            id="modal-call-hotline-btn"
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center', color: '#dc2626', borderColor: '#fca5a5' }}
          >
            <Phone size={15} />
            <span>Direct Call 24/7 Hotline ({EMERGENCY_HOTLINE})</span>
          </a>
        </div>
      </div>
    </div>
  );
}
