'use client';

import { useState } from 'react';
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
  const [activeSection, setActiveSection] = useState<keyof typeof sections>('profile');
  const { user } = useUser();
  const username = user?.username || 'guest';
  const email = user?.emailAddresses?.[0]?.emailAddress || 'No email';

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8 flex flex-col">
        <div className="mb-6">
          <p className="text-xl font-semibold">Hello, {username}</p>
          <p className="text-sm text-gray-500">{email}</p>
        </div>

        <div className="flex flex-row w-full">
          <div className="flex gap-4 mb-6 flex-col w-[200px]">
            {(Object.keys(sections) as (keyof typeof sections)[]).map((key) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`px-4 py-2 rounded ${
                  activeSection === key
                    ? 'bg-[#F4F4F5] text-black'
                    : 'bg-transparent hover:bg-gray-100 text-gray-700'
                }`}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
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
