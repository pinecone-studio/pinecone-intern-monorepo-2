import { NavigationItem } from './TinderProfile';

interface TinderNavigationProps {
  activeSection: NavigationItem;
  onSectionChange: (_section: NavigationItem) => void;
}

export const TinderNavigation = ({ activeSection, onSectionChange: _onSectionChange }: TinderNavigationProps) => {
  const navigationItems = [
    { id: 'profile' as NavigationItem, label: 'Profile' },
    { id: 'images' as NavigationItem, label: 'Images' },
  ];

  return (
    <nav className="w-64 bg-white p-6">
      <div className="space-y-2">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => _onSectionChange(item.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm ${
              activeSection === item.id
                ? 'bg-gray-200 text-gray-800'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}; 