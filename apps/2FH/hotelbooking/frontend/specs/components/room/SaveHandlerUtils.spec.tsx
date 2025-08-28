import { createRoomData } from '../../../src/components/room/SaveHandlerUtils';
describe('SaveHandlerUtils - createRoomData', () => {
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
    });
  });
  it('should handle string price conversion', () => {
    const roomDataWithStringPrice = {
      ...mockRoomData,
      general: {
        ...mockRoomData.general,
        pricePerNight: '150.50',
      },
    };
    const result = createRoomData(mockSelectedHotelId, roomDataWithStringPrice);
    expect(result.pricePerNight).toBe(150);
  });
  it('should handle invalid price conversion', () => {
    const roomDataWithInvalidPrice = {
      ...mockRoomData,
      general: {
        ...mockRoomData.general,
        pricePerNight: 'invalid',
      },
    };
    const result = createRoomData(mockSelectedHotelId, roomDataWithInvalidPrice);
    expect(result.pricePerNight).toBe(NaN);
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
  it('should handle zero price', () => {
    const roomDataWithZeroPrice = {
      ...mockRoomData,
      general: {
        ...mockRoomData.general,
        pricePerNight: '0',
      },
    };
    const result = createRoomData(mockSelectedHotelId, roomDataWithZeroPrice);
    expect(result.pricePerNight).toBe(0);
  });
  it('should handle negative price', () => {
    const roomDataWithNegativePrice = {
      ...mockRoomData,
      general: {
        ...mockRoomData.general,
        pricePerNight: '-50',
      },
    };
    const result = createRoomData(mockSelectedHotelId, roomDataWithNegativePrice);
    expect(result.pricePerNight).toBe(-50);
  });
  it('should handle decimal price', () => {
    const roomDataWithDecimalPrice = {
      ...mockRoomData,
      general: {
        ...mockRoomData.general,
        pricePerNight: '99.99',
      },
    };
    const result = createRoomData(mockSelectedHotelId, roomDataWithDecimalPrice);
    expect(result.pricePerNight).toBe(99);
  });

  it('should handle empty hotel ID', () => {
    const result = createRoomData('', mockRoomData);

    expect(result.hotelId).toBe('');
  });
  it('should handle null hotel ID', () => {
    const result = createRoomData(null as any, mockRoomData);
    expect(result.hotelId).toBe(null);
  });
  it('should handle undefined hotel ID', () => {
    const result = createRoomData(undefined as any, mockRoomData);

    expect(result.hotelId).toBe(undefined);
  });
});
