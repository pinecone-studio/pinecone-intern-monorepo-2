import { render, screen, fireEvent } from '@testing-library/react';
import { Logo, EyeIcon, OtpInputs } from '../../../src/components/signup/SharedComponents';

describe('SharedComponents', () => {
  describe('Logo Component', () => {
    it('should render logo with default testId', () => {
      render(<Logo />);

      const logo = screen.getByTestId('logo');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('alt', 'logo');
      // Next.js Image component transforms the src, so we check it contains the original path
      expect(logo).toHaveAttribute('src', expect.stringContaining('logo.png'));
    });

    it('should render logo with custom testId', () => {
      render(<Logo testId="custom-logo" />);

      const logo = screen.getByTestId('custom-logo');
      expect(logo).toBeInTheDocument();
    });
  });

  describe('EyeIcon Component', () => {
    it('should render visible eye icon', () => {
      const mockOnClick = jest.fn();
      render(<EyeIcon isVisible={true} onClick={mockOnClick} testId="eye-icon" />);

      const eyeIcon = screen.getByTestId('eye-icon');
      expect(eyeIcon).toBeInTheDocument();
      const image = eyeIcon.querySelector('img');
      expect(image).toHaveAttribute('src', expect.stringContaining('visible.png'));
    });

    it('should render hidden eye icon', () => {
      const mockOnClick = jest.fn();
      render(<EyeIcon isVisible={false} onClick={mockOnClick} testId="eye-icon" />);

      const eyeIcon = screen.getByTestId('eye-icon');
      expect(eyeIcon).toBeInTheDocument();
      const image = eyeIcon.querySelector('img');
      expect(image).toHaveAttribute('src', expect.stringContaining('eyehide.png'));
    });

    it('should call onClick when clicked', () => {
      const mockOnClick = jest.fn();
      render(<EyeIcon isVisible={true} onClick={mockOnClick} testId="eye-icon" />);

      const eyeIcon = screen.getByTestId('eye-icon');
      fireEvent.click(eyeIcon);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should render with custom testId', () => {
      const mockOnClick = jest.fn();
      render(<EyeIcon isVisible={true} onClick={mockOnClick} testId="custom-eye" />);

      const eyeIcon = screen.getByTestId('custom-eye');
      expect(eyeIcon).toBeInTheDocument();
    });
  });

  describe('OtpInputs Component', () => {
    const mockProps = {
      code: ['1', '2', '3', '4'],
      inputsRef: { current: [] },
      handleChange: jest.fn(),
      handleKeyDown: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should render 4 OTP input fields', () => {
      render(<OtpInputs {...mockProps} />);

      const inputs = screen.getAllByRole('textbox');
      expect(inputs).toHaveLength(4);

      inputs.forEach((input, index) => {
        expect(input).toHaveValue(mockProps.code[index]);
        expect(input).toHaveAttribute('type', 'text');
        expect(input).toHaveAttribute('inputMode', 'numeric');
        expect(input).toHaveAttribute('maxLength', '1');
      });
    });

    it('should call handleChange when input value changes', () => {
      render(<OtpInputs {...mockProps} />);

      const firstInput = screen.getAllByRole('textbox')[0];
      fireEvent.change(firstInput, { target: { value: '5' } });

      expect(mockProps.handleChange).toHaveBeenCalledWith('5', 0);
    });

    it('should call handleKeyDown when key is pressed', () => {
      render(<OtpInputs {...mockProps} />);

      const firstInput = screen.getAllByRole('textbox')[0];
      fireEvent.keyDown(firstInput, { key: 'Backspace' });

      expect(mockProps.handleKeyDown).toHaveBeenCalledWith(expect.objectContaining({ key: 'Backspace' }), 0);
    });

    it('should render with default testId', () => {
      render(<OtpInputs {...mockProps} />);

      const container = screen.getByTestId('otp-inputs-container');
      expect(container).toBeInTheDocument();
    });

    it('should render with custom testId', () => {
      render(<OtpInputs {...mockProps} testId="custom-otp" />);

      const container = screen.getByTestId('custom-otp');
      expect(container).toBeInTheDocument();
    });

    it('should have correct data-testid for each input', () => {
      render(<OtpInputs {...mockProps} />);

      for (let i = 0; i < 4; i++) {
        const input = screen.getByTestId(`otp-input-${i}`);
        expect(input).toBeInTheDocument();
      }
    });

    it('should handle empty code array', () => {
      render(<OtpInputs {...mockProps} code={[]} />);

      const inputs = screen.queryAllByRole('textbox');
      expect(inputs).toHaveLength(0);
    });
  });
});
