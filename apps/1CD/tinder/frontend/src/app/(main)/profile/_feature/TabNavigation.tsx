import React from 'react';

interface TabNavigationProps {
  activeTab: 'profile' | 'images';
  onTabClick: (_tab: 'profile' | 'images') => void;
  isMenuOpen: boolean;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabClick, isMenuOpen }) => {
  return (
    <div
      className={`transition-all ease-in-out duration-300 ${isMenuOpen ? 'block' : 'hidden'} sm:block mx-auto`}
    >
      <div className="flex flex-col gap-4">
        {/* Profile Tab */}
        <div
          className={`text-sm text-zinc-950 py-2 px-4 cursor-pointer rounded-md w-[250px] ${
            activeTab === 'profile' ? 'bg-zinc-100' : 'bg-transparent'
          }`}
          data-cy="Tab-Navigation-Profile" // Adding data-cy for Cypress testing
          onClick={() => onTabClick('profile')}
        >
          Profile
        </div>

        {/* Images Tab */}
        <div
          className={`text-sm text-zinc-950 py-2 px-4 cursor-pointer rounded-md ${
            activeTab === 'images' ? 'bg-zinc-100' : 'bg-transparent'
          }`}
          data-cy="Tab-Navigation-Images" // Adding data-cy for Cypress testing
          onClick={() => onTabClick('images')}
        >
          Images
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;
