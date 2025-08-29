import mongoose from 'mongoose';

export interface IProfile {
  userId: mongoose.Types.ObjectId;
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'BOTH';
  bio: string;
  interests: string[];
  photos: string[];
  profession: string;
  work: string;
  images: string[];
  dateOfBirth: string;
  likes: mongoose.Types.ObjectId[];
  matches: mongoose.Types.ObjectId[];
  location: {
    type: string;
    coordinates: number[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema = new mongoose.Schema<IProfile>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['MALE', 'FEMALE', 'BOTH'], required: true },
  bio: { type: String, default: '' },
  interests: [{ type: String }],
  photos: [{ type: String }],
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  }
}, {
  timestamps: true
});

profileSchema.index({ location: '2dsphere' });

export const ProfileModel = mongoose.model<IProfile>('Profile', profileSchema);