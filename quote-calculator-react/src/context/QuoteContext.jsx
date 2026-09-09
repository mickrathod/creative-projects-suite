import React, { createContext, useContext, useState, useEffect } from 'react';
import { INDUSTRY_PRESETS, INITIAL_LEADS } from '../utils/presets';

const QuoteContext = createContext(null);

export function QuoteProvider({ children }) {
  const [activePresetKey, setActivePresetKey] = useState(() => {
    return localStorage.getItem('iq_active_preset') || 'cleaning';
  });

  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('iq_custom_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INDUSTRY_PRESETS.cleaning;
  });

  const [leads, setLeads] = useState(() => {
    try {
      const saved = localStorage.getItem('iq_leads');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_LEADS;
  });

  const [crmFilter, setCrmFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Persist state
  useEffect(() => {
    localStorage.setItem('iq_active_preset', activePresetKey);
  }, [activePresetKey]);

  useEffect(() => {
    localStorage.setItem('iq_custom_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('iq_leads', JSON.stringify(leads));
  }, [leads]);

  // Actions
  const selectPreset = (presetKey) => {
    if (INDUSTRY_PRESETS[presetKey]) {
      setActivePresetKey(presetKey);
      setConfig({ ...INDUSTRY_PRESETS[presetKey] });
    }
  };

  const updateConfig = (newFields) => {
    setConfig(prev => ({ ...prev, ...newFields }));
  };

  const addLead = (leadData) => {
    const newLead = {
      id: 'lead-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      createdAt: new Date().toISOString(),
      status: 'New',
      ...leadData
    };
    setLeads(prev => [newLead, ...prev]);
    return newLead;
  };

  const updateLeadStatus = (id, newStatus) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
  };

  const deleteLead = (id) => {
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  const simulateLead = () => {
    const randomNames = [
      'David Miller', 'Rachel Adams', 'Alexander Wright', 'Chloe Bennett',
      'Jason Thorne', 'Emily Watson', 'Carlos Gomez', 'Olivia Taylor'
    ];
    const name = randomNames[Math.floor(Math.random() * randomNames.length)];
    const phone = `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const email = `${name.toLowerCase().replace(' ', '.')}@example.com`;
    const randomService = config.services[Math.floor(Math.random() * config.services.length)] || config.services[0];
    
    // Pick 1-2 random addons
    const randomAddons = config.addons
      ? config.addons.filter(() => Math.random() > 0.5).map(a => a.name)
      : [];
    
    const quantity = Math.round((config.quantityMin + Math.random() * (config.quantityMax - config.quantityMin)) / config.quantityStep) * config.quantityStep;
    
    let total = randomService.basePrice + Math.round(Math.max(0, quantity - config.quantityMin) * config.quantityRatePerUnit);
    randomAddons.forEach(aName => {
      const match = config.addons.find(a => a.name === aName);
      if (match) total += match.price;
    });
    const discount = Math.round(total * (config.discountPercent / 100));
    const finalPrice = total - discount;

    const sampleLead = {
      name,
      phone,
      email,
      serviceName: randomService.name,
      quantity,
      quantityLabel: config.quantityLabel,
      addons: randomAddons,
      totalPrice: finalPrice,
      notes: 'Generated via Instant Simulator. Inbound inquiry from website widget.'
    };

    return addLead(sampleLead);
  };

  const exportCSV = () => {
    if (leads.length === 0) return false;
    const headers = ['ID', 'Date', 'Customer Name', 'Phone', 'Email', 'Service', 'Quantity', 'Addons', 'Total Price', 'Status', 'Notes'];
    const rows = leads.map(l => [
      l.id,
      new Date(l.createdAt).toLocaleDateString() + ' ' + new Date(l.createdAt).toLocaleTimeString(),
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.serviceName || '').replace(/"/g, '""')}"`,
      l.quantity || 0,
      `"${(l.addons || []).join('; ').replace(/"/g, '""')}"`,
      l.totalPrice,
      l.status,
      `"${(l.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_${config.businessName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  };

  // Metrics
  const totalLeadsCount = leads.length;
  const pipelineValue = leads.reduce((sum, l) => sum + (Number(l.totalPrice) || 0), 0);
  const convertedCount = leads.filter(l => l.status === 'Converted').length;
  const conversionRate = totalLeadsCount > 0 ? ((convertedCount / totalLeadsCount) * 100).toFixed(1) : '28.4';

  return (
    <QuoteContext.Provider value={{
      activePresetKey,
      config,
      leads,
      crmFilter,
      searchQuery,
      totalLeadsCount,
      pipelineValue,
      convertedCount,
      conversionRate,
      setCrmFilter,
      setSearchQuery,
      selectPreset,
      updateConfig,
      addLead,
      updateLeadStatus,
      deleteLead,
      simulateLead,
      exportCSV
    }}>
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuote() {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error('useQuote must be used within a QuoteProvider');
  }
  return context;
}
