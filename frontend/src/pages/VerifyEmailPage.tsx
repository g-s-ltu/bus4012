import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IconButton } from '../components/IconButton';
import { ThreeDButton } from '../components/ThreeDButton';

interface VerifyEmailPageProps {
  email: string;
}

const CORRECT_OTP = '1234';

export const VerifyEmailPage: React.FC<VerifyEmailPageProps> = ({ email }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailAddress = location.state?.email || email;

  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 4);
  }, []);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    
    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      setError('');

      // Focus the next empty input or the last one
      const nextEmptyIndex = newOtp.findIndex(val => !val);
      if (nextEmptyIndex !== -1) {
        inputRefs.current[nextEmptyIndex]?.focus();
      } else {
        inputRefs.current[3]?.focus();
      }
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    // Clear OTP
    setOtp(['', '', '', '']);
    setError('');
    inputRefs.current[0]?.focus();

    // Simulate resend delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsResending(false);
  };

  const handleSubmit = () => {
    const enteredOtp = otp.join('');
    
    if (enteredOtp.length !== 4) {
      setError('Please enter all 4 digits');
      return;
    }

    if (enteredOtp !== CORRECT_OTP) {
      setError('Incorrect verification code. Please try again.');
      return;
    }

    // Success - navigate to verified page
    navigate('/verified');
  };

  const isComplete = otp.every(digit => digit !== '');

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-sm mx-auto px-6 py-10 bg-white min-h-screen">
      {/* Back Button */}
      <div className="mb-6">
        <IconButton
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          }
          iconPosition="left"
          onClick={goBack}
          className="bg-transparent text-gray-600 hover:bg-gray-100"
        >
          Back
        </IconButton>
      </div>

      {/* Envelope Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
        Verify your email
      </h1>

      {/* Helper Text */}
      <p className="text-gray-600 text-center mb-8">
        We've sent a verification code to{' '}
        <span className="font-semibold text-gray-900">{emailAddress}</span>
      </p>

      {/* OTP Input Boxes */}
      <div className="flex justify-center gap-3 mb-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            className={`
              w-14 h-14
              text-center text-2xl font-semibold
              border-2 rounded-lg
              focus:outline-none focus:ring-0
              transition-colors
              ${error 
                ? 'border-red-500 focus:border-red-500' 
                : digit 
                  ? 'border-primary-600' 
                  : 'border-gray-300 focus:border-primary-600'
              }
            `}
          />
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-500 text-center mb-4">{error}</p>
      )}

      {/* Resend Code */}
      <div className="text-center mb-8">
        <button
          onClick={handleResend}
          disabled={isResending}
          className="text-primary-600 font-semibold hover:underline disabled:opacity-50"
        >
          {isResending ? 'Resending...' : 'Resend Code'}
        </button>
      </div>

      {/* Confirm Button */}
      <ThreeDButton
        label="Confirm Email"
        onClick={handleSubmit}
        disabled={!isComplete}
        className="w-full"
      />

      {/* Helper Info */}
      <p className="text-sm text-gray-500 text-center mt-6">
        Didn't receive the code? Check your spam folder or try resending.
      </p>
    </div>
  );
};