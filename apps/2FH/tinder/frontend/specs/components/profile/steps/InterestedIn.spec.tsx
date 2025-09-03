import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InterestedInSelection } from '@/components/profile/steps/InterestedIn';
import { useSignup } from '@/components/profile/SignupContext';

// Mock the context
const mockNextStep = jest.fn();
const mockHandleInputChange = jest.fn();

jest.mock('@/components/profile/SignupContext', () => ({
    useSignup: jest.fn(),
}));

describe('InterestedInSelection - Full Coverage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const setup = (interestedInValue: string | null = null) => {
        (useSignup as jest.Mock).mockReturnValue({
            signupData: { interestedIn: interestedInValue },
            handleInputChange: mockHandleInputChange,
            nextStep: mockNextStep,
        });

        render(<InterestedInSelection />);
    };

    test('renders input and Next button disabled initially', () => {
        setup();
        const input = screen.getByPlaceholderText('Select interested in');
        const nextButton = screen.getByRole('button', { name: /Next/i });

        expect(input).toBeInTheDocument();
        expect(nextButton).toBeDisabled();
    });

    test('renders with preselected value and Next button enabled', () => {
        setup('Both');
        const input = screen.getByDisplayValue('Both');
        const nextButton = screen.getByRole('button', { name: /Next/i });

        expect(input).toBeInTheDocument();
        expect(nextButton).not.toBeDisabled();
    });

    test('opens and closes dropdown on input focus and button click', () => {
        setup();

        const input = screen.getByPlaceholderText('Select interested in');
        act(() => {
            fireEvent.focus(input);
        });

        expect(screen.getByText('Male')).toBeVisible();

        // Click toggle button
        const toggleButton = screen.getByRole('button', { name: '' });
        act(() => {
            fireEvent.click(toggleButton);
        });
        expect(screen.queryByText('Male')).not.toBeInTheDocument();
    });

    test('selecting an option calls handleInputChange and closes dropdown', () => {
        setup();

        const input = screen.getByPlaceholderText('Select interested in');
        act(() => {
            fireEvent.focus(input);
        });

        const option = screen.getByText('Female');
        act(() => {
            fireEvent.click(option);
        });

        expect(mockHandleInputChange).toHaveBeenCalledWith({ interestedIn: 'Female' });
        expect(screen.queryByText('Female')).not.toBeInTheDocument();
    });

    test('Next button calls nextStep when enabled', () => {
        setup('Male');

        const nextButton = screen.getByRole('button', { name: /Next/i });
        act(() => {
            fireEvent.click(nextButton);
        });

        expect(mockNextStep).toHaveBeenCalled();
    });

    test('dropdown closes when clicking outside', () => {
        setup();

        const input = screen.getByPlaceholderText('Select interested in');
        act(() => {
            fireEvent.focus(input);
        });
        expect(screen.getByText('Male')).toBeVisible();

        act(() => {
            fireEvent.mouseDown(document.body);
        });
        expect(screen.queryByText('Male')).not.toBeInTheDocument();
    });

    test('does not close dropdown when clicking inside', () => {
        setup();

        const input = screen.getByPlaceholderText('Select interested in');
        act(() => {
            fireEvent.focus(input);
        });
        expect(screen.getByText('Male')).toBeVisible();

        act(() => {
            fireEvent.mouseDown(input);
        });
        expect(screen.getByText('Male')).toBeVisible();
    });

    test('dropdown toggles correctly with multiple clicks', () => {
        setup();

        const input = screen.getByPlaceholderText('Select interested in');
        act(() => {
            fireEvent.focus(input);
        });
        expect(screen.getByText('Male')).toBeVisible();

        act(() => {
            fireEvent.focus(input); // focus again should not break
        });
        expect(screen.getByText('Male')).toBeVisible();

        const toggleButton = screen.getByRole('button', { name: '' });
        act(() => {
            fireEvent.click(toggleButton); // closes
        });
        expect(screen.queryByText('Male')).not.toBeInTheDocument();

        act(() => {
            fireEvent.click(toggleButton); // opens again
        });
        expect(screen.getByText('Male')).toBeVisible();
    });
});
