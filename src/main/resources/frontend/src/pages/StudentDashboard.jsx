import React, {useEffect, useState} from 'react';
import {useAuth} from "../context/useAuthContext.jsx";
import { FileText, PlusCircle, Download, Clock, CheckCircle2, XCircle, User, Award, Building2, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import api from "../api/axios.js";

const StudentDashboard = () => {

    const { user} = useAuth();
    const [requests, setRequests] = useState([]);
    const [purpose, setPurpose] = useState('MahaDBT Scholarship');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleApply = async (e) =>{
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        console.log(requests);
        console.log(purpose);
        console.log(user);

        try {
            const res = await api.post('/api/v1/requests/apply', { purpose});
            console.log(res);
            setSuccess(`Application submitted successfully for ${purpose}!`);
            setRequests([res.data, ...requests]);
        } catch (err) {
            console.log(err)
            setError(err.response?.data?.message || 'Failed to submit request');
        } finally {
            setLoading(false);
        }
    }

    const fetchMyRequests = async () => {
        try {
            const res = await api.get('/api/v1/requests/my-requests');
            setRequests(res.data);
        } catch (err) {
            console.error('Failed to fetch requests', err);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchMyRequests();
    }, []);

    const handleDownload = async (requestId, certNo) => {
        try {
            const response = await api.get(`/api/v1/certificates/download/${requestId}`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Bonafide_Certificate_${certNo || requestId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert('Failed to download certificate: ' + (err.response?.data?.message || 'Error generating PDF'));
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

            {/* Student Profile Header Banner */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-600/30">
                            {user.fullName ? user.fullName.charAt(0) : 'S'}
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <h1 className="text-2xl font-extrabold text-white">{user.fullName}</h1>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
                  Active Student
                </span>
                            </div>
                            <p className="text-sm text-slate-400 mt-1 flex items-center space-x-4">
                                <span className="flex items-center"><Award className="w-4 h-4 mr-1 text-blue-400" /> {user.enrollment}</span>
                                <span className="flex items-center"><Building2 className="w-4 h-4 mr-1 text-indigo-400" /> {user.department}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 bg-slate-900/80 px-4 py-3 rounded-2xl border border-slate-800 text-xs">
                        <div>
                            <span className="text-slate-500 block">Academic Year</span>
                            <span className="font-bold text-slate-200">2025 - 2026</span>
                        </div>
                        <div className="h-8 w-px bg-slate-800"></div>
                        <div>
                            <span className="text-slate-500 block">Total Applied</span>
                            <span className="font-bold text-blue-400">{requests.length} Requests</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Application Submission Form */}
                <div className="glass-card p-6 rounded-3xl border border-slate-800 h-fit space-y-6">
                    <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
                        <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400">
                            <PlusCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-bold text-white text-base">Request Certificate</h2>
                            <p className="text-xs text-slate-400">Select purpose & submit for HOD review</p>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-center space-x-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs flex items-center space-x-2">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>{success}</span>
                        </div>
                    )}

                    <form onSubmit={handleApply} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                                Purpose of Bonafide Certificate
                            </label>
                            <select
                                id="apply-purpose-select"
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium"
                            >
                                <option value="MahaDBT Scholarship">MahaDBT Scholarship</option>
                                <option value="MSRTC Bus Concession Pass">MSRTC Bus Concession Pass</option>
                                <option value="Bank Education Loan Application">Bank Education Loan Application</option>
                                <option value="Passport Verification">Passport Verification</option>
                                <option value="Internship / NOC Certificate">Internship / NOC Certificate</option>
                            </select>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/60 text-xs text-slate-400 space-y-2">
                            <div className="flex items-center text-blue-400 font-semibold">
                                <Sparkles className="w-3.5 h-3.5 mr-1" /> Automated Verification Workflow
                            </div>
                            <p>Approved certificates generate a digital PDF with embedded anti-tamper QR code sent to your email.</p>
                        </div>

                        <button
                            id="submit-request-btn"
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all text-sm flex items-center justify-center space-x-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <span>Submitting Application...</span>
                            ) : (
                                <>
                                    <FileText className="w-4 h-4" />
                                    <span>Submit Application</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Requests Status Table */}
                <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-slate-800 space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                        <div>
                            <h2 className="font-bold text-white text-base">Application History & Status</h2>
                            <p className="text-xs text-slate-400">Track real-time approval status and download official PDF</p>
                        </div>
                        <button
                            onClick={fetchMyRequests}
                            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                            title="Refresh Queue"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>

                    {fetching ? (
                        <div className="p-12 text-center text-slate-500 text-sm">
                            Loading application records...
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="p-12 text-center text-slate-500 text-sm glass-card rounded-2xl">
                            No certificate requests submitted yet. Select a purpose and apply on the left.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm border-collapse">
                                <thead>
                                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                                    <th className="py-3 px-4">Request Details</th>
                                    <th className="py-3 px-4">Applied Date</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4 text-right">Action / Download</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60">
                                {requests.map((req) => (
                                    <tr key={req.requestId} className="hover:bg-slate-900/40 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="font-semibold text-slate-200">{req.purpose}</div>
                                            {req.certificateNumber && (
                                                <div className="text-[11px] font-mono text-blue-400 mt-0.5">Ref: {req.certificateNumber}</div>
                                            )}
                                            {req.remarks && (
                                                <div className="text-xs text-slate-400 mt-1 italic">
                                                    Remarks: "{req.remarks}"
                                                </div>
                                            )}
                                        </td>

                                        <td className="py-4 px-4 text-xs text-slate-400">
                                            {new Date(req.appliedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>

                                        <td className="py-4 px-4">
                                            {req.status === 'PENDING' && (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-400 border border-amber-800/50">
                            <Clock className="w-3 h-3 mr-1.5 animate-spin" /> PENDING
                          </span>
                                            )}
                                            {req.status === 'APPROVED' && (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
                            <CheckCircle2 className="w-3 h-3 mr-1.5" /> APPROVED
                          </span>
                                            )}
                                            {req.status === 'REJECTED' && (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-400 border border-rose-800/50">
                            <XCircle className="w-3 h-3 mr-1.5" /> REJECTED
                          </span>
                                            )}
                                        </td>

                                        <td className="py-4 px-4 text-right">
                                            {req.status === 'APPROVED' ? (
                                                <button
                                                    id={`download-pdf-btn-${req.requestId}`}
                                                    onClick={() => handleDownload(req.requestId, req.certificateNumber)}
                                                    className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 transition-all hover:scale-105"
                                                >
                                                    <Download className="w-3.5 h-3.5 mr-1.5" /> Download PDF
                                                </button>
                                            ) : (
                                                <span className="text-xs text-slate-600 font-medium">Download Unavailable</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
};

export default StudentDashboard;