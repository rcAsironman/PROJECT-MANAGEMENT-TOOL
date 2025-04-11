'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

// Simulate 100 users
const allUsers: User[] = Array.from({ length: 100 }).map((_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 3 === 0 ? 'Manager' : i % 2 === 0 ? 'Developer' : 'Designer',
}));

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(20);
  const [users, setUsers] = useState<User[]>(allUsers);
  const router = useRouter();

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase())
  );

  const visibleUsers = filteredUsers.slice(0, visibleCount);

  const handleDelete = (id: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (confirmed) {
      setUsers((prev) => prev.filter((user) => user.id !== id));
      toast.success('User deleted');
    }
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 20);
  };

  return (
    <div className="space-y-8">
      {/* Overview cards with gradient backgrounds */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium">Total Projects</h3>
          <p className="text-3xl font-bold mt-2">8</p>
        </div>
        <div className="bg-gradient-to-br from-pink-500 to-rose-500 text-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium">Total People</h3>
          <p className="text-3xl font-bold mt-2">{users.length}</p>
        </div>
      </div>

      {/* People search and create */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">People</h2>
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <input
            type="text"
            placeholder="Search by name, email or role"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-black focus:outline-none w-64"
          />
          <button
            onClick={() => toast('Search pressed (optional logic)')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
          >
            Search
          </button>
          <button
            onClick={() => router.push("/createnewproject")}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
          >
            Create New Project
          </button>
        </div>
      </div>

      {/* User cards */}
      <div className="max-h-[500px] overflow-y-auto space-y-4 pr-1">
        {visibleUsers.length > 0 ? (
          visibleUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row sm:items-center justify-between"
            >
              <div>
                <p className="text-lg font-medium text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-sm text-gray-400">{user.role}</p>
              </div>
              <div className="mt-4 sm:mt-0 flex gap-2">
                <button
                  onClick={() => router.push(`/dashboard/edit-user/${user.id}`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No results found.</p>
        )}
      </div>

      {/* Load More */}
      {visibleUsers.length < filteredUsers.length && (
        <div className="text-center mt-4">
          <button
            onClick={handleLoadMore}
            className="text-indigo-600 hover:underline text-sm"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
