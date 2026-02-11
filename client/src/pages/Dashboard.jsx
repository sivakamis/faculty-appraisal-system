import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FileCheck, Clock, CheckCircle, XCircle } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [appraisals, setAppraisals] = useState([]);

    useEffect(() => {
        const fetchAppraisals = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get('/api/appraisal/my', config);
                setAppraisals(data);
            } catch (error) {
                console.error(error);
            }
        };

        if (user && user.role === 'faculty') {
            fetchAppraisals();
        }

    }, [user]);

    if (user?.role === 'admin') {
        return (
            <div className="p-8">
                <div className="bg-gradient-to-r from-secondary-800 to-secondary-900 rounded-2xl p-8 text-white shadow-xl">
                    <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                    <p className="text-secondary-200">Welcome, Admin! Access the sidebar to manage faculty appraisals.</p>
                </div>
            </div>
        )
    }

    const StatCard = ({ title, count, icon: Icon, color, bg }) => (
        <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 relative overflow-hidden group`}>
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-300`}>
                <Icon className={`w-24 h-24 ${color}`} />
            </div>
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${bg}`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
            <p className="text-3xl font-bold text-gray-800 mt-1">{count}</p>
        </div>
    );

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Overview of your performance and submissions</p>
                </div>
                <button className="bg-primary-600 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-primary-700 transition-colors font-medium">
                    + New Submission
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Submissions"
                    count={appraisals.length}
                    icon={FileCheck}
                    color="text-blue-600"
                    bg="bg-blue-100"
                />
                <StatCard
                    title="Pending Review"
                    count={appraisals.filter(a => a.status === 'Pending').length}
                    icon={Clock}
                    color="text-amber-500"
                    bg="bg-amber-100"
                />
                <StatCard
                    title="Approved"
                    count={appraisals.filter(a => a.status === 'Approved').length}
                    icon={CheckCircle}
                    color="text-emerald-500"
                    bg="bg-emerald-100"
                />
            </div>

            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Academic Year</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted On</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Score</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {appraisals.map((appraisal) => (
                                    <tr key={appraisal._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{appraisal.academic_year}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(appraisal.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {appraisal.score > 0 ? appraisal.score : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${appraisal.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                                                appraisal.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-amber-100 text-amber-800'
                                                }`}>
                                                {appraisal.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {appraisal.status === 'Pending' && (
                                                <button
                                                    onClick={() => navigate(`/appraisal/edit/${appraisal._id}`)}
                                                    className="text-primary-600 hover:text-primary-900 mr-4 font-semibold"
                                                >
                                                    Edit
                                                </button>
                                            )}
                                            <button className="text-secondary-600 hover:text-secondary-900">View Details</button>
                                        </td>
                                    </tr>
                                ))}
                                {appraisals.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                            <FileCheck className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                            <p>No appraisals found. Start by submitting one!</p>
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
