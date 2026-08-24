import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuthContext.jsx';
import api from '../api/axios';
import {
    ShieldAlert,
    Search,
    Mail,
    CheckCircle2,
    XCircle,
    Clock,
    AlertCircle,
    RefreshCw,
    Building2,
    Users,
    Check,
    X,
    FileText,
    Layers
} from 'lucide-react';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [activeTab, setActiveTab] = useState('REQUESTS');

    const [students, setStudents] = useState([]);
    const [fetchingStudents, setFetchingStudents] = useState(false);

    // Filters & Search
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedDepartment, setSelectedDepartment] = useState('ALL');

    // Modal state for SuperAdmin Overrides / Direct Actions
    const [selectedReq, setSelectedReq] = useState(null);
    const [modalType, setModalType] = useState(''); // 'approve' | 'reject'
    const [remarks, setRemarks] = useState('');
    const [processing, setProcessing] = useState(false);
    const [actionError, setActionError] = useState('');

    const fetchAllSystemRequests = async () => {
        setFetching(true);
        try {
            const res = await api.get('/api/v1/admin/requests');
            setRequests(res.data || []);
        } catch (err) {
            console.error('Failed to fetch system requests', err);
        } finally {
            setFetching(false);
        }
    };

    const fetchAllRegisteredStudents = async () => {
        setFetchingStudents(true);
        try {
            const res = await api.get('/api/v1/admin/students');
            console.log(res);
            setStudents(res.data || []);
        } catch (err) {
            console.error('Failed to fetch registered students', err);
        } finally {
            setFetchingStudents(false);
        }
    };

    const handleRefresh = () => {
        console.log(activeTab);
        if (activeTab === 'REQUESTS') {
            fetchAllSystemRequests();
        } else {
            fetchAllRegisteredStudents();
        }
    };

    useEffect(() => {
        fetchAllSystemRequests();
        fetchAllRegisteredStudents();
    }, []);

    const openActionModal = (req, type) => {
        setSelectedReq(req);
        setModalType(type);
        setRemarks(type === 'approve' ? 'Approved by Super Admin' : '');
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

            setRequests(prev => prev.map(r => r.requestId === selectedReq.requestId ? res.data : r));
            closeModal();
        } catch (err) {
            setActionError(err.response?.data?.message || `Failed to ${modalType} request`);
        } finally {
            setProcessing(false);
        }
    };

    // Filter by Search, Status, and Department
    const filteredRequests = requests.filter(req => {
        const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
        const matchesDept = selectedDepartment === 'ALL' || req.department === selectedDepartment;

        const q = searchQuery.toLowerCase();
        const matchesSearch =
            (req.fullName && req.fullName.toLowerCase().includes(q)) ||
            (req.enrollmentNo && req.enrollmentNo.toLowerCase().includes(q)) ||
            (req.department && req.department.toLowerCase().includes(q)) ||
            (req.purpose && req.purpose.toLowerCase().includes(q));

        return matchesStatus && matchesDept && matchesSearch;
    });

    const filteredStudents = students.filter(student => {
        const matchesDept = selectedDepartment === 'ALL' || student.department === selectedDepartment;

        const q = searchQuery.toLowerCase();
        const matchesSearch =
            (student.fullName && student.fullName.toLowerCase().includes(q)) ||
            (student.enrollmentNo && student.enrollmentNo.toLowerCase().includes(q)) ||
            (student.email && student.email.toLowerCase().includes(q)) ||
            (student.department && student.department.toLowerCase().includes(q));

        return matchesDept && matchesSearch;
    });

    // Global Statistics
    const totalRequests = requests.length;
    const pendingCount = requests.filter(r => r.status === 'PENDING').length;
    const approvedCount = requests.filter(r => r.status === 'APPROVED').length;
    const rejectedCount = requests.filter(r => r.status === 'REJECTED').length;
    const registeredStudentCount = students.length;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

            {/* Header Banner */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-purple-950/30 to-slate-950 relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center space-x-3">
                            <div className="p-2.5 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/20">
                                <ShieldAlert className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-extrabold text-white">Super Admin Control Center</h1>
                                <div className="flex items-center space-x-2 mt-1">
                                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-purple-950 text-purple-300 border border-purple-800">
                                        <Building2 className="w-3.5 h-3.5 mr-1" />
                                        All Departments Scope
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
                                        Admin: {user?.username || 'System Root'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-slate-400 mt-2">
                            Institution-wide oversight for student certificate applications, departmental routing, and approval overrides.
                        </p>
                    </div>

                    {/* Metric Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
                        <div className="px-4 py-2.5 rounded-2xl glass-card bg-purple-950/40 border border-purple-800/40 text-center">
                        <span className="text-xs text-slate-400 block font-medium">Registered Students</span>
                        <span className="text-lg font-bold text-purple-400">{registeredStudentCount}</span>
                    </div>
                    <div className="px-4 py-2.5 rounded-2xl glass-card bg-slate-900/60 border border-slate-800 text-center">
                        <span className="text-xs text-slate-400 block font-medium">Total Requests</span>
                        <span className="text-lg font-bold text-slate-100">{totalRequests}</span>
                    </div>
                        <div className="px-4 py-2.5 rounded-2xl glass-card bg-amber-950/40 border border-amber-800/40 text-center">
                            <span className="text-xs text-slate-400 block font-medium">Pending</span>
                            <span className="text-lg font-bold text-amber-400">{pendingCount}</span>
                        </div>
                        <div className="px-4 py-2.5 rounded-2xl glass-card bg-emerald-950/40 border border-emerald-800/40 text-center">
                            <span className="text-xs text-slate-400 block font-medium">Approved</span>
                            <span className="text-lg font-bold text-emerald-400">{approvedCount}</span>
                        </div>
                        <div className="px-4 py-2.5 rounded-2xl glass-card bg-rose-950/40 border border-rose-800/40 text-center">
                            <span className="text-xs text-slate-400 block font-medium">Rejected</span>
                            <span className="text-lg font-bold text-rose-400">{rejectedCount}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
                <button
                    onClick={() => setActiveTab('REQUESTS')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        activeTab === 'REQUESTS'
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                            : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                >
                    <FileText className="w-4 h-4" />
                    <span>Application Requests ({filteredRequests.length})</span>
                </button>

                <button
                    onClick={() => setActiveTab('STUDENTS')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        activeTab === 'STUDENTS'
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                            : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                >
                    <Users className="w-4 h-4" />
                    <span>Registered Students ({filteredStudents.length})</span>
                </button>
            </div>

            {/* Global Control Bar */}
            <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-4">

                {/* Search Bar */}
                <div className="relative w-full lg:w-72">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        id="admin-search-input"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search student, enrollment, purpose..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    {/* Department Filter Dropdown */}
                    <div className="flex items-center space-x-2">
                        <Layers className="w-4 h-4 text-slate-500" />
                        <select
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                        >
                            <option value="ALL">All Departments</option>
                            <option value="Computer Engineering">Computer Engineering</option>
                            <option value="Mechanical Engineering">Mechanical Engineering</option>
                            <option value="Civil Engineering">Civil Engineering</option>
                            <option value="Medical Electronics">Medical Electronics</option>
                            <option value="Polymer Technology">Polymer Technology</option>

                        </select>
                    </div>

                    {/* Status Filter Buttons */}
                    <div className="flex items-center space-x-1.5">
                        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
                            <button
                                key={st}
                                onClick={() => setStatusFilter(st)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                    statusFilter === st
                                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                                        : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                            >
                                {st}
                            </button>
                        ))}
                    </div>

                    {/* Refresh Button */}
                    <button
                        onClick={handleRefresh}
                        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        title="Refresh Global Queue"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-slate-800">
                {activeTab === 'REQUESTS' ? (
                    fetching ? (
                        <div className="p-12 text-center text-slate-500 text-sm">Loading applications...</div>
                    ) : filteredRequests.length === 0 ? (
                        <div className="p-12 text-center text-slate-500 text-sm">No certificate requests found matching your filter.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm border-collapse">
                                <thead>
                                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                                    <th className="py-3 px-4">Student</th>
                                    <th className="py-3 px-4">Department / Year</th>
                                    <th className="py-3 px-4">Purpose</th>
                                    <th className="py-3 px-4">Applied Date</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4 text-right">SuperAdmin Override</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60">
                                {filteredRequests.map((req) => (
                                    <tr key={req.requestId} className="hover:bg-slate-900/40 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="font-bold text-slate-200">{req.fullName || req.username}</div>
                                            <div className="text-xs text-slate-500">{req.enrollmentNo || req.username}</div>
                                        </td>
                                        <td className="py-4 px-4 text-xs">
                                                <span className="inline-block px-2 py-0.5 rounded-md bg-slate-800 text-purple-300 font-medium mb-1">
                                                    {req.department}
                                                </span>
                                            <div className="text-slate-400">{req.yearOfStudy || 'N/A'}</div>
                                        </td>
                                        <td className="py-4 px-4 max-w-xs">
                                            <div className="font-medium text-slate-300 truncate">{req.purpose}</div>
                                            {req.remarks && (
                                                <div className="text-xs text-slate-500 italic mt-0.5 truncate">
                                                    Note: {req.remarks}
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 text-xs text-slate-400">
                                            {new Date(req.appliedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="py-4 px-4">
                                            {req.status === 'PENDING' && (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-400 border border-amber-800/50">
                                                        <Clock className="w-3 h-3 mr-1 animate-spin" /> PENDING
                                                    </span>
                                            )}
                                            {req.status === 'APPROVED' && (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
                                                        <CheckCircle2 className="w-3 h-3 mr-1" /> APPROVED
                                                    </span>
                                            )}
                                            {req.status === 'REJECTED' && (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-400 border border-rose-800/50">
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
                    )
                ) : (
                    /* Registered Students Table */
                    fetchingStudents ? (
                        <div className="p-12 text-center text-slate-500 text-sm">Loading registered students directory...</div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="p-12 text-center text-slate-500 text-sm">No registered students found matching your criteria.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm border-collapse">
                                <thead>
                                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                                    <th className="py-3 px-4">Student Details</th>
                                    <th className="py-3 px-4">Enrollment No</th>
                                    <th className="py-3 px-4">Department</th>
                                    <th className="py-3 px-4">Year / Semester</th>
                                    <th className="py-3 px-4">Contact</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60">
                                {filteredStudents.map((st) => (
                                    <tr key={st.id || st.userId || st.enrollmentNo} className="hover:bg-slate-900/40 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold text-xs border border-purple-500/20">
                                                    {st.fullName ? st.fullName.charAt(0).toUpperCase() : 'S'}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-200">{st.fullName}</div>
                                                    <div className="text-xs text-slate-500">@{st.user.username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 font-mono text-xs text-purple-300 font-semibold">
                                            {st.enrollmentNo || 'N/A'}
                                        </td>
                                        <td className="py-4 px-4">
                                                <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-800 text-purple-300">
                                                    {st.department || 'N/A'}
                                                </span>
                                        </td>
                                        <td className="py-4 px-4 text-xs text-slate-300">
                                            {st.yearOfStudy ? `Year ${st.yearOfStudy}` : 'N/A'}
                                            {st.semester ? ` (Sem ${st.academicYear})` : ''}
                                        </td>
                                        <td className="py-4 px-4 text-xs text-slate-400">
                                            <div className="flex items-center space-x-1 text-slate-300">
                                                <Mail className="w-3 h-3 text-slate-500" />
                                                <span>{st.user.email || 'N/A'}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )
                )}
            </div>

            {/* SuperAdmin Action Modal */}
            {selectedReq && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
                    <div className="glass-card bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-6">

                        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                            <h3 className="font-extrabold text-lg text-white capitalize">
                                {modalType === 'approve' ? 'Admin Approval & PDF Generation' : 'Admin Rejection'}
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
                            <p><span className="text-slate-400">Department:</span> <strong className="text-purple-300">{selectedReq.department}</strong></p>
                            <p><span className="text-slate-400">Purpose:</span> <strong className="text-slate-200">{selectedReq.purpose}</strong></p>
                            <p><span className="text-slate-400">Current Status:</span> <strong className="text-amber-400">{selectedReq.status}</strong></p>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                                {modalType === 'approve' ? 'Approval Remarks / Note' : 'Rejection Reason *'}
                            </label>
                            <textarea
                                rows={3}
                                required={modalType === 'reject'}
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                placeholder={modalType === 'approve' ? 'Approved by Super Admin' : 'Reason for rejection...'}
                                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
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