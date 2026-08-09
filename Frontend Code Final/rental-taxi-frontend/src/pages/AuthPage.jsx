import { useParams, useNavigate } from 'react-router-dom';
import { CarTaxiFront } from 'lucide-react';

export default function AuthPage() {
    const { role } = useParams();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden p-4">
            
            {/* 
               Floating Glowing Orbs & Bouncing Taxi
            */}
            <div className="absolute top-[-10%] right-[-10%] w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
            
            <div className="absolute top-1/4 left-1/4 animate-bounce hidden md:block text-6xl drop-shadow-2xl bg-white/10 backdrop-blur-sm p-4 rounded-full border border-white/20 shadow-lg">
                🚕
            </div>

            {/* --- 2. MAIN GLASSMORPHISM GATEWAY CARD --- */}
            <div className="relative z-10 bg-white/80 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-2xl max-w-md w-full animate-fade-in-up text-center">
                
                {/* --- 2a. CARD HEADER & DYNAMIC TITLE --- */}
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <CarTaxiFront className="text-white w-8 h-8" />
                    </div>
                </div>
                
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 capitalize">
                    {role} Portal
                </h2>
                <p className="text-gray-500 text-sm mb-6">Continue as a {role}</p>
                
                {/* --- 2b. CLEARLY DEFINED AUTHENTICATION BUTTONS --- */}
                <div className="space-y-4">
                    
                    <button 
                        onClick={() => navigate(`/login/${role}`)} 
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition hover:shadow-xl transform hover:-translate-y-1"
                    >
                        🔐 Login
                    </button>
                    
                    <button 
                        onClick={() => navigate(`/register/${role}`)} 
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-lg transition hover:shadow-xl transform hover:-translate-y-1"
                    >
                        📝 Register
                    </button>
                    
                    <button 
                        onClick={() => navigate('/')} 
                        className="text-sm text-gray-500 hover:text-gray-800 underline mt-4 block transition"
                    >
                        ← Change Role
                    </button>
                </div>
            </div>
        </div>
    );
}