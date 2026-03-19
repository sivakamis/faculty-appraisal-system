import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Search, UserCheck, Star, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const StudentFeedback = () => {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [facultyList, setFacultyList] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [loading, setLoading] = useState(false);

    // Feedback State
    const [feedback, setFeedback] = useState({
        teachingClarity: 3,
        communication: 3,
        subjectKnowledge: 3,
        interaction: 3,
        comments: ''
    });

    const searchFaculty = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`/api/users/faculty?search=${searchQuery}`, config);
            setFacultyList(data);
        } catch (error) {
            toast.error('Failed to search faculty');
            console.error(error);
        }
    };

    useEffect(() => {
        searchFaculty();
    }, [searchQuery]);

    const handleRatingChange = (field, value) => {
        setFeedback(prev => ({ ...prev, [field]: value }));
    };

    const submitFeedback = async (e) => {
        e.preventDefault();
        if (!selectedFaculty) return toast.error('Please select a faculty member first.');

        setLoading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const payload = { ...feedback, facultyId: selectedFaculty._id };
            await axios.post('/api/feedback', payload, config);

            toast.success(`Feedback submitted for ${selectedFaculty.name}!`);
            setSelectedFaculty(null);
            setFeedback({ teachingClarity: 3, communication: 3, subjectKnowledge: 3, interaction: 3, comments: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit feedback');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const RatingRow = ({ label, field, value }) => (
        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 mb-3">
            <span className="font-semibold text-gray-700 mb-2 md:mb-0">{label}</span>
            <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(field, star)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${value >= star ? 'bg-amber-400 text-white shadow-md' : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                            }`}
                    >
                        <Star className={`w-5 h-5 ${value >= star ? 'fill-current' : ''}`} />
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-8 space-y-6 animate-fade-in max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Faculty Feedback</h1>
                    <p className="text-gray-500 mt-1">Search for your professors and submit performance feedback.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Search & List */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by name or department..."
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {facultyList.length > 0 ? facultyList.map(faculty => (
                                <div
                                    key={faculty._id}
                                    onClick={() => setSelectedFaculty(faculty)}
                                    className={`p-4 rounded-xl cursor-pointer transition-all flex items-center border ${selectedFaculty?._id === faculty._id
                                            ? 'bg-primary-50 border-primary-500 shadow-sm'
                                            : 'bg-white border-gray-100 hover:border-primary-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${selectedFaculty?._id === faculty._id ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                        <UserCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className={`font-bold ${selectedFaculty?._id === faculty._id ? 'text-primary-800' : 'text-gray-800'}`}>{faculty.name}</h4>
                                        <p className="text-xs text-gray-500">{faculty.department} • {faculty.designation}</p>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-center text-gray-500 py-4">No faculty found.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Feedback Form */}
                <div className="lg:col-span-2">
                    {selectedFaculty ? (
                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 animate-fade-in relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-full -z-10"></div>

                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Evaluate {selectedFaculty.name}</h2>
                            <p className="text-sm text-gray-500 mb-6 pb-4 border-b border-gray-100">Department of {selectedFaculty.department}</p>

                            <form onSubmit={submitFeedback} className="space-y-2">
                                <RatingRow label="Teaching Clarity" field="teachingClarity" value={feedback.teachingClarity} />
                                <RatingRow label="Communication Skills" field="communication" value={feedback.communication} />
                                <RatingRow label="Subject Knowledge" field="subjectKnowledge" value={feedback.subjectKnowledge} />
                                <RatingRow label="Interaction with Students" field="interaction" value={feedback.interaction} />

                                <div className="mt-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Additional Comments (Optional)</label>
                                    <textarea
                                        rows="4"
                                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none"
                                        placeholder="Share any specific feedback about their teaching style..."
                                        value={feedback.comments}
                                        onChange={(e) => setFeedback(prev => ({ ...prev, comments: e.target.value }))}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-4 mt-6 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-primary-500/30 transition-all flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? 'Submitting...' : (
                                        <>
                                            <Send className="w-5 h-5 mr-2" />
                                            Submit Feedback
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-white h-full min-h-[400px] flex gap-4 flex-col items-center justify-center p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                                <Search className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-400">Select a Faculty Member</h3>
                            <p className="text-gray-400 max-w-sm">Use the search panel on the left to find a professor and provide your feedback.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentFeedback;
