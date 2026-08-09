import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';

export default function Reports() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ customers: 0, drivers: 0, cabs: 0, bookings: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [cRes, dRes, cabRes, bRes] = await Promise.all([
                    api.get('/customers'), api.get('/drivers'), api.get('/cabs'), api.get('/bookings')
                ]);
                setStats({
                    customers: cRes.data.length,
                    drivers: dRes.data.length,
                    cabs: cabRes.data.length,
                    bookings: bRes.data.length
                });
            } catch (error) {
                console.error("Failed to load report data", error);
                setError(true);
                toast.error('Could not load report data.');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const handleLogout = () => { logout(); toast.success('Logged out'); navigate('/'); };
    const handleBack = () => navigate('/admin');

    if (loading) return <div className="flex h-screen items-center justify-center text-xl text-gray-500">Loading report charts...</div>;
    if (error) return <div className="flex h-screen items-center justify-center text-xl text-red-500">Failed to load data. Check console.</div>;

    const barData = [
        { name: 'Customers', count: stats.customers },
        { name: 'Drivers', count: stats.drivers },
        { name: 'Cabs', count: stats.cabs },
        { name: 'Bookings', count: stats.bookings },
    ];

    const pieData = [
        { name: 'Customers', value: stats.customers },
        { name: 'Drivers', value: stats.drivers },
        { name: 'Cabs', value: stats.cabs },
    ];
    const COLORS = ['#3b82f6', '#22c55e', '#eab308'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="relative z-10 max-w-6xl mx-auto animate-fade-in-up">
                <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl p-6 mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">📊 System Reports</h1>
                        <p className="text-gray-600 mt-1 font-semibold">Visualize your fleet and booking statistics.</p>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={handleBack} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md transition">← Dashboard</button>
                        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition">Logout</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Resource Distribution</h2>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#3b82f6" barSize={60} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                        <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Resource Distribution</h2>
                            <div className="h-[300px] w-full min-h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="count" fill="#3b82f6" barSize={60} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div> 
                                                  <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Fleet Composition</h2>
                            <div className="h-[300px] w-full min-h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#8884d8" paddingAngle={5} dataKey="value">
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex justify-center gap-6 mt-4 text-sm text-gray-600">
                                <span><span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-1"></span> Customers</span>
                                <span><span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span> Drivers</span>
                                <span><span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-1"></span> Cabs</span>
                            </div>
                        </div> 

                </div>
            </div>
        </div>
    );
}