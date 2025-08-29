import { createRoomData } from '../../../src/components/room/SaveHandlerUtils';

describe('SaveHandlerUtils - createRoomData (Price)', () => {
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
});
