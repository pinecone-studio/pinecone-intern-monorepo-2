import { useQuery, gql } from '@apollo/client';
import { useAuth } from '@/contexts/AuthContext';

const SEARCH_USERS = gql`
  query SearchUsers($keyword: String!) {
    searchUsers(keyword: $keyword) {
      _id
      userName
      fullName
      profileImage
      isVerified
    }
  }
`;

type SuggestedUser = {
  _id: string;
  userName: string;
  fullName: string;
  profileImage?: string;
  isVerified: boolean;
};

/* eslint-disable complexity */
export const RightSidebar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  
  // Get suggested users by searching for common usernames
  const { data, loading } = useQuery(SEARCH_USERS, {
    variables: { keyword: 'user' }, // Simple search to get some users
    skip: !isAuthenticated,
    errorPolicy: 'all'
  });

  if (!isAuthenticated || !user) {
    return null;
  }

  const suggestedUsers: SuggestedUser[] = data?.searchUsers?.slice(0, 5) || [];

  return (
    <div className="w-80 p-6  right-0 top-0 h-full bg-white">
      {/* User Profile */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold overflow-hidden">
          {user.profileImage ? (
            <img src={user.profileImage} alt={user.userName} className="w-full h-full object-cover" />
          ) : (
            user.userName.charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex-1">
          <p className="font-semibold">{user.userName}</p>
          <p className="text-gray-500 text-sm">{user.fullName}</p>
        </div>
        <button 
          onClick={logout}
          className="text-blue-500 font-semibold text-sm hover:text-blue-700"
        >
          Log out
        </button>
      </div>

      {/* Suggestions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-500 font-semibold text-sm">Suggestions for you</h3>
          <button className="text-sm font-semibold">See All</button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-20 mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded w-16"></div>
                </div>
                <div className="h-6 bg-gray-300 rounded w-12"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {suggestedUsers.map((suggestedUser) => (
              <div key={suggestedUser._id} className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm overflow-hidden">
                  {suggestedUser.profileImage ? (
                    <img src={suggestedUser.profileImage} alt={suggestedUser.userName} className="w-full h-full object-cover" />
                  ) : (
                    suggestedUser.userName.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{suggestedUser.userName}</p>
                  <p className="text-gray-500 text-xs">{suggestedUser.fullName}</p>
                </div>
                <button className="text-blue-500 font-semibold text-sm hover:text-blue-700">
                  Follow
                </button>
              </div>
            ))}
            {suggestedUsers.length === 0 && (
              <p className="text-gray-500 text-sm text-center">No suggestions available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
