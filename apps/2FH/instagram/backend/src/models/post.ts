import { Schema, model, Model, models, Types } from "mongoose";

export type PostSchemaType = {
    author: Types.ObjectId
    image: string
    caption?: string
    likes: Types.ObjectId[]
    comments: Types.ObjectId[]
    createdAt: Date
    updatedAt: Date
}

const PostSchema = new Schema<PostSchemaType>({
    author: {type:Schema.Types.ObjectId, ref: "User", required: true},
    image: {type: String, required: true},
    caption: {type: String},
    likes: [{type: Schema.Types.ObjectId, ref: "User"}],
    comments: [{type: Schema.Types.ObjectId, ref: "Comment"}],
}, {
    timestamps: true
});

export const Post = (models.Post as Model<PostSchemaType>) ||
model<PostSchemaType>("Post", PostSchema)