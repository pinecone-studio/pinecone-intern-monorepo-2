import { Types, Document } from 'mongoose';
import mongoose from 'mongoose';
import { UserType } from './user';

export interface MatchType extends Document {
  users: Types.ObjectId[];
  createdAt: Date;
}

export interface MatchPopulatedType extends Omit<MatchType, 'users'> {
  users: UserType[];
}

const matchSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Match = mongoose.model('Match', matchSchema);
export default Match;
