import { suggestions } from '../utils/fake-data';

export const RightSidebar = () => {
  return (
    <div className="w-80 p-6 fixed right-0 top-0 h-full overflow-y-auto bg-white">
      {/* User Profile */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
          🦄
        </div>
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
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                {user.avatar}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{user.username}</p>
                <p className="text-gray-500 text-xs">{user.description}</p>
              </div>
              <button className="text-blue-500 font-semibold text-sm">Follow</button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Links */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="text-xs text-gray-400 space-y-2">
          <div className="flex flex-wrap gap-2">
            <a href="#" className="hover:underline">About</a>
            <span>•</span>
            <a href="#" className="hover:underline">Help</a>
            <span>•</span>
            <a href="#" className="hover:underline">Press</a>
            <span>•</span>
            <a href="#" className="hover:underline">API</a>
            <span>•</span>
            <a href="#" className="hover:underline">Jobs</a>
            <span>•</span>
            <a href="#" className="hover:underline">Privacy</a>
            <span>•</span>
            <a href="#" className="hover:underline">Terms</a>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="#" className="hover:underline">Locations</a>
            <span>•</span>
            <a href="#" className="hover:underline">Language</a>
            <span>•</span>
            <a href="#" className="hover:underline">Meta Verified</a>
          </div>
          <p className="mt-4">© 2024 INSTAGRAM FROM META</p>
        </div>
      </div>
    </div>
  );
}; 