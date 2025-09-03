'use client';

import { useState } from 'react';
import { TinderHeader } from '@/components/profile-settings/TinderHeader';
import { TinderNavigation } from '@/components/profile-settings/TinderNavigation';
import { ProfileSection } from '@/components/profile-settings/ProfileSection';
import { ImagesSection } from '@/components/profile-settings/ImagesSection';
import { Notification } from '@/components/profile-settings/Notification';

export type NavigationItem = 'profile' | 'images';

const ProfilePage = () => {
  const [activeSection, setActiveSection] = useState<NavigationItem>('profile');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const showSuccessNotification = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleSectionChange = (section: NavigationItem) => {
    setActiveSection(section);
  };

  return (
    <div className="min-h-screen bg-white">
      <TinderHeader />
      
      <div className="flex justify-center">
        <div className="w-full max-w-3xl px-4">
          <div className="mt-3 mb-4">
            <h1 className="text-lg font-semibold text-gray-800">Hi, Elon</h1>
            <p className="text-sm text-gray-600">Musk@pinecone.mn</p>
          </div>
          <div className="flex gap-6">
        <TinderNavigation 
          activeSection={activeSection} 
          onSectionChange={handleSectionChange} 
        />
        
        <main className="flex-1 flex justify-center p-6">
              <div className="w-full max-w-2xl">
            {activeSection === 'profile' && (
              <ProfileSection onSuccess={showSuccessNotification} />
            )}
            {activeSection === 'images' && (
              <ImagesSection onSuccess={showSuccessNotification} />
            )}
          </div>
        </main>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-4 left-4 right-4 flex justify-between items-center">
        <div className="flex items-center space-x-1">
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="text-gray-600 text-sm font-medium">tinder</span>
        </div>
        <div className="text-gray-500 text-xs">© Copyright 2024</div>
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

export default ProfilePage; 