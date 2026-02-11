import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Send, FileText } from 'lucide-react';

const AppraisalForm = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        academic_year: '',
        publications: '',
        projects: '',
        achievements: '',
        certifications: ''
    });
    const [error, setError] = useState('');
    const { id } = useParams();
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (id) {
            const fetchAppraisal = async () => {
                try {
                    const config = {
                        headers: { Authorization: `Bearer ${user.token}` },
                    };
                    const { data } = await axios.get('/api/appraisal/my', config);
                    const appraisal = data.find(a => a._id === id);
                    if (appraisal) {
                        setFormData({
                            academic_year: appraisal.academic_year,
                            publications: appraisal.publications.join(', '),
                            projects: appraisal.projects.join(', '),
                            achievements: appraisal.achievements.join(', '),
                            certifications: appraisal.certifications ? appraisal.certifications.join(', ') : ''
                        });
                    }
                } catch (error) {
                    console.error(error);
                }
            };
            fetchAppraisal();
        }
    }, [id, user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const payload = {
                ...formData,
                publications: formData.publications.split(',').map(item => item.trim()).filter(i => i),
                projects: formData.projects.split(',').map(item => item.trim()).filter(i => i),
                achievements: formData.achievements.split(',').map(item => item.trim()).filter(i => i),
                certifications: formData.certifications.split(',').map(item => item.trim()).filter(i => i),
            };

            if (id) {
                await axios.put(`/api/appraisal/${id}`, payload, config);
                setSuccess('Appraisal updated successfully!');
            } else {
                await axios.post('/api/appraisal', payload, config);
                setSuccess('Appraisal submitted successfully!');
            }
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (error) {
            setError(error.response?.data?.message || 'Submission failed');
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 animate-slide-up">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-secondary-800 to-secondary-600 p-8 text-white">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold">{id ? 'Edit Appraisal' : 'Submit New Appraisal'}</h2>
                    </div>
                    <p className="text-secondary-100 opacity-90">Fill out the details of your academic contributions for the current year.</p>
                </div>

                <div className="p-8">
                    {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 flex items-center"><span className="mr-2">⚠️</span>{error}</div>}
                    {success && <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6 flex items-center"><span className="mr-2">✅</span>{success}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-1">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Academic Year</label>
                                <input
                                    type="text"
                                    name="academic_year"
                                    value={formData.academic_year}
                                    onChange={handleChange}
                                    placeholder="e.g., 2023-2024"
                                    className="input-field"
                                    required
                                />
                                <p className="text-xs text-gray-400 mt-1">Format: YYYY-YYYY</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Publications</label>
                            <textarea
                                name="publications"
                                value={formData.publications}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Enter your publications separated by commas (e.g., 'Journal of AI Research, IEEE Conference 2023')"
                                className="input-field resize-none"
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Projects Guided</label>
                            <textarea
                                name="projects"
                                value={formData.projects}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Enter project titles separated by commas"
                                className="input-field resize-none"
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Achievements / Awards</label>
                            <textarea
                                name="achievements"
                                value={formData.achievements}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Enter awards or achievements separated by commas"
                                className="input-field resize-none"
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Certifications</label>
                            <textarea
                                name="certifications"
                                value={formData.certifications}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Enter certifications separated by commas"
                                className="input-field resize-none"
                            ></textarea>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <button type="button" onClick={() => navigate('/dashboard')} className="mr-4 px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition-colors">
                                Cancel
                            </button>
                            <button type="submit" className="btn-primary flex items-center space-x-2">
                                <Send className="w-4 h-4" />
                                <span>{id ? 'Update Appraisal' : 'Submit Appraisal'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AppraisalForm;
