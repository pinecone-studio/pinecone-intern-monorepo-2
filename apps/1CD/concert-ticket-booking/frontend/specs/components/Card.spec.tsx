import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Event } from '@/generated';
import CardTicket from '@/components/Card';

const mockEvent: Event = {
  _id: '1',
  category: ['hiphop'],
  description: 'An electrifying night of hip-hop music featuring top Mongolian artists.',
  discount: 10,
  guestArtists: [{ name: 'Big Gee' }, { name: 'Gennie' }],
  image: 'https://example.com/images/rockit-bay-concert.jpg',
  mainArtists: [{ name: 'Rockit Bay' }],
  name: 'Rockit Bay Concert',
  scheduledDays: ['2024-06-10', '2024-06-11', '2024-06-12'],
  priority: 'high', // Added priority field as string

  products: [
    {
      _id: '2',
      scheduledDay: '2024-06-10',
      ticketType: [
        {
          _id: '3',
          discount: '10',
          soldQuantity: '150',
          unitPrice: '50000',
          zoneName: 'VIP',
          additional: 'Special backstage access', // Added required fields
          totalQuantity: '200',
        },
        {
          _id: '4',
          discount: '5',
          soldQuantity: '300',
          unitPrice: '30000',
          zoneName: 'General Admission',
          additional: '',
          totalQuantity: '500',
        },
      ],
    },
    {
      _id: '5',
      scheduledDay: '2024-06-11',
      ticketType: [
        {
          _id: '6',
          discount: '15',
          soldQuantity: '100',
          unitPrice: '60000',
          zoneName: 'Front Row',
          additional: 'Includes merchandise',
          totalQuantity: '150',
        },
        {
          _id: '7',
          discount: '10',
          soldQuantity: '200',
          unitPrice: '40000',
          zoneName: 'General Admission',
          additional: '',
          totalQuantity: '500',
        },
      ],
    },
  ],

  venue: {
    _id: '8',
    name: 'UB Palace Grand Hall',
    location: 'Peace Avenue, Ulaanbaatar, Mongolia',
    image: 'https://example.com/images/ub-palace.jpg',
    capacity: '5000',
    size: '5000 sqm',
  },
};

describe('Card', () => {
  it('should render', async () => {
    render(<CardTicket event={mockEvent} />);
  });

  it('does not display discount badge when discount is zero', () => {
    const noDiscountEvent: Event = {
      ...mockEvent,
      products: [
        {
          _id: '1',
          scheduledDay: '2024-06-10',
          ticketType: [
            {
              _id: '6',
              discount: '0',
              soldQuantity: '100',
              unitPrice: '60000',
              zoneName: 'Front Row',
              additional: 'Includes merchandise',
              totalQuantity: '150',
            },
            {
              _id: '6',
              discount: '0',
              soldQuantity: '100',
              unitPrice: '60000',
              zoneName: 'Front Row',
              additional: 'Includes merchandise',
              totalQuantity: '150',
            },
          ],
        },
      ],
    };
    render(<CardTicket event={noDiscountEvent} />);
  });

  it('displays correct single days when fewer than two days are scheduled', () => {
    const singleDayEvent: Event = {
      ...mockEvent,
      scheduledDays: ['2024-06-10'],
    };
    render(<CardTicket event={singleDayEvent} />);
  });
});
