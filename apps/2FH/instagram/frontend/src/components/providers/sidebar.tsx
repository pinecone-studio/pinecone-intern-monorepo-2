"use client"
import { Heart, Search, Home, PlusSquare, User, Menu, Image as ImageIcon, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

export const Sidebar = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const createRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (createRef.current && !createRef.current.contains(event.target as Node)) {
        setIsCreateOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleCreate = () => {
    setIsCreateOpen(!isCreateOpen);
  };

  return (
    <div className="w-64 border-r border-gray-200 fixed h-full bg-white z-10">
      <div className="p-6">
        <Image src="/Vector.png" alt="Instagram logo" width={100} height={100} />
      </div>

      <nav className="px-3">
        <div className="space-y-2">
          <Link href="/" className="flex items-center space-x-4 px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-900">
            <Home size={24} className="text-gray-900" />
            <span className="font-medium">Home</span>
          </Link>
          <Link href="/search" className="flex items-center space-x-4 px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-900">
            <Search size={24} className="text-gray-900" />
            <span>Search</span>
          </Link>
          <Link href="/notifications" className="flex items-center space-x-4 px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-900">
            <Heart size={24} className="text-gray-900" />
            <span>Notifications</span>
          </Link>

          {/* Create with dropdown */}
          <div className="relative" ref={createRef}>
            <button 
              onClick={toggleCreate}
              className="flex items-center space-x-4 px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-900 w-full text-left"
            >
              <PlusSquare size={24} className="text-gray-900" />
              <span>Create</span>
            </button>

            {/* Dropdown Menu */}
            {isCreateOpen && (
              <div className="absolute left-full top-0 ml-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                <Link 
                  href="/create/post" 
                  className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-900"
                  onClick={() => setIsCreateOpen(false)}
                >
                  <ImageIcon size={20} className="text-gray-700" />
                  <span>Post</span>
                </Link>
                <Link 
                  href="/create/story" 
                  className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-900"
                  onClick={() => setIsCreateOpen(false)}
                >
                  <Plus size={20} className="text-gray-700" />
                  <span>Story</span>
                </Link>
              </div>
            )}
          </div>

          <Link href="/user-profile/1" className="flex items-center space-x-4 px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-900">
            <User size={24} className="text-gray-900" />
            <span>Profile</span>
          </Link>
        </div>
      </nav>

      <div className="absolute bottom-6 px-6 w-full">
        <Link href="/more" className="flex items-center space-x-4 px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-900">
          <Menu size={24} className="text-gray-900" />
          <span>More</span>
        </Link>
      </div>
    </div>
  );
};