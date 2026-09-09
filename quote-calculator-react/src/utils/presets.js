export const INDUSTRY_PRESETS = {
  cleaning: {
    id: 'cleaning',
    name: 'Residential & Office Cleaning',
    icon: '🧹',
    businessName: 'SparklePro Cleaning',
    phone: '+1 (555) 234-5678',
    whatsappNumber: '15552345678',
    currency: '$',
    primaryColor: '#2563eb',
    discountText: '⚡ Claim 10% OFF if booked today!',
    discountPercent: 10,
    quantityLabel: 'Home Size (Square Feet)',
    quantityMin: 500,
    quantityMax: 4500,
    quantityStep: 250,
    quantityDefault: 1500,
    quantityRatePerUnit: 0.05,
    services: [
      { id: 'standard', name: 'Standard Clean', icon: '🧹', basePrice: 89, desc: 'Regular upkeep, dusting & vacuuming' },
      { id: 'deep', name: 'Deep Sanitization', icon: '✨', basePrice: 149, desc: 'Detailed corner scrubbing & baseboards' },
      { id: 'movein', name: 'Move In / Out', icon: '📦', basePrice: 199, desc: 'Full property turnover preparation' },
      { id: 'postreno', name: 'Post-Renovation', icon: '🔨', basePrice: 249, desc: 'Heavy dust & construction residue extraction' }
    ],
    addons: [
      { id: 'fridge', name: 'Inside Refrigerator Deep Clean', price: 35 },
      { id: 'oven', name: 'Oven Steam Scrub', price: 40 },
      { id: 'windows', name: 'Interior Windows (All)', price: 55 },
      { id: 'balcony', name: 'Balcony / Patio Power Wash', price: 45 }
    ]
  },
  roofing: {
    id: 'roofing',
    name: 'Roofing & Exterior Contractors',
    icon: '🏠',
    businessName: 'Apex Roofing & Remodeling',
    phone: '+1 (555) 987-6543',
    whatsappNumber: '15559876543',
    currency: '$',
    primaryColor: '#ea580c',
    discountText: '🔥 $250 Instant Voucher Applied',
    discountPercent: 8,
    quantityLabel: 'Roof / Property Area (Sq Ft)',
    quantityMin: 1000,
    quantityMax: 6000,
    quantityStep: 500,
    quantityDefault: 2000,
    quantityRatePerUnit: 1.80,
    services: [
      { id: 'shingle', name: 'Architectural Shingles', icon: '🏠', basePrice: 1200, desc: 'Durable, 30-yr wind rated shingles' },
      { id: 'metal', name: 'Standing Seam Metal', icon: '🛡️', basePrice: 2400, desc: '50-year commercial lifetime rating' },
      { id: 'flat', name: 'Flat Roof TPO Coating', icon: '🏢', basePrice: 1800, desc: 'Waterproof energy-reflective membrane' },
      { id: 'repair', name: 'Emergency Leak Repair', icon: '🔧', basePrice: 450, desc: 'Same-day patch, seal & flashing fix' }
    ],
    addons: [
      { id: 'gutters', name: 'Seamless Gutter Guard System', price: 350 },
      { id: 'insulation', name: 'Attic Thermal Insulation', price: 600 },
      { id: 'skylight', name: 'Skylight Reseal & Flashing', price: 200 }
    ]
  },
  auto: {
    id: 'auto',
    name: 'Auto Detailing & Mobile Wash',
    icon: '🚗',
    businessName: 'Precision Mobile Detailing',
    phone: '+1 (555) 333-4444',
    whatsappNumber: '15553334444',
    currency: '$',
    primaryColor: '#059669',
    discountText: '✨ FREE Hydrophobic Ceramic Spray with any Package',
    discountPercent: 15,
    quantityLabel: 'Vehicle Size Category (1: Sedan, 2: SUV, 3: Truck/Van)',
    quantityMin: 1,
    quantityMax: 3,
    quantityStep: 1,
    quantityDefault: 2,
    quantityRatePerUnit: 35,
    services: [
      { id: 'express', name: 'Express Wash & Gloss', icon: '🧼', basePrice: 65, desc: 'Foam hand wash, wheels & tire gloss' },
      { id: 'interior', name: 'Deep Interior Steam', icon: '💺', basePrice: 130, desc: 'Stain extraction, leather & vents' },
      { id: 'full', name: 'Signature Full Detail', icon: '⭐', basePrice: 195, desc: 'Complete bumper-to-bumper perfection' },
      { id: 'ceramic', name: 'Ceramic Shield Prep', icon: '💎', basePrice: 380, desc: 'Paint correction & 2-year ceramic coating' }
    ],
    addons: [
      { id: 'headlights', name: 'Headlight UV Restoration', price: 45 },
      { id: 'engine', name: 'Engine Bay Steam Degrease', price: 50 },
      { id: 'pet', name: 'Pet Hair & Odor Neutralizer', price: 40 }
    ]
  },
  webdesign: {
    id: 'webdesign',
    name: 'Web Design & Digital Agency',
    icon: '💻',
    businessName: 'Velocity Digital Agency',
    phone: '+1 (555) 777-8888',
    whatsappNumber: '15557778888',
    currency: '$',
    primaryColor: '#7c3aed',
    discountText: '🚀 Free Hosting & SSL for 1st Year included',
    discountPercent: 10,
    quantityLabel: 'Estimated Number of Custom Pages',
    quantityMin: 1,
    quantityMax: 20,
    quantityStep: 1,
    quantityDefault: 5,
    quantityRatePerUnit: 120,
    services: [
      { id: 'landing', name: 'High-Converting Landing Page', icon: '🎯', basePrice: 499, desc: 'Fast, responsive single-page lead funnel' },
      { id: 'business', name: 'Corporate Business Website', icon: '🌐', basePrice: 999, desc: 'Multi-page brand authority presence' },
      { id: 'ecommerce', name: 'Full E-Commerce Store', icon: '🛍️', basePrice: 1599, desc: 'Product catalog, Stripe/PayPal checkout' },
      { id: 'custom', name: 'Custom SaaS / Web Application', icon: '⚡', basePrice: 2499, desc: 'Authentication, database & API integrations' }
    ],
    addons: [
      { id: 'seo', name: 'Advanced Local SEO Setup', price: 250 },
      { id: 'copy', name: 'Professional Sales Copywriting', price: 300 },
      { id: 'speed', name: 'Ultra-Speed Core Web Vitals Optimization', price: 180 }
    ]
  }
};

