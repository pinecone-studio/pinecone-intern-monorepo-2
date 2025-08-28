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

describe('Generalmode useEffect Primitive Types', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSave: jest.fn(),
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle useEffect when initialData is falsy', () => {
    const falsyValues = [undefined, null, false, 0, ''];
    falsyValues.forEach((falsyValue) => {
      const { unmount } = render(<Generalmode {...defaultProps} initialData={falsyValue as any} />);
      expect(screen.getByTestId('name-input')).toHaveValue('');
      expect(screen.getByTestId('price-input')).toHaveValue('');
      expect(screen.getByTestId('type-select')).toHaveValue('');
      unmount();
    });
  });

  it('should handle useEffect when initialData is truthy', () => {
    const truthyInitialData = {
      name: 'Test Room',
      type: ['Double'],
      pricePerNight: '200',
      roomInformation: ['AC'],
    };
    render(<Generalmode {...defaultProps} initialData={truthyInitialData} />);
    expect(screen.getByTestId('name-input')).toHaveValue('Test Room');
    expect(screen.getByTestId('price-input')).toHaveValue('200');
    expect(screen.getByTestId('type-select')).toHaveValue('Double');
  });

  it('should handle useEffect condition with empty object', () => {
    const emptyObject = {};
    render(<Generalmode {...defaultProps} initialData={emptyObject as any} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('price-input')).toHaveValue('');
    expect(screen.getByTestId('type-select')).toHaveValue('');
  });

  it('should handle useEffect condition with empty array', () => {
    render(<Generalmode {...defaultProps} initialData={[] as any} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('price-input')).toHaveValue('');
    expect(screen.getByTestId('type-select')).toHaveValue('');
  });

  it('should handle useEffect condition with undefined', () => {
    render(<Generalmode {...defaultProps} initialData={undefined} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('price-input')).toHaveValue('');
    expect(screen.getByTestId('type-select')).toHaveValue('');
  });

  it('should handle useEffect condition with valid object', () => {
    const validData = {
      name: 'Test Room',
      type: ['Single'],
      pricePerNight: '100',
      roomInformation: ['WiFi'],
    };
    render(<Generalmode {...defaultProps} initialData={validData} />);
    expect(screen.getByTestId('name-input')).toHaveValue('Test Room');
    expect(screen.getByTestId('price-input')).toHaveValue('100');
    expect(screen.getByTestId('type-select')).toHaveValue('Single');
  });

  it('should handle useEffect with null initialData', () => {
    render(<Generalmode {...defaultProps} initialData={null as any} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('price-input')).toHaveValue('');
    expect(screen.getByTestId('type-select')).toHaveValue('');
  });

  it('should handle useEffect with false initialData', () => {
    render(<Generalmode {...defaultProps} initialData={false as any} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('price-input')).toHaveValue('');
    expect(screen.getByTestId('type-select')).toHaveValue('');
  });

  it('should handle useEffect with zero initialData', () => {
    render(<Generalmode {...defaultProps} initialData={0 as any} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('price-input')).toHaveValue('');
    expect(screen.getByTestId('type-select')).toHaveValue('');
  });

  it('should handle useEffect with empty string initialData', () => {
    render(<Generalmode {...defaultProps} initialData={'' as any} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('price-input')).toHaveValue('');
    expect(screen.getByTestId('type-select')).toHaveValue('');
  });

  it('should handle useEffect with non-empty string initialData', () => {
    render(<Generalmode {...defaultProps} initialData={'test' as any} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('price-input')).toHaveValue('');
    expect(screen.getByTestId('type-select')).toHaveValue('');
  });

  it('should handle useEffect with number initialData', () => {
    render(<Generalmode {...defaultProps} initialData={123 as any} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('price-input')).toHaveValue('');
    expect(screen.getByTestId('type-select')).toHaveValue('');
  });
  it('should handle useEffect with boolean true initialData', () => {
    render(<Generalmode {...defaultProps} initialData={true as any} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('price-input')).toHaveValue('');
    expect(screen.getByTestId('type-select')).toHaveValue('');
  });
  it('should handle useEffect with NaN initialData', () => {
    render(<Generalmode {...defaultProps} initialData={NaN as any} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('price-input')).toHaveValue('');
    expect(screen.getByTestId('type-select')).toHaveValue('');
  });
  it('should handle useEffect with Infinity initialData', () => {
    render(<Generalmode {...defaultProps} initialData={Infinity as any} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('price-input')).toHaveValue('');
    expect(screen.getByTestId('type-select')).toHaveValue('');
  });
  it('should handle useEffect with -Infinity initialData', () => {
    render(<Generalmode {...defaultProps} initialData={-Infinity as any} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('price-input')).toHaveValue('');
    expect(screen.getByTestId('type-select')).toHaveValue('');
  });
});
