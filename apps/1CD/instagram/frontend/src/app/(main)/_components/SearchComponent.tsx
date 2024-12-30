import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { CiSearch } from 'react-icons/ci';
import { useUser } from '@/components/providers/UserProvider';
import { Dot } from 'lucide-react';

const SearchFromAllUsers = () => {
  const { searchTerm, searchHandleChange, data, loading } = useUser();

  return (
    <div className="px-4 py-8 border-y border-r w-[350px] h-screen" data-testid="search-users-component">
      <h1 className="text-[#262626] text-2xl mb-5 tracking-wide">Search</h1>
      <div className="flex items-center border-b">
        <CiSearch />
        <Input
          type="text"
          placeholder="Search"
          className="w-24 bg-transparent border-none input md:w-auto focus-visible:ring-0 focus-visible:ring-offset-0"
          value={searchTerm}
          onChange={searchHandleChange}
        />
      </div>

      {loading ? <div>Loading...</div> : null}

      {data?.searchUsers.map((user) => (
        <Link href={`/home/viewprofile/${user._id}`} key={user._id} className="flex flex-col justify-center gap-4 px-3 py-2">
          <div className="flex items-center gap-3">
            <div className="relative flex rounded-full w-[44px] h-[44px]">
              <Image fill={true} src="/images/img.avif" alt="User Profile" className="h-full rounded-full w-fit" />
            </div>
            <div className="flex flex-col text-[#09090B]">
              <span className="text-sm font-[550]">{user.userName}</span>
              <div className="flex items-center text-xs">
                <span className="mr-1">{user.fullName}</span>
                <Dot className="w-3" />

                <span className="text-[#71717A]">Follower</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SearchFromAllUsers;
