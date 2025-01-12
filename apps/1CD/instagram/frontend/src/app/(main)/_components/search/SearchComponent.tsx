/* eslint-disable complexity */
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { CiSearch } from 'react-icons/ci';
import { useUser } from '@/components/providers/UserProvider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SearchUserStatus } from './SearchUserStatus';

type User = {
  _id: string;
  userName: string;
  fullName: string;
  profileImg?: string | null;
};

const SearchFromAllUsers = ({ setShowSearchComponent }: { setShowSearchComponent: (_value: boolean) => void }) => {
  const { searchTerm, setSearchTerm, searchHandleChange, data, loading } = useUser();
  const [recentSearches, setRecentSearches] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    const savedSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(savedSearches);
  }, []);

  const saveUserToRecentSearches = (user: User) => {
    const savedSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    if (savedSearches.find((savedUser: User) => savedUser._id === user._id)) return;

    const updatedSearches = [user, ...savedSearches].slice(0, 5);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  const clearSearchItems = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleProfileClick = (user: User) => {
    saveUserToRecentSearches(user);
    setShowSearchComponent(false);
    setSearchTerm('');
    router.push(`/home/viewprofile/${user._id}`);
  };

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

      {!searchTerm && recentSearches.length > 0 && (
        <div className="my-4">
          <div className="flex justify-between">
            <h2 className="text-base font-semibold text-gray-600">Recent</h2>
            <button className="text-sm font-medium text-[#2563EB] pr-1" onClick={clearSearchItems}>
              Clear all
            </button>
          </div>
          <ul className="mt-2">
            {recentSearches.map((user) => (
              <li key={user._id} className="py-1 text-sm text-blue-600 cursor-pointer">
                <div onClick={() => handleProfileClick(user)} className="flex items-center gap-3">
                  <div className="relative flex rounded-full w-[44px] h-[44px]">
                    <Image fill={true} src={user.profileImg || '/images/profileImg.webp'} alt="User Profile" sizes="h-auto w-auto" className="h-full rounded-full w-fit" />
                  </div>
                  <div className="flex flex-col text-[#09090B]">
                    <span className="text-sm font-[550]">{user.userName}</span>
                    <div className="flex items-center text-xs">
                      <span className="mr-1">{user.fullName}</span>
                      <SearchUserStatus userId={user._id} />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {loading ? <div>Loading...</div> : null}

      {searchTerm && data?.searchUsers && data.searchUsers.length > 0 && (
        <div className="my-4">
          <h2 className="text-base font-semibold text-gray-600">Search Results</h2>
          <ScrollArea className="h-[calc(100vh-200px)]">
            {data?.searchUsers.map((user: User) => (
              <div key={user._id} className="flex flex-col justify-center gap-4 py-2 cursor-pointer">
                <div onClick={() => handleProfileClick(user)} className="flex items-center gap-3">
                  <div className="relative flex rounded-full w-[44px] h-[44px]">
                    <Image fill={true} src={user.profileImg || '/images/img.avif'} alt="User Profile" sizes="h-auto w-auto" className="h-full rounded-full w-fit" />
                  </div>
                  <div className="flex flex-col text-[#09090B]">
                    <span className="text-sm font-[550]">{user.userName}</span>
                    <div className="flex items-center text-xs">
                      <span className="mr-1">{user.fullName}</span>
                      <SearchUserStatus userId={user._id} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default SearchFromAllUsers;
