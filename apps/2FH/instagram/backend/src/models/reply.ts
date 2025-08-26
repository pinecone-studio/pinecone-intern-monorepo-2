import { Schema, model, Model, models, Types } from "mongoose";

export type ReplySchemaType = {
    author: Types.ObjectId
    commentId: Types.ObjectId
    replyId:  Types.ObjectId[]
    likes:Types.ObjectId[]
    content: string
    createdAt: Date
    updateAt: Date
}

const ReplySchema = new Schema<ReplySchemaType>({
    author: {type: Schema.Types.ObjectId, ref: "User", required: true},
    commentId: {type: Schema.Types.ObjectId, ref: "Comment", required: true},
    replyId:  [{type: Schema.Types.ObjectId, ref: "Reply"}],
    likes:[{type:Schema.Types.ObjectId,ref:"User"}],
    content: {type: String, required: true}
}, {
    timestamps: true
});

export const Reply = (models.Reply as Model<ReplySchemaType>) ||
model<ReplySchemaType>("Reply", ReplySchema)