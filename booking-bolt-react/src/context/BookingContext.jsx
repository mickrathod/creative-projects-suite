import React, { createContext, useContext, useState, useEffect } from 'react';
import { INDUSTRY_PRESETS, DEFAULT_AVAILABILITY, INITIAL_APPOINTMENTS } from '../utils/presets';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [activePresetKey, setActivePresetKey] = useState(() => {
    return localStorage.getItem('bb_preset') || 'cleaning';
  });

  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('bb_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INDUSTRY_PRESETS.cleaning;
  });

  const [availability, setAvailability] = useState(() => {
    try {
      const saved = localStorage.getItem('bb_availability');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_AVAILABILITY;
  });

  const [appointments, setAppointments] = useState(() => {
    try {
      const saved = localStorage.getItem('bb_appointments');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_APPOINTMENTS;
  });

  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => { localStorage.setItem('bb_preset', activePresetKey); }, [activePresetKey]);
  useEffect(() => { localStorage.setItem('bb_config', JSON.stringify(config)); }, [config]);
  useEffect(() => { localStorage.setItem('bb_availability', JSON.stringify(availability)); }, [availability]);
  useEffect(() => { localStorage.setItem('bb_appointments', JSON.stringify(appointments)); }, [appointments]);

  const selectPreset = (key) => {
    if (INDUSTRY_PRESETS[key]) {
      setActivePresetKey(key);
      setConfig({ ...INDUSTRY_PRESETS[key] });
    }
  };

  const updateConfig = (fields) => setConfig(prev => ({ ...prev, ...fields }));

  const updateService = (id, fields) => {
    setConfig(prev => ({
      ...prev,
      services: prev.services.map(s => s.id === id ? { ...s, ...fields } : s)
    }));
  };

  const addService = () => {
    setConfig(prev => ({
      ...prev,
      services: [...prev.services, {
        id: 's' + Date.now().toString(36),
        name: 'New Service',
        icon: '⭐',
        duration: prev.slotMinutes || 60,
        price: 0
      }]
    }));
  };

  const removeService = (id) => {
    setConfig(prev => ({ ...prev, services: prev.services.filter(s => s.id !== id) }));
  };

  const updateAvailability = (dow, fields) => {
    setAvailability(prev => ({ ...prev, [dow]: { ...prev[dow], ...fields } }));
  };

  const bookAppointment = (data) => {
    const svc = config.services.find(s => s.name === data.serviceName) || config.services[0];
    const appt = {
      id: 'appt-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      createdAt: new Date().toISOString(),
      status: config.depositEnabled ? 'Confirmed' : 'Pending',
      duration: svc?.duration || 60,
      price: svc?.price || 0,
      deposit: config.depositEnabled ? (config.depositAmount || 0) : 0,
      ...data
    };
    setAppointments(prev => [appt, ...prev]);
    return appt;
  };

  const setStatus = (id, status) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const deleteAppointment = (id) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  const simulateBooking = () => {
    const names = ['David Miller', 'Rachel Adams', 'Chloe Bennett', 'Jason Thorne', 'Olivia Taylor', 'Carlos Gomez'];
    const name = names[Math.floor(Math.random() * names.length)];
    const svc = config.services[Math.floor(Math.random() * config.services.length)];
    const d = new Date();
    d.setDate(d.getDate() + Math.floor(Math.random() * 6) + 1);
    d.setHours(9 + Math.floor(Math.random() * 7), Math.random() > 0.5 ? 30 : 0, 0, 0);
    return bookAppointment({
      start: d.toISOString(),
      customerName: name,
      phone: `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
      serviceName: svc.name,
      notes: 'Booked via website widget simulator.'
    });
  };

  const exportCSV = () => {
    if (appointments.length === 0) return false;
    const headers = ['ID', 'Booked On', 'Appointment', 'Customer', 'Phone', 'Email', 'Service', 'Duration (min)', 'Price', 'Deposit', 'Status', 'Notes'];
    const rows = appointments.map(a => [
      a.id,
      new Date(a.createdAt).toLocaleString(),
      new Date(a.start).toLocaleString(),
      `"${(a.customerName || '').replace(/"/g, '""')}"`,
      `"${(a.phone || '').replace(/"/g, '""')}"`,
      `"${(a.email || '').replace(/"/g, '""')}"`,
      `"${(a.serviceName || '').replace(/"/g, '""')}"`,
      a.duration || 0,
      a.price || 0,
      a.deposit || 0,
      a.status,
      `"${(a.notes || '').replace(/"/g, '""')}"`
    ]);
    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', `bookings_${config.businessName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  };

  // Metrics
  const now = Date.now();
  const upcoming = appointments.filter(a => new Date(a.start).getTime() >= now && a.status !== 'Cancelled');
  const totalUpcoming = upcoming.length;
  const bookedRevenue = upcoming.reduce((s, a) => s + (Number(a.price) || 0), 0);
  const depositsCollected = appointments
    .filter(a => a.status !== 'Cancelled')
    .reduce((s, a) => s + (Number(a.deposit) || 0), 0);
  const pendingCount = appointments.filter(a => a.status === 'Pending').length;

  return (
    <BookingContext.Provider value={{
      activePresetKey, config, availability, appointments,
      filter, search, setFilter, setSearch,
      totalUpcoming, bookedRevenue, depositsCollected, pendingCount,
      selectPreset, updateConfig, updateService, addService, removeService,
      updateAvailability, bookAppointment, setStatus, deleteAppointment,
      simulateBooking, exportCSV
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
}
