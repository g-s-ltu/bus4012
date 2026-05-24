import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedSuccessCircle } from '../components/AnimatedCheckmark';
import { ThreeDButton } from '../components/ThreeDButton';

export const VerifiedPage: React.FC = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/payment');
  };

  return (
    <div className="max-w-sm mx-auto px-6 py-10 bg-white min-h-screen flex flex-col items-center justify-center">
      {/* Animated Checkmark */}
      <div className="mb-8">
        <AnimatedSuccessCircle size={120} duration={800} />
      </div>

      {/* Success Message */}
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
        Verified!
      </h1>

      <p className="text-gray-600 text-center mb-12">
        Your email has been successfully verified.
      </p>

      {/* Continue Button */}
      <ThreeDButton
        label="Continue profile setup"
        onClick={handleContinue}
        className="w-full"
      />
    </div>
  );
};