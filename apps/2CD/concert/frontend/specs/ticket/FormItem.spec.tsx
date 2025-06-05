/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import { FormItemComp } from '@/app/(admin)/ticket/_components';
import { ControllerRenderProps } from 'react-hook-form';
import '@testing-library/jest-dom';
jest.mock('@/components/ui/form', () => ({
  FormControl: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="form-control">{children}</div>
  ),
  FormItem: ({ children, ...props }: { children: React.ReactNode }) => (
    <div {...props}>{children}</div>
  ),
  FormLabel: ({ children, ...props }: { children: React.ReactNode }) => (
    <label {...props}>{children}</label>
  ),
  FormMessage: (props: any) => <div data-testid="form-message" {...props} />,
}));
jest.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input {...props} />,
}));
const createMockField = (overrides = {}): ControllerRenderProps<any, any> => ({
  name: 'testField',
  value: '',
  onChange: jest.fn(),
  onBlur: jest.fn(),
  ref: jest.fn(),
  ...overrides,
});
describe('FormItemComp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders with correct structure and data-testids', () => {
    const mockField = createMockField();
    const label = 'Test Label';
    render(<FormItemComp label={label} field={mockField} />);
    expect(screen.getByTestId('form-item')).toBeInTheDocument();
    expect(screen.getByTestId('form-label')).toBeInTheDocument();
    expect(screen.getByTestId('form-control')).toBeInTheDocument();
    expect(screen.getByTestId('input')).toBeInTheDocument();
    expect(screen.getByTestId('form-message')).toBeInTheDocument();
  });
  it('displays the correct label text', () => {
    const mockField = createMockField();
    const label = 'Username';
    render(<FormItemComp label={label} field={mockField} />);
    const labelElement = screen.getByTestId('form-label');
    expect(labelElement).toHaveTextContent('Username');
  });
  it('passes field props to input component', () => {
    const mockField = createMockField({
      name: 'email',
      value: 'test@example.com',
      onChange: jest.fn(),
      onBlur: jest.fn(),
    });
    render(<FormItemComp label="Email" field={mockField} />);
    const inputElement = screen.getByTestId('input');
    expect(inputElement).toHaveAttribute('name', 'email');
    expect(inputElement).toHaveValue('test@example.com');
  });
  it('spreads all field props to the input', () => {
    const mockField = createMockField({
      name: 'testName',
      value: 'testValue',
      onChange: jest.fn(),
      onBlur: jest.fn(),
      disabled: true,
      placeholder: 'Enter text',
    });
    render(<FormItemComp label="Test" field={mockField} />);
    const inputElement = screen.getByTestId('input');
    expect(inputElement).toHaveAttribute('name', 'testName');
    expect(inputElement).toHaveValue('testValue');
    expect(inputElement).toHaveAttribute('disabled');
    expect(inputElement).toHaveAttribute('placeholder', 'Enter text');
  });
  it('renders with empty label', () => {
    const mockField = createMockField();
    render(<FormItemComp label="" field={mockField} />);
    const labelElement = screen.getByTestId('form-label');
    expect(labelElement).toHaveTextContent('');
  });
  it('handles undefined/null field values gracefully', () => {
    const mockField = createMockField({
      value: undefined,
    });
    render(<FormItemComp label="Test" field={mockField} />);
    const inputElement = screen.getByTestId('input');
    expect(inputElement).toBeInTheDocument();
  });
  describe('TypeScript generics', () => {
    it('works with typed form data', () => {
      interface TestFormData {
        username: string;
        email: string;
      }
      const mockField: ControllerRenderProps<TestFormData, 'username'> = {
        name: 'username',
        value: 'testuser',
        onChange: jest.fn(),
        onBlur: jest.fn(),
        ref: jest.fn(),
      };
      render(<FormItemComp<TestFormData, 'username'> label="Username" field={mockField} />);
      expect(screen.getByTestId('input')).toHaveValue('testuser');
      expect(screen.getByTestId('form-label')).toHaveTextContent('Username');
    });
  });
  describe('Accessibility', () => {
    it('maintains proper form structure for screen readers', () => {
      const mockField = createMockField();
      render(<FormItemComp label="Accessible Field" field={mockField} />);
      expect(screen.getByTestId('form-item')).toBeInTheDocument();
      expect(screen.getByTestId('form-label')).toBeInTheDocument();
      expect(screen.getByTestId('form-control')).toBeInTheDocument();
      expect(screen.getByTestId('input')).toBeInTheDocument();
      expect(screen.getByTestId('form-message')).toBeInTheDocument();
    });
  });
});