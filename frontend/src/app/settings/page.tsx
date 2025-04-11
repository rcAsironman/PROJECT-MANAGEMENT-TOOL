'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserCircle } from 'react-icons/fa'; // Optional: If you want to use an icon for profile picture.

const dummyUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'Developer',
};

export default function SettingsPage() {
  const router = useRouter();
  
  // Typing the state to accept either a user object or null
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(dummyUser);

  const handleLogout = () => {
    // Logic to handle logout (e.g., clearing session, tokens, etc.)
    setUser(null);  // Clear user data
    router.push('/login');  // Redirect to login page
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-purple-200 py-12 px-6">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg space-y-8">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 text-center">Account Settings</h1>

        {/* Profile Section */}
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xl">
            <FaUserCircle /> {/* User icon */}
          </div>
          <div>
            {user ? (
              <div>
                <p className="text-2xl font-semibold text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                <p className="text-sm text-gray-600 mt-1">Role: {user.role}</p>
              </div>
            ) : (
              <p className="text-gray-500">No user logged in.</p>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <div className="text-center">
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-red-700 transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
