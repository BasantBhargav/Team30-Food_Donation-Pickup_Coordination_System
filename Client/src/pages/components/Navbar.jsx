import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userStr = localStorage.getItem('user');
    let user = null;

    try {
        user = userStr ? JSON.parse(userStr) : null;
    } catch (e) {
        user = null;
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
        window.location.reload(); // Force refresh to clear state
    };

    // Don't show navbar on login page
    if (location.pathname === '/') {
        return null;
    }

    return (
        <nav className="glass sticky top-0 z-50 border-b border-white/20">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to={user?.role === 'donor' ? '/donor' : '/volunteer'} className="flex items-center gap-3 group">
                    <div className="text-4xl animate-float">🍲</div>
                    <div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 group-hover:from-green-500 group-hover:to-emerald-600 transition-all">
                            FoodConnect
                        </span>
                        <p className="text-xs text-gray-500 font-medium">Zero Waste • Full Hearts</p>
                    </div>
                </Link>
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <div className="hidden md:flex flex-col items-end mr-2">
                                <span className="font-semibold text-gray-800">{user.name}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${user.role === 'donor'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-orange-100 text-orange-700'
                                    }`}>
                                    {user.role}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 bg-red-50 text-red-600 px-5 py-2.5 rounded-full font-semibold hover:bg-red-100 transition-all border border-red-100 hover:shadow-lg hover:shadow-red-100"
                            >
                                <span>Logout</span>
                            </button>
                        </>
                    ) : null}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
