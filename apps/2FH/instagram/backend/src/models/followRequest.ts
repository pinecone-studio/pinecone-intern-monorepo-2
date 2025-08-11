import { Schema, model, Model, models, Types } from "mongoose";

export enum FollowRequestStatusEnum {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
}

export type FollowRequestSchemaType = {
    receiverId: Types.ObjectId
    requesterId: Types.ObjectId
    status: FollowRequestStatusEnum
    createdAt: Date
}

const FollowRequestSchema = new Schema<FollowRequestSchemaType>({
    receiverId: {type: Schema.Types.ObjectId, ref: "User", required: true},
    requesterId: {type: Schema.Types.ObjectId, ref: "User", required: true},
    status: {type: String, enum:Object.values(FollowRequestStatusEnum), default: FollowRequestStatusEnum.PENDING},
}, {
    timestamps: true
});

export const FollowRequest = (models.FollowRequest as Model<FollowRequestSchemaType>) || 
model<FollowRequestSchemaType>("FollowRequest", FollowRequestSchema)

 