import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuthContext.jsx';
import api from '../api/axios';
import { ShieldCheck, Search, Filter, CheckCircle2, XCircle, Clock, AlertCircle, RefreshCw, Building2, UserCheck, Check, X, Sparkles } from 'lucide-react';

export default function HodDashboard() {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [students, setStudents] = useState([]);
    const [fetchingStudents, setFetchingStudents] = useState(false);

    // Modal state for Approve / Reject
    const [selectedReq, setSelectedReq] = useState(null);
    const [modalType, setModalType] = useState(''); // 'approve' or 'reject'
    const [remarks, setRemarks] = useState('');
    const [processing, setProcessing] = useState(false);
    const [actionError, setActionError] = useState('');

    const fetchAllRequests = async () => {
        setFetching(true);
        try {
            const res = await api.get('/api/v1/admin/requests');
            setRequests(res.data);
        } catch (err) {
            console.error('Failed to fetch admin requests', err);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchAllRequests();
    }, []);

    const openActionModal = (req, type) => {
        setSelectedReq(req);
        setModalType(type);
        setRemarks(type === 'approve' ? 'Approved by Head of Department' : '');
        setActionError('');
    };

    const closeModal = () => {
        setSelectedReq(null);
        setModalType('');
        setRemarks('');
        setActionError('');
    };

    const handleConfirmAction = async () => {
        if (!selectedReq) return;
        setProcessing(true);
        setActionError('');

        try {
            const endpoint = `/api/v1/admin/requests/${selectedReq.requestId}/${modalType}`;
            const res = await api.put(endpoint, { remarks });

            // Update requests state locally
            setRequests(requests.map(r => r.requestId === selectedReq.requestId ? res.data : r));
            closeModal();
        } catch (err) {
            setActionError(err.response?.data?.message || `Failed to ${modalType} request`);
        } finally {
            setProcessing(false);
        }
    };

    const filteredRequests = requests.filter(req => {
        const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
        const q = searchQuery.toLowerCase();
        const matchesSearch =
            (req.fullName && req.fullName.toLowerCase().includes(q)) ||
            (req.enrollmentNo && req.enrollmentNo.toLowerCase().includes(q)) ||
            (req.department && req.department.toLowerCase().includes(q)) ||
            (req.purpose && req.purpose.toLowerCase().includes(q));

        return matchesStatus && matchesSearch;
    });

    const fetchAllRegisteredStudents = async () => {
        setFetchingStudents(true);
        try {
            const res = await api.get('/api/v1/admin/students');
            setStudents(res.data || []);
        } catch (err) {
            console.error('Failed to fetch registered students', err);
        } finally {
            setFetchingStudents(false);
        }
    };

    const pendingCount = requests.filter(r => r.status === 'PENDING').length;
    const approvedCount = requests.filter(r => r.status === 'APPROVED').length;
    const rejectedCount = requests.filter(r => r.status === 'REJECTED').length;
    const totalStudents = students.count();

    const hodDept = user?.department;
    const isSuperAdmin = hodDept === 'ALL' || user?.role === 'ROLE_ADMIN';

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

            {/* Header Banner */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-950 relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center space-x-3">
                            <div className="p-2.5 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/20">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-extrabold text-white">HOD Queue</h1>
                                <div className="flex items-center space-x-2 mt-1">
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-950 text-blue-400 border border-blue-800">
                    <Building2 className="w-3.5 h-3.5 mr-1" />
                      {isSuperAdmin ? 'Super Admin Portal (All Departments)' : `${hodDept} HOD Queue`}
                  </span>
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-slate-400 mt-2">
                            {isSuperAdmin
                                ? 'Super Admin view for all department student applications'
                                : `Student applications belonging to ${hodDept} department are routed to this dashboard for review`}
                        </p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="px-4 py-2 rounded-2xl glass-card bg-amber-950/40 border border-amber-800/40 text-center">
                            <span className="text-xs text-slate-400 block font-medium">Pending Queue</span>
                            <span className="text-lg font-bold text-amber-400">{pendingCount}</span>
                        </div>
                        <div className="px-4 py-2 rounded-2xl glass-card bg-emerald-950/40 border border-emerald-800/40 text-center">
                            <span className="text-xs text-slate-400 block font-medium">Approved</span>
                            <span className="text-lg font-bold text-emerald-400">{approvedCount}</span>
                        </div>
                        <div className="px-4 py-2 rounded-2xl glass-card bg-rose-950/40 border border-rose-800/40 text-center">
                            <span className="text-xs text-slate-400 block font-medium">Rejected</span>
                            <span className="text-lg font-bold text-rose-400">{rejectedCount}</span>
                        </div>
                        <div className="px-4 py-2 rounded-2xl glass-card bg-rose-950/40 border border-rose-800/40 text-center">
                            <span className="text-xs text-slate-400 block font-medium">Total Student Registered</span>
                            <span className="text-lg font-bold text-rose-400">{totalStudents}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Department Routing Info Card */}
            <div className="glass-card p-4 rounded-2xl border border-blue-500/20 bg-blue-950/20 flex items-center justify-between text-xs text-blue-300">
                <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>
            <strong>Department-Based Automatic Routing:</strong> Student applications are routed to their respective department HOD ({hodDept}).
          </span>
                </div>
            </div>

            {/* Control Bar: Search & Filter */}
            <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">

                {/* Search */}
                <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        id="admin-search-input"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Enrollment, Name, Dept..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                </div>

                {/* Filter Pills */}
                <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
                    {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
                        <button
                            key={st}
                            id={`filter-btn-${st.toLowerCase()}`}
                            onClick={() => setStatusFilter(st)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                statusFilter === st
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                        >
                            {st}
                        </button>
                    ))}

                    <button
                        onClick={fetchAllRequests}
                        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors ml-2"
                        title="Refresh Queue"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>

            </div>

            {/* Tabular Queue */}
            <div className="glass-card p-6 rounded-3xl border border-slate-800">
                {fetching ? (
                    <div className="p-12 text-center text-slate-500 text-sm">
                        Loading student application queue...
                    </div>
                ) : filteredRequests.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 text-sm">
                        No certificate requests found for {hodDept} department matching the selected filters.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                            <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                                <th className="py-3 px-4">Student Profile</th>
                                <th className="py-3 px-4">Enrollment / Dept</th>
                                <th className="py-3 px-4">Purpose</th>
                                <th className="py-3 px-4">Applied Date</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4 text-right">HOD Action</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                            {filteredRequests.map((req) => (
                                <tr key={req.requestId} className="hover:bg-slate-900/40 transition-colors">
                                    <td className="py-4 px-4">
                                        <div className="font-bold text-slate-200">{req.fullName || req.username}</div>
                                        <div className="text-xs text-slate-500">{req.username}</div>
                                    </td>

                                    <td className="py-4 px-4 text-xs">
                                        <div className="font-semibold text-blue-400">{req.enrollmentNo || 'N/A'}</div>
                                        <div className="text-slate-400">{req.department} ({req.yearOfStudy})</div>
                                    </td>

                                    <td className="py-4 px-4">
                                        <div className="font-medium text-slate-300">{req.purpose}</div>
                                        {req.remarks && (
                                            <div className="text-xs text-slate-500 italic mt-0.5">Remarks: {req.remarks}</div>
                                        )}
                                    </td>

                                    <td className="py-4 px-4 text-xs text-slate-400">
                                        {new Date(req.appliedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </td>

                                    <td className="py-4 px-4">
                                        {req.status === 'PENDING' && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-400 border border-amber-800/50">
                          <Clock className="w-3 h-3 mr-1 animate-spin" /> PENDING
                        </span>
                                        )}
                                        {req.status === 'APPROVED' && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> APPROVED
                        </span>
                                        )}
                                        {req.status === 'REJECTED' && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-400 border border-rose-800/50">
                          <XCircle className="w-3 h-3 mr-1" /> REJECTED
                        </span>
                                        )}
                                    </td>

                                    <td className="py-4 px-4 text-right">
                                        {req.status === 'PENDING' ? (
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    id={`approve-btn-${req.requestId}`}
                                                    onClick={() => openActionModal(req, 'approve')}
                                                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-1"
                                                >
                                                    <Check className="w-3.5 h-3.5" />
                                                    <span>Approve</span>
                                                </button>
                                                <button
                                                    id={`reject-btn-${req.requestId}`}
                                                    onClick={() => openActionModal(req, 'reject')}
                                                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-600/80 hover:bg-rose-600 text-white transition-all flex items-center space-x-1"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                    <span>Reject</span>
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-500 font-medium">Processed</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Action Confirmation Modal */}
            {selectedReq && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
                    <div className="glass-card bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-6">

                        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                            <h3 className="font-extrabold text-lg text-white capitalize">
                                {modalType === 'approve' ? 'Approve Certificate Request' : 'Reject Certificate Request'}
                            </h3>
                            <button onClick={closeModal} className="p-1 rounded-lg text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {actionError && (
                            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-center space-x-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{actionError}</span>
                            </div>
                        )}

                        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                            <p><span className="text-slate-400">Student:</span> <strong className="text-slate-200">{selectedReq.fullName}</strong> ({selectedReq.enrollmentNo})</p>
                            <p><span className="text-slate-400">Department:</span> <strong className="text-slate-200">{selectedReq.department}</strong></p>
                            <p><span className="text-slate-400">Purpose:</span> <strong className="text-blue-400">{selectedReq.purpose}</strong></p>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                                {modalType === 'approve' ? 'Approval Remarks / Note' : 'Rejection Reason / Remarks *'}
                            </label>
                            <textarea
                                id="action-remarks-input"
                                rows={3}
                                required={modalType === 'reject'}
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                placeholder={modalType === 'approve' ? 'Approved by HOD' : 'Explain reason for rejection...'}
                                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                            />
                        </div>

                        <div className="flex items-center justify-end space-x-3 pt-2">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700"
                            >
                                Cancel
                            </button>
                            <button
                                id="confirm-modal-action-btn"
                                type="button"
                                disabled={processing}
                                onClick={handleConfirmAction}
                                className={`px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-lg transition-all flex items-center space-x-1.5 ${
                                    modalType === 'approve'
                                        ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                                        : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30'
                                }`}
                            >
                                {processing ? (
                                    <span>Processing...</span>
                                ) : (
                                    <span>Confirm {modalType === 'approve' ? 'Approval & Generate PDF' : 'Rejection'}</span>
                                )}
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
