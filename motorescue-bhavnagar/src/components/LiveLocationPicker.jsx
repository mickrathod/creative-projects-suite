import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Compass, MapPin, Navigation, Clock, ShieldCheck, RefreshCw, Check } from 'lucide-react';
import { BHAVNAGAR_CENTER, BHAVNAGAR_LOCALITIES } from '../data/localities';
import { MECHANICS } from '../data/mechanics';
import { calculateHaversineKm, getClosestMechanic } from '../utils/geoHelper';

// Custom customer red pin icon with clear label
const createCustomerPinIcon = () => {
  return L.divIcon({
    className: 'customer-pin-icon',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
        <div style="
          background: #dc2626;
          color: #ffffff;
          padding: 2px 7px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 800;
          white-space: nowrap;
          box-shadow: 0 2px 6px rgba(220,38,38,0.4);
          margin-bottom: 2px;
          border: 1px solid #ffffff;
        ">
          📍 Your Breakdown Spot (Drag Me)
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
    iconSize: [140, 60],
    iconAnchor: [70, 60]
  });
};

// Custom mechanic patrol bike icon
const createMechanicIcon = (name, isAssigned = false) => {
  const bgColor = isAssigned ? '#16a34a' : '#2563eb';
  const labelBg = isAssigned ? '#14532d' : '#0f172a';
  const labelText = isAssigned ? `🛵 ${name.split(' ')[0]} (Assigned)` : `🛵 ${name.split(' ')[0]}`;

  return L.divIcon({
    className: 'mechanic-marker-icon',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
        <div style="
          background: ${labelBg};
          color: #ffffff;
          padding: 2px 7px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 700;
          white-space: nowrap;
          border: 1px solid rgba(255,255,255,0.25);
          margin-bottom: 2px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        ">
          ${labelText}
        </div>
        <div style="
          width: ${isAssigned ? '32px' : '26px'};
          height: ${isAssigned ? '32px' : '26px'};
          border-radius: 50%;
          background: ${bgColor};
          border: 2px solid #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.35);
        ">
          <svg width="${isAssigned ? '17' : '14'}" height="${isAssigned ? '17' : '14'}" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
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

export default function LiveLocationPicker({ onLocationChange, initialLocality, lang }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const customerMarkerRef = useRef(null);
  const mechanicMarkersRef = useRef({});
  const routePolylineRef = useRef(null);

  const [customerCoords, setCustomerCoords] = useState({
    lat: initialLocality?.lat || BHAVNAGAR_CENTER.lat,
    lng: initialLocality?.lng || BHAVNAGAR_CENTER.lng
  });

  const [activeMechanic, setActiveMechanic] = useState(MECHANICS[0]);
  const [realRoadDistanceKm, setRealRoadDistanceKm] = useState(1.9);
  const [realTransitTimeMins, setRealTransitTimeMins] = useState(7);
  const [realAddressName, setRealAddressName] = useState('Near Crest, Waghawadi Road, Bhavnagar');
  const [isRouting, setIsRouting] = useState(false);
  const [isGpsLocating, setIsGpsLocating] = useState(false);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const startLat = initialLocality?.lat || BHAVNAGAR_CENTER.lat;
    const startLng = initialLocality?.lng || BHAVNAGAR_CENTER.lng;

    const map = L.map(mapContainerRef.current, {
      center: [startLat, startLng],
      zoom: 14,
      zoomControl: true,
      attributionControl: false
    });

    // Real OpenStreetMap Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Scale bar in meters
    L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(map);

    // Customer Draggable Pin Marker
    const customerMarker = L.marker([startLat, startLng], {
      icon: createCustomerPinIcon(),
      draggable: true,
      zIndexOffset: 1000
    }).addTo(map);

    // Closest mechanic
    const { mechanic: initialClosest } = getClosestMechanic(startLat, startLng);

    // Add all 3 patrol mechanics to the map
    const mechMarkers = {};
    MECHANICS.forEach(m => {
      const isAssigned = m.id === initialClosest.id;
      const marker = L.marker([m.lat, m.lng], {
        icon: createMechanicIcon(m.name, isAssigned),
        zIndexOffset: isAssigned ? 500 : 100
      }).addTo(map);
      mechMarkers[m.id] = marker;
    });

    mapInstanceRef.current = map;
    customerMarkerRef.current = customerMarker;
    mechanicMarkersRef.current = mechMarkers;
    setActiveMechanic(initialClosest);

    // Ensure map tiles re-calculate container size when modal finishes mounting
    setTimeout(() => map.invalidateSize(), 150);
    setTimeout(() => map.invalidateSize(), 400);

    // Compute route for initial location
    updateRealRoute(startLat, startLng, initialClosest);

    // Listeners for dragging and clicking
    customerMarker.on('dragend', (e) => {
      const { lat, lng } = e.target.getLatLng();
      handlePositionChanged(lat, lng);
    });

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      customerMarker.setLatLng([lat, lng]);
      handlePositionChanged(lat, lng);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Real OSRM Road Distance & Duration Routing
  const updateRealRoute = async (custLat, custLng, mechanic) => {
    setIsRouting(true);

    // Update mechanic marker styles
    if (mechanicMarkersRef.current && mapInstanceRef.current) {
      MECHANICS.forEach(m => {
        const marker = mechanicMarkersRef.current[m.id];
        if (marker) {
          const isAssigned = m.id === mechanic.id;
          marker.setIcon(createMechanicIcon(m.name, isAssigned));
          marker.setZIndexOffset(isAssigned ? 500 : 100);
        }
      });
    }

    try {
      // 1. Fetch Real Street-Level Driving Navigation from OSRM
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${mechanic.lng},${mechanic.lat};${custLng},${custLat}?overview=full&geometries=geojson`;
      const response = await fetch(osrmUrl);
      const data = await response.json();

      if (data.code === 'Ok' && data.routes && data.routes[0]) {
        const route = data.routes[0];
        const roadDistanceKm = Number((route.distance / 1000).toFixed(1));
        const roadDrivingMins = Math.max(1, Math.round(route.duration / 60));
        const prepMins = 2; // Real dispatch prep & tool check
        const totalCalculatedEta = roadDrivingMins + prepMins;

        setRealRoadDistanceKm(roadDistanceKm);
        setRealTransitTimeMins(totalCalculatedEta);

        // Extract street coordinates [lat, lng]
        const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);

        // Draw the real road polyline along actual streets
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

        // Notify parent with real calculated ETA and route coordinates
        notifyParentUpdate(custLat, custLng, mechanic, roadDistanceKm, totalCalculatedEta, coordinates);
      } else {
        throw new Error('OSRM fallback');
      }
    } catch (err) {
      // Robust Mathematical Fallback using Haversine * 1.34 circuity factor
      const directKm = calculateHaversineKm(custLat, custLng, mechanic.lat, mechanic.lng);
      const estimatedRoadKm = Number(Math.max(0.4, directKm * 1.34).toFixed(1));
      const calculatedDrivingMins = Math.max(1, Math.round((estimatedRoadKm / 26) * 60)); // 26 km/h avg speed in Bhavnagar
      const prepMins = 2;
      const totalEta = calculatedDrivingMins + prepMins;

      setRealRoadDistanceKm(estimatedRoadKm);
      setRealTransitTimeMins(totalEta);

      const fallbackCoords = [[mechanic.lat, mechanic.lng], [custLat, custLng]];

      if (mapInstanceRef.current) {
        if (routePolylineRef.current) {
          mapInstanceRef.current.removeLayer(routePolylineRef.current);
        }
        const polyline = L.polyline(fallbackCoords, {
          color: '#dc2626',
          weight: 4,
          opacity: 0.75,
          dashArray: '6, 6'
        }).addTo(mapInstanceRef.current);
        routePolylineRef.current = polyline;
      }

      notifyParentUpdate(custLat, custLng, mechanic, estimatedRoadKm, totalEta, fallbackCoords);
    } finally {
      setIsRouting(false);
    }
  };

  // Reverse Geocoding for real street / area name
  const fetchRealAddress = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address.road || data.address.suburb || data.address.neighbourhood || data.address.residential || data.display_name.split(',')[0];
        const city = data.address.city || data.address.town || data.address.village || data.address.county || data.address.state_district || 'Bhavnagar';
        const full = `${addr}, ${city}`;
        setRealAddressName(full);
        return full;
      }
    } catch (e) {
      // Fallback handled by preset or parent
    }
    return null;
  };

  const handlePositionChanged = async (lat, lng) => {
    setCustomerCoords({ lat, lng });

    // 1. Find closest patrol mechanic to new pin
    const { mechanic } = getClosestMechanic(lat, lng);
    setActiveMechanic(mechanic);

    // 2. Fetch real street name
    fetchRealAddress(lat, lng);

    // 3. Compute real OSRM road route & exact transit minutes
    updateRealRoute(lat, lng, mechanic);
  };

  const notifyParentUpdate = (lat, lng, mechanic, roadKm, etaMins, routeCoordinates) => {
    if (onLocationChange) {
      onLocationChange({
        lat,
        lng,
        mechanic,
        roadDistanceKm: roadKm,
        etaMins: `${etaMins}`,
        customLandmark: realAddressName,
        googleMapsLink: `https://maps.google.com/?q=${lat.toFixed(5)},${lng.toFixed(5)}`,
        routeCoords: routeCoordinates || []
      });
    }
  };

  // HTML5 Real Device GPS Geolocation
  const handleUseLiveGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsGpsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setIsGpsLocating(false);

        if (mapInstanceRef.current && customerMarkerRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 16, { duration: 1 });
          customerMarkerRef.current.setLatLng([latitude, longitude]);
        }

        handlePositionChanged(latitude, longitude);
      },
      (err) => {
        setIsGpsLocating(false);
        alert('Could not retrieve live GPS location. Please allow location permissions in your browser or drag the red pin.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Top Controls: GPS Detect + Instructions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <MapPin size={14} color="#dc2626" />
          <span>{lang === 'gu' ? 'તમારું લાઈવ બ્રેકડાઉન સ્થળ (મેપ પર પિન મૂકો):' : 'Pinpoint Your Exact Breakdown Spot:'}</span>
        </span>

        <button
          type="button"
          onClick={handleUseLiveGps}
          disabled={isGpsLocating}
          style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            color: '#1d4ed8',
            padding: '5px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
        >
          <Compass size={13} className={isGpsLocating ? 'animate-spin' : ''} />
          <span>{isGpsLocating ? 'Detecting Real GPS...' : '📍 Use My Exact Device Location'}</span>
        </button>
      </div>

      {/* Real Map Canvas with Leaflet */}
      <div style={{
        position: 'relative',
        height: '280px',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        border: '1.5px solid #cbd5e1',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

        {/* Live Road Route Status Banner Overlaid on Map */}
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          zIndex: 1000,
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(4px)',
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: 700,
          color: '#0f172a',
          border: '1px solid #cbd5e1',
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isRouting ? '#d97706' : '#059669',
            animation: 'radar-pulse 1.8s infinite'
          }} />
          <span>
            {isRouting
              ? 'Calculating true road driving route...'
              : `🛣️ ${realRoadDistanceKm} km by road from ${activeMechanic.name.split(' ')[0]}`}
          </span>
        </div>

        {/* Floating Instruction */}
        <div style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          zIndex: 1000,
          backgroundColor: 'rgba(15, 23, 42, 0.88)',
          color: '#ffffff',
          padding: '3px 8px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: 600,
          pointerEvents: 'none'
        }}>
          Drag red pin anywhere in Bhavnagar
        </div>
      </div>

      {/* Simple, Consumer-Friendly Mechanic Arrival Status */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1.5px solid #bbf7d0',
        borderRadius: 'var(--radius-md)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#dcfce7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            flexShrink: 0
          }}>
            🛵
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
              {activeMechanic.name}
            </div>
            <div style={{ fontSize: '12px', color: '#15803d', fontWeight: 600 }}>
              {realRoadDistanceKm} km away • Nearby in {activeMechanic.area}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
            Estimated Arrival
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#dc2626', fontFamily: 'var(--font-mono)', lineHeight: 1.1 }}>
            ~{realTransitTimeMins} <span style={{ fontSize: '13px', fontWeight: 600 }}>mins</span>
          </div>
        </div>
      </div>
    </div>
  );
}
