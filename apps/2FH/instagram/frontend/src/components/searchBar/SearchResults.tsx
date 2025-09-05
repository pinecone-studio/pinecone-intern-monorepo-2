'use client';
import Image from 'next/image';

interface User {
  _id: string;
  fullName: string;
  userName: string;
  profileImage?: string | null;
  isVerified?: boolean;
}

interface SearchResultsProps {
  results: User[];
  loading: boolean;
  onUserClick: (_user: User) => void;
}

export const SearchResults = ({ 
  results, 
  loading, 
  onUserClick 
}: SearchResultsProps) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Searching...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No users found</p>
        <p className="text-gray-400 text-sm mt-2">Try searching for something else</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-base font-semibold mb-4">Search Results</h3>
      {results.map((user) => (
        <div 
          key={user._id}
          onClick={() => onUserClick(user)}
          className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
        >
          <Image
            src={user.profileImage || '/default-avatar.png'}
            alt={user.fullName}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div className="flex-1">
            <div className="flex items-center">
              <span className="font-medium text-sm">{user.userName}</span>
            </div>
            <span className="text-gray-500 text-sm">{user.fullName}</span>
          </div>
        </div>
      ))}
    </div>
  );
};