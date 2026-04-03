import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Check, X, Filter, Search, Users, FileText, Clock, CheckCircle, AlertCircle, Bell, ChevronRight, BarChart3, PieChart as PieChartIcon, TrendingUp, Award, BookOpen, UserCheck } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [appraisals, setAppraisals] = useState([]);
    const [facultyList, setFacultyList] = useState([]);
    const [stats, setStats] = useState(null);
    const [activeTab, setActiveTab] = useState('submissions');
    const [filter, setFilter] = useState('All');
    const [yearFilter, setYearFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAppraisal, setSelectedAppraisal] = useState(null);
    const [remarks, setRemarks] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setIsLoading(true);
        try {
            await Promise.all([
                fetchAppraisals(),
                fetchFacultyList(),
                fetchStats()
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAppraisals = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await api.get('/api/appraisal/admin/all', config);
            setAppraisals(data);
        } catch (error) {
            console.error('Error fetching appraisals:', error);
        }
    };

    const fetchFacultyList = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await api.get('/api/users/admin/faculty', config);
            setFacultyList(data);
        } catch (error) {
            console.error('Error fetching faculty:', error);
        }
    };

    const fetchStats = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await api.get('/api/users/admin/stats', config);
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleStatusUpdate = async (id, status, currentScore) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await api.put(`/api/appraisal/admin/${id}/status`, { status, score: currentScore, remarks }, config);
            await fetchAppraisals();
            await fetchStats();
            setSelectedAppraisal(null);
            setRemarks('');
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const uniqueYears = ['All', ...new Set(appraisals.map(a => a.academic_year))];

    const filteredAppraisals = appraisals.filter(appraisal => {
        const matchesStatus = filter === 'All' || appraisal.status === filter;
        const matchesYear = yearFilter === 'All' || appraisal.academic_year === yearFilter;
        const matchesSearch = appraisal.faculty?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appraisal.faculty?.department.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesYear && matchesSearch;
    });

    const filteredFaculty = facultyList.filter(f =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Analytics Data
    const pieData = [
        { name: 'Approved', value: stats?.approved || 0, color: '#10b981' },
        { name: 'Pending', value: stats?.pending || 0, color: '#f59e0b' },
        { name: 'Rejected', value: stats?.rejected || 0, color: '#ef4444' }
    ].filter(item => item.value > 0);

    const barData = appraisals.slice(0, 5).map(a => ({
        name: a.faculty?.name.split(' ')[0],
        publications: a.publications?.length || 0,
        projects: a.projects?.length || 0
    }));

    const StatCard = ({ title, count, icon: Icon, color, bg }) => (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-4 rounded-2xl ${bg} ${color} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7" />
                </div>
                <div className="text-3xl font-black text-slate-800">{count || 0}</div>
            </div>
            <h3 className="text-slate-500 text-xs font-black uppercase tracking-[0.15em]">{title}</h3>
        </div>
    );

    const StatusBadge = ({ status }) => {
        const styles = {
            'Approved': 'bg-emerald-100 text-emerald-700 border-emerald-200',
            'Pending': 'bg-amber-100 text-amber-700 border-amber-200',
            'Rejected': 'bg-rose-100 text-rose-700 border-rose-200'
        };
        return (
            <span className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${styles[status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                {status}
            </span>
        );
    };

    if (isLoading) {
        return (
            <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
                <div className="relative">
                    <div className="absolute inset-0 rounded-full blur-xl bg-primary-500/20 animate-pulse"></div>
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent shadow-2xl relative z-10"></div>
                </div>
                <p className="mt-6 text-slate-500 font-bold animate-pulse tracking-widest uppercase text-xs">Initializing Admin Center...</p>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-10 animate-fade-in max-w-7xl mx-auto pb-20">
            {/* Professional Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 border-l-[6px] border-l-primary-600">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary-50 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-primary-600" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Intelligence Dashboard</h1>
                    </div>
                    <p className="text-slate-500 font-medium ml-10">Comprehensive faculty performance monitoring and appraisal management</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <button 
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm relative group"
                        >
                            <Bell className="w-6 h-6 text-slate-600 group-hover:rotate-12 transition-transform" />
                            {stats?.pending > 0 && (
                                <span className="absolute top-2 right-2 w-3 h-3 bg-rose-500 border-2 border-white rounded-full animate-ping"></span>
                            )}
                            <span className="absolute top-2 right-2 w-3 h-3 bg-rose-500 border-2 border-white rounded-full"></span>
                        </button>
                        {showNotifications && (
                            <div className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 animate-fade-in-up overflow-hidden">
                                <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                    <h4 className="font-black text-xs uppercase tracking-widest text-slate-900">Notifications</h4>
                                    <span className="text-[10px] bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-bold">{stats?.pending} New</span>
                                </div>
                                <div className="p-4 space-y-3">
                                    {stats?.pending > 0 ? (
                                        <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                                            <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs font-bold text-slate-800">New Appraisals Pending</p>
                                                <p className="text-[10px] text-slate-500">There are {stats.pending} submissions awaiting your review.</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-center py-4 text-slate-400 text-xs italic font-medium">No new notifications</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xl shadow-lg border-2 border-white">
                        {user.name.charAt(0)}
                    </div>
                </div>
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Faculty" count={stats?.totalFaculty} icon={Users} color="text-indigo-600" bg="bg-indigo-50" />
                <StatCard title="Pending Review" count={stats?.pending} icon={Clock} color="text-amber-600" bg="bg-amber-50" />
                <StatCard title="Approved" count={stats?.approved} icon={CheckCircle} color="text-emerald-600" bg="bg-emerald-50" />
                <StatCard title="Rejected" count={stats?.rejected} icon={AlertCircle} color="text-rose-600" bg="bg-rose-50" />
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                        <PieChartIcon className="w-4 h-4" /> Appraisal Status Distribution
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Legend verticalAlign="bottom" align="center" iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 lg:col-span-2">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" /> Top Faculty Contributions
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} dy={10} />
                                <YAxis fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} />
                                <Tooltip 
                                    cursor={{fill: '#f8fafc'}}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px' }} />
                                <Bar dataKey="publications" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={24} name="Publications" />
                                <Bar dataKey="projects" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={24} name="Projects" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab('submissions')}
                    className={`px-8 py-3 rounded-xl text-sm font-black transition-all ${activeTab === 'submissions' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Appraisal Submissions
                </button>
                <button
                    onClick={() => setActiveTab('faculty')}
                    className={`px-8 py-3 rounded-xl text-sm font-black transition-all ${activeTab === 'faculty' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Faculty Directory
                </button>
            </div>

            {/* Main Content Area */}
            <div className="space-y-6">
                {/* Search & Filters */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        {activeTab === 'submissions' && (
                            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                                {['All', 'Pending', 'Approved', 'Rejected'].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setFilter(s)}
                                        className={`px-5 py-2 rounded-lg text-xs font-black transition-all uppercase tracking-widest ${filter === s ? 'bg-white text-primary-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}
                        {activeTab === 'submissions' && (
                            <select
                                value={yearFilter}
                                onChange={(e) => setYearFilter(e.target.value)}
                                className="bg-slate-50 border border-slate-100 text-slate-700 py-2.5 px-6 rounded-xl text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all appearance-none cursor-pointer"
                            >
                                {uniqueYears.map(year => (
                                    <option key={year} value={year}>{year === 'All' ? 'All Years' : year}</option>
                                ))}
                            </select>
                        )}
                    </div>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder={activeTab === 'submissions' ? "Filter appraisals..." : "Search faculty directory..."}
                            className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    {activeTab === 'submissions' ? (
                                        <>
                                            <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Faculty & Profile</th>
                                            <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Department</th>
                                            <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Year / Score</th>
                                            <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                            <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                                        </>
                                    ) : (
                                        <>
                                            <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Faculty Member</th>
                                            <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Department</th>
                                            <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Designation</th>
                                            <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact Email</th>
                                            <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Joined Date</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {activeTab === 'submissions' ? (
                                    filteredAppraisals.map((appraisal, index) => (
                                        <tr key={appraisal._id} className={`hover:bg-primary-50/30 transition-colors group cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/20'}`} onClick={() => { setSelectedAppraisal(appraisal); setRemarks(appraisal.remarks || ''); }}>
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-primary-500/20 border-2 border-white">
                                                        {appraisal.faculty?.name.charAt(0)}
                                                    </div>
                                                    <div className="ml-5">
                                                        <div className="text-sm font-black text-slate-900 group-hover:text-primary-600 transition-colors">{appraisal.faculty?.name}</div>
                                                        <div className="text-xs text-slate-500 font-medium">{appraisal.faculty?.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-primary-400"></div>
                                                    <span className="text-sm font-bold text-slate-600">{appraisal.faculty?.department}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-slate-900 mb-1">{appraisal.academic_year}</span>
                                                    {appraisal.performanceScore !== undefined && (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                                <div className="h-full bg-primary-500" style={{ width: `${appraisal.performanceScore}%` }}></div>
                                                            </div>
                                                            <span className="text-[10px] font-black text-primary-600">{appraisal.performanceScore}/100</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <StatusBadge status={appraisal.status} />
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap text-right">
                                                <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-900 text-xs font-black rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm">
                                                    Review Details <ChevronRight className="w-3.5 h-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    filteredFaculty.map((faculty, index) => (
                                        <tr key={faculty._id} className={`hover:bg-primary-50/30 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/20'}`}>
                                            <td className="px-8 py-6 whitespace-nowrap text-sm font-black text-slate-900">{faculty.name}</td>
                                            <td className="px-8 py-6 whitespace-nowrap text-sm font-bold text-slate-600">{faculty.department}</td>
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <span className="px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
                                                    {faculty.designation || 'Faculty'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap text-xs font-bold text-slate-500">{faculty.email}</td>
                                            <td className="px-8 py-6 whitespace-nowrap text-right text-xs font-black text-slate-400">
                                                {new Date(faculty.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        {((activeTab === 'submissions' && filteredAppraisals.length === 0) || (activeTab === 'faculty' && filteredFaculty.length === 0)) && (
                            <div className="p-20 text-center">
                                <Search className="w-16 h-16 mx-auto mb-6 text-slate-200" />
                                <p className="font-black text-slate-400 uppercase tracking-widest text-sm">No synchronized records found</p>
                                <p className="text-slate-300 text-xs mt-2">Try adjusting your filters or search terms</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Appraisal Review Modal */}
            {selectedAppraisal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-950/80 backdrop-blur-xl animate-fade-in overflow-y-auto">
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-4xl max-h-full overflow-hidden flex flex-col animate-slide-up border border-white/20">
                        {/* Modal Header */}
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-6">
                                <div className="h-16 w-16 rounded-[20px] bg-primary-600 text-white flex items-center justify-center text-3xl font-black shadow-xl shadow-primary-500/40 border-4 border-white">
                                    {selectedAppraisal.faculty?.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Appraisal Review</h3>
                                        <StatusBadge status={selectedAppraisal.status} />
                                    </div>
                                    <p className="text-sm font-black text-primary-600 uppercase tracking-[0.3em] mt-1">{selectedAppraisal.academic_year}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedAppraisal(null)} className="p-4 hover:bg-slate-200 rounded-3xl transition-all group active:scale-95">
                                <X className="w-6 h-6 text-slate-500 group-hover:rotate-90 transition-transform" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                                {/* Left Content: Evidence & Data */}
                                <div className="md:col-span-7 space-y-10">
                                    {[
                                        { title: 'Research Publications', data: selectedAppraisal.publications, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50' },
                                        { title: 'Academic Projects', data: selectedAppraisal.projects, icon: FileText, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                                        { title: 'Special Achievements', data: selectedAppraisal.achievements, icon: Award, color: 'text-amber-500', bg: 'bg-amber-50' },
                                        { title: 'Certifications', data: selectedAppraisal.certifications, icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' }
                                    ].map((section, idx) => (
                                        <div key={idx} className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                                            <h4 className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-6">
                                                <div className={`p-2 rounded-xl mr-3 ${section.bg} ${section.color}`}>
                                                    <section.icon className="w-4 h-4" />
                                                </div>
                                                {section.title}
                                            </h4>
                                            {section.data && section.data.length > 0 ? (
                                                <ul className="space-y-3">
                                                    {section.data.map((item, i) => (
                                                        <li key={i} className="flex items-center gap-4 text-slate-700 font-bold bg-white p-4 rounded-2xl text-xs border border-slate-100 shadow-sm transition-all hover:border-primary-100">
                                                            <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <div className="bg-white/50 border border-dashed border-slate-200 p-8 rounded-2xl flex flex-col items-center justify-center opacity-60">
                                                    <section.icon className="w-8 h-8 text-slate-200 mb-2" />
                                                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Digital records empty</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Right Content: Performance Score & Actions */}
                                <div className="md:col-span-5 space-y-8">
                                    {/* Score Card */}
                                    <div className="bg-primary-600 p-8 rounded-[36px] text-white shadow-2xl shadow-primary-900/30 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 -m-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
                                        <div className="relative z-10">
                                            <h4 className="text-[10px] font-black text-primary-200 uppercase tracking-[0.3em] mb-4">Calculated Performance</h4>
                                            <div className="flex items-baseline gap-2 mb-6">
                                                <span className="text-6xl font-black">{selectedAppraisal.performanceScore || 0}</span>
                                                <span className="text-xl text-primary-200 font-bold">/ 100</span>
                                            </div>
                                            
                                            {/* Score Breakdown Bars */}
                                            <div className="space-y-4">
                                                {[
                                                    { label: 'Feedback (40%)', val: selectedAppraisal.scoreBreakdown?.feedback || 0 },
                                                    { label: 'Research (30%)', val: selectedAppraisal.scoreBreakdown?.research || 0 },
                                                    { label: 'Academic (20%)', val: selectedAppraisal.scoreBreakdown?.academic || 0 },
                                                    { label: 'Participation (10%)', val: selectedAppraisal.scoreBreakdown?.participation || 0 }
                                                ].map((bar, i) => (
                                                    <div key={i} className="space-y-2">
                                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                                            <span>{bar.label}</span>
                                                            <span className="text-primary-100">{bar.val}%</span>
                                                        </div>
                                                        <div className="h-1.5 bg-primary-700/50 rounded-full overflow-hidden border border-primary-500/30">
                                                            <div className="h-full bg-white transition-all duration-1000" style={{ width: `${bar.val}%` }}></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Admin Remarks */}
                                    <div className="space-y-4">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] ml-2">Review Summary & Remarks</label>
                                        <textarea
                                            value={remarks}
                                            onChange={(e) => setRemarks(e.target.value)}
                                            placeholder="Indicate areas of excellence or needed improvement..."
                                            className="w-full p-6 bg-slate-50 border-2 border-slate-100 focus:border-primary-200 focus:bg-white rounded-3xl outline-none transition-all min-h-[160px] text-sm font-bold shadow-inner placeholder:text-slate-300"
                                        ></textarea>
                                    </div>

                                    {/* Action Panel */}
                                    <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 space-y-4">
                                        <button
                                            onClick={() => handleStatusUpdate(selectedAppraisal._id, 'Approved', selectedAppraisal.score)}
                                            className="w-full py-5 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-3"
                                        >
                                            <CheckCircle className="w-5 h-5" /> Authenticate & Approve
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(selectedAppraisal._id, 'Rejected', selectedAppraisal.score)}
                                            className="w-full py-5 bg-white text-rose-600 border-2 border-rose-100 rounded-2xl hover:bg-rose-50 active:scale-95 font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3"
                                        >
                                            <X className="w-5 h-5" /> Decline Submission
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
