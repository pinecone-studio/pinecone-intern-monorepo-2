'use client';
import { BoardSvg } from '@/components/assets/BoardSvg';
import { SaveSvg } from '@/components/assets/SaveSvg';
import { SettingsSvg } from '@/components/assets/SettingsSvg';
import { formatNumber } from '@/components/userProfile/format-number';
import { demoImage } from '@/components/userProfile/mock-images';
import { Posts } from '@/components/userProfile/Post';
import Image from 'next/image';

// Mock data
const mockUserData = {
  username: 'travel.explorer',
  displayName: 'Alex Chen',
  postsCount: 284,
  followersCount: 15600,
  followingCount: 432,
  bio: '📸 Travel Photographer',
  category: 'Content Creator',
  description: 'Capturing moments from around the world 🌍 Currently exploring Asia',
  website: 'alexchen-photography.com',
  isVerified: true,
};

const UserProfile = () => {
  return (
    <div className="min-h-full w-screen  bg-white text-neutral-900 flex justify-center">
      <div className="w-full max-w-[935px] px-4 sm:px-6 pb-16">
        <div className="mt-6 rounded-2xl p-6 sm:p-8">
          <div className="flex gap-6 sm:gap-8">
            {/* Profile Picture */}
            <div className="shrink-0">
              <div className="w-24 h-24 sm:w-40 sm:h-40 rounded-full p-[3px] bg-gradient-to-tr from-fuchsia-500 to-yellow-400">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <Image src={demoImage} width={100} height={100} alt={`${mockUserData.username} profile picture`} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              {/* Username and buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-semibold">{mockUserData.username}</h1>
                  {mockUserData.isVerified && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <button className="px-3 py-1.5 text-sm rounded-xl bg-neutral-100 hover:bg-neutral-200 transition-colors">Edit Profile</button>
                <button className="px-3 py-1.5 text-sm rounded-xl bg-neutral-100 hover:bg-neutral-200 transition-colors">Ad tools</button>
                <button aria-label="Settings" className="p-2 rounded-xl hover:bg-neutral-200 transition-colors">
                  <SettingsSvg />
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
                <div>
                  <strong>{formatNumber(mockUserData.postsCount)}</strong> posts
                </div>
                <div>
                  <strong>{formatNumber(mockUserData.followersCount)}</strong> followers
                </div>
                <div>
                  <strong>{formatNumber(mockUserData.followingCount)}</strong> following
                </div>
              </div>
              <div className="mt-4 space-y-1 text-sm leading-6">
                <div className="font-semibold">{mockUserData.displayName}</div>
                <div className="text-neutral-700">{mockUserData.category}</div>
                <div>{mockUserData.bio}</div>
                <div>{mockUserData.description}</div>
                <a href={`https://${mockUserData.website}`} className="text-sky-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  {mockUserData.website}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-b flex items-center justify-center gap-8 text-xs tracking-wider text-neutral-500">
          <button className="-mb-px pb-3 border-b border-neutral-900 text-neutral-900 font-semibold flex items-center gap-2">
            <BoardSvg />
            POSTS
          </button>
          <button className="pb-3 hover:text-neutral-800 transition-colors flex gap-2 items-center">
            <SaveSvg />
            SAVED
          </button>
        </div>
        <Posts />
        <div className="mt-8 flex justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-neutral-300 border-t-neutral-800 animate-spin" />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
