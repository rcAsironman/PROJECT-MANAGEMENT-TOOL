'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  const userRole = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('user') || '{}')?.role || ''
    : '';


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projRes, userRes] = await Promise.all([
          fetch('http://localhost:5000/api/projects/stats/count'),
          fetch('http://localhost:5000/api/users/stats/count'),
        ]);

        const projData = await projRes.json();
        const userData = await userRes.json();

        if (projRes.ok) setTotalProjects(projData.total);
        if (userRes.ok) setTotalUsers(userData.total);
      } catch (err) {
        toast.error('Error fetching dashboard stats');
      }
    };

    fetchStats();
  }, []);


  const fetchUsers = async (page: number) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/users?page=${page}&limit=20&search=${encodeURIComponent(search)}`);
      const data = await res.json();

      if (res.ok) {
        if (data.users.length === 0) setHasMore(false);
        setUsers((prev) => [...prev, ...data.users]);
      } else {
        toast.error(data.message || 'Failed to load users');
      }
    } catch (err) {
      toast.error('Server error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': userRole,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete user');

      setUsers((prev) => prev.filter((user) => user._id !== id));
      toast.success('User deleted');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleLoadMore = () => {
    if (!loading && hasMore) setPage((prev) => prev + 1);
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-lg shadow">
        <h3 className="text-sm font-medium">Total Projects</h3>
        <p className="text-3xl font-bold mt-2">{totalProjects}</p>
      </div>
      <div className="bg-gradient-to-br from-pink-500 to-rose-500 text-white p-6 rounded-lg shadow">
        <h3 className="text-sm font-medium">Total People</h3>
        <p className="text-3xl font-bold mt-2">{totalUsers}</p>
      </div>

      {/* Search + Actions */}
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
            onClick={() => {
              setUsers([]);
              setPage(1);
              setHasMore(true);
              fetchUsers(1); // Reload with search term
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
          >
            Search
          </button>
          <button
            onClick={() => router.push('/createnewproject')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
          >
            Create New Project
          </button>
        </div>
      </div>

      {/* User List */}
      <div className="space-y-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row sm:items-center justify-between"
            >
              <div>
                <p className="text-lg font-medium text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-sm text-gray-400">{user.role}</p>
              </div>
              <div className="mt-4 sm:mt-0 flex gap-2">
                {(userRole === 'Admin' || userRole === 'Root') && (
                  <>

                    <button
                      onClick={() => router.push(`/dashboard/edit-user/${user._id}`)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </>

                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No users found.</p>
        )}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center mt-4">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="text-indigo-600 hover:underline text-sm"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
