import { Bathroom, Accessibility, Entertainment, FoodAndDrink, Other, Internet, BedRoom } from '@/generated';

export const useRoomServiceOptions = () => {
  const bathroomOptions = [
    { value: Bathroom.Private, label: 'Private' },
    { value: Bathroom.Shared, label: 'Shared' },
    { value: Bathroom.Bathrobes, label: 'Bathrobes' },
    { value: Bathroom.FreeToiletries, label: 'Free Toiletries' },
    { value: Bathroom.HairDryer, label: 'Hair Dryer' },
  ];

  const accessibilityOptions = [
    { value: Accessibility.WheelchairAccessible, label: 'Wheelchair Accessible' },
    { value: Accessibility.WheelchairAccessibleBathroom, label: 'Wheelchair Accessible Bathroom' },
    { value: Accessibility.WheelchairAccessibleShower, label: 'Wheelchair Accessible Shower' },
    { value: Accessibility.WheelchairAccessibleBathtub, label: 'Wheelchair Accessible Bathtub' },
  ];

  const entertainmentOptions = [
    { value: Entertainment.Tv, label: 'TV' },
    { value: Entertainment.CableChannels, label: 'Cable Channels' },
    { value: Entertainment.DvdPlayer, label: 'DVD Player' },
    { value: Entertainment.AdultMovies, label: 'Adult Movies' },
    { value: Entertainment.Computer, label: 'Computer' },
  ];

  const foodAndDrinkOptions = [
    { value: FoodAndDrink.FreeBreakfast, label: 'Free Breakfast' },
    { value: FoodAndDrink.FreeLunch, label: 'Free Lunch' },
    { value: FoodAndDrink.FreeDinner, label: 'Free Dinner' },
    { value: FoodAndDrink.FreeSnacks, label: 'Free Snacks' },
    { value: FoodAndDrink.FreeDrinks, label: 'Free Drinks' },
  ];

  const otherOptions = [
    { value: Other.DailyHousekeeping, label: 'Daily Housekeeping' },
    { value: Other.Desk, label: 'Desk' },
    { value: Other.LaptopWorkspace, label: 'Laptop Workspace' },
    { value: Other.LaptopWorkspaceNotAvailable, label: 'Laptop Workspace Not Available' },
  ];

  const internetOptions = [
    { value: Internet.FreeWifi, label: 'Free WiFi' },
    { value: Internet.FreeWiredInternet, label: 'Free Wired Internet' },
  ];

  const bedRoomOptions = [
    { value: BedRoom.AirConditioner, label: 'Air Conditioner' },
    { value: BedRoom.BedSheets, label: 'Bed Sheets' },
    { value: BedRoom.Pillows, label: 'Pillows' },
    { value: BedRoom.Blankets, label: 'Blankets' },
  ];

  return {
    bathroomOptions,
    accessibilityOptions,
    entertainmentOptions,
    foodAndDrinkOptions,
    otherOptions,
    internetOptions,
    bedRoomOptions,
  };
};
