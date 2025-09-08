import { renderHook, act } from '@testing-library/react';
import { useOtpResend } from '../../../src/components/signup/hooks';
import axios from 'axios';
import { toast } from 'sonner';

// Mock dependencies
jest.mock('axios');
jest.mock('sonner', () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

const mockAxios = axios as jest.Mocked<typeof axios>;

describe('useOtpResend Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle resend flow', async () => {
    mockAxios.post.mockResolvedValueOnce({ data: {} });
    const mockResetTimer = jest.fn();

    const { result } = renderHook(() => useOtpResend('test@example.com', mockResetTimer));

    await act(async () => await result.current.handleResend());

    expect(mockAxios.post).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith('OTP resent successfully!');
    expect(mockResetTimer).toHaveBeenCalled();
  });

  it('should handle errors and missing email', async () => {
    mockAxios.post.mockRejectedValueOnce(new Error('Network error'));
    const { result } = renderHook(() => useOtpResend('test@example.com', jest.fn()));

    await act(async () => await result.current.handleResend());
    expect(toast.error).toHaveBeenCalled();

    const { result: result2 } = renderHook(() => useOtpResend('', jest.fn()));
    await act(async () => await result2.current.handleResend());
    expect(toast.error).toHaveBeenCalledWith('Email not found. Please go back and enter your email.');
  });

  it('should handle network error with response data in resend', async () => {
    const mockError = new Error('Network error');
    (mockError as any).response = {
      data: {
        errors: [{ message: 'Too many requests' }],
      },
    };
    mockAxios.post.mockRejectedValueOnce(mockError);
    const mockResetTimer = jest.fn();

    const { result } = renderHook(() => useOtpResend('test@example.com', mockResetTimer));

    await act(async () => await result.current.handleResend());

    expect(toast.error).toHaveBeenCalledWith('Too many requests');
    expect(mockResetTimer).not.toHaveBeenCalled();
  });

  it('should handle network error without response data in resend', async () => {
    mockAxios.post.mockRejectedValueOnce(new Error('Simple network error'));
    const mockResetTimer = jest.fn();

    const { result } = renderHook(() => useOtpResend('test@example.com', mockResetTimer));

    await act(async () => await result.current.handleResend());

    expect(toast.error).toHaveBeenCalledWith('Failed to resend OTP');
    expect(mockResetTimer).not.toHaveBeenCalled();
  });

  it('should handle network error with empty response data in resend', async () => {
    const mockError = new Error('Network error');
    (mockError as any).response = { data: {} }; // Empty response data
    mockAxios.post.mockRejectedValueOnce(mockError);
    const mockResetTimer = jest.fn();

    const { result } = renderHook(() => useOtpResend('test@example.com', mockResetTimer));

    await act(async () => await result.current.handleResend());

    expect(toast.error).toHaveBeenCalledWith('Failed to resend OTP'); // errorMessage is undefined, so fallback
    expect(mockResetTimer).not.toHaveBeenCalled();
  });

  it('should handle network error with response but no errors array', async () => {
    const mockError = new Error('Network error');
    (mockError as any).response = { data: { someOtherField: 'value' } }; // Response but no errors array
    mockAxios.post.mockRejectedValueOnce(mockError);
    const mockResetTimer = jest.fn();

    const { result } = renderHook(() => useOtpResend('test@example.com', mockResetTimer));

    await act(async () => await result.current.handleResend());

    expect(toast.error).toHaveBeenCalledWith('Failed to resend OTP'); // errorMessage is undefined, so fallback
    expect(mockResetTimer).not.toHaveBeenCalled();
  });
});
