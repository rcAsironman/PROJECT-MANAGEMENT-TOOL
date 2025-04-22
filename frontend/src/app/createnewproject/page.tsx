'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};


export default function CreateProjectScreen() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [search, setSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [visibleUserCount, setVisibleUserCount] = useState(10);
  const [orgUsers, setOrgUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchOrgUsers() {
      try {
        const res = await fetch('http://localhost:5000/api/users?page=1&limit=1000');
        const data = await res.json();
        if (res.ok) {
          setOrgUsers(data.users.map((u: any) => ({
            id: u._id,
            name: u.name,
            email: u.email,
            role: u.role
          })));
        } else {
          toast.error('Failed to load users');
        }
      } catch (err) {
        toast.error('Server error while fetching users');
      }
    }

    fetchOrgUsers();
  }, []);


  const handleAddUser = (user: User) => {
    if (selectedUsers.find((u) => u.id === user.id)) {
      toast.error('User already added');
      return;
    }
  
    setSelectedUsers((prev) => [...prev, user]);
    setOrgUsers((prev) => prev.filter((u) => u.id !== user.id)); //remove from orgUsers
    toast.success(`${user.name} added to the project`);
  };
  
  

  const filteredUsers = orgUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const visibleFilteredUsers = filteredUsers.slice(0, visibleUserCount);

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const projectData = {
      title,
      description,
      startDate,
      endDate,
      people: selectedUsers,
      createdBy: {
        name: user.name,
        email: user.email
      }
    };

    try {
      const res = await fetch('http://localhost:5000/api/projects/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        router.back();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Failed to create project');
    }
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
