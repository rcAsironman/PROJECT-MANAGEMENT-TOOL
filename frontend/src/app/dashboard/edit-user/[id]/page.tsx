'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const roles = ['Developer', 'Designer', 'Admin', 'Tester', 'Manager', 'Root'];



  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${id}`);
        const user = await res.json();
        if (!res.ok) throw new Error(user.message || 'User not found');
  
        setName(user.name);
        setEmail(user.email);
        setRole(user.role);
      } catch (err: any) {
        toast.error(err.message);
        router.push('/dashboard');
      }
    }
  
    fetchUser();
  }, [id, router]);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userRole = JSON.parse(localStorage.getItem('user') || '{}')?.role;

    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': userRole,
        },
        body: JSON.stringify({ name, email, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success('User updated successfully');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Edit User</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm text-black focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm text-black focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="role"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm text-black focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
          >
            Update User
          </button>
        </form>
      </div>
    </div>
  );
}
