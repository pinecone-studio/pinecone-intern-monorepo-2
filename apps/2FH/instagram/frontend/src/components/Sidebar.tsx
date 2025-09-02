'use client';
import { Heart, Search, Home, PlusSquare, User, Menu, Image as ImageIcon, Plus, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useNavigation } from '@/components';
import { StoryCreateDialog } from '@/components/create-story-dialog/StoryCreateDialog';
import Image from 'next/image';

// Mock search data
const recentSearches = [
  { id: 1, username: 'rosso_blanc', subtitle: 'Rosetta Rosalind • Followed by elijah...', avatar: '👤' },
  { id: 2, username: 'Rosval_kitchen', subtitle: 'Rosval Kitchen and Winery', avatar: '🍷' },
];

const SearchSidebar = ({ searchQuery, setSearchQuery, clearSearch, clearAllRecent, toggleSearch }: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  clearAllRecent: () => void;
  toggleSearch: () => void;
}) => {
  const handleSearchChange = (_e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(_e.target.value);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Search</h2>
          <button onClick={toggleSearch} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-10 py-2 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          {searchQuery && (
            <button aria-label="Clear search" type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2" onClick={clearSearch}>
              <X className="text-gray-400 w-4 h-4 cursor-pointer" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        {!searchQuery ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">Recent</h3>
              <button onClick={clearAllRecent} className="text-blue-500 text-sm hover:text-blue-700">
                Clear all
              </button>
            </div>

            <div className="space-y-3">
              {recentSearches.map((search) => (
                <div key={search.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-lg">{search.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{search.username}</p>
                    <p className="text-gray-500 text-xs">{search.subtitle}</p>
                  </div>
                  <X className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No results found for &quot;{searchQuery}&quot;</p>
            <p className="text-gray-400 text-sm mt-2">Try searching for something else</p>
          </div>
        )}
      </div>
    </div>
  );
};

const NormalSidebar = ({ isActive, renderNavItem, renderButtonNavItem, renderCreateDropdown, toggleSearch }: {
  isActive: (_path: string) => boolean;
  renderNavItem: (_href: string, _icon: React.ReactNode, _label: string, _isActivePath: boolean) => React.ReactNode;
  renderButtonNavItem: (_onClick: () => void, _icon: React.ReactNode, _label: string, _isActivePath: boolean) => React.ReactNode;
  renderCreateDropdown: () => React.ReactNode;
  toggleSearch: () => void;
}) => {
  return (
    <>
      <div className="p-6">
        <Image src="/Vector.png" alt="Instagram logo" width={100} height={100} />
      </div>

      <nav className="px-3">
        <div className="space-y-2">
          {renderNavItem('/', <Home size={24} className="text-gray-900" />, 'Home', isActive('/'))}
          {renderButtonNavItem(toggleSearch, <Search size={24} className="text-gray-900" />, 'Search', false)}
          {renderNavItem('/notifications', <Heart size={24} className="text-gray-900" />, 'Notifications', isActive('/notifications'))}
          {renderCreateDropdown()}
          {renderNavItem('/userProfile', <User size={24} className="text-gray-900" />, 'Profile', isActive('/userProfile'))}
        </div>
      </nav>

      <div className="absolute bottom-6 px-6 w-full">
        <a href="/more" className="flex items-center space-x-4 px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors">
          <Menu size={24} className="text-gray-900" />
          <span>More</span>
        </a>
      </div>
    </>
  );
};

export const Sidebar = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isStoryDialogOpen, setIsStoryDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const createRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { isSearchOpen, setIsSearchOpen } = useNavigation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (createRef.current && !createRef.current.contains(event.target as Node)) {
        setIsCreateOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleCreate = () => setIsCreateOpen(!isCreateOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const handleStoryClick = () => {
    setIsCreateOpen(false);
    setIsStoryDialogOpen(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const clearAllRecent = () => {
    console.log('Clear all recent searches');
  };

  const isActive = (path: string) => pathname === path;

  const renderNavItem = (href: string, icon: React.ReactNode, label: string, isActivePath: boolean) => (
    <a
      href={href}
      className={`flex items-center px-3 py-3 rounded-lg transition-colors ${isActivePath ? 'bg-gray-100 font-bold' : 'hover:bg-gray-100 font-medium'} ${
        isSearchOpen ? 'justify-center' : 'space-x-4'
      }`}
    >
      {icon}
      {!isSearchOpen && <span>{label}</span>}
    </a>
  );

  const renderButtonNavItem = (onClick: () => void, icon: React.ReactNode, label: string, isActivePath: boolean) => (
    <button
      onClick={onClick}
      className={`flex items-center px-3 py-3 rounded-lg transition-colors w-full text-left ${isActivePath ? 'bg-gray-100 font-bold' : 'hover:bg-gray-100'} ${
        isSearchOpen ? 'justify-center' : 'space-x-4'
      }`}
    >
      {icon}
      {!isSearchOpen && <span>{label}</span>}
    </button>
  );

  const renderCreateDropdown = () => (
    <div className="relative" ref={createRef}>
      <button
        onClick={toggleCreate}
        className={`flex items-center px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-900 w-full text-left ${isSearchOpen ? 'justify-center' : 'space-x-4'}`}
      >
        <PlusSquare size={24} className="text-gray-900" />
        {!isSearchOpen && <span>Create</span>}
      </button>

      {isCreateOpen && !isSearchOpen && (
        <div className="absolute left-full top-0 ml-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
          <button
            data-testid="Create-Open-To-False"
            onClick={() => setIsCreateOpen(false)}
            className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-900 w-full text-left"
          >
            <ImageIcon size={20} className="text-gray-700" />
            <span>Post</span>
          </button>
          <button onClick={handleStoryClick} className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-900 w-full text-left">
            <Plus size={20} className="text-gray-700" />
            <span>Story</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className={`hidden md:block border-r border-gray-200 fixed h-full bg-white z-10 transition-all duration-300 ${isSearchOpen ? 'w-80' : 'w-64'}`}>
        {!isSearchOpen ? (
          <NormalSidebar
            isActive={isActive}
            renderNavItem={renderNavItem}
            renderButtonNavItem={renderButtonNavItem}
            renderCreateDropdown={renderCreateDropdown}
            toggleSearch={toggleSearch}
          />
        ) : (
          <SearchSidebar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            clearSearch={clearSearch}
            clearAllRecent={clearAllRecent}
            toggleSearch={toggleSearch}
          />
        )}
      </div>
      <StoryCreateDialog
        isOpen={isStoryDialogOpen}
        onClose={() => setIsStoryDialogOpen(false)}
      />
    </>
  );
};
