/* eslint-disable */
import { render, screen } from '@/TestUtils';
import { HotelInfoCard } from '../../../../../src/components/admin/hotel-detail/HotelInfoCard';

const mockRefetch = jest.fn();
const mockSetEditModalState = jest.fn();

describe('HotelInfoCard Edge Cases', () => {
  describe('getStarsText function edge cases', () => {
    it('handles undefined stars', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        description: 'Test Description',
        phone: '123-456-7890',
        rating: 8.5,
        stars: undefined,
        city: 'Test City',
        country: 'Test Country',
        location: 'Test Location',
        amenities: ['WIFI', 'POOL'],
        languages: ['English', 'Spanish'],
        policies: [],
        faq: [],
        images: [],
        optionalExtras: [],
      };

      render(<HotelInfoCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'basic' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      expect(screen.getByText('(undefined stars)')).toBeInTheDocument();
    });

    it('handles null stars', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        description: 'Test Description',
        phone: '123-456-7890',
        rating: 8.5,
        stars: null,
        city: 'Test City',
        country: 'Test Country',
        location: 'Test Location',
        amenities: ['WIFI', 'POOL'],
        languages: ['English', 'Spanish'],
        policies: [],
        faq: [],
        images: [],
        optionalExtras: [],
      };

      render(<HotelInfoCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'basic' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      expect(screen.getByText('(null stars)')).toBeInTheDocument();
    });

    it('handles string stars', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        description: 'Test Description',
        phone: '123-456-7890',
        rating: 8.5,
        stars: '4',
        city: 'Test City',
        country: 'Test Country',
        location: 'Test Location',
        amenities: ['WIFI', 'POOL'],
        languages: ['English', 'Spanish'],
        policies: [],
        faq: [],
        images: [],
        optionalExtras: [],
      };

      render(<HotelInfoCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'basic' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      expect(screen.getByText('(4 stars)')).toBeInTheDocument();
    });

    it('handles NaN stars', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        description: 'Test Description',
        phone: '123-456-7890',
        rating: 8.5,
        stars: NaN,
        city: 'Test City',
        country: 'Test Country',
        location: 'Test Location',
        amenities: ['WIFI', 'POOL'],
        languages: ['English', 'Spanish'],
        policies: [],
        faq: [],
        images: [],
        optionalExtras: [],
      };

      render(<HotelInfoCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'basic' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      expect(screen.getByText('(NaN stars)')).toBeInTheDocument();
    });

    it('handles valid number stars', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        description: 'Test Description',
        phone: '123-456-7890',
        rating: 8.5,
        stars: 4,
        city: 'Test City',
        country: 'Test Country',
        location: 'Test Location',
        amenities: ['WIFI', 'POOL'],
        languages: ['English', 'Spanish'],
        policies: [],
        faq: [],
        images: [],
        optionalExtras: [],
      };

      render(<HotelInfoCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'basic' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      expect(screen.getByText('(4 stars)')).toBeInTheDocument();
    });

    it('handles string stars that parse to NaN', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        description: 'Test Description',
        phone: '123-456-7890',
        rating: 8.5,
        stars: 'invalid',
        city: 'Test City',
        country: 'Test Country',
        location: 'Test Location',
        amenities: ['WIFI', 'POOL'],
        languages: ['English', 'Spanish'],
        policies: [],
        faq: [],
        images: [],
        optionalExtras: [],
      };

      render(<HotelInfoCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'basic' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      expect(screen.getByText('(invalid stars)')).toBeInTheDocument();
    });

    it('handles negative stars', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        description: 'Test Description',
        phone: '123-456-7890',
        rating: 8.5,
        stars: -2,
        city: 'Test City',
        country: 'Test Country',
        location: 'Test Location',
        amenities: ['WIFI', 'POOL'],
        languages: ['English', 'Spanish'],
        policies: [],
        faq: [],
        images: [],
        optionalExtras: [],
      };

      render(<HotelInfoCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'basic' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      expect(screen.getByText('(-2 stars)')).toBeInTheDocument();
    });
  });

  describe('starsDisplay edge cases', () => {
    it('handles zero stars display', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        description: 'Test Description',
        phone: '123-456-7890',
        rating: 8.5,
        stars: 0,
        city: 'Test City',
        country: 'Test Country',
        location: 'Test Location',
        amenities: ['WIFI', 'POOL'],
        languages: ['English', 'Spanish'],
        policies: [],
        faq: [],
        images: [],
        optionalExtras: [],
      };

      render(<HotelInfoCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'basic' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      // Should show empty stars container
      const starsContainer = screen.getByTestId('stars-container');
      expect(starsContainer).toBeInTheDocument();
      expect(starsContainer.children.length).toBe(0);
    });

    it('handles negative stars display', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        description: 'Test Description',
        phone: '123-456-7890',
        rating: 8.5,
        stars: -3,
        city: 'Test City',
        country: 'Test Country',
        location: 'Test Location',
        amenities: ['WIFI', 'POOL'],
        languages: ['English', 'Spanish'],
        policies: [],
        faq: [],
        images: [],
        optionalExtras: [],
      };

      render(<HotelInfoCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'basic' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      // Should show empty stars container (Math.max(0, Math.floor(-3)) = 0)
      const starsContainer = screen.getByTestId('stars-container');
      expect(starsContainer).toBeInTheDocument();
      expect(starsContainer.children.length).toBe(0);
    });

    it('handles decimal stars display', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        description: 'Test Description',
        phone: '123-456-7890',
        rating: 8.5,
        stars: 3.7,
        city: 'Test City',
        country: 'Test Country',
        location: 'Test Location',
        amenities: ['WIFI', 'POOL'],
        languages: ['English', 'Spanish'],
        policies: [],
        faq: [],
        images: [],
        optionalExtras: [],
      };

      render(<HotelInfoCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'basic' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      // Should show 3 stars (Math.floor(3.7) = 3)
      const starsContainer = screen.getByTestId('stars-container');
      expect(starsContainer).toBeInTheDocument();
      expect(starsContainer.children.length).toBe(3);
    });
  });
});
