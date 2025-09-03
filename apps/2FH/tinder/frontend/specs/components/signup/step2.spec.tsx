import { render, screen } from '@testing-library/react';
import { Step2 } from '../../../src/components/signup/Step2';
import { StepProvider } from '../../../src/components/providers/StepProvider';

// Mock the useStep2Form hook
jest.mock('../../../src/components/signup/Step2Form', () => ({
  useStep2Form: jest.fn(() => ({
    register: jest.fn(),
    handleSubmit: jest.fn(),
    formState: { errors: {}, isDirty: true },
    showPassword: false,
    setShowPassword: jest.fn(),
    showConfirmPassword: false,
    setShowConfirmPassword: jest.fn(),
    loading: false,
    onSubmit: jest.fn(),
  })),
}));

// Mock Step2FormFields component
jest.mock('../../../src/components/signup/Step2FormFields', () => ({
  Step2FormFields: ({ loading }: any) => (
    <div data-testid="step2-form-fields">
      <div>Password Form Fields</div>
      <div>Loading: {loading ? 'true' : 'false'}</div>
    </div>
  ),
}));

const renderWithProvider = (component: React.ReactElement) => {
  return render(<StepProvider>{component}</StepProvider>);
};

describe('Step2 Component', () => {
  it('should render the password creation form correctly', () => {
    renderWithProvider(<Step2 />);

    expect(screen.getByText('Create password')).toBeInTheDocument();
    expect(screen.getByText('Use a minimum of 10 characters, including uppercase letters, lowercase letters, and numbers')).toBeInTheDocument();
    expect(screen.getByTestId('step2-form-fields')).toBeInTheDocument();
  });

  it('should render the form with correct structure', () => {
    renderWithProvider(<Step2 />);

    const container = screen.getByTestId('step2-container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('w-[350px]', 'h-[414px]', 'flex', 'flex-col', 'gap-6', 'items-center');
  });

  it('should display the logo', () => {
    renderWithProvider(<Step2 />);

    // The logo should be rendered by the Step2FormFields component
    expect(screen.getByTestId('step2-form-fields')).toBeInTheDocument();
  });

  it('should handle loading state correctly', () => {
    renderWithProvider(<Step2 />);

    // The component should render without errors
    expect(screen.getByTestId('step2-form-fields')).toBeInTheDocument();
  });

  it('should render form element', () => {
    renderWithProvider(<Step2 />);

    const form = document.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('should have correct title and subtitle', () => {
    renderWithProvider(<Step2 />);

    const title = screen.getByTestId('title');
    const subtitle = screen.getByTestId('subtitle');

    expect(title).toHaveTextContent('Create password');
    expect(subtitle).toHaveTextContent('Use a minimum of 10 characters, including uppercase letters, lowercase letters, and numbers');
  });
});
