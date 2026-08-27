import React, { useState } from 'react';
import { AlertCircle, Eye, EyeOff, ShieldCheck } from "lucide-react";
import api from "../api/axios.js";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        enrollmentNo: '',
        Name: '',
        Department: 'Choose Your Department',
        YearOfStudy: 'Choose Your Year',
        academicYear: '2025-2026',
        gender: 'Choose Gender',
        contactNo: ''
    });

    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await api.post("/api/v1/auth/register", { ...formData });
            if (res.data.success) {
                navigate("/login");
            } else {
                setError(res.data.message || "Registration failed");
            }
        } catch (e) {
            setError(e.response?.data?.message || e.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    const togglePassVisible = () => {
        setShowPassword(prev => !prev);
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-transparent">
            <div className="w-full max-w-2xl">
                <div className="glass-card p-8 rounded-3xl shadow-xl">

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-md shadow-blue-500/20 mb-4 text-white">
                            <ShieldCheck className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="font-bold text-2xl text-slate-900 dark:text-slate-100">Create Your Account</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 font-medium">Enter your details to register for SMART BONAFIDE PORTAL</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-300 text-sm flex items-center space-x-3 font-medium">
                            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* Username */}
                            <div>
                                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-2 uppercase tracking-wider">
                                    Username
                                </label>
                                <input
                                    name="username"
                                    type="text"
                                    required
                                    placeholder="Choose a username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm font-medium"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-2 uppercase tracking-wider">
                                    Email Address
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm font-medium"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-2 uppercase tracking-wider">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm font-medium"
                                    />
                                    <span className="flex justify-around items-center absolute right-4 inset-y-3 text-sm text-slate-500 dark:text-slate-400 cursor-pointer" onClick={togglePassVisible}>
                                        {showPassword ? <Eye /> : <EyeOff />}
                                    </span>
                                </div>
                            </div>

                            {/* Enrollment No */}
                            <div>
                                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-2 uppercase tracking-wider">
                                    Enrollment No
                                </label>
                                <input
                                    name="enrollmentNo"
                                    type="number"
                                    required
                                    placeholder="Enter Enrollment No"
                                    value={formData.enrollmentNo}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm font-medium"
                                />
                            </div>

                            {/* Full Name */}
                            <div>
                                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-2 uppercase tracking-wider">
                                    Full Name
                                </label>
                                <input
                                    name="Name"
                                    type="text"
                                    required
                                    placeholder="Your Full Name"
                                    value={formData.Name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm font-medium"
                                />
                            </div>

                            {/* Department */}
                            <div>
                                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-2 uppercase tracking-wider">
                                    Department
                                </label>
                                <select
                                    name="Department"
                                    required
                                    value={formData.Department}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm font-medium"
                                >
                                    <option value="Choose Your Department" disabled>Choose Your Department</option>
                                    <option value="Computer Engineering">Computer Engineering</option>
                                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                                    <option value="Civil Engineering">Civil Engineering</option>
                                    <option value="Medical Electronics">Medical Electronics</option>
                                    <option value="Polymer Technology">Polymer Technology</option>
                                </select>
                            </div>

                            {/* Year of Study */}
                            <div>
                                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-2 uppercase tracking-wider">
                                    Year Of Study
                                </label>
                                <select
                                    name="YearOfStudy"
                                    required
                                    value={formData.YearOfStudy}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm font-medium"
                                >
                                    <option value="Choose Your Year" disabled>Choose Your Year</option>
                                    <option value="First Year">First Year</option>
                                    <option value="Second Year">Second Year</option>
                                    <option value="Third Year / Final Year">Third Year / Final Year</option>
                                </select>
                            </div>

                            {/* Academic Year */}
                            <div>
                                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-2 uppercase tracking-wider">
                                    Academic Year
                                </label>
                                <input
                                    name="academicYear"
                                    type="text"
                                    required
                                    placeholder="2025-2026"
                                    value={formData.academicYear}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm font-medium"
                                />
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-2 uppercase tracking-wider">
                                    Gender
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm font-medium"
                                >
                                    <option value="Choose Gender">Choose Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Contact No */}
                            <div>
                                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-2 uppercase tracking-wider">
                                    Contact No
                                </label>
                                <input
                                    name="contactNo"
                                    type="number"
                                    placeholder="Enter Contact No"
                                    value={formData.contactNo}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm font-medium"
                                />
                            </div>

                        </div>

                        <button
                            name="register-btn"
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all duration-200 flex items-center justify-center space-x-2 text-sm disabled:opacity-50 mt-6"
                        >
                            {loading ? 'Registering...' : 'Register Account'}
                        </button>
                    </form>

                    <div className="text-slate-600 dark:text-slate-400 text-sm mt-5 text-center font-medium">
                        <p>Already have an account? <span className="text-blue-600 dark:text-blue-400 font-semibold"><Link to="/login">Sign In</Link></span></p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Register;