<<<<<<< HEAD
'use client';
/* eslint-disable max-lines */
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const Profile = () => {
  const [day, setDay] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const currentYear = new Date().getFullYear();

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,2}$/.test(value) && (parseInt(value) <= 31 || value === '')) {
=======
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
>>>>>>> 5fe6ea2d15b5e13183a73831a7a1ce3e982ac2c6
      setDay(value);
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
<<<<<<< HEAD
    if (/^\d{0,2}$/.test(value) && (parseInt(value) <= 12 || value === '')) {
=======
    if (value.length <= 2 && /^[0-9]*$/.test(value)) {
>>>>>>> 5fe6ea2d15b5e13183a73831a7a1ce3e982ac2c6
      setMonth(value);
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
<<<<<<< HEAD
    if (/^\d{0,4}$/.test(value) && (parseInt(value) <= currentYear || value === '')) {
=======
    if (value.length <= 4 && /^[0-9]*$/.test(value)) {
>>>>>>> 5fe6ea2d15b5e13183a73831a7a1ce3e982ac2c6
      setYear(value);
    }
  };

<<<<<<< HEAD
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col p-10 gap-6">
        <div className="w-full">
          <h2 className="text-2xl font-semibold mb-2">Hi, Shaqai</h2>
          <p className="text-gray-500 mb-6">n.shaqai@pinecone.mn</p>
          <div className="border-t-[1px]"></div>
        </div>

        <div className="flex gap-12 w-full">
          <div className="flex flex-col">
            <ToggleGroup defaultValue="Profile" type="single" className="flex flex-col gap-1">
              <ToggleGroupItem value="Profile" aria-label="Toggle bold">
                <div className="w-[250px] h-[36px] flex items-center">Profile</div>
              </ToggleGroupItem>
              <ToggleGroupItem value="Image" aria-label="Toggle italic">
                <div className="w-[250px] h-[36px] flex items-center">Image</div>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <form className="space-y-6">
            {/* Personal Information */}
            <div>
              <p className="text-lg">Personal Information</p>
              <p className="text-sm text-[#71717A]">This is how others will see you on the site.</p>
            </div>
            <div className="border-t-[1px]"></div>
            {/* Name */}
            <div className="flex gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 w-[324px]">Name</label>
                <input data-cy="profile-name-input" type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 w-[324px]">Email</label>
                <input data-cy="profile-email-input" type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
            </div>
            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <div className="flex gap-2 mt-1" data-cy="input-field">
                <input data-cy="day-input" type="number" min="1" max="31" value={day} onChange={handleDayChange} placeholder="DD" className={`px-4 py-2 border rounded-lg w-20 `} maxLength={2} />
                <input
                  data-cy="month-input"
                  type="number"
                  min="1"
                  max="12"
                  value={month}
                  onChange={handleMonthChange}
                  placeholder="MM"
                  className={`px-4 py-2 border rounded-lg w-20 '}`}
                  maxLength={2}
                />
                <input data-cy="year-input" type="number" min="1900" value={year} onChange={handleYearChange} placeholder="YYYY" className={`px-4 py-2 border rounded-lg w-32 `} maxLength={4} />
              </div>
              <p className="text-sm text-[#71717A]">Your date of birth is used to calculate your age.</p>
            </div>
            {/* Gender Preferences */}
            <div data-cy="select-button">
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender Preferences</label>

              <Select>
                <SelectTrigger className="w-[672px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup data-cy="male-select-content">
                    <SelectItem data-cy="male-select-content-male" value="Male">
                      Male
                    </SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Both">Both</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea rows={3} data-cy="profile-bio-input" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Interests</label>
              <ToggleGroup variant="outline" type="multiple" className="border rounded-xl px-3 py-4 mt-1">
                <ToggleGroupItem value="Art" aria-label="Toggle bold" className="h-6" data-cy="toggle-item">
                  Art
                </ToggleGroupItem>
                <ToggleGroupItem value="Music" aria-label="Toggle italic" className="h-6">
                  Music
                </ToggleGroupItem>
                <ToggleGroupItem value="Investment" aria-label="Toggle underline" className="h-6">
                  Investment
                </ToggleGroupItem>
                <ToggleGroupItem value="Technology" aria-label="Toggle bold" className="h-6">
                  Technology
                </ToggleGroupItem>
                <ToggleGroupItem value="Design" aria-label="Toggle italic" className="h-6">
                  Design
                </ToggleGroupItem>
                <ToggleGroupItem value="Education" aria-label="Toggle underline" className="h-6">
                  Education
                </ToggleGroupItem>
                <ToggleGroupItem value="Health" aria-label="Toggle bold" className="h-6">
                  Health
                </ToggleGroupItem>
                <ToggleGroupItem value="Fashion" aria-label="Toggle italic" className="h-6">
                  Fashion
                </ToggleGroupItem>
                <ToggleGroupItem value="Travel" aria-label="Toggle underline" className="h-6">
                  Travel
                </ToggleGroupItem>
                <ToggleGroupItem value="Food" aria-label="Toggle underline" className="h-6">
                  Food
                </ToggleGroupItem>
              </ToggleGroup>
              <p className="text-xs text-gray-500 mt-1">You can select up to a maximum of 10 interests.</p>
            </div>
            {/* Profession */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Profession</label>
              <input
                data-cy="profile-profession-input"
                type="text"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            {/* School/Work */}
            <div>
              <label className="block text-sm font-medium text-gray-700">School/Work</label>
              <input data-cy="profile-school-input" type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            {/* Update Button */}
            <Button data-cy="next-button" className="bg-[#E11D48E5]">
              <Link href={'/recs'}>Next</Link>
            </Button>
          </form>
=======
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
>>>>>>> 5fe6ea2d15b5e13183a73831a7a1ce3e982ac2c6
        </div>
      </div>
    </div>
  );
};

export default Profile;
