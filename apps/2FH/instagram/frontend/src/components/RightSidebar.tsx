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

  const { data, loading } = useQuery(SEARCH_USERS, {
    variables: { keyword: 'user' },
    skip: !isAuthenticated,
    errorPolicy: 'all',
  });

  if (!isAuthenticated || !user) {
    return null;
  }

  const suggestedUsers: SuggestedUser[] = data?.searchUsers?.slice(0, 5) || [];

  return (
    <div className="hidden lg:block w-72 p-4 right-0 top-0 h-full bg-white fixed">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold overflow-hidden">
          {user.profileImage ? <img src={user.profileImage} alt={user.userName} className="w-full h-full object-cover" /> : user.userName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">{user.userName}</p>
          <p className="text-gray-500 text-xs">{user.fullName}</p>
        </div>
        <button onClick={logout} className="text-blue-500 font-semibold text-xs hover:text-blue-700">
          Log out
        </button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-500 font-semibold text-xs">Suggestions for you</h3>
          <button className="text-xs font-semibold">See All</button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="w-7 h-7 rounded-full bg-gray-300"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-300 rounded w-20 mb-1"></div>
                  <div className="h-2 bg-gray-300 rounded w-16"></div>
                </div>
                <div className="h-5 bg-gray-300 rounded w-10"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {suggestedUsers.map((suggestedUser) => (
              <div key={suggestedUser._id} className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs overflow-hidden">
                  {suggestedUser.profileImage ? (
                    <img src={suggestedUser.profileImage} alt={suggestedUser.userName} className="w-full h-full object-cover" />
                  ) : (
                    suggestedUser.userName.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-xs">{suggestedUser.userName}</p>
                  <p className="text-gray-500 text-xs">{suggestedUser.fullName}</p>
                </div>
                <button className="text-blue-500 font-semibold text-xs hover:text-blue-700">Follow</button>
              </div>
            ))}
            {suggestedUsers.length === 0 && <p className="text-gray-500 text-xs text-center">No suggestions available</p>}
          </div>
        )}
      </div>
    </div>
  );
};
