'use client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAuth } from '@/components/providers';
export default function editProfile() {
  const { user } = useAuth();
  const [info, setInfo] = useState({
    fullName: user?.fullName || '',
    userName: user?.userName || '',
    bio: user?.bio || '',
    gender: user?.gender || '',
  });
  console.log('object', info);

  return (
    <div className="mt-[65px] ml-[411px] w-[600px] flex flex-col justify-between pb-[123px]  ">
      <div>
        <div className="text-[#09090B] text-[30px] font-semibold">Edit Profile</div>
        <div className="flex justify-between mt-11 ">
          <div className="flex">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="ml-4 text-[#262626] text-[16px] justify-center items-center content-center">upvox_</div>
          </div>
          <Select>
            <SelectTrigger className="w-[196px] bg-[#F4F4F5]">
              <SelectValue placeholder="Change profile photo" />
            </SelectTrigger>
            <SelectContent className="hover:text-[#2563EB]">
              <SelectItem value="Upload New Photo">Upload New Photo</SelectItem>
              <SelectItem value="Remove Current Photo">Remove Current Photo</SelectItem>
              <SelectItem value="Cancel">Cancel</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mt-6">
          <div className="text-[#262626] text-[16px] font-semibold mb-2">Name</div>
          <Input className="px-3 py-2 text-[#71717A] border-[1px] rounded-md w-full" />
          <div className="mt-3 text-[#8E8E8E] text-xs ">
            <span>Help people discover your account by using the name youre known by: either your full name, nickname, or business name.</span>
            <div className="mt-3"> You can only change your name twice within 14 days.</div>
          </div>
          <div className="mt-5">
            <div className="text-[#262626] text-[16px] font-semibold mb-2">Username</div>
            <Input className="px-3 py-2 text-[#71717A] border-[1px] rounded-md w-full" />
          </div>
          <div className="mt-5 mb-5">
            <div className="text-[#262626] text-[16px] font-semibold mb-2">Bio</div>
            <Textarea onChange={(e) => setInfo({ ...info, [info?.bio]: e.target.value })} />
            <div className="flex justify-end text-sm text-[#71717A]">
              <p className="r-0">{info?.bio.length}/150</p>
            </div>
          </div>
          <div className="text-[#262626] text-[16px] font-semibold mb-2">Gender</div>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Prefer not to say" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex flex-row-reverse mt-10">
            <Button className="bg-[#2563EB]">Submit</Button>
          </div>
        </div>
      </div>

      <div className="mt-11 text-[#71717A] text-sm text-center">
        About · Help · Press · API · Jobs · Privacy · Terms · Locations · Language · Meta Verified
        <p className="mt-4">© 2024 INSTAGRAM FROM META</p>
      </div>
    </div>
  );
}
