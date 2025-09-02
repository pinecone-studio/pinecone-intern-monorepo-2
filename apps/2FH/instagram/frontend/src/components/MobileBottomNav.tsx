'use client';
import { Heart, Search, Home, PlusSquare, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useNavigation } from '@/components';
import { StoryCreateDialog } from '@/components/create-story-dialog/StoryCreateDialog';
import { ImageIcon, Plus } from 'lucide-react';

export const MobileBottomNav = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isStoryDialogOpen, setIsStoryDialogOpen] = useState(false);
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

  const isActive = (path: string) => pathname === path;

  const renderNavItem = (href: string, icon: React.ReactNode, label: string, isActivePath: boolean) => (
    <a href={href} className={`flex flex-col items-center justify-center py-1 px-1 min-w-0 flex-1 transition-colors ${isActivePath ? 'text-black' : 'text-gray-500'}`}>
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </a>
  );

  const renderButtonNavItem = (onClick: () => void, icon: React.ReactNode, label: string, isActivePath: boolean) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center py-1 px-1 min-w-0 flex-1 transition-colors ${isActivePath ? 'text-black' : 'text-gray-500'}`}>
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );

  const renderCreateDropdown = () => (
    <div className="relative" ref={createRef}>
      <button onClick={toggleCreate} className="flex flex-col items-center justify-center py-1 px-1 min-w-0 flex-1 transition-colors text-gray-500">
        <PlusSquare size={24} className="text-gray-900" />
        <span className="text-xs mt-1">Create</span>
      </button>

      {isCreateOpen && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {renderNavItem('/', <Home size={24} className={isActive('/') ? 'text-black' : 'text-gray-500'} />, 'Home', isActive('/'))}
          {renderButtonNavItem(toggleSearch, <Search size={24} className={isSearchOpen ? 'text-black' : 'text-gray-500'} />, 'Search', isSearchOpen)}
          {renderCreateDropdown()}
          {renderNavItem('/notifications', <Heart size={24} className={isActive('/notifications') ? 'text-black' : 'text-gray-500'} />, 'Notifications', isActive('/notifications'))}
          {renderNavItem('/userProfile', <User size={24} className={isActive('/userProfile') ? 'text-black' : 'text-gray-500'} />, 'Profile', isActive('/userProfile'))}
        </div>
      </div>

      <StoryCreateDialog isOpen={isStoryDialogOpen} onClose={() => setIsStoryDialogOpen(false)} />
    </>
  );
};
