import React, { useState } from 'react';
import { Wrench, CheckCircle2, Calendar, Sparkles, MapPin, ExternalLink, Home, Building2 } from 'lucide-react';
import { ROUTINE_PACKAGES, VEHICLE_MODELS } from '../data/services';
import { BHAVNAGAR_LOCALITIES } from '../data/localities';
import { createRoutineWhatsAppLink } from '../utils/whatsappHelper';
import DoorstepLocationPicker from './DoorstepLocationPicker';

export default function ServiceBooking({ lang }) {
  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLE_MODELS[0]);
  const [selectedPackage, setSelectedPackage] = useState(ROUTINE_PACKAGES[0]);
  const [selectedDate, setSelectedDate] = useState('Tomorrow');
  const [selectedSlot, setSelectedSlot] = useState('Morning (9:30 AM – 12:30 PM)');
  const [selectedLocality, setSelectedLocality] = useState(BHAVNAGAR_LOCALITIES[0]);
  const [placeType, setPlaceType] = useState('home');
  const [doorstepCoords, setDoorstepCoords] = useState({
    lat: BHAVNAGAR_LOCALITIES[0].lat,
    lng: BHAVNAGAR_LOCALITIES[0].lng
  });
  const [houseFlatNo, setHouseFlatNo] = useState('');
  const [societyStreet, setSocietyStreet] = useState('');
  const [phone, setPhone] = useState('');
  const [bookingSuccessData, setBookingSuccessData] = useState(null);

  const estimatedTotal = selectedPackage.labourFee + (selectedPackage.id === 'battery_replacement' ? 0 : selectedVehicle.oilCost);

  const handleLocationPickerChange = ({ lat, lng, placeType: pType, locality: loc, streetAddress }) => {
    setDoorstepCoords({ lat, lng });
    if (pType) setPlaceType(pType);
    if (loc) setSelectedLocality(loc);
    if (streetAddress && !societyStreet) {
      setSocietyStreet(streetAddress);
    }
  };

  const handleBookService = (e) => {
    e.preventDefault();
    const bookingId = 'SRV-' + Math.floor(1000 + Math.random() * 9000);

    const placeLabel = placeType === 'office' ? 'Office' : placeType === 'other' ? 'Other Spot' : 'Home';
    const fullAddress = `${placeLabel}: ${houseFlatNo ? houseFlatNo + ', ' : ''}${societyStreet || selectedLocality.landmark}, ${selectedLocality.name}, Bhavnagar`;

    const data = {
      bookingId,
      vehicleModel: selectedVehicle.name,
      packageName: selectedPackage.name,
      date: selectedDate,
      slot: selectedSlot,
      placeType,
      locality: selectedLocality.name,
      address: fullAddress,
      lat: doorstepCoords.lat,
      lng: doorstepCoords.lng,
      phone: phone || '+91 98XXX XXXXX',
      estimatedTotal
    };

    setBookingSuccessData(data);

    const link = createRoutineWhatsAppLink({
      vehicleModel: data.vehicleModel,
      packageName: data.packageName,
      date: data.date,
      slot: data.slot,
      address: data.address,
      landmark: selectedLocality.landmark,
      estimatedTotal: data.estimatedTotal,
      bookingId: data.bookingId,
      lat: data.lat,
      lng: data.lng
    });

    window.open(link, '_blank');
  };

  return (
    <section id="services" style={{ padding: '64px 0', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 36px' }}>
          <span className="badge-amber" style={{ marginBottom: '10px' }}>
            {lang === 'gu' ? 'ડોરસ્ટેપ નિયમિત સર્વિસ' : 'Doorstep Routine Care'}
          </span>
          <h2 style={{ fontSize: 'clamp(26px, 3.8vw, 36px)', color: '#0f172a', marginBottom: '12px' }}>
            {lang === 'gu' ? 'ગેરેજ જવાની ઝંઝટ બંધ — મિકેનિક તમારા ઘરે' : 'Skip the Garage Line. We Service at Your Door.'}
          </h2>
          <p style={{ color: '#475569', fontSize: '15px' }}>
            {lang === 'gu'
              ? 'તમારી સામે સીલબંધ એન્જિન ઓઇલ કેન ખોલવામાં આવશે. ૧૮-પોઇન્ટ સંપૂર્ણ સેફ્ટી ચેક અને ૩૦ દિવસની સર્વિસ વોરંટી.'
              : 'Sealed branded engine oil opened in front of you. 18-point safety check, zero counterfeit spares, and a 30-day service warranty.'}
          </p>
        </div>

        {/* Booking Confirmation Pass Overlay if booked */}
        {bookingSuccessData ? (
          <div className="clean-card" style={{
            maxWidth: '640px',
            margin: '0 auto',
            padding: '32px 24px',
            textAlign: 'center',
            borderColor: '#86efac',
            boxShadow: '0 8px 30px rgba(16, 185, 129, 0.15)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#dcfce7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <CheckCircle2 size={32} color="#16a34a" />
            </div>

            <span className="badge-emerald" style={{ marginBottom: '8px' }}>
              BOOKING CONFIRMED & DISPATCHED
            </span>
            <h3 style={{ fontSize: '22px', color: '#0f172a', marginBottom: '6px' }}>
              Doorstep Service Pass Generated
            </h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '22px' }}>
              Booking Reference: <strong style={{ color: '#0f172a', fontFamily: 'var(--font-mono)' }}>#{bookingSuccessData.bookingId}</strong>
            </p>

            {/* Pass details summary */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-md)',
              padding: '18px',
              textAlign: 'left',
              marginBottom: '22px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '14px'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Vehicle</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{bookingSuccessData.vehicleModel}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Package</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#d97706' }}>{bookingSuccessData.packageName}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Time Slot</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{bookingSuccessData.date} • {bookingSuccessData.slot}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Place & Address</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{bookingSuccessData.address}</div>
              </div>
            </div>

            {/* GPS Link Card */}
            {bookingSuccessData.lat && (
              <div style={{
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '12.5px'
              }}>
                <span style={{ color: '#1e40af', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} color="#2563eb" />
                  <span>Doorstep GPS Coordinates Shared with Technician</span>
                </span>
                <a
                  href={`https://maps.google.com/?q=${bookingSuccessData.lat},${bookingSuccessData.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#1d4ed8', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                >
                  <span>View Pin</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setBookingSuccessData(null)}
                className="btn-secondary"
              >
                Book Another Service
              </button>
            </div>
          </div>
        ) : (
          /* Interactive Booking Form */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            alignItems: 'start'
          }}>
            {/* Left Column: Multi-Step Configuration Form */}
            <div className="clean-card" style={{ padding: '28px' }}>
              <form onSubmit={handleBookService}>
                {/* 1. Vehicle Selection */}
                <div style={{ marginBottom: '22px' }}>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    1. {lang === 'gu' ? 'તમારું વાહન પસંદ કરો:' : 'Select Your Vehicle:'}
                  </label>
                  <select
                    value={selectedVehicle.id}
                    onChange={(e) => {
                      const v = VEHICLE_MODELS.find(item => item.id === e.target.value);
                      if (v) setSelectedVehicle(v);
                    }}
                    style={{ width: '100%' }}
                  >
                    {VEHICLE_MODELS.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.type} • {v.recommendedOil})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Package Selection */}
                <div style={{ marginBottom: '22px' }}>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    2. {lang === 'gu' ? 'સર્વિસ પેકેજ પસંદ કરો:' : 'Select Service Package:'}
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {ROUTINE_PACKAGES.map(pkg => {
                      const isSelected = selectedPackage.id === pkg.id;
                      return (
                        <div
                          key={pkg.id}
                          onClick={() => setSelectedPackage(pkg)}
                          style={{
                            padding: '12px 14px',
                            borderRadius: 'var(--radius-md)',
                            border: isSelected ? '2px solid #d97706' : '1px solid #e2e8f0',
                            backgroundColor: isSelected ? '#fffbeb' : '#ffffff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: isSelected ? '#b45309' : '#0f172a' }}>
                              {pkg.name}
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                              {pkg.pointsCount} Points • {pkg.oilIncluded ? 'Includes Sealed Engine Oil' : 'Parts Extra on MRP'}
                            </div>
                          </div>
                          <span style={{ fontSize: '15px', fontWeight: 800, color: isSelected ? '#b45309' : '#0f172a' }}>
                            ₹{pkg.labourFee} <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>labour</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Date & Slot Selection */}
                <div style={{ marginBottom: '22px' }}>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    3. {lang === 'gu' ? 'તારીખ અને સમય સ્લોટ:' : 'Select Preferred Day & Slot:'}
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '10px' }}>
                    {['Today', 'Tomorrow', 'Day After'].map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => setSelectedDate(day)}
                        style={{
                          padding: '8px 10px',
                          borderRadius: 'var(--radius-md)',
                          border: selectedDate === day ? '1.5px solid #0f172a' : '1px solid #e2e8f0',
                          backgroundColor: selectedDate === day ? '#0f172a' : '#f8fafc',
                          color: selectedDate === day ? '#ffffff' : '#334155',
                          fontSize: '13px',
                          fontWeight: 700
                        }}
                      >
                        {day}
                      </button>
                    ))}
                  </div>

                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="Morning (9:30 AM – 12:30 PM)">Morning Slot (9:30 AM – 12:30 PM)</option>
                    <option value="Afternoon (1:30 PM – 4:30 PM)">Afternoon Slot (1:30 PM – 4:30 PM)</option>
                    <option value="Evening (4:30 PM – 7:00 PM)">Evening Slot (4:30 PM – 7:00 PM)</option>
                  </select>
                </div>

                {/* 4. Doorstep Location, Place Type & Exact Address */}
                <div style={{ marginBottom: '22px' }}>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    4. {lang === 'gu' ? 'સર્વિસનું સ્થળ (ઘર / ઓફિસ / સરનામું):' : 'Doorstep Service Location & Address:'}
                  </label>

                  {/* Interactive Doorstep Location & Place Type Picker */}
                  <div style={{ marginBottom: '12px' }}>
                    <DoorstepLocationPicker
                      initialLocality={selectedLocality}
                      onLocationChange={handleLocationPickerChange}
                      lang={lang}
                    />
                  </div>

                  {/* House / Flat No. & Building */}
                  <input
                    type="text"
                    required
                    placeholder="House/Flat No., Building / Apartment Name (e.g. Flat 302, Nilkanth Residency)"
                    value={houseFlatNo}
                    onChange={(e) => setHouseFlatNo(e.target.value)}
                    style={{ width: '100%', marginBottom: '8px' }}
                  />

                  {/* Society / Street / Landmark */}
                  <input
                    type="text"
                    placeholder="Society Name, Street / Landmark (e.g. Opp. Joggers Park, Waghawadi Road)"
                    value={societyStreet}
                    onChange={(e) => setSocietyStreet(e.target.value)}
                    style={{ width: '100%', marginBottom: '8px' }}
                  />

                  {/* Contact Phone */}
                  <input
                    type="tel"
                    required
                    placeholder="Your Contact Phone Number (e.g. 98250 XXXXX)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>

                <button
                  type="submit"
                  id="btn-confirm-doorstep-service"
                  className="btn-routine"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '15px' }}
                >
                  <Calendar size={18} />
                  <span>Book Doorstep Slot via WhatsApp</span>
                </button>
              </form>
            </div>

            {/* Right Column: Dynamic Bill & What's Included */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Itemized Price Preview Card */}
              <div className="clean-card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '17px', color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} color="#d97706" />
                  <span>Transparent Price Estimate</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                    <span>Package Labour ({selectedPackage.name})</span>
                    <strong style={{ color: '#0f172a' }}>₹{selectedPackage.labourFee}</strong>
                  </div>

                  {selectedPackage.id !== 'battery_replacement' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                      <span>Sealed Branded Oil ({selectedVehicle.recommendedOil})</span>
                      <strong style={{ color: '#0f172a' }}>₹{selectedVehicle.oilCost}</strong>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                    <span>Doorstep Visit & Tooling Travel</span>
                    <span style={{ color: '#059669', fontWeight: 700 }}>FREE (In Bhavnagar)</span>
                  </div>

                  <div style={{
                    borderTop: '1px dashed #cbd5e1',
                    paddingTop: '12px',
                    marginTop: '6px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '16px'
                  }}>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>Estimated Total:</span>
                    <strong style={{ fontSize: '20px', color: '#d97706', fontFamily: 'var(--font-mono)' }}>
                      ₹{estimatedTotal}
                    </strong>
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 12px',
                  marginTop: '16px',
                  fontSize: '12px',
                  color: '#64748b'
                }}>
                  🔒 Pay via Cash or UPI only AFTER inspection and test ride at your doorstep.
                </div>
              </div>

              {/* Checklist Items Included */}
              <div className="clean-card" style={{ padding: '24px' }}>
                <h4 style={{ fontSize: '15px', color: '#0f172a', marginBottom: '12px', fontWeight: 700 }}>
                  Included in {selectedPackage.name}:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedPackage.features.map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
                      <CheckCircle2 size={15} color="#059669" style={{ flexShrink: 0 }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
