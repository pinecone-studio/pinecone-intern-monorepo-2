'use client';
import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { SquarePlus } from 'lucide-react';
import Image from 'next/image';

export const Navbar = () => {
  return (
    <div className="flex flex-col items-start justify-between w-[260px] h-screen border-l-[1px] p- ">
      <div>
        <div className="relative w-[100px] h-[30px]">
          <Image alt="Logo" src="/images/Logo.png" fill={true} className="w-auto h-auto" />
        </div>
        <div>
          <Button variant="ghost" className="hover:bg-white">
            Home
          </Button>
        </div>

        <div>
          <Button variant="ghost" className="">
            Search
          </Button>
        </div>

        <div>
          <Button variant="ghost" className="">
            Notifications
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger data-testid="more-btn" asChild>
            <Button variant="ghost" className="">
              <SquarePlus /> <span>Create</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem>Delete</DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Cancel</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div>
        <Button variant="ghost" className="">
          More
        </Button>
      </div>
    </div>
  );
};
