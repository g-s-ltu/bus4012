import React from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AnimatedSuccessCircle } from '../components/AnimatedCheckmark';
import { ThreeDButton } from '../components/ThreeDButton';
import { RegistrationResultState } from '../types';

export const RegistrationResultPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as RegistrationResultState | null;

  // Redirect to login if no state
  if (!state) {
    return <Navigate to="/login" replace />;
  }

  const { success, userName, reason } = state;

  const handleGoHome = () => {
    navigate('/login');
  };

  const handleTryAgain = () => {
    navigate('/payment');
  };

  return (
    <div className="max-w-sm mx-auto px-6 py-10 bg-white min-h-screen flex flex-col items-center justify-center">
      {success ? (
        <>
          {/* Success State */}
          <div className="mb-8">
            <AnimatedSuccessCircle size={120} duration={800} />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
            Success!
          </h1>

          <div className="mb-8 text-center">
            <p className="text-gray-600 mb-4">
              Welcome to LocalLend!
            </p>
            
            {/* Welcome Card */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold">
                    {userName?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">{userName || 'User'}</p>
                  <p className="text-sm text-gray-600">Account created</p>
                </div>
              </div>
            </div>
          </div>

          <ThreeDButton
            label="Take me to Homepage"
            onClick={handleGoHome}
            className="w-full"
          />
        </>
      ) : (
        <>
          {/* Failure State */}
          <div className="mb-8">
            <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
            Registration Failed
          </h1>

          <div className="mb-8 text-center">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <p className="text-red-700">
                {reason || 'An unexpected error occurred. Please try again.'}
              </p>
            </div>
          </div>

          <ThreeDButton
            label="Try again"
            onClick={handleTryAgain}
            className="w-full"
          />
        </>
      )}
    </div>
  );
};