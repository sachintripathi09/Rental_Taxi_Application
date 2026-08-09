// ============================================================
// DRIVER DASHBOARD – FINAL ULTIMATE
// Auto-refresh, manual refresh, full CRUD, WebSocket integration
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export default function DriverDashboard() {
    const navigate = useNavigate();
    const username = localStorage.getItem('username') || 'Guest';
    const [pendingBookings, setPendingBookings] = useState([]);
    const [activeBookings, setActiveBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentDriverId, setCurrentDriverId] = useState(null);
    const [earnings, setEarnings] = useState(0);
    const [rating, setRating] = useState(0);
    const stompClientRef = useRef(null);
    const refreshIntervalRef = useRef(null);

    const fetchDriverProfile = async () => {
        try {
            const res = await api.get('/drivers/me');
            if (res.data?.driverId) {
                setCurrentDriverId(res.data.driverId);
                console.log('✅ Driver ID:', res.data.driverId);
            }
        } catch (err) {
            console.error('Driver profile error:', err.response?.data || err.message);
            toast.error('Could not fetch driver identity.');
        }
    };

    const fetchPendingBookings = async () => {
        try {
            const res = await api.get('/bookings/status/PENDING');
            console.log('📋 PENDING bookings:', res.data);
            setPendingBookings(res.data);
        } catch (error) {
            console.error('Pending bookings error:', error.response?.data || error.message);
            toast.error('Could not fetch pending rides.');
        }
    };

    const fetchActiveBookings = async () => {
        try {
            const res = await api.get('/bookings/driver');
            const active = res.data.filter(b => b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS');
            setActiveBookings(active);
            console.log('🚗 ACTIVE bookings:', active);
        } catch (error) {
            console.error('Active bookings error:', error.response?.data || error.message);
            toast.error('Could not fetch your active rides.');
        }
    };

    const fetchEarnings = async () => {
        try {
            const res = await api.get('/drivers/me/earnings');
            setEarnings(res.data || 0);
        } catch (e) { console.error('Earnings error:', e); }
    };
    const fetchRating = async () => {
        try {
            const res = await api.get('/drivers/me/rating');
            setRating(res.data || 0);
        } catch (e) { console.error('Rating error:', e); }
    };

    const fetchAllData = async () => {
        setLoading(true);
        await Promise.all([
            fetchPendingBookings(),
            fetchActiveBookings(),
            fetchEarnings(),
            fetchRating()
        ]);
        setLoading(false);
    };

    useEffect(() => {
        if (!currentDriverId) return;

        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('🚗 Driver WebSocket connected');
                client.subscribe('/topic/new-booking', (message) => {
                    const newBooking = JSON.parse(message.body);
                    toast.info(`📢 New booking from ${newBooking.customerId}`);
                    fetchPendingBookings();
                });
                client.subscribe('/topic/booking', (message) => {
                    const update = JSON.parse(message.body);
                    if (update.driverId === currentDriverId) {
                        fetchAllData();
                    }
                });
                stompClientRef.current = client;
            },
            onStompError: (frame) => {
                console.error('Broker error:', frame.headers['message']);
            },
        });

        client.activate();

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, [currentDriverId]);

    useEffect(() => {
        fetchAllData();
        refreshIntervalRef.current = setInterval(() => {
            console.log('⏳ Auto‑refreshing bookings...');
            fetchAllData();
        }, 10000);
        return () => {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
            }
        };
    }, []);

    const handleAccept = async (bookingId) => {
        try {
            await api.put(`/bookings/${bookingId}/accept`);
            toast.success(`Booking #${bookingId} accepted!`);
            fetchAllData();
        } catch (error) {
            console.error('Accept error:', error.response?.data || error.message);
            toast.error('Failed to accept booking.');
        }
    };

    const handleReject = async (bookingId) => {
        const reason = window.prompt('Optional: Enter reason for rejection (or skip)');
        if (reason === null) return;
        try {
            await api.put(`/bookings/${bookingId}/reject`);
            toast.success(`Booking #${bookingId} rejected.`);
            fetchAllData();
        } catch (error) {
            console.error('Reject error:', error.response?.data || error.message);
            toast.error('Failed to reject booking.');
        }
    };

    const handleStartTrip = async (bookingId) => {
        try {
            await api.put(`/bookings/${bookingId}/start`);
            toast.success(`Trip #${bookingId} started!`);
            fetchAllData();
        } catch (error) {
            console.error('Start trip error:', error.response?.data || error.message);
            toast.error('Failed to start trip.');
        }
    };

    const handleComplete = async (bookingId) => {
        try {
            await api.put(`/bookings/${bookingId}/complete`);
            toast.success(`Trip #${bookingId} completed!`);
            fetchAllData();
        } catch (error) {
            console.error('Complete trip error:', error.response?.data || error.message);
            toast.error('Failed to complete trip.');
        }
    };

    const handleRefresh = () => {
        toast.info('🔄 Refreshing bookings...');
        fetchAllData();
    };

    const handleLogout = () => {
        if (stompClientRef.current) {
            stompClientRef.current.deactivate();
        }
        if (refreshIntervalRef.current) {
            clearInterval(refreshIntervalRef.current);
        }
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        toast.success('Logged out successfully');
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>

            <div className="relative z-10 max-w-4xl mx-auto space-y-6 animate-fade-in-up">
                <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl p-6 flex flex-wrap justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">🚗 Driver Dashboard</h1>
                        <p className="text-gray-600 mt-1 font-semibold">Welcome, {username}!</p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <button onClick={handleRefresh} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg shadow-md transition hover:shadow-lg text-sm">🔄 Refresh</button>
                        <div className="bg-green-100 px-4 py-2 rounded-full text-sm font-bold text-green-800 shadow-sm border border-green-200">₹ {earnings ? earnings.toFixed(2) : '0.00'}</div>
                        <div className="bg-yellow-100 px-4 py-2 rounded-full text-sm font-bold text-yellow-800 shadow-sm border border-yellow-200">⭐ {rating ? rating : '0'} / 5</div>
                        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition hover:shadow-lg">Logout</button>
                    </div>
                </div>

                <h2 className="text-xl font-bold text-gray-700 mb-4 ml-1">📋 Pending Ride Requests</h2>
                {loading ? (
                    <p className="text-gray-500">Loading bookings...</p>
                ) : pendingBookings.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-xl border border-white/40 p-8 rounded-2xl shadow-xl text-center text-gray-500 animate-fade-in-up">
                        🎉 No pending rides. Take a break!
                        <br /><span className="text-xs text-gray-400">(Auto‑refresh every 10s)</span>
                    </div>
                ) : (
                    pendingBookings.map((booking, index) => (
                        <div key={booking.bookingId} className="bg-white/90 backdrop-blur-sm border border-gray-100 p-5 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-center gap-4 transition-all hover:shadow-xl hover:scale-[1.01] animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">PENDING</span>
                                    <span>ID: #{booking.bookingId}</span>
                                </div>
                                <h3 className="font-bold text-gray-800 text-lg">📍 {booking.pickupLocation} → {booking.dropoffLocation}</h3>
                                <p className="text-sm text-gray-500 mt-1">Customer ID: {booking.customerId}</p>
                                <div className="flex gap-4 mt-1 text-xs text-gray-400">
                                    <span>Fare: {booking.fare && booking.fare > 0 ? `₹${booking.fare}` : 'TBD'}</span>
                                    <span>Distance: {booking.distance && booking.distance > 0 ? `${booking.distance} km` : 'N/A'}</span>
                                </div>
                            </div>
                            <div className="flex gap-3 w-full md:w-auto">
                                <button onClick={() => handleAccept(booking.bookingId)} className="flex-1 md:flex-none bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition hover:shadow-lg">Accept Ride</button>
                                <button onClick={() => handleReject(booking.bookingId)} className="flex-1 md:flex-none bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition hover:shadow-lg">Reject Ride</button>
                            </div>
                        </div>
                    ))
                )}

                <h2 className="text-xl font-bold text-gray-700 mb-4 ml-1 mt-8">🚗 Your Active Rides</h2>
                {loading ? (
                    <p className="text-gray-500">Loading active rides...</p>
                ) : activeBookings.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-xl border border-white/40 p-8 rounded-2xl shadow-xl text-center text-gray-500 animate-fade-in-up">🚫 No active rides.</div>
                ) : (
                    activeBookings.map((booking, index) => (
                        <div key={booking.bookingId} className="bg-white/90 backdrop-blur-sm border border-blue-100 p-5 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-center gap-4 transition-all hover:shadow-xl hover:scale-[1.01] animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${booking.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{booking.status}</span>
                                    <span>ID: #{booking.bookingId}</span>
                                </div>
                                <h3 className="font-bold text-gray-800 text-lg">📍 {booking.pickupLocation} → {booking.dropoffLocation}</h3>
                                <p className="text-sm text-gray-500 mt-1">Customer ID: {booking.customerId}</p>
                            </div>
                            <div className="flex gap-3 w-full md:w-auto">
                                {booking.status === 'ACCEPTED' && (
                                    <button onClick={() => handleStartTrip(booking.bookingId)} className="flex-1 md:flex-none bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition hover:shadow-lg">🟢 Start Trip</button>
                                )}
                                {booking.status === 'IN_PROGRESS' && (
                                    <button onClick={() => handleComplete(booking.bookingId)} className="flex-1 md:flex-none bg-purple-500 hover:bg-purple-600 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition hover:shadow-lg">✅ Complete Trip</button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}