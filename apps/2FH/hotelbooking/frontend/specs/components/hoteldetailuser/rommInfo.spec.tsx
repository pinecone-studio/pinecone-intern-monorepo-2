import { GetRoomsDocument } from '@/generated';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { RoomInfo } from '@/components/hoteldetail/RoomInfo';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import '@testing-library/jest-dom';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Mock PriceDetail component to avoid Dialog/portal issues
jest.mock('@/components/hoteldetail/PriceDetail', () => ({
  PriceDetail: ({ open }: { open: boolean }) => (open ? <div data-testid="price-detail">Price Detail Mock</div> : null),
}));

// Mock ReserveButton component to avoid useRouter issues
jest.mock('@/components/hoteldetail/ReserveButton', () => ({
  ReserveButton: ({ roomId }: { roomId: string }) => <button data-testid={`reserve-button-${roomId}`}>Reserve</button>,
}));

const mockRoom = {
  id: '1',
  hotelId: '1',
  name: 'Room 1',
  imageURL: ['/images/Hotel-Image.png'],
  pricePerNight: 100,
  typePerson: '1',
  roomInformation: ['privateBathroom'],
  bathroom: ['privateBathroom'],
  accessibility: ['wheelchair'],
  internet: ['wifi'],
  foodAndDrink: [],
  bedRoom: [],
  other: [],
  entertainment: [],
  bedNumber: 1,
  createdAt: '2021-01-01',
  updatedAt: '2021-01-01',
};

const getRoomsMock: MockedResponse = {
  request: {
    query: GetRoomsDocument,
    variables: { hotelId: '1' },
  },
  result: {
    data: { getRooms: [mockRoom] },
  },
};

describe('RoomInfo', () => {
  it('renders the room info', async () => {
    render(
      <MockedProvider mocks={[getRoomsMock]} addTypename={false}>
        <RoomInfo hotelId="1" />
      </MockedProvider>
    );

    // Apollo query-ийн data ирэхийг хүлээ
    const item = await screen.findByTestId('room-info-item');
    expect(item).toBeInTheDocument();

    const image = await screen.findByTestId('room-info-item-image');
    expect(image).toHaveAttribute('src', '/images/Hotel-Image.png');
    expect(image).toHaveAttribute('alt', 'roomImage');
  });

  it('opens ShowMore modal when clicking "Show more"', async () => {
    render(
      <MockedProvider mocks={[getRoomsMock]} addTypename={false}>
        <RoomInfo hotelId="1" />
      </MockedProvider>
    );

    await screen.findByTestId('room-info-item');

    // Check that modal is not initially open by looking for modal title
    expect(screen.queryByText('Room Information')).not.toBeInTheDocument();

    const showButton = screen.getByTestId('show-more-room-modal-btn');
    fireEvent.click(showButton);

    // Wait for modal to open and check for modal title
    await waitFor(() => {
      expect(screen.getByText('Room Information')).toBeInTheDocument();
    });
  });

  it('should open price detail when clicking price detail button', async () => {
    render(
      <MockedProvider mocks={[getRoomsMock]} addTypename={false}>
        <RoomInfo hotelId="1" />
      </MockedProvider>
    );

    await screen.findByTestId('room-info-item');

    const priceDetailButton = screen.getByTestId('price-detail-button-room-info');
    fireEvent.click(priceDetailButton);

    // After clicking, the button should be replaced by PriceDetail component
    expect(screen.queryByTestId('price-detail-button-room-info')).not.toBeInTheDocument();
  });
});
