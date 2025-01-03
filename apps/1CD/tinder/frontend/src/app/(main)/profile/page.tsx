'use client';

import { useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa'; // Calendar icon
import ProfileHeader from './_feature/ProfileHeader'; // Correct import path
import TabNavigation from './_feature/TabNavigation'; // Correct import path

const Profile = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'images'>('profile');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const interests = [
    'Art', 'Music', 'Investment', 'Technology', 'Design',
    'Education', 'Health', 'Fashion', 'Travel', 'Food'
  ];

  const handleTabClick = (tab: 'profile' | 'images') => {
    setActiveTab(tab);
    setIsMenuOpen(false); // Close the menu on mobile when tab is selected
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle the sidebar menu visibility
  };

  return (
    <div className="flex justify-center py-8 px-4">
      <div className="max-w-7xl w-full">
        {/* Profile Header */}
        <ProfileHeader onMenuToggle={handleMenuToggle} />

        <div className="lg:flex gap-12">
          {/* Sidebar with the active tabs */}
          <TabNavigation 
            activeTab={activeTab} 
            onTabClick={handleTabClick} 
            isMenuOpen={isMenuOpen} 
          />

          {/* Content Area */}
          <div className="flex flex-col gap-8 w-full max-w-3xl ml-0 lg:ml-64">
            {activeTab === 'profile' ? (
              <div>
                <p className="text-lg font-medium text-zinc-950">Personal Information</p>
                <p className="text-sm font-normal text-zinc-500">This is how others will see you on the site.</p>
                <hr className="bg-zinc-200 mt-6" />

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-zinc-950">Name</p>
                      <input
                        placeholder="Elon"
                        className="w-full rounded-md placeholder-zinc-950 font-normal text-sm border-zinc-400 border py-2 px-3"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-zinc-950">Email</p>
                      <input
                        placeholder="Musk"
                        className="w-full rounded-md placeholder-zinc-950 font-normal text-sm border-zinc-400 border py-2 px-3"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-zinc-950">Date of birth</p>
                    <div className="relative">
                      <input
                        placeholder="21 Aug 1990"
                        className="w-[280px] rounded-md placeholder-zinc-950 font-normal text-sm border-zinc-400 border py-2 px-3 pr-10" // pr-10 for padding to the right
                      />
                     <FaCalendarAlt
  className="absolute right-[500px] top-1/2 transform -translate-y-1/2 text-zinc-500 cursor-pointer"
  onClick={() => {
    console.log("Календарь дээр дарсан");
    // Эсвэл дата сонгох логикийг энд хийх
  }}
/>

                    </div>
                    <p className="text-xs text-zinc-500">Your date of birth is used to calculate your age.</p>
                  </div>

                  {/* Gender Input (Without Dropdown) */}
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-zinc-950">Gender</p>
                    <input
                      placeholder="Enter gender (e.g., Male, Female, Custom)"
                      className="w-full rounded-md placeholder-zinc-950 font-normal text-sm border-zinc-400 border py-2 px-3"
                    />
                  </div>

                  <div>
                    <p className="text-sm text-zinc-950">Bio</p>
                    <textarea
                      placeholder="Adventurous spirit with a passion for travel, photography, and discovering new cultures while pursuing a career in graphic design."
                      className="w-full h-20 rounded-md placeholder-zinc-950 font-normal text-sm border-zinc-400 border py-2 px-3"
                    ></textarea>
                  </div>

                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-zinc-950">Interest</p>
                    <div className="border border-zinc-400 py-2 px-3 grid grid-cols-9 gap-1 rounded-md">
                      {interests.map((interest, index) => (
                        <div
                          key={index}
                          className="text-xs font-semibold text-slate-700 bg-zinc-100 text-center px-3 py-1 rounded-full"
                        >
                          {interest}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-zinc-500">You can select up to a maximum of 10 interests.</p>
                  </div>

                  <div>
                    <p className="text-sm text-zinc-950">Profession</p>
                    <input
                      placeholder="Software Engineer"
                      className="w-full rounded-md placeholder-zinc-950 font-normal text-sm border-zinc-400 border py-2 px-3"
                    />
                  </div>

                  <div>
                    <p className="text-sm text-zinc-950">School/Work</p>
                    <input
                      placeholder="Amazon"
                      className="w-full rounded-md placeholder-zinc-950 font-normal text-sm border-zinc-400 border py-2 px-3"
                    />
                  </div>

                  <div className="w-32 h-9 bg-rose-600 hover:bg-zinc-800 py-2 px-3 rounded-md text-white text-center cursor-pointer">
                    Update profile
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-red-200 flex justify-center items-center text-xl text-zinc-950">
                <p>No images available!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
