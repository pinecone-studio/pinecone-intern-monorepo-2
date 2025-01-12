import { Schema, Types, model, models } from 'mongoose';
import { CategoryType } from './category.model';

export type ProductType = {
  _id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const productSchema = new Schema<ProductType>({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'category',
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

export type ProductPopulatedType = Omit<ProductType, 'category'> & {
  category: CategoryType;
};

export const productModel = models['product'] || model('product', productSchema);
