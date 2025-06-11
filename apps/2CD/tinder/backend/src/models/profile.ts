import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bio: { type: String, default: '', maxlength: 500 },
  age: { type: Number, required: true, min: 18 },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  lookingFor: { type: String, enum: ['Male', 'Female', 'Both'], required: true },
  interests: { type: [String], default: [] },
  profession: { type: String, default: '' },
  education: { type: String, default: '' },
  isCertified: { type: Boolean, default: false },
  images: { type: [String], default: [], validate: [(val: string[]) => val.length > 1, 'At least two images are required'] },
}, { timestamps: true });

export const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema); 