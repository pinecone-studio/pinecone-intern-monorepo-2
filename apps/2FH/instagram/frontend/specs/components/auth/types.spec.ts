/* eslint-disable max-lines */
import { 
  Gender, 
  SignupFormData, 
  LoginFormData, 
  AuthError,
  createSignupFormData,
  createLoginFormData,
  validateSignupFormData,
  createAuthError
} from '../../../src/components/auth/types';

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

  describe('Helper Functions', () => {
    describe('createAuthError', () => {
      it('should create auth error with message only', () => {
        const result = createAuthError('Test error message');
        
        expect(result).toEqual({
          message: 'Test error message',
          code: undefined,
          email: undefined
        });
      });

      it('should create auth error with message and code', () => {
        const result = createAuthError('Test error message', 'TEST_ERROR');
        
        expect(result).toEqual({
          message: 'Test error message',
          code: 'TEST_ERROR',
          email: undefined
        });
      });

      it('should create auth error with message, code, and email', () => {
        const result = createAuthError('Test error message', 'TEST_ERROR', 'test@example.com');
        
        expect(result).toEqual({
          message: 'Test error message',
          code: 'TEST_ERROR',
          email: 'test@example.com'
        });
      });

      it('should create auth error with empty message', () => {
        const result = createAuthError('');
        
        expect(result).toEqual({
          message: '',
          code: undefined,
          email: undefined
        });
      });
    });

    describe('createSignupFormData', () => {
      it('should create signup form data with all fields', () => {
        const result = createSignupFormData(
          'John Doe',
          'johndoe',
          'john@example.com',
          '+1234567890',
          'password123',
          'password123',
          Gender.MALE,
          'Software developer'
        );

        expect(result).toEqual({
          fullName: 'John Doe',
          userName: 'johndoe',
          email: 'john@example.com',
          phoneNumber: '+1234567890',
          password: 'password123',
          confirmPassword: 'password123',
          gender: Gender.MALE,
          bio: 'Software developer'
        });
      });

      it('should create signup form data with female gender', () => {
        const result = createSignupFormData(
          'Jane Doe',
          'janedoe',
          'jane@example.com',
          '+1234567891',
          'password456',
          'password456',
          Gender.FEMALE,
          'Designer'
        );

        expect(result.gender).toBe(Gender.FEMALE);
        expect(result.fullName).toBe('Jane Doe');
      });

      it('should create signup form data with other gender', () => {
        const result = createSignupFormData(
          'Alex Smith',
          'alexsmith',
          'alex@example.com',
          '+1234567892',
          'password789',
          'password789',
          Gender.OTHER,
          'Artist'
        );

        expect(result.gender).toBe(Gender.OTHER);
        expect(result.userName).toBe('alexsmith');
      });
    });

    describe('createLoginFormData', () => {
      it('should create login form data with email identifier', () => {
        const result = createLoginFormData('user@example.com', 'password123');
        
        expect(result).toEqual({
          identifier: 'user@example.com',
          password: 'password123'
        });
      });

      it('should create login form data with username identifier', () => {
        const result = createLoginFormData('username', 'password456');
        
        expect(result).toEqual({
          identifier: 'username',
          password: 'password456'
        });
      });
    });

    describe('validateSignupFormData', () => {
      it('should return true for valid signup data', () => {
        const validData: SignupFormData = {
          fullName: 'John Doe',
          userName: 'johndoe',
          email: 'john@example.com',
          phoneNumber: '+1234567890',
          password: 'password123',
          confirmPassword: 'password123',
          gender: Gender.MALE,
          bio: 'Software developer'
        };

        const result = validateSignupFormData(validData);
        expect(result).toBe(true);
      });

      it('should return false for empty full name', () => {
        const invalidData: SignupFormData = {
          fullName: '',
          userName: 'johndoe',
          email: 'john@example.com',
          phoneNumber: '+1234567890',
          password: 'password123',
          confirmPassword: 'password123',
          gender: Gender.MALE,
          bio: 'Software developer'
        };

        const result = validateSignupFormData(invalidData);
        expect(result).toBe(false);
      });

      it('should return false for empty username', () => {
        const invalidData: SignupFormData = {
          fullName: 'John Doe',
          userName: '',
          email: 'john@example.com',
          phoneNumber: '+1234567890',
          password: 'password123',
          confirmPassword: 'password123',
          gender: Gender.MALE,
          bio: 'Software developer'
        };

        const result = validateSignupFormData(invalidData);
        expect(result).toBe(false);
      });

      it('should return false for invalid email format', () => {
        const invalidData: SignupFormData = {
          fullName: 'John Doe',
          userName: 'johndoe',
          email: 'invalid-email',
          phoneNumber: '+1234567890',
          password: 'password123',
          confirmPassword: 'password123',
          gender: Gender.MALE,
          bio: 'Software developer'
        };

        const result = validateSignupFormData(invalidData);
        expect(result).toBe(false);
      });

      it('should return false for short password', () => {
        const invalidData: SignupFormData = {
          fullName: 'John Doe',
          userName: 'johndoe',
          email: 'john@example.com',
          phoneNumber: '+1234567890',
          password: 'short',
          confirmPassword: 'short',
          gender: Gender.MALE,
          bio: 'Software developer'
        };

        const result = validateSignupFormData(invalidData);
        expect(result).toBe(false);
      });

      it('should return false for mismatched passwords', () => {
        const invalidData: SignupFormData = {
          fullName: 'John Doe',
          userName: 'johndoe',
          email: 'john@example.com',
          phoneNumber: '+1234567890',
          password: 'password123',
          confirmPassword: 'different456',
          gender: Gender.MALE,
          bio: 'Software developer'
        };

        const result = validateSignupFormData(invalidData);
        expect(result).toBe(false);
      });
    });
  });
});
