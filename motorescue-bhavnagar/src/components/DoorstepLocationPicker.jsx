import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Home, Building2, MapPin, Compass, Check, Navigation } from 'lucide-react';
import { BHAVNAGAR_CENTER, BHAVNAGAR_LOCALITIES } from '../data/localities';
import { calculateHaversineKm } from '../utils/geoHelper';

// Custom doorstep house pin icon
const createDoorstepPinIcon = (placeType = 'home') => {
  const iconEmoji = placeType === 'office' ? '🏢' : placeType === 'other' ? '📍' : '🏠';
  const labelText = placeType === 'office' ? 'Office Doorstep' : placeType === 'other' ? 'Service Spot' : 'Home Doorstep';

  return L.divIcon({
    className: 'doorstep-pin-icon',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
        <div style="
          background: #0f172a;
          color: #ffffff;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 700;
          white-space: nowrap;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          margin-bottom: 2px;
          border: 1px solid #334155;
        ">
          ${iconEmoji} ${labelText}
        </div>
        <div style="
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #d97706;
          border: 2px solid #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(217, 119, 6, 0.4);
        ">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [120, 56],
    iconAnchor: [60, 56]
  });
};

export default function DoorstepLocationPicker({
  initialLocality,
  onLocationChange,
  lang
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const [placeType, setPlaceType] = useState('home'); // 'home' | 'office' | 'other'
  const [coords, setCoords] = useState({
    lat: initialLocality?.lat || BHAVNAGAR_CENTER.lat,
    lng: initialLocality?.lng || BHAVNAGAR_CENTER.lng
  });
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [streetAddress, setStreetAddress] = useState('');
  const [selectedLocality, setSelectedLocality] = useState(initialLocality || BHAVNAGAR_LOCALITIES[0]);

  // Find nearest Bhavnagar locality name
  const findNearestLocality = (lat, lng) => {
    let nearest = BHAVNAGAR_LOCALITIES[0];
    let minDist = Infinity;
    BHAVNAGAR_LOCALITIES.forEach(loc => {
      const d = calculateHaversineKm(lat, lng, loc.lat, loc.lng);
      if (d < minDist) {
        minDist = d;
        nearest = loc;
      }
    });
    return nearest;
  };

  // Reverse geocode via Nominatim
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      const data = await res.json();
      if (data && data.address) {
        const road = data.address.road || data.address.neighbourhood || data.address.suburb || data.address.residential || '';
        const houseNo = data.address.house_number ? `${data.address.house_number}, ` : '';
        const fullAddr = `${houseNo}${road}`.trim();
        if (fullAddr) {
          setStreetAddress(fullAddr);
          return fullAddr;
        }
      }
    } catch (e) {
      // Ignored - fallback to manual
    }
    return '';
  };

  // Notify parent
  const notifyParent = (lat, lng, pType, loc, street) => {
    if (onLocationChange) {
      onLocationChange({
        lat,
        lng,
        placeType: pType,
        locality: loc,
        streetAddress: street,
        googleMapsLink: `https://maps.google.com/?q=${lat.toFixed(5)},${lng.toFixed(5)}`
      });
    }
  };

  // Initialize map when toggled open
  useEffect(() => {
    if (!showMap) {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      return;
    }

    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [coords.lat, coords.lng],
      zoom: 15,
      zoomControl: true,
      attributionControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const marker = L.marker([coords.lat, coords.lng], {
      icon: createDoorstepPinIcon(placeType),
      draggable: true,
      zIndexOffset: 1000
    }).addTo(map);

    mapInstanceRef.current = map;
    markerRef.current = marker;

    setTimeout(() => map.invalidateSize(), 150);
    setTimeout(() => map.invalidateSize(), 350);

    marker.on('dragend', async (e) => {
      const { lat, lng } = e.target.getLatLng();
      setCoords({ lat, lng });
      const nearest = findNearestLocality(lat, lng);
      setSelectedLocality(nearest);
      const street = await reverseGeocode(lat, lng);
      notifyParent(lat, lng, placeType, nearest, street || streetAddress);
    });

    map.on('click', async (e) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      setCoords({ lat, lng });
      const nearest = findNearestLocality(lat, lng);
      setSelectedLocality(nearest);
      const street = await reverseGeocode(lat, lng);
      notifyParent(lat, lng, placeType, nearest, street || streetAddress);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [showMap]);

  // Update marker icon when placeType changes
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setIcon(createDoorstepPinIcon(placeType));
    }
    notifyParent(coords.lat, coords.lng, placeType, selectedLocality, streetAddress);
  }, [placeType]);

  // HTML5 Live GPS button
  const handleUseGps = () => {
    if (!navigator.geolocation) {
      alert('Browser geolocation is not supported.');
      return;
    }

    setIsGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setIsGpsLoading(false);
        setCoords({ lat: latitude, lng: longitude });

        const nearest = findNearestLocality(latitude, longitude);
        setSelectedLocality(nearest);

        if (!showMap) {
          setShowMap(true);
        }

        setTimeout(async () => {
          if (mapInstanceRef.current && markerRef.current) {
            mapInstanceRef.current.flyTo([latitude, longitude], 16, { duration: 0.8 });
            markerRef.current.setLatLng([latitude, longitude]);
          }
          const street = await reverseGeocode(latitude, longitude);
          notifyParent(latitude, longitude, placeType, nearest, street || streetAddress);
        }, 200);
      },
      (err) => {
        setIsGpsLoading(false);
        alert('Could not access live GPS. Please enable browser location access or select on map.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleLocalitySelect = (loc) => {
    setSelectedLocality(loc);
    setCoords({ lat: loc.lat, lng: loc.lng });

    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.flyTo([loc.lat, loc.lng], 15, { duration: 0.7 });
      markerRef.current.setLatLng([loc.lat, loc.lng]);
    }

    notifyParent(loc.lat, loc.lng, placeType, loc, streetAddress);
  };

  const handlePlaceTypeClick = (type) => {
    setPlaceType(type);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* 1. Place Type Selector (Home vs Office vs Other) */}
      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
          {lang === 'gu' ? 'સ્થળનો પ્રકાર (ક્યાં સર્વિસ કરાવવી છે?):' : 'Select Place Type for Doorstep Service:'}
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          <button
            type="button"
            onClick={() => handlePlaceTypeClick('home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '9px 12px',
              borderRadius: '7px',
              border: placeType === 'home' ? '2px solid #d97706' : '1px solid #e2e8f0',
              backgroundColor: placeType === 'home' ? '#fef3c7' : '#ffffff',
              color: placeType === 'home' ? '#92400e' : '#475569',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Home size={15} />
            <span>{lang === 'gu' ? 'ઘર (Home)' : 'Home'}</span>
          </button>

          <button
            type="button"
            onClick={() => handlePlaceTypeClick('office')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '9px 12px',
              borderRadius: '7px',
              border: placeType === 'office' ? '2px solid #2563eb' : '1px solid #e2e8f0',
              backgroundColor: placeType === 'office' ? '#eff6ff' : '#ffffff',
              color: placeType === 'office' ? '#1e40af' : '#475569',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Building2 size={15} />
            <span>{lang === 'gu' ? 'ઓફિસ (Work)' : 'Office'}</span>
          </button>

          <button
            type="button"
            onClick={() => handlePlaceTypeClick('other')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '9px 12px',
              borderRadius: '7px',
              border: placeType === 'other' ? '2px solid #059669' : '1px solid #e2e8f0',
              backgroundColor: placeType === 'other' ? '#ecfdf5' : '#ffffff',
              color: placeType === 'other' ? '#065f46' : '#475569',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <MapPin size={15} />
            <span>{lang === 'gu' ? 'અન્ય સ્થળ' : 'Other'}</span>
          </button>
        </div>
      </div>

      {/* 2. Map Pin Toggle & GPS Buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '7px',
        padding: '8px 12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#334155', fontWeight: 600 }}>
          <MapPin size={15} color="#d97706" />
          <span>
            {coords.lat ? '📍 Location Pinned on Map' : '📍 Pin on Map'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={handleUseGps}
            disabled={isGpsLoading}
            style={{
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#1d4ed8',
              padding: '5px 10px',
              borderRadius: '6px',
              fontSize: '11.5px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              cursor: 'pointer'
            }}
          >
            <Compass size={12} className={isGpsLoading ? 'animate-spin' : ''} />
            <span>{isGpsLoading ? 'Locating...' : '📍 Auto-Detect GPS'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowMap(!showMap)}
            style={{
              backgroundColor: showMap ? '#0f172a' : '#ffffff',
              border: '1px solid #cbd5e1',
              color: showMap ? '#ffffff' : '#334155',
              padding: '5px 10px',
              borderRadius: '6px',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {showMap ? 'Hide Map' : '🗺️ Select on Map'}
          </button>
        </div>
      </div>

      {/* 3. Interactive Map Canvas (Toggled or GPS) */}
      {showMap && (
        <div style={{
          position: 'relative',
          height: '210px',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          border: '1.5px solid #cbd5e1',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

          {/* Floating hint on map */}
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
            Drag pin to your exact gate or society entrance
          </div>
        </div>
      )}
    </div>
  );
}
