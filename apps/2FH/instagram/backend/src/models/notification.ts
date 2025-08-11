import { Schema, model, Model, models, Types } from "mongoose";

/* eslint-disable no-unused-vars */
export enum NotificationType {
    FOLLOW_REQUEST_SENT = 'FOLLOW_REQUEST_SENT',
    FOLLOW_ACCEPTED = 'FOLLOW_ACCEPTED',
    POST_LIKE = 'POST_LIKE',
    COMMENT = 'COMMENT',
    COMMENT_LIKE = 'COMMENT_LIKE'
  }
/* eslint-enable no-unused-vars */

export type NotificationSchemaType = {
    receiver: Types.ObjectId
    sender: Types.ObjectId
    type: NotificationType
    post?: Types.ObjectId
    followrequest?: Types.ObjectId
    message:string
    isRead: boolean
    createdAt: Date
};

const NotificationSchema = new Schema<NotificationSchemaType>({
    receiver: {type: Schema.Types.ObjectId, ref: "User", required: true},
    sender: {type: Schema.Types.ObjectId, ref: "User", required: true},
    type: {type: String, enum: [NotificationType.FOLLOW_REQUEST_SENT, NotificationType.FOLLOW_ACCEPTED, NotificationType.POST_LIKE, NotificationType.COMMENT, NotificationType.COMMENT_LIKE], required: true},
    post: {type: Schema.Types.ObjectId, ref: "Post"},
    followrequest: {type: Schema.Types.ObjectId, ref: "FollowRequest"},
    message: {type: String, required: true},
    isRead: {type: Boolean, default: false}
}, {
    timestamps: true
})

export const Notification = (models.Notification as Model<NotificationSchemaType>) || 
model<NotificationSchemaType>("Notification", NotificationSchema)