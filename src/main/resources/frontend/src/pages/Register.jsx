import React, {useState} from 'react';
import {AlertCircle, Eye, EyeOff, UserPlus} from "lucide-react";
import api from "../api/axios.js";
import {data, useNavigate} from "react-router-dom";

const Register = () => {

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        enrollmentNo: '',
        Name: '',
        Department: 'Choose Department',
        YearOfStudy: 'Choose Year of Study',
        academicYear: '2026-2027',
        gender: 'Choose Gender',
        contactNo: ''
    });

    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const handleChange = (e) => {
        console.log(e.target.name)
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleRegister = async (e) => {

        e.preventDefault();
        setError("");
        setLoading(true);

        console.log(formData);

        try{

            const res = await api.post("/api/v1/auth/register", {...formData});
            console.log(res);
            if(res.data.success){
                navigate("/login");
                setLoading(false);
            } else {
                setError(res.data.message);
                setLoading(false);
            }
        } catch (e){
            console.log(e);
            setError(e.message)
            setLoading(false);
        }

    }

    const togglePassVisible = () => {
        setShowPassword(prev => !prev);
    }

    return (
        <>
            <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-max ">
                    <div className="text-center mb-8">
                        <div
                            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-xl shadow-blue-500/20 mb-4">
                            <UserPlus className="w-10 h-10 text-white"/>
                        </div>
                        <h2 className="text-3xl font-extrabold text-white tracking-tight">Student Registration</h2>
                        <p className="text-slate-400 text-sm mt-2">Create your student profile to request digital
                            Bonafide certificates</p>
                    </div>

                    <div className="glass-card p-8 rounded-3xl shadow-2xl border border-slate-800/80">
                        {/*Error Show*/}
                        {error && (
                            <div
                                className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-sm flex items-center space-x-3">
                                <AlertCircle className="w-5 h-5 shrink-0"/>
                                <span>{error}</span>
                            </div>
                        )}

                        {/*Register Form*/}
                        <form onSubmit={handleRegister} className="md:grid-cols-2 lg:grid gap-5">

                            {/*username*/}
                            <div className="mb-5">
                                <label
                                    className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                                    Username / Enrollment No <span className="text-red-700">*</span>
                                </label>

                                <div>
                                    <input
                                        name="username"
                                        type="text"
                                        required
                                        placeholder="e.g. 24210240154/Sai_08"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full pl-5 pr-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                                    />
                                </div>
                            </div>

                            {/*Email*/}
                            <div className="mb-5">
                                <label
                                    className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                                    Email Id <span className="text-red-700">*</span>
                                </label>

                                <div>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="e.g. student12@gmail.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-5 pr-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                                    />
                                </div>
                            </div>

                            {/*Password*/}
                            <div className="mb-5">
                                <label
                                    className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                                    Password <span className="text-red-700">*</span>
                                </label>

                                <div className="relative">
                                    <input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        placeholder="***********"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-5 pr-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                                    />

                                    <span className="flex justify-around intems-center absolute right-4 inset-y-3 text-sm" onClick={togglePassVisible}>
                                        {showPassword ? <Eye /> : <EyeOff />}
                                    </span>

                                </div>
                            </div>

                            {/*Enrollment No*/}
                            <div className="mb-5">
                                <label
                                    className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                                    Enrollment No <span className="text-red-700">*</span>
                                </label>

                                <div>
                                    <input
                                        name="enrollmentNo"
                                        type="number"
                                        required
                                        placeholder="e.g. 24210240154"
                                        value={formData.enrollmentNo}
                                        onChange={handleChange}
                                        className="w-full pl-5 pr-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                                    />
                                </div>
                            </div>

                            {/*Full Name*/}
                            <div className="mb-5">
                                <label
                                    className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                                    Full Name <span className="text-red-700">*</span>
                                </label>

                                <div>
                                    <input
                                        name="Name"
                                        type="text"
                                        required
                                        placeholder="e.g. Firstname Middlename Lastname"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full pl-5 pr-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                                    />
                                </div>
                            </div>

                            {/*Department*/}
                            <div className="mb-5">
                                <label
                                    className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                                    Department <span className="text-red-700">*</span>
                                </label>

                                <div>
                                    <select
                                        name="Department"
                                        required
                                        value={formData.department}
                                        onChange={handleChange}
                                        className="w-full pl-5 pr-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                                    >
                                        <option selected>Choose Your Department</option>
                                        <option>Computer Engineering</option>
                                        <option>Mechanical Engineering</option>
                                        <option>Civil Engineering</option>
                                        <option>Medical Electronics</option>
                                        <option>Polymer Technology</option>
                                    </select>
                                </div>
                            </div>

                            {/*Year of Study*/}
                            <div className="mb-5">
                                <label
                                    className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                                    Year Of Study <span className="text-red-700">*</span>
                                </label>

                                <div>
                                    <select
                                        name="YearOfStudy"
                                        required
                                        value={formData.YearOfStudy}
                                        onChange={handleChange}
                                        className="w-full pl-5 pr-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                                    >
                                        <option selected aria-disabled>Choose Your Year</option>
                                        <option>First Year</option>
                                        <option>Second Year</option>
                                        <option>Third Year / Final Year</option>
                                    </select>
                                </div>
                            </div>

                            {/*Academic year*/}
                            <div className="mb-5">
                                <label
                                    className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                                    Academic Year <span className="text-red-700">*</span>
                                </label>

                                <div>
                                    <input
                                        name="academicYear"
                                        type="text"
                                        required
                                        placeholder="e.g. 2025/2026"
                                        value={formData.academicYear}
                                        onChange={handleChange}
                                        className="w-full pl-5 pr-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                                    />
                                </div>
                            </div>

                            {/*Gender */}
                            <div className="mb-5">
                                <label
                                    className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                                    Gender
                                </label>

                                <div>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full pl-5 pr-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                                    >
                                        <option selected>Choose Gender</option>
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>

                            {/*contact no*/}
                            <div className="mb-5">
                                <label
                                    className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                                    Contact No
                                </label>

                                <div>
                                    <input
                                        name="contactNo"
                                        type="number"
                                        placeholder="e.g. 8766****32"
                                        value={formData.contactNo}
                                        onChange={handleChange}
                                        className="w-full pl-5 pr-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <button
                                name="register-btn"
                                type="submit"
                                className="col-span-2 w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all duration-200 flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
                            >
                                { !loading ? 'Submit' : 'Loading' } </button>
                        </form>
                    </div>
                </div>
            </div>
        </>);
}

export default Register;