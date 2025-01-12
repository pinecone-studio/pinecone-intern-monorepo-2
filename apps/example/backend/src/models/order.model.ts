import { Schema, Types, model, models } from 'mongoose';
import { UserType } from './user.model';
import { ProductPopulatedType } from './product.model';

export type OrderType = {
  _id: string;
  user: Types.ObjectId;
  products: {
    product: string;
    quantity: number;
    priceWhenOrdered: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
};

const orderSchema = new Schema<OrderType>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      priceWhenOrdered: {
        type: Number,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export type OrderPopulatedType = OrderType & {
  user: UserType;
  products: {
    product: ProductPopulatedType;
    quantity: number;
    priceWhenOrdered: number;
  }[];
};

export const orderModel = models['order'] || model('order', orderSchema);
