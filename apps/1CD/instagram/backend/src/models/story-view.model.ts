import { Schema, model, models } from 'mongoose';
import { UserType } from './user.model';

export type ViewStoryType = {
  _id: string;
  storyId: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  viewed: boolean;
  createdAt: Date;
};

const viewStorySchema = new Schema<ViewStoryType>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'userModel',
    required: true,
  },
  storyId: {
    type: Schema.Types.ObjectId,
    ref: 'storyModel',
    required: true,
  },
  viewed: {
    type: Boolean,
    default: false,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export type ViewStoryPopulatedType = Omit<ViewStoryType, 'user'> & {
  user: UserType;
};

export const viewStoryModel = models['viewStoryModel'] || model('viewStoryModel', viewStorySchema);
