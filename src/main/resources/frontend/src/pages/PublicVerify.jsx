import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, ShieldAlert, Award, Calendar, CheckCircle2, XCircle, Building2, BookOpen, FileCheck2, ArrowLeft } from 'lucide-react';

export default function PublicVerify() {
    const { token } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const verifyCert = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`http://localhost:8080/api/v1/public/verify/${token}`);
                setData(res.data);
                console.log(res.data)
            } catch (err) {
                setError('Verification service unavailable or network error.');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            verifyCert();
        }
    }, [token]);

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-2xl">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-xl shadow-blue-500/20 mb-4">
                        <ShieldCheck className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Public Document Verification</h1>
                    <p className="text-slate-400 text-sm mt-2">Official anti-tamper validation engine for institutional Bonafide certificates</p>
                </div>

                {loading ? (
                    <div className="glass-card p-12 rounded-3xl text-center space-y-4">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-slate-400 text-sm">Verifying cryptographic token with database records...</p>
                    </div>
                ) : error || !data || !data.valid ? (
                    /* Red Warning Banner - Document Tampered / Invalid */
                    <div className="glass-card p-8 sm:p-10 rounded-3xl border-2 border-rose-600/60 bg-rose-950/20 shadow-2xl text-center space-y-6">
                        <div className="w-20 h-20 rounded-full bg-rose-900/40 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-500 shadow-lg shadow-rose-600/20 animate-pulse">
                            <ShieldAlert className="w-12 h-12" />
                        </div>

                        <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-900/60 text-rose-300 border border-rose-700/50 mb-3">
                <XCircle className="w-3.5 h-3.5 mr-1" /> VERIFICATION FAILED
              </span>
                            <h2 className="text-2xl font-extrabold text-rose-200">Document Tampered or Invalid Certificate</h2>
                            <p className="text-sm text-slate-300 max-w-md mx-auto mt-2">
                                {data?.message || 'The requested verification token could not be validated against the official ledger. This document may be fraudulent, altered, or revoked.'}
                            </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-950/60 border border-rose-900/30 text-xs text-slate-400 font-mono">
                            Verification Token ID: {token}
                        </div>

                        <div className="pt-4 border-t border-slate-800">
                            <Link to="/" className="inline-flex items-center text-sm font-semibold text-slate-400 hover:text-white transition-colors">
                                <ArrowLeft className="w-4 h-4 mr-2" /> Return to Main Portal
                            </Link>
                        </div>
                    </div>
                ) : (
                    /* Green Verified Seal - Certificate Authentic */
                    <div className="glass-card p-8 sm:p-10 rounded-3xl border-2 border-emerald-500/50 bg-gradient-to-b from-emerald-950/30 via-slate-900 to-slate-950 shadow-2xl space-y-8">

                        {/* Green Seal Badge */}
                        <div className="text-center">
                            <div className="w-20 h-20 rounded-full bg-emerald-900/40 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-600/20 mb-4">
                                <FileCheck2 className="w-12 h-12" />
                            </div>
                            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-900/80 text-emerald-300 border border-emerald-600/50 shadow-md">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-400" /> OFFICIAL CERTIFICATE VERIFIED
              </span>
                            <h2 className="text-2xl font-extrabold text-white mt-3">Authentic Bonafide Document</h2>
                            <p className="text-xs text-slate-400 mt-1">Ref No: <span className="font-mono font-bold text-blue-400">{data.certificateNumber}</span></p>
                        </div>

                        {/* Verified Student Details Grid */}
                        <div className="glass-card p-6 rounded-2xl border border-slate-800/80 bg-slate-950/60 grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">

                            <div>
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Student Full Name</span>
                                <span className="font-bold text-slate-100 text-base">{data.fullName}</span>
                            </div>

                            <div>
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Enrollment Number</span>
                                <span className="font-bold text-blue-400 font-mono text-base">{data.enrollmentNo}</span>
                            </div>

                            <div>
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Department</span>
                                <span className="font-semibold text-slate-200">{data.department}</span>
                            </div>

                            <div>
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Year of Study & Academic Year</span>
                                <span className="font-semibold text-slate-200">{data.yearOfStudy} ({data.academicYear})</span>
                            </div>

                            <div className="sm:col-span-2 pt-3 border-t border-slate-800">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Approved Purpose</span>
                                <span className="font-extrabold text-blue-300 text-base">{data.purpose}</span>
                            </div>

                            <div className="sm:col-span-2 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                                <span className="flex items-center"><Calendar className="w-4 h-4 mr-1 text-slate-500" /> Issued On: {data.issueDate ? new Date(data.issueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</span>
                                <span className="text-emerald-400 font-semibold">Ledger Status: VALID</span>
                            </div>

                        </div>

                        {/* Cryptographic Seal Note */}
                        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center text-xs text-slate-400 font-mono">
                            Verification Cryptographic Token: {token}
                        </div>

                        <div className="text-center pt-2">
                            <Link to="/" className="inline-flex items-center text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Institution Home
                            </Link>
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
}
