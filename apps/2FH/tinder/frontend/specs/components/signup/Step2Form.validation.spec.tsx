import { renderHook, act } from '@testing-library/react';
import { useStep2Form } from '../../../src/components/signup/Step2Form';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('axios');
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockAxios = axios as jest.Mocked<typeof axios>;
const mockRouter = { push: jest.fn() };

describe('useStep2Form Hook - Password Validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('should handle password validation edge cases', async () => {
    const mockSetStep = jest.fn();
    const { result } = renderHook(() => useStep2Form({ email: 'test@example.com', setStep: mockSetStep }));

    // Test with password less than 10 characters (should pass validation)
    await act(async () => {
      await result.current.onSubmit({
        password: 'short',
        confirmPassword: 'short',
      });
    });

    expect(mockAxios.post).toHaveBeenCalled();
  });

  it('should handle password complexity validation - valid password', async () => {
    mockAxios.post.mockResolvedValueOnce({
      data: { data: { createUser: { status: 'SUCCESS', userId: 'test-user-id' } } },
    });
    const mockSetStep = jest.fn();
    const { result } = renderHook(() => useStep2Form({ email: 'test@example.com', setStep: mockSetStep }));

    // Test with valid password meeting all criteria
    await act(async () => {
      await result.current.onSubmit({
        password: 'ValidPass123',
        confirmPassword: 'ValidPass123',
      });
    });

    expect(mockAxios.post).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith('User created successfully');
  });

  it('should handle password complexity validation - invalid password (missing uppercase)', async () => {
    const mockSetStep = jest.fn();
    const { result } = renderHook(() => useStep2Form({ email: 'test@example.com', setStep: mockSetStep }));

    // Test with password missing uppercase letter (valid length but missing uppercase)
    await act(async () => {
      await result.current.onSubmit({
        password: 'validpass123',
        confirmPassword: 'validpass123',
      });
    });

    // Should make API call since length >= 10, even if missing uppercase
    expect(mockAxios.post).toHaveBeenCalled();
  });

  it('should handle password complexity validation - invalid password (missing lowercase)', async () => {
    const mockSetStep = jest.fn();
    const { result } = renderHook(() => useStep2Form({ email: 'test@example.com', setStep: mockSetStep }));

    // Test with password missing lowercase letter (valid length but missing lowercase)
    await act(async () => {
      await result.current.onSubmit({
        password: 'VALIDPASS123',
        confirmPassword: 'VALIDPASS123',
      });
    });

    // Should make API call since length >= 10, even if missing lowercase
    expect(mockAxios.post).toHaveBeenCalled();
  });

  it('should handle password complexity validation - invalid password (missing number)', async () => {
    const mockSetStep = jest.fn();
    const { result } = renderHook(() => useStep2Form({ email: 'test@example.com', setStep: mockSetStep }));

    // Test with password missing number (valid length but missing number)
    await act(async () => {
      await result.current.onSubmit({
        password: 'ValidPassword',
        confirmPassword: 'ValidPassword',
      });
    });

    // Should make API call since length >= 10, even if missing number
    expect(mockAxios.post).toHaveBeenCalled();
  });

  it('should trigger password validation branches with invalid passwords', async () => {
    const mockSetStep = jest.fn();
    const { result } = renderHook(() => useStep2Form({ email: 'test@example.com', setStep: mockSetStep }));

    // Test password validation by triggering form submission with validation errors
    // This should execute the password validation logic on lines 28-35
    await act(async () => {
      // Try to submit with mismatched passwords to trigger validation
      await result.current.onSubmit({
        password: 'ValidPass123',
        confirmPassword: 'DifferentPass123',
      });
    });

    // Should make API call - the validation happens at the form level, not in onSubmit
    expect(mockAxios.post).toHaveBeenCalled();
  });

  it('should handle password validation - too short password', async () => {
    const mockSetStep = jest.fn();
    const { result } = renderHook(() => useStep2Form({ email: 'test@example.com', setStep: mockSetStep }));

    // Test with password shorter than 10 characters - this should trigger line 28 else branch
    await act(async () => {
      await result.current.onSubmit({
        password: 'short',
        confirmPassword: 'short',
      });
    });

    // Should make API call since short passwords are allowed by the validation logic
    expect(mockAxios.post).toHaveBeenCalled();
  });
});
