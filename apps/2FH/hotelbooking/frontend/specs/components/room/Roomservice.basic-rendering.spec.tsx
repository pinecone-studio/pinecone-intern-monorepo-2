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

describe('Roomservice Basic Rendering', () => {
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

  it('should render successfully', () => {
    render(<Roomservice {...defaultProps} />);

    expect(screen.getByText('Room Services')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('should display service data correctly', () => {
    render(<Roomservice {...defaultProps} />);

    expect(screen.getByText('Private, Shared')).toBeInTheDocument();
    expect(screen.getByText('Wheelchair')).toBeInTheDocument();
    expect(screen.getByText('Tv, Wifi')).toBeInTheDocument();
    expect(screen.getByText('Breakfast')).toBeInTheDocument();
    expect(screen.getByText('Desk')).toBeInTheDocument();
    expect(screen.getByText('Wifi')).toBeInTheDocument();
    expect(screen.getByText('Ac, Heating')).toBeInTheDocument();
  });

  it('should handle empty data gracefully', () => {
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

    expect(screen.getAllByText('-/-')).toHaveLength(7);
  });

  it('should use local state when _data is not provided', () => {
    render(<Roomservice onSave={defaultProps.onSave} loading={defaultProps.loading} />);

    expect(screen.getAllByText('-/-')).toHaveLength(7);
  });

  it('should have proper data-cy attributes', () => {
    const { container } = render(<Roomservice {...defaultProps} />);

    expect(container.querySelector('[data-cy="Roomservice"]')).toBeInTheDocument();
    expect(container.querySelector('[data-cy="Room-Service"]')).toBeInTheDocument();
    expect(container.querySelector('[data-cy="Edit-Room-Service"]')).toBeInTheDocument();
    expect(container.querySelector('[data-cy="Bathroom"]')).toBeInTheDocument();
    expect(container.querySelector('[data-cy="Bathroom-Value"]')).toBeInTheDocument();
    expect(container.querySelector('[data-cy="Food-and-Drink-Value"]')).toBeInTheDocument();
    expect(container.querySelector('[data-cy="Other"]')).toBeInTheDocument();
    expect(container.querySelector('[data-cy="Other-Value"]')).toBeInTheDocument();
    expect(container.querySelector('[data-cy="Accessibility"]')).toBeInTheDocument();
    expect(container.querySelector('[data-cy="Accessibility-Value"]')).toBeInTheDocument();
    expect(container.querySelector('[data-cy="Internet"]')).toBeInTheDocument();
    expect(container.querySelector('[data-cy="Internet-Value"]')).toBeInTheDocument();
    expect(container.querySelector('[data-cy="Bedroom"]')).toBeInTheDocument();
    expect(container.querySelector('[data-cy="Bedroom-Value"]')).toBeInTheDocument();
  });

  it('should have proper CSS classes', () => {
    const { container } = render(<Roomservice {...defaultProps} />);

    const mainContainer = container.querySelector('[data-cy="Roomservice"]');
    expect(mainContainer).toHaveClass('flex', 'flex-col', 'gap-y-4');

    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid', 'grid-cols-2', 'gap-6');
  });

  it('should handle single item arrays correctly', () => {
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
});
