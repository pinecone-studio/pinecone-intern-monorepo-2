import { Schema, model, Model, models, Types } from "mongoose";

export enum NotificationTypeEnum {
    FOLLOW_REQUEST_SENT = "FOLLOW_REQUEST_SENT",
    FOLLOW_ACCEPTED = "FOLLOW_ACCEPTED",
    POST_LIKE = "POST_LIKE",
    COMMENT = "COMMENTED",
    COMMENT_LIKE = "COMMENT_LIKE"
}


export type NotificationSchemaType = {
    receiver: Types.ObjectId
    sender: Types.ObjectId
    type: NotificationTypeEnum
    post?: Types.ObjectId
    followrequest?: Types.ObjectId
    message:string
    isRead: Boolean
    createdAt: Date
};

const NotificationSchema = new Schema<NotificationSchemaType>({
    receiver: {type: Schema.Types.ObjectId, ref: "User", required: true},
    sender: {type: Schema.Types.ObjectId, ref: "User", required: true},
    type: {type: String, enum:Object.values(NotificationTypeEnum), required: true},
    post: {type:Schema.Types.ObjectId, ref: "Post"},
    followrequest: {type:Schema.Types.ObjectId, ref: "FollowRequest"},
    message: {type:String, required:true},
    isRead: {type: Boolean, default: false}
}, {
    timestamps: true
})

export const Notification = (models.Notification as Model<NotificationSchemaType>) || 
model<NotificationSchemaType>("Notification", NotificationSchema)