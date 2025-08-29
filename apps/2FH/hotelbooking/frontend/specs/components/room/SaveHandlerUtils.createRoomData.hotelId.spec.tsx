import { createRoomData } from '../../../src/components/room/SaveHandlerUtils';

describe('SaveHandlerUtils - createRoomData (Hotel ID)', () => {
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
