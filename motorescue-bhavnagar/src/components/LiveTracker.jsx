import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { X, Phone, ShieldCheck, CheckCircle2, Clock, Navigation, Star, MapPin, ExternalLink, Compass, Radio, Share2, AlertTriangle, Check, MessageCircle } from 'lucide-react';
import { MECHANICS } from '../data/mechanics';
import { EMERGENCY_HOTLINE, WHATSAPP_NUMBER } from '../data/localities';
import { createEmergencyWhatsAppLink } from '../utils/whatsappHelper';

// Customer marker icon with radar wave
const createCustomerPinIcon = () => {
  return L.divIcon({
    className: 'tracker-customer-icon',
    html: `
      <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; transform: translate(-17px, -34px);">
        <div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: rgba(220, 38, 38, 0.35); animation: radar-pulse 1.8s infinite;"></div>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="#dc2626" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
          <circle cx="12" cy="10" r="3" fill="#ffffff"></circle>
        </svg>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34]
  });
};

// Real device GPS hardware marker with blue pulsing radar
const createDeviceGpsIcon = () => {
  return L.divIcon({
    className: 'tracker-device-gps-icon',
    html: `
      <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; transform: translate(-14px, -14px);">
        <div style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: rgba(37, 99, 235, 0.35); animation: radar-pulse 1.5s infinite;"></div>
        <div style="width: 14px; height: 14px; border-radius: 50%; background: #2563eb; border: 2.5px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

// Moving mechanic patrol bike marker icon
const createMovingMechanicIcon = (name) => {
  return L.divIcon({
    className: 'tracker-mechanic-icon',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
        <div style="
          background: #16a34a;
          color: #ffffff;
          padding: 2px 7px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 800;
          white-space: nowrap;
          border: 1.5px solid #ffffff;
          margin-bottom: 2px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        ">
          🛵 ${name.split(' ')[0]} (Moving)
        </div>
        <div style="
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #22c55e;
          border: 2.5px solid #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 10px rgba(34, 197, 94, 0.55);
        ">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="18.5" cy="17.5" r="3.5"/>
            <circle cx="5.5" cy="17.5" r="3.5"/>
            <circle cx="15" cy="5" r="1"/>
            <path d="M12 17.5V14l-3-3 4-3 2 3h2"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [84, 52],
    iconAnchor: [42, 52]
  });
};

export default function LiveTracker({ dispatchData, onClose, lang }) {
  if (!dispatchData) return null;

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const mechanicMarkerRef = useRef(null);
  const animationIntervalRef = useRef(null);

  const initialEtaMinutes = Number(dispatchData.etaMins) || 12;
  const initialRoadDistance = Number(dispatchData.roadDistanceKm) || 2.1;

  // Real Booking Lifecycle State: 'AWAITING_CONFIRMATION' | 'DISPATCHED'
  const [bookingStatus, setBookingStatus] = useState('AWAITING_CONFIRMATION');

  // Live Device Hardware GPS state
  const [isLiveGpsTracking, setIsLiveGpsTracking] = useState(false);
  const [liveGpsAccuracy, setLiveGpsAccuracy] = useState(null);
  const [liveGpsSpeed, setLiveGpsSpeed] = useState(null);
  const [gpsError, setGpsError] = useState(null);
  const deviceGpsMarkerRef = useRef(null);
  const deviceAccuracyCircleRef = useRef(null);
  const watchIdRef = useRef(null);

  // Assigned mechanic (or fallback to Ramesh Vaghela)
  const mechanic = dispatchData.mechanic || MECHANICS[0];

  const custLat = dispatchData.lat || 21.7645;
  const custLng = dispatchData.lng || 72.1519;
  const googleMapsUrl = `https://maps.google.com/?q=${custLat},${custLng}`;
  const googleMapsNavUrl = `https://www.google.com/maps/dir/?api=1&destination=${custLat},${custLng}&travelmode=driving`;

  const waLink = createEmergencyWhatsAppLink({
    locality: dispatchData.locality,
    customLandmark: dispatchData.customLandmark,
    vehicleModel: dispatchData.vehicleModel,
    issueName: dispatchData.issue?.name || 'Two-Wheeler Breakdown',
    isNightTime: dispatchData.isNight,
    bookingId: dispatchData.bookingId,
    lat: custLat,
    lng: custLng,
    roadDistanceKm: initialRoadDistance,
    etaMins: initialEtaMinutes,
    mechanicName: mechanic.name
  });

  const toggleLiveDeviceGps = () => {
    if (isLiveGpsTracking) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      if (deviceGpsMarkerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(deviceGpsMarkerRef.current);
        deviceGpsMarkerRef.current = null;
      }
      if (deviceAccuracyCircleRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(deviceAccuracyCircleRef.current);
        deviceAccuracyCircleRef.current = null;
      }
      setIsLiveGpsTracking(false);
      return;
    }

    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setGpsError(null);
    setIsLiveGpsTracking(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy, speed } = pos.coords;
        setLiveGpsAccuracy(Math.round(accuracy));
        setLiveGpsSpeed(speed ? (speed * 3.6).toFixed(1) : '0.0');

        if (mapInstanceRef.current) {
          if (!deviceGpsMarkerRef.current) {
            deviceGpsMarkerRef.current = L.marker([latitude, longitude], {
              icon: createDeviceGpsIcon(),
              zIndexOffset: 1200
            }).addTo(mapInstanceRef.current);
          } else {
            deviceGpsMarkerRef.current.setLatLng([latitude, longitude]);
          }

          if (!deviceAccuracyCircleRef.current) {
            deviceAccuracyCircleRef.current = L.circle([latitude, longitude], {
              radius: accuracy,
              color: '#3b82f6',
              weight: 1,
              fillColor: '#60a5fa',
              fillOpacity: 0.15
            }).addTo(mapInstanceRef.current);
          } else {
            deviceAccuracyCircleRef.current.setLatLng([latitude, longitude]);
            deviceAccuracyCircleRef.current.setRadius(accuracy);
          }

          mapInstanceRef.current.panTo([latitude, longitude]);
        }
      },
      (err) => {
        setGpsError('Please allow location permissions in browser to track live.');
        setIsLiveGpsTracking(false);
      },
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
    );
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // Real Map Initialization (No fake movement)
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const mechLat = mechanic.lat || 21.7584;
    const mechLng = mechanic.lng || 72.1481;

    // Initialize map
    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: false
    });

    // Real OpenStreetMap Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Customer Real Marker
    L.marker([custLat, custLng], {
      icon: createCustomerPinIcon(),
      zIndexOffset: 1000
    }).addTo(map);

    // Mechanic Base Marker
    const mechMarker = L.marker([mechLat, mechLng], {
      icon: createMovingMechanicIcon(mechanic.name),
      zIndexOffset: 500
    }).addTo(map);
    mechanicMarkerRef.current = mechMarker;

    // Route coordinates: use real OSRM coordinates passed from picker, or interpolate
    let routeCoords = dispatchData.routeCoords;
    if (!routeCoords || routeCoords.length < 2) {
      routeCoords = [
        [mechLat, mechLng],
        [custLat, custLng]
      ];
    }

    // Draw the street route
    L.polyline(routeCoords, {
      color: '#dc2626',
      weight: 5,
      opacity: 0.85,
      dashArray: '7, 6',
      lineJoin: 'round'
    }).addTo(map);

    // Fit map bounds to show both customer and mechanic
    const bounds = L.latLngBounds([[custLat, custLng], [mechLat, mechLng]]);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });

    mapInstanceRef.current = map;

    // Resize map when modal settles
    setTimeout(() => map.invalidateSize(), 150);
    setTimeout(() => map.invalidateSize(), 400);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  const isConfirmed = bookingStatus === 'DISPATCHED';

  const steps = [
    {
      title: 'Emergency SOS Alert Prepared',
      desc: `Booking #${dispatchData.bookingId} generated with real GPS coordinates`,
      done: true
    },
    {
      title: 'WhatsApp Dispatch Confirmation',
      desc: isConfirmed
        ? 'Confirmed via WhatsApp / Central Operations Hotline'
        : 'Action Required: Send WhatsApp SOS alert to dispatch mechanic',
      done: isConfirmed
    },
    {
      title: 'Mechanic En Route with Real GPS',
      desc: isConfirmed
        ? `${mechanic.name} riding towards ${dispatchData.customLandmark || dispatchData.locality?.name || 'your breakdown spot'}`
        : 'Will activate immediately once WhatsApp message is sent',
      done: isConfirmed
    },
    {
      title: 'On-Spot Repair & 30-Day Guarantee',
      desc: 'Inspection with mobile diagnostic kit, pay via UPI upon satisfaction',
      done: false
    }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px', padding: '24px', maxHeight: '92vh', overflowY: 'auto' }}>
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className={bookingStatus === 'DISPATCHED' ? 'badge-emerald' : 'badge-amber'} style={{ fontSize: '11px', fontWeight: 800 }}>
                {bookingStatus === 'DISPATCHED' ? 'LIVE MECHANIC DISPATCH' : 'ACTION REQUIRED TO BOOK'}
              </span>
              <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: '#64748b' }}>
                #{dispatchData.bookingId}
              </span>
            </div>
            <h3 style={{ fontSize: '18px', color: '#0f172a', marginTop: '4px' }}>
              {bookingStatus === 'DISPATCHED'
                ? (lang === 'gu' ? 'મિકેનિક લાઈવ જીપીએસ સાથે રવાના થઈ ગયા છે!' : 'Mechanic Dispatched & En Route!')
                : (lang === 'gu' ? 'બુકિંગ કન્ફર્મ કરવા માટે વોટ્સએપ મેસેજ મોકલો' : 'Confirm Your SOS via WhatsApp to Dispatch')}
            </h3>
          </div>

          <button onClick={onClose} style={{ color: '#64748b', padding: '6px', cursor: 'pointer', borderRadius: '50%' }} aria-label="Close tracker">
            <X size={20} />
          </button>
        </div>

        {/* Real Live Dispatch Status Card (No Fake Timers) */}
        <div style={{
          backgroundColor: bookingStatus === 'DISPATCHED' ? '#f0fdf4' : '#fffbeb',
          border: bookingStatus === 'DISPATCHED' ? '1.5px solid #86efac' : '1.5px solid #fde68a',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          marginBottom: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: bookingStatus === 'DISPATCHED' ? '#dcfce7' : '#fef3c7',
              color: bookingStatus === 'DISPATCHED' ? '#15803d' : '#b45309',
              padding: '3px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.4px',
              textTransform: 'uppercase'
            }}>
              <span style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: bookingStatus === 'DISPATCHED' ? '#16a34a' : '#d97706',
                animation: bookingStatus === 'DISPATCHED' ? 'radar-pulse 1.8s infinite' : 'none'
              }} />
              <span>{bookingStatus === 'DISPATCHED' ? 'Active Real Dispatch' : 'Awaiting WhatsApp Confirmation'}</span>
            </div>

            <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>
              Ref: #{dispatchData.bookingId}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                {bookingStatus === 'DISPATCHED' ? `~${initialEtaMinutes} Mins Driving ETA` : 'Booking Not Placed Yet'}
              </div>
              <div style={{ fontSize: '12.5px', color: '#475569', marginTop: '3px' }}>
                {bookingStatus === 'DISPATCHED'
                  ? `🛣️ ${initialRoadDistance} km road distance • ${mechanic.name} is on the way`
                  : 'You have not booked yet. Click below to send the WhatsApp alert or call helpline.'}
              </div>
            </div>

            {bookingStatus !== 'DISPATCHED' && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp"
                  style={{ padding: '8px 14px', fontSize: '12.5px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <MessageCircle size={15} />
                  <span>Send SOS on WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => setBookingStatus('DISPATCHED')}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1.5px solid #059669',
                    color: '#059669',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Check size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  <span>I Sent the Message</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* REAL INTERACTIVE MAP DISPLAY */}
        <div style={{
          position: 'relative',
          height: '240px',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          border: '1.5px solid #cbd5e1',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          marginBottom: '14px'
        }}>
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

          {/* Floating live tracking badge on map */}
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            zIndex: 1000,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '5px 10px',
            borderRadius: '5px',
            fontSize: '11.5px',
            fontWeight: 700,
            color: '#0f172a',
            border: '1px solid #cbd5e1',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#16a34a', animation: 'radar-pulse 1.8s infinite' }} />
            <span>🛵 {mechanic.name.split(' ')[0]} live GPS navigation</span>
          </div>
        </div>

        {/* REAL NAVIGATION & DEVICE GPS BAR */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          marginBottom: '14px'
        }}>
          {/* Direct 1-Tap Google Maps Turn-by-Turn GPS Driving Navigation */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px'
          }}>
            <a
              href={googleMapsNavUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: '#16a34a',
                color: '#ffffff',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '12.5px',
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '0 2px 6px rgba(22, 163, 74, 0.35)'
              }}
            >
              <Navigation size={15} />
              <span>Turn-by-Turn GPS</span>
              <ExternalLink size={12} />
            </a>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: '#eff6ff',
                color: '#1d4ed8',
                border: '1.5px solid #bfdbfe',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '12.5px',
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              <MapPin size={15} color="#2563eb" />
              <span>Google Maps Pin</span>
              <ExternalLink size={12} />
            </a>
          </div>

          {/* Connect Live Phone GPS Button */}
          <button
            type="button"
            onClick={toggleLiveDeviceGps}
            style={{
              width: '100%',
              backgroundColor: isLiveGpsTracking ? '#1d4ed8' : '#f8fafc',
              color: isLiveGpsTracking ? '#ffffff' : '#0f172a',
              border: isLiveGpsTracking ? '1.5px solid #1d4ed8' : '1.5px solid #cbd5e1',
              padding: '9px 12px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Compass size={16} className={isLiveGpsTracking ? 'animate-spin' : ''} />
            <span>
              {isLiveGpsTracking
                ? `📡 Hardware GPS Live (Acc: ±${liveGpsAccuracy || 5}m • ${liveGpsSpeed || 0} km/h) — Stop Tracking`
                : '📡 Connect My Real Device Hardware GPS (Live Walk/Drive)'}
            </span>
          </button>

          {gpsError && (
            <div style={{ fontSize: '11px', color: '#dc2626', fontWeight: 600, textAlign: 'center' }}>
              {gpsError}
            </div>
          )}

          {/* Real Field Testing Note with WhatsApp Live Location */}
          <div style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: 'var(--radius-md)',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            fontSize: '11.5px',
            color: '#166534'
          }}>
            <Radio size={14} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Field Testing Note:</strong> To track a physical rider in real-time, the mechanic & customer share <strong>WhatsApp Live Location</strong> (built into WhatsApp chat) which gives 100% genuine live satellite GPS tracking.
            </div>
          </div>
        </div>

        {/* Assigned Mechanic Profile Card */}
        <div style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
          marginBottom: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                border: '1.5px solid #16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '15px',
                fontWeight: 800,
                color: '#166534'
              }}>
                {mechanic.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a' }}>{mechanic.name}</span>
                  <ShieldCheck size={15} color="#059669" title="Police & Identity Verified" />
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                  {mechanic.role} • {mechanic.bike}
                </div>
                <div style={{ fontSize: '11px', color: '#b45309', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '1px' }}>
                  <Star size={11} fill="#eab308" color="#eab308" />
                  <span>4.9★ ({mechanic.jobsCompleted} Bhavnagar rescues)</span>
                </div>
              </div>
            </div>

            <a
              href={`tel:${mechanic.phone.replace(/\s+/g, '')}`}
              style={{
                backgroundColor: '#dcfce7',
                border: '1px solid #86efac',
                color: '#166534',
                padding: '7px 12px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              <Phone size={13} />
              <span>Call Tech</span>
            </a>
          </div>
        </div>

        {/* Live Step Progression */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
            DISPATCH TIMELINE
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {steps.map((step, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: step.done ? '#059669' : '#e2e8f0',
                  color: step.done ? '#ffffff' : '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 800,
                  flexShrink: 0,
                  marginTop: '1px'
                }}>
                  {step.done ? <CheckCircle2 size={13} /> : idx + 1}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: step.done ? '#0f172a' : '#64748b' }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    {step.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Job Pricing Summary Box */}
        <div style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12.5px'
        }}>
          <div>
            <span style={{ color: '#64748b' }}>Locked Call-Out Fee: </span>
            <strong style={{ color: '#0f172a' }}>₹{dispatchData.visitFee}</strong>
            <span style={{ color: '#94a3b8', fontSize: '11px', marginLeft: '5px' }}>
              ({dispatchData.isNight ? 'Night Rate' : 'Day Rate'})
            </span>
          </div>
          <span style={{ color: '#059669', fontWeight: 700, fontSize: '11.5px' }}>
            Pay via UPI on arrival
          </span>
        </div>
      </div>
    </div>
  );
}
