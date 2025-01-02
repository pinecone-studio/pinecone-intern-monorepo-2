export type UserInfo = {
  email: string;
  phoneNumber: string;
};

export type Order = {
  _id: string;
  buyQuantity: number;
  price: number;
  zoneName: string;
};
export type HandleInput = {
  idx: number;
  id: string;
  price: number;
  name: string;
  operation: 'increment' | 'decrement';
};
