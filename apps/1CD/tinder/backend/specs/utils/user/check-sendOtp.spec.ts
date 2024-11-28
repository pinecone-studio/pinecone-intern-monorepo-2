
import nodemailer from 'nodemailer';
import { sendOtpMail } from '../../../src/utils/user/send-otp-email';
import { GraphQLError } from 'graphql';
jest.mock('nodemailer',()=>({
  createTransport:jest.fn()
}));
describe('sendOtpMail',()=>{
  it('should successfully send otp by email', async()=>{
    const mockEmail='test@gmail.com';
    const mockOtp=1234;
    process.env.OTP_SECRET="mockSecret";
    const mockSendMail=jest.fn().mockResolvedValue(true);
    (nodemailer.createTransport as jest.Mock).mockReturnValue({sendMail:mockSendMail});

    const result=await sendOtpMail(mockEmail,mockOtp);
    
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service:'gmail',
      auth:{
        user:'tomorbatmonhtsatsral@gmail.com',
        pass:process.env.OTP_SECRET,
      }
    });
    expect(mockSendMail).toHaveBeenCalledWith({
      from:'tomorbatmonhtsatsral@gmail.com',
      to:mockEmail,
      subject:'OTP Verification',
      text:`Your OTP is: ${mockOtp}. This OTP will expire in 5 minutes!`
    });
    expect(result).toBe('Email sent successfully')
  });

  it('should throw graphQlerror when otp sending fails',async()=>{
    const mockEmail='test@gmail.com';
    const mockOtp=1234;
    
    jest.fn().mockRejectedValue(new Error('sendEmail failed'));
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendEmail:mockEmail
    })
    await expect(sendOtpMail(mockEmail,mockOtp)).rejects.toThrow(GraphQLError);
    await expect(sendOtpMail(mockEmail,mockOtp)).rejects.toMatchObject({
      extensions:{code:'FAILED_OTP'}
    })
  })
})





