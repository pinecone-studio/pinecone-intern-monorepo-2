import { MutationResolvers, Response } from '../../../generated';
import { otpModel } from '../../../models';
import { isBefore, subMinutes } from 'date-fns';

export const verifyOtp: MutationResolvers['verifyOtp'] = async (_, { input }) => {
  const { otp, email } = input;

  const otpRecord = await otpModel.findOne({ email, otp });

  if (!otpRecord) {
    throw new Error('Invalid OTP');
  }

  const fiveMinutesAgo = subMinutes(new Date(), 5);

  if (isBefore(otpRecord.createdAt, fiveMinutesAgo)) {
    throw new Error('OTP has expired');
  }

  await otpModel.deleteOne({ email, otp });

  return Response.Success;
};
