import { model, Schema } from 'mongoose';

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

const Category = model<Category>('Category', categorySchema);
export default Category;
