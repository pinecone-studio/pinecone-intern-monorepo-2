import { handleFinalSave, createRoomData } from '../../../src/components/room/SaveHandlerUtils';
describe('SaveHandlerUtils - handleFinalSave', () => {
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

  let mockCreateRoom: jest.Mock;
  let mockSetIsLoading: jest.Mock;
  let mockResetForm: jest.Mock;

  beforeEach(() => {
    mockCreateRoom = jest.fn();
    mockSetIsLoading = jest.fn();
    mockResetForm = jest.fn();
  });

  it('should handle successful room creation', async () => {
    mockCreateRoom.mockResolvedValue({ data: { createRoom: { id: 'room-1' } } });

    await handleFinalSave(mockSelectedHotelId, mockRoomData, mockCreateRoom, mockSetIsLoading, mockResetForm);

    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    expect(mockCreateRoom).toHaveBeenCalledWith({
      variables: {
        input: createRoomData(mockSelectedHotelId, mockRoomData),
      },
    });
    expect(mockResetForm).toHaveBeenCalled();
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
  });
  it('should handle room creation error', async () => {
    const error = new Error('Network error');
    mockCreateRoom.mockRejectedValue(error);

    await handleFinalSave(mockSelectedHotelId, mockRoomData, mockCreateRoom, mockSetIsLoading, mockResetForm);

    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    expect(mockCreateRoom).toHaveBeenCalledWith({
      variables: {
        input: createRoomData(mockSelectedHotelId, mockRoomData),
      },
    });
    expect(mockResetForm).not.toHaveBeenCalled();
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
  });
  it('should handle empty room data', async () => {
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

    mockCreateRoom.mockResolvedValue({ data: { createRoom: { id: 'room-1' } } });

    await handleFinalSave(mockSelectedHotelId, emptyRoomData, mockCreateRoom, mockSetIsLoading, mockResetForm);

    expect(mockCreateRoom).toHaveBeenCalledWith({
      variables: {
        input: createRoomData(mockSelectedHotelId, emptyRoomData),
      },
    });
  });

  it('should handle missing hotel ID', async () => {
    mockCreateRoom.mockResolvedValue({ data: { createRoom: { id: 'room-1' } } });

    await handleFinalSave('', mockRoomData, mockCreateRoom, mockSetIsLoading, mockResetForm);

    expect(mockCreateRoom).toHaveBeenCalledWith({
      variables: {
        input: createRoomData('', mockRoomData),
      },
    });
  });

  it('should handle console logging', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    mockCreateRoom.mockResolvedValue({ data: { createRoom: { id: 'room-1' } } });

    await handleFinalSave(mockSelectedHotelId, mockRoomData, mockCreateRoom, mockSetIsLoading, mockResetForm);

    expect(consoleSpy).toHaveBeenCalledWith('Final room data:', mockRoomData);
    expect(consoleSpy).toHaveBeenCalledWith('Images to be sent:', mockRoomData.images);
    expect(consoleSpy).toHaveBeenCalledWith('Room created successfully!');

    consoleSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should handle error logging', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const error = new Error('Network error');
    mockCreateRoom.mockRejectedValue(error);
    await handleFinalSave(mockSelectedHotelId, mockRoomData, mockCreateRoom, mockSetIsLoading, mockResetForm);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error creating room:', error);

    consoleErrorSpy.mockRestore();
  });

  it('should handle loading state correctly', async () => {
    mockCreateRoom.mockResolvedValue({ data: { createRoom: { id: 'room-1' } } });
    await handleFinalSave(mockSelectedHotelId, mockRoomData, mockCreateRoom, mockSetIsLoading, mockResetForm);
    expect(mockSetIsLoading).toHaveBeenNthCalledWith(1, true);
    expect(mockSetIsLoading).toHaveBeenNthCalledWith(2, false);
  });

  it('should handle loading state on error', async () => {
    const error = new Error('Network error');
    mockCreateRoom.mockRejectedValue(error);
    await handleFinalSave(mockSelectedHotelId, mockRoomData, mockCreateRoom, mockSetIsLoading, mockResetForm);
    expect(mockSetIsLoading).toHaveBeenNthCalledWith(1, true);
    expect(mockSetIsLoading).toHaveBeenNthCalledWith(2, false);
  });

  it('should not call resetForm on error', async () => {
    const error = new Error('Network error');
    mockCreateRoom.mockRejectedValue(error);
    await handleFinalSave(mockSelectedHotelId, mockRoomData, mockCreateRoom, mockSetIsLoading, mockResetForm);
    expect(mockResetForm).not.toHaveBeenCalled();
  });
  it('should call resetForm on success', async () => {
    mockCreateRoom.mockResolvedValue({ data: { createRoom: { id: 'room-1' } } });
    await handleFinalSave(mockSelectedHotelId, mockRoomData, mockCreateRoom, mockSetIsLoading, mockResetForm);
    expect(mockResetForm).toHaveBeenCalledTimes(1);
  });
});
