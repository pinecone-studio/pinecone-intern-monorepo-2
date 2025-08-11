import { Schema, model, Model, models, Types } from "mongoose";

export enum Gender {
    FEMALE = "FEMALE",
    MALE = "MALE",
    OTHER = "OTHER",
  }

export type UserSchemaType = {
fullName: string
userName: string
email?: string
password: string
bio?: string
phoneNumber?: string
profileImage?: string
gender: Gender
isPrivate: Boolean
isVerified: Boolean
posts: Types.ObjectId[]
stories: Types.ObjectId[]
followers: Types.ObjectId[]
followings: Types.ObjectId[]
createdAt: Date
updatedAt: Date
};

const UserSchema = new Schema<UserSchemaType>({
fullName: {type: String, required: true},
userName: {type: String, required: true, unique: true},
email: {type: String, unique: true},
phoneNumber: {type: String, unique: true},
password: {type: String, required: true},
bio: {type: String},
profileImage: {type: String},
gender: {type: String, enum:Object.values(Gender), required: true},
isPrivate: {type: Boolean, default: false},
isVerified: {type: Boolean, default: false},
posts: [{type:Schema.Types.ObjectId, ref: "Post"}],
stories: [{type: Schema.Types.ObjectId, ref: "Stoty"}],
followers: [{type: Schema.Types.ObjectId, ref: "User"}],
followings: [{type: Schema.Types.ObjectId, ref: "User"}]
}, {
    timestamps: true
});

export const User = (models.User as Model<UserSchemaType>) || 
model<UserSchemaType>("User", UserSchema)