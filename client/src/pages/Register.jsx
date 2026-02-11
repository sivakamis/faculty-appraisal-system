import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        department: '',
        designation: '',
        role: 'faculty'
    });
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        console.log('Submitting registration form:', formData);

        try {
            const res = await register(formData);
            console.log('Registration response:', res);
            if (res.success) {
                toast.success('Registration successful! Please login.', { duration: 4000 });
                navigate('/login');
            } else {
                toast.error(res.message || 'Registration failed');
            }
        } catch (err) {
            console.error('Registration handleSubmit error:', err);
            toast.error('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 relative overflow-hidden py-12">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] bg-blue-50 rounded-full blur-[120px] opacity-70"></div>
                <div className="absolute bottom-[0%] left-[0%] w-[50%] h-[50%] bg-primary-50 rounded-full blur-[100px] opacity-70"></div>
            </div>

            <div className="glass-panel p-8 rounded-2xl shadow-xl w-full max-w-xl relative z-10 animate-fade-in border border-white/60">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mb-3 shadow-inner">
                        <UserPlus className="w-7 h-7 text-primary-600" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-secondary-900 tracking-tight">Create Account</h3>
                    <p className="text-secondary-500">Join the faculty appraisal system</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-secondary-700 mb-1.5 ml-1">Full Name</label>
                            <input
                                name="name"
                                type="text"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                className="input-field"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-secondary-700 mb-1.5 ml-1">Designation</label>
                            <input
                                name="designation"
                                type="text"
                                placeholder="Assistant Professor"
                                value={formData.designation}
                                onChange={handleChange}
                                className="input-field"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-secondary-700 mb-1.5 ml-1">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="john.doe@university.edu"
                            value={formData.email}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-secondary-700 mb-1.5 ml-1">Department</label>
                        <input
                            name="department"
                            type="text"
                            placeholder="Computer Science"
                            value={formData.department}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-secondary-700 mb-1.5 ml-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-secondary-700 mb-1.5 ml-1">Role</label>
                        <select
                            name="role"
                            onChange={handleChange}
                            className="input-field"
                            value={formData.role}
                        >
                            <option value="faculty">Faculty</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`btn-primary w-full justify-center text-lg mt-4 shadow-lg shadow-primary-500/30 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <span className="animate-spin mr-2">⏳</span>
                                Creating Account...
                            </div>
                        ) : 'Create Account'}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-sm text-secondary-600">Already have an account? <Link to="/login" className="text-primary-600 font-bold hover:text-primary-700 hover:underline transition-colors">Log in</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
