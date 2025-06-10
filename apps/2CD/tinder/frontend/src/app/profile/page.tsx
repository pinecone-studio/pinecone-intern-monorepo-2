'use client';

import { useState } from "react";
import Header from "./_components/Header";
import ProfileForm from "./_components/ProfileForm/ProfileForm";
import UploadImage from "./_components/UploadImage/UploadImage";

const UpdateProfile = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'images'>('profile');

  return (
    <div className="text-white min-h-screen">
      <Header />

      <div className="mx-[20%] mt-10">
        <div className="pb-7 border-b border-[#444]">
          <p className="text-lg font-semibold">Hi, Shagai</p>
          <p className="text-sm text-gray-400">n.shagai@pinecone.mn</p>
        </div>
      </div>

      <div className="flex mx-[20%] mt-6">
        {/* Sidebar */}
        <div className="w-40 mr-8 flex flex-col">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded text-left ${activeTab === 'profile' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`px-4 py-2 rounded text-left ${activeTab === 'images' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
          >
            Images
          </button>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' ? (
            <ProfileForm/>
          ) : (
            <div className="max-w-[700px]">
              <UploadImage/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
