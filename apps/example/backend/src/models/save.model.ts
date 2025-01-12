import { Schema, Types, model, models } from 'mongoose';
import { UserType } from './user.model';
import { ProductPopulatedType } from './product.model';

export type SaveType = {
  _id: string;
  user: Types.ObjectId;
  product: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const saveSchema = new Schema<SaveType>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'product',
    required: true,
  },
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

export type SavePopulatedType = SaveType & {
  user: UserType;
  product: ProductPopulatedType;
};

export const saveModel = models['save'] || model('save', saveSchema);
