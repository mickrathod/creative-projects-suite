export const MECHANICS = [
  {
    id: 'mech-1',
    name: 'Ramesh Vaghela',
    gujaratiName: 'રમેશ વાઘેલા',
    role: 'Lead Master Mechanic',
    experience: '9 Years Experience',
    rating: 4.9,
    jobsCompleted: 642,
    phone: '+91 98250 87122',
    currentLocation: 'Waghawadi Road (Near Crest)',
    sector: 'Kaliyabid, Waghawadi, Sardarnagar',
    lat: 21.7584,
    lng: 72.1481,
    status: 'AVAILABLE', // AVAILABLE, ON_ROUTE, BUSY
    statusColor: '#10b981',
    bike: 'Hero Passion Pro (Mobile Tool Roll)',
    verified: true,
    policeVerified: true
  },
  {
    id: 'mech-2',
    name: 'Haresh Solanki',
    gujaratiName: 'હરેશ સોલંકી',
    role: 'Night Quick-Response Specialist',
    experience: '6 Years Experience',
    rating: 4.8,
    jobsCompleted: 318,
    phone: '+91 97241 45019',
    currentLocation: 'Chitra GIDC / Nari Chokdi Junction',
    sector: 'Chitra, Nari Chokdi, Subhashnagar, Ring Road',
    lat: 21.7892,
    lng: 72.1154,
    status: 'STANDBY',
    statusColor: '#f59e0b',
    bike: 'Honda Shine 125 (Lithium Booster + Puncture Kit)',
    verified: true,
    policeVerified: true
  },
  {
    id: 'mech-3',
    name: 'Paresh Parmar',
    gujaratiName: 'પરેશ પરમાર',
    role: 'Two-Wheeler Electrical & Battery Tech',
    experience: '7 Years Experience',
    rating: 4.9,
    jobsCompleted: 429,
    phone: '+91 99042 33180',
    currentLocation: 'Ghogha Circle (Near Dairy Road)',
    sector: 'Nilambag, Ghogha Circle, Rupani',
    lat: 21.7645,
    lng: 72.1519,
    status: 'ON_JOB',
    statusColor: '#3b82f6',
    bike: 'TVS Star City (Digital Multimeter & Spare Cables)',
    verified: true,
    policeVerified: true
  }
];

export const DISPATCHER_METRICS = {
  todayJobsCount: 8,
  emergencySosCount: 3,
  doorstepServiceCount: 5,
  avgResponseTimeMins: 14.2,
  todayGrossRevenue: 4890,
  todayLabourPayout: 2150,
  todayGrossProfit: 1840,
  activeAlertsCount: 1
};

export const INITIAL_DISPATCH_QUEUE = [
  {
    id: 'SOS-9481',
    time: '12 mins ago',
    type: 'EMERGENCY',
    customer: 'Nikhil Vyas',
    phone: '+91 94282 XXXXX',
    vehicle: 'Honda Activa 5G',
    locality: 'Nari Chokdi (Towards Rajkot Highway)',
    issue: "Bike Won't Start (Starter Relay Click)",
    fee: '₹349 (Night Call-Out)',
    status: 'DISPATCHED',
    assignedTo: 'Haresh Solanki',
    eta: '6 mins away'
  },
  {
    id: 'SRV-8204',
    time: '45 mins ago',
    type: 'DOORSTEP_ROUTINE',
    customer: 'Devang Shah',
    phone: '+91 98980 XXXXX',
    vehicle: 'Hero Splendor Plus',
    locality: 'Waghawadi Road (Opposite Joggers Park)',
    issue: 'Express Lube & 18-Point Health Check',
    fee: '₹729 Total',
    status: 'COMPLETED',
    assignedTo: 'Ramesh Vaghela',
    eta: 'Done & Invoiced'
  }
];
