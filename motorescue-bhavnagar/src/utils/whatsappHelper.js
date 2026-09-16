import { WHATSAPP_NUMBER } from '../data/localities';

export function createEmergencyWhatsAppLink({ locality, customLandmark, vehicleModel, issueName, isNightTime, bookingId, lat, lng, roadDistanceKm, etaMins, mechanicName }) {
  const timeLabel = isNightTime ? '🌙 Night Emergency (9 PM - 1 AM)' : '☀️ Daytime Roadside Assistance';
  const feeLabel = isNightTime ? '₹349 (Night Visit Fee)' : '₹149 (Day Visit Fee)';

  const mapsPin = lat && lng ? `https://maps.google.com/?q=${lat.toFixed(6)},${lng.toFixed(6)}` : `https://maps.google.com/?q=21.7645,72.1519`;
  const navLink = lat && lng ? `https://www.google.com/maps/dir/?api=1&destination=${lat.toFixed(6)},${lng.toFixed(6)}&travelmode=driving` : '';

  const distancePart = roadDistanceKm ? `\n*🛣️ Real Road Distance:* ${roadDistanceKm} km` : '';
  const etaPart = etaMins ? `\n*⏱️ Real Calculated ETA:* ~${etaMins} mins` : '';
  const mechPart = mechanicName ? `\n*🛵 Assigned Mobile Patrol:* ${mechanicName}` : '';
  const navPart = navLink ? `\n*🧭 Start Turn-by-Turn Driving Navigation:*\n${navLink}` : '';

  const text = 
`🚨 *MOMENTARY VEHICLE BREAKDOWN ALERT* 🚨
Booking Reference: #${bookingId || 'SOS-' + Math.floor(1000 + Math.random() * 9000)}

*Location:* ${locality?.name || 'Customer Spot'}
*Exact Landmark:* ${customLandmark || locality?.landmark || 'Location Pin'}
*GPS Coordinates:* ${lat ? lat.toFixed(6) : '21.7645'}° N, ${lng ? lng.toFixed(6) : '72.1519'}° E${distancePart}${etaPart}${mechPart}
*🗺️ Live Google Maps Pin:*
${mapsPin}${navPart}

*Vehicle:* ${vehicleModel || 'Two-Wheeler'}
*Problem:* ${issueName}
*Shift:* ${timeLabel}
*Estimated Visit Fee:* ${feeLabel}

_Please dispatch the mobile mechanic immediately using the live GPS navigation link above._`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function createRoutineWhatsAppLink({ vehicleModel, packageName, date, slot, address, landmark, estimatedTotal, bookingId, lat, lng }) {
  const mapPart = lat && lng ? `\n*🗺️ Doorstep GPS Pin:* https://maps.google.com/?q=${lat.toFixed(5)},${lng.toFixed(5)}` : '';

  const text = 
`🛵 *MOTORESCUE DOORSTEP SERVICE BOOKING*
Booking Ref: #${bookingId || 'BOOK-' + Math.floor(1000 + Math.random() * 9000)}

*Vehicle:* ${vehicleModel}
*Service Package:* ${packageName}
*Preferred Slot:* ${date} (${slot})
*Address:* ${address}
*Landmark:* ${landmark || 'Bhavnagar'}${mapPart}
*Estimated Bill:* ₹${estimatedTotal}

_Hello MotoRescue Team! Please confirm my doorstep service appointment._`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
