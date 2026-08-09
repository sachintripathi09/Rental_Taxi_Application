import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Settings() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState({
        baseFare: 0,
        perKmRate: 0,
        platformCommission: 0
    });

    // 1. Fetch the settings from the backend when the page loads
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get('/api/settings');
                setSettings(response.data);
            } catch (error) {
                console.error("Failed to fetch settings", error);
                toast.error('Could not load system settings.');
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleLogout = () => { logout(); toast.success('Logged out'); navigate('/'); };
    const handleBack = () => navigate('/admin');

    // 2. Save the settings to the backend
        const handleSave = async (e) => {
        e.preventDefault();
        try {
            await api.put('/api/settings', settings);
            toast.success('System settings saved successfully!');
        } catch (error) {
            console.error("Failed to save settings", error);
            // Extract the exact error from the backend's response
            const message = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to save settings.';
            toast.error(`Error: ${message}`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            
            <div className="relative z-10 max-w-4xl mx-auto animate-fade-in-up">
                <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl p-6 mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">⚙️ System Settings</h1>
                        <p className="text-gray-600 mt-1 font-semibold">Configure global taxi system parameters.</p>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={handleBack} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md transition">← Dashboard</button>
                        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition">Logout</button>
                    </div>
                </div>

                {/* Show loading state */}
                {loading ? (
                    <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-lg p-8 text-center text-gray-500">
                        Loading system settings...
                    </div>
                ) : (
                    <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-lg p-8">
                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Base Booking Fare (₹)</label>
                                    <input 
                                        type="number" 
                                        required 
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                                        value={settings.baseFare} 
                                        onChange={(e) => setSettings({...settings, baseFare: parseFloat(e.target.value)})} 
                                    />
                                </div>
                                                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Base Booking Fare (₹)</label>
                                    <input 
                                        type="number" 
                                        required 
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                                        value={settings.baseFare} 
                                        onChange={(e) => setSettings({...settings, baseFare: Number(e.target.value) || 0})} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Per Kilometer Rate (₹)</label>
                                    <input 
                                        type="number" 
                                        required 
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                                        value={settings.perKmRate} 
                                        onChange={(e) => setSettings({...settings, perKmRate: Number(e.target.value) || 0})} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Platform Commission (%)</label>
                                    <input 
                                        type="number" 
                                        required 
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                                        value={settings.platformCommission} 
                                        onChange={(e) => setSettings({...settings, platformCommission: Number(e.target.value) || 0})} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Platform Commission (%)</label>
                                    <input 
                                        type="number" 
                                        required 
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                                        value={settings.platformCommission} 
                                        onChange={(e) => setSettings({...settings, platformCommission: parseFloat(e.target.value)})} 
                                    />
                                </div>
                            </div>
                            <button 
                                type="submit" 
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition"
                            >
                                Save Settings
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}