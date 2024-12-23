import { render, screen } from '@testing-library/react';
import EventDetail from '@/components/detail/EventDetail';
import { Event } from '@/generated';
import '@testing-library/jest-dom';

const mockEvent: Event = {
  _id: '1',
  category: ['hiphop'],
  description: 'An electrifying night of hip-hop music featuring top Mongolian artists.',
  discount: 10,
  guestArtists: [{ name: 'Big Gee' }, { name: 'Gennie' }],
  image: 'https://example.com/images/rockit-bay-concert.jpg',
  mainArtists: [{ name: 'Rockit Bay' }],
  name: 'Rockit Bay Concert',
  scheduledDays: ['2024-06-10', '2024-06-11'],
  priority: 'high',
  products: [],
  venue: {
    _id: '8',
    name: 'UB Palace Grand Hall',
    location: 'Peace Avenue, Ulaanbaatar, Mongolia',
    image: 'https://example.com/images/ub-palace.jpg',
    capacity: '5000',
    size: '5000 sqm',
  },
};

describe('EventDetail Component', () => {
  it('renders component without crashing', () => {
    render(<EventDetail event={mockEvent} />);
    expect(screen.getByText('Rockit Bay Concert')).toBeInTheDocument();
  });

  it('displays the event dates correctly', () => {
    render(<EventDetail event={mockEvent} />);
    expect(screen.getByText('2024.06.10 - 06.11')).toBeInTheDocument();
  });

  it('renders the venue name', () => {
    render(<EventDetail event={mockEvent} />);
    expect(screen.getByText('UB Palace Grand Hall')).toBeInTheDocument();
  });

  it('shows the guest artists', () => {
    render(<EventDetail event={mockEvent} />);
    expect(screen.getByText('Big Gee')).toBeInTheDocument();
    expect(screen.getByText('Gennie')).toBeInTheDocument();
  });

  it('displays the event description', () => {
    render(<EventDetail event={mockEvent} />);
    expect(screen.getByText('An electrifying night of hip-hop music featuring top Mongolian artists.')).toBeInTheDocument();
  });
});
