'use client';
import { useNavigation } from '../NavigationProvider/NavigationProvider';
import { useAuth } from '../../contexts/AuthContext';
import { SearchHistory } from './SearchedHistory';
import { SearchInput } from './SearchInput';
import { SearchResults } from './SearchResults';
import { useSearchLogic } from '@/utils/useSearchLogic';  

export const SearchSidebar = () => {
  const { isSearchOpen } = useNavigation();
  const { user, isLoading: authLoading } = useAuth();
  const currentUserId = user?._id;

  const {
    searchQuery,
    searchResults,
    searchHistory,
    searchLoading,
    handleSearchChange,
    clearSearch,
    handleUserClick,
    handleClearAllRecent,
    handleRemoveFromHistory
  } = useSearchLogic(currentUserId, isSearchOpen);

  if (!isSearchOpen) return null;

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="w-80 border-r border-gray-200 bg-white h-full fixed left-20 z-20">
        <div className="p-4">
          <p className="text-gray-500 text-center">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is not authenticated
  if (!currentUserId) {
    return (
      <div className="w-80 border-r border-gray-200 bg-white h-full fixed left-20 z-20">
        <div className="p-4">
          <p className="text-gray-500 text-center">Please log in to use search</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-r border-gray-200 bg-white h-full fixed left-20 z-20">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold mb-4">Search</h2>
        <SearchInput 
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onClear={clearSearch}
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {!searchQuery ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">Recent</h3>
              <button 
                onClick={handleClearAllRecent} 
                className="text-blue-500 text-sm hover:text-blue-700"
              >
                Clear all
              </button>
            </div>
            <SearchHistory 
              searchHistory={searchHistory} 
              onUserClick={handleUserClick}
              onRemoveUser={handleRemoveFromHistory}
            />
          </div>
        ) : (
          <SearchResults 
            results={searchResults}
            loading={searchLoading}
            onUserClick={handleUserClick}
          />
        )}
      </div>
    </div>
  );
};