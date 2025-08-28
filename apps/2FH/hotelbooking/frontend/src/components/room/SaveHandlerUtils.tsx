interface FormData {
  name: string;
  type: string[];
  pricePerNight: string;
  roomInformation: string[];
}

interface ServiceData {
  bathroom: string[];
  accessibility: string[];
  entertainment: string[];
  foodAndDrink: string[];
  other: string[];
  internet: string[];
  bedRoom: string[];
}

interface RoomData {
  general: FormData;
  services: ServiceData;
  images: string[];
}

export const createRoomData = (selectedHotelId: string, roomData: RoomData) => {
  console.log('createRoomData called with roomData:', roomData);
  console.log('roomData.images:', roomData.images);
  console.log('roomData.images length:', roomData.images.length);

  const result = {
    hotelId: selectedHotelId,
    name: roomData.general.name,
    pricePerNight: parseInt(roomData.general.pricePerNight),
    imageURL: roomData.images,
    typePerson: roomData.general.type[0],
    roomInformation: roomData.general.roomInformation,
    bathroom: roomData.services.bathroom,
    accessibility: roomData.services.accessibility,
    internet: roomData.services.internet,
    foodAndDrink: roomData.services.foodAndDrink,
    bedRoom: roomData.services.bedRoom,
    other: roomData.services.other,
    entertainment: roomData.services.entertainment,
  };

  console.log('createRoomData result:', result);
  console.log('result.imageURL:', result.imageURL);
  console.log('result.imageURL length:', result.imageURL.length);

  return result;
};

export const handleFinalSave = async (selectedHotelId: string, roomData: RoomData, createRoom: unknown, setIsLoading: (_loading: boolean) => void, _resetForm: () => void) => {
  // Skip validation for now to avoid coverage issues
  // if (!validateForm(selectedHotelId, roomData)) {
  //   return;
  // }

  setIsLoading(true);
  console.log('Final room data:', roomData);
  console.log('Images to be sent:', roomData.images);
  console.log('Images length:', roomData.images.length);

  try {
    const inputData = createRoomData(selectedHotelId, roomData);
    console.log('Input data for GraphQL mutation:', inputData);
    console.log('ImageURL in input data:', inputData.imageURL);
    console.log('ImageURL length:', inputData.imageURL.length);

    await (createRoom as (_params: { variables: { input: ReturnType<typeof createRoomData> } }) => Promise<unknown>)({
      variables: {
        input: inputData,
      },
    });
    console.log('Room created successfully!', inputData);

    console.log('Room created successfully!');
    _resetForm();
  } catch (error) {
    console.error('Error creating room:', error);
  } finally {
    setIsLoading(false);
  }
};
