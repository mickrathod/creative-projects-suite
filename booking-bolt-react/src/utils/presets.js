// BookingBolt — industry presets + seed data

export const INDUSTRY_PRESETS = {
  cleaning: {
    id: 'cleaning',
    label: 'House Cleaning & Maid Service',
    icon: '🧹',
    businessName: 'SparklePro Cleaning',
    tagline: 'Book your cleaning in 30 seconds',
    phone: '+1 (555) 234-5678',
    accent: '#2563eb',
    depositEnabled: true,
    depositAmount: 25,
    slotMinutes: 120,
    services: [
      { id: 's1', name: 'Standard Clean', icon: '🧹', duration: 120, price: 89 },
      { id: 's2', name: 'Deep Clean', icon: '✨', duration: 180, price: 149 },
      { id: 's3', name: 'Move In / Move Out', icon: '📦', duration: 240, price: 219 }
    ]
  },
  dental: {
    id: 'dental',
    label: 'Dental & Orthodontics',
    icon: '🦷',
    businessName: 'Bright Smile Dental',
    tagline: 'Reserve your appointment online',
    phone: '+1 (555) 777-2211',
    accent: '#0891b2',
    depositEnabled: false,
    depositAmount: 0,
    slotMinutes: 30,
    services: [
      { id: 's1', name: 'New Patient Exam & X-Rays', icon: '🩻', duration: 60, price: 79 },
      { id: 's2', name: 'Routine Cleaning', icon: '🪥', duration: 45, price: 120 },
      { id: 's3', name: 'Teeth Whitening Consult', icon: '⭐', duration: 30, price: 0 },
      { id: 's4', name: 'Emergency Toothache Visit', icon: '🚨', duration: 30, price: 95 }
    ]
  },
  auto: {
    id: 'auto',
    label: 'Auto Detailing & Mobile Wash',
    icon: '🚗',
    businessName: 'Precision Mobile Detailing',
    tagline: 'Schedule your detail — we come to you',
    phone: '+1 (555) 333-4444',
    accent: '#059669',
    depositEnabled: true,
    depositAmount: 40,
    slotMinutes: 60,
    services: [
      { id: 's1', name: 'Express Wash & Gloss', icon: '🧼', duration: 60, price: 65 },
      { id: 's2', name: 'Full Interior Detail', icon: '💺', duration: 180, price: 160 },
      { id: 's3', name: 'Signature Full Detail', icon: '⭐', duration: 240, price: 240 },
      { id: 's4', name: 'Ceramic Coating', icon: '💎', duration: 360, price: 480 }
    ]
  },
  salon: {
    id: 'salon',
    label: 'Salon / Barber / Spa',
    icon: '💈',
    businessName: 'Fade & Co. Barbershop',
    tagline: 'Grab your chair',
    phone: '+1 (555) 909-1234',
    accent: '#7c3aed',
    depositEnabled: true,
    depositAmount: 15,
    slotMinutes: 30,
    services: [
      { id: 's1', name: 'Haircut', icon: '✂️', duration: 30, price: 35 },
      { id: 's2', name: 'Haircut + Beard', icon: '🧔', duration: 45, price: 50 },
      { id: 's3', name: 'Hot Towel Shave', icon: '🪒', duration: 30, price: 40 },
      { id: 's4', name: 'Kids Cut', icon: '🧒', duration: 30, price: 25 }
    ]
  }
};

// Default weekly availability: 0=Sun ... 6=Sat
export const DEFAULT_AVAILABILITY = {
  0: { open: false, start: '09:00', end: '17:00' },
  1: { open: true, start: '09:00', end: '18:00' },
  2: { open: true, start: '09:00', end: '18:00' },
  3: { open: true, start: '09:00', end: '18:00' },
  4: { open: true, start: '09:00', end: '18:00' },
  5: { open: true, start: '09:00', end: '17:00' },
  6: { open: true, start: '10:00', end: '15:00' }
};

function iso(daysFromNow, hour, min = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
}

export const INITIAL_APPOINTMENTS = [
  {
    id: 'appt-1001',
    createdAt: iso(-1, 8),
    start: iso(0, 10),
    customerName: 'Sarah Jenkins',
    phone: '+1 (555) 432-1199',
    email: 'sarah.j@gmail.com',
    serviceName: 'Deep Clean',
    duration: 180,
    price: 149,
    deposit: 25,
    status: 'Confirmed',
    notes: 'Gate code 4417. Two dogs, friendly.'
  },
  {
    id: 'appt-1002',
    createdAt: iso(-1, 14),
    start: iso(0, 14),
    customerName: 'Marcus Vance',
    phone: '+1 (555) 876-5432',
    email: 'marcus.vance@techcorp.io',
    serviceName: 'Standard Clean',
    duration: 120,
    price: 89,
    deposit: 25,
    status: 'Pending',
    notes: 'Prefers eco products.'
  },
  {
    id: 'appt-1003',
    createdAt: iso(-2, 9),
    start: iso(1, 11),
    customerName: 'Elena Rostova',
    phone: '+1 (555) 345-6789',
    email: 'elena.r@outlook.com',
    serviceName: 'Move In / Move Out',
    duration: 240,
    price: 219,
    deposit: 25,
    status: 'Confirmed',
    notes: 'Empty apartment, key under mat.'
  },
  {
    id: 'appt-1004',
    createdAt: iso(-3, 16),
    start: iso(-1, 13),
    customerName: 'Tom Bradshaw',
    phone: '+1 (555) 111-9080',
    email: 'tomb@gmail.com',
    serviceName: 'Standard Clean',
    duration: 120,
    price: 89,
    deposit: 25,
    status: 'Completed',
    notes: ''
  },
  {
    id: 'appt-1005',
    createdAt: iso(-1, 19),
    start: iso(2, 9),
    customerName: 'Priya Natarajan',
    phone: '+1 (555) 246-8100',
    email: 'priya.n@gmail.com',
    serviceName: 'Deep Clean',
    duration: 180,
    price: 149,
    deposit: 25,
    status: 'Confirmed',
    notes: 'Focus on kitchen and bathrooms.'
  }
];
