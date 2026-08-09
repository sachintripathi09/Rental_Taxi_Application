import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        customers: 0, drivers: 0, cabs: 0, bookings: 0, payments: 0, feedbacks: 0, admins: 0
    });
    const [customers, setCustomers] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [cabs, setCabs] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [payments, setPayments] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] = useState(null);

    useEffect(() => {
        if (activeTab) {
            localStorage.setItem('adminLastTab', activeTab);
        }
    }, [activeTab]);

    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [showDriverModal, setShowDriverModal] = useState(false);
    const [showCabModal, setShowCabModal] = useState(false);
    const [showAdminModal, setShowAdminModal] = useState(false);

    const [showEditCustomerModal, setShowEditCustomerModal] = useState(false);
    const [showEditDriverModal, setShowEditDriverModal] = useState(false);
    const [showEditCabModal, setShowEditCabModal] = useState(false);
    const [showEditBookingModal, setShowEditBookingModal] = useState(false);
    const [showEditPaymentModal, setShowEditPaymentModal] = useState(false);
    const [showEditFeedbackModal, setShowEditFeedbackModal] = useState(false);
    const [showEditAdminModal, setShowEditAdminModal] = useState(false);

    const [editingCustomer, setEditingCustomer] = useState(null);
    const [editingDriver, setEditingDriver] = useState(null);
    const [editingCab, setEditingCab] = useState(null);
    const [editingBooking, setEditingBooking] = useState(null);
    const [editingPayment, setEditingPayment] = useState(null);
    const [editingFeedback, setEditingFeedback] = useState(null);
    const [editingAdmin, setEditingAdmin] = useState(null);

    const [newCustomer, setNewCustomer] = useState({
        username: '', password: '', email: '', fullName: '', phone: '', address: ''
    });
    const [newDriver, setNewDriver] = useState({
        username: '', password: '', email: '', fullName: '', phone: '', licenseNumber: '', status: 'AVAILABLE'
    });
    const [newCab, setNewCab] = useState({
        plateNumber: '', model: '', capacity: 4, status: 'AVAILABLE'
    });
    const [newAdmin, setNewAdmin] = useState({
        username: '', password: '', email: '', fullName: '', phone: ''
    });

    // --- UPDATED fetchData with console.error in every catch block ---
    const fetchData = async () => {
        let cCount = 0, dCount = 0, cabCount = 0, bCount = 0, pCount = 0, fCount = 0, aCount = 0;
        let cList = [], dList = [], cabList = [], bList = [], pList = [], fList = [], aList = [];

        const config = { headers: { 'Cache-Control': 'no-cache' } };

        try { const res = await api.get('/customers', config); cCount = res.data.length; cList = res.data; } catch (e) { console.error("Error fetching customers:", e); }
        try { const res = await api.get('/drivers', config); dCount = res.data.length; dList = res.data; } catch (e) { console.error("Error fetching drivers:", e); }
        try { const res = await api.get('/cabs', config); cabCount = res.data.length; cabList = res.data; } catch (e) { console.error("Error fetching cabs:", e); }
        try { const res = await api.get('/bookings', config); bCount = res.data.length; bList = res.data; } catch (e) { console.error("Error fetching bookings:", e); }
        try { const res = await api.get('/payments', config); pCount = res.data.length; pList = res.data; } catch (e) { console.error("Error fetching payments:", e); }
        try { const res = await api.get('/feedbacks', config); fCount = res.data.length; fList = res.data; } catch (e) { console.error("Error fetching feedbacks:", e); }
        try { const res = await api.get('/admins', config); aCount = res.data.length; aList = res.data; } catch (e) { console.error("Error fetching admins:", e); }

        setStats({
            customers: cCount, drivers: dCount, cabs: cabCount,
            bookings: bCount, payments: pCount, feedbacks: fCount, admins: aCount
        });
        setCustomers(cList); setDrivers(dList); setCabs(cabList);
        setBookings(bList); setPayments(pList); setFeedbacks(fList); setAdmins(aList);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/');
    };

    const handleDeleteCustomer = async (id) => {
        if (!window.confirm(`Delete Customer #${id}?`)) return;
        try { await api.delete(`/customers/${id}`); toast.success('Deleted'); fetchData(); } catch (e) { console.error(e); toast.error('Failed'); }
    };

    // --- UPDATED handleDeleteDriver with detailed error catching ---
    const handleDeleteDriver = async (id) => {
        if (!window.confirm(`Delete Driver #${id}?`)) return;
        try { 
            await api.delete(`/drivers/${id}`); 
            toast.success('Deleted'); 
            fetchData(); 
        } catch (e) { 
            console.error("Delete Driver Error:", e);
            const msg = e.response?.data?.error || e.message || 'Failed';
            toast.error(`Error: ${msg}`);
        }
    };

    const handleDeleteCab = async (id) => {
        if (!window.confirm(`Delete Cab #${id}?`)) return;
        try { await api.delete(`/cabs/${id}`); toast.success('Deleted'); fetchData(); } catch (e) { console.error(e); toast.error('Failed'); }
    };
    const handleDeleteBooking = async (id) => {
        if (!window.confirm(`Delete Booking #${id}?`)) return;
        try { await api.delete(`/bookings/${id}`); toast.success('Deleted'); fetchData(); } catch (e) { console.error(e); toast.error('Failed'); }
    };
    const handleDeleteFeedback = async (id) => {
        if (!window.confirm(`Delete Feedback #${id}?`)) return;
        try { await api.delete(`/feedbacks/${id}`); toast.success('Deleted'); fetchData(); } catch (e) { console.error(e); toast.error('Failed'); }
    };
    const handleDeleteAdmin = async (id) => {
        if (!window.confirm(`Delete Admin #${id}?`)) return;
        try { await api.delete(`/admins/${id}`); toast.success('Admin deleted.'); fetchData(); } catch (e) { console.error(e); toast.error('Failed to delete admin.'); }
    };

    const handleAddCustomer = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register/customer', newCustomer);
            toast.success('Customer registered!');
            setShowCustomerModal(false);
            setNewCustomer({ username: '', password: '', email: '', fullName: '', phone: '', address: '' });
            fetchData();
        } catch (err) { console.error(err); toast.error('Failed to add customer.'); }
    };
    const handleAddDriver = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register/driver', newDriver);
            toast.success('Driver registered!');
            setShowDriverModal(false);
            setNewDriver({ username: '', password: '', email: '', fullName: '', phone: '', licenseNumber: '', status: 'AVAILABLE' });
            fetchData();
        } catch (err) { console.error(err); toast.error('Failed to add driver.'); }
    };
    const handleAddCab = async (e) => {
        e.preventDefault();
        try {
            await api.post('/cabs', newCab);
            toast.success('Cab created!');
            setShowCabModal(false);
            setNewCab({ plateNumber: '', model: '', capacity: 4, status: 'AVAILABLE' });
            fetchData();
        } catch (err) { console.error(err); toast.error('Failed to create cab.'); }
    };
    const handleAddAdmin = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register/admin', newAdmin);
            toast.success('Admin registered!');
            setShowAdminModal(false);
            setNewAdmin({ username: '', password: '', email: '', fullName: '', phone: '' });
            fetchData();
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || 'Failed to add admin.';
            toast.error(`Error: ${msg}`);
        }
    };

    const handleUpdateCustomer = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/customers/${editingCustomer.customerId}`, editingCustomer);
            toast.success('Customer updated!');
            setShowEditCustomerModal(false);
            setEditingCustomer(null);
            const updated = response.data;
            setCustomers((prev) => prev.map((c) => c.customerId === updated.customerId ? updated : c));
            fetchData();
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.error || err.message || 'Failed to update customer.';
            toast.error(`Error: ${msg}`);
        }
    };
    const handleUpdateDriver = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/drivers/${editingDriver.driverId}`, editingDriver);
            toast.success('Driver updated!');
            setShowEditDriverModal(false);
            setEditingDriver(null);
            const updated = response.data;
            setDrivers((prev) => prev.map((d) => d.driverId === updated.driverId ? updated : d));
            fetchData();
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.error || err.message || 'Failed to update driver.';
            toast.error(`Error: ${msg}`);
        }
    };
    const handleUpdateCab = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/cabs/${editingCab.cabId}`, editingCab);
            toast.success('Cab updated successfully!');
            setShowEditCabModal(false);
            setEditingCab(null);
            const updated = response.data;
            setCabs((prev) => prev.map((cab) => cab.cabId === updated.cabId ? updated : cab));
            fetchData();
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.error || err.message || 'Failed to update cab.';
            toast.error(`Error: ${msg}`);
        }
    };
    const handleUpdateBooking = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/bookings/${editingBooking.bookingId}`, editingBooking);
            toast.success('Booking updated!');
            setShowEditBookingModal(false);
            setEditingBooking(null);
            const updated = response.data;
            setBookings((prev) => prev.map((b) => b.bookingId === updated.bookingId ? updated : b));
            fetchData();
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.error || err.message || 'Failed to update booking.';
            toast.error(`Error: ${msg}`);
        }
    };
    const handleUpdatePayment = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/payments/${editingPayment.paymentId}`, editingPayment);
            toast.success('Payment updated!');
            setShowEditPaymentModal(false);
            setEditingPayment(null);
            const updated = response.data;
            setPayments((prev) => prev.map((p) => p.paymentId === updated.paymentId ? updated : p));
            fetchData();
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.error || err.message || 'Failed to update payment.';
            toast.error(`Error: ${msg}`);
        }
    };
    const handleUpdateFeedback = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/feedbacks/${editingFeedback.feedbackId}`, editingFeedback);
            toast.success('Feedback updated!');
            setShowEditFeedbackModal(false);
            setEditingFeedback(null);
            const updated = response.data;
            setFeedbacks((prev) => prev.map((f) => f.feedbackId === updated.feedbackId ? updated : f));
            fetchData();
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.error || err.message || 'Failed to update feedback.';
            toast.error(`Error: ${msg}`);
        }
    };
    const handleUpdateAdmin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/admins/${editingAdmin.adminId}`, editingAdmin);
            toast.success('Admin updated!');
            setShowEditAdminModal(false);
            setEditingAdmin(null);
            const updated = response.data;
            setAdmins((prev) => prev.map((a) => a.adminId === updated.adminId ? updated : a));
            fetchData();
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.error || err.message || 'Failed to update admin.';
            toast.error(`Error: ${msg}`);
        }
    };

    const handleRefundPayment = async (id) => {
        if (!window.confirm(`Refund Payment #${id}?`)) return;
        try { await api.put(`/payments/${id}/refund`); toast.success('Refunded'); fetchData(); } catch (e) { console.error(e); toast.error('Failed'); }
    };

    // --- BUTTON CONFIGURATION WITH EXPLICIT SOLID COLORS ---
    // Hardcoded to ensure Vite compiles the correct Tailwind classes every time.
    const buttons = [
        { id: 'customers', label: 'View Customers', icon: '👥', bg: 'bg-blue-800', bgHover: 'bg-blue-900', text: 'text-white' },
        { id: 'drivers', label: 'View Drivers', icon: '🧑‍✈️', bg: 'bg-green-600', bgHover: 'bg-green-700', text: 'text-white' },
        { id: 'cabs', label: 'View Cabs', icon: '🚕', bg: 'bg-yellow-400', bgHover: 'bg-yellow-500', text: 'text-black' },
        { id: 'bookings', label: 'View Bookings', icon: '📋', bg: 'bg-orange-500', bgHover: 'bg-orange-600', text: 'text-white' },
        { id: 'payments', label: 'View Payments', icon: '💳', bg: 'bg-pink-400', bgHover: 'bg-pink-500', text: 'text-white' },
        { id: 'feedbacks', label: 'View Feedbacks', icon: '💬', bg: 'bg-red-500', bgHover: 'bg-red-600', text: 'text-white' },
        { id: 'admins', label: 'View Admins', icon: '👤', bg: 'bg-blue-600', bgHover: 'bg-blue-700', text: 'text-white' },
        { id: 'reports', label: 'View Reports', icon: '📊', bg: 'bg-fuchsia-500', bgHover: 'bg-fuchsia-600', text: 'text-white', isAction: true },
        { id: 'settings', label: 'Settings', icon: '⚙️', bg: 'bg-gray-600', bgHover: 'bg-gray-700', text: 'text-white', isAction: true },
    ];

    const handleTabClick = (id) => {
        if (id === 'reports') { navigate('/admin/reports'); return; }
        if (id === 'settings') { navigate('/admin/settings'); return; }
        setActiveTab(id);
    };

    // --- RENDER UI ---
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>

            <div className="relative z-10 space-y-8 animate-fade-in-up max-w-7xl mx-auto">
                
                {/* --- HEADER (LOGOUT ONLY) --- */}
                <div className="bg-white/80 backdrop-blur-xl border border-black rounded-2xl shadow-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">🚖 Admin Dashboard</h1>
                        <p className="text-gray-600 mt-1 font-semibold">Manage your fleet, customers, and drivers.</p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap justify-center">
                        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow-md transition">Logout</button>
                    </div>
                </div>

                {/* --- 9 SOLID-COLORED BUTTONS IN A STRICT SINGLE ROW --- */}
                {/* flex-nowrap forces a single line. overflow-x-auto adds scrolling if screen is too small. */}
                <div className="bg-white/80 backdrop-blur-xl border border-black rounded-2xl shadow-xl p-4 flex flex-nowrap overflow-x-auto gap-2 items-center">
                    {buttons.map((btn) => (
                        <button
                            key={btn.id}
                            onClick={() => handleTabClick(btn.id)}
                            className={`flex-shrink-0 px-3 py-2 rounded-xl font-medium transition-all duration-200 shadow-sm flex items-center gap-2 capitalize border border-black ${
                                activeTab === btn.id && !btn.isAction
                                    ? `${btn.bgHover} ${btn.text} scale-105`
                                    : `${btn.bg} ${btn.text} hover:${btn.bgHover}`
                            }`}
                        >
                            <span>{btn.icon}</span>
                            <span>{btn.label}</span>
                        </button>
                    ))}
                </div>

                {/* --- DYNAMIC TAB CONTENT AREA WITH BLACK BORDER CARD --- */}
                <div className="bg-white/80 backdrop-blur-xl border border-black rounded-2xl shadow-lg p-6 mb-6 animate-fade-in-up w-full">
                    {activeTab === null ? (
                        <div className="text-center text-gray-500 py-10">
                            <div className="text-6xl mb-4">👋</div>
                            <h3 className="text-2xl font-bold text-gray-700">Welcome, Admin!</h3>
                            <p className="text-gray-400 mt-2">Select one of the colorful management buttons above to view and manage data.</p>
                        </div>
                    ) : (
                        // --- TAB 1: CUSTOMERS ---
                        activeTab === 'customers' && (
                            <div className="w-full">
                                <div className="flex justify-between items-center mb-4 w-full">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">View Customers</h2>
                                        <p className="text-gray-500 text-sm">Total Customers: <span className="font-bold text-blue-800">{loading ? '...' : stats.customers}</span></p>
                                    </div>
                                    <button onClick={() => setShowCustomerModal(true)} className="bg-blue-800 hover:bg-blue-900 text-white font-bold px-4 py-2 rounded-lg transition shadow-sm border border-black">+ Add Customer</button>
                                </div>
                                <div className="overflow-x-auto w-full">
                                    <table className="w-full text-left text-sm text-gray-600 border-collapse border border-black">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border border-black">
                                            <tr><th className="px-4 py-3 border border-black">ID</th><th className="px-4 py-3 border border-black">Username</th><th className="px-4 py-3 border border-black">Email</th><th className="px-4 py-3 border border-black">Full Name</th><th className="px-4 py-3 border border-black">Phone</th><th className="px-4 py-3 border border-black text-center">Actions</th></tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 border border-black">
                                            {loading ? <tr><td colSpan="6" className="px-4 py-4 text-center text-gray-400 border border-black">Loading...</td></tr>
                                            : customers.length === 0 ? <tr><td colSpan="6" className="px-4 py-4 text-center text-gray-400 border border-black">No customers registered yet.</td></tr>
                                            : customers.map((c) => (
                                                <tr key={c.customerId} className="hover:bg-gray-50 transition border border-black">
                                                    <td className="px-4 py-4 font-medium text-gray-800 border border-black">#{c.customerId}</td>
                                                    <td className="px-4 py-4 border border-black">{c.username}</td>
                                                    <td className="px-4 py-4 border border-black">{c.email}</td>
                                                    <td className="px-4 py-4 border border-black">{c.fullName}</td>
                                                    <td className="px-4 py-4 border border-black">{c.phone}</td>
                                                    <td className="px-4 py-4 text-center flex justify-center gap-3 border border-black">
                                                        <button onClick={() => { setEditingCustomer(c); setShowEditCustomerModal(true); }} className="text-blue-600 hover:text-blue-800 font-medium text-xs transition">Edit</button>
                                                        <button onClick={() => handleDeleteCustomer(c.customerId)} className="text-red-500 hover:text-red-700 font-medium text-xs transition">Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )
                    )}

                    {activeTab === 'drivers' && (
                        <div className="w-full">
                            <div className="flex justify-between items-center mb-4 w-full">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">View Drivers</h2>
                                    <p className="text-gray-500 text-sm">Total Drivers: <span className="font-bold text-green-600">{loading ? '...' : stats.drivers}</span></p>
                                </div>
                                <button onClick={() => setShowDriverModal(true)} className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg transition shadow-sm border border-black">+ Add Driver</button>
                            </div>
                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-left text-sm text-gray-600 border-collapse border border-black">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border border-black">
                                        <tr><th className="px-4 py-3 border border-black">ID</th><th className="px-4 py-3 border border-black">Username</th><th className="px-4 py-3 border border-black">Full Name</th><th className="px-4 py-3 border border-black">License No.</th><th className="px-4 py-3 border border-black">Status</th><th className="px-4 py-3 border border-black text-center">Actions</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 border border-black">
                                        {loading ? <tr><td colSpan="6" className="px-4 py-4 text-center text-gray-400 border border-black">Loading...</td></tr>
                                        : drivers.length === 0 ? <tr><td colSpan="6" className="px-4 py-4 text-center text-gray-400 border border-black">No drivers registered yet.</td></tr>
                                        : drivers.map((d) => (
                                            <tr key={d.driverId} className="hover:bg-gray-50 transition border border-black">
                                                <td className="px-4 py-4 font-medium text-gray-800 border border-black">#{d.driverId}</td>
                                                <td className="px-4 py-4 border border-black">{d.username}</td>
                                                <td className="px-4 py-4 border border-black">{d.fullName}</td>
                                                <td className="px-4 py-4 border border-black">{d.licenseNumber}</td>
                                                <td className="px-4 py-4 border border-black">
                                                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${d.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : d.status === 'ON_TRIP' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{d.status}</span>
                                                </td>
                                                <td className="px-4 py-4 text-center flex justify-center gap-3 border border-black">
                                                    <button onClick={() => { setEditingDriver(d); setShowEditDriverModal(true); }} className="text-blue-600 hover:text-blue-800 font-medium text-xs transition">Edit</button>
                                                    <button onClick={() => handleDeleteDriver(d.driverId)} className="text-red-500 hover:text-red-700 font-medium text-xs transition">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'cabs' && (
                        <div className="w-full">
                            <div className="flex justify-between items-center mb-4 w-full">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">View Cabs</h2>
                                    <p className="text-gray-500 text-sm">Active Cabs: <span className="font-bold text-yellow-600">{loading ? '...' : stats.cabs}</span></p>
                                </div>
                                <button onClick={() => setShowCabModal(true)} className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-2 rounded-lg transition shadow-sm border border-black">+ Add Cab</button>
                            </div>
                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-left text-sm text-gray-600 border-collapse border border-black">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border border-black">
                                        <tr><th className="px-4 py-3 border border-black">ID</th><th className="px-4 py-3 border border-black">Plate Number</th><th className="px-4 py-3 border border-black">Model</th><th className="px-4 py-3 border border-black">Status</th><th className="px-4 py-3 border border-black text-center">Actions</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 border border-black">
                                        {loading ? <tr><td colSpan="5" className="px-4 py-4 text-center text-gray-400 border border-black">Loading...</td></tr>
                                        : cabs.length === 0 ? <tr><td colSpan="5" className="px-4 py-4 text-center text-gray-400 border border-black">No cabs registered yet.</td></tr>
                                        : cabs.map((cab) => (
                                            <tr key={cab.cabId} className="hover:bg-gray-50 transition border border-black">
                                                <td className="px-4 py-4 font-medium text-gray-800 border border-black">#{cab.cabId}</td>
                                                <td className="px-4 py-4 border border-black">{cab.plateNumber}</td>
                                                <td className="px-4 py-4 border border-black">{cab.model}</td>
                                                <td className="px-4 py-4 border border-black">
                                                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${cab.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : cab.status === 'BOOKED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{cab.status}</span>
                                                </td>
                                                <td className="px-4 py-4 text-center flex justify-center gap-3 border border-black">
                                                    <button onClick={() => { setEditingCab(cab); setShowEditCabModal(true); }} className="text-blue-600 hover:text-blue-800 font-medium text-xs transition">Edit</button>
                                                    <button onClick={() => handleDeleteCab(cab.cabId)} className="text-red-500 hover:text-red-700 font-medium text-xs transition">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'bookings' && (
                        <div className="w-full">
                            <div className="flex justify-between items-center mb-4 w-full">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">View Bookings</h2>
                                    <p className="text-gray-500 text-sm">Total Bookings: <span className="font-bold text-orange-600">{loading ? '...' : stats.bookings}</span></p>
                                </div>
                            </div>
                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-left text-sm text-gray-600 border-collapse border border-black">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border border-black">
                                        <tr><th className="px-4 py-3 border border-black">ID</th><th className="px-4 py-3 border border-black">Customer</th><th className="px-4 py-3 border border-black">Driver</th><th className="px-4 py-3 border border-black">Pickup</th><th className="px-4 py-3 border border-black">Drop-off</th><th className="px-4 py-3 border border-black">Status</th><th className="px-4 py-3 border border-black">Fare</th><th className="px-4 py-3 border border-black">Time</th><th className="px-4 py-3 border border-black text-center">Actions</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 border border-black">
                                        {loading ? <tr><td colSpan="9" className="px-4 py-4 text-center text-gray-400 border border-black">Loading...</td></tr>
                                        : bookings.length === 0 ? <tr><td colSpan="9" className="px-4 py-4 text-center text-gray-400 border border-black">No bookings found.</td></tr>
                                        : bookings.map((b) => (
                                            <tr key={b.bookingId} className="hover:bg-gray-50 transition border border-black">
                                                <td className="px-4 py-4 font-medium text-gray-800 border border-black">#{b.bookingId}</td>
                                                <td className="px-4 py-4 border border-black">{b.customerId}</td>
                                                <td className="px-4 py-4 border border-black">{b.driverId || 'N/A'}</td>
                                                <td className="px-4 py-4 border border-black">{b.pickupLocation}</td>
                                                <td className="px-4 py-4 border border-black">{b.dropoffLocation}</td>
                                                <td className="px-4 py-4 border border-black">
                                                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${b.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : b.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-700' : b.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{b.status}</span>
                                                </td>
                                                <td className="px-4 py-4 border border-black">₹{b.fare}</td>
                                                <td className="px-4 py-4 border border-black">{b.bookingTime ? new Date(b.bookingTime).toLocaleString() : 'N/A'}</td>
                                                <td className="px-4 py-4 text-center flex justify-center gap-3 border border-black">
                                                    <button onClick={() => { setEditingBooking(b); setShowEditBookingModal(true); }} className="text-blue-600 hover:text-blue-800 font-medium text-xs transition">Edit</button>
                                                    <button onClick={() => handleDeleteBooking(b.bookingId)} className="text-red-500 hover:text-red-700 font-medium text-xs transition">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'payments' && (
                        <div className="w-full">
                            <div className="flex justify-between items-center mb-4 w-full">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">View Payments</h2>
                                    <p className="text-gray-500 text-sm">Total Payments: <span className="font-bold text-pink-400">{loading ? '...' : stats.payments}</span></p>
                                </div>
                            </div>
                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-left text-sm text-gray-600 border-collapse border border-black">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border border-black">
                                        <tr><th className="px-4 py-3 border border-black">ID</th><th className="px-4 py-3 border border-black">Booking ID</th><th className="px-4 py-3 border border-black">Amount</th><th className="px-4 py-3 border border-black">Method</th><th className="px-4 py-3 border border-black">Status</th><th className="px-4 py-3 border border-black">Date</th><th className="px-4 py-3 border border-black text-center">Actions</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 border border-black">
                                        {loading ? <tr><td colSpan="7" className="px-4 py-4 text-center text-gray-400 border border-black">Loading...</td></tr>
                                        : payments.length === 0 ? <tr><td colSpan="7" className="px-4 py-4 text-center text-gray-400 border border-black">No payments found.</td></tr>
                                        : payments.map((p) => (
                                            <tr key={p.paymentId} className="hover:bg-gray-50 transition border border-black">
                                                <td className="px-4 py-4 font-medium text-gray-800 border border-black">#{p.paymentId}</td>
                                                <td className="px-4 py-4 border border-black">{p.bookingId}</td>
                                                <td className="px-4 py-4 border border-black">₹{p.amount}</td>
                                                <td className="px-4 py-4 border border-black">{p.method}</td>
                                                <td className="px-4 py-4 border border-black">
                                                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${p.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : p.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{p.status}</span>
                                                </td>
                                                <td className="px-4 py-4 border border-black">{p.paymentDate ? new Date(p.paymentDate).toLocaleString() : 'N/A'}</td>
                                                <td className="px-4 py-4 text-center flex justify-center gap-3 border border-black">
                                                    <button onClick={() => { setEditingPayment(p); setShowEditPaymentModal(true); }} className="text-blue-600 hover:text-blue-800 font-medium text-xs transition">Edit</button>
                                                    <button onClick={() => handleRefundPayment(p.paymentId)} className="text-orange-600 hover:text-orange-800 font-medium text-xs transition">Refund</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'feedbacks' && (
                        <div className="w-full">
                            <div className="flex justify-between items-center mb-4 w-full">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">View Feedbacks</h2>
                                    <p className="text-gray-500 text-sm">Total Feedbacks: <span className="font-bold text-red-600">{loading ? '...' : stats.feedbacks}</span></p>
                                </div>
                            </div>
                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-left text-sm text-gray-600 border-collapse border border-black">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border border-black">
                                        <tr><th className="px-4 py-3 border border-black">ID</th><th className="px-4 py-3 border border-black">Booking ID</th><th className="px-4 py-3 border border-black">Rating</th><th className="px-4 py-3 border border-black">Comment</th><th className="px-4 py-3 border border-black">Date</th><th className="px-4 py-3 border border-black text-center">Actions</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 border border-black">
                                        {loading ? <tr><td colSpan="6" className="px-4 py-4 text-center text-gray-400 border border-black">Loading...</td></tr>
                                        : feedbacks.length === 0 ? <tr><td colSpan="6" className="px-4 py-4 text-center text-gray-400 border border-black">No feedbacks found.</td></tr>
                                        : feedbacks.map((f) => (
                                            <tr key={f.feedbackId} className="hover:bg-gray-50 transition border border-black">
                                                <td className="px-4 py-4 font-medium text-gray-800 border border-black">#{f.feedbackId}</td>
                                                <td className="px-4 py-4 border border-black">{f.bookingId}</td>
                                                <td className="px-4 py-4 border border-black">
                                                    <div className="flex text-yellow-500">
                                                        {[...Array(5)].map((_, i) => (
                                                            <span key={i}>{i < f.rating ? '★' : '☆'}</span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 border border-black max-w-xs truncate">{f.comment}</td>
                                                <td className="px-4 py-4 border border-black">{f.feedbackDate ? new Date(f.feedbackDate).toLocaleString() : 'N/A'}</td>
                                                <td className="px-4 py-4 text-center flex justify-center gap-3 border border-black">
                                                    <button onClick={() => { setEditingFeedback(f); setShowEditFeedbackModal(true); }} className="text-blue-600 hover:text-blue-800 font-medium text-xs transition">Edit</button>
                                                    <button onClick={() => handleDeleteFeedback(f.feedbackId)} className="text-red-500 hover:text-red-700 font-medium text-xs transition">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'admins' && (
                        <div className="w-full">
                            <div className="flex justify-between items-center mb-4 w-full">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">View Admins</h2>
                                    <p className="text-gray-500 text-sm">Total Admins: <span className="font-bold text-blue-600">{loading ? '...' : stats.admins}</span></p>
                                </div>
                                <button onClick={() => setShowAdminModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg transition shadow-sm border border-black">+ Add Admin</button>
                            </div>
                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-left text-sm text-gray-600 border-collapse border border-black">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border border-black">
                                        <tr><th className="px-4 py-3 border border-black">ID</th><th className="px-4 py-3 border border-black">Username</th><th className="px-4 py-3 border border-black">Email</th><th className="px-4 py-3 border border-black">Full Name</th><th className="px-4 py-3 border border-black">Phone</th><th className="px-4 py-3 border border-black text-center">Actions</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 border border-black">
                                        {loading ? <tr><td colSpan="6" className="px-4 py-4 text-center text-gray-400 border border-black">Loading admins...</td></tr>
                                        : admins.length === 0 ? <tr><td colSpan="6" className="px-4 py-4 text-center text-gray-400 border border-black">No admins found.</td></tr>
                                        : admins.map((a) => (
                                            <tr key={a.adminId} className="hover:bg-gray-50 transition border border-black">
                                                <td className="px-4 py-4 font-medium text-gray-800 border border-black">#{a.adminId}</td>
                                                <td className="px-4 py-4 border border-black">{a.username}</td>
                                                <td className="px-4 py-4 border border-black">{a.email}</td>
                                                <td className="px-4 py-4 border border-black">{a.fullName}</td>
                                                <td className="px-4 py-4 border border-black">{a.phone}</td>
                                                <td className="px-4 py-4 text-center flex justify-center gap-3 border border-black">
                                                    <button onClick={() => { setEditingAdmin(a); setShowEditAdminModal(true); }} className="text-blue-600 hover:text-blue-800 font-medium text-xs transition">Edit</button>
                                                    <button onClick={() => handleDeleteAdmin(a.adminId)} className="text-red-500 hover:text-red-700 font-medium text-xs transition">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* --- ALL CREATE MODALS --- */}
                {showCustomerModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
                            <button onClick={() => setShowCustomerModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl transition">×</button>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Register New Customer</h3>
                            <form onSubmit={handleAddCustomer} className="space-y-3">
                                <input type="text" required placeholder="Username" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={newCustomer.username} onChange={(e) => setNewCustomer({...newCustomer, username: e.target.value})} />
                                <input type="password" required placeholder="Password" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={newCustomer.password} onChange={(e) => setNewCustomer({...newCustomer, password: e.target.value})} />
                                <input type="email" required placeholder="Email" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={newCustomer.email} onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})} />
                                <input type="text" required placeholder="Full Name" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={newCustomer.fullName} onChange={(e) => setNewCustomer({...newCustomer, fullName: e.target.value})} />
                                <input type="text" required placeholder="Phone" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={newCustomer.phone} onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})} />
                                <input type="text" required placeholder="Address" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={newCustomer.address} onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})} />
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition mt-2">Register Customer</button>
                            </form>
                        </div>
                    </div>
                )}

                {showDriverModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
                            <button onClick={() => setShowDriverModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl transition">×</button>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Register New Driver</h3>
                            <form onSubmit={handleAddDriver} className="space-y-3">
                                <input type="text" required placeholder="Username" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={newDriver.username} onChange={(e) => setNewDriver({...newDriver, username: e.target.value})} />
                                <input type="password" required placeholder="Password" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={newDriver.password} onChange={(e) => setNewDriver({...newDriver, password: e.target.value})} />
                                <input type="email" required placeholder="Email" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={newDriver.email} onChange={(e) => setNewDriver({...newDriver, email: e.target.value})} />
                                <input type="text" required placeholder="Full Name" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={newDriver.fullName} onChange={(e) => setNewDriver({...newDriver, fullName: e.target.value})} />
                                <input type="text" required placeholder="Phone" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={newDriver.phone} onChange={(e) => setNewDriver({...newDriver, phone: e.target.value})} />
                                <input type="text" required placeholder="License Number" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={newDriver.licenseNumber} onChange={(e) => setNewDriver({...newDriver, licenseNumber: e.target.value})} />
                                <select className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={newDriver.status} onChange={(e) => setNewDriver({...newDriver, status: e.target.value})}>
                                    <option value="AVAILABLE">AVAILABLE</option>
                                    <option value="ON_TRIP">ON_TRIP</option>
                                    <option value="OFFLINE">OFFLINE</option>
                                </select>
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition mt-2">Register Driver</button>
                            </form>
                        </div>
                    </div>
                )}

                {showCabModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
                            <button onClick={() => setShowCabModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl transition">×</button>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Add New Cab</h3>
                            <form onSubmit={handleAddCab} className="space-y-3">
                                <input type="text" required placeholder="Plate Number" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={newCab.plateNumber} onChange={(e) => setNewCab({...newCab, plateNumber: e.target.value})} />
                                <input type="text" required placeholder="Model" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={newCab.model} onChange={(e) => setNewCab({...newCab, model: e.target.value})} />
                                <input type="number" required min="1" placeholder="Capacity" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={newCab.capacity} onChange={(e) => setNewCab({...newCab, capacity: parseInt(e.target.value)})} />
                                <select className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={newCab.status} onChange={(e) => setNewCab({...newCab, status: e.target.value})}>
                                    <option value="AVAILABLE">AVAILABLE</option>
                                    <option value="BOOKED">BOOKED</option>
                                    <option value="MAINTENANCE">MAINTENANCE</option>
                                </select>
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition mt-2">Create Cab</button>
                            </form>
                        </div>
                    </div>
                )}

                {showAdminModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
                            <button onClick={() => setShowAdminModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl transition">×</button>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Register New Admin</h3>
                            <form onSubmit={handleAddAdmin} className="space-y-3">
                                <input type="text" required placeholder="Username" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={newAdmin.username} onChange={(e) => setNewAdmin({...newAdmin, username: e.target.value})} />
                                <input type="password" required placeholder="Password" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={newAdmin.password} onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})} />
                                <input type="email" required placeholder="Email" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={newAdmin.email} onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})} />
                                <input type="text" required placeholder="Full Name" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={newAdmin.fullName} onChange={(e) => setNewAdmin({...newAdmin, fullName: e.target.value})} />
                                <input type="text" required placeholder="Phone" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={newAdmin.phone} onChange={(e) => setNewAdmin({...newAdmin, phone: e.target.value})} />
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition mt-2">Register Admin</button>
                            </form>
                        </div>
                    </div>
                )}

                {/* --- ALL 7 EDIT MODALS --- */}
                {showEditCustomerModal && editingCustomer && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
                            <button onClick={() => setShowEditCustomerModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl transition">×</button>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Edit Customer</h3>
                            <form onSubmit={handleUpdateCustomer} className="space-y-3">
                                <label className="text-sm font-semibold text-gray-600">Email</label>
                                <input type="email" required className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={editingCustomer.email} onChange={(e) => setEditingCustomer({...editingCustomer, email: e.target.value})} />
                                <label className="text-sm font-semibold text-gray-600">Full Name</label>
                                <input type="text" required className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={editingCustomer.fullName} onChange={(e) => setEditingCustomer({...editingCustomer, fullName: e.target.value})} />
                                <label className="text-sm font-semibold text-gray-600">Phone</label>
                                <input type="text" required className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={editingCustomer.phone} onChange={(e) => setEditingCustomer({...editingCustomer, phone: e.target.value})} />
                                <label className="text-sm font-semibold text-gray-600">Address</label>
                                <input type="text" required className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={editingCustomer.address} onChange={(e) => setEditingCustomer({...editingCustomer, address: e.target.value})} />
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition mt-2">Update Customer</button>
                            </form>
                        </div>
                    </div>
                )}

                {showEditDriverModal && editingDriver && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
                            <button onClick={() => setShowEditDriverModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl transition">×</button>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Edit Driver</h3>
                            <form onSubmit={handleUpdateDriver} className="space-y-3">
                                <label className="text-sm font-semibold text-gray-600">Email</label>
                                <input type="email" required className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={editingDriver.email} onChange={(e) => setEditingDriver({...editingDriver, email: e.target.value})} />
                                <label className="text-sm font-semibold text-gray-600">Full Name</label>
                                <input type="text" required className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={editingDriver.fullName} onChange={(e) => setEditingDriver({...editingDriver, fullName: e.target.value})} />
                                <label className="text-sm font-semibold text-gray-600">Phone</label>
                                <input type="text" required className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={editingDriver.phone} onChange={(e) => setEditingDriver({...editingDriver, phone: e.target.value})} />
                                <label className="text-sm font-semibold text-gray-600">License Number</label>
                                <input type="text" required className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={editingDriver.licenseNumber} onChange={(e) => setEditingDriver({...editingDriver, licenseNumber: e.target.value})} />
                                <label className="text-sm font-semibold text-gray-600">Status</label>
                                <select className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={editingDriver.status} onChange={(e) => setEditingDriver({...editingDriver, status: e.target.value})}>
                                    <option value="AVAILABLE">AVAILABLE</option>
                                    <option value="ON_TRIP">ON_TRIP</option>
                                    <option value="OFFLINE">OFFLINE</option>
                                </select>
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition mt-2">Update Driver</button>
                            </form>
                        </div>
                    </div>
                )}

                {showEditCabModal && editingCab && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
                            <button onClick={() => setShowEditCabModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl transition">×</button>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Edit Cab</h3>
                            <form onSubmit={handleUpdateCab} className="space-y-3">
                                <label className="text-sm font-semibold text-gray-600">Plate Number</label>
                                <input type="text" required className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={editingCab.plateNumber} onChange={(e) => setEditingCab({...editingCab, plateNumber: e.target.value})} />
                                <label className="text-sm font-semibold text-gray-600">Model</label>
                                <input type="text" required className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={editingCab.model} onChange={(e) => setEditingCab({...editingCab, model: e.target.value})} />
                                <label className="text-sm font-semibold text-gray-600">Capacity</label>
                                <input type="number" required min="1" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={editingCab.capacity} onChange={(e) => setEditingCab({...editingCab, capacity: parseInt(e.target.value)})} />
                                <label className="text-sm font-semibold text-gray-600">Status</label>
                                <select className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={editingCab.status} onChange={(e) => setEditingCab({...editingCab, status: e.target.value})}>
                                    <option value="AVAILABLE">AVAILABLE</option>
                                    <option value="BOOKED">BOOKED</option>
                                    <option value="MAINTENANCE">MAINTENANCE</option>
                                </select>
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition mt-2">Update Cab</button>
                            </form>
                        </div>
                    </div>
                )}

                {showEditBookingModal && editingBooking && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
                            <button onClick={() => setShowEditBookingModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl transition">×</button>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Edit Booking #{editingBooking.bookingId}</h3>
                            <form onSubmit={handleUpdateBooking} className="space-y-3">
                                <label className="text-sm font-semibold text-gray-600">Status</label>
                                <select className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={editingBooking.status} onChange={(e) => setEditingBooking({...editingBooking, status: e.target.value})}>
                                    <option value="PENDING">PENDING</option>
                                    <option value="ACCEPTED">ACCEPTED</option>
                                    <option value="COMPLETED">COMPLETED</option>
                                    <option value="CANCELLED">CANCELLED</option>
                                </select>
                                <label className="text-sm font-semibold text-gray-600">Fare (₹)</label>
                                <input type="number" required className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={editingBooking.fare || 0} onChange={(e) => setEditingBooking({...editingBooking, fare: parseFloat(e.target.value)})} />
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition mt-2">Update Booking</button>
                            </form>
                        </div>
                    </div>
                )}

                {showEditPaymentModal && editingPayment && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
                            <button onClick={() => setShowEditPaymentModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl transition">×</button>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Edit Payment #{editingPayment.paymentId}</h3>
                            <form onSubmit={handleUpdatePayment} className="space-y-3">
                                <label className="text-sm font-semibold text-gray-600">Amount (₹)</label>
                                <input type="number" required className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={editingPayment.amount || 0} onChange={(e) => setEditingPayment({...editingPayment, amount: parseFloat(e.target.value)})} />
                                <label className="text-sm font-semibold text-gray-600">Status</label>
                                <select className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={editingPayment.status} onChange={(e) => setEditingPayment({...editingPayment, status: e.target.value})}>
                                    <option value="PENDING">PENDING</option>
                                    <option value="COMPLETED">COMPLETED</option>
                                    <option value="FAILED">FAILED</option>
                                </select>
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition mt-2">Update Payment</button>
                            </form>
                        </div>
                    </div>
                )}

                {showEditFeedbackModal && editingFeedback && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
                            <button onClick={() => setShowEditFeedbackModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl transition">×</button>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Edit Feedback #{editingFeedback.feedbackId}</h3>
                            <form onSubmit={handleUpdateFeedback} className="space-y-3">
                                <label className="text-sm font-semibold text-gray-600">Rating (1-5)</label>
                                <input type="number" required min="1" max="5" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={editingFeedback.rating || 5} onChange={(e) => setEditingFeedback({...editingFeedback, rating: parseInt(e.target.value)})} />
                                <label className="text-sm font-semibold text-gray-600">Comment</label>
                                <textarea required className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none resize-none" rows="3" value={editingFeedback.comment} onChange={(e) => setEditingFeedback({...editingFeedback, comment: e.target.value})} />
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition mt-2">Update Feedback</button>
                            </form>
                        </div>
                    </div>
                )}

                {showEditAdminModal && editingAdmin && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
                            <button onClick={() => setShowEditAdminModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl transition">×</button>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Edit Admin #{editingAdmin.adminId}</h3>
                            <form onSubmit={handleUpdateAdmin} className="space-y-3">
                                <label className="text-sm font-semibold text-gray-600">Email</label>
                                <input type="email" required className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={editingAdmin.email} onChange={(e) => setEditingAdmin({...editingAdmin, email: e.target.value})} />
                                <label className="text-sm font-semibold text-gray-600">Full Name</label>
                                <input type="text" required className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={editingAdmin.fullName} onChange={(e) => setEditingAdmin({...editingAdmin, fullName: e.target.value})} />
                                <label className="text-sm font-semibold text-gray-600">Phone</label>
                                <input type="text" required className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={editingAdmin.phone} onChange={(e) => setEditingAdmin({...editingAdmin, phone: e.target.value})} />
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition mt-2">Update Admin</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}