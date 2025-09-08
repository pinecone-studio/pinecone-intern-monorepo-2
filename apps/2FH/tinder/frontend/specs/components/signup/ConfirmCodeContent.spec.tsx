import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmCodeContent } from '../../../src/components/signup/ConfirmCodeContent';

const mockProps = {
  email: 'test@example.com',
  code: ['1', '2', '3', '4'],
  inputsRef: { current: [] },
  handleChange: jest.fn(),
  handleKeyDown: jest.fn(),
  loading: false,
  handleVerify: jest.fn(),
  timer: 0,
  resending: false,
  handleResend: jest.fn(),
};

describe('ConfirmCodeContent Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the OTP confirmation form correctly', () => {
    render(<ConfirmCodeContent {...mockProps} />);

    expect(screen.getByText('Confirm your email')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText(/To continue, enter the secure code we sent to/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /verify/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send again/i })).toBeInTheDocument();
  });

  it('should display 4 OTP input fields', () => {
    render(<ConfirmCodeContent {...mockProps} />);

    const otpInputs = screen.getAllByRole('textbox');
    expect(otpInputs).toHaveLength(4);

    otpInputs.forEach((input, index) => {
      expect(input).toHaveValue(mockProps.code[index]);
    });
  });

  it('should call handleVerify when verify button is clicked', () => {
    render(<ConfirmCodeContent {...mockProps} />);

    const verifyButton = screen.getByRole('button', { name: /verify/i });
    fireEvent.click(verifyButton);

    expect(mockProps.handleVerify).toHaveBeenCalledTimes(1);
  });

  it('should call handleResend when resend button is clicked', () => {
    render(<ConfirmCodeContent {...mockProps} />);

    const resendButton = screen.getByRole('button', { name: /send again/i });
    fireEvent.click(resendButton);

    expect(mockProps.handleResend).toHaveBeenCalledTimes(1);
  });

  it('should disable verify button when loading', () => {
    render(<ConfirmCodeContent {...mockProps} loading={true} />);

    const verifyButton = screen.getByRole('button', { name: /verifying/i });
    expect(verifyButton).toBeDisabled();
  });

  it('should disable verify button when OTP is incomplete', () => {
    const incompleteCode = ['1', '2', '', ''];
    render(<ConfirmCodeContent {...mockProps} code={incompleteCode} />);

    const verifyButton = screen.getByRole('button', { name: /verify/i });
    expect(verifyButton).toBeDisabled();
  });

  it('should show timer when resend is disabled', () => {
    render(<ConfirmCodeContent {...mockProps} timer={15} />);

    const resendButton = screen.getByRole('button', { name: /send again \(15\)/i });
    expect(resendButton).toBeDisabled();
  });

  it('should show resending state', () => {
    render(<ConfirmCodeContent {...mockProps} resending={true} />);

    const resendButton = screen.getByRole('button', { name: /sending/i });
    expect(resendButton).toBeDisabled();
  });

  it('should call handleChange when OTP input changes', () => {
    render(<ConfirmCodeContent {...mockProps} />);

    const firstInput = screen.getAllByRole('textbox')[0];
    fireEvent.change(firstInput, { target: { value: '5' } });

    expect(mockProps.handleChange).toHaveBeenCalledWith('5', 0);
  });

  it('should call handleKeyDown when key is pressed in OTP input', () => {
    render(<ConfirmCodeContent {...mockProps} />);

    const firstInput = screen.getAllByRole('textbox')[0];
    fireEvent.keyDown(firstInput, { key: 'Backspace' });

    expect(mockProps.handleKeyDown).toHaveBeenCalledWith(expect.objectContaining({ key: 'Backspace' }), 0);
  });
});
