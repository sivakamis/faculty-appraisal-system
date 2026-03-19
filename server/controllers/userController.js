const User = require('../models/User');
const Appraisal = require('../models/Appraisal');
const Feedback = require('../models/Feedback');

// @desc    Get faculty profile with performance score
// @route   GET /api/users/profile/:id
// @access  Private
const getFacultyProfile = async (req, res) => {
    try {
        const facultyId = req.params.id;
        const faculty = await User.findById(facultyId).select('-password');

        if (!faculty || faculty.role !== 'faculty') {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        // 1. Calculate Feedback Score (S_fb) - Weight: 40%
        const feedbacks = await Feedback.find({ faculty: facultyId });
        let feedbackScore = 0;
        if (feedbacks.length > 0) {
            const avgRating = feedbacks.reduce((acc, f) => {
                const totalRating = (f.teachingClarity + f.communication + f.subjectKnowledge + f.interaction) / 4;
                return acc + totalRating;
            }, 0) / feedbacks.length;
            feedbackScore = (avgRating / 5) * 100;
        }

        // 2. Calculate Research & Academic Score from latest Approved Appraisal - Weight: 30% each
        const latestAppraisal = await Appraisal.findOne({ faculty: facultyId, status: 'Approved' }).sort({ createdAt: -1 });

        let researchScore = 0;
        let academicScore = 0;

        if (latestAppraisal) {
            // Research Score (S_res): max 100
            // Publications (20 pts each), Projects (30 pts each)
            researchScore = Math.min(100, (latestAppraisal.publications.length * 20) + (latestAppraisal.projects.length * 30));

            // Academic Score (S_acad): max 100
            // Achievements (25 pts each), Certifications (25 pts each)
            academicScore = Math.min(100, (latestAppraisal.achievements.length * 25) + (latestAppraisal.certifications.length * 25));
        }

        // 3. Compute Final Score
        const finalScore = Math.round((feedbackScore * 0.4) + (researchScore * 0.3) + (academicScore * 0.3));

        res.json({
            faculty,
            scoreBreakdown: {
                finalScore,
                feedbackScore: Math.round(feedbackScore),
                researchScore: Math.round(researchScore),
                academicScore: Math.round(academicScore),
                feedbackCount: feedbacks.length,
                appraisalYear: latestAppraisal ? latestAppraisal.academic_year : 'No approved appraisal'
            }
        });
    } catch (error) {
        console.error('Get Faculty Profile Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all faculty members for search
// @route   GET /api/users/faculty
// @access  Private (Student only initially)
const getFaculty = async (req, res) => {
    try {
        const { search } = req.query;

        let query = { role: 'faculty' };

        if (search) {
            query = {
                ...query,
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { department: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const faculty = await User.find(query).select('-password');
        res.json(faculty);
    } catch (error) {
        console.error('Get Faculty Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get admin statistics
// @route   GET /api/users/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
    try {
        const totalFaculty = await User.countDocuments({ role: 'faculty' });
        const totalSubmissions = await Appraisal.countDocuments();
        const pending = await Appraisal.countDocuments({ status: 'Pending' });
        const approved = await Appraisal.countDocuments({ status: 'Approved' });
        const rejected = await Appraisal.countDocuments({ status: 'Rejected' });

        res.json({
            totalFaculty,
            totalSubmissions,
            pending,
            approved,
            rejected
        });
    } catch (error) {
        console.error('Get Admin Stats Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all faculty for admin
// @route   GET /api/users/admin/faculty
// @access  Private (Admin)
const getAllFaculty = async (req, res) => {
    try {
        const faculty = await User.find({ role: 'faculty' }).select('-password');
        res.json(faculty);
    } catch (error) {
        console.error('Get All Faculty Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { getFaculty, getFacultyProfile, getAdminStats, getAllFaculty };
