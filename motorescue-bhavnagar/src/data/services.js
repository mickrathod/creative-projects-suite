export const EMERGENCY_SERVICES = [
  {
    id: 'wont_start',
    name: "Bike Won't Start / Dead Battery",
    gujaratiName: "ગાડી ચાલુ નથી થતી / બેટરી બંધ",
    icon: 'BatteryCharging',
    dayFee: 149,
    nightFee: 349,
    estTime: '15-20 min',
    description: 'Jump-start using portable lithium booster, spark plug cleanup, fuse inspection & starting circuit diagnosis.',
    popular: true
  },
  {
    id: 'puncture',
    name: 'Flat Tyre / Tubeless Puncture',
    gujaratiName: 'ટાયર પંચર / હવા નીકળી ગઈ',
    icon: 'Disc',
    dayFee: 149,
    nightFee: 349,
    estTime: '15-20 min',
    description: 'On-site tubeless strip repair (up to 2 punctures) + high-pressure 12V portable electric tyre inflator top-up.',
    popular: true
  },
  {
    id: 'chain_cable',
    name: 'Chain Drop / Snapped Clutch Wire',
    gujaratiName: 'ચેન ઉતરી ગઈ / ક્લચ વાયર તૂટ્યો',
    icon: 'Wrench',
    dayFee: 179,
    nightFee: 379,
    estTime: '20-25 min',
    description: 'Chain link adjustment, lubrication, or emergency inner clutch/throttle cable replacement on the spot.',
    popular: false
  },
  {
    id: 'fuel_assist',
    name: 'Out of Fuel / Push Assistance',
    gujaratiName: 'પેટ્રોલ પૂરું થઈ ગયું / પુશ સહાય',
    icon: 'Fuel',
    dayFee: 149,
    nightFee: 349,
    estTime: '15-25 min',
    description: 'Assisted motorcycle tow/push escort directly to the nearest open 24-hr petrol pump safely & legally.',
    popular: true
  },
  {
    id: 'towing',
    name: 'Major Breakdown / Workshop Towing',
    gujaratiName: 'મોટું નુકસાન / ટોઇંગ સહાય',
    icon: 'Truck',
    dayFee: 499,
    nightFee: 699,
    estTime: '25-35 min',
    description: 'Flatbed or tow escort to our verified Bhavnagar partner garage for major engine/gearbox/chassis repair.',
    popular: false
  }
];

export const ROUTINE_PACKAGES = [
  {
    id: 'express_lube',
    name: 'Express Lube & 18-Point Health Check',
    subtitle: 'Best for routine 3,000 km oil change & basic tune-up',
    badge: 'Most Popular',
    labourFee: 299,
    duration: '35-45 mins',
    features: [
      'Genuine branded 4T engine oil replacement (Castrol/Motul opened in front of you)',
      '18-point safety check: brakes, horn, lights, tyres, battery voltage',
      'Front & rear brake shoe inspection & dust blow out',
      'Spark plug clean & gap check',
      'Drive chain cleaning, tightening & lubrication',
      'Doorstep technician travel within Bhavnagar included',
      'Digital service record + 30-day service warranty'
    ],
    recommendedFor: 'Honda Activa, Hero Splendor, TVS Jupiter, Bajaj Platina'
  },
  {
    id: 'comprehensive_care',
    name: 'Comprehensive Care & Full Tune-Up',
    subtitle: 'Deep maintenance for high-mileage bikes & performance cruisers',
    badge: 'Best Value',
    labourFee: 499,
    duration: '60-75 mins',
    features: [
      'Everything in Express Lube +',
      'Air filter cleaning or replacement fitting',
      'Carburettor drain / fuel line inspection',
      'Clutch & throttle cable free-play calibration & oiling',
      'Battery terminal anti-sulfation coating & load test',
      'Wheel bearing play & suspension bush inspection',
      'Waterless body polish & chrome wipe down',
      'Digital health certificate & 60-day service warranty'
    ],
    recommendedFor: 'Royal Enfield Classic/Hunter, Bajaj Pulsar, Yamaha FZ, KTM Duke'
  },
  {
    id: 'battery_replacement',
    name: 'Doorstep Battery Test & Replacement',
    subtitle: 'Free installation with new Exide / Amaron battery',
    badge: 'Quick Fix',
    labourFee: 199,
    duration: '20-30 mins',
    features: [
      'Digital multi-meter battery & alternator charging test',
      'Free doorstep fitment with purchase of Amaron/Exide battery',
      'Instant exchange discount on your old battery (₹200–₹400 buyback)',
      'Official manufacturer warranty card (36-48 months registered digitally)',
      'Anti-corrosion terminal grease application'
    ],
    recommendedFor: 'All Two-Wheelers & Cars with self-start trouble'
  },
  {
    id: 'car_inspection',
    name: 'Car Basic Doorstep Health Check',
    subtitle: 'Peace of mind before highway road trips (Saurashtra/Ahmedabad)',
    badge: 'Car Care',
    labourFee: 499,
    duration: '45-60 mins',
    features: [
      'Engine oil level, coolant density & brake fluid inspection',
      'Battery cranking voltage & alternator charging health',
      'Tyre pressure check & tread depth measurement',
      'Wiper blade check & washer fluid top-up',
      'Cabin AC airflow & blower check',
      'Under-bonnet visual inspection for rat bites / hose leaks'
    ],
    recommendedFor: 'Maruti Suzuki, Hyundai, Tata, Honda hatchbacks & sedans'
  }
];

export const VEHICLE_MODELS = [
  { id: 'activa', name: 'Honda Activa (3G/4G/5G/6G)', type: 'scooter', oilGrade: '10W-30 (800ml)', oilCost: 380 },
  { id: 'jupiter', name: 'TVS Jupiter / Ntorq', type: 'scooter', oilGrade: '10W-30 (800ml)', oilCost: 380 },
  { id: 'access', name: 'Suzuki Access 125', type: 'scooter', oilGrade: '10W-30 (800ml)', oilCost: 390 },
  { id: 'splendor', name: 'Hero Splendor / HF Deluxe', type: 'bike', oilGrade: '20W-40 (900ml)', oilCost: 360 },
  { id: 'pulsar', name: 'Bajaj Pulsar 125/150/NS', type: 'bike', oilGrade: '20W-50 (1100ml)', oilCost: 450 },
  { id: 're_classic', name: 'Royal Enfield Classic / Bullet 350', type: 'bike', oilGrade: '15W-50 Semi-Synth (2.5L)', oilCost: 950 },
  { id: 'shine', name: 'Honda CB Shine / SP125', type: 'bike', oilGrade: '10W-30 (900ml)', oilCost: 390 },
  { id: 'car_hatch', name: 'Maruti Swift / WagonR / Alto', type: 'car', oilGrade: '0W-20 / 5W-30 (3.2L)', oilCost: 1450 }
];
