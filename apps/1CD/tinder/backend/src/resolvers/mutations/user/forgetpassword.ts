import { userModel } from '../../../models';
import { generateOTP } from '../../../utils/user/generate-otp';
import { sendOtpMail } from '../../../utils/user/send-otp-email';

const forgetPassword = {
  Mutation: {
    registerEmail: async (_: unknown, { input }: { input: { email: string } }) => {
      const { email } = input;

      const user = await userModel.findOne({ email });
      if (!user) {
        return {
          success: false,
          message: 'Энэ имэйл бүртгэлгүй байна. Бүртгэл үүсгэнэ үү.',
        };
      }

      const otp = generateOTP();
      user.otp = otp;
      await user.save();

      await sendOtpMail(email, otp);

      return {
        success: true,
        message: 'OTP амжилттай илгээгдлээ.',
        email,
      };
    },
    registerOtp: async (_: unknown, { input }: { input: { email: string; otp: number } }) => {
      const { email, otp } = input;

      const user = await userModel.findOne({ email });
      if (!user || user.otp !== otp) {
        return {
          success: false,
          message: 'Буруу OTP эсвэл хэрэглэгч олдсонгүй.',
        };
      }

      user.otp = undefined;
      await user.save();

      return {
        success: true,
        message: 'OTP амжилттай баталгаажлаа.',
        email,
      };
    },

    registerPassword: async (_: unknown, { input }: { input: { email: string; otp: number; password: string } }) => {
      const { email, otp, password } = input;

      const user = await userModel.findOne({ email });
      if (!user || user.otp !== otp) {
        return {
          success: false,
          message: 'Буруу OTP эсвэл хэрэглэгч олдсонгүй.',
        };
      }

      user.password = password;
      user.otp = undefined;
      await user.save();

      return {
        success: true,
        message: 'Нууц үг амжилттай тохируулагдлаа.',
        email,
      };
    },
  },
};

export default forgetPassword;
