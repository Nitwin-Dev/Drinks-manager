import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginScreen from './components/LoginScreen';
import ScannerScreen from './components/ScannerScreen';
import GuestScreen from './components/GuestScreen';
import './App.css';

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('scanner'); // 'scanner' | 'guest'
  const [selectedQrCode, setSelectedQrCode] = useState(null);

  const handleGuestScanned = (qrCode) => {
    setSelectedQrCode(qrCode);
    setCurrentScreen('guest');
  };

  const handleBackToScanner = () => {
    setCurrentScreen('scanner');
    setSelectedQrCode(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <>
      {currentScreen === 'scanner' && (
        <ScannerScreen onGuestScanned={handleGuestScanned} />
      )}
      {currentScreen === 'guest' && selectedQrCode && (
        <GuestScreen 
          qrCode={selectedQrCode} 
          onBack={handleBackToScanner} 
        />
      )}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

