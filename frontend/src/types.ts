// Application State Types
export interface AppState {
  profile: ProfileForm;
  payment: PaymentForm;
}

export interface ProfileForm {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}

export interface PaymentForm {
  cardType: 'credit' | 'debit' | 'bank' | null;
  cardNumber: string;
  nameOnCard: string;
  expiryDate: string;
  cvv: string;
  agreedToTerms: boolean;
}

// Validation Types
export interface ValidationErrors {
  [key: string]: string;
}

export interface TouchedFields {
  [key: string]: boolean;
}

// Router State Types
export interface RegistrationResultState {
  success: boolean;
  userName?: string;
  reason?: string | null;
}

// API Response Types
export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

// Initial State
export const initialProfileForm: ProfileForm = {
  fullName: '',
  email: '',
  password: '',
  phone: '',
  address: '',
};

export const initialPaymentForm: PaymentForm = {
  cardType: null,
  cardNumber: '',
  nameOnCard: '',
  expiryDate: '',
  cvv: '',
  agreedToTerms: false,
};

export const initialAppState: AppState = {
  profile: initialProfileForm,
  payment: initialPaymentForm,
};