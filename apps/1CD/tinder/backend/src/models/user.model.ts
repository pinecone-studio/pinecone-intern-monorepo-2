import { model, models, Schema } from "mongoose"

export type UserType={
    _id:string,
    name:string,
    email:string,
    password:string,
    otp?:number,
    bio:string,
    age:Date,
    gender:string,
    interests:[string],
    photos:[string],
    preferredGender:string,
    profession:string,
    schoolWork:[string],
    createdAt:Date,
    updatedAt:Date,
}

const userSchema=new Schema<UserType>({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    otp:{
        type:Number,
    },
    bio:{
        type:String,
        required:true,
    },
    age:{
        type:Date,
        required:true,
    },
    gender:{
        type:String,
        enum:['male','female','both'],
        required:true,
    },
    interests:{
        type:[String],
        required:true
    },
    photos:{
        type:[String],
        required:true
    },
    preferredGender:{
        type:String,
        enum:['male', 'female','both'],
        required:true
    },
    profession:{
        type:String
    },
    schoolWork:{
        type:[String],
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
        required:true

    },
    updatedAt:{
        type:Date,
        default:Date.now,
        required:true,
    },
});

export const userModel=models['user'] || model('user', userSchema)