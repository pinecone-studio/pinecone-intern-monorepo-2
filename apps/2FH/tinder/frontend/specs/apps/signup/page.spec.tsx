import { render, screen } from '@testing-library/react';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import '@testing-library/jest-dom';
import Signup from '../../../src/app/signup/page';

// Mock the step provider hook
const mockUseStep = jest.fn();
jest.mock('../../../src/components/providers/stepProvider', () => ({
  useStep: () => mockUseStep(),
}));

// Mock the step components
jest.mock('../../../src/components/signup/step1', () => ({
  Step1: () => <div data-testid="step1">Step 1 Component</div>,
}));

jest.mock('../../../src/components/signup/step2', () => ({
  Step2: () => <div data-testid="step2">Step 2 Component</div>,
}));

jest.mock('../../../src/components/signup/confirmCode', () => ({
  ConfirmCode: () => <div data-testid="confirm-code">Confirm Code Component</div>,
}));

describe('Signup Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Step1 when step is 1', () => {
    mockUseStep.mockReturnValue({ step: 1 });

    render(<Signup />);

    expect(screen.getByTestId('step1')).toBeInTheDocument();
    expect(screen.queryByTestId('step2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('confirm-code')).not.toBeInTheDocument();
  });

  it('renders ConfirmCode when step is 2', () => {
    mockUseStep.mockReturnValue({ step: 2 });

    render(<Signup />);

    expect(screen.getByTestId('confirm-code')).toBeInTheDocument();
    expect(screen.queryByTestId('step1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('step2')).not.toBeInTheDocument();
  });

  it('renders Step2 when step is 3', () => {
    mockUseStep.mockReturnValue({ step: 3 });

    render(<Signup />);

    expect(screen.getByTestId('step2')).toBeInTheDocument();
    expect(screen.queryByTestId('step1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('confirm-code')).not.toBeInTheDocument();
  });

  it('renders no step components when step is not 1, 2, or 3', () => {
    mockUseStep.mockReturnValue({ step: 4 });

    render(<Signup />);

    expect(screen.queryByTestId('step1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('step2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('confirm-code')).not.toBeInTheDocument();
  });

  it('always renders the copyright footer', () => {
    mockUseStep.mockReturnValue({ step: 1 });

    render(<Signup />);

    expect(screen.getByText('©2024 Tinder')).toBeInTheDocument();
  });

  it('applies correct CSS classes to main container', () => {
    mockUseStep.mockReturnValue({ step: 1 });

    const { container } = render(<Signup />);
    const mainDiv = container.firstChild;

    expect(mainDiv).toHaveClass(
      'w-full',
      'h-screen',
      'flex',
      'flex-col',
      'items-center',
      'justify-center',
      'relaitve' // Note: keeping the typo from original code
    );
  });

  it('applies correct CSS classes to footer', () => {
    mockUseStep.mockReturnValue({ step: 1 });

    render(<Signup />);
    const footer = screen.getByText('©2024 Tinder');

    expect(footer).toHaveClass('absolute', 'bottom-10', 'text-[14px]', 'font-light', 'text-[#71717a]');
  });

  it('calls useStep hook', () => {
    mockUseStep.mockReturnValue({ step: 1 });

    render(<Signup />);

    expect(mockUseStep).toHaveBeenCalledTimes(1);
  });

  describe('Step transitions', () => {
    it('correctly transitions from step 1 to step 2', () => {
      const { rerender } = render(<Signup />);

      // Start at step 1
      mockUseStep.mockReturnValue({ step: 1 });
      rerender(<Signup />);
      expect(screen.getByTestId('step1')).toBeInTheDocument();

      // Move to step 2
      mockUseStep.mockReturnValue({ step: 2 });
      rerender(<Signup />);
      expect(screen.getByTestId('confirm-code')).toBeInTheDocument();
      expect(screen.queryByTestId('step1')).not.toBeInTheDocument();
    });

    it('correctly transitions from step 2 to step 3', () => {
      const { rerender } = render(<Signup />);

      // Start at step 2
      mockUseStep.mockReturnValue({ step: 2 });
      rerender(<Signup />);
      expect(screen.getByTestId('confirm-code')).toBeInTheDocument();

      // Move to step 3
      mockUseStep.mockReturnValue({ step: 3 });
      rerender(<Signup />);
      expect(screen.getByTestId('step2')).toBeInTheDocument();
      expect(screen.queryByTestId('confirm-code')).not.toBeInTheDocument();
    });
  });
});