export const INITIAL_LEADS = [
  {
    id: 'lead-101',
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    name: 'Sarah Jenkins',
    phone: '+1 (555) 432-1199',
    email: 'sarah.j@gmail.com',
    serviceName: 'Deep Sanitization',
    quantity: 2200,
    quantityLabel: 'Home Size',
    addons: ['Inside Refrigerator Deep Clean', 'Interior Windows (All)'],
    totalPrice: 246,
    status: 'New',
    notes: 'Needs cleaning completed by this Thursday before family arrives.'
  },
  {
    id: 'lead-102',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    name: 'Marcus Vance',
    phone: '+1 (555) 876-5432',
    email: 'marcus.vance@techcorp.io',
    serviceName: 'Move In / Out',
    quantity: 3000,
    quantityLabel: 'Home Size',
    addons: ['Oven Steam Scrub', 'Balcony / Patio Power Wash'],
    totalPrice: 324,
    status: 'Contacted',
    notes: 'Closing on house Wednesday afternoon.'
  },
  {
    id: 'lead-103',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    name: 'Elena Rostova',
    phone: '+1 (555) 345-6789',
    email: 'elena.rostova@outlook.com',
    serviceName: 'Standard Clean',
    quantity: 1500,
    quantityLabel: 'Home Size',
    addons: ['Interior Windows (All)'],
    totalPrice: 129,
    status: 'Converted',
    notes: 'Signed up for bi-weekly recurring cleaning!'
  }
];
