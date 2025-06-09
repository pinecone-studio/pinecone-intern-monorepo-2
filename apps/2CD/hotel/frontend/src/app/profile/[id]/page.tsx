'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useUser } from '@clerk/nextjs';

import Header from '@/components/header/Header';
import FooterRegular from '@/components/footer/footer-regular';

import ProfileSection from '../_components/ProfileSection';
import AccountSection from '../_components/AccountSection';
import AppearanceSection from '../_components/AppearanceSection';
import NotificationSection from '../_components/NotificationSection';
import DisplaySection from '../_components/DisplaySection';

const sections = {
  profile: <ProfileSection />,
  account: <AccountSection />,
  appearance: <AppearanceSection />,
  notifications: <NotificationSection />,
  display: <DisplaySection />,
};

const ProfilePage = () => {
  const [activeSection, setActiveSection] = useState<'profile' | 'account' | 'appearance' | 'notifications' | 'display'>('profile');

  const { user } = useUser();
  const username = user?.username || 'guest';
  const email = user?.emailAddresses?.[0]?.emailAddress || 'No email';

  // const params = useParams();
  // const userId = params?.id;

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8 flex flex-col ">
        {/* User Info */}
        <div className="mb-6">
          <p className="text-xl font-semibold">Hello, {username}</p>
          <p className="text-sm text-gray-500">{email}</p>
        </div>
        <div className="flex flex-raw w-full">
          {/* Navigation Buttons */}
          <div className="flex gap-4 mb-6 flex-col w-[200px]">
            {Object.keys(sections).map((key) => (
              <button
                key={key}
                onClick={() => setActiveSection(key as keyof typeof sections)}
                className={`px-4 py-2 rounded ${activeSection === key ? 'bg-[#F4F4F5] text-black' : 'bg-transparent hover:bg-gray-100 text-gray-700'}`}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
          {/* Active Section Content */}
          <AnimatePresence mode="wait">
            <motion.div key={activeSection} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="flex-1">
              {sections[activeSection]}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <FooterRegular />
    </>
  );
};

export default ProfilePage;
