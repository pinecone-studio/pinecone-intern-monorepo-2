import { Schema, model, Model, models, Types } from "mongoose";

export type PostSchemaType = {
    author: Types.ObjectId
    image: string[]
    caption?: string
    likes: Types.ObjectId[]
    comments: Types.ObjectId[]
    createdAt: Date
    updatedAt: Date
}

const PostSchema = new Schema<PostSchemaType>({
    author: {type:Schema.Types.ObjectId, ref: "User", required: true},
    image: [{type: String, required: true}],
    caption: {type: String , default:""},
    likes: [{type: Schema.Types.ObjectId, default:[], ref: "User"}],
    comments: [{type: Schema.Types.ObjectId,default:[], ref: "Comment"}],
}, {
    timestamps: true
});
export const PostModel = (models.Post as Model<PostSchemaType>) ||
  model<PostSchemaType>("Post", PostSchema)