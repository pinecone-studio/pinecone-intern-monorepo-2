import { GetRoomsDocument } from '@/generated';
import { RoomInfo, ShowMore } from '@/components';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, waitFor, screen, act, fireEvent } from '@testing-library/react';

const getRoomsMock: MockedResponse = {
  request: {
    query: GetRoomsDocument,
    variables: { hotelId: '1' },
  },
  result: {
    data: {
      getRooms: [
        // {
        //   id: '1',
        //   name: 'Test Room',
        //   imageURL: ['/test-image.jpg'],
        //   roomInformation: ['private_bathroom', 'air_conditioner'],
        //   pricePerNight: 100,
        //   typePerson: 'single',
        //   bedNumber: 1,
        //   bedRoom: ['single'],
        //   other: [],
        //   entertainment: [],
        //   foodAndDrink: [],
        //   hotelId: '1',
        //   createdAt: new Date().toISOString(),
        //   updatedAt: new Date().toISOString(),
        // },
      ],
    },
  },
};

describe('RoomInfo', () => {
  it('1. Show more room modal button success render UI', async () => {
    render(
      <MockedProvider mocks={[getRoomsMock]} addTypename={false}>
        <RoomInfo hotelId="1" />
      </MockedProvider>
    );

    const button = await screen.findByTestId('show-more-room-modal-btn');
    fireEvent.click(button);
  });
});
