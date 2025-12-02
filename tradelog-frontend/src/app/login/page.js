'use client'; // This is required for using "useState" in Next.js

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        try {
            // 1. Send data to your backend
            const { data } = await axios.post('http://localhost:5000/api/users/login', {
                email,
                password,
            });

            // 2. Save the token to a cookie (so we can use it later)
            Cookies.set('token', data.token, { expires: 30 }); // Expires in 30 days
            Cookies.set('userInfo', JSON.stringify(data), { expires: 30 });

            // 3. Redirect to Dashboard
            router.push('/dashboard');
        } catch (err) {
            // If error, show the message from backend
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                {error && <p className="text-red-500 mb-4 text-center text-sm bg-red-900/20 p-2 rounded">{error}</p>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 p-3 rounded hover:bg-blue-700 font-bold transition-colors"
                    >
                        Sign In
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-400">
                    Don't have an account? <a href="/signup" className="text-blue-400 hover:underline">Sign up</a>
                </p>
            </div>
        </div>
    );
}