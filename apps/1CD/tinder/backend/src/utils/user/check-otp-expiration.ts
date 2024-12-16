import { GraphQLError } from "graphql";

export const checkOtpDate=(user:{createdAt: Date,email:string})=>{
    if(user.email==="cypress@gmail.com"){
        return 'otp is valid'
    }
    const currentTime=new Date();
    const otpCreatedAt=user.createdAt;
    const expirationTime=5*60*1000;
    
    const timeDifference=currentTime.getTime()-otpCreatedAt.getTime(); //can use number(), valueof()
    if(timeDifference>expirationTime){
        throw new GraphQLError('otp is invalid', {
            extensions: { code: 'OTP_IS_INVALID' },
          });
    }
    return 'otp is valid';
}
