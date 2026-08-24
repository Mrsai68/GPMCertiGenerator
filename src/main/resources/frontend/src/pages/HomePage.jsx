import React from 'react';
import {
    ShieldCheck,
    FileText,
    CheckCircle,
    Download,
    ArrowRight,
    Zap,
    Users,
    Lock
} from 'lucide-react';
import {Link} from "react-router-dom";

export default function BonafideLandingPage() {
    return (
        <div className="min-h-screen bg-[#060814] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">

            {/* 2. Hero Section */}
            <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 px-6 overflow-hidden">
                {/* Background Glows */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold mb-6">
                        <Zap className="w-3.5 h-3.5" /> Fast & Automated Certificate Issuance
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight md:leading-tight mb-6 bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                        Generate & Verify Bonafide Certificates Instantly
                    </h1>

                    <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        A seamless, paperless portal for students and faculty to request, approve, and download digitally verified bonafide certificates online.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                         <Link to="/login">
                             <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold transition shadow-xl shadow-blue-600/30">
                            Apply for Certificate <ArrowRight className="w-4 h-4" />
                            </button>
                         </Link>
                        <a
                            href="#process"
                            className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/80 font-semibold text-slate-300 transition"
                        >
                            Learn More
                        </a>
                    </div>
                </div>
            </section>

            {/* 3. Features Section */}
            <section id="features" className="py-16 px-6 border-t border-slate-800/60 bg-[#090d20]/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <h2 className="text-2xl md:text-3xl font-bold mb-3">Why Use Smart Bonafide?</h2>
                        <p className="text-slate-400 text-sm md:text-base">Designed to eliminate manual queues and paper-heavy workflows.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/40 transition">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Instant Application</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Submit certificate requests in under a minute with pre-filled profile data and simple reason selections.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/40 transition">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                                <Lock className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">QR Code Verification</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Every generated PDF comes with a tamper-proof digital signature and a scannable QR verification code.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/40 transition">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                                <Users className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Multi-Tier Approvals</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Streamlined approval routing for HODs, Clerks, and Principals to clear batches with one click.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. How It Works Section */}
            <section id="process" className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-2xl md:text-3xl font-bold mb-3">Simple 3-Step Process</h2>
                        <p className="text-slate-400 text-sm md:text-base">Get your official certificate without visiting the administration office.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-blue-400 text-xl font-bold mb-5 shadow-lg shadow-blue-500/10">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">1. Submit Request</h3>
                            <p className="text-slate-400 text-sm">
                                Log in and choose your certificate purpose (Scholarship, Passport, Bus Pass, etc.).
                            </p>
                        </div>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-blue-400 text-xl font-bold mb-5 shadow-lg shadow-blue-500/10">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">2. Staff Approval</h3>
                            <p className="text-slate-400 text-sm">
                                Your department verifies your enrollment details and approves the request online.
                            </p>
                        </div>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-blue-400 text-xl font-bold mb-5 shadow-lg shadow-blue-500/10">
                                <Download className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">3. Instant Download</h3>
                            <p className="text-slate-400 text-sm">
                                Receive an email alert and download the digitally signed PDF right from your dashboard.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Role Portal Direct Links */}
            <section id="portal-types" className="py-16 px-6 bg-[#090d20]/50 border-t border-slate-800/60">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
                    <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">For Students</span>
                            <h3 className="text-xl font-bold mt-1 mb-3">Student Self-Service</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                Access your certificates, submit renewal requests, and view past documents anytime.
                            </p>
                        </div>
                        <Link to="/login">
                            <button className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold text-sm transition">
                            Access Student Portal
                            </button>
                        </Link>
                    </div>

                    <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">For Faculty & Admin</span>
                            <h3 className="text-xl font-bold mt-1 mb-3">Administrative Desk</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                Approve requests, manage department registers, and maintain audit records effortlessly.
                            </p>
                        </div>
                        <Link to="/login"> <button className="w-full py-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 font-semibold text-sm transition">
                            Staff & Admin Login
                        </button>
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}