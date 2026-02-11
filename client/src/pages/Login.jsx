import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await login(email, password);
        if (res.success) {
            toast.success('Login successful!', { icon: '👏' });
            navigate('/dashboard');
        } else {
            toast.error(res.message || 'Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary-100 rounded-full blur-[100px] opacity-60 animate-blob"></div>
                <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[100px] opacity-60 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[100px] opacity-60 animate-blob animation-delay-4000"></div>
            </div>

            <div className="glass-panel p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md relative z-10 animate-fade-in border border-white/60">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4 shadow-inner">
                        <LogIn className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-3xl font-extrabold text-secondary-900 tracking-tight">Welcome Back</h3>
                    <p className="text-secondary-500 mt-2">Sign in to access your dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-secondary-700 mb-1.5 ml-1">Email Address</label>
                        <input
                            type="email"
                            placeholder="your.email@university.edu"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-secondary-700 mb-1.5 ml-1">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="btn-primary w-full justify-center text-lg mt-2">
                        Sign In
                    </button>
                </form>
                <div className="mt-8 text-center">
                    <p className="text-sm text-secondary-600">Don't have an account? <Link to="/register" className="text-primary-600 font-bold hover:text-primary-700 hover:underline transition-colors">Sign up</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
