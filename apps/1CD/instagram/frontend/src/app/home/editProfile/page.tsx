'use client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAuth } from '@/components/providers';
import { AccountVisibility, useChangeProImgMutation, useGetUserQuery, useUpdateUserDataMutation } from '@/generated';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import UpdateProImg from '@/app/(main)/_components/editProfile/UpdateProImg';
import UpdateProImg1 from '@/app/(main)/_components/editProfile/UpdateProImg1';
import { toast } from '@/components/ui/use-toast';
export type Account = {
  Private: string;
  Public: string;
};

export type infoType = {
  fullName: string;
  userName: string;
  bio: string;
  gender: string;
  accountVisibility: string;
};

const EditProfile = () => {
  const [updateUserData, { loading }] = useUpdateUserDataMutation();
  const { refetch } = useGetUserQuery();
  const { user, changeProfileImg } = useAuth();
  const [proImgData, setProImgData] = useState<string>('');
  const [image, setImage] = useState<string>(proImgData);

  const [info, setInfo] = useState<infoType>({
    fullName: user?.fullName as string,
    userName: user?.userName as string,
    bio: user?.bio as string,
    gender: user?.gender as string,
    accountVisibility: user?.accountVisibility as AccountVisibility,
  });

  const handleUpdateInfo = async () => {
    await updateUserData({
      variables: {
        input: {
          _id: user?._id as string,
          accountVisibility: info?.accountVisibility as AccountVisibility,
          bio: info.bio,
          fullName: info.fullName,
          gender: info.gender,
          userName: info.userName,
        },
      },
    });
    await refetch();
  };
  const [changeProImg] = useChangeProImgMutation({
    onCompleted: () => {
      toast({ variant: 'default', title: 'Success', description: 'Deleted Image' });
    },
    onError: (error) => {
      toast({ variant: 'destructive', title: 'Can not find user', description: `${error.message}` });
      console.log('change pro image iin error iig harah', error);
    },
  });

  const handleDeleteImage = async () => {
    await changeProImg({ variables: { input: { _id: user?._id as string, profileImg: '' } } });
    await refetch();
    setImage('');
    setProImgData(image);
  };

  return (
    <div className="mt-[65px] ml-[411px] w-[600px] flex flex-col justify-between pb-[123px]  ">
      <div>
        <div className="text-[#09090B] text-[30px] font-semibold">Edit Profile</div>
        <div className="flex justify-between mt-11 ">
          <div className="flex">
            <UpdateProImg changeProfileImg={changeProfileImg} proImgData={proImgData} setProImgData={setProImgData} _id={user?._id} prevProImg={user?.profileImg || '/images/profileImg.webp'} />

            <div className="ml-4 text-[#262626] text-[16px] justify-center items-center content-center">{user?.userName as string}</div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button data-test="moreBtn" variant="ghost" className="w-[196px] flex gap-2 bg-[#F4F4F5]">
                Change profile photo{' '}
                <span>
                  <ChevronDown />
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent data-testid="moreBtnDetails">
              <DropdownMenuItem className="text-blue-600">
                <UpdateProImg1 changeProfileImg={changeProfileImg} proImgData={proImgData} setProImgData={setProImgData} _id={user?._id} prevProImg={user?.profileImg || '/images/profileImg.webp'} />
              </DropdownMenuItem>
              <DropdownMenuItem data-testid="editBtn" onClick={handleDeleteImage}>
                Remove Current Photo
              </DropdownMenuItem>
              <DropdownMenuItem data-testid="CancelBtn">Cancel</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-6">
          <div className="text-[#262626] text-[16px] font-semibold mb-2">Name</div>
          <Input className="px-3 py-2 text-[#262626] border-[1px] rounded-md w-full" value={info.fullName} onChange={(e) => setInfo({ ...info, fullName: e.target.value })} />
          <div className="mt-3 text-[#8E8E8E] text-xs ">
            <span>Help people discover your account by using the name youre known by: either your full name, nickname, or business name.</span>
            <div className="mt-3"> You can only change your name twice within 14 days.</div>
          </div>
          <div className="mt-5">
            <div className="text-[#262626] text-[16px] font-semibold mb-2">Username</div>
            <Input className="px-3 py-2 text-[#262626] border-[1px] rounded-md w-full" value={info.userName} onChange={(e) => setInfo({ ...info, userName: e.target.value })} />
          </div>
          <div className="mt-5 mb-5">
            <div className="text-[#262626] text-[16px] font-semibold mb-2">Bio</div>
            <Textarea value={info.bio} onChange={(e) => setInfo({ ...info, bio: e.target.value })} />
            <div className="flex justify-end text-sm text-[#71717A]">
              <p className="r-0">{info?.bio?.length}/150</p>
            </div>
          </div>
          <div className="text-[#262626] text-[16px] font-semibold mb-2">Gender</div>
          <Select value={info?.gender} onValueChange={(e) => setInfo({ ...info, gender: e })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Prefer not to say" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-[#262626] text-[16px] font-semibold mb-2 mt-5">Account privacy</div>
          <Select value={info?.accountVisibility} onValueChange={(e) => setInfo({ ...info, accountVisibility: e })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Public or Private" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={AccountVisibility.Public}>Public</SelectItem>
              <SelectItem value={AccountVisibility.Private}>Private</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex flex-row-reverse mt-10">
            <Button className="bg-[#2563EB]" onClick={handleUpdateInfo}>
              {loading ? 'Updating' : 'Submit'}
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-11 text-[#71717A] text-sm text-center">
        About · Help · Press · API · Jobs · Privacy · Terms · Locations · Language · Meta Verified
        <p className="mt-4">© 2024 INSTAGRAM FROM META</p>
      </div>
    </div>
  );
};
export default EditProfile;
