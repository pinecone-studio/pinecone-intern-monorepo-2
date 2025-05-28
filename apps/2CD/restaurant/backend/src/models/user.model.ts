import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
});

export const Food = mongoose.models.User || mongoose.model('User', UserSchema);
