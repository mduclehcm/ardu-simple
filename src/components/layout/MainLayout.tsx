import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  connectionState: {
    isConnected: boolean;
    error: string | null;
  };
}

export const MainLayout: React.FC<MainLayoutProps> = ({ connectionState }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header connectionState={connectionState} />
      
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}; 