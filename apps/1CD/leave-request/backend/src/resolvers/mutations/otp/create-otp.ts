import { GraphQLResolveInfo } from 'graphql';
import { MutationResolvers } from '../../../generated';
import { OTPModel } from '../../../models/otp';
import { findUserByEmail } from '../../queries';

export const createsOTP: MutationResolvers['createsOTP'] = async (_, { email }) => {
  const user = await findUserByEmail!({}, { email }, {}, {} as GraphQLResolveInfo);
  if (!user) {
    throw new Error('User not found');
  }
  const oldOTP = await OTPModel.findOne({ email });
  if (oldOTP && oldOTP.expirationDate > new Date()) {
    throw new Error('Old OTP is not expired');
  }

  const otp = generateOTP();
  const otpObj = await OTPModel.create({
    email,
    OTP: otp,
    expirationDate: new Date(Date.now() + 10 * 60 * 1000), 
  });

  return otpObj;
};

const generateOTP = () => {
  const otp = Math.floor(1000 + Math.random() * 9000).toString(); 
  return otp;
};