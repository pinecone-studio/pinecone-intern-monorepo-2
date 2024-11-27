import { model, models, Schema } from 'mongoose';

type Category = {
  _id: Schema.Types.ObjectId;
  name: string;
};

const categorySchema = new Schema<Category>(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category = models['Category'] || model<Category>('Category', categorySchema);
export default Category;
