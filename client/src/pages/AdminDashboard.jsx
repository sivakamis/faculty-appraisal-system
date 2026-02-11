import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Check, X, Filter, Search } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [appraisals, setAppraisals] = useState([]);
    const [filter, setFilter] = useState('All');
    const [yearFilter, setYearFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAppraisal, setSelectedAppraisal] = useState(null);
    const [remarks, setRemarks] = useState('');

    useEffect(() => {
        fetchAppraisals();
    }, []);

    const fetchAppraisals = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get('http://localhost:5000/api/appraisal/admin/all', config);
            setAppraisals(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleStatusUpdate = async (id, status, currentScore) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.put(`/api/appraisal/admin/${id}/status`, { status, score: currentScore, remarks }, config);
            fetchAppraisals();
            setSelectedAppraisal(null);
            setRemarks('');
        } catch (error) {
            console.error(error);
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

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                    <p className="text-gray-500 mt-1">Manage and review faculty appraisals</p>
                </div>

                <div className="flex items-center space-x-4">
                    <select
                        value={yearFilter}
                        onChange={(e) => setYearFilter(e.target.value)}
                        className="bg-white border border-gray-200 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        {uniqueYears.map(year => (
                            <option key={year} value={year}>{year === 'All' ? 'All Years' : year}</option>
                        ))}
                    </select>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search faculty..."
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex space-x-2 overflow-x-auto">
                    {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${filter === status
                                ? 'bg-secondary-600 text-white shadow-md'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Faculty Details</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Year</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Publications</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredAppraisals.map((appraisal) => (
                                <tr key={appraisal._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center text-white font-bold text-sm">
                                                {appraisal.faculty?.name.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-bold text-gray-900">{appraisal.faculty?.name}</div>
                                                <div className="text-sm text-gray-500">{appraisal.faculty?.department}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                                        {appraisal.academic_year}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        <span className="bg-blue-50 text-blue-700 py-1 px-3 rounded-full text-xs font-semibold">
                                            {appraisal.publications.length} Items
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${appraisal.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                                            appraisal.status === 'Rejected' ? 'bg-red-100 text-red-800 border border-red-200' :
                                                'bg-amber-100 text-amber-800 border border-amber-200'
                                            }`}>
                                            {appraisal.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                        <button
                                            onClick={() => {
                                                setSelectedAppraisal(appraisal);
                                                setRemarks(appraisal.remarks || '');
                                            }}
                                            className="text-primary-600 hover:text-primary-900 border border-primary-200 bg-primary-50 px-3 py-1 rounded-lg transition-colors"
                                        >
                                            Review
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredAppraisals.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                        No appraisals found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>


            {/* Review Modal */}
            {
                selectedAppraisal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">Appraisal Review</h3>
                                    <p className="text-sm text-gray-500">{selectedAppraisal.faculty?.name} - {selectedAppraisal.academic_year}</p>
                                </div>
                                <button onClick={() => setSelectedAppraisal(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {[
                                    { title: 'Publications', data: selectedAppraisal.publications },
                                    { title: 'Projects', data: selectedAppraisal.projects },
                                    { title: 'Achievements', data: selectedAppraisal.achievements },
                                    { title: 'Certifications', data: selectedAppraisal.certifications }
                                ].map((section, idx) => (
                                    <div key={idx}>
                                        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">{section.title}</h4>
                                        {section.data && section.data.length > 0 ? (
                                            <ul className="list-disc list-inside space-y-1 text-gray-600 bg-gray-50 p-4 rounded-lg">
                                                {section.data.map((item, i) => (
                                                    <li key={i}>{item}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-400 italic text-sm pl-2">No {section.title.toLowerCase()} listed.</p>
                                        )}
                                    </div>
                                ))}

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Admin Remarks</label>
                                    <textarea
                                        value={remarks}
                                        onChange={(e) => setRemarks(e.target.value)}
                                        placeholder="Add feedback or reasons for approval/rejection..."
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow min-h-[100px]"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
                                <button
                                    onClick={() => handleStatusUpdate(selectedAppraisal._id, 'Rejected', selectedAppraisal.score)}
                                    className="px-6 py-2 bg-white text-red-600 border border-red-200 rounded-xl hover:bg-red-50 font-medium transition-colors flex items-center"
                                >
                                    <X className="w-4 h-4 mr-2" /> Reject
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate(selectedAppraisal._id, 'Approved', selectedAppraisal.score + 10)}
                                    className="px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium shadow-lg shadow-primary-500/30 transition-all flex items-center"
                                >
                                    <Check className="w-4 h-4 mr-2" /> Approve
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default AdminDashboard;
