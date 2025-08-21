// apps/2FH/tinder/backend/src/mutations/swipe-types.ts
import { Types } from "mongoose";

export interface SwipeProfile {
  userId: Types.ObjectId;
  name: string;
  likes: Types.ObjectId[];
  matches: Types.ObjectId[];
}

export interface SwipeInput {
  swiperId: string;
  targetId: string;
  action: "LIKE" | "DISLIKE" | "SUPER_LIKE";
}