'use client';
import { useState } from 'react';
import PersonalInfo from './PersonalInfo';

import SecurityAndSettings from './SecurityAndSettings';
import ContactInfo from './ContactInfo';

const UpdateProfileTab = () => {
  const [selectedTab, setSelectedTab] = useState('tab-1');

  const handleTabChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTab(event.target.id);
  };

  return (
    <div className="flex md:w-2/3 md:flex-row flex-col w-full" data-cy="Update-Profile-Input-And-Tabs">
      <div className="p-2">
        <ul className="mt-4  flex flex-col gap-4 ">
          <li>
            <label htmlFor="tab-1" className="block px-2 py-2 w-[12rem] rounded cursor-pointer hover:bg-gray-200" data-cy="Update-Profile-Click-Tab-Personal-Info">
              Personal Information
            </label>
          </li>
          <li>
            <label htmlFor="tab-2" className="block px-2 py-2 w-[12rem] rounded cursor-pointer hover:bg-gray-200" data-cy="Update-Profile-Click-Tab-Contact-Info">
              Contact Info
            </label>
          </li>
          <li>
            <label htmlFor="tab-3" className="block px-2 py-2 w-[12rem] rounded cursor-pointer hover:bg-gray-200" data-cy="Update-Profile-Click-Tab-Security-Settings">
              Security & Settings
            </label>
          </li>
        </ul>
      </div>

      <div className="flex-1 p-4">
        <div className="tabs-container ">
          <input type="radio" id="tab-1" name="tab" className="hidden" checked={selectedTab === 'tab-1'} onChange={handleTabChange} />
          <div className={`tab-content p-4 ${selectedTab === 'tab-1' ? '' : 'hidden'}`} data-cy="Update-Profile-Personal-Info-Tab">
            <PersonalInfo />
          </div>

          <input type="radio" id="tab-2" name="tab" className="hidden" checked={selectedTab === 'tab-2'} onChange={handleTabChange} />
          <div className={`tab-content p-4 ${selectedTab === 'tab-2' ? '' : 'hidden'}`} data-cy="Update-Profile-Contact-Info-Tab">
            <ContactInfo />
          </div>

          <input type="radio" id="tab-3" name="tab" className="hidden" checked={selectedTab === 'tab-3'} onChange={handleTabChange} />
          <div className={`tab-content p-4 ${selectedTab === 'tab-3' ? '' : 'hidden'}`} data-cy="Update-Profile-Security-Settings-Tab">
            <SecurityAndSettings />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfileTab;
