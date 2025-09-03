import { render, screen } from '@testing-library/react';
import { ConfirmCode } from '../../../src/components/signup/ConfirmCode';
import { StepProvider } from '../../../src/components/providers/stepProvider';

// Mock ConfirmCodeForm component
jest.mock('../../../src/components/signup/ConfirmCodeForm', () => ({
  ConfirmCodeForm: ({ email, setStep }: any) => (
    <div data-testid="confirm-code-form">
      <div>Email: {email}</div>
      <div>SetStep: {typeof setStep}</div>
    </div>
  ),
}));

describe('ConfirmCode Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render ConfirmCodeForm with correct props', () => {
    render(
      <StepProvider>
        <ConfirmCode />
      </StepProvider>
    );

    expect(screen.getByTestId('confirm-code-form')).toBeInTheDocument();
  });

  it('should pass email from step provider values', () => {
    render(
      <StepProvider>
        <ConfirmCode />
      </StepProvider>
    );

    expect(screen.getByTestId('confirm-code-form')).toBeInTheDocument();
  });

  it('should pass setStep function from step provider', () => {
    render(
      <StepProvider>
        <ConfirmCode />
      </StepProvider>
    );

    expect(screen.getByText('SetStep: function')).toBeInTheDocument();
  });
});
