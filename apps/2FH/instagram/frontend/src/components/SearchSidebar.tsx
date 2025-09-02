'use client';
import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigation } from './NavigationProvider/NavigationProvider';

// Mock search data
const recentSearches = [
  { id: 1, username: 'rosso_blanc', subtitle: 'Rosetta Rosalind • Followed by elijah...', avatar: '👤' },
  { id: 2, username: 'Rosval_kitchen', subtitle: 'Rosval Kitchen and Winery', avatar: '🍷' },
];

export const SearchSidebar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { isSearchOpen } = useNavigation();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const clearAllRecent = () => {
    console.log('Clear all recent searches');
  };

  if (!isSearchOpen) return null;

  return (
    <div className="w-80 border-r border-gray-200 bg-white h-screen fixed left-20 top-0 z-20 overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold mb-4">Search</h2>
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
          // Recent searches
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
