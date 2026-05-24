import React, { useState, useRef } from 'react';

interface FloatingInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  touched?: boolean;
  required?: boolean;
  className?: string;
  showPasswordToggle?: boolean;
}

export const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  touched = false,
  required = false,
  className = '',
  showPasswordToggle = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const inputType = showPasswordToggle && showPassword ? 'text' : type;
  const showError = touched && error;

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Input Container */}
      <div className="relative">
        <input
          ref={inputRef}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder=" "
          required={required}
          className={`
            peer
            w-full
            pt-6 pb-2 px-4
            text-base text-gray-900
            bg-white
            border-2 rounded-lg
            appearance-none
            focus:outline-none
            focus:ring-0
            transition-colors
            ${showError 
              ? 'border-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:border-green-600'
            }
          `}
        />
        
        {/* Floating Label */}
        <label
          onClick={handleFocus}
          className={`
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-gray-500
            pointer-events-none
            transition-all
            duration-200
            peer-focus:translate-y-[-1.5rem]
            peer-focus:scale-90
            peer-focus:text-primary-600
            peer-[:not(:placeholder-shown)]:translate-y-[-1.5rem]
            peer-[:not(:placeholder-shown)]:scale-90
            peer-[:not(:placeholder-shown)]:text-gray-700
            ${showError ? 'peer-focus:text-red-500' : ''}
          `}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {/* Password Toggle */}
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Error Message */}
      {showError && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};