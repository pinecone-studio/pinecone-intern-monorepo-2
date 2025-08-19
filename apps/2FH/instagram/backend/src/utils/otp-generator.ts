import otpGenerator from "otp-generator";
export const generateOTP = (): string => {

return otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
    digits: true
   });
};