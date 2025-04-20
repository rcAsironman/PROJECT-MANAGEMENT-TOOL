'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const pathname = usePathname();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic example: show error if password too short
        if (!email.includes('@')) {
            toast.error('Please enter a valid email');
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        localStorage.setItem('authToken', 'exampleToken');
        toast.success('Logging in...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
        
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                    <p className="text-sm text-gray-500 mt-2">Please sign in to your account</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <input
                            type="email"
                            id="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-black"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-black"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Don&apos;t have an account?</span>
                        <Link href="/register" className="text-indigo-600 hover:underline">
                            Sign up
                        </Link>

                    </div>

                    <div className="text-right">
                        <Link href="/forgotpassword" className="text-sm text-indigo-600 hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}