import { render, screen } from '@/TestUtils';
import { HotelImagesCard } from '../../../../../src/components/admin/hotel-detail/HotelImagesCard';
import { HotelInfoCard } from '../../../../../src/components/admin/hotel-detail/HotelInfoCard';
import { LocationCard } from '../../../../../src/components/admin/hotel-detail/LocationCard';
import { PoliciesCard } from '../../../../../src/components/admin/hotel-detail/PoliciesCard';

const mockRefetch = jest.fn();
const mockSetEditModalState = jest.fn();

describe('Remaining Uncovered Lines Tests', () => {
  describe('HotelImagesCard - line 28', () => {
    it('handles hotel with missing images property', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
      };

      render(<HotelImagesCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'images' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);
      expect(screen.getByText('Hotel Images')).toBeInTheDocument();
    });

    it('handles hotel with null images', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        images: null,
      };

      render(<HotelImagesCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'images' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);
      expect(screen.getByText('Hotel Images')).toBeInTheDocument();
    });
  });

  describe('HotelInfoCard - lines 55-59', () => {
    it('handles hotel with undefined stars', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        description: 'Test Description',
        phone: '123-456-7890',
        rating: 8.5,
        stars: undefined,
      };

      render(<HotelInfoCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'basic' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      expect(screen.getByText('General Information')).toBeInTheDocument();
    });

    it('handles hotel with null stars', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        description: 'Test Description',
        phone: '123-456-7890',
        rating: 8.5,
        stars: null,
      };

      render(<HotelInfoCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'basic' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      // Should render without crashing
      expect(screen.getByText('General Information')).toBeInTheDocument();
    });

    it('handles hotel with string stars', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        description: 'Test Description',
        phone: '123-456-7890',
        rating: 8.5,
        stars: '4',
      };

      render(<HotelInfoCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'basic' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      expect(screen.getByText('General Information')).toBeInTheDocument();
    });
  });

  describe('LocationCard - line 28', () => {
    it('handles hotel with missing location data', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
      };

      render(<LocationCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'location' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      // Should render without crashing
      expect(screen.getByText('Detailed Location')).toBeInTheDocument();
    });

    it('handles hotel with null location data', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        location: null,
        city: null,
        country: null,
        phone: null,
      };

      render(<LocationCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'location' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      expect(screen.getByText('Detailed Location')).toBeInTheDocument();
    });
  });

  describe('PoliciesCard - line 32', () => {
    it('returns null when hotel.policies is null', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        policies: null,
      };

      const { container } = render(
        <PoliciesCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'policies' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />
      );

      expect(container.firstChild).toBeNull();
    });

    it('returns null when hotel.policies is undefined', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        // policies is undefined
      };

      const { container } = render(
        <PoliciesCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'policies' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />
      );

      // Should return null (empty container)
      expect(container.firstChild).toBeNull();
    });

    it('returns null when hotel.policies is empty array', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        policies: [],
      };

      const { container } = render(
        <PoliciesCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'policies' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />
      );

      // Should return null (empty container)
      expect(container.firstChild).toBeNull();
    });
  });
});
