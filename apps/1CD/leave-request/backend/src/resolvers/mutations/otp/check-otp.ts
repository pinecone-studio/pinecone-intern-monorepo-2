import { OTPModel, UserModel } from '../../../models';
import { createToken } from '../../../utils/create-token';

export const checkOTP = async (_:unknown,{email, OTP}: { email: string, OTP: string }) => {
  const otp = await OTPModel.findOne({ email, OTP });
  if(!otp){
    throw new Error('User not found')
  }
  if (otp.expirationDate < new Date()) {
    throw new Error('OTP is expired')
  }

  await OTPModel.deleteOne({email})

  const user = await UserModel.findOne({ email });

  const token = createToken(user);

  return token;
};

