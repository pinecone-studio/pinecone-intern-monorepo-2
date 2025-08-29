import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from '@jest/globals';
import '@testing-library/jest-dom';
import { StepProvider, useStep } from '../../../src/components/providers/stepProvider';

// Test component to use the hook
const TestComponent = () => {
  const { step, setStep, values, setValues } = useStep();

  return (
    <div>
      <div data-testid="current-step">Step: {step}</div>
      <div data-testid="current-email">Email: {values.email}</div>
      <div data-testid="current-password">Password: {values.password}</div>
      <button data-testid="next-step" onClick={() => setStep(step + 1)}>
        Next Step
      </button>
      <button data-testid="set-email" onClick={() => setValues((prev) => ({ ...prev, email: 'test@example.com' }))}>
        Set Email
      </button>
      <button data-testid="set-password" onClick={() => setValues((prev) => ({ ...prev, password: 'password123' }))}>
        Set Password
      </button>
    </div>
  );
};

describe('StepProvider', () => {
  beforeEach(() => {
    // Clear any previous renders
  });

  it('should render children without crashing', () => {
    render(
      <StepProvider>
        <div data-testid="test-child">Test Child</div>
      </StepProvider>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('should provide initial step value of 1', () => {
    render(
      <StepProvider>
        <TestComponent />
      </StepProvider>
    );

    expect(screen.getByTestId('current-step')).toHaveTextContent('Step: 1');
  });

  it('should provide initial empty form values', () => {
    render(
      <StepProvider>
        <TestComponent />
      </StepProvider>
    );

    expect(screen.getByTestId('current-email')).toHaveTextContent('Email:');
    expect(screen.getByTestId('current-password')).toHaveTextContent('Password:');
  });

  it('should update step when setStep is called', () => {
    render(
      <StepProvider>
        <TestComponent />
      </StepProvider>
    );

    const nextStepButton = screen.getByTestId('next-step');

    act(() => {
      nextStepButton.click();
    });

    expect(screen.getByTestId('current-step')).toHaveTextContent('Step: 2');
  });

  it('should update email when setValues is called', () => {
    render(
      <StepProvider>
        <TestComponent />
      </StepProvider>
    );

    const setEmailButton = screen.getByTestId('set-email');

    act(() => {
      setEmailButton.click();
    });

    expect(screen.getByTestId('current-email')).toHaveTextContent('Email: test@example.com');
  });

  it('should update password when setValues is called', () => {
    render(
      <StepProvider>
        <TestComponent />
      </StepProvider>
    );

    const setPasswordButton = screen.getByTestId('set-password');

    act(() => {
      setPasswordButton.click();
    });

    expect(screen.getByTestId('current-password')).toHaveTextContent('Password: password123');
  });

  it('should maintain other values when updating a single field', () => {
    render(
      <StepProvider>
        <TestComponent />
      </StepProvider>
    );

    // Set email first
    const setEmailButton = screen.getByTestId('set-email');
    act(() => {
      setEmailButton.click();
    });

    // Then set password
    const setPasswordButton = screen.getByTestId('set-password');
    act(() => {
      setPasswordButton.click();
    });

    // Both should be set
    expect(screen.getByTestId('current-email')).toHaveTextContent('Email: test@example.com');
    expect(screen.getByTestId('current-password')).toHaveTextContent('Password: password123');
  });

  it('should increment step multiple times correctly', () => {
    render(
      <StepProvider>
        <TestComponent />
      </StepProvider>
    );

    const nextStepButton = screen.getByTestId('next-step');

    // Click multiple times
    act(() => {
      nextStepButton.click(); // Step 1 -> 2
    });
    act(() => {
      nextStepButton.click(); // Step 2 -> 3
    });
    act(() => {
      nextStepButton.click(); // Step 3 -> 4
    });

    expect(screen.getByTestId('current-step')).toHaveTextContent('Step: 4');
  });

  it('should provide the same context instance to all children', () => {
    const TestComponent2 = () => {
      const { step, setStep } = useStep();
      return (
        <div>
          <div data-testid="step-2">Step 2: {step}</div>
          <button data-testid="increment-step" onClick={() => setStep(step + 1)}>
            Increment
          </button>
        </div>
      );
    };

    render(
      <StepProvider>
        <TestComponent />
        <TestComponent2 />
      </StepProvider>
    );

    // Both components should show the same step
    expect(screen.getByTestId('current-step')).toHaveTextContent('Step: 1');
    expect(screen.getByTestId('step-2')).toHaveTextContent('Step 2: 1');

    // Clicking increment in one component should update both
    const incrementButton = screen.getByTestId('increment-step');
    act(() => {
      incrementButton.click();
    });

    expect(screen.getByTestId('current-step')).toHaveTextContent('Step: 2');
    expect(screen.getByTestId('step-2')).toHaveTextContent('Step 2: 2');
  });
});
