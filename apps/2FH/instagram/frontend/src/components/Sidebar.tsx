'use client';
import { Heart, Search, Home, PlusSquare, User, Menu, Image as ImageIcon, Plus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useNavigation } from '@/components';
import Image from 'next/image';

export const Sidebar = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
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
          <button onClick={() => setIsCreateOpen(false)} className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-900 w-full text-left">
            <Plus size={20} className="text-gray-700" />
            <span>Story</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className={`border-r border-gray-200 fixed h-full bg-white z-10 transition-all duration-300  ${isSearchOpen ? 'w-20' : 'w-64'}`}>
      {!isSearchOpen && (
        <div className="p-6">
          <Image src="/Vector.png" alt="Instagram logo" width={100} height={100} />
        </div>
      )}

      <nav className="px-3">
        <div className="space-y-2">
          {renderNavItem('/', <Home size={24} className="text-gray-900" />, 'Home', isActive('/'))}
          {renderButtonNavItem(toggleSearch, <Search size={24} className="text-gray-900" />, 'Search', isSearchOpen)}
          {renderNavItem('/notifications', <Heart size={24} className="text-gray-900" />, 'Notifications', isActive('/notifications'))}
          {renderCreateDropdown()}
          {renderNavItem('/userProfile', <User size={24} className="text-gray-900" />, 'Profile', isActive('/userProfile'))}
        </div>
      </nav>

      {!isSearchOpen && (
        <div className="absolute bottom-6 px-6 w-full">
          <a href="/more" className="flex items-center space-x-4 px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors">
            <Menu size={24} className="text-gray-900" />
            <span>More</span>
          </a>
        </div>
      )}
    </div>
  );
};
