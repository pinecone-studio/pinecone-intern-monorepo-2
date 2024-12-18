import React from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { CiSearch } from 'react-icons/ci';
import { LuDot } from 'react-icons/lu';
import { useUser } from '@/components/providers/UserProvider';

const SearchFromAllUsers = () => {
  const { searchTerm, searchHandleChange, data, loading } = useUser();

  return (
    <div className="px-4 py-8 border max-w-[470px]" data-testid="search-users-component">
      <div className="flex items-center">
        <CiSearch />
        <Input
          type="text"
          placeholder="Search"
          className="w-24 bg-transparent border-none input md:w-auto focus-visible:ring-0 focus-visible:ring-offset-0"
          value={searchTerm}
          onChange={searchHandleChange}
        />
      </div>

      {loading ? <div>Loading</div> : null}

      {data?.searchUsers.map((user) => (
        <div className="flex flex-col justify-center gap-4 px-3 py-2" key={user._id}>
          <div className="flex items-center gap-3">
            <div className="relative flex rounded-full w-[44px] h-[44px]">
              <Image fill={true} src="/images/img.avif" alt="Photo1" className="h-full rounded-full w-fit" />
            </div>
            <div className="flex flex-col text-[#09090B]">
              <span className="text-sm font-[550]">{user.userName}</span>
              <div className="flex items-center text-xs">
                <span className="mr-1">{user.fullName}</span>
                <LuDot />
                <span className="text-[#71717A]">follower</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchFromAllUsers;
