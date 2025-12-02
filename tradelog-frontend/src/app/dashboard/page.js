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

    // UI States
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Open', 'Closed'

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
            setTrades([data, ...trades]);
            setShowForm(false);
            setNewTrade({ symbol: '', type: 'Long', entryPrice: '', notes: '' });
        } catch (error) {
            alert('Failed to create trade');
        }
    };

    // 4. Delete Trade Logic
    const handleDelete = async (id) => {
        if(!confirm('Delete this trade?')) return;
        const token = Cookies.get('token');
        try {
            await axios.delete(`http://localhost:5000/api/trades/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTrades(trades.filter((t) => t._id !== id));
        } catch (error) {
            alert('Failed to delete');
        }
    };

    // 5. Logout
    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('userInfo');
        router.push('/login');
    };

    // 6. Stats Calculation
    const totalTrades = trades.length;
    const openPositions = trades.filter(t => t.status === 'Open').length;
    const totalInvested = trades.reduce((acc, curr) => acc + Number(curr.entryPrice), 0);

    // 7. Filter Logic
    const filteredTrades = trades.filter((trade) => {
        const matchesSearch = trade.symbol.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || trade.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) return <div className="text-white text-center mt-20">Loading Dashboard...</div>;

    return (
        <div className="min-h-screen bg-gray-950 text-white p-6">
            <div className="max-w-5xl mx-auto">

                {/* Top Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Crypto TradeLog
                        </h1>
                        <p className="text-sm text-gray-400">Welcome, {user?.name}</p>
                    </div>
                    <button onClick={handleLogout} className="text-xs text-red-400 hover:text-red-300 border border-red-900/50 px-3 py-1 rounded">
                        Logout
                    </button>
                </div>

                {/* STATS BAR (The Upgrade) */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                        <p className="text-gray-400 text-xs uppercase font-semibold">Total Trades</p>
                        <p className="text-2xl font-bold text-white">{totalTrades}</p>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                        <p className="text-gray-400 text-xs uppercase font-semibold">Open Positions</p>
                        <p className="text-2xl font-bold text-blue-400">{openPositions}</p>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                        <p className="text-gray-400 text-xs uppercase font-semibold">Total Entry Vol</p>
                        <p className="text-2xl font-bold text-green-400">${totalInvested.toLocaleString()}</p>
                    </div>
                </div>

                {/* Controls Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6 bg-gray-900/50 p-2 rounded-lg border border-gray-800">

                    {/* Tabs for Filter (Better than Dropdown) */}
                    <div className="flex bg-gray-900 rounded p-1">
                        {['All', 'Open', 'Closed'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-1.5 rounded text-sm transition ${
                                    statusFilter === status
                                        ? 'bg-blue-600 text-white font-medium shadow'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    {/* Search & Add */}
                    <div className="flex gap-3 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Search Symbol..."
                            className="px-3 py-1.5 rounded bg-gray-950 border border-gray-700 text-sm focus:border-blue-500 outline-none w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="bg-blue-600 px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-500 whitespace-nowrap"
                        >
                            {showForm ? 'Cancel' : '+ New Trade'}
                        </button>
                    </div>
                </div>

                {/* Add Trade Form */}
                {showForm && (
                    <form onSubmit={handleCreate} className="bg-gray-900 p-6 rounded-xl mb-6 border border-blue-500/20 shadow-xl">
                        <h3 className="text-lg font-bold mb-4 text-blue-400">Log New Position</h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <input placeholder="Symbol (e.g. BTC)" required className="p-2 rounded bg-gray-800 border border-gray-700 text-sm"
                                   value={newTrade.symbol} onChange={(e) => setNewTrade({...newTrade, symbol: e.target.value})} />
                            <select className="p-2 rounded bg-gray-800 border border-gray-700 text-sm"
                                    value={newTrade.type} onChange={(e) => setNewTrade({...newTrade, type: e.target.value})}>
                                <option value="Long">Long</option>
                                <option value="Short">Short</option>
                            </select>
                            <input type="number" placeholder="Entry Price" required className="p-2 rounded bg-gray-800 border border-gray-700 text-sm"
                                   value={newTrade.entryPrice} onChange={(e) => setNewTrade({...newTrade, entryPrice: e.target.value})} />
                            <input placeholder="Notes" className="p-2 rounded bg-gray-800 border border-gray-700 text-sm"
                                   value={newTrade.notes} onChange={(e) => setNewTrade({...newTrade, notes: e.target.value})} />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 py-2 rounded font-semibold hover:bg-blue-500">Save Trade</button>
                    </form>
                )}

                {/* List of Trades */}
                <div className="space-y-3">
                    {filteredTrades.map((trade) => (
                        <div key={trade._id} className="bg-gray-900 p-4 rounded-lg flex justify-between items-center border border-gray-800 hover:border-gray-600 transition group">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${trade.type === 'Long' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                                    {trade.type}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{trade.symbol}</h3>
                                    <p className="text-xs text-gray-500">{trade.notes}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-sm font-mono text-gray-300">${Number(trade.entryPrice).toLocaleString()}</p>
                                    <span className={`text-[10px] uppercase tracking-wider ${trade.status === 'Open' ? 'text-blue-400' : 'text-gray-500'}`}>
                    {trade.status}
                  </span>
                                </div>
                                <button onClick={() => handleDelete(trade._id)} className="text-gray-600 hover:text-red-500 transition opacity-0 group-hover:opacity-100">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                    {filteredTrades.length === 0 && (
                        <div className="text-center py-12 text-gray-500 bg-gray-900/30 rounded-lg border border-gray-800 border-dashed">
                            No trades found.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}