'use client';

import { Suspense } from 'react';
import HomeScreen from '../components/HomeScreen/page';
import ProjectScreen from '../components/projects/page';
import SettingsPage from '../settings/page';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    // Check if the user is logged in by verifying if user data exists in localStorage
    const loggedInUser = localStorage.getItem('user');
    //If no user data is found, redirect to the login page
    if (!loggedInUser) {
      alert("please login...")
      router.push('/login');
    }
  }, []);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/dashboard?tab=${tab}`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'projects':
        return <ProjectScreen />;
      case 'settings':
        return <SettingsPage />;
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
            onClick={() => handleTabChange('home')}
            className={`block w-full text-center px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'home' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleTabChange('projects')}
            className={`block w-full text-center px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'projects' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => handleTabChange('settings')}
            className={`block w-full text-center px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'settings' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-200'
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

export default function DashboardPage() {
  return (
    <Suspense fallback={<p className="p-6">Loading dashboard...</p>}>
      <DashboardContent />
    </Suspense>
  );
}
