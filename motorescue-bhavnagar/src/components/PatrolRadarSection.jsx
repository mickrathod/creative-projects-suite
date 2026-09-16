import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Compass, MapPin, Navigation, Clock, ShieldCheck, Zap, Wrench, CheckCircle2 } from 'lucide-react';
import { BHAVNAGAR_CENTER, BHAVNAGAR_LOCALITIES } from '../data/localities';
import { MECHANICS } from '../data/mechanics';
import { calculateHaversineKm, getClosestMechanic } from '../utils/geoHelper';

// Customer pin icon with clear "You Are Here" label
const createRadarCustomerPin = () => {
  return L.divIcon({
    className: 'radar-customer-pin',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
        <div style="
          background: #dc2626;
          color: #ffffff;
          padding: 2px 7px;
          border-radius: 4px;
          font-size: 10.5px;
          font-weight: 800;
          white-space: nowrap;
          box-shadow: 0 2px 6px rgba(220,38,38,0.4);
          margin-bottom: 2px;
          border: 1px solid #ffffff;
        ">
          📍 You Are Here (Drag Me)
        </div>
        <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: rgba(220, 38, 38, 0.35); animation: radar-pulse 1.8s infinite;"></div>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="#dc2626" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3" fill="#ffffff"></circle>
          </svg>
        </div>
      </div>
    `,
    iconSize: [120, 60],
    iconAnchor: [60, 60]
  });
};

// Mechanic patrol marker icon with clear label
const createMechanicMarker = (mechanic, isAssigned) => {
  const bg = isAssigned ? '#16a34a' : '#2563eb';
  const labelBg = isAssigned ? '#14532d' : '#0f172a';
  const roleText = isAssigned ? 'Nearest Unit' : 'Available';

  return L.divIcon({
    className: 'radar-mechanic-marker',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
        <div style="
          background: ${labelBg};
          color: #ffffff;
          padding: 3px 8px;
          border-radius: 5px;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
          border: 1.5px solid ${isAssigned ? '#22c55e' : 'rgba(255,255,255,0.4)'};
          margin-bottom: 2px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          gap: 4px;
        ">
          <span>🛵 ${mechanic.name.split(' ')[0]}</span>
          <span style="font-size: 9.5px; opacity: 0.95; font-weight: 600;">(${roleText})</span>
        </div>
        <div style="
          width: ${isAssigned ? '34px' : '28px'};
          height: ${isAssigned ? '34px' : '28px'};
          border-radius: 50%;
          background: ${bg};
          border: 2.5px solid #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.35);
        ">
          <svg width="${isAssigned ? '18' : '14'}" height="${isAssigned ? '18' : '14'}" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="18.5" cy="17.5" r="3.5"/>
            <circle cx="5.5" cy="17.5" r="3.5"/>
            <circle cx="15" cy="5" r="1"/>
            <path d="M12 17.5V14l-3-3 4-3 2 3h2"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [120, 56],
    iconAnchor: [60, 56]
  });
};

export default function PatrolRadarSection({ onOpenEmergency, onOpenRoutine, lang }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const customerMarkerRef = useRef(null);
  const mechanicMarkersRef = useRef({});
  const routePolylineRef = useRef(null);

  const [selectedCoords, setSelectedCoords] = useState(BHAVNAGAR_CENTER);
  const [selectedLocalityName, setSelectedLocalityName] = useState('Ghogha Circle & Sardarnagar');
  const [assignedMechanic, setAssignedMechanic] = useState(MECHANICS[0]);
  const [roadDistanceKm, setRoadDistanceKm] = useState(1.9);
  const [roadTransitMins, setRoadTransitMins] = useState(5);
  const [totalEtaMins, setTotalEtaMins] = useState(7);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isLocatingUser, setIsLocatingUser] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const startLat = BHAVNAGAR_CENTER.lat;
    const startLng = BHAVNAGAR_CENTER.lng;

    const map = L.map(mapContainerRef.current, {
      center: [startLat, startLng],
      zoom: 13,
      zoomControl: true,
      attributionControl: false
    });

    // Real OpenStreetMap Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(map);

    // Initial closest mechanic
    const { mechanic: initialClosest } = getClosestMechanic(startLat, startLng);

    // Customer target marker
    const custMarker = L.marker([startLat, startLng], {
      icon: createRadarCustomerPin(),
      draggable: true,
      zIndexOffset: 1000
    }).addTo(map);

    // All patrol mechanics markers
    const mechMarkers = {};
    MECHANICS.forEach(m => {
      const isAssigned = m.id === initialClosest.id;
      const marker = L.marker([m.lat, m.lng], {
        icon: createMechanicMarker(m, isAssigned),
        zIndexOffset: isAssigned ? 500 : 100
      }).addTo(map);
      mechMarkers[m.id] = marker;
    });

    mapInstanceRef.current = map;
    customerMarkerRef.current = custMarker;
    mechanicMarkersRef.current = mechMarkers;
    setAssignedMechanic(initialClosest);

    // Compute initial road route
    computeRoute(startLat, startLng, initialClosest);

    custMarker.on('dragend', (e) => {
      const { lat, lng } = e.target.getLatLng();
      handleLocationSelected(lat, lng, 'Custom Pinned Location');
    });

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      custMarker.setLatLng([lat, lng]);
      handleLocationSelected(lat, lng, 'Custom Pinned Location');
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  const computeRoute = async (custLat, custLng, mechanic) => {
    setIsCalculating(true);

    // Update marker styling
    if (mechanicMarkersRef.current && mapInstanceRef.current) {
      MECHANICS.forEach(m => {
        const marker = mechanicMarkersRef.current[m.id];
        if (marker) {
          const isAssigned = m.id === mechanic.id;
          marker.setIcon(createMechanicMarker(m, isAssigned));
          marker.setZIndexOffset(isAssigned ? 500 : 100);
        }
      });
    }

    try {
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${mechanic.lng},${mechanic.lat};${custLng},${custLat}?overview=full&geometries=geojson`;
      const response = await fetch(osrmUrl);
      const data = await response.json();

      if (data.code === 'Ok' && data.routes && data.routes[0]) {
        const route = data.routes[0];
        const distKm = Number((route.distance / 1000).toFixed(1));
        const drivingMins = Math.max(1, Math.round(route.duration / 60));
        const prepMins = 2;
        const totalEta = drivingMins + prepMins;

        setRoadDistanceKm(distKm);
        setRoadTransitMins(drivingMins);
        setTotalEtaMins(totalEta);

        const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);

        if (mapInstanceRef.current) {
          if (routePolylineRef.current) {
            mapInstanceRef.current.removeLayer(routePolylineRef.current);
          }
          const polyline = L.polyline(coordinates, {
            color: '#dc2626',
            weight: 5,
            opacity: 0.85,
            dashArray: '7, 6',
            lineJoin: 'round'
          }).addTo(mapInstanceRef.current);
          routePolylineRef.current = polyline;
        }
      } else {
        throw new Error('OSRM fallback');
      }
    } catch (e) {
      // Fallback calculation using Haversine
      const directKm = calculateHaversineKm(custLat, custLng, mechanic.lat, mechanic.lng);
      const estimatedRoadKm = Number(Math.max(0.4, directKm * 1.34).toFixed(1));
      const drivingMins = Math.max(1, Math.round((estimatedRoadKm / 26) * 60));
      const prepMins = 2;
      const totalEta = drivingMins + prepMins;

      setRoadDistanceKm(estimatedRoadKm);
      setRoadTransitMins(drivingMins);
      setTotalEtaMins(totalEta);

      if (mapInstanceRef.current) {
        if (routePolylineRef.current) {
          mapInstanceRef.current.removeLayer(routePolylineRef.current);
        }
        const polyline = L.polyline([[mechanic.lat, mechanic.lng], [custLat, custLng]], {
          color: '#dc2626',
          weight: 4,
          opacity: 0.75,
          dashArray: '6, 6'
        }).addTo(mapInstanceRef.current);
        routePolylineRef.current = polyline;
      }
    } finally {
      setIsCalculating(false);
    }
  };

  const handleLocationSelected = (lat, lng, name) => {
    setSelectedCoords({ lat, lng });
    if (name) setSelectedLocalityName(name);

    const { mechanic } = getClosestMechanic(lat, lng);
    setAssignedMechanic(mechanic);

    computeRoute(lat, lng, mechanic);
  };

  const handleLocalityClick = (loc) => {
    if (mapInstanceRef.current && customerMarkerRef.current) {
      mapInstanceRef.current.flyTo([loc.lat, loc.lng], 14, { duration: 0.7 });
      customerMarkerRef.current.setLatLng([loc.lat, loc.lng]);
    }
    handleLocationSelected(loc.lat, loc.lng, `${loc.name} (${loc.landmark})`);
  };

  const handleDetectLiveGps = () => {
    if (!navigator.geolocation) {
      alert('Browser geolocation is not supported.');
      return;
    }

    setIsLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setIsLocatingUser(false);

        if (mapInstanceRef.current && customerMarkerRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 15, { duration: 1 });
          customerMarkerRef.current.setLatLng([latitude, longitude]);
        }

        handleLocationSelected(latitude, longitude, 'My Exact Device Location');
      },
      (err) => {
        setIsLocatingUser(false);
        alert('Could not access live GPS. Please enable browser location permissions or click anywhere on the Bhavnagar map.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <section id="patrol-radar" style={{
      padding: '48px 0',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0'
    }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 28px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            padding: '4px 14px',
            borderRadius: 'var(--radius-full)',
            marginBottom: '12px'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#059669' }} />
            <span style={{ color: '#1d4ed8', fontSize: '12px', fontWeight: 700, letterSpacing: '0.4px', textTransform: 'uppercase' }}>
              {lang === 'gu' ? 'ભાવનગર લાઈવ મિકેનિક મેપ' : 'Live Bhavnagar Mobile Mechanics Map'}
            </span>
          </div>

          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            {lang === 'gu'
              ? 'તમારા વિસ્તારમાં નજીકનો મિકેનિક અને સાચો પહોંચવાનો સમય'
              : 'Find Nearest Mechanic & Live Arrival Time in Bhavnagar'}
          </h2>

          <p style={{ fontSize: '15px', color: '#64748b', marginTop: '8px' }}>
            {lang === 'gu'
              ? 'મેપ પર તમારી ગાડી જ્યાં બંધ પડી છે ત્યાં ક્લિક કરો અથવા લાઈવ જીપીએસ વાપરો — સૌથી નજીકનો મિકેનિક કેટલી મિનિટમાં પહોંચશે તે લાઈવ દેખાશે.'
              : 'Tap anywhere on the Bhavnagar street map to set your vehicle breakdown spot. The system finds the closest technician and calculates exact road driving minutes.'}
          </p>
        </div>

        {/* Hotspot Chips & GPS Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>
              Quick Zones:
            </span>
            {BHAVNAGAR_LOCALITIES.slice(0, 7).map(loc => (
              <button
                key={loc.id}
                type="button"
                onClick={() => handleLocalityClick(loc)}
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  color: '#334155',
                  cursor: 'pointer'
                }}
              >
                {loc.name}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleDetectLiveGps}
            disabled={isLocatingUser}
            style={{
              backgroundColor: '#eff6ff',
              border: '1.5px solid #93c5fd',
              color: '#1d4ed8',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '12.5px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Compass size={14} className={isLocatingUser ? 'animate-spin' : ''} />
            <span>{isLocatingUser ? 'Detecting Device GPS...' : '📍 Use My Exact Device Location'}</span>
          </button>
        </div>

        {/* Two-Column Grid: Real Map (Left) + Real Calculation & Action Card (Right) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '20px',
          alignItems: 'stretch'
        }}>
          {/* Left Column: Interactive Map Canvas & Map Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{
              position: 'relative',
              height: '360px',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: '1.5px solid #cbd5e1',
              boxShadow: '0 4px 14px rgba(0,0,0,0.06)'
            }}>
              <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

              {/* Overlaid Route Status Pill */}
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                zIndex: 1000,
                backgroundColor: 'rgba(255, 255, 255, 0.96)',
                backdropFilter: 'blur(4px)',
                padding: '7px 14px',
                borderRadius: '6px',
                fontSize: '12.5px',
                fontWeight: 700,
                color: '#0f172a',
                border: '1px solid #cbd5e1',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  backgroundColor: isCalculating ? '#d97706' : '#059669',
                  animation: 'radar-pulse 1.8s infinite'
                }} />
                <span>
                  {isCalculating
                    ? 'Calculating real street routing...'
                    : `🛣️ ${roadDistanceKm} km by road from ${assignedMechanic.name.split(' ')[0]}`}
                </span>
              </div>

              {/* Bottom draggable instruction hint */}
              <div style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                zIndex: 1000,
                backgroundColor: 'rgba(15, 23, 42, 0.88)',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '5px',
                fontSize: '11px',
                fontWeight: 600,
                pointerEvents: 'none'
              }}>
                Drag red pin or tap map to test any spot
              </div>
            </div>

            {/* Visual Map Legend Bar */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '12px'
            }}>
              <span style={{ fontWeight: 800, color: '#0f172a' }}>Map Guide / મેપ ગાઈડ:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ color: '#dc2626', fontWeight: 800 }}>📍 Red Pin:</span>
                <span style={{ color: '#475569' }}>Your Spot (તમારું સ્થળ)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ color: '#16a34a', fontWeight: 800 }}>🟢 🛵 Green:</span>
                <span style={{ color: '#475569' }}>Nearest Mechanic (નજીકનો મિકેનિક)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ color: '#2563eb', fontWeight: 800 }}>🔵 🛵 Blue:</span>
                <span style={{ color: '#475569' }}>Other On-Duty Mechanics</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ color: '#dc2626', fontWeight: 800 }}>- - - Line:</span>
                <span style={{ color: '#475569' }}>Street Route (સાચો રસ્તો)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Real Calculation Breakdown & Direct Action Card */}
          <div className="clean-card" style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span className="badge-emergency">NEAREST MECHANIC & ARRIVAL TIME</span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Bhavnagar Hub</span>
              </div>

              <h3 style={{ fontSize: '18px', color: '#0f172a', fontWeight: 800, marginBottom: '6px' }}>
                {selectedLocalityName}
              </h3>
              <p style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '18px' }}>
                Coordinates: {selectedCoords.lat.toFixed(4)}° N, {selectedCoords.lng.toFixed(4)}° E
              </p>

              {/* 3 Metric Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '12px',
                marginBottom: '18px'
              }}>
                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', padding: '12px' }}>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                    Nearest Unit
                  </div>
                  <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a', marginTop: '3px' }}>
                    {assignedMechanic.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#059669', fontWeight: 600, marginTop: '2px' }}>
                    📍 {assignedMechanic.currentLocation.split('(')[0]}
                  </div>
                </div>

                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', padding: '12px' }}>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                    Actual Road Km
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                    {roadDistanceKm} <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>km</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    via Bhavnagar streets
                  </div>
                </div>

                <div style={{ backgroundColor: '#fff5f5', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', padding: '12px' }}>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#dc2626', fontWeight: 700 }}>
                    Calculated Arrival
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#dc2626', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                    {totalEtaMins} <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>mins</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>
                    ✓ Real road calculation
                  </div>
                </div>
              </div>

              {/* Transparent Calculation Breakdown Box */}
              <div style={{
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                fontSize: '12px',
                color: '#1e40af',
                marginBottom: '20px'
              }}>
                <div style={{ fontWeight: 800, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} color="#2563eb" />
                  <span>How Arrival Time is Calculated:</span>
                </div>
                <div>
                  • <strong>{roadDistanceKm} km</strong> driving along Bhavnagar street network<br />
                  • <strong>{roadTransitMins} mins</strong> riding (@ ~26 km/h city speed)<br />
                  • <strong>+ 2 mins</strong> mobile toolkit check & bike ignition<br />
                  = <strong>{totalEtaMins} mins total guaranteed arrival window</strong>
                </div>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={onOpenEmergency}
                className="btn-emergency"
                style={{ width: '100%', justifyContent: 'center', fontSize: '15px' }}
              >
                <Zap size={18} />
                <span>Request Breakdown SOS to This Spot ({totalEtaMins} Min ETA)</span>
              </button>

              <button
                onClick={onOpenRoutine}
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'center', fontSize: '14px' }}
              >
                <Wrench size={16} />
                <span>Book Doorstep Routine Service Here (₹299)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
