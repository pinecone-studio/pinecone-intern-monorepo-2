import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import LoginPage from '../../../../src/app/(auth)/signin/page';
import { useUser } from '../../../../src/contexts/UserContext';

// Mock dependencies
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

jest.mock('../../../../src/contexts/UserContext', () => ({
    useUser: jest.fn(),
}));

const mockRouter = {
    push: jest.fn(),
};

const mockLoginUser = jest.fn();

const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;

describe('LoginPage - localStorage userId management', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        mockUseUser.mockReturnValue({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            login: mockLoginUser,
            logout: jest.fn(),
            updateUser: jest.fn(),
        });

        // Clear localStorage before each test
        localStorage.clear();
    });

    it('should clear old userId and store new user ID on successful login', async () => {
        // Setup: Set an old userId in localStorage
        localStorage.setItem('userId', 'old-user-id-123');

        // Mock successful login response
        const mockLoginMutation = jest.fn().mockResolvedValue({
            data: {
                login: {
                    status: 'SUCCESS',
                    user: { id: 'new-user-id-456', email: 'test@example.com' },
                    token: 'new-jwt-token',
                },
            },
        });

        // Mock the useMutation hook
        const mockUseMutation = jest.fn().mockReturnValue([
            mockLoginMutation,
            { loading: false, error: null }
        ]);

        // Mock Apollo Client's useMutation
        jest.doMock('@apollo/client', () => ({
            ...jest.requireActual('@apollo/client'),
            useMutation: mockUseMutation,
        }));

        render(
            <MockedProvider mocks={[]} addTypename={false}>
                <LoginPage />
            </MockedProvider>
        );

        // Fill in the form
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /sign in/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'ValidPass123' } });
        fireEvent.click(submitButton);

        // Wait for the login process
        await waitFor(() => {
            expect(mockLoginMutation).toHaveBeenCalledWith({
                variables: {
                    email: 'test@example.com',
                    password: 'ValidPass123',
                },
            });
        });

        // Verify that loginUser was called with correct data
        expect(mockLoginUser).toHaveBeenCalledWith(
            { id: 'new-user-id-456', email: 'test@example.com' },
            'new-jwt-token'
        );

        // Verify localStorage was updated correctly
        expect(localStorage.getItem('userId')).toBe('new-user-id-456');

        // Verify success toast was shown
        expect(toast.success).toHaveBeenCalled();

        // Verify navigation
        expect(mockRouter.push).toHaveBeenCalledWith('/chat');
    });

    it('should handle login failure without updating localStorage', async () => {
        // Setup: Set an old userId in localStorage
        localStorage.setItem('userId', 'old-user-id-123');

        // Mock failed login response
        const mockLoginMutation = jest.fn().mockResolvedValue({
            data: {
                login: {
                    status: 'FAILED',
                    message: 'Invalid credentials',
                },
            },
        });

        const mockUseMutation = jest.fn().mockReturnValue([
            mockLoginMutation,
            { loading: false, error: null }
        ]);

        jest.doMock('@apollo/client', () => ({
            ...jest.requireActual('@apollo/client'),
            useMutation: mockUseMutation,
        }));

        render(
            <MockedProvider mocks={[]} addTypename={false}>
                <LoginPage />
            </MockedProvider>
        );

        // Fill in the form
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /sign in/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'ValidPass123' } });
        fireEvent.click(submitButton);

        // Wait for the login process
        await waitFor(() => {
            expect(mockLoginMutation).toHaveBeenCalled();
        });

        // Verify that loginUser was NOT called
        expect(mockLoginUser).not.toHaveBeenCalled();

        // Verify localStorage was NOT updated
        expect(localStorage.getItem('userId')).toBe('old-user-id-123');

        // Verify error toast was shown
        expect(toast.error).toHaveBeenCalledWith(
            expect.objectContaining({
                props: expect.objectContaining({
                    children: 'Invalid credentials'
                })
            })
        );
    });

    it('should handle login error without updating localStorage', async () => {
        // Setup: Set an old userId in localStorage
        localStorage.setItem('userId', 'old-user-id-123');

        // Mock login error
        const mockLoginMutation = jest.fn().mockRejectedValue(new Error('Network error'));

        const mockUseMutation = jest.fn().mockReturnValue([
            mockLoginMutation,
            { loading: false, error: null }
        ]);

        jest.doMock('@apollo/client', () => ({
            ...jest.requireActual('@apollo/client'),
            useMutation: mockUseMutation,
        }));

        render(
            <MockedProvider mocks={[]} addTypename={false}>
                <LoginPage />
            </MockedProvider>
        );

        // Fill in the form
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /sign in/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'ValidPass123' } });
        fireEvent.click(submitButton);

        // Wait for the login process
        await waitFor(() => {
            expect(mockLoginMutation).toHaveBeenCalled();
        });

        // Verify that loginUser was NOT called
        expect(mockLoginUser).not.toHaveBeenCalled();

        // Verify localStorage was NOT updated
        expect(localStorage.getItem('userId')).toBe('old-user-id-123');

        // Verify error toast was shown
        expect(toast.error).toHaveBeenCalledWith(
            expect.objectContaining({
                props: expect.objectContaining({
                    children: 'Something went wrong during login.'
                })
            })
        );
    });
});