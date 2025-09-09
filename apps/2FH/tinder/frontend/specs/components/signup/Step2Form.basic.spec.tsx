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

describe('useStep2Form Hook - Basic Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useStep2Form({ email: 'test@example.com', setStep: jest.fn() }));

    expect(result.current.showPassword).toBe(false);
    expect(result.current.showConfirmPassword).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(typeof result.current.register).toBe('function');
    expect(typeof result.current.handleSubmit).toBe('function');
    expect(typeof result.current.onSubmit).toBe('function');
  });

  it('should handle password visibility toggle', () => {
    const { result } = renderHook(() => useStep2Form({ email: 'test@example.com', setStep: jest.fn() }));

    act(() => {
      result.current.setShowPassword(true);
    });
    expect(result.current.showPassword).toBe(true);

    act(() => {
      result.current.setShowConfirmPassword(true);
    });
    expect(result.current.showConfirmPassword).toBe(true);
  });

  it('should handle successful user creation', async () => {
    mockAxios.post.mockResolvedValueOnce({
      data: { data: { createUser: { status: 'SUCCESS', userId: 'test-user-id' } } },
    });
    const mockSetStep = jest.fn();

    const { result } = renderHook(() => useStep2Form({ email: 'test@example.com', setStep: mockSetStep }));

    await act(async () => {
      await result.current.onSubmit({
        password: 'TestPassword123',
        confirmPassword: 'TestPassword123',
      });
    });

    expect(mockAxios.post).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith('User created successfully');
    expect(mockSetStep).toHaveBeenCalledWith(1);
    expect(mockRouter.push).toHaveBeenCalledWith('/create-profile');
  });

  it('should handle user creation failure', async () => {
    mockAxios.post.mockResolvedValueOnce({
      data: { data: { createUser: 'FAILED' } },
    });
    const mockSetStep = jest.fn();

    const { result } = renderHook(() => useStep2Form({ email: 'test@example.com', setStep: mockSetStep }));

    await act(async () => {
      await result.current.onSubmit({
        password: 'TestPassword123',
        confirmPassword: 'TestPassword123',
      });
    });

    expect(toast.error).toHaveBeenCalledWith('Failed to create user');
  });

  it('should handle network error', async () => {
    mockAxios.post.mockRejectedValueOnce(new Error('Network error'));
    const mockSetStep = jest.fn();

    const { result } = renderHook(() => useStep2Form({ email: 'test@example.com', setStep: mockSetStep }));

    await act(async () => {
      await result.current.onSubmit({
        password: 'TestPassword123',
        confirmPassword: 'TestPassword123',
      });
    });

    expect(toast.error).toHaveBeenCalledWith('Failed to create user');
  });

  it('should handle missing email', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      // Empty implementation for spying
    });
    const mockSetStep = jest.fn();

    const { result } = renderHook(() => useStep2Form({ email: '', setStep: mockSetStep }));

    await act(async () => {
      await result.current.onSubmit({
        password: 'TestPassword123',
        confirmPassword: 'TestPassword123',
      });
    });

    expect(consoleSpy).toHaveBeenCalledWith('Email is missing from Step1!');
    expect(mockAxios.post).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should set loading state during submission', async () => {
    let resolvePromise: (_value: unknown) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockAxios.post.mockReturnValueOnce(promise as any);
    const mockSetStep = jest.fn();

    const { result } = renderHook(() => useStep2Form({ email: 'test@example.com', setStep: mockSetStep }));

    expect(result.current.loading).toBe(false);

    act(() => {
      result.current.onSubmit({
        password: 'TestPassword123',
        confirmPassword: 'TestPassword123',
      });
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolvePromise!({ data: { data: { createUser: 'SUCCESS' } } });
    });

    expect(result.current.loading).toBe(false);
  });
});
