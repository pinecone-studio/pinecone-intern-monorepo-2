import { Schema, model, models } from 'mongoose';
import { UserType } from './user.model';

export type StoryType = {
  _id: string;
  userId: Schema.Types.ObjectId;
  description: string;
  image: string;
  createdAt: Date;
};

const storySchema = new Schema<StoryType>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'userModel',
    required: true,
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
});

export type StoryPopulatedType = Omit<StoryType, 'followingId'> & {
  userId: UserType;
};

export const storyModel = models['storyModel'] || model('storyModel', storySchema);
