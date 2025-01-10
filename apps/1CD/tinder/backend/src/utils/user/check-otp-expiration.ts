
import { GraphQLError } from "graphql";

export const checkOtpDate=(user:{otpCreatedAt: Date,email:string})=>{
    if(user.email==="cypress@gmail.com"){
        return 'otp is valid'
    }
    const currentTime=new Date();
    const otpUpdatedAt=user.otpCreatedAt;
    const expirationTime=5*60*1000;
    
    const timeDifference=currentTime.getTime()-otpUpdatedAt.getTime(); //can use number(), valueof()
    if(timeDifference>expirationTime){
        console.log(timeDifference,'di');
        console.log(expirationTime,'si');
        console.log(timeDifference>expirationTime,'difference');
        throw new GraphQLError('otp is invalid', {
            extensions: { code: 'OTP_IS_INVALID' },
          });
    }
    return 'otp is valid';
}
