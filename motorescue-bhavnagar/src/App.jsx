import React, { useState } from 'react';
import Navbar from './components/Navbar';
import EmergencyBanner from './components/EmergencyBanner';
import HeroSection from './components/HeroSection';
import ServiceBooking from './components/ServiceBooking';
import CostCalculator from './components/CostCalculator';
import ServiceHistory from './components/ServiceHistory';
import TrustSection from './components/TrustSection';
import Footer from './components/Footer';
import EmergencyModal from './components/EmergencyModal';
import LiveTracker from './components/LiveTracker';
import AdminPanel from './components/AdminPanel';
import GaragePanel from './components/GaragePanel';
import LoginModal from './components/LoginModal';
import { Zap } from 'lucide-react';

export default function App() {
  const [currentPortal, setCurrentPortal] = useState('customer'); // 'customer' | 'admin' | 'garage'

  // Authentication states
  const [adminUser, setAdminUser] = useState(null);
  const [garageUser, setGarageUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalRole, setLoginModalRole] = useState('admin');

  // Customer booking states
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [activeDispatch, setActiveDispatch] = useState(null);
  const [lang, setLang] = useState('en'); // 'en' or 'gu'
  const [activeSection, setActiveSection] = useState('hero');

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    if (currentPortal !== 'customer') {
      setCurrentPortal('customer');
    }

    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setTimeout(() => {
      const elem = document.getElementById(sectionId);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleOpenLogin = (role) => {
    setLoginModalRole(role);
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = ({ role, user }) => {
    if (role === 'admin') {
      setAdminUser(user);
      setCurrentPortal('admin');
    } else if (role === 'garage') {
      setGarageUser(user);
      setCurrentPortal('garage');
    }
  };

  const handleLogout = (role) => {
    if (role === 'admin') {
      setAdminUser(null);
    } else if (role === 'garage') {
      setGarageUser(null);
    }
    setCurrentPortal('customer');
  };

  const handleDispatchSuccess = (dispatchData) => {
    setIsEmergencyOpen(false);
    setActiveDispatch(dispatchData);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation - Clean Consumer Header */}
      <Navbar
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        currentPortal={currentPortal}
        onSwitchPortal={(portal) => {
          if (portal === 'admin' && !adminUser) {
            handleOpenLogin('admin');
          } else if (portal === 'garage' && !garageUser) {
            handleOpenLogin('garage');
          } else {
            setCurrentPortal(portal);
          }
        }}
        activeSection={activeSection}
        onNavigate={scrollToSection}
        lang={lang}
        onToggleLang={() => setLang(lang === 'en' ? 'gu' : 'en')}
      />

      {/* Main Content Area by Portal */}
      <main style={{ flex: 1 }}>
        {currentPortal === 'admin' && (
          <AdminPanel
            currentUser={adminUser}
            onSwitchPortal={setCurrentPortal}
            onLogout={() => handleLogout('admin')}
            lang={lang}
          />
        )}

        {currentPortal === 'garage' && (
          <GaragePanel
            currentGarageUser={garageUser}
            onSwitchPortal={setCurrentPortal}
            onLogout={() => handleLogout('garage')}
            lang={lang}
          />
        )}

        {currentPortal === 'customer' && (
          <>
            <EmergencyBanner lang={lang} />

            <HeroSection
              onOpenEmergency={() => setIsEmergencyOpen(true)}
              onOpenRoutine={() => scrollToSection('services')}
              lang={lang}
            />

            <ServiceBooking lang={lang} />

            <CostCalculator
              onOpenEmergency={() => setIsEmergencyOpen(true)}
              onOpenRoutine={() => scrollToSection('services')}
              lang={lang}
            />

            <ServiceHistory
              onOpenRoutine={() => scrollToSection('services')}
              lang={lang}
            />

            <TrustSection lang={lang} />

            <Footer
              onOpenEmergency={() => setIsEmergencyOpen(true)}
              onOpenRoutine={() => scrollToSection('services')}
              onOpenLogin={handleOpenLogin}
              onSwitchPortal={setCurrentPortal}
              adminUser={adminUser}
              garageUser={garageUser}
              lang={lang}
            />
          </>
        )}
      </main>

      {/* Authentication Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        defaultRole={loginModalRole}
        onLoginSuccess={handleLoginSuccess}
        lang={lang}
      />

      {/* Emergency SOS Modal */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        onDispatchSuccess={handleDispatchSuccess}
        lang={lang}
      />

      {/* Real-Time Mechanic Dispatch Tracker */}
      {activeDispatch && (
        <LiveTracker
          dispatchData={activeDispatch}
          onClose={() => setActiveDispatch(null)}
          lang={lang}
        />
      )}

      {/* Floating Emergency FAB on Customer View */}
      {currentPortal === 'customer' && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 800
        }}>
          <button
            onClick={() => setIsEmergencyOpen(true)}
            id="floating-emergency-fab"
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: '#dc2626',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(220, 38, 38, 0.4)',
              border: '2px solid #ffffff',
              cursor: 'pointer',
              animation: 'radar-pulse 2s infinite'
            }}
            title="Emergency Roadside SOS"
            aria-label="Emergency Roadside SOS"
          >
            <Zap size={22} color="#fff" />
          </button>
        </div>
      )}
    </div>
  );
}
