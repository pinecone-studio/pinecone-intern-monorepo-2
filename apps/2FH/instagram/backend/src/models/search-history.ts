import { Schema, model, Model, models, Types } from "mongoose";

export type SearchHistorySchemaType = {
    author: Types.ObjectId
    searchedUserIds: Types.ObjectId[]
    updatedAt: Date
}

const SearchHistorySchema = new Schema<SearchHistorySchemaType>({
    author: {type:Schema.Types.ObjectId, ref:"User", required: true}, 
    searchedUserIds: [{type:Schema.Types.ObjectId, ref:"User"}],
},{
    timestamps:true
});

export const SearchHistory = (models.SearchHistory as Model<SearchHistorySchemaType>) || 
model<SearchHistorySchemaType>("SearchHistory", SearchHistorySchema)