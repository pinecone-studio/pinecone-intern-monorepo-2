import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
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

describe('Generalmode useEffect Complex Types', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSave: jest.fn(),
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle useEffect with function initialData', () => {
    render(
      <Generalmode
        {...defaultProps}
        initialData={
          (() => {
            // Mock function
          }) as any
        }
      />
    );
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('price-input')).toHaveValue('');
    expect(screen.getByTestId('type-select')).toHaveValue('');
  });

  it('should handle useEffect with symbol initialData', () => {
    render(<Generalmode {...defaultProps} initialData={Symbol() as any} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('price-input')).toHaveValue('');
    expect(screen.getByTestId('type-select')).toHaveValue('');
  });

  it('should handle useEffect with bigint initialData', () => {
    render(<Generalmode {...defaultProps} initialData={BigInt(123) as any} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('price-input')).toHaveValue('');
    expect(screen.getByTestId('type-select')).toHaveValue('');
  });

  it('should handle useEffect with object with null prototype initialData', () => {
    const objWithNullProto = Object.create(null);
    render(<Generalmode {...defaultProps} initialData={objWithNullProto as any} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('price-input')).toHaveValue('');
    expect(screen.getByTestId('type-select')).toHaveValue('');
  });

  it('should handle useEffect with object with custom prototype initialData', () => {
    const CustomClass = function () {
      // Custom class constructor
    };
    const customInstance = new (CustomClass as any)();
    render(<Generalmode {...defaultProps} initialData={customInstance as any} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('price-input')).toHaveValue('');
    expect(screen.getByTestId('type-select')).toHaveValue('');
  });
});
