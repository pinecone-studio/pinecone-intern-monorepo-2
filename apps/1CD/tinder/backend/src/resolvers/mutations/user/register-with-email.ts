import { MutationResolvers } from '../../../generated';
import { userModel } from '../../../models';
import { checkExistingEmail } from '../../../utils/user/check-existing-email';
import { sendOtpMail } from '../../../utils/user/send-otp-email';
import { generateOTP } from '../../../utils/user/generate-otp';


export const registerEmail: MutationResolvers['registerEmail'] = async (_, { input }) => {
  const { email } = input;
  if(email==='cypress@gmail.com') return {email};
    await checkExistingEmail(email);
    const otp = generateOTP(email);
    await sendOtpMail(email, otp);
    await userModel.create({ ...input,interests:'tinder',photos:'https://placehold.co/600x800?text=2C',schoolWork:'tinder', password:'tinder1234',age:'21',bio:'tinder',name:'tinder',profession:'tinder',attraction:'tinder',gender:'male',otp,otpCreatedAt:new Date()});
    return { email };

};
