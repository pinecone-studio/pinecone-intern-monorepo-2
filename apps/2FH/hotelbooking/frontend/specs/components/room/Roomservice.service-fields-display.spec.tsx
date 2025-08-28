import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Roomservice } from '../../../src/components/room/Roomservice';

jest.mock('../../../src/components/room/Roomservicemodal', () => ({
  RoomServiceModal: ({ isOpen, onClose, onSave, loading, _data }: any) =>
    isOpen ? (
      <div data-testid="roomservice-modal">
        <button
          onClick={() => onSave({ bathroom: ['Private'], accessibility: ['Wheelchair'], entertainment: ['TV'], foodAndDrink: ['Breakfast'], other: ['Desk'], internet: ['WiFi'], bedRoom: ['AC'] })}
        >
          Save
        </button>
        <button onClick={onClose}>Close</button>
        <span data-testid="modal-loading">{loading ? 'Loading' : 'Not Loading'}</span>
      </div>
    ) : null,
}));

describe('Roomservice Service Fields Display', () => {
  const defaultProps = {
    onSave: jest.fn(),
    loading: false,
    _data: {
      bathroom: ['Private', 'Shared'],
      accessibility: ['Wheelchair'],
      entertainment: ['TV', 'WiFi'],
      foodAndDrink: ['Breakfast'],
      other: ['Desk'],
      internet: ['WiFi'],
      bedRoom: ['AC', 'Heating'],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display entertainment field correctly', () => {
    const dataWithEntertainment = {
      ...defaultProps._data,
      entertainment: ['TV', 'Radio', 'Netflix'],
    };

    render(<Roomservice {...defaultProps} _data={dataWithEntertainment} />);

    expect(screen.getByText('Tv, Radio, Netflix')).toBeInTheDocument();
  });

  it('should handle entertainment field with empty array', () => {
    const dataWithEmptyEntertainment = {
      ...defaultProps._data,
      entertainment: [],
    };

    render(<Roomservice {...defaultProps} _data={dataWithEmptyEntertainment} />);

    expect(screen.getByText('-/-')).toBeInTheDocument();
  });

  it('should handle entertainment field with single item', () => {
    const dataWithSingleEntertainment = {
      ...defaultProps._data,
      entertainment: ['TV'],
    };

    render(<Roomservice {...defaultProps} _data={dataWithSingleEntertainment} />);

    expect(screen.getByText('Tv')).toBeInTheDocument();
  });

  it('should handle entertainment field with underscores', () => {
    const dataWithUnderscoreEntertainment = {
      ...defaultProps._data,
      entertainment: ['FLAT_SCREEN_TV', 'CABLE_CHANNELS'],
    };

    render(<Roomservice {...defaultProps} _data={dataWithUnderscoreEntertainment} />);

    expect(screen.getByText('Flat Screen Tv, Cable Channels')).toBeInTheDocument();
  });

  it('should handle all service fields with empty arrays', () => {
    const emptyData = {
      bathroom: [],
      accessibility: [],
      entertainment: [],
      foodAndDrink: [],
      other: [],
      internet: [],
      bedRoom: [],
    };

    render(<Roomservice {...defaultProps} _data={emptyData} />);

    const dashElements = screen.getAllByText('-/-');
    expect(dashElements).toHaveLength(7);
  });

  it('should handle all service fields with single items', () => {
    const singleItemData = {
      bathroom: ['Private'],
      accessibility: ['Wheelchair'],
      entertainment: ['TV'],
      foodAndDrink: ['Breakfast'],
      other: ['Desk'],
      internet: ['WiFi'],
      bedRoom: ['AC'],
    };

    render(<Roomservice {...defaultProps} _data={singleItemData} />);

    expect(screen.getByText('Private')).toBeInTheDocument();
    expect(screen.getByText('Wheelchair')).toBeInTheDocument();
    expect(screen.getByText('Tv')).toBeInTheDocument();
    expect(screen.getByText('Breakfast')).toBeInTheDocument();
    expect(screen.getByText('Desk')).toBeInTheDocument();
    expect(screen.getByText('Wifi')).toBeInTheDocument();
    expect(screen.getByText('Ac')).toBeInTheDocument();
  });

  it('should handle all service fields with multiple items', () => {
    const multipleItemData = {
      bathroom: ['Private', 'Shared', 'En-suite'],
      accessibility: ['Wheelchair', 'Elevator', 'Ramp'],
      entertainment: ['TV', 'Radio', 'Netflix', 'HBO'],
      foodAndDrink: ['Breakfast', 'Minibar', 'Room Service'],
      other: ['Desk', 'Wardrobe', 'Safe'],
      internet: ['WiFi', 'Ethernet', '5G'],
      bedRoom: ['AC', 'Heating', 'Fan'],
    };

    render(<Roomservice {...defaultProps} _data={multipleItemData} />);

    expect(screen.getByText('Private, Shared, En-Suite')).toBeInTheDocument();
    expect(screen.getByText('Wheelchair, Elevator, Ramp')).toBeInTheDocument();
    expect(screen.getByText('Tv, Radio, Netflix, Hbo')).toBeInTheDocument();
    expect(screen.getByText('Breakfast, Minibar, Room Service')).toBeInTheDocument();
    expect(screen.getByText('Desk, Wardrobe, Safe')).toBeInTheDocument();
    expect(screen.getByText('Wifi, Ethernet, 5g')).toBeInTheDocument();
    expect(screen.getByText('Ac, Heating, Fan')).toBeInTheDocument();
  });
});
