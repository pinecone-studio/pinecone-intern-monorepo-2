import { renderHook, act } from '@testing-library/react';
import { useOtpVerification } from '../../../src/components/signup/hooks';
import axios from 'axios';
import { toast } from 'sonner';

// Mock dependencies
jest.mock('axios');
jest.mock('sonner', () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

const mockAxios = axios as jest.Mocked<typeof axios>;

describe('useOtpVerification Hook - Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle network error with response data in verification', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      // Empty function for spying
    });
    const mockError = new Error('Network error');
    (mockError as any).response = {
      data: {
        errors: [{ message: 'Invalid OTP' }],
      },
    };
    mockAxios.post.mockRejectedValueOnce(mockError);
    const mockSetStep = jest.fn();

    const { result } = renderHook(() => useOtpVerification('test@example.com', ['1', '2', '3', '4'], mockSetStep));

    await act(async () => await result.current.handleVerify());

    expect(consoleSpy).toHaveBeenCalledWith(mockError);
    expect(toast.error).toHaveBeenCalledWith('Invalid OTP');
    expect(mockSetStep).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should handle network error without response data in verification', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      // Empty function for spying
    });
    mockAxios.post.mockRejectedValueOnce(new Error('Simple network error'));
    const mockSetStep = jest.fn();

    const { result } = renderHook(() => useOtpVerification('test@example.com', ['1', '2', '3', '4'], mockSetStep));

    await act(async () => await result.current.handleVerify());

    expect(consoleSpy).toHaveBeenCalledWith(new Error('Simple network error'));
    expect(toast.error).toHaveBeenCalledWith('OTP verification failed');
    expect(mockSetStep).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should handle network error with partial response data in verification', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      // Empty function for spying
    });
    const mockError = {
      message: 'Network error',
      response: { data: {} },
    };
    mockAxios.post.mockRejectedValueOnce(mockError);
    const mockSetStep = jest.fn();

    const { result } = renderHook(() => useOtpVerification('test@example.com', ['1', '2', '3', '4'], mockSetStep));

    await act(async () => await result.current.handleVerify());

    expect(consoleSpy).toHaveBeenCalledWith(mockError);
    expect(toast.error).toHaveBeenCalledWith('OTP verification failed');
    expect(mockSetStep).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should handle OTP verification with different error structures', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      // Empty implementation for spying
    });
    mockAxios.post.mockRejectedValueOnce(new Error('Simple error'));
    const mockSetStep = jest.fn();

    const { result } = renderHook(() => useOtpVerification('test@example.com', ['1', '2', '3', '4'], mockSetStep));

    await act(async () => await result.current.handleVerify());

    expect(consoleSpy).toHaveBeenCalledWith(new Error('Simple error'));
    expect(toast.error).toHaveBeenCalledWith('OTP verification failed');

    consoleSpy.mockRestore();
  });

  it('should handle network error with null error message fallback', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      // Empty function for spying
    });
    const mockError = new Error('Network error');
    (mockError as any).response = {
      data: {
        errors: [{ message: null }], // Null message to trigger fallback
      },
    };
    mockAxios.post.mockRejectedValueOnce(mockError);
    const mockSetStep = jest.fn();

    const { result } = renderHook(() => useOtpVerification('test@example.com', ['1', '2', '3', '4'], mockSetStep));

    await act(async () => await result.current.handleVerify());

    expect(consoleSpy).toHaveBeenCalledWith(mockError);
    expect(toast.error).toHaveBeenCalledWith('OTP verification failed'); // This covers the fallback branch
    expect(mockSetStep).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should handle network error with empty error message fallback', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      // Empty function for spying
    });
    const mockError = new Error('Network error');
    (mockError as any).response = {
      data: {
        errors: [{ message: '' }], // Empty message to trigger fallback
      },
    };
    mockAxios.post.mockRejectedValueOnce(mockError);
    const mockSetStep = jest.fn();

    const { result } = renderHook(() => useOtpVerification('test@example.com', ['1', '2', '3', '4'], mockSetStep));

    await act(async () => await result.current.handleVerify());

    expect(consoleSpy).toHaveBeenCalledWith(mockError);
    expect(toast.error).toHaveBeenCalledWith('OTP verification failed'); // This covers the fallback branch
    expect(mockSetStep).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
