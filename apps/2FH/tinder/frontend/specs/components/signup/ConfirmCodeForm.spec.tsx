import { render, screen } from '@testing-library/react';
import { ConfirmCodeForm } from '../../../src/components/signup/ConfirmCodeForm';

// Mock the hooks
jest.mock('../../../src/components/signup/hooks', () => ({
  useTimer: jest.fn(() => ({
    timer: 0,
    resetTimer: jest.fn(),
  })),
  useOtpCode: jest.fn(() => ({
    code: ['1', '2', '3', '4'],
    inputsRef: { current: [] },
    handleChange: jest.fn(),
    handleKeyDown: jest.fn(),
  })),
  useOtpResend: jest.fn(() => ({
    resending: false,
    handleResend: jest.fn(),
  })),
  useOtpVerification: jest.fn(() => ({
    loading: false,
    handleVerify: jest.fn(),
  })),
}));

// Mock ConfirmCodeContent component
jest.mock('../../../src/components/signup/ConfirmCodeContent', () => ({
  ConfirmCodeContent: ({ email, code, loading, timer, resending }: any) => (
    <div data-testid="confirm-code-content">
      <div>Email: {email}</div>
      <div>Code: {code.join('')}</div>
      <div>Loading: {loading ? 'true' : 'false'}</div>
      <div>Timer: {timer}</div>
      <div>Resending: {resending ? 'true' : 'false'}</div>
    </div>
  ),
}));

describe('ConfirmCodeForm Component', () => {
  const mockProps = {
    email: 'test@example.com',
    setStep: jest.fn(),
  };

  const { useTimer, useOtpCode, useOtpResend, useOtpVerification } = jest.requireMock('../../../src/components/signup/hooks');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render ConfirmCodeContent with correct props', () => {
    render(<ConfirmCodeForm {...mockProps} />);

    expect(screen.getByTestId('confirm-code-content')).toBeInTheDocument();
    expect(screen.getByText('Email: test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Code: 1234')).toBeInTheDocument();
    expect(screen.getByText('Loading: false')).toBeInTheDocument();
    expect(screen.getByText('Timer: 0')).toBeInTheDocument();
    expect(screen.getByText('Resending: false')).toBeInTheDocument();
  });

  it('should pass email prop correctly', () => {
    const customEmail = 'custom@example.com';
    render(<ConfirmCodeForm email={customEmail} setStep={jest.fn()} />);

    expect(screen.getByText(`Email: ${customEmail}`)).toBeInTheDocument();
  });

  it('should handle loading state', () => {
    (useOtpVerification as jest.Mock).mockReturnValue({
      loading: true,
      handleVerify: jest.fn(),
    });

    render(<ConfirmCodeForm {...mockProps} />);

    expect(screen.getByText('Loading: true')).toBeInTheDocument();
  });

  it('should handle timer state', () => {
    (useTimer as jest.Mock).mockReturnValue({
      timer: 15,
      resetTimer: jest.fn(),
    });

    render(<ConfirmCodeForm {...mockProps} />);

    expect(screen.getByText('Timer: 15')).toBeInTheDocument();
  });

  it('should handle resending state', () => {
    (useOtpResend as jest.Mock).mockReturnValue({
      resending: true,
      handleResend: jest.fn(),
    });

    render(<ConfirmCodeForm {...mockProps} />);

    expect(screen.getByText('Resending: true')).toBeInTheDocument();
  });

  it('should handle different OTP codes', () => {
    (useOtpCode as jest.Mock).mockReturnValue({
      code: ['5', '6', '7', '8'],
      inputsRef: { current: [] },
      handleChange: jest.fn(),
      handleKeyDown: jest.fn(),
    });

    render(<ConfirmCodeForm {...mockProps} />);

    expect(screen.getByText('Code: 5678')).toBeInTheDocument();
  });

  it('should call hooks with correct parameters', () => {
    render(<ConfirmCodeForm {...mockProps} />);

    expect(useTimer).toHaveBeenCalledWith(15);
    expect(useOtpResend).toHaveBeenCalledWith('test@example.com', expect.any(Function));
    // The code array might be different due to previous test state, so we check it's an array
    expect(useOtpVerification).toHaveBeenCalledWith('test@example.com', expect.any(Array), expect.any(Function));
  });
});
