// --- ARCHITECTURE & STYLING GUIDE (Top of file) ---
// The following component enforces Role-Gate logic, ensuring the role selected on the Landing Page
// matches the role returned by the backend, preventing unauthorized dashboard access.
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User, Lock, CarTaxiFront } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
    // State management for form inputs
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    // Routing and Authentication Context
    const navigate = useNavigate();
    // Extract the role (admin, customer, or driver) that was passed from the URL.
    const { role: selectedRole } = useParams(); 
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Send credentials to the Spring Boot backend
            const response = await api.post('/auth/login', { username, password });
            const { token, username: uname, role } = response.data;
            
            // --- CRITICAL SECURITY GATE (The Role Validation Check) ---
            if (selectedRole && role.toLowerCase() !== selectedRole.toLowerCase()) {
                toast.error(`Invalid credentials. You are not registered as a ${selectedRole}.`);
                return; // Execution stops here
            }

            login(token, uname, role);
            toast.success(`Welcome, ${uname}!`);

            // Redirect based on the exact role returned by the backend
            if (role === 'CUSTOMER') navigate('/dashboard');
            else if (role === 'DRIVER') navigate('/driver');
            else if (role === 'ADMIN') navigate('/admin');
            else navigate('/'); 
        } catch (error) {
            toast.error('Invalid username or password.');
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
            
            {/* Floating glowing orbs to maintain the seamless cinematic brand feel */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>

            {/* --- 2. MAIN GLASSMORPHISM LOGIN CARD --- */}
            <div className="relative z-10 bg-white/80 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-2xl w-full max-w-md animate-fade-in-up">
                
                {/* --- 2a. CARD HEADER & BRANDING --- */}
                <div className="flex flex-col items-center mb-8">
                    {/* Consistent glowing logo branding */}
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg mb-4">
                        <CarTaxiFront className="text-white w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                        Welcome Back
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Login to your account</p>
                </div>
                
                {/* --- 2b. LOGIN FORM WITH INTERACTIVE INPUTS --- */}
                <form onSubmit={handleLogin} className="space-y-5">
                    
                    {/* Username Input Field with Floating Icon */}
                    <div className="relative group">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 w-5 h-5 transition" />
                            <input 
                                type="text" 
                                placeholder="Enter username" 
                                className="w-full pl-10 pr-4 py-3 bg-white/60 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm" 
                                onChange={(e) => setUsername(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>
                    
                    {/* Password Input Field with Floating Icon */}
                    <div className="relative group">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 w-5 h-5 transition" />
                            <input 
                                type="password" 
                                placeholder="Enter password" 
                                className="w-full pl-10 pr-4 py-3 bg-white/60 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm" 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>
                    
                    {/* --- 2c. LARGE GRADIENT SUBMIT BUTTON --- */}
                    <button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 mt-2"
                    >
                        Sign In
                    </button>
                </form>
                <p className="mt-6 text-center text-xs text-gray-400">Your ride, your way.</p>
            </div>
        </div>
    );
}