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

describe('useOtpVerification Hook - Basic Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle successful verification', async () => {
    mockAxios.post.mockResolvedValueOnce({
      data: { data: { signUpVerifyOtp: { output: 'Success' } } },
    });
    const mockSetStep = jest.fn();

    const { result } = renderHook(() => useOtpVerification('test@example.com', ['1', '2', '3', '4'], mockSetStep));

    await act(async () => await result.current.handleVerify());

    expect(mockAxios.post).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith('Success');
    expect(mockSetStep).toHaveBeenCalledWith(3);
  });

  it('should handle verification errors and validation', async () => {
    mockAxios.post.mockRejectedValueOnce(new Error('Verification failed'));
    const mockSetStep = jest.fn();

    const { result } = renderHook(() => useOtpVerification('test@example.com', ['1', '2', '3', '4'], mockSetStep));

    await act(async () => await result.current.handleVerify());
    expect(toast.error).toHaveBeenCalled();

    const { result: result2 } = renderHook(() => useOtpVerification('test@example.com', ['1', '2'], mockSetStep));

    await act(async () => await result2.current.handleVerify());
    expect(toast.error).toHaveBeenCalledWith('Please enter the 4-digit code.');
  });

  it('should handle missing email validation', async () => {
    const mockSetStep = jest.fn();
    const { result } = renderHook(() => useOtpVerification('', ['1', '2', '3', '4'], mockSetStep));

    await act(async () => await result.current.handleVerify());
    expect(toast.error).toHaveBeenCalledWith('Email not found. Please go back and enter your email.');
  });
});
