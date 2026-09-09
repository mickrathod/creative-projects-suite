export const INITIAL_REVIEW_CONFIG = {
  name: 'Luxe Dental & Aesthetic Spa',
  icon: '🦷',
  googleUrl: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4',
  whatsapp: '15552345678',
  tagline: 'Premier Cosmetic & General Dentistry',
  address: '450 Lexington Ave, New York, NY 10017',
  accentColor: '#6366f1'
};

export const INITIAL_FEEDBACK_ITEMS = [
  {
    id: 'fb-01',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    rating: 2,
    customerName: 'Robert Henderson',
    contact: '+1 (555) 234-9988',
    feedback: 'The appointment started 35 minutes late with no update from the front desk reception. The doctor was gentle though.',
    status: 'Pending',
    resolved: false
  },
  {
    id: 'fb-02',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    rating: 3,
    customerName: 'Amanda Cruz',
    contact: 'amanda.cruz@yahoo.com',
    feedback: 'Great treatment result, but billing was higher than the initial phone estimate. Would appreciate clearer price breakdowns upfront.',
    status: 'Resolved',
    resolved: true
  },
  {
    id: 'fb-03',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    rating: 1,
    customerName: 'David Miller',
    contact: '+1 (555) 777-1234',
    feedback: 'Very cold receptionist and parking was impossible to find. Ruined my morning.',
    status: 'Contacted',
    resolved: false
  }
];
