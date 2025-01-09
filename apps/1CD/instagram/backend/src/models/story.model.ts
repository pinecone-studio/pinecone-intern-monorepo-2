import mongoose, { Schema, model, models } from 'mongoose';

export type StoryType = {
  _id: string;
  user: Schema.Types.ObjectId;
  stories: {
    _id: Schema.Types.ObjectId;
    image: string;
    createdAt: Date;
    endDate: string;
  }[];
};

const storySchema = new Schema<StoryType>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'userModel',
      required: true,
    },
    stories: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          default: () => new mongoose.Types.ObjectId(),
        },
        image: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: new Date(),
          required: true,
        },
        endDate: {
          type: String,
          default: () => {
            return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
          },
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export const storyModel = models['storyModel'] || model('storyModel', storySchema);
