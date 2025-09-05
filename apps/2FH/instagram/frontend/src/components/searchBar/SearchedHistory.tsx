'use client';
import { X } from 'lucide-react';
import Image from 'next/image';

interface User {
  _id: string;
  userName: string;
  fullName: string;
  profileImage?: string | null;
  isVerified?: boolean;
}

interface SearchHistoryProps {
  searchHistory: User[];
  onUserClick: (_user: User) => void;
  onRemoveUser?: (_userId: string) => void;
}

export const SearchHistory = ({ searchHistory, onUserClick, onRemoveUser }: SearchHistoryProps) => {
  if (!searchHistory || searchHistory.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No recent searches</p>
      </div>
    );
  }

  return (
    <div className="space-y-1 flex flex-col-reverse">
      {searchHistory.map((user) => (
        <div 
          key={user._id} 
          className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer"
          onClick={() => onUserClick(user)}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {user.profileImage ? (
                <Image 
                  src={user.profileImage} 
                  alt={user.fullName}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg">👤</span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <p className="font-semibold text-sm">{user.userName}</p>
              </div>
              <p className="text-gray-500 text-xs">{user.fullName}</p>
            </div>
          </div>
          {onRemoveUser && (
            <X 
              data-testid={`remove-icon-${user._id}`}
              className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" 
              onClick={(e) => {
                e.stopPropagation();
                onRemoveUser(user._id);
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};
