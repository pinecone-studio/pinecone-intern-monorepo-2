import { Schema, model, models } from 'mongoose';

import { UserType } from './user.model';

export type ViewStoryType = {
  _id: string;
  storyId: Schema.Types.ObjectId;
  watchedUsers: [{ user: Schema.Types.ObjectId; isViewed: boolean }];
  createdAt: Date;
};

const viewStorySchema = new Schema<ViewStoryType>(
  {
    watchedUsers: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'userModel',
          required: true,
        },
        isViewed: {
          type: Boolean,
          default: false,
          required: true,
        },
      },
    ],
    storyId: {
      type: Schema.Types.ObjectId,
      ref: 'storyModel',
      required: true,
    },

    createdAt: {
      type: Date,
      default: new Date(),
    },
  },
  { timestamps: true }
);

export type ViewStoryPopulatedType = Omit<ViewStoryType, 'watchedUsers'> & {
  watchedUsers: {
    user: UserType;
  }[];
};

export const viewStoryModel = models['viewStoryModel'] || model('viewStoryModel', viewStorySchema);
