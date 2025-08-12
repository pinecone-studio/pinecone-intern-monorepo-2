import { Schema, model, Model, models, Types } from "mongoose";
 
/* eslint-disable no-unused-vars */
export enum FollowRequestStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED'
  }
/* eslint-enable no-unused-vars */
 
export type FollowRequestSchemaType = {
    receiverId: Types.ObjectId
    requesterId: Types.ObjectId
    status: FollowRequestStatus
    createdAt: Date
}
 
const FollowRequestSchema = new Schema<FollowRequestSchemaType>({
    receiverId: {type: Schema.Types.ObjectId, ref: "User", required: true},
    requesterId: {type: Schema.Types.ObjectId, ref: "User", required: true},
    status: {type: String, enum: [FollowRequestStatus.PENDING, FollowRequestStatus.ACCEPTED, FollowRequestStatus.REJECTED], default: FollowRequestStatus.PENDING},
}, {
    timestamps: true
});
 
export const FollowRequest = (models.FollowRequest as Model<FollowRequestSchemaType>) ||
model<FollowRequestSchemaType>("FollowRequest", FollowRequestSchema)
 