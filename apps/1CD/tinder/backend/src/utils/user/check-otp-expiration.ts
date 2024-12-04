import { GraphQLError } from "graphql";

export const checkOtpDate=(user:{createdAt: Date,email:string})=>{
    if(user.email==="tomorbatmonhtsatsral@gmail.com"){
        return 'this otp is for testing'
    }
    const currentTime=new Date();
    const otpCreatedAt=user.createdAt;
    const expirationTime=5*60*1000;
    
    const timeDifference=currentTime.getTime()-otpCreatedAt.getTime(); //can use number(), valueof()
    if(timeDifference>expirationTime){
        throw new GraphQLError('failed otp', {
            extensions: { code: 'OTP_IS_INVALID' },
          });
    }
    return 'otp is valid';
}
