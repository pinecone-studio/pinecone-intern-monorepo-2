import { SignupFormData, AuthError } from './types';

const validateRequiredFields = (formData: SignupFormData): AuthError | null => {
  if (!formData.fullName || !formData.userName || !formData.email) {
    return { message: 'Please fill in all required fields' };
  }
  return null;
};

const validateUsername = (username: string): AuthError | null => {
  if (username.length < 3) {
    return { message: 'Username must be at least 3 characters long' };
  }
  
  if (!/^[a-zA-Z0-9._]+$/.test(username)) {
    return { message: 'Username can only contain letters, numbers, dots, and underscores' };
  }
  
  return null;
};

const validateEmail = (email: string): AuthError | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { message: 'Please enter a valid email address' };
  }
  return null;
};

export const validateStep1 = (formData: SignupFormData): AuthError | null => {
  const requiredError = validateRequiredFields(formData);
  if (requiredError) return requiredError;
  
  const usernameError = validateUsername(formData.userName);
  if (usernameError) return usernameError;
  
  return validateEmail(formData.email);
};

// eslint-disable-next-line complexity
const validatePassword = (password: string, confirmPassword: string): AuthError | null => {
  if (!password || !confirmPassword) {
    return { message: 'Please fill in all password fields' };
  }
  
  if (password.length < 8) {
    return { message: 'Password must be at least 8 characters long' };
  }
  
  if (password !== confirmPassword) {
    return { message: 'Passwords do not match' };
  }
  
  return null;
};

const validatePhoneNumber = (phoneNumber: string): AuthError | null => {
  if (phoneNumber && !/^\+?[\d\s-()]+$/.test(phoneNumber)) {
    return { message: 'Please enter a valid phone number' };
  }
  return null;
};

export const validateStep2 = (formData: SignupFormData): AuthError | null => {
  const passwordError = validatePassword(formData.password, formData.confirmPassword);
  if (passwordError) return passwordError;
  
  return validatePhoneNumber(formData.phoneNumber);
};

export const getErrorMessage = (error: AuthError): string => {
  const errorMessages: Record<string, string> = {
    'USERNAME_EXISTS': 'Username already exists. Please choose a different one.',
    'EMAIL_EXISTS': 'Email already exists. Please use a different email or sign in.',
    'PHONE_EXISTS': 'Phone number already exists. Please use a different number.',
    'CONTACT_REQUIRED': 'Either email or phone number is required.',
    'USER_CREATION_FAILED': 'Failed to create account. Please try again.',
    'INVALID_CREDENTIALS': 'Invalid username/email or password',
    'LOGIN_FAILED': 'Login failed. Please try again.',
  };
  
  return (error.code && errorMessages[error.code]) || error.message;
};