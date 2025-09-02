import { renderHook, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { gql } from '@apollo/client';
import { useOtpVerification, useOtpResend } from '@/app/(auth)/verifyOtp/hooks/useOtpHooks';

jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));
jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

const mockRouter = { push: jest.fn(), back: jest.fn(), forward: jest.fn(), refresh: jest.fn(), replace: jest.fn(), prefetch: jest.fn() };
const mockSetValue = jest.fn(), mockSetCanResend = jest.fn(), mockSetTimer = jest.fn();
const mockInputRefs = { current: Array(4).fill({ focus: jest.fn() }) };

const VERIFY_OTP_QUERY = gql`mutation verifyOtp($input: VerifyOtpInput!) { verifyOtp(input: $input) { status message } }`;
const FORGOT_PASSWORD_QUERY = gql`mutation forgotPassword($input: ForgotPasswordInput!) { forgotPassword(input: $input) { status message } }`;

const createMock = (query: any, variables: any, status: 'SUCCESS' | 'ERROR', message: string | null = null, networkError = false) => networkError ? { request: { query, variables }, error: new Error('Network error') } : { request: { query, variables }, result: { data: { [query.definitions[0].name.value]: { status, message } } } };

describe('useOtpHooks', () => {
    beforeEach(() => { jest.clearAllMocks(); (useRouter as jest.Mock).mockReturnValue(mockRouter); });

    it('verifies OTP successfully', async () => {
        const mocks = [createMock(VERIFY_OTP_QUERY, { input: { email: 'a', otp: '1' } }, 'SUCCESS', 'ok')];
        const { result } = renderHook(() => useOtpVerification('a', '1', mockRouter), { wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider> });
        await act(async () => result.current.handleVerifyOtp());
        expect(toast.success).toHaveBeenCalledWith('OTP verified successfully'); expect(mockRouter.push).toHaveBeenCalledWith('/resetPassword?email=a');
    });

    it('handles OTP error with/without message', async () => {
        const errorMocks = [
            createMock(VERIFY_OTP_QUERY, { input: { email: 'a', otp: '1' } }, 'ERROR', 'Invalid'),
            createMock(VERIFY_OTP_QUERY, { input: { email: 'a', otp: '1' } }, 'ERROR', null)
        ];
        for (const m of errorMocks) {
            const { result } = renderHook(() => useOtpVerification('a', '1', mockRouter), { wrapper: ({ children }) => <MockedProvider mocks={[m]}>{children}</MockedProvider> });
            await act(async () => result.current.handleVerifyOtp());
        }
        expect(toast.error).toHaveBeenCalledWith('Invalid'); expect(toast.error).toHaveBeenCalledWith('Failed to verify OTP');
    });

    it('handles network OTP error', async () => {
        const { result } = renderHook(() => useOtpVerification('a', '1', mockRouter), { wrapper: ({ children }) => <MockedProvider mocks={[createMock(VERIFY_OTP_QUERY, { input: { email: 'a', otp: '1' } }, 'SUCCESS', null, true)]}>{children}</MockedProvider> });
        await act(async () => result.current.handleVerifyOtp());
        expect(toast.error).toHaveBeenCalledWith('Something went wrong');
    });

    it('resends OTP successfully', async () => {
        const mocks = [createMock(FORGOT_PASSWORD_QUERY, { input: { email: 'a' } }, 'SUCCESS', 'sent')];
        const otpValues = ['1', '2', '3', '4', '5', '6'];
        const { result } = renderHook(() => useOtpResend('a', otpValues, mockSetValue, mockSetCanResend, mockSetTimer, mockInputRefs), { wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider> });
        await act(async () => result.current.handleResend());
        expect(toast.success).toHaveBeenCalledWith('OTP resent successfully!'); expect(mockSetTimer).toHaveBeenCalledWith(15); expect(mockInputRefs.current[0].focus).toHaveBeenCalled();
    });

    it('handles OTP resend error with/without message', async () => {
        const mocks = [createMock(FORGOT_PASSWORD_QUERY, { input: { email: 'a' } }, 'ERROR', 'fail'), createMock(FORGOT_PASSWORD_QUERY, { input: { email: 'a' } }, 'ERROR', null)];
        for (const m of mocks) {
            const { result } = renderHook(() => useOtpResend('a', ['1', '2'], mockSetValue, mockSetCanResend, mockSetTimer, mockInputRefs), { wrapper: ({ children }) => <MockedProvider mocks={[m]}>{children}</MockedProvider> });
            await act(async () => result.current.handleResend());
        }
        expect(toast.error).toHaveBeenCalledWith('fail'); expect(toast.error).toHaveBeenCalledWith('Failed to resend OTP'); expect(mockSetCanResend).toHaveBeenCalledWith(true);
    });

    it('handles network OTP resend error', async () => {
        const networkMock = createMock(FORGOT_PASSWORD_QUERY, { input: { email: 'a' } }, 'SUCCESS', null, true);
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
        const { result } = renderHook(() => useOtpResend('a', ['1', '2'], mockSetValue, mockSetCanResend, mockSetTimer, mockInputRefs), { wrapper: ({ children }) => <MockedProvider mocks={[networkMock]}>{children}</MockedProvider> });
        await act(async () => result.current.handleResend());
        expect(toast.error).toHaveBeenCalledWith('Failed to resend OTP'); expect(mockSetCanResend).toHaveBeenCalledWith(true); consoleSpy.mockRestore();
    });

    it('handles empty OTP array', async () => {
        const mocks = [createMock(FORGOT_PASSWORD_QUERY, { input: { email: 'a' } }, 'SUCCESS', 'ok')];
        const { result } = renderHook(() => useOtpResend('a', [], mockSetValue, mockSetCanResend, mockSetTimer, mockInputRefs), { wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider> });
        await act(async () => result.current.handleResend());
        expect(mockSetValue).not.toHaveBeenCalled(); expect(toast.success).toHaveBeenCalledWith('OTP resent successfully!');
    });
});
