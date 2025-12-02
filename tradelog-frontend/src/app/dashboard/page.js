'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Dashboard() {
    const router = useRouter();
    const [trades, setTrades] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // New States for Forms and Search
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const [newTrade, setNewTrade] = useState({
        symbol: '',
        type: 'Long',
        entryPrice: '',
        notes: ''
    });

    // 1. Initial Load
    useEffect(() => {
        const token = Cookies.get('token');
        const userInfo = Cookies.get('userInfo');

        if (!token) {
            router.push('/login');
            return;
        }
        setUser(JSON.parse(userInfo));
        fetchTrades(token);
    }, [router]);

    // 2. Fetch Data
    const fetchTrades = async (token) => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/trades', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTrades(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // 3. Create Trade Logic
    const handleCreate = async (e) => {
        e.preventDefault();
        const token = Cookies.get('token');

        try {
            const { data } = await axios.post('http://localhost:5000/api/trades', newTrade, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Add new trade to list immediately (no refresh needed)
            setTrades([data, ...trades]);
            setShowForm(false); // Close form
            setNewTrade({ symbol: '', type: 'Long', entryPrice: '', notes: '' }); // Reset form
        } catch (error) {
            alert('Failed to create trade');
        }
    };

    // 4. Delete Trade Logic
    const handleDelete = async (id) => {
        if(!confirm('Are you sure you want to delete this trade?')) return;

        const token = Cookies.get('token');
        try {
            await axios.delete(`http://localhost:5000/api/trades/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Remove from UI
            setTrades(trades.filter((t) => t._id !== id));
        } catch (error) {
            alert('Failed to delete trade');
        }
    };

    // 5. Logout Logic
    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('userInfo');
        router.push('/login');
    };

    // 6. Filter Logic
    const filteredTrades = trades.filter((trade) => {
        const matchesSearch = trade.symbol.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || trade.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-blue-500">TradeLog</h1>
                        <p className="text-gray-400">Welcome, {user?.name}</p>
                    </div>
                    <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300">Logout</button>
                </div>

                {/* Controls: Search & Add Button */}
                <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Search Symbol (e.g. BTC)..."
                            className="p-2 rounded bg-gray-800 border border-gray-700"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select
                            className="p-2 rounded bg-gray-800 border border-gray-700"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="Open">Open</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        {showForm ? 'Cancel' : '+ New Trade'}
                    </button>
                </div>

                {/* Add Trade Form (Visible only when clicked) */}
                {showForm && (
                    <form onSubmit={handleCreate} className="bg-gray-800 p-6 rounded-lg mb-6 border border-blue-500/30">
                        <h3 className="text-xl font-bold mb-4">Log New Trade</h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <input
                                placeholder="Symbol (BTC)" required
                                className="p-2 rounded bg-gray-700"
                                value={newTrade.symbol}
                                onChange={(e) => setNewTrade({...newTrade, symbol: e.target.value})}
                            />
                            <select
                                className="p-2 rounded bg-gray-700"
                                value={newTrade.type}
                                onChange={(e) => setNewTrade({...newTrade, type: e.target.value})}
                            >
                                <option value="Long">Long</option>
                                <option value="Short">Short</option>
                            </select>
                            <input
                                type="number" placeholder="Entry Price" required
                                className="p-2 rounded bg-gray-700"
                                value={newTrade.entryPrice}
                                onChange={(e) => setNewTrade({...newTrade, entryPrice: e.target.value})}
                            />
                            <input
                                placeholder="Notes"
                                className="p-2 rounded bg-gray-700"
                                value={newTrade.notes}
                                onChange={(e) => setNewTrade({...newTrade, notes: e.target.value})}
                            />
                        </div>
                        <button type="submit" className="w-full bg-green-600 py-2 rounded hover:bg-green-700 font-bold">
                            Save Trade
                        </button>
                    </form>
                )}

                {/* Trade List */}
                <div className="grid gap-4">
                    {filteredTrades.map((trade) => (
                        <div key={trade._id} className="bg-gray-800 p-5 rounded-lg flex justify-between items-center hover:bg-gray-750 transition">
                            <div>
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    {trade.symbol}
                                    <span className={`text-xs px-2 py-0.5 rounded ${trade.type === 'Long' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                    {trade.type}
                  </span>
                                </h3>
                                <p className="text-sm text-gray-400">{trade.notes || 'No notes'}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="font-mono">${trade.entryPrice}</p>
                                    <p className="text-xs text-gray-500">{trade.status}</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(trade._id)}
                                    className="text-gray-500 hover:text-red-500 transition"
                                    title="Delete Trade"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}

                    {filteredTrades.length === 0 && (
                        <p className="text-center text-gray-500 mt-10">No trades found matching your filters.</p>
                    )}
                </div>

            </div>
        </div>
    );
}