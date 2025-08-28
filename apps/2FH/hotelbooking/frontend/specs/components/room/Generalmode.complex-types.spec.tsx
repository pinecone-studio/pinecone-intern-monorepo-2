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

describe('Generalmode Complex Types', () => {
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

  it('should handle useEffect with Date object initialData', () => {
    const dateObject = new Date();
    render(<Generalmode {...defaultProps} initialData={dateObject as any} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('price-input')).toHaveValue('');
    expect(screen.getByTestId('type-select')).toHaveValue('');
  });

  it('should handle useEffect with RegExp object initialData', () => {
    const regexObject = /test/;
    render(<Generalmode {...defaultProps} initialData={regexObject as any} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('price-input')).toHaveValue('');
    expect(screen.getByTestId('type-select')).toHaveValue('');
  });

  it('should handle useEffect with Error object initialData', () => {
    const errorObject = new Error('test error');
    render(<Generalmode {...defaultProps} initialData={errorObject as any} />);
    expect(screen.getByTestId('name-input')).toHaveValue('Error');
    expect(screen.getByTestId('price-input')).toHaveValue('');
    expect(screen.getByTestId('type-select')).toHaveValue('');
  });

  it('should handle useEffect with Map object initialData', () => {
    const mapObject = new Map();
    render(<Generalmode {...defaultProps} initialData={mapObject as any} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('price-input')).toHaveValue('');
    expect(screen.getByTestId('type-select')).toHaveValue('');
  });

  it('should handle useEffect with Set object initialData', () => {
    const setObject = new Set();
    render(<Generalmode {...defaultProps} initialData={setObject as any} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('price-input')).toHaveValue('');
    expect(screen.getByTestId('type-select')).toHaveValue('');
  });

  it('should handle useEffect with Promise object initialData', () => {
    const promiseObject = Promise.resolve('test');
    render(<Generalmode {...defaultProps} initialData={promiseObject as any} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('price-input')).toHaveValue('');
    expect(screen.getByTestId('type-select')).toHaveValue('');
  });

  it('should handle useEffect with Proxy object initialData', () => {
    const target = {};
    const proxyObject = new Proxy(target, {});
    render(<Generalmode {...defaultProps} initialData={proxyObject as any} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('price-input')).toHaveValue('');
    expect(screen.getByTestId('type-select')).toHaveValue('');
  });

  it('should handle useEffect with WeakMap object initialData', () => {
    const weakMapObject = new WeakMap();
    render(<Generalmode {...defaultProps} initialData={weakMapObject as any} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('price-input')).toHaveValue('');
    expect(screen.getByTestId('type-select')).toHaveValue('');
  });

  it('should handle useEffect with WeakSet object initialData', () => {
    const weakSetObject = new WeakSet();
    render(<Generalmode {...defaultProps} initialData={weakSetObject as any} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('price-input')).toHaveValue('');
    expect(screen.getByTestId('type-select')).toHaveValue('');
  });

  it('should handle useEffect with ArrayBuffer object initialData', () => {
    const arrayBufferObject = new ArrayBuffer(8);
    render(<Generalmode {...defaultProps} initialData={arrayBufferObject as any} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('price-input')).toHaveValue('');
    expect(screen.getByTestId('type-select')).toHaveValue('');
  });
});
