import {AlertCircle, Eye, EyeOff, ShieldCheck} from "lucide-react";
import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import {useAuth} from "../context/useAuthContext.jsx";
import api from "../api/axios.js"

const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        console.log(username + password);

        try {
            const res = await api.post('/api/v1/auth/login', { username, password });
            console.log(res);
            login(res.data);
            console.log(res.data.role);
            if (res.data.role === 'ROLE_HOD') {
                navigate('/hod');
            } if(res.data.role === 'ROLE_ADMIN') {
                navigate('/admin');
            } else {
                navigate('/student-dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || "Invalid Username or password");
        } finally {
            setLoading(false);
        }
    };

    function togglePassVisible() {
        setShowPassword((prev) => !prev);
    }

    return (<>
        <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md ">
            <div className="glass-card p-8 rounded-3xl shadow-2xl border border-slate-800/80">

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/20 mb-4">
                        <ShieldCheck className="" />
                    </div>
                    <h2 className="font-bold text-2xl">Login to SMART BONAFIDE</h2>
                    <p className="text-slate-400 text-sm mt-2">Sign in to Acess to SMART BONAFIDE PORTAL</p>
                </div>

                {/*Error Show*/}
                {error &&(
                    <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-sm flex items-center space-x-3">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                            Username / User ID
                        </label>
                        <div className="relative">

                            <input
                                id="login-username-input"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username"
                                className="w-full pl-5 pr-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                Password
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                Forgot Password?
                            </Link>
                        </div>
                        <div className="relative">
                            <input
                                id="login-password-input"
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-5 pr-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                            />
                            <span className="flex justify-around intems-center absolute right-4 inset-y-3 text-sm" onClick={togglePassVisible}>
                                {showPassword ? <Eye /> : <EyeOff />}
                            </span>
                        </div>
                    </div>

                    <button
                        id="login-submit-btn"
                        type="submit"
                        className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all duration-200 flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
                    >
                        { !loading ? 'Submit' : 'Loading' } </button>
                </form>
                <div className="text-slate-400 text-sm mt-5">
                    <p>Don't have an Account? <span className="text-blue-600"><Link to={"/register"}>Register new account</Link></span></p>
                </div>
            </div>
            </div>
        </div>
    </>)
}

export default Login