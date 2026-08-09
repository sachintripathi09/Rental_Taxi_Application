import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CarTaxiFront, User, Truck, MapPin } from 'lucide-react';

export default function LandingPage() {
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    const handleProceed = () => {
        if (role) {
            navigate(`/auth/${role}`);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
            
            {/* --- 1. THE BACKGROUND LAYER --- */}
            <div className="absolute inset-0 pointer-events-none">
                
                {/* Glowing Blue Orb */}
                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                
                {/* Glowing Purple Orb */}
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
                
                {/* Bouncing 3D Taxi Emoji */}
                <div className="absolute top-1/4 right-1/4 animate-bounce hidden md:block">
                    <div className="text-8xl drop-shadow-2xl bg-white/10 backdrop-blur-sm p-4 rounded-full border border-white/20 shadow-lg">
                        🚕
                    </div>
                </div>

                {/* Floating Geometric Elements */}
                <div className="absolute top-1/3 left-10 animate-float-slow">
                    <div className="w-16 h-16 border-2 border-white/20 rounded-full"></div>
                </div>
                <div className="absolute bottom-1/4 left-1/4 animate-float-slow-delay">
                    <MapPin className="w-12 h-12 text-white/30" />
                </div>
            </div>

            {/* --- 2. THE MAIN GLASSMORPHISM CARD --- */}
            <div className="relative z-10 bg-white/80 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-2xl w-full max-w-md mx-4 transition-all duration-300 hover:shadow-blue-500/20">
                
                {/* --- 2a. CARD HEADER & BRANDING --- */}
                <div className="flex flex-col items-center mb-8">
                    {/* Animated Logo Container */}
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg mb-4 animate-pulse">
                        <CarTaxiFront className="text-white w-10 h-10" />
                    </div>
                    
                    {/* Gradient Glowing Text */}
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                        Rental Taxi
                    </h2>
                    <p className="text-gray-600 text-sm mt-1 font-medium tracking-wide">Select your role to get started</p>
                </div>

                {/* --- 2b. ROLE SELECTION BUTTON GRID --- */}
                <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                        
                        {/* Admin Button Card */}
                        <button 
                            onClick={() => setRole('admin')}
                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 transform ${role === 'admin' ? 'border-blue-600 bg-blue-50 text-blue-600 scale-105 shadow-lg shadow-blue-100' : 'border-gray-200 hover:border-blue-300 hover:scale-105 text-gray-600 bg-white/50'}`}
                        >
                            <User className={`w-6 h-6 mb-1 ${role === 'admin' ? 'text-blue-600' : ''}`} />
                            <span className="text-xs font-bold uppercase tracking-wider">Admin</span>
                        </button>
                        
                        {/* Customer Button Card */}
                        <button 
                            onClick={() => setRole('customer')}
                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 transform ${role === 'customer' ? 'border-blue-600 bg-blue-50 text-blue-600 scale-105 shadow-lg shadow-blue-100' : 'border-gray-200 hover:border-blue-300 hover:scale-105 text-gray-600 bg-white/50'}`}
                        >
                            <CarTaxiFront className={`w-6 h-6 mb-1 ${role === 'customer' ? 'text-blue-600' : ''}`} />
                            <span className="text-xs font-bold uppercase tracking-wider">Customer</span>
                        </button>
                        
                        {/* Driver Button Card */}
                        <button 
                            onClick={() => setRole('driver')}
                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 transform ${role === 'driver' ? 'border-blue-600 bg-blue-50 text-blue-600 scale-105 shadow-lg shadow-blue-100' : 'border-gray-200 hover:border-blue-300 hover:scale-105 text-gray-600 bg-white/50'}`}
                        >
                            <Truck className={`w-6 h-6 mb-1 ${role === 'driver' ? 'text-blue-600' : ''}`} />
                            <span className="text-xs font-bold uppercase tracking-wider">Driver</span>
                        </button>
                    </div>

                    {/* --- 2c. LARGE GRADIENT ACTION BUTTON --- */}
                    <button 
                        onClick={handleProceed}
                        disabled={!role}
                        className={`w-full py-3.5 rounded-xl font-bold transition-all duration-300 shadow-md text-white ${role ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl transform hover:-translate-y-1 hover:scale-[1.02]' : 'bg-gray-300 cursor-not-allowed'}`}
                    >
                        Continue as {role ? role.charAt(0).toUpperCase() + role.slice(1) : '...'}
                    </button>
                </div>
            </div>
        </div>
    );
}