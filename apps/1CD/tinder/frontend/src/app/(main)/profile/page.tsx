// Profile.tsx
'use client';

import { useState } from 'react';
import ProfileHeader from './_feature/ProfileHeader';
import TabNavigation from './_feature/TabNavigation';

import GenderSelect from './_feature/GenderSelect';
import ImageUpload from '../register/all-set/page';
import InterestsSelect from './_feature/InterstSelect';

const Profile = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'images'>('profile');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLucideMenuVisible, setIsLucideMenuVisible] = useState(false);
  const [day, setDay] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 2 && /^[0-9]*$/.test(value)) {
      setDay(value);
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 2 && /^[0-9]*$/.test(value)) {
      setMonth(value);
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 4 && /^[0-9]*$/.test(value)) {
      setYear(value);
    }
  };

  const handleTabClick = (tab: 'profile' | 'images') => {
    setActiveTab(tab);
    setIsMenuOpen(false);
    setIsLucideMenuVisible(true);
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsLucideMenuVisible(!isLucideMenuVisible);
  };

  const interests = ['Art', 'Music', 'Investment', 'Technology', 'Design', 'Education', 'Health', 'Fashion', 'Travel', 'Food'];

  return (
    <div className={`min-h-screen flex flex-col ${activeTab === 'images' ? 'pt-0' : 'py-8'} px-4`}>
      <div className="max-w-7xl w-full flex flex-col justify-between h-full mx-auto">
        <ProfileHeader onMenuToggle={handleMenuToggle} />
        <div className="lg:flex gap-12 flex-grow relative">
          <TabNavigation activeTab={activeTab} onTabClick={handleTabClick} isMenuOpen={isMenuOpen} />
          <div className="flex flex-col gap-8 w-full lg:max-w-3xl mx-auto ml-0 lg:ml-64 flex-grow" data-cy="Tab-Navigation">
            {activeTab === 'profile' ? (
              <div className="flex-grow mb-16">
                {/* Profile Section */}
                <p className="text-lg font-medium text-zinc-950">Personal Information</p>
                <p className="text-sm font-normal text-zinc-500">This is how others will see you on the site.</p>
                <hr className="bg-zinc-200 mt-6" />
                <div className="space-y-6">
                  {/* Name and Email Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-zinc-950">Name</p>
                      <input placeholder="Elon" className="w-full rounded-md placeholder-zinc-950 font-normal text-sm border-zinc-400 border py-2 px-3" />
                    </div>
                    <div>
                      <p className="text-sm text-zinc-950">Email</p>
                      <input placeholder="Musk" className="w-full rounded-md placeholder-zinc-950 font-normal text-sm border-zinc-400 border py-2 px-3" />
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div className="flex flex-col gap-2 text-sm" data-cy="Input-date">
    <p className="text-sm text-zinc-950">Date of birth</p>

    <div className="flex gap-2" data-cy="input-field">
      <input
        type="number"
        min="1"
        max="31"
        value={day}
        onChange={handleDayChange}
        placeholder="DD"
        className="px-4 py-2 border rounded-lg w-20"
        maxLength={2}
        autoFocus
        data-cy="day-input"
      />

      <input
        type="number"
        min="1"
        max="12"
        value={month}
        onChange={handleMonthChange}
        placeholder="MM"
        className="px-4 py-2 border rounded-lg w-20"
        maxLength={2}
        data-cy="month-input"
      />

      <input
        type="number"
        min="1900"
        value={year}
        onChange={handleYearChange}
        placeholder="YYYY"
        className="px-4 py-2 border rounded-lg w-32"
        maxLength={4}
        data-cy="year-input"
      />
    </div>

    <p className="text-xs text-zinc-500">Your date of birth is used to calculate your age.</p>
  </div>



                  {/* Gender Select */}
                  <GenderSelect />

                  {/* Interests */}
                  <InterestsSelect interests={interests} />

                  {/* Update Profile Button */}
                  <div className="w-full sm:w-32 h-9 bg-rose-600 hover:bg-zinc-800 py-2 px-3 rounded-md text-white text-center cursor-pointer" data-cy="Update-Button">
                    Update profile
                  </div>
                </div>
              </div>
            ) : (
              <ImageUpload data-cy="Image-page" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
