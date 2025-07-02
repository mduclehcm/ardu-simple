import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  description: string;
}

const navItems: NavItem[] = [
  {
    path: '/',
    label: 'Overview',
    icon: '📊',
    description: 'System status and sensors'
  },
  {
    path: '/control',
    label: 'Control',
    icon: '🎮',
    description: 'Primary flight display'
  },
  {
    path: '/mission',
    label: 'Mission',
    icon: '🗺️',
    description: 'Mission planning'
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: '⚙️',
    description: 'Connection and preferences'
  },
  {
    path: '/tools',
    label: 'Tools',
    icon: '🔧',
    description: 'Diagnostic tools'
  }
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full">
      <nav className="p-4">
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block p-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {item.description}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}; 