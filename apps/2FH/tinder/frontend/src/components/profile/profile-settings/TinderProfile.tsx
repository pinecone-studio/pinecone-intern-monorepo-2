'use client';

import { useState } from 'react';
import { TinderHeader } from './TinderHeader';
import { TinderNavigation } from './TinderNavigation';
import { ProfileSection } from './ProfileSection';
import { ImagesSection } from './ImagesSection';
import { Notification } from './Notification';
import Image from 'next/image';

export type NavigationItem = 'profile' | 'images';

interface ProfileData {
  name: string;
  email: string;
  dateOfBirth: string;
  genderPreferences: string;
  bio: string;
  profession: string;
  schoolWork: string;
  interests: string[];
}

export const TinderProfile = () => {
  const [activeSection, setActiveSection] = useState<NavigationItem>('profile');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  
  // Profile data state
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'Elon',
    email: 'Musk',
    dateOfBirth: '21 Aug 1990',
    genderPreferences: 'Female',
    bio: 'Adventurous spirit with a passion for travel, photography, and discovering new cultures while pursuing a career in graphic design.',
    profession: 'Software Engineer',
    schoolWork: 'Amazon',
    interests: ['Art', 'Music', 'Investment', 'Technology', 'Design', 'Education', 'Health', 'Fashion', 'Travel', 'Food']
  });

  const handleSectionChange = (section: NavigationItem) => {
    setActiveSection(section);
  };

  const showSuccessNotification = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleProfileDataChange = (newData: ProfileData) => {
    setProfileData(newData);
  };

  return (
    <div className="min-h-screen bg-white">
      <TinderHeader />
      
      <div className="max-w-6xl mx-auto px-4">
        {/* Greeting Section - positioned at the top */}
        <div className="mt-3 mb-4">
          <h1 className="text-lg font-semibold text-gray-800">Hi, {profileData.name}</h1>
          <p className="text-sm text-gray-600">{profileData.email}@pinecone.mn</p>
        </div>
        
        {/* Subtle horizontal line divider */}
        <div className="border-b border-gray-200 mb-6"></div>
        
        <div className="flex gap-6">
          {/* Navigation */}
          <TinderNavigation 
            activeSection={activeSection} 
            onSectionChange={handleSectionChange} 
          />
          
          {/* Main Content */}
          <main className="flex-1 flex justify-center p-6">
            <div className="w-full max-w-2xl">
              {activeSection === 'profile' && (
                <ProfileSection 
                  onSuccess={showSuccessNotification}
                  profileData={profileData}
                  onProfileDataChange={handleProfileDataChange}
                />
              )}
              {activeSection === 'images' && (
                <ImagesSection onSuccess={showSuccessNotification} />
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Subtle divider above footer */}
      <div className="border-b border-gray-200 mt-8"></div>

      {/* Footer - Updated to match target design */}
      <footer className="py-8 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-1">
            <Image
              src="/tindalogos.svg"
              alt="tinder logo"
              width={32}
              height={32}
              className="w-24 h-12 object-contain grayscale"
            />
          </div>
          <div className="text-gray-500 text-xs">© Copyright 2024</div>
        </div>
      </footer>

      {showNotification && (
        <Notification 
          message={notificationMessage} 
          onClose={() => setShowNotification(false)} 
        />
      )}
    </div>
  );
};
