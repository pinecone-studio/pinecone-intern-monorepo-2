export type FilterType = {
  _id?: {
    $nin: string[];
  };
  hotelId?: {
    $in: string[];
  };
  price?: {
    $sort: { price: number };
  };
  roomType?: string;
};
export type HotelFilterType = {
  userRating?: {
    $gt: number;
  };
  starRating?: number;
  hotelAmenities?: {
    $in: string[];
  };
  hotelName?: { $regex: string; $options: string };
  _id?: { $in: string[] };
};
export type SortType = {
  roomsAveragePrice?: number;
  starRating?: number;
};
