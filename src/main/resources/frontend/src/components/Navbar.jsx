import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheckIcon, LogOut, Sun, Moon } from 'lucide-react'
import { useAuth } from "../context/useAuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const Navbar = () => {

    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
    <>
        <nav className="sticky top-0 z-50 glass-card border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/80 backdrop-blur-md shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/*/ Logo Section */}
                    <div>
                        <Link to="/" className="flex items-center space-x-2 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                                <ShieldCheckIcon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100">BONAFIDE PORTAL</span>
                            </div>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-3 sm:space-x-4">

                        {/* Theme Switcher Button */}
                        <button
                            id="theme-toggle-btn"
                            onClick={toggleTheme}
                            className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-xs"
                            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-800" />}
                        </button>

                        {user ? (
                        <div className="flex items-center space-x-4">
                            <div className="hidden sm:flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-blue-700 dark:text-blue-400">
                                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
                                {user.role === 'ROLE_ADMIN' || user.role === 'ROLE_HOD' ? 'HOD / Admin Portal' : 'Student Portal'}
                            </div>

                            <div className="flex items-center space-x-3 pl-2 border-l border-slate-300 dark:border-slate-800">
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs font-bold text-slate-900 dark:text-slate-200">{user.fullName || user.username}</p>
                                    <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">{user.enrollmentNo || user.role}</p>
                                </div>
                                <button
                                    id="logout-btn"
                                    onClick={handleLogout}
                                    className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                                    title="Sign Out"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        </div>) : (
                            <div className="flex items-center space-x-3">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-sm font-bold text-slate-800 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md transition-all hover:scale-[1.02]"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    </>
  );
}

export default Navbar