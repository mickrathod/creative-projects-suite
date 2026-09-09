export const INITIAL_BOX_CONFIG = {
  name: 'Hearth & Harvest Co.',
  icon: '📦',
  tagline: 'A Curated Seasonal Snack & Home Goods Box',
  priceMonthly: 34,
  checkoutUrl: 'https://checkout.stripe.com/pay/hearth-harvest-monthly',
  shipDay: 'First Monday of the Month'
};

export const INITIAL_BOX_THEMES = [
  {
    id: 'theme-01',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    title: 'Autumn Harvest',
    emoji: '🍂',
    color: '#7c3aed',
    itemCount: 7,
    status: 'Shipped'
  },
  {
    id: 'theme-02',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    title: 'Cozy Winter Nights',
    emoji: '❄️',
    color: '#3b82f6',
    itemCount: 8,
    status: 'In Production'
  },
  {
    id: 'theme-03',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    title: 'Spring Renewal',
    emoji: '🌸',
    color: '#10b981',
    itemCount: 6,
    status: 'Planning'
  }
];

export const INITIAL_SUBSCRIBERS = [
  {
    id: 'sub-01',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(),
    name: 'Rachel Kim',
    email: 'rachel.kim@gmail.com',
    plan: 'Monthly',
    status: 'Active',
    lifetimeValue: 204
  },
  {
    id: 'sub-02',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    name: 'Marcus Bell',
    email: 'marcus.bell@outlook.com',
    plan: 'Quarterly',
    status: 'Active',
    lifetimeValue: 96
  },
  {
    id: 'sub-03',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 200).toISOString(),
    name: 'Priya Natarajan',
    email: 'priya.n@yahoo.com',
    plan: 'Monthly',
    status: 'Paused',
    lifetimeValue: 340
  },
  {
    id: 'sub-04',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    name: 'Devon Cross',
    email: 'devon.cross@icloud.com',
    plan: 'Annual',
    status: 'Active',
    lifetimeValue: 384
  },
  {
    id: 'sub-05',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 400).toISOString(),
    name: 'Lena Ostrowski',
    email: 'lena.o@gmail.com',
    plan: 'Monthly',
    status: 'Cancelled',
    lifetimeValue: 170
  }
];
