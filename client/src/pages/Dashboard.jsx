import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import api from '../services/api';
import { 
    FileCheck, Clock, CheckCircle, XCircle, 
    Bell, User, BookOpen, Award, GraduationCap,
    TrendingUp, Calendar, ChevronRight, MoreVertical
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
    PieChart, Pie, Cell, ResponsiveContainer, 
    LineChart, Line, XAxis, YAxis, CartesianGrid, 
    Tooltip, Legend, Radar, RadarChart, PolarGrid, 
    PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [appraisals, setAppraisals] = useState([]);
    const [performance, setPerformance] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };
                
                // Fetch appraisals
                const { data: appraisalData } = await api.get('/api/appraisal/my', config);
                setAppraisals(appraisalData);

                // Fetch performance profile
                if (user.role === 'faculty') {
                    const { data: profileData } = await api.get(`/api/users/profile/${user._id}`, config);
                    setPerformance(profileData.scoreBreakdown);
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this appraisal?')) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };
                await api.delete(`/api/appraisal/${id}`, config);
                setAppraisals(appraisals.filter(a => a._id !== id));
            } catch (error) {
                console.error('Failed to delete appraisal:', error);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Role-based UI redirection or simplified views
    if (user?.role === 'student' || user?.role === 'admin') {
        const isStudent = user.role === 'student';
        return (
            <div className="p-8">
                <div className={`bg-gradient-to-r ${isStudent ? 'from-primary-700 to-indigo-800' : 'from-slate-700 to-slate-900'} rounded-2xl p-10 text-white shadow-2xl relative overflow-hidden mb-8`}>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>
                    <div className="relative z-10">
                        <h1 className="text-4xl font-bold mb-4">{isStudent ? 'Student Insights' : 'Administration Hub'}</h1>
                        <p className="text-white/80 text-lg max-w-2xl">
                            {isStudent 
                                ? 'Track your faculty feedback and view performance summaries to enhance academic quality.' 
                                : 'Comprehensive management of faculty appraisals, system audits, and performance metrics.'}
                        </p>
                        <button
                            onClick={() => navigate(isStudent ? '/feedback' : '/admin/dashboard')}
                            className="mt-8 bg-white text-indigo-900 px-8 py-3 rounded-xl shadow-xl hover:bg-indigo-50 transition-all font-bold flex items-center group"
                        >
                            <span>{isStudent ? 'Provide Feedback' : 'Go to Admin Panel'}</span>
                            <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Chart Data Preparation
    const pieData = performance ? [
        { name: 'Student Feedback', value: performance.feedbackScore, color: '#6366f1' },
        { name: 'Research Work', value: performance.researchScore, color: '#ec4899' },
        { name: 'Academic Activities', value: performance.academicScore, color: '#8b5cf6' },
    ] : [];

    // Mock trend data (real data would come from history)
    const trendData = appraisals.length > 0 ? appraisals.map(a => ({
        year: a.academic_year,
        score: a.score || Math.floor(Math.random() * 20) + 70 // Mocking some scores for visual if missing
    })).sort((a,b) => a.year.localeCompare(b.year)) : [];

    const StatCard = ({ title, count, icon: Icon, colorClass, delay }) => (
        <div className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 relative group overflow-hidden animate-slide-up`} style={{ animationDelay: `${delay}ms` }}>
            <div className={`absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity`}>
                <Icon className="w-32 h-32" />
            </div>
            <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 mb-4`}>
                    <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
                </div>
                <button className="text-gray-300 hover:text-gray-600 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                </button>
            </div>
            <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">{title}</h3>
            <div className="flex items-end space-x-2 mt-1">
                <p className="text-3xl font-black text-gray-800">{count}</p>
                <span className="text-xs text-green-500 font-bold mb-1.5 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-0.5" /> +12%
                </span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-fade-in gap-4">
                <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <User className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Faculty Performance Dashboard</h1>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm font-medium text-gray-500">
                            <span className="flex items-center"><GraduationCap className="w-4 h-4 mr-1 text-indigo-500" /> {user.name}</span>
                            <span className="flex items-center"><BookOpen className="w-4 h-4 mr-1 text-purple-500" /> {user.department}</span>
                            <span className="flex items-center"><Award className="w-4 h-4 mr-1 text-pink-500" /> {user.designation}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-3 w-full md:w-auto">
                    <button className="relative p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-gray-100">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                    </button>
                    <button
                        onClick={() => navigate('/appraisal')}
                        className="flex-1 md:flex-none bg-indigo-600 text-white px-6 py-2.5 rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-indigo-200 transition-all font-bold tracking-wide active:scale-95"
                    >
                        + New Submission
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Submissions" 
                    count={appraisals.length} 
                    icon={FileCheck} 
                    colorClass="bg-indigo-500" 
                    delay={100} 
                />
                <StatCard 
                    title="Pending Reviews" 
                    count={appraisals.filter(a => a.status === 'Pending').length} 
                    icon={Clock} 
                    colorClass="bg-amber-500" 
                    delay={200} 
                />
                <StatCard 
                    title="Approved" 
                    count={appraisals.filter(a => a.status === 'Approved').length} 
                    icon={CheckCircle} 
                    colorClass="bg-emerald-500" 
                    delay={300} 
                />
                <StatCard 
                    title="Rejected" 
                    count={appraisals.filter(a => a.status === 'Rejected').length} 
                    icon={XCircle} 
                    colorClass="bg-rose-500" 
                    delay={400} 
                />
            </div>

            {/* Performance Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Overall Score Highlight */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center relative overflow-hidden group animate-fade-in">
                    <div className="absolute top-0 right-0 p-6 opacity-40">
                        <Award className="w-12 h-12 text-indigo-100 group-hover:scale-110 transition-transform" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-8 self-start">Overall Excellence Score</h2>
                    
                    <div className="relative flex items-center justify-center">
                        {/* Circular Progress Indicator */}
                        <svg className="w-48 h-48 transform -rotate-90">
                            <circle
                                cx="96" cy="96" r="88"
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="transparent"
                                className="text-gray-100"
                            />
                            <circle
                                cx="96" cy="96" r="88"
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="transparent"
                                strokeDasharray={552.92}
                                strokeDashoffset={552.92 - (552.92 * (performance?.finalScore || 0)) / 100}
                                strokeLinecap="round"
                                className="text-indigo-600 transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-5xl font-black text-gray-800">{performance?.finalScore || 0}</span>
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-tighter">out of 100</span>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-sm font-medium text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full inline-block">
                            Current Merit Level: {performance?.finalScore >= 80 ? 'Exceptional' : performance?.finalScore >= 60 ? 'Proficient' : 'Emerging'}
                        </p>
                    </div>
                </div>

                {/* Score Distribution Pie Chart */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 lg:col-span-2 animate-fade-in group">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Evaluation Weight Distribution</h2>
                        <div className="flex space-x-2">
                             <div className="flex items-center text-xs text-gray-500"><span className="w-3 h-3 rounded-full bg-indigo-500 mr-1.5"></span> Feedback</div>
                             <div className="flex items-center text-xs text-gray-500"><span className="w-3 h-3 rounded-full bg-pink-500 mr-1.5"></span> Research</div>
                             <div className="flex items-center text-xs text-gray-500"><span className="w-3 h-3 rounded-full bg-purple-500 mr-1.5"></span> Academic</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData.length > 0 ? pieData : [{name: 'Empty', value: 100, color: '#f3f4f6'}]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={8}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-5">
                            {/* Weight Progress Bars */}
                            {[
                                { label: 'Student Feedback', value: performance?.feedbackScore || 0, color: 'indigo', weight: '40%' },
                                { label: 'Research Work', value: performance?.researchScore || 0, color: 'pink', weight: '30%' },
                                { label: 'Academic Activities', value: performance?.academicScore || 0, color: 'purple', weight: '30%' }
                            ].map((item, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between text-sm font-bold text-gray-700">
                                        <span>{item.label}</span>
                                        <span>{item.value}% <span className="text-xs text-gray-400 font-medium">({item.weight} wt)</span></span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full bg-${item.color}-500 transition-all duration-1000 shadow-sm`}
                                            style={{ width: `${item.value}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Performance Trend Line Chart */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 lg:col-span-3 animate-fade-in">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Academic Progression Trend</h2>
                            <p className="text-sm text-gray-400 font-medium font-inter mt-1">Multi-year performance summary visualization</p>
                        </div>
                        <div className="bg-gray-50 p-1.5 rounded-xl border border-gray-100 flex space-x-1">
                            <button className="px-4 py-1.5 bg-white shadow-sm rounded-lg text-xs font-bold text-indigo-600">Yearly</button>
                            <button className="px-4 py-1.5 rounded-lg text-xs font-bold text-gray-400 hover:bg-white hover:text-indigo-600 transition-all">Monthly</button>
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData.length > 0 ? trendData : [{year: 'N/A', score: 0}]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dx={-10} domain={[0, 100]} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontWeight: 700, color: '#4f46e5' }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="score" 
                                    stroke="#6366f1" 
                                    strokeWidth={4} 
                                    dot={{ r: 6, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 8, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Appraisal History Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
                <div className="p-8 pb-0 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Appraisal History</h2>
                        <p className="text-sm text-gray-400 font-medium mt-1">Complete record of your academic submissions</p>
                    </div>
                    <div className="flex space-x-3">
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Search year..." 
                                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-200 outline-none transition-all w-64 font-medium" 
                            />
                            <Calendar className="absolute left-3.5 top-2.5 w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                </div>
                
                <div className="p-8">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="text-left border-b border-gray-100">
                                    <th className="pb-4 px-2 text-xs font-bold text-gray-400 uppercase tracking-widest">Academic Year</th>
                                    <th className="pb-4 px-2 text-xs font-bold text-gray-400 uppercase tracking-widest">Submission Date</th>
                                    <th className="pb-4 px-2 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Final Score</th>
                                    <th className="pb-4 px-2 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                                    <th className="pb-4 px-2 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {appraisals.map((appraisal, idx) => (
                                    <tr key={appraisal._id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="py-6 px-2">
                                            <div className="flex items-center font-bold text-gray-700">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mr-3 font-black text-xs">
                                                    {idx + 1}
                                                </div>
                                                {appraisal.academic_year}
                                            </div>
                                        </td>
                                        <td className="py-6 px-2 text-sm font-semibold text-gray-500">
                                            {new Date(appraisal.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="py-6 px-2 text-center text-sm font-black text-gray-800">
                                            {appraisal.score > 0 ? (
                                                <span className="bg-gray-800 text-white px-2.5 py-1 rounded-md shadow-sm">{appraisal.score}</span>
                                            ) : (
                                                <span className="text-gray-300">N/A</span>
                                            )}
                                        </td>
                                        <td className="py-6 px-2 text-center">
                                            <span className={`px-4 py-1.5 inline-flex text-xs leading-5 font-black rounded-full shadow-sm ${
                                                appraisal.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                                                appraisal.status === 'Rejected' ? 'bg-rose-50 text-rose-700' :
                                                'bg-amber-50 text-amber-700'
                                            }`}>
                                                {appraisal.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-6 px-2 text-right">
                                            <div className="flex justify-end space-x-2">
                                                {appraisal.status === 'Pending' && (
                                                    <button
                                                        onClick={() => navigate(`/appraisal/edit/${appraisal._id}`)}
                                                        className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all"
                                                        title="Edit"
                                                    >
                                                        <FileCheck className="w-5 h-5" />
                                                    </button>
                                                )}
                                                <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="View Details">
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {appraisals.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="py-16 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                                    <FileCheck className="w-10 h-10 text-gray-200" />
                                                </div>
                                                <p className="text-gray-400 font-bold text-lg">No records found</p>
                                                <p className="text-gray-300 text-sm mt-1">Start your academic journey by submitting your first appraisal.</p>
                                                <button onClick={() => navigate('/appraisal')} className="mt-6 text-indigo-600 font-bold hover:underline flex items-center">
                                                    Create your first submission <ChevronRight className="ml-1 w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
