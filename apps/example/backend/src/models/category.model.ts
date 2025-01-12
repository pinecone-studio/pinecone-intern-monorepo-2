import { Schema, model, models } from 'mongoose';

export type CategoryType = {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

const categorySchema = new Schema<CategoryType>({
  name: {
    type: String,
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

export const categoryModel = models['category'] || model('category', categorySchema);
