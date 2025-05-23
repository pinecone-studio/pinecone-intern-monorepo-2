import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Important for security (excludes password from queries by default)
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
      validate: [(val: string[]) => val.length > 1, 'At least two images are required'],
    },
    bio: {
      type: String,
      default: '',
      maxlength: 500,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true,
    },
    lookingFor: {
      type: String,
      enum: ['Male', 'Female', 'Both'],
      required: true,
    },
    interests: {
      type: [String],
      default: [],
    },
    profession: {
      type: String,
      default: '',
    },
    education: {
      type: String,
      default: '',
    },
    isCertified: {
      type: Boolean,
      default: false,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;


