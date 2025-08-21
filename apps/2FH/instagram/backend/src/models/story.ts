import { Schema, model, Model, models, Types } from "mongoose";

export type StorySchemaType = {
    author: Types.ObjectId
    image: string
    viewers: Types.ObjectId[]
    createdAt: Date
    updatedAt: Date
    expiredAt: Date
}

const StorySchema = new Schema<StorySchemaType>({
    author: {type: Schema.Types.ObjectId, ref: "User", required: true},
    image: {type: String, required: true},
    viewers: [{type: Schema.Types.ObjectId, ref: "User"}],
    expiredAt: Date
}, {
    timestamps: true
});

export const Story = (models.Story as Model<StorySchemaType>) ||
model<StorySchemaType>("Story", StorySchema)