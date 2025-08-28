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

describe('Generalmode Object Scenarios', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSave: jest.fn(),
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle useEffect with object reference scenario', () => {
    const { rerender } = render(<Generalmode {...defaultProps} initialData={undefined} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    const objectRef = { name: 'Object Ref Room', type: ['Single'], pricePerNight: '100', roomInformation: ['WiFi'] };
    rerender(<Generalmode {...defaultProps} initialData={objectRef} />);
    expect(screen.getByTestId('name-input')).toHaveValue('Object Ref Room');
    rerender(<Generalmode {...defaultProps} initialData={objectRef} />);
    expect(screen.getByTestId('name-input')).toHaveValue('Object Ref Room');
    const newObjectRef = { name: 'Object Ref Room', type: ['Single'], pricePerNight: '100', roomInformation: ['WiFi'] };
    rerender(<Generalmode {...defaultProps} initialData={newObjectRef} />);
    expect(screen.getByTestId('name-input')).toHaveValue('Object Ref Room');
  });

  it('should handle useEffect with mutation scenario', () => {
    const { rerender } = render(<Generalmode {...defaultProps} initialData={undefined} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    const mutableData = { name: 'Mutable Room', type: ['Single'], pricePerNight: '100', roomInformation: ['WiFi'] };
    rerender(<Generalmode {...defaultProps} initialData={mutableData} />);
    expect(screen.getByTestId('name-input')).toHaveValue('Mutable Room');
    mutableData.name = 'Mutated Room';
    rerender(<Generalmode {...defaultProps} initialData={mutableData} />);
    expect(screen.getByTestId('name-input')).toHaveValue('Mutated Room');
  });

  it('should handle useEffect with valid FormData object initialData', () => {
    const validFormData = {
      name: 'Test Room',
      type: ['Single'],
      pricePerNight: '100',
      roomInformation: ['WiFi'],
    };
    render(<Generalmode {...defaultProps} initialData={validFormData} />);
    expect(screen.getByTestId('name-input')).toHaveValue('Test Room');
    expect(screen.getByTestId('price-input')).toHaveValue('100');
    expect(screen.getByTestId('type-select')).toHaveValue('Single');
  });

  it('should handle useEffect with partial FormData object initialData', () => {
    const partialFormData = {
      name: 'Partial Room',
      type: [],
      pricePerNight: '',
      roomInformation: [],
    };
    render(<Generalmode {...defaultProps} initialData={partialFormData} />);
    expect(screen.getByTestId('name-input')).toHaveValue('Partial Room');
    expect(screen.getByTestId('price-input')).toHaveValue('');
    expect(screen.getByTestId('type-select')).toHaveValue('');
  });

  it('should handle useEffect with non-FormData object initialData', () => {
    const nonFormData = {
      someOtherProperty: 'value',
      anotherProperty: 123,
    };
    render(<Generalmode {...defaultProps} initialData={nonFormData as any} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('price-input')).toHaveValue('');
    expect(screen.getByTestId('type-select')).toHaveValue('');
  });

  it('should handle useEffect with empty object initialData', () => {
    render(<Generalmode {...defaultProps} initialData={{}} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('price-input')).toHaveValue('');
    expect(screen.getByTestId('type-select')).toHaveValue('');
  });

  it('should handle useEffect with empty array initialData', () => {
    render(<Generalmode {...defaultProps} initialData={[] as any} />);
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
