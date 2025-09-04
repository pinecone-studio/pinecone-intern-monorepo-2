/* eslint-disable @typescript-eslint/no-empty-function */
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

  it('should handle createUser FAILED result (line 78-81)', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    mockAxios.post.mockResolvedValueOnce({
      data: { data: { createUser: 'FAILED' } },
    });

    const mockSetStep = jest.fn();
    const { result } = renderHook(() => useStep2Form({ email: 'test@example.com', setStep: mockSetStep }));

    await act(async () => {
      await result.current.onSubmit({
        password: 'ValidPass123',
        confirmPassword: 'ValidPass123',
      });
    });

    expect(consoleSpy).toHaveBeenCalledWith('Failed to create user');
    expect(toast.error).toHaveBeenCalledWith('Failed to create user');
    expect(mockSetStep).not.toHaveBeenCalled();
    expect(mockRouter.push).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should handle missing email (line 85-87)', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const mockSetStep = jest.fn();
    const { result } = renderHook(() => useStep2Form({ email: '', setStep: mockSetStep }));

    await act(async () => {
      await result.current.onSubmit({
        password: 'ValidPass123',
        confirmPassword: 'ValidPass123',
      });
    });

    expect(consoleSpy).toHaveBeenCalledWith('Email is missing from Step1!');
    expect(mockAxios.post).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should handle error with response data (line 52)', async () => {
    const mockError = new Error('Network error');
    (mockError as any).response = {
      data: { message: 'Server error details' },
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

    expect(toast.error).toHaveBeenCalledWith('Failed to create user');
  });

  it('should handle error without response data', async () => {
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
});
