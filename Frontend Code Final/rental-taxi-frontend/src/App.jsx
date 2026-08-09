import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import DriverDashboard from './pages/DriverDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Reports from './pages/Reports';        
import Settings from './pages/Settings';      
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AuthRedirect() {
    const { token, role } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); // <-- Get the current URL path

    useEffect(() => {
        if (token) {
            // If Admin: Only redirect to /admin if they aren't already on an admin sub-page
            if (role === 'ADMIN' && !location.pathname.startsWith('/admin')) {
                navigate('/admin');
            }
            // If Customer: Only redirect if they aren't on the customer dashboard
            else if (role === 'CUSTOMER' && location.pathname !== '/dashboard') {
                navigate('/dashboard');
            }
            // If Driver: Only redirect if they aren't on the driver dashboard
            else if (role === 'DRIVER' && location.pathname !== '/driver') {
                navigate('/driver');
            }
        }
    }, [token, role, navigate, location.pathname]);

    return null;
}

function App() {
    return (
        <Router>
            <Toaster position="top-center" reverseOrder={false} />
            <AuthRedirect />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth/:role" element={<AuthPage />} />
                <Route path="/login/:role" element={<Login />} />
                <Route path="/register/:role" element={<Register />} />
                
                {/* Core Dashboards */}
                <Route path="/dashboard" element={<CustomerDashboard />} />
                <Route path="/driver" element={<DriverDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />

                {/* Admin Extensions */}
                <Route path="/admin/reports" element={<Reports />} />
                <Route path="/admin/settings" element={<Settings />} />
            </Routes>
        </Router>
    );
}
export default App;