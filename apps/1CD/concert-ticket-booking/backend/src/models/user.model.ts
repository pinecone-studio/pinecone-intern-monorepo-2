import { model, models, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

type User = {
  _id: Schema.Types.ObjectId;
  email: string;
  password: string;
  role: string;
  phoneNumber?: string;
  otp: string;
  passwordResetToken: string;
  passwordResetTokenExpire: Date;
};
const userSchema = new Schema<User>(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'Хэрэглэгчийн имейл оруулах'],
    },
    password: {
      type: String,
      minlength: [8, 'Хэрэглэгчийн пасс хамгийн багадаа 8 тэмдэгт байна'],
      required: [true, 'Хэрэглэгчийн түлхүүр үг оруулах'],
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    phoneNumber: String,
    otp: {
      type: String,
      default: null,
    },
    passwordResetToken: { type: String, default: '' },
    passwordResetTokenExpire: { type: Date, default: undefined },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  } else {
    const hashedPassword = bcrypt.hashSync(this.password, 10);
    this.password = hashedPassword;
    next();
  }
});

const User = models['User'] || model<User>('User', userSchema);
export default User;
