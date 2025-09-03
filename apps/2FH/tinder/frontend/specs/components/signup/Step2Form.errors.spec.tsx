/* eslint-disable max-lines */
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

describe('useStep2Form Hook - Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('should handle network error with response data logging', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      // Empty function for spying
    });
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

    expect(consoleSpy).toHaveBeenCalledWith('Error creating user:', 'Network error');
    expect(consoleSpy).toHaveBeenCalledWith({ error: 'Server error details' });
    expect(toast.error).toHaveBeenCalledWith('Failed to create user');

    consoleSpy.mockRestore();
  });

  it('should handle network error without response data', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      // Empty function for spying
    });
    mockAxios.post.mockRejectedValueOnce(new Error('Simple network error'));
    const mockSetStep = jest.fn();

    const { result } = renderHook(() => useStep2Form({ email: 'test@example.com', setStep: mockSetStep }));

    await act(async () => {
      await result.current.onSubmit({
        password: 'ValidPass123',
        confirmPassword: 'ValidPass123',
      });
    });

    expect(consoleSpy).toHaveBeenCalledWith('Error creating user:', 'Simple network error');
    // Second console.error call for response.data should not happen since error has no response property
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith('Failed to create user');

    consoleSpy.mockRestore();
  });

  it('should handle network error with Error instance that has response', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      // Empty function for spying
    });
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

    expect(consoleSpy).toHaveBeenCalledWith('Error creating user:', 'Network error with response');
    expect(consoleSpy).toHaveBeenCalledWith({ message: 'Server error' });
    expect(toast.error).toHaveBeenCalledWith('Failed to create user');

    consoleSpy.mockRestore();
  });

  it('should cover error handling branch for non-Error instance', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      // Empty function for spying
    });
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

    // Should cover the 'Unknown error' branch on line 90
    expect(consoleSpy).toHaveBeenCalledWith('Error creating user:', 'Unknown error');
    expect(toast.error).toHaveBeenCalledWith('Failed to create user');

    consoleSpy.mockRestore();
  });

  it('should cover error handling with response data logging - multiple scenarios', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      // Empty function for spying
    });

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

    // Should cover both error logging branches
    expect(consoleSpy).toHaveBeenCalledWith('Error creating user:', 'Test error 1');
    expect(consoleSpy).toHaveBeenCalledWith({ error: 'Server error data' });

    consoleSpy.mockRestore();
  });

  it('should handle error with undefined response property', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      // Empty function for spying
    });
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

    expect(consoleSpy).toHaveBeenCalledWith('Error creating user:', 'Error without response');
    // Should still call toast error
    expect(toast.error).toHaveBeenCalledWith('Failed to create user');

    consoleSpy.mockRestore();
  });
});
