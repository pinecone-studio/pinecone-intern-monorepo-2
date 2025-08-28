import { Gender, SignupFormData, LoginFormData, AuthError } from '../../../src/components/auth/types';

describe('Auth Types', () => {
  describe('Gender Enum', () => {
    it('should export FEMALE gender', () => {
      expect(Gender.FEMALE).toBe('FEMALE');
    });

    it('should export MALE gender', () => {
      expect(Gender.MALE).toBe('MALE');
    });

    it('should export OTHER gender', () => {
      expect(Gender.OTHER).toBe('OTHER');
    });

    it('should have exactly 3 gender options', () => {
      const genderValues = Object.values(Gender);
      expect(genderValues).toHaveLength(3);
      expect(genderValues).toEqual(['FEMALE', 'MALE', 'OTHER']);
    });
  });

  describe('SignupFormData Interface', () => {
    it('should accept valid signup form data', () => {
      const validSignupData: SignupFormData = {
        fullName: 'John Doe',
        userName: 'johndoe',
        email: 'john@example.com',
        phoneNumber: '+1234567890',
        password: 'password123',
        confirmPassword: 'password123',
        gender: Gender.MALE,
        bio: 'Test bio'
      };

      expect(validSignupData.fullName).toBe('John Doe');
      expect(validSignupData.userName).toBe('johndoe');
      expect(validSignupData.email).toBe('john@example.com');
      expect(validSignupData.phoneNumber).toBe('+1234567890');
      expect(validSignupData.password).toBe('password123');
      expect(validSignupData.confirmPassword).toBe('password123');
      expect(validSignupData.gender).toBe(Gender.MALE);
      expect(validSignupData.bio).toBe('Test bio');
    });

    it('should accept signup data with female gender', () => {
      const signupData: SignupFormData = {
        fullName: 'Jane Doe',
        userName: 'janedoe',
        email: 'jane@example.com',
        phoneNumber: '+1234567890',
        password: 'password123',
        confirmPassword: 'password123',
        gender: Gender.FEMALE,
        bio: 'Test bio'
      };

      expect(signupData.gender).toBe(Gender.FEMALE);
    });

    it('should accept signup data with other gender', () => {
      const signupData: SignupFormData = {
        fullName: 'Alex Doe',
        userName: 'alexdoe',
        email: 'alex@example.com',
        phoneNumber: '+1234567890',
        password: 'password123',
        confirmPassword: 'password123',
        gender: Gender.OTHER,
        bio: 'Test bio'
      };

      expect(signupData.gender).toBe(Gender.OTHER);
    });
  });

  describe('LoginFormData Interface', () => {
    it('should accept valid login form data with email', () => {
      const loginData: LoginFormData = {
        identifier: 'john@example.com',
        password: 'password123'
      };

      expect(loginData.identifier).toBe('john@example.com');
      expect(loginData.password).toBe('password123');
    });

    it('should accept valid login form data with username', () => {
      const loginData: LoginFormData = {
        identifier: 'johndoe',
        password: 'password123'
      };

      expect(loginData.identifier).toBe('johndoe');
      expect(loginData.password).toBe('password123');
    });

    it('should accept valid login form data with phone number', () => {
      const loginData: LoginFormData = {
        identifier: '+1234567890',
        password: 'password123'
      };

      expect(loginData.identifier).toBe('+1234567890');
      expect(loginData.password).toBe('password123');
    });
  });

  describe('AuthError Interface', () => {
    it('should accept error with message only', () => {
      const error: AuthError = {
        message: 'Authentication failed'
      };

      expect(error.message).toBe('Authentication failed');
      expect(error.code).toBeUndefined();
    });

    it('should accept error with message and code', () => {
      const error: AuthError = {
        message: 'Username already exists',
        code: 'USERNAME_EXISTS'
      };

      expect(error.message).toBe('Username already exists');
      expect(error.code).toBe('USERNAME_EXISTS');
    });

    it('should accept error with empty message', () => {
      const error: AuthError = {
        message: '',
        code: 'UNKNOWN_ERROR'
      };

      expect(error.message).toBe('');
      expect(error.code).toBe('UNKNOWN_ERROR');
    });
  });
});
