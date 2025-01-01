/* eslint-disable no-unused-vars */
export enum OrderState {
  SELECT_TICKET = 1,
  CONFIRM_ORDER = 2,
  PAYMENT = 3,
}
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
