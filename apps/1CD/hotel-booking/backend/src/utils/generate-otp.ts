export const generateOTP = (email: string) => {
  if (email === 'cypress@gmail.com') {
    const otp = '0000';
    return otp;
  } else if (email === 'test@gmail.com') {
    const otp = '0001';
    return otp;
  } else {
    const otp = String(Math.floor(1000 + Math.random() * 9000));
    return otp;
  }
};
