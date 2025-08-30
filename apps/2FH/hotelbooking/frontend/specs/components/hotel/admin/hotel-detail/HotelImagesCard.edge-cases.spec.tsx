import { render, screen } from '@/TestUtils';
import { HotelImagesCard } from '../../../../../src/components/admin/hotel-detail/HotelImagesCard';

const mockRefetch = jest.fn();
const mockSetEditModalState = jest.fn();

describe('HotelImagesCard Edge Cases', () => {
  it('handles hotel with missing name property to cover line 28', () => {
    const mockHotel = {
      id: '1',
      // name property is missing
      images: ['https://example.com/image1.jpg'],
    };

    render(
      <HotelImagesCard
        hotel={mockHotel}
        editModalState={{ isOpen: false, section: 'images' }}
        setEditModalState={mockSetEditModalState}
        refetch={mockRefetch}
        hotelId="1"
      />
    );

    // Should render with "Hotel Images" title
    expect(screen.getByText('Hotel Images')).toBeInTheDocument();
  });

  it('handles hotel with null name', () => {
    const mockHotel = {
      id: '1',
      name: null,
      images: ['https://example.com/image1.jpg'],
    };

    render(
      <HotelImagesCard
        hotel={mockHotel}
        editModalState={{ isOpen: false, section: 'images' }}
        setEditModalState={mockSetEditModalState}
        refetch={mockRefetch}
        hotelId="1"
      />
    );

    // Should render with "Hotel Images" title
    expect(screen.getByText('Hotel Images')).toBeInTheDocument();
  });

  it('handles hotel with undefined name', () => {
    const mockHotel = {
      id: '1',
      name: undefined,
      images: ['https://example.com/image1.jpg'],
    };

    render(
      <HotelImagesCard
        hotel={mockHotel}
        editModalState={{ isOpen: false, section: 'images' }}
        setEditModalState={mockSetEditModalState}
        refetch={mockRefetch}
        hotelId="1"
      />
    );

    // Should render with "Hotel Images" title
    expect(screen.getByText('Hotel Images')).toBeInTheDocument();
  });

  it('handles hotel with empty string name', () => {
    const mockHotel = {
      id: '1',
      name: '',
      images: ['https://example.com/image1.jpg'],
    };

    render(
      <HotelImagesCard
        hotel={mockHotel}
        editModalState={{ isOpen: false, section: 'images' }}
        setEditModalState={mockSetEditModalState}
        refetch={mockRefetch}
        hotelId="1"
      />
    );

    // Should render with "Hotel Images" title
    expect(screen.getByText('Hotel Images')).toBeInTheDocument();
  });

  it('renders normally when hotel has a valid name', () => {
    const mockHotel = {
      id: '1',
      name: 'Test Hotel',
      images: ['https://example.com/image1.jpg'],
    };

    render(
      <HotelImagesCard
        hotel={mockHotel}
        editModalState={{ isOpen: false, section: 'images' }}
        setEditModalState={mockSetEditModalState}
        refetch={mockRefetch}
        hotelId="1"
      />
    );

    // Should render normally
    expect(screen.getByText('Hotel Images')).toBeInTheDocument();
  });
});
