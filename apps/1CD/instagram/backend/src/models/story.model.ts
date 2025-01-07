import mongoose, { Schema, model, models } from 'mongoose';
import { UserType } from './user.model';

export type StoryType = {
  _id: string;
  userId: Schema.Types.ObjectId;
  userStories: [{ story: { _id: Schema.Types.ObjectId; description: string; image: string; createdAt: Date; endDate: string } }];
};

const storySchema = new Schema<StoryType>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'userModel',
      required: true,
    },
    userStories: [
      {
        story: {
          _id: {
            type: Schema.Types.ObjectId,
            default: new mongoose.Types.ObjectId(),
          },
          description: {
            type: String,
          },
          image: {
            type: String,
          },
          createdAt: {
            type: Date,
            default: new Date(),
          },
          endDate: {
            type: String,
            default: () => {
              return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
            },
          },
        },
      },
    ],
  },
  { timestamps: true }
);

export type StoryPopulatedType = Omit<StoryType, 'userId'> & {
  userId: UserType;
};

export const storyModel = models['storyModel'] || model('storyModel', storySchema);
