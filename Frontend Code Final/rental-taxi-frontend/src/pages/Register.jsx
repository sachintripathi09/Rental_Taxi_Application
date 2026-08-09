// --- ARCHITECTURE & STYLING GUIDE ---
// 1. DYNAMIC REGISTRATION FORM:
//    - Extracts the `role` from the URL params (admin, customer, driver).
//    - Renders different input fields based on the role.
//    - Submits the data to the specific Spring Boot registration endpoint.
// 2. SEAMLESS UX:
//    - Upon successful registration, the user is automatically redirected to the Login page.
//    - Clear error messages are displayed if the backend throws a validation error (e.g., "Username already taken").

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CarTaxiFront, UserPlus } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Register() {
    const { role } = useParams(); // Extracts 'admin', 'customer', or 'driver' from URL
    const navigate = useNavigate();

    // Base fields common to all users
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        fullName: '',
        phone: '',
        // Customer specific
        address: '',
        // Driver specific
        licenseNumber: '',
        status: 'AVAILABLE'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            let endpoint = '';
            let payload = {};

            // Construct the specific payload and endpoint based on the role
            if (role === 'admin') {
                endpoint = '/auth/register/admin';
                payload = {
                    username: formData.username,
                    password: formData.password,
                    email: formData.email,
                    fullName: formData.fullName,
                    phone: formData.phone
                };
            } else if (role === 'customer') {
                endpoint = '/auth/register/customer';
                payload = {
                    username: formData.username,
                    password: formData.password,
                    email: formData.email,
                    fullName: formData.fullName,
                    phone: formData.phone,
                    address: formData.address
                };
            } else if (role === 'driver') {
                endpoint = '/auth/register/driver';
                payload = {
                    username: formData.username,
                    password: formData.password,
                    email: formData.email,
                    fullName: formData.fullName,
                    phone: formData.phone,
                    licenseNumber: formData.licenseNumber,
                    status: formData.status
                };
            }

            // Send the request to the backend
            await api.post(endpoint, payload);
            toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully!`);
            
            // Redirect the user to the login page for their specific role
            navigate(`/login/${role}`);
        } catch (error) {
            const msg = error.response?.data?.message || error.response?.data?.error || error.message || 'Registration failed.';
            toast.error(`Error: ${msg}`);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden p-4">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>

            <div className="relative z-10 bg-white/80 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-2xl w-full max-w-lg animate-fade-in-up">
                
                {/* Header */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg mb-3">
                        <UserPlus className="text-white w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent capitalize">
                        Register {role}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Create a new {role} account</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    {/* Common Fields for all roles */}
                    <input type="text" name="username" required placeholder="Username" className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.username} onChange={handleChange} />
                    <input type="password" name="password" required placeholder="Password" className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.password} onChange={handleChange} />
                    <input type="email" name="email" required placeholder="Email" className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.email} onChange={handleChange} />
                    <input type="text" name="fullName" required placeholder="Full Name" className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.fullName} onChange={handleChange} />
                    <input type="text" name="phone" required placeholder="Phone Number" className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.phone} onChange={handleChange} />

                    {/* Customer specific fields */}
                    {role === 'customer' && (
                        <input type="text" name="address" required placeholder="Address" className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.address} onChange={handleChange} />
                    )}

                    {/* Driver specific fields */}
                    {role === 'driver' && (
                        <>
                            <input type="text" name="licenseNumber" required placeholder="License Number" className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.licenseNumber} onChange={handleChange} />
                            <select name="status" className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.status} onChange={handleChange}>
                                <option value="AVAILABLE">AVAILABLE</option>
                                <option value="ON_TRIP">ON_TRIP</option>
                                <option value="OFFLINE">OFFLINE</option>
                            </select>
                        </>
                    )}

                    <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 mt-4">
                        Register {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                </form>
                
                <p className="mt-6 text-center text-xs text-gray-400">
                    Already have an account? 
                    <button onClick={() => navigate(`/login/${role}`)} className="text-blue-600 hover:underline font-semibold ml-1">Login</button>
                </p>
            </div>
        </div>
    );
}