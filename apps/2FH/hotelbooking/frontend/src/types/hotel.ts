export interface SearchParams {
  location: string;
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  guests: {
    adults: number;
    children: number;
    rooms: number;
  };
}

export interface Hotel {
  id: string;
  name: string;
  rating?: number;
  stars?: number;
  amenities: string[];
  images?: string[];
  image?: string;
  description?: string;
  price?: number;
  location?: string;
  city?: string;
  country?: string;
  phone?: string;
  languages?: string[];
  isPopular?: boolean;
  bookingCount?: number;
}

export interface SearchHomeProps {
  onSearch: (params: SearchParams) => void;
  initialLocation?: string;
}
