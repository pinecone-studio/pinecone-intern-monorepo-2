import { validateStep1, validateStep2, getErrorMessage } from '../../../src/components/auth/validation';
import { SignupFormData, Gender } from '../../../src/components/auth/types';

describe('Validation Functions', () => {
  const baseFormData: SignupFormData = {
    fullName: 'John Doe',
    userName: 'johndoe',
    email: 'john@example.com',
    phoneNumber: '+1234567890',
    password: 'password123',
    confirmPassword: 'password123',
    gender: Gender.MALE,
    bio: 'Test bio'
  };

  describe('validateStep1', () => {
    it('should return null for valid step 1 data', () => {
      expect(validateStep1(baseFormData)).toBeNull();
    });

    it('should return error for missing required fields', () => {
      expect(validateStep1({ ...baseFormData, fullName: '' })?.message).toBe('Please fill in all required fields');
      expect(validateStep1({ ...baseFormData, userName: '' })?.message).toBe('Please fill in all required fields');
      expect(validateStep1({ ...baseFormData, email: '' })?.message).toBe('Please fill in all required fields');
    });

    it('should validate username requirements', () => {
      expect(validateStep1({ ...baseFormData, userName: 'ab' })?.message).toBe('Username must be at least 3 characters long');
      expect(validateStep1({ ...baseFormData, userName: 'john@doe' })?.message).toBe('Username can only contain letters, numbers, dots, and underscores');
      expect(validateStep1({ ...baseFormData, userName: 'john_doe.123' })).toBeNull();
    });

    it('should validate email format', () => {
      expect(validateStep1({ ...baseFormData, email: 'invalid-email' })?.message).toBe('Please enter a valid email address');
      expect(validateStep1({ ...baseFormData, email: 'john.doe.com' })?.message).toBe('Please enter a valid email address');
      expect(validateStep1({ ...baseFormData, email: 'john@' })?.message).toBe('Please enter a valid email address');
    });
  });

  describe('validateStep2', () => {
    it('should return null for valid step 2 data', () => {
      expect(validateStep2(baseFormData)).toBeNull();
    });

    it('should validate password requirements', () => {
      expect(validateStep2({ ...baseFormData, password: '' })?.message).toBe('Please fill in all password fields');
      expect(validateStep2({ ...baseFormData, confirmPassword: '' })?.message).toBe('Please fill in all password fields');
      expect(validateStep2({ ...baseFormData, password: '1234567', confirmPassword: '1234567' })?.message).toBe('Password must be at least 8 characters long');
      expect(validateStep2({ ...baseFormData, password: 'password123', confirmPassword: 'password456' })?.message).toBe('Passwords do not match');
    });

    it('should validate phone number format', () => {
      expect(validateStep2({ ...baseFormData, phoneNumber: 'invalid-phone' })?.message).toBe('Please enter a valid phone number');
      expect(validateStep2({ ...baseFormData, phoneNumber: '' })).toBeNull();
      
      const validPhoneNumbers = ['+1234567890', '123-456-7890', '(123) 456-7890', '123 456 7890', '+1 (123) 456-7890'];
      validPhoneNumbers.forEach(phoneNumber => {
        expect(validateStep2({ ...baseFormData, phoneNumber })).toBeNull();
      });
    });
  });

  describe('getErrorMessage', () => {
    it('should return custom messages for known error codes', () => {
      expect(getErrorMessage({ message: 'Generic', code: 'USERNAME_EXISTS' })).toBe('Username already exists. Please choose a different one.');
      expect(getErrorMessage({ message: 'Generic', code: 'EMAIL_EXISTS' })).toBe('Email already exists. Please use a different email or sign in.');
      expect(getErrorMessage({ message: 'Generic', code: 'PHONE_EXISTS' })).toBe('Phone number already exists. Please use a different number.');
      expect(getErrorMessage({ message: 'Generic', code: 'CONTACT_REQUIRED' })).toBe('Either email or phone number is required.');
      expect(getErrorMessage({ message: 'Generic', code: 'USER_CREATION_FAILED' })).toBe('Failed to create account. Please try again.');
      expect(getErrorMessage({ message: 'Generic', code: 'INVALID_CREDENTIALS' })).toBe('Invalid username/email or password');
      expect(getErrorMessage({ message: 'Generic', code: 'LOGIN_FAILED' })).toBe('Login failed. Please try again.');
    });

    it('should return original message for unknown or missing codes', () => {
      expect(getErrorMessage({ message: 'Original message', code: 'UNKNOWN_ERROR' })).toBe('Original message');
      expect(getErrorMessage({ message: 'Original message' })).toBe('Original message');
      expect(getErrorMessage({ message: 'Original message', code: '' })).toBe('Original message');
    });
  });
});
