import { GraphQLError } from 'graphql';
import nodemailer from 'nodemailer';
export const sendOtpMail=async (email:string,otp:string)=>{
    try{
        const transporter=nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:'tomorbatmonhtsatsral@gmail.com',
                pass:process.env.OTP_SECRET,
            },
            debug: true, 
        });
        await transporter.sendMail({
            from:'tomorbatmonhtsatsral@gmail.com',
            to:email,
            subject:'OTP Verification',
             text: `Your OTP is: ${otp}. This OTP will expire in 5 minutes!`,
        })
        return 'Email sent successfully';

    }catch(error){
        console.log(error)
        throw new GraphQLError('Failed to send OTP email',{
            extensions:{
                code:'FAILED_OTP'
            }
        })
    }
    
}