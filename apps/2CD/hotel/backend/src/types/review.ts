export interface ReviewDocument {
  _id: string;
  user: {
    _id: string;
    email: string;
  } | null | undefined;
  hotel: {
    _id: string;
    hotelName: string;
  } | null | undefined;
  comment: string;
  star: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransformedReview {
  id: string;
  user: {
    _id: string;
    email: string;
  } | null;
  hotel: {
    id: string;
    hotelName: string;
  } | null;
  comment: string;
  star: number;
  createdAt: Date;
  updatedAt: Date;
} 