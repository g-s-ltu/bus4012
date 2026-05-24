import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormSection } from '../components/FormSection';
import { FloatingInput } from '../components/FloatingInput';
import { IconButton } from '../components/IconButton';
import { ThreeDButton } from '../components/ThreeDButton';
import { PaymentForm, ValidationErrors, TouchedFields } from '../types';

interface PaymentPageProps {
  saved: PaymentForm;
  defaultCardName: string;
  onComplete: (data: PaymentForm) => void;
  onSave: (data: PaymentForm) => void;
}

// Validation functions
const validateCardNumber = (cardNumber: string): string => {
  if (!cardNumber) return 'Card number is required';
  const cleaned = cardNumber.replace(/\s/g, '');
  if (!/^\d{16}$/.test(cleaned)) return 'Card number must be exactly 16 digits';
  const firstDigit = parseInt(cleaned[0]);
  if (firstDigit < 2 || firstDigit > 6) return 'Card number must start with 2-6';
  return '';
};

const validateNameOnCard = (name: string): string => {
  if (!name) return 'Name on card is required';
  if (name.length < 2) return 'Please enter a valid name';
  return '';
};

const validateExpiryDate = (expiry: string): string => {
  if (!expiry) return 'Expiry date is required';
  
  if (!/^\d{2}\/\d{2}$/.test(expiry)) return 'Use MM/YY format';
  
  const [monthStr, yearStr] = expiry.split('/');
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10);
  
  if (month < 1 || month > 12) return 'Invalid month';
  
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;
  
  if (year < currentYear || year > currentYear + 5) return 'Card must be valid within 5 years';
  
  if (year === currentYear && month < currentMonth) return 'Card has expired';
  
  return '';
};

const validateCvv = (cvv: string): string => {
  if (!cvv) return 'CVV is required';
  if (!/^\d{3}$/.test(cvv)) return 'CVV must be exactly 3 digits';
  return '';
};

const validateTerms = (agreed: boolean): string => {
  if (!agreed) return 'You must agree to the terms';
  return '';
};

export const PaymentPage: React.FC<PaymentPageProps> = ({
  saved,
  defaultCardName,
  onComplete,
  onSave,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PaymentForm>({
    ...saved,
    cardType: 'credit',
    nameOnCard: saved.nameOnCard || defaultCardName,
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field: keyof PaymentForm, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatCardNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '').slice(0, 16);
    return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiryDate = (value: string): string => {
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    return cleaned;
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    updateField('cardNumber', formatted.replace(/\s/g, ''));
  };

  const handleExpiryChange = (value: string) => {
    const formatted = formatExpiryDate(value);
    updateField('expiryDate', formatted);
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    let error = '';
    switch (field) {
      case 'cardNumber':
        error = validateCardNumber(formData.cardNumber);
        break;
      case 'nameOnCard':
        error = validateNameOnCard(formData.nameOnCard);
        break;
      case 'expiryDate':
        error = validateExpiryDate(formData.expiryDate);
        break;
      case 'cvv':
        error = validateCvv(formData.cvv);
        break;
      case 'agreedToTerms':
        error = validateTerms(formData.agreedToTerms);
        break;
    }
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const isFormValid = (): boolean => {
    return (
      !validateCardNumber(formData.cardNumber) &&
      !validateNameOnCard(formData.nameOnCard) &&
      !validateExpiryDate(formData.expiryDate) &&
      !validateCvv(formData.cvv) &&
      !validateTerms(formData.agreedToTerms) &&
      formData.cardType !== null
    );
  };

  const handleSubmit = async () => {
    const newErrors: ValidationErrors = {
      cardNumber: validateCardNumber(formData.cardNumber),
      nameOnCard: validateNameOnCard(formData.nameOnCard),
      expiryDate: validateExpiryDate(formData.expiryDate),
      cvv: validateCvv(formData.cvv),
      agreedToTerms: validateTerms(formData.agreedToTerms),
    };

    setErrors(newErrors);
    setTouched({
      cardNumber: true,
      nameOnCard: true,
      expiryDate: true,
      cvv: true,
      agreedToTerms: true,
    });

    const hasErrors = Object.values(newErrors).some(error => error !== '');
    if (hasErrors || !formData.cardType) return;

    setIsLoading(true);

    try {
      onSave(formData);

      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const response = await fetch(`${apiBaseUrl}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile: JSON.parse(localStorage.getItem('locallend_profile') || '{}'),
          payment: formData,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        onComplete(formData);
        navigate('/registration-result', {
          state: {
            success: true,
            userName: JSON.parse(localStorage.getItem('locallend_profile') || '{}').fullName,
            reason: null,
          },
        });
      } else {
        navigate('/registration-result', {
          state: {
            success: false,
            reason: result.message || 'Registration failed. Please try again.',
          },
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      navigate('/registration-result', {
        state: {
          success: false,
          reason: 'Network error. Please check your connection and try again.',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-sm mx-auto px-6 py-10 bg-white min-h-screen">
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

      <FormSection
        title="Card Details"
        subtitle="Enter your card information"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        }
      >
        <div className="space-y-4">
          <FloatingInput
            label="Card Number"
            type="text"
            value={formatCardNumber(formData.cardNumber)}
            onChange={handleCardNumberChange}
            onBlur={() => handleBlur('cardNumber')}
            error={errors.cardNumber}
            touched={touched.cardNumber}
            required
          />

          <FloatingInput
            label="Name on Card"
            value={formData.nameOnCard}
            onChange={(value) => updateField('nameOnCard', value)}
            onBlur={() => handleBlur('nameOnCard')}
            error={errors.nameOnCard}
            touched={touched.nameOnCard}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <FloatingInput
              label="Expiry Date"
              type="text"
              value={formData.expiryDate}
              onChange={handleExpiryChange}
              onBlur={() => handleBlur('expiryDate')}
              error={errors.expiryDate}
              touched={touched.expiryDate}
              required
            />

            <FloatingInput
              label="CVV"
              type="password"
              value={formData.cvv}
              onChange={(value) => updateField('cvv', value.slice(0, 3))}
              onBlur={() => handleBlur('cvv')}
              error={errors.cvv}
              touched={touched.cvv}
              required
              showPasswordToggle
            />
          </div>
        </div>
      </FormSection>

      <div className="mt-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.agreedToTerms}
            onChange={(e) => updateField('agreedToTerms', e.target.checked)}
            onBlur={() => handleBlur('agreedToTerms')}
            className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <span className="text-sm text-gray-600">
            I agree to the{' '}
            <span className="text-gray-900 font-medium">Terms & Conditions</span>
            {' '}and{' '}
            <span className="text-gray-900 font-medium">Privacy Policy</span>
          </span>
        </label>
        {touched.agreedToTerms && errors.agreedToTerms && (
          <p className="text-sm text-red-500 mt-1">{errors.agreedToTerms}</p>
        )}
      </div>

      <ThreeDButton
        label="Securely link & Create account"
        onClick={handleSubmit}
        disabled={!isFormValid()}
        loading={isLoading}
        className="w-full mt-6"
      />
    </div>
  );
};