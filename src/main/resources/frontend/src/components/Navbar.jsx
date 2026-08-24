import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheckIcon,LogOut } from 'lucide-react'
import {useAuth} from "../context/useAuthContext.jsx";

const Navbar = () => {

    const navigate = useNavigate();
    const {user, logout} = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };


    return (
    <>
        <nav className="sticky top-0 z-50 glass-card border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/*/ Logo Section */}
                    <div>
                        <Link to="/" className="flex items-center space-x-2 group">
                            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                            <ShieldCheckIcon className="h-5 w-5 text-slate-300" />
                            </div>
                            <div>
                                <span className="text-xl font-semibold text-slate-100">BONAFIDE PORTAL</span>
                            </div>
                        </Link>
                    </div>
                    {user ? (
                    <div className="flex items-center space-x-4">
                        <div className="hidden sm:flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-800/80 border border-slate-700 text-blue-400">
                            <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
                            {user.role === 'ROLE_ADMIN' || user.role === 'ROLE_HOD' ? 'HOD / Admin Portal' : 'Student Portal'}
                        </div>

                        <div className="flex items-center space-x-3 pl-2 border-l border-slate-800">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-semibold text-slate-200">{user.fullName || user.username}</p>
                                <p className="text-[10px] text-slate-400">{user.enrollmentNo || user.role}</p>
                            </div>
                            <button
                                id="logout-btn"
                                onClick={handleLogout}
                                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                                title="Sign Out"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>) : (
                        <div className="flex items-center space-x-3">
                            <Link
                                to="/login"
                                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02]"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    </>
  );
}

export default Navbar