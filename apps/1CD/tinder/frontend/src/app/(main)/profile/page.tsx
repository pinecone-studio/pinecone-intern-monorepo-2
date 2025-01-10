'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import NextButton from './_feature/NextButton';
import ProfessionalInfo from './_feature/ProfessionalInfo';
import ImageUpload from '../register/photos/page';
import InterestsSelect from './_feature/InterstSelect';
import GenderSelect from './_feature/GenderSelect';
import PersonalInfo from './_feature/PersonalInfo';
import TabNavigation from './_feature/TabNavigation';
import ProfileHeader from './_feature/ProfileHeader';
import { useGetMeQuery } from '@/generated';

const Profile = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'images'>('profile');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [isLucideMenuVisible, setIsLucideMenuVisible] = useState(false);

  const { data } = useGetMeQuery();

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,2}$/.test(value)) {
      setDay(value);
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,2}$/.test(value)) {
      setMonth(value);
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,4}$/.test(value)) {
      setYear(value);
    }
  };

  const handleTabClick = (tab: 'profile' | 'images') => {
    setActiveTab(tab);
  };
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsLucideMenuVisible(!isLucideMenuVisible);
  };

  const interests = ['Art', 'Music', 'Investment', 'Technology', 'Design', 'Education', 'Health', 'Fashion', 'Travel', 'Food'];
  return (
    <div className={`min-h-screen flex flex-col ${activeTab === 'images' ? 'pt-0' : 'py-8'} px-4`}>
      <div className="flex flex-col justify-between w-full h-full mx-auto max-w-7xl">
        <ProfileHeader onMenuToggle={handleMenuToggle} data={data?.getMe} />
        <div className="relative flex-grow gap-12 lg:flex">
          <TabNavigation activeTab={activeTab} onTabClick={handleTabClick} isMenuOpen={isMenuOpen} />
          <div className="flex flex-col flex-grow w-full gap-8 mx-auto lg:max-w-3xl">
            {activeTab === 'profile' ? (
              <div className="flex-grow mb-16">
                <p className="text-lg font-medium text-zinc-950">Personal Information</p>
                <p className="text-sm font-normal text-zinc-500">This is how others will see you on the site.</p>
                <hr className="mt-6 bg-zinc-200" />

                <PersonalInfo data={data?.getMe} day={day} month={month} year={year} handleDayChange={handleDayChange} handleMonthChange={handleMonthChange} handleYearChange={handleYearChange} />

                <GenderSelect />
                <InterestsSelect interests={interests} />
                <ProfessionalInfo />

                <NextButton onClick={() => handleTabClick('images')} />
              </div>
            ) : (
              <ImageUpload activeTab={activeTab} onTabClick={handleTabClick} isMenuOpen={isMenuOpen} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
