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

describe('useOtpResend Hook - Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle complex error scenarios to cover all branches', async () => {
    // Test case 1: Error with response.data but no errors array
    const mockError1 = new Error('Network error 1');
    (mockError1 as any).response = { data: { message: 'Direct error' } };
    mockAxios.post.mockRejectedValueOnce(mockError1);

    const { result } = renderHook(() => useOtpResend('test@example.com', jest.fn()));

    await act(async () => await result.current.handleResend());

    // Test case 2: Error with response.data.errors but empty array
    const mockError2 = new Error('Network error 2');
    (mockError2 as any).response = { data: { errors: [] } };
    mockAxios.post.mockRejectedValueOnce(mockError2);

    const { result: result2 } = renderHook(() => useOtpResend('test@example.com', jest.fn()));

    await act(async () => await result2.current.handleResend());

    // Test case 3: Error with response.data.errors[0] but no message
    const mockError3 = new Error('Network error 3');
    (mockError3 as any).response = { data: { errors: [{}] } };
    mockAxios.post.mockRejectedValueOnce(mockError3);

    const { result: result3 } = renderHook(() => useOtpResend('test@example.com', jest.fn()));

    await act(async () => await result3.current.handleResend());

    expect(toast.error).toHaveBeenCalledWith('Failed to resend OTP');
  });
});
