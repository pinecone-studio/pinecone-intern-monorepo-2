const TabNavigation = ({
  activeTab,
  onTabClick,
  isMenuOpen,
}: {
  activeTab: 'profile' | 'images';
  onTabClick: (_tab: 'profile' | 'images') => void;
  isMenuOpen: boolean;
}) => {
  return (
    <div className={`transition-all ease-in-out duration-300 ${isMenuOpen ? 'block' : 'hidden'} sm:block mx-auto`}>
      <div className="flex flex-col gap-4">
        <div 
          className={`text-sm text-zinc-950 py-2 px-4 cursor-pointer rounded-md ${
            activeTab === 'profile' ? 'bg-zinc-100' : 'bg-transparent'
          }`}
          data-cy="Tab-Navigation-Profile" // Ensure this matches the test
          onClick={() => onTabClick('profile')}
        >
          Profile
        </div>
        <div
          className={`text-sm text-zinc-950 py-2 px-4 cursor-pointer rounded-md ${
            activeTab === 'images' ? 'bg-zinc-100' : 'bg-transparent'
          }`}
          data-cy="Tab-Navigation-Images" // Ensure this matches the test
          onClick={() => onTabClick('images')}
        >
          Images
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;
