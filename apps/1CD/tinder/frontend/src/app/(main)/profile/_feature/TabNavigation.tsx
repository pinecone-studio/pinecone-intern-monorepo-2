const TabNavigation = ({
    activeTab,
    onTabClick,
    isMenuOpen
  }: {
    activeTab: 'profile' | 'images';
    onTabClick: (_tab: 'profile' | 'images') => void;
    isMenuOpen: boolean;
  }) => {
    return (
      <div data-cy="Tab-Navigation" className={`w-56 fixed top-0 right-0 bg-white h-full z-10 lg:static lg:w-56 transition-all ease-in-out duration-300 ${isMenuOpen ? 'right-0' : '-right-64'}`}>
        {/* Profile and Images buttons (Hidden on small screens, visible on larger screens) */}
        <div className={`lg:flex ${isMenuOpen ? 'flex-col' : 'hidden'} sm:flex-col gap-4 mb-4`}>
          <div data-cy="Tab-Navigation-Profile"
            className={`rounded-md text-sm text-zinc-950 py-2 px-4 cursor-pointer ${activeTab === 'profile' ? 'bg-zinc-100' : 'bg-white'}`}
            onClick={() => onTabClick('profile')}
          >
            Profile
          </div>
          <div
            className={`rounded-md text-sm text-zinc-950 py-2 px-4 cursor-pointer ${activeTab === 'images' ? 'bg-zinc-100' : 'bg-white'}`}
            onClick={() => onTabClick('images')}
          >
            Images
          </div>
        </div>
      </div>
    );
  };
  
  export default TabNavigation;
  