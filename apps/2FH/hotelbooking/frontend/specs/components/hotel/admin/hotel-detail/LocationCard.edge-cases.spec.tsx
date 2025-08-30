import { render, screen } from '@/TestUtils';
import { LocationCard } from '../../../../../src/components/admin/hotel-detail/LocationCard';

const mockRefetch = jest.fn();
const mockSetEditModalState = jest.fn();

describe('LocationCard Edge Cases', () => {
  describe('hotel name edge cases', () => {
    it('handles missing name property', () => {
      const mockHotel = {
        id: '1',
        // name is missing
        location: 'Test Location',
        city: 'Test City',
        country: 'Test Country',
        phone: '123-456-7890',
        description: 'Test Description',
        stars: 4,
        rating: 8.5,
        amenities: ['WIFI', 'POOL'],
        languages: ['English', 'Spanish'],
        policies: [],
        faq: [],
        images: [],
        optionalExtras: [],
      };

      render(<LocationCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'location' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      // Should render empty h4 element for missing name
      const nameElement = screen.getByRole('heading', { level: 4 });
      expect(nameElement).toBeInTheDocument();
      expect(nameElement.textContent).toBe('');
    });

    it('handles null name', () => {
      const mockHotel = {
        id: '1',
        name: null,
        location: 'Test Location',
        city: 'Test City',
        country: 'Test Country',
        phone: '123-456-7890',
        description: 'Test Description',
        stars: 4,
        rating: 8.5,
        amenities: ['WIFI', 'POOL'],
        languages: ['English', 'Spanish'],
        policies: [],
        faq: [],
        images: [],
        optionalExtras: [],
      };

      render(<LocationCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'location' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      // Should render empty h4 element for null name
      const nameElement = screen.getByRole('heading', { level: 4 });
      expect(nameElement).toBeInTheDocument();
      expect(nameElement.textContent).toBe('');
    });

    it('handles undefined name', () => {
      const mockHotel = {
        id: '1',
        name: undefined,
        location: 'Test Location',
        city: 'Test City',
        country: 'Test Country',
        phone: '123-456-7890',
        description: 'Test Description',
        stars: 4,
        rating: 8.5,
        amenities: ['WIFI', 'POOL'],
        languages: ['English', 'Spanish'],
        policies: [],
        faq: [],
        images: [],
        optionalExtras: [],
      };

      render(<LocationCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'location' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      // Should render empty h4 element for undefined name
      const nameElement = screen.getByRole('heading', { level: 4 });
      expect(nameElement).toBeInTheDocument();
      expect(nameElement.textContent).toBe('');
    });

    it('handles empty string name', () => {
      const mockHotel = {
        id: '1',
        name: '',
        location: 'Test Location',
        city: 'Test City',
        country: 'Test Country',
        phone: '123-456-7890',
        description: 'Test Description',
        stars: 4,
        rating: 8.5,
        amenities: ['WIFI', 'POOL'],
        languages: ['English', 'Spanish'],
        policies: [],
        faq: [],
        images: [],
        optionalExtras: [],
      };

      render(<LocationCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'location' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      // Should render empty h4 element for empty string name
      const nameElement = screen.getByRole('heading', { level: 4 });
      expect(nameElement).toBeInTheDocument();
      expect(nameElement.textContent).toBe('');
    });

    it('handles valid name', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        location: 'Test Location',
        city: 'Test City',
        country: 'Test Country',
        phone: '123-456-7890',
        description: 'Test Description',
        stars: 4,
        rating: 8.5,
        amenities: ['WIFI', 'POOL'],
        languages: ['English', 'Spanish'],
        policies: [],
        faq: [],
        images: [],
        optionalExtras: [],
      };

      render(<LocationCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'location' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      // Should render the hotel name
      expect(screen.getByText('Test Hotel')).toBeInTheDocument();
    });
  });
});
