'use client';

import { useState } from 'react';
import HomeScreen from '../components/HomeScreen/page';
import ProjectScreen from '../components/projects/page';
import SettingsPage from '../settings/page';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen/>;
      case 'projects':
        return <ProjectScreen/>;
      case 'settings':
        return <SettingsPage/>;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6">
        <h1 className="text-black text-xl font-bold mb-8">Project Management</h1>
        <nav className="space-y-4">
          <button
            onClick={() => setActiveTab('home')}
            className={`block w-full text-center px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'home' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`block w-full text-center px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'projects'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`block w-full text-center px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'settings'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            Settings
          </button>
        </nav>
      </aside>

      {/* Main content area */}
      <main className="flex-1 p-6">{renderContent()}</main>
    </div>
  );
}
