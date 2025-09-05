/* eslint-disable max-lines */
import { renderHook, act } from '@testing-library/react';
import { useStep2Form } from '../../../src/components/signup/Step2Form';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import '@testing-library/jest-dom';

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

describe('useStep2Form Hook - Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('should handle network error with response data logging', async () => {
    const mockError = new Error('Network error');
    (mockError as any).response = { data: { error: 'Server error details' } };
    mockAxios.post.mockRejectedValueOnce(mockError);
    const mockSetStep = jest.fn();

    const { result } = renderHook(() => useStep2Form({ email: 'test@example.com', setStep: mockSetStep }));

    await act(async () => {
      await result.current.onSubmit({
        password: 'ValidPass123',
        confirmPassword: 'ValidPass123',
      });
    });

    expect(toast.error).toHaveBeenCalledWith('Failed to create user');
  });

  it('should handle network error without response data', async () => {
    mockAxios.post.mockRejectedValueOnce(new Error('Simple network error'));
    const mockSetStep = jest.fn();

    const { result } = renderHook(() => useStep2Form({ email: 'test@example.com', setStep: mockSetStep }));

    await act(async () => {
      await result.current.onSubmit({
        password: 'ValidPass123',
        confirmPassword: 'ValidPass123',
      });
    });

    expect(toast.error).toHaveBeenCalledWith('Failed to create user');
  });

  it('should handle network error with Error instance that has response', async () => {
    const mockError = new Error('Network error with response');
    (mockError as any).response = { data: { message: 'Server error' } };
    mockAxios.post.mockRejectedValueOnce(mockError);
    const mockSetStep = jest.fn();

    const { result } = renderHook(() => useStep2Form({ email: 'test@example.com', setStep: mockSetStep }));

    await act(async () => {
      await result.current.onSubmit({
        password: 'ValidPass123',
        confirmPassword: 'ValidPass123',
      });
    });

    expect(toast.error).toHaveBeenCalledWith('Failed to create user');
  });

  it('should cover error handling branch for non-Error instance', async () => {
    // Mock a non-Error instance to cover the 'Unknown error' branch
    mockAxios.post.mockRejectedValueOnce('String error');
    const mockSetStep = jest.fn();

    const { result } = renderHook(() => useStep2Form({ email: 'test@example.com', setStep: mockSetStep }));

    await act(async () => {
      await result.current.onSubmit({
        password: 'ValidPass123',
        confirmPassword: 'ValidPass123',
      });
    });

    expect(toast.error).toHaveBeenCalledWith('Failed to create user');
  });

  it('should cover error handling with response data logging - multiple scenarios', async () => {
    // Test 1: Error with response.data
    const mockError1 = new Error('Test error 1');
    (mockError1 as any).response = { data: { error: 'Server error data' } };
    mockAxios.post.mockRejectedValueOnce(mockError1);

    const mockSetStep = jest.fn();
    const { result } = renderHook(() => useStep2Form({ email: 'test@example.com', setStep: mockSetStep }));

    await act(async () => {
      await result.current.onSubmit({
        password: 'ValidPass123',
        confirmPassword: 'ValidPass123',
      });
    });

    expect(toast.error).toHaveBeenCalledWith('Failed to create user');
  });

  it('should handle error with undefined response property', async () => {
    const mockError = new Error('Error without response');
    // Error has 'response' property but it's undefined
    (mockError as any).response = undefined;
    mockAxios.post.mockRejectedValueOnce(mockError);
    const mockSetStep = jest.fn();

    const { result } = renderHook(() => useStep2Form({ email: 'test@example.com', setStep: mockSetStep }));

    await act(async () => {
      await result.current.onSubmit({
        password: 'ValidPass123',
        confirmPassword: 'ValidPass123',
      });
    });

    // Should still call toast error
    expect(toast.error).toHaveBeenCalledWith('Failed to create user');
  });

  it('should cover lines 56-57: handleCreateUserError with specific error message', async () => {
    // Mock an error with the specific structure that triggers lines 56-57
    const mockError = {
      response: {
        data: {
          errors: [
            {
              message: 'User already exists',
            },
          ],
        },
      },
    };

    mockAxios.post.mockRejectedValueOnce(mockError);
    const mockSetStep = jest.fn();

    const { result } = renderHook(() => useStep2Form({ email: 'test@example.com', setStep: mockSetStep }));

    await act(async () => {
      await result.current.onSubmit({
        password: 'ValidPass123',
        confirmPassword: 'ValidPass123',
      });
    });

    // This should trigger lines 56-57: toast.error(message) and return
    expect(toast.error).toHaveBeenCalledWith('User already exists');
    expect(toast.error).toHaveBeenCalledTimes(1); // Should not call the fallback error
  });
});
