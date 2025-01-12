import { Schema, model, models } from 'mongoose';

export type Book = {
  _id: string;
  title: string;
  author: Schema.Types.ObjectId;
};

const BookSchema = new Schema<Book>({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Author',
    required: true,
  },
});

export const BookModel = models.Book || model<Book>('Book', BookSchema);
