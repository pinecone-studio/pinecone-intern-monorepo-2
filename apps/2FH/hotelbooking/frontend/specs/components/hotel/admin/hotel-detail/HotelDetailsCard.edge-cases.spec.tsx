import { render, screen } from '@/TestUtils';
import { HotelDetailsCard } from '../../../../../src/components/admin/hotel-detail/HotelDetailsCard';

const mockRefetch = jest.fn();
const mockSetEditModalState = jest.fn();

describe('HotelDetailsCard Edge Cases', () => {
  it('handles hotel with missing name property to cover line 28', () => {
    const mockHotel = {
      id: '1',
      // name property is missing
      description: 'Test Description',
      optionalExtras: [],
      languages: [],
    };

    render(<HotelDetailsCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'details' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

    // Should render with undefined name - React renders nothing for undefined
    const titleElement = screen.getByRole('heading', { level: 3 });
    expect(titleElement).toHaveTextContent('Details');
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('handles hotel with null name', () => {
    const mockHotel = {
      id: '1',
      name: null,
      description: 'Test Description',
      optionalExtras: [],
      languages: [],
    };

    render(<HotelDetailsCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'details' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

    // Should render with null name - React renders nothing for null
    const titleElement = screen.getByRole('heading', { level: 3 });
    expect(titleElement).toHaveTextContent('Details');
  });

  it('handles hotel with undefined name', () => {
    const mockHotel = {
      id: '1',
      name: undefined,
      description: 'Test Description',
      optionalExtras: [],
      languages: [],
    };

    render(<HotelDetailsCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'details' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

    // Should render with undefined name - React renders nothing for undefined
    const titleElement = screen.getByRole('heading', { level: 3 });
    expect(titleElement).toHaveTextContent('Details');
  });

  it('handles hotel with empty string name', () => {
    const mockHotel = {
      id: '1',
      name: '',
      description: 'Test Description',
      optionalExtras: [],
      languages: [],
    };

    render(<HotelDetailsCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'details' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

    // Should render with empty name (h3 element will have leading space)
    const h3Element = screen.getByRole('heading', { level: 3 });
    expect(h3Element).toBeInTheDocument();
    expect(h3Element.textContent).toBe(' Details');
  });

  it('renders normally when hotel has a valid name', () => {
    const mockHotel = {
      id: '1',
      name: 'Test Hotel',
      description: 'Test Description',
      optionalExtras: [],
      languages: [],
    };

    render(<HotelDetailsCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'details' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

    // Should render normally
    const titleElement = screen.getByRole('heading', { level: 3 });
    expect(titleElement).toHaveTextContent('Test Hotel Details');
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });
});
