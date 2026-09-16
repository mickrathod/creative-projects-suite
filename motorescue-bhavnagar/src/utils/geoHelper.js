import { MECHANICS } from '../data/mechanics';

// Calculate true spherical distance using Haversine formula
export function calculateHaversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Find closest patrol mechanic based on coordinates
export function getClosestMechanic(customerLat, customerLng) {
  let closest = MECHANICS[0];
  let minDistance = Infinity;

  // Filter active mechanics
  const activePatrols = MECHANICS.filter(m => m.status !== 'OFF_DUTY');
  const pool = activePatrols.length > 0 ? activePatrols : MECHANICS;

  pool.forEach(m => {
    const dist = calculateHaversineKm(customerLat, customerLng, m.lat, m.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = m;
    }
  });

  // If user is testing outside Bhavnagar (>25km away), dynamically place a nearby patrol unit
  // so real OSRM street routing and road directions work on their actual local roads!
  if (minDistance > 25) {
    const localizedMechanic = {
      ...closest,
      id: 'mech-nearby-live',
      name: `${closest.name} (Live Patrol)`,
      currentLocation: 'Nearby Main Road',
      sector: 'Local Sector',
      lat: customerLat + 0.0115,
      lng: customerLng + 0.0095
    };
    const localDist = calculateHaversineKm(customerLat, customerLng, localizedMechanic.lat, localizedMechanic.lng);
    return { mechanic: localizedMechanic, directDistanceKm: localDist };
  }

  return { mechanic: closest, directDistanceKm: minDistance };
}
