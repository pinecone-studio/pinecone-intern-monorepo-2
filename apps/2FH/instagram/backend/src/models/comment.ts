import { Schema, model, Model, models, Types } from "mongoose";

export type CommentSchemaType = {
    author: Types.ObjectId
    postId: Types.ObjectId
    replyId?: Types.ObjectId[]
    content: string
    likes: Types.ObjectId[]
    createdAt: Date
    updatedAt: Date
}

const CommentSchema = new Schema<CommentSchemaType>({
    author: {type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: {type: Schema.Types.ObjectId, ref: "Post", required: true},
    replyId:  [{type: Schema.Types.ObjectId, ref: "Reply"}],
    content: {type: String, required: true},
    likes: [{type: Schema.Types.ObjectId, ref: "User"}],
}, {
    timestamps: true
});

export const Comment = (models.Comment as Model<CommentSchemaType>) ||
model<CommentSchemaType>("Comment", CommentSchema)