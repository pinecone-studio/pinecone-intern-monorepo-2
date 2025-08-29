import { createRoomData } from '../../../src/components/room/SaveHandlerUtils';

describe('SaveHandlerUtils - createRoomData (Basic)', () => {
  const mockSelectedHotelId = 'hotel-123';
  const mockRoomData = {
    general: {
      name: 'Test Room',
      type: ['Single'],
      pricePerNight: '100',
      roomInformation: ['WiFi', 'AC'],
    },
    services: {
      bathroom: ['Private'],
      accessibility: ['Wheelchair'],
      entertainment: ['TV'],
      foodAndDrink: ['Breakfast'],
      other: ['Desk'],
      internet: ['WiFi'],
      bedRoom: ['AC'],
    },
    images: ['image1.jpg', 'image2.jpg'],
  };

  it('should create room data correctly', () => {
    const result = createRoomData(mockSelectedHotelId, mockRoomData);
    expect(result).toEqual({
      hotelId: 'hotel-123',
      name: 'Test Room',
      pricePerNight: 100,
      imageURL: ['image1.jpg', 'image2.jpg'],
      typePerson: 'Single',
      roomInformation: ['WiFi', 'AC'],
      bathroom: ['Private'],
      accessibility: ['Wheelchair'],
      internet: ['WiFi'],
      foodAndDrink: ['Breakfast'],
      bedRoom: ['AC'],
      other: ['Desk'],
      entertainment: ['TV'],
      bedNumber: 0,
    });
  });

  it('should handle empty room data', () => {
    const emptyRoomData = {
      general: {
        name: '',
        type: [],
        pricePerNight: '',
        roomInformation: [],
      },
      services: {
        bathroom: [],
        accessibility: [],
        entertainment: [],
        foodAndDrink: [],
        other: [],
        internet: [],
        bedRoom: [],
      },
      images: [],
    };
    const result = createRoomData(mockSelectedHotelId, emptyRoomData);
    expect(result).toEqual({
      hotelId: 'hotel-123',
      name: '',
      pricePerNight: NaN,
      imageURL: [],
      typePerson: undefined,
      roomInformation: [],
      bathroom: [],
      accessibility: [],
      internet: [],
      foodAndDrink: [],
      bedRoom: [],
      other: [],
      entertainment: [],
      bedNumber: 0,
    });
  });

  it('should handle multiple room types', () => {
    const roomDataWithMultipleTypes = {
      ...mockRoomData,
      general: {
        ...mockRoomData.general,
        type: ['Single', 'Double', 'Suite'],
      },
    };
    const result = createRoomData(mockSelectedHotelId, roomDataWithMultipleTypes);
    expect(result.typePerson).toBe('Single');
  });

  it('should handle bedNumber when it exists', () => {
    const roomDataWithBedNumber = {
      ...mockRoomData,
      general: {
        ...mockRoomData.general,
        bedNumber: 2,
      },
    };
    const result = createRoomData(mockSelectedHotelId, roomDataWithBedNumber);
    expect(result.bedNumber).toBe(2);
  });

  it('should handle bedNumber as string when it exists', () => {
    const roomDataWithBedNumberString = {
      ...mockRoomData,
      general: {
        ...mockRoomData.general,
        bedNumber: '3',
      },
    };
    const result = createRoomData(mockSelectedHotelId, roomDataWithBedNumberString);
    expect(result.bedNumber).toBe(3);
  });
});
