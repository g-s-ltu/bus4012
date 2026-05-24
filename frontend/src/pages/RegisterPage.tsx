import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormSection } from '../components/FormSection';
import { FloatingInput } from '../components/FloatingInput';
import { IconButton } from '../components/IconButton';
import { ThreeDButton } from '../components/ThreeDButton';
import { ProfileForm, ValidationErrors, TouchedFields } from '../types';

interface RegisterPageProps {
  saved: ProfileForm;
  onComplete: (data: ProfileForm) => void;
}

// Validation functions
const validateEmail = (email: string): string => {
  if (!email) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return '';
};

const validatePassword = (password: string): string => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must contain a lowercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain a number';
  return '';
};

const validateConfirmPassword = (password: string, confirmPassword: string): string => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return '';
};

const validatePhone = (phone: string): string => {
  if (!phone) return 'Phone number is required';
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  if (!phoneRegex.test(phone)) return 'Please enter a valid phone number';
  return '';
};

const validateAddress = (address: string): string => {
  if (!address) return 'Address is required';
  if (address.length < 10) return 'Please enter a complete address';
  return '';
};

const validateFullName = (fullName: string): string => {
  if (!fullName) return 'Full name is required';
  if (fullName.length < 2) return 'Name must be at least 2 characters';
  return '';
};

// Password requirements checklist
const passwordRequirements = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
];

export const RegisterPage: React.FC<RegisterPageProps> = ({ saved, onComplete }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProfileForm>(saved);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});
  

  const updateField = (field: keyof ProfileForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error on change
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate on blur
    let error = '';
    switch (field) {
      case 'fullName':
        error = validateFullName(formData.fullName);
        break;
      case 'email':
        error = validateEmail(formData.email);
        break;
      case 'password':
        error = validatePassword(formData.password);
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(formData.password, confirmPassword);
        break;
      case 'phone':
        error = validatePhone(formData.phone);
        break;
      case 'address':
        error = validateAddress(formData.address);
        break;
    }
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const isFormValid = (): boolean => {
    return (
      !validateFullName(formData.fullName) &&
      !validateEmail(formData.email) &&
      !validatePassword(formData.password) &&
      !validateConfirmPassword(formData.password, confirmPassword) &&
      !validatePhone(formData.phone) &&
      !validateAddress(formData.address)
    );
  };

  const handleSubmit = () => {
    // Validate all fields
    const newErrors: ValidationErrors = {
      fullName: validateFullName(formData.fullName),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.password, confirmPassword),
      phone: validatePhone(formData.phone),
      address: validateAddress(formData.address),
    };

    setErrors(newErrors);
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
      phone: true,
      address: true,
    });

    // Check if form is valid
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    if (hasErrors) return;

    onComplete(formData);
    navigate('/verify-email', { state: { email: formData.email } });
  };

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

      {/* Avatar Placeholder */}
      <div className="flex justify-center mb-8">
        <div 
          className="relative w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer group"
        >
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {/* Pencil overlay on hover */}
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <FormSection
        title="Create Account"
        subtitle="Join LocalLend today"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        }
      >
        <div className="space-y-4">
          {/* Full Name */}
          <FloatingInput
            label="Full Name"
            value={formData.fullName}
            onChange={(value) => updateField('fullName', value)}
            onBlur={() => handleBlur('fullName')}
            error={errors.fullName}
            touched={touched.fullName}
            required
          />

          {/* Email */}
          <FloatingInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={(value) => updateField('email', value)}
            onBlur={() => handleBlur('email')}
            error={errors.email}
            touched={touched.email}
            required
          />

          {/* Password */}
          <FloatingInput
            label="Password"
            type="password"
            value={formData.password}
            onChange={(value) => updateField('password', value)}
            onBlur={() => handleBlur('password')}
            error={errors.password}
            touched={touched.password}
            required
            showPasswordToggle
          />

          {/* Password Requirements Checklist */}
          {formData.password && (
            <div className="mt-2 space-y-1">
              {passwordRequirements.map((req, index) => (
                <div key={index} className="flex items-center text-sm">
                  <span className={`mr-2 ${req.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                    {req.test(formData.password) ? '✓' : '○'}
                  </span>
                  <span className={req.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Confirm Password */}
          <FloatingInput
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            onBlur={() => handleBlur('confirmPassword')}
            error={errors.confirmPassword}
            touched={touched.confirmPassword}
            required
            showPasswordToggle
          />

          {/* Phone */}
          <FloatingInput
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(value) => updateField('phone', value)}
            onBlur={() => handleBlur('phone')}
            error={errors.phone}
            touched={touched.phone}
            required
          />

          {/* Address */}
          <FloatingInput
            label="Address"
            value={formData.address}
            onChange={(value) => updateField('address', value)}
            onBlur={() => handleBlur('address')}
            error={errors.address}
            touched={touched.address}
            required
          />
        </div>
      </FormSection>

      {/* Submit Button */}
      <ThreeDButton
        label="Verify Email"
        onClick={handleSubmit}
        disabled={!isFormValid()}
        className="w-full mt-6"
      />

      {/* Footer Links */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>By signing up, you agree to our</p>
        <p>
          <span className="text-gray-700">Terms of Service</span>
          {' and '}
          <span className="text-gray-700">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};