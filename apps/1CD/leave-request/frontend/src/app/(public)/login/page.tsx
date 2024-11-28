"use client";

import Image from "next/image";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import logo from "@/components/logo.png";
import Link from "next/link";
import * as Yup from 'yup';

export default function Login  () {
    const validationSchema = Yup.object({
        email: Yup.string().email('буруу и-мэйл').required('И-мэйл ээ оруулна уу'),
      });
  return (<div className="mt-24">
            <Card className=" bg-white w-[500px] h-full m-auto mx-auto p-12">
                <h1 className="font-bold text-center mb-6  mx-4">Нэвтрэх</h1>
                <Image src={logo.src} alt="logo"   width={150}  height={150} className="mx-auto "/>
                <div className="mt-8 mx-4">
                    <Label className=" mt-4 ">И-мэйл хаяг</Label>
                    <Input type="email" id="email" placeholder="Email" className="mt-2"/>
                </div>
                <Button variant="default2" className="mt-6 mx-4 w-[375px] mb-6 ">
                    <Link href="/sendOtp">
                         Нэвтрэх
                    </Link>
                </Button>
            </Card>
          
        </div>
        )
}



