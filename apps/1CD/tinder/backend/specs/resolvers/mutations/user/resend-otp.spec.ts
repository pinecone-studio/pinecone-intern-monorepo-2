
import { resendOtp } from "../../../../src/resolvers/mutations";
import { generateOTP } from "../../../../src/utils/user/generate-otp";
import { sendOtpMail } from "../../../../src/utils/user/send-otp-email";
import { GraphQLResolveInfo } from "graphql";

jest.mock('../../../../src/models',()=>({
    userModel:{
        findOneAndUpdate:jest.fn(),
    }
}));
jest.mock('../../../../src/utils/user/generate-otp',()=>({
    generateOTP:jest.fn()
}));
jest.mock('../../../../src/utils/user/send-otp-email',()=>({
    sendOtpMail:jest.fn()
}));
describe('resend otp',()=>{
    const mockEmail="example@gmail.com";
    const mockOtp='1234';
    const mockInfo={} as GraphQLResolveInfo;
    const userId=null;
    it('should successfully resend the otp ',async()=>{
        const input={email:mockEmail};
        (generateOTP as jest.Mock).mockReturnValue(mockOtp);
        (sendOtpMail as jest.Mock).mockResolvedValue('Email sent successfully');
        const res=await resendOtp!({},{input},{userId},mockInfo);
        expect(res).toEqual({
            email:mockEmail
        })

    })
})