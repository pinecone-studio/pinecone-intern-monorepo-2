import { Schema, model, models } from 'mongoose';

export type Author = {
  _id: string;
  name: string;
};

const AuthorSchema = new Schema<Author>({
  name: {
    type: String,
    required: true,
  },
});

export const AuthorModel = models.Author || model<Author>('Author', AuthorSchema);
