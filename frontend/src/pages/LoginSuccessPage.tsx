import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ThreeDButton } from '../components/ThreeDButton';

export const LoginSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  const handleReturnToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="max-w-sm mx-auto px-6 py-10 bg-white min-h-screen flex flex-col items-center justify-center">
      {/* Green Checkmark Icon */}
      <div className="mb-6">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* Success Message */}
      <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">
        User validated
      </h1>

      {/* Return to Login Button */}
      <ThreeDButton
        label="Return to Login"
        onClick={handleReturnToLogin}
        className="w-full"
      />
    </div>
  );
};