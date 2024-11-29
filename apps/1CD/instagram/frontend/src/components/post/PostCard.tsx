'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { LuDot } from 'react-icons/lu';
import { BiSolidChevronLeft, BiSolidChevronRight } from 'react-icons/bi';
import { FaRegBookmark, FaRegComment, FaRegHeart } from 'react-icons/fa';
import { CiFaceSmile } from 'react-icons/ci';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DeleteModal } from './DeleteModal';
import { useGetMyPostsQuery } from '@/generated';

const item = {
  img: '/images/img1.avif',
  name: 'defavours',
  _id: '6747e938f81062f3c8d5df89',
};

export const PostCard = () => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { data, loading } = useGetMyPostsQuery({
    variables: {
      userID: '673f738103387ea426252c1e',
    },
  });

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="md:w-[484px] md:px-[40px] px-5 ">
      <div className="md:border-b-[1px] md:pb-5">
        <div className="flex items-center justify-between py-[12px]">
          <div className="flex items-center gap-2">
            <div className="relative flex rounded-full w-9 h-9">
              <Image fill={true} src={item.img} alt="Photo1" className="w-auto h-auto rounded-full" />
            </div>

            <h1 className="flex items-center font-bold ">
              {item.name}
              <span className="flex items-center font-normal text-gray-600">
                {' '}
                <LuDot className="text-2xl" />
                4h
                {data?.getMyPosts.map((i, p) => (
                  <p key={p}>i</p>
                ))}
              </span>
            </h1>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-8 h-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setOpenDeleteModal(true);
                  console.log('hdh');
                }}
                className="text-red-600"
              >
                Delete
              </DropdownMenuItem>

              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Cancel</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="relative flex w-full h-[585px]  ">
          <Image fill={true} src="/images/img1.avif" alt="Photo1" className="object-cover w-auto h-auto " />
          <div className="relative flex items-center justify-between w-full px-1 ">
            <p className="bg-[#F4F4F5] p-2 rounded-full text-gray-600">
              <BiSolidChevronLeft />
            </p>
            <p className="bg-[#F4F4F5] p-2 rounded-full text-gray-600">
              <BiSolidChevronRight />
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between px-1 py-3 text-xl">
          <div className="flex gap-3">
            <p>
              <FaRegHeart />{' '}
            </p>
            <p>
              <FaRegComment />
            </p>
          </div>
          <p>
            <FaRegBookmark />
          </p>
        </div>
        <p>741,368 likes</p>
        <div>
          <h1 className="text-base font-normal text-gray-600">
            <span className="pr-1 font-bold text-black">defavours</span>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti, et.
          </h1>
        </div>
        <button className="py-1 text-sm text-gray-500">View all 13,384 comments</button>
        <div className="flex justify-between ">
          <input type="text" className="text-sm border-none" placeholder="Add a comment..." />
          <p>
            <CiFaceSmile />
          </p>
        </div>
      </div>
      <DeleteModal setOpenDeleteModal={setOpenDeleteModal} openDeleteModal={openDeleteModal} id={item?._id} />
    </div>
  );
};
