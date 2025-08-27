import { suggestions } from '../utils/fake-data';

export const RightSidebar = () => {
  return (
    <div className="w-80 p-6  right-0 top-0 h-full bg-white">
      {/* User Profile */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">🦄</div>
        <div className="flex-1">
          <p className="font-semibold">upvote_</p>
          <p className="text-gray-500 text-sm">Upvote</p>
        </div>
        <button className="text-blue-500 font-semibold text-sm">Log out</button>
      </div>

      {/* Suggestions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-500 font-semibold text-sm">Suggestions for you</h3>
          <button className="text-sm font-semibold">See All</button>
        </div>

        <div className="space-y-3">
          {suggestions.map((user) => (
            <div key={user.id} className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">{user.avatar}</div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{user.username}</p>
                <p className="text-gray-500 text-xs">{user.description}</p>
              </div>
              <button className="text-blue-500 font-semibold text-sm">Follow</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
