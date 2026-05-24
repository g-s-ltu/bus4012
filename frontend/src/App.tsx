import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppState, initialAppState } from './types';
import { LoginPage } from './pages/LoginPage';
import { LoginSuccessPage } from './pages/LoginSuccessPage';
import { LoginFailurePage } from './pages/LoginFailurePage';
import { RegisterPage } from './pages/RegisterPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { VerifiedPage } from './pages/VerifiedPage';
import { PaymentPage } from './pages/PaymentPage';
import { RegistrationResultPage } from './pages/RegistrationResultPage';

// LocalStorage keys
const STORAGE_KEY = 'locallend_app_state';
const PROFILE_STORAGE_KEY = 'locallend_profile';
const PAYMENT_STORAGE_KEY = 'locallend_payment';

function App() {
  // Initialize state from localStorage or use initial state
  const [appState, setAppState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading state from localStorage:', error);
    }
    return initialAppState;
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (error) {
      console.error('Error saving state to localStorage:', error);
    }
  }, [appState]);

  // Reset state function for fresh registration
  const resetState = () => {
    setAppState(initialAppState);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    localStorage.removeItem(PAYMENT_STORAGE_KEY);
  };

  // Update profile data
  const updateProfile = (profile: typeof appState.profile) => {
    setAppState(prev => ({ ...prev, profile }));
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  };

  // Update payment data
  const updatePayment = (payment: typeof appState.payment) => {
    setAppState(prev => ({ ...prev, payment }));
    localStorage.setItem(PAYMENT_STORAGE_KEY, JSON.stringify(payment));
  };

  // Callbacks for pages
  const handleRegisterStart = () => {
    resetState();
  };

  const handleRegisterComplete = (profile: typeof appState.profile) => {
    updateProfile(profile);
  };

  const handlePaymentComplete = (payment: typeof appState.payment) => {
    updatePayment(payment);
  };

  const handlePaymentSave = (payment: typeof appState.payment) => {
    updatePayment(payment);
  };

  return (
    <Router>
      {/* 
        ROUTER STATE MANAGEMENT:
        - App.tsx maintains centralized AppState
        - Props flow DOWN to child components
        - Callbacks flow UP from child components
        - Router state used for page-to-page communication
      */}
      <Routes>
        {/* Login Page - Resets state on signup link click */}
        <Route
          path="/login"
          element={
            <LoginPage
              onRegisterStart={handleRegisterStart}
            />
          }
        />

        {/* Login Success Page */}
        <Route
          path="/login-success"
          element={<LoginSuccessPage />}
        />

        {/* Login Failure Page */}
        <Route
          path="/login-failure"
          element={<LoginFailurePage />}
        />

        {/* Register Page - Receives saved profile, calls onComplete */}
        <Route
          path="/register"
          element={
            <RegisterPage
              saved={appState.profile}
              onComplete={handleRegisterComplete}
            />
          }
        />

        {/* Verify Email Page - Receives email via router state */}
        <Route
          path="/verify-email"
          element={
            <VerifyEmailPage
              email={appState.profile.email}
            />
          }
        />

        {/* Verified Page - No props needed */}
        <Route
          path="/verified"
          element={<VerifiedPage />}
        />

        {/* Payment Page - Receives saved payment + default card name */}
        <Route
          path="/payment"
          element={
            <PaymentPage
              saved={appState.payment}
              defaultCardName={appState.profile.fullName}
              onComplete={handlePaymentComplete}
              onSave={handlePaymentSave}
            />
          }
        />

        {/* Registration Result Page - Reads router state */}
        <Route
          path="/registration-result"
          element={<RegistrationResultPage />}
        />

        {/* Default redirect to login */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Catch all - redirect to login */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;