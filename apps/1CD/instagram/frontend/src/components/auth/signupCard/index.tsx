import * as React from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export const SignupCard = () => {
  return (
    <Card className="w-[350px] mx-auto text-center border-none bg-white text-sm text-[#09090B] leading-5 font-normal">
      <CardHeader className="space-y-4">
        <CardTitle className="mt-8">
          <Image src="/images/Vector.png" alt="Instagram Logo" width={175} height={51} className="mx-auto" />
        </CardTitle>
        <CardDescription className="px-10 text-sm text-[#09090B] leading-5 font-normal">Sign up to see photos and videos from your friends</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid items-center w-full gap-2">
            <Input id="email" placeholder="Email" className="b text-xs px-2 py-[9px]" />
            <Input id="fullname" placeholder="Full Name" className=" text-xs px-2 py-[9px]" />
            <Input id="username" placeholder="Username" className=" text-xs px-2 py-[9px]" />
            <Input id="password" type="password" placeholder="Password" className=" text-xs px-2 py-[9px]" />
            <div className="px-2 mt-2 text-xs text-gray-500">
              <p className="text-center">
                People who use our service may have uploaded your contact information to Instagram.
                <span className="text-[#2563EB] cursor-pointer"> Learn More</span>
              </p>
            </div>
            <div className="px-2 mt-2 text-xs text-gray-500">
              <p className="text-center">
                By signing up, you agree to our
                <span className="text-[#2563EB] cursor-pointer"> Terms</span>,<span className="text-[#2563EB] cursor-pointer"> Privacy Policy</span> and
                <span className="text-[#2563EB] cursor-pointer"> Cookies Policy</span>.
              </p>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button className="w-full bg-[#2563EB80] hover:bg-[#2563EB] text-white">Sign up</Button>
      </CardFooter>
    </Card>
  );
};
