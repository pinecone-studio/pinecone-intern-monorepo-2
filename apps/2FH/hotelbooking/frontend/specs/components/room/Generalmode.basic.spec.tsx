import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Generalmode } from '../../../src/components/room/Generalmode';

jest.mock('../../../src/components/room/GeneralForm', () => ({
  GeneralForm: ({ formData, errors, onInputChange }: any) => (
    <div data-testid="general-form">
      <input data-testid="name-input" value={formData?.name || ''} onChange={(e: any) => onInputChange('name', e.target.value)} placeholder="Room name" />
      <input data-testid="price-input" value={formData?.pricePerNight || ''} onChange={(e: any) => onInputChange('pricePerNight', e.target.value)} placeholder="Price" />
      <select data-testid="type-select" value={formData?.type?.[0] || ''} onChange={(e: any) => onInputChange('type', [e.target.value])}>
        <option value="">Select type</option>
        <option value="Single">Single</option>
        <option value="Double">Double</option>
      </select>
      <div data-testid="errors-display" style={{ display: 'none' }}>
        {JSON.stringify(errors)}
      </div>
    </div>
  ),
}));

describe('Generalmode Basic', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSave: jest.fn(),
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    render(<Generalmode {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('General Info')).not.toBeInTheDocument();
  });

  it('should render modal when isOpen is true', () => {
    render(<Generalmode {...defaultProps} />);
    expect(screen.getByText('General Info')).toBeInTheDocument();
    expect(screen.getByTestId('general-form')).toBeInTheDocument();
  });

  it('should initialize with empty form data when no initialData provided', () => {
    render(<Generalmode {...defaultProps} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('price-input')).toHaveValue('');
    expect(screen.getByTestId('type-select')).toHaveValue('');
  });

  it('should initialize with provided initialData', () => {
    const initialData = {
      name: 'Test Room',
      type: ['Single'],
      pricePerNight: '100',
      roomInformation: ['WiFi'],
    };
    render(<Generalmode {...defaultProps} initialData={initialData} />);
    expect(screen.getByTestId('name-input')).toHaveValue('Test Room');
    expect(screen.getByTestId('price-input')).toHaveValue('100');
    expect(screen.getByTestId('type-select')).toHaveValue('Single');
  });

  it('should update form data when initialData changes', async () => {
    const { rerender } = render(<Generalmode {...defaultProps} />);
    const newInitialData = {
      name: 'Updated Room',
      type: ['Double'],
      pricePerNight: '200',
      roomInformation: ['AC'],
    };
    rerender(<Generalmode {...defaultProps} initialData={newInitialData} />);
    await waitFor(() => {
      expect(screen.getByTestId('name-input')).toHaveValue('Updated Room');
      expect(screen.getByTestId('price-input')).toHaveValue('200');
      expect(screen.getByTestId('type-select')).toHaveValue('Double');
    });
  });

  it('should handle form input changes', () => {
    render(<Generalmode {...defaultProps} />);
    const nameInput = screen.getByTestId('name-input');
    const priceInput = screen.getByTestId('price-input');
    const typeSelect = screen.getByTestId('type-select');
    fireEvent.change(nameInput, { target: { value: 'New Room Name' } });
    fireEvent.change(priceInput, { target: { value: '150' } });
    fireEvent.change(typeSelect, { target: { value: 'Double' } });
    expect(nameInput).toHaveValue('New Room Name');
    expect(priceInput).toHaveValue('150');
    expect(typeSelect).toHaveValue('Double');
  });

  it('should initialize errors object for form validation', () => {
    render(<Generalmode {...defaultProps} />);
    expect(screen.getByTestId('general-form')).toBeInTheDocument();
    expect(screen.getByTestId('errors-display')).toBeInTheDocument();
    expect(screen.getByTestId('errors-display')).toHaveTextContent('{}');
  });

  it('should handle errors object conditional check', () => {
    render(<Generalmode {...defaultProps} />);
    expect(screen.getByTestId('general-form')).toBeInTheDocument();
  });

  it('should handle loading parameter default value', () => {
    const { onClose, onSave, isOpen, initialData } = defaultProps;
    render(<Generalmode onClose={onClose} onSave={onSave} isOpen={isOpen} initialData={initialData} />);
    expect(screen.getByTestId('general-form')).toBeInTheDocument();
  });

  it('should handle loading parameter with true value', () => {
    render(<Generalmode {...defaultProps} loading={true} />);
    expect(screen.getByTestId('general-form')).toBeInTheDocument();
  });

  it('should render with proper modal structure', () => {
    const { container } = render(<Generalmode {...defaultProps} />);
    const modal = container.querySelector('[data-cy="General-Modal"]');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveClass('fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'flex', 'items-center', 'justify-center', 'z-50');
  });

  it('should render modal content with proper styling', () => {
    const { container } = render(<Generalmode {...defaultProps} />);
    const modalContent = container.querySelector('.bg-white.rounded-lg.p-6');
    expect(modalContent).toBeInTheDocument();
    expect(modalContent).toHaveClass('w-full', 'max-w-md', 'mx-4');
  });
});
