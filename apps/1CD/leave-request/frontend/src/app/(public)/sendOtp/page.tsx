import Image from "next/image";
import {Label} from "@/components/ui/label";
import {Card} from "@/components/ui/card";
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp";
import logo from "@/components/logo.png";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

const SendOtp = () => {
    return(
        <div className="mt-24">
            <Card className=" bg-white w-[500px] h-full m-auto mx-auto p-10">
                <h1 className="font-bold text-center my-6 ">Нэвтрэх</h1>
                <Image src={logo.src} alt="logo"   width={150}  height={150} className="mx-auto "/>
                <div className="mt-8 flex flex-col items-center">
                    <Label className=" my-4 ">И-мэйлээ шалгаад код оо оруулна уу. </Label>
                        <InputOTP maxLength={6} className="mx-auto  ">
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                            </InputOTPGroup>
                        </InputOTP>
                </div>
                <div className="flex justify-between  p-6 items-center  ">
                    <Link href="/login">
                        <ArrowLeft />
                    </Link>
                    <Link href="/">
                         <RefreshCw />
                    </Link>  
                </div>
            </Card> 
        </div>
    )
}

export default SendOtp