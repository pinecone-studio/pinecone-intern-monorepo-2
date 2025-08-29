import { createRoomData } from '../../../src/components/room/SaveHandlerUtils';

// This file serves as a main entry point for SaveHandlerUtils tests
// Individual test cases are split into separate files for better organization:
// - SaveHandlerUtils.createRoomData.basic.spec.tsx
// - SaveHandlerUtils.createRoomData.price.spec.tsx
// - SaveHandlerUtils.createRoomData.hotelId.spec.tsx
// - SaveHandlerUtils.handleFinalSave.spec.tsx

describe('SaveHandlerUtils - Main', () => {
  it('should export createRoomData function', () => {
    expect(typeof createRoomData).toBe('function');
  });

  it('should handle basic room data creation', () => {
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

    const result = createRoomData(mockSelectedHotelId, mockRoomData);

    expect(result).toHaveProperty('hotelId', 'hotel-123');
    expect(result).toHaveProperty('name', 'Test Room');
    expect(result).toHaveProperty('pricePerNight', 100);
    expect(result).toHaveProperty('bedNumber', 0);
  });
});
