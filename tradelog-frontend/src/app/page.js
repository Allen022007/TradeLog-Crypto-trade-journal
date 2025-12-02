import Link from 'next/link';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
            <h1 className="text-5xl font-bold mb-8">Crypto TradeLog</h1>
            <div className="flex gap-4">
                <Link href="/login" className="px-6 py-3 bg-blue-600 rounded hover:bg-blue-700">Login</Link>
                <Link href="/signup" className="px-6 py-3 bg-green-600 rounded hover:bg-green-700">Signup</Link>
            </div>
        </main>
    );
}