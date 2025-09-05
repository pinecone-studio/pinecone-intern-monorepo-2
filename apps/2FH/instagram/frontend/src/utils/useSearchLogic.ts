import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  useSearchUsersQuery,
  useGetUserSearchHistoryQuery,
  useAddToSearchHistoryMutation,
  useClearSearchHistoryMutation,
  useRemoveFromSearchHistoryMutation
} from '@/generated';
interface User {
  _id: string;
  fullName: string;
  userName: string;
  profileImage?: string | null;
  isVerified?: boolean;
}
const useSearchQueries = (searchQuery: string, shouldSearch: boolean, currentUserId: string | undefined, isSearchOpen: boolean) => {
  const { data: searchData, loading: searchLoading } = useSearchUsersQuery({
    variables: { keyword: searchQuery },
    skip: !shouldSearch || !searchQuery.trim(),
    onError: (error) => {
      console.error('Search error:', error);
    }
  });
  const { data: historyData, refetch: refetchSearchHistory } = useGetUserSearchHistoryQuery({
    variables: { userId: currentUserId || '' },
    skip: !currentUserId || !isSearchOpen,
    onError: (error) => {
      console.error('Get search history error:', error);
    }
  });
  return { searchData, searchLoading, historyData, refetchSearchHistory };
};
const useSearchMutations = (refetchSearchHistory: () => void) => {
  const [addToSearchHistory] = useAddToSearchHistoryMutation({
    onCompleted: (data) => {
      console.log('Added to search history:', data);
      refetchSearchHistory();
    },
    onError: (error) => {
      console.error('Add to search history error:', error);
    }
  });

  const [clearSearchHistory] = useClearSearchHistoryMutation({
    onCompleted: (data) => {
      if (data.clearSearchHistory.success) {
        refetchSearchHistory();
      }
    },
    onError: (error) => {
      console.error('Clear search history error:', error);
    }
  });

  const [removeFromSearchHistory] = useRemoveFromSearchHistoryMutation({
    onCompleted: (data) => {
      console.log('Removed from search history:', data);
      refetchSearchHistory();
    },
    onError: (error) => {
      console.error('Remove from search history error:', error);
    }
  });

  return { addToSearchHistory, clearSearchHistory, removeFromSearchHistory };
};
export const useSearchLogic = (currentUserId: string | undefined, isSearchOpen: boolean) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [shouldSearch, setShouldSearch] = useState(false);
  const router = useRouter();
  const { searchData, searchLoading, historyData, refetchSearchHistory } = useSearchQueries(
    searchQuery, 
    shouldSearch, 
    currentUserId, 
    isSearchOpen
  );
  const { addToSearchHistory, clearSearchHistory, removeFromSearchHistory } = useSearchMutations(refetchSearchHistory);
  const searchResults = searchData?.searchUsers || [];
  const searchHistory = historyData?.getUserSearchHistory || [];
  const debouncedSearch = useCallback((_query: string) => {
    const timeoutId = setTimeout(() => {
      setShouldSearch(true);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, []);
  useEffect(() => {
    if (!searchQuery.trim()) {
      setShouldSearch(false);
    } else {
      const cleanup = debouncedSearch(searchQuery);
      return cleanup;
    }
  }, [searchQuery, debouncedSearch]);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  const clearSearch = () => {
    setSearchQuery('');
    setShouldSearch(false);
  };
  const handleUserClick = async (user: User) => {
    if (user._id !== currentUserId) {
      try {
        await addToSearchHistory({
          variables: { searchedUserId: user._id }
        });
      } catch (error) {
        console.error('Error adding to search history:', error);
      }
    }
    setSearchQuery('');
    setShouldSearch(false);
    router.push(`/${user.userName}`);
  };
  const handleClearAllRecent = () => {
    clearSearchHistory();
  };
  const handleRemoveFromHistory = (userId: string) => {
    removeFromSearchHistory({
      variables: { searchedUserId: userId }
    });
  };
  return {
    searchQuery,
    shouldSearch,
    searchResults,
    searchHistory,
    searchLoading,
    handleSearchChange,
    clearSearch,
    handleUserClick,
    handleClearAllRecent,
    handleRemoveFromHistory
  };
};