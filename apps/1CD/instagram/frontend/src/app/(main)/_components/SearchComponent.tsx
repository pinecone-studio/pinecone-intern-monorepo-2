import React, { useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { CiSearch } from 'react-icons/ci';
import { LuDot } from 'react-icons/lu';
import { useLazyQuery } from '@apollo/client';
import { SearchUsersDocument, SearchUsersQuery, SearchUsersQueryVariables } from '@/generated';

const SearchFromAllUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchUsers, { data, loading, refetch }] = useLazyQuery<SearchUsersQuery, SearchUsersQueryVariables>(SearchUsersDocument);

  const refresh = async () => {
    await refetch();
  };

  const searchHandleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (searchTerm.trim()) {
      searchUsers({ variables: { searchTerm } });
    }
    await refresh;
  };

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

      {loading ?? 'Loading'}

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
