import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { GeneralForm } from '../../../src/components/room/GeneralForm';

// Field renderers map
const fieldRenderers: Record<string, any> = {
  name: ({ formData, errors, onInputChange }: any) => (
    <>
      <input data-testid="name-input" value={formData.name} onChange={(e: any) => onInputChange('name', e.target.value)} placeholder="Enter room name" />
      {errors.name && <span data-testid="name-error">{errors.name}</span>}
    </>
  ),
  type: ({ formData, errors, onInputChange, options }: any) => (
    <>
      <select data-testid="type-select" value={formData.type[0] || ''} onChange={(e: any) => onInputChange('type', [e.target.value])}>
        <option value="">Select room type</option>
        {options.values?.map((v: string) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
      {errors.type && <span data-testid="type-error">{errors.type}</span>}
    </>
  ),
  price: ({ formData, errors, onInputChange }: any) => (
    <>
      <input data-testid="price-input" type="number" value={formData.pricePerNight} onChange={(e: any) => onInputChange('pricePerNight', e.target.value)} placeholder="Enter price" />
      {errors.price && <span data-testid="price-error">{errors.price}</span>}
    </>
  ),
  bedNumber: ({ formData, errors, onInputChange }: any) => (
    <>
      <input data-testid="bed-number-input" type="number" value={formData.bedNumber || ''} onChange={(e: any) => onInputChange('bedNumber', e.target.value)} placeholder="1" />
      {errors.bedNumber && <span data-testid="bed-number-error">{errors.bedNumber}</span>}
    </>
  ),
  status: ({ formData, errors, onInputChange, options }: any) => (
    <>
      <select data-testid="status-select" value={formData.status || ''} onChange={(e: any) => onInputChange('status', e.target.value)}>
        <option value="">Select status</option>
        {options.values?.map((v: string) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
      {errors.status && <span data-testid="status-error">{errors.status}</span>}
    </>
  ),
  roomInformation: ({ formData, errors, onInputChange }: any) => (
    <>
      <input
        data-testid="room-info-checkbox"
        type="checkbox"
        checked={formData.roomInformation.includes('WiFi')}
        onChange={(e: any) => onInputChange('roomInformation', e.target.checked ? [...formData.roomInformation, 'WiFi'] : formData.roomInformation.filter((item: string) => item !== 'WiFi'))}
      />
      {errors.room && <span data-testid="room-info-error">{errors.room}</span>}
    </>
  ),
};

// renderField using map
const renderField = (type: string, props: any, options: any = {}) => {
  const Renderer = fieldRenderers[type];
  return Renderer ? <Renderer {...props} options={options} /> : null;
};

// Mocking GeneralFormFields
jest.mock('../../../src/components/room/GeneralFormFields', () => {
  const createField = (type: string, options: any = {}) => {
    const Field = ({ formData, errors, onInputChange }: any) => <div data-testid={`${type}-field`}>{renderField(type, { formData, errors, onInputChange }, options)}</div>;
    Field.displayName = `Mock${type}Field`;
    return Field;
  };
  return {
    NameField: createField('name'),
    TypeField: createField('type', { values: ['Single', 'Double'] }),
    PriceField: createField('price'),
    BedNumberField: createField('bedNumber'),
    StatusField: createField('status', { values: ['available', 'booked', 'cancelled', 'completed', 'pending'] }),
    RoomInformationField: createField('roomInformation'),
  };
});

describe('GeneralForm', () => {
  const defaultProps = {
    formData: { name: 'Test Room', type: ['Single'], pricePerNight: '100', roomInformation: ['WiFi'], bedNumber: 1, status: 'available' },
    errors: {},
    onInputChange: jest.fn(),
  };

  const fieldTests = [
    { testId: 'name-input', value: 'Test Room' },
    { testId: 'type-select', value: 'Single' },
    { testId: 'price-input', value: 100 },
    { testId: 'bed-number-input', value: 1 },
    { testId: 'status-select', value: 'available' },
    { testId: 'room-info-checkbox', value: true },
  ];

  const errorTests = [
    { testId: 'name-error', text: 'Name is required' },
    { testId: 'type-error', text: 'Type is required' },
    { testId: 'price-error', text: 'Price is required' },
    { testId: 'status-error', text: 'Status is required' },
    { testId: 'room-info-error', text: 'Room information is required' },
  ];

  const changeField = (testId: string, value: any) => fireEvent.change(screen.getByTestId(testId), { target: { value } });

  it('renders all fields', () => {
    render(<GeneralForm {...defaultProps} />);
    fieldTests.forEach(({ testId, value }) => {
      const el = screen.getByTestId(testId);
      if (el.type === 'checkbox') expect(el).toBeChecked();
      else expect(el).toHaveValue(value);
    });
  });

  it('renders errors', () => {
    render(<GeneralForm {...defaultProps} errors={Object.fromEntries(errorTests.map((e) => [e.testId.split('-')[0], e.text]))} />);
    errorTests.forEach(({ testId, text }) => expect(screen.getByTestId(testId)).toHaveTextContent(text));
  });

  it.each([
    ['name-input', 'name', 'New Room Name'],
    ['type-select', 'type', ['Double']],
    ['price-input', 'pricePerNight', '150'],
    ['status-select', 'status', 'booked'],
  ])('calls onInputChange when %s changes', (testId, key, value) => {
    const mock = jest.fn();
    render(<GeneralForm {...defaultProps} onInputChange={mock} />);
    changeField(testId, Array.isArray(value) ? value[0] : value);
    expect(mock).toHaveBeenCalledWith(key, value);
  });

  it('calls onInputChange when room checkbox changes', () => {
    const mock = jest.fn();
    render(<GeneralForm {...defaultProps} onInputChange={mock} />);
    fireEvent.click(screen.getByTestId('room-info-checkbox'));
    expect(mock).toHaveBeenCalledWith('roomInformation', []);
  });

  it('handles empty form data', () => {
    render(<GeneralForm {...defaultProps} formData={{ name: '', type: [], pricePerNight: '', roomInformation: [], bedNumber: 0, status: '' }} />);
    fieldTests.forEach(({ testId }) => {
      const el = screen.getByTestId(testId);
      if (el.type === 'checkbox') expect(el).not.toBeChecked();
      else expect(el).toHaveValue(testId.includes('price') || testId.includes('bed') ? null : '');
    });
  });

  it('renders with proper spacing', () => {
    const { container } = render(<GeneralForm {...defaultProps} />);
    expect(container.firstChild).toHaveClass('space-y-4');
  });
});
