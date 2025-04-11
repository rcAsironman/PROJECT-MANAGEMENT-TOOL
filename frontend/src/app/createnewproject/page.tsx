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

// Mock org users
const orgUsers: User[] = Array.from({ length: 30 }).map((_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 2 === 0 ? 'Developer' : 'Designer',
}));

export default function CreateProjectScreen() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [search, setSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [visibleUserCount, setVisibleUserCount] = useState(10);

  const handleAddUser = (user: User) => {
    if (selectedUsers.find((u) => u.id === user.id)) {
      toast.error('User already added');
      return;
    }
    setSelectedUsers((prev) => [...prev, user]);
    toast.success(`${user.name} added to the project`);
  };

  const filteredUsers = orgUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const visibleFilteredUsers = filteredUsers.slice(0, visibleUserCount);

  const handleSubmit = () => {
    // For now, assuming the project gets an ID when it's created.
    const newProjectId = Math.floor(Math.random() * 1000); // Generate a mock project ID
    console.log({
      title,
      startDate,
      endDate,
      description,
      people: selectedUsers,
    });

    toast.success('Project created successfully!');
    // After creation, navigate back to the previous page.
    router.back(); // Go back to the previous page
  };

  return (
    <div className="min-h-screen w-full bg-white text-black p-8 space-y-8">
      {/* Go Back */}
      <button
        onClick={() => router.back()}
        className="text-sm text-indigo-600 hover:underline"
      >
        Back
      </button>

      <h1 className="text-2xl font-semibold">Create New Project</h1>

      {/* Project Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Project Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Project Title"
            className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none"
          />
        </div>
        <div className="flex flex-col sm:col-span-2">
          <label className="text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none"
            placeholder="Project description"
          />
        </div>
      </div>

      {/* Add People Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Add People to Project</h2>
        <input
          type="text"
          placeholder="Search people by name or email"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setVisibleUserCount(10);
          }}
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none"
        />

        <div className="max-h-[300px] overflow-y-auto space-y-3">
          {visibleFilteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-gray-100 p-4 rounded-md flex justify-between items-center"
            >
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-600">{user.email}</p>
              </div>
              <button
                onClick={() => handleAddUser(user)}
                className="bg-indigo-600 text-white text-sm px-3 py-1 rounded hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
          ))}
        </div>

        {visibleFilteredUsers.length < filteredUsers.length && (
          <div className="text-center">
            <button
              onClick={() => setVisibleUserCount((prev) => prev + 10)}
              className="text-indigo-600 hover:underline text-sm mt-2"
            >
              Load More
            </button>
          </div>
        )}
      </div>

      {/* Selected Users */}
      {selectedUsers.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">People Added to Project:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedUsers.map((user) => (
              <span
                key={user.id}
                className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
              >
                {user.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-6 py-2 rounded-md text-sm hover:bg-green-700"
      >
        Create Project
      </button>
    </div>
  );
}
