const Appraisal = require('../models/Appraisal');
const Feedback = require('../models/Feedback');

// @desc    Submit a new appraisal
// @route   POST /api/appraisal
// @access  Private (Faculty)
const submitAppraisal = async (req, res) => {
    try {
        const { academic_year, publications, projects, achievements, certifications } = req.body;

        const appraisal = new Appraisal({
            faculty: req.user._id,
            academic_year,
            publications,
            projects,
            achievements,
            certifications,
            status: 'Pending'
        });

        const createdAppraisal = await appraisal.save();
        res.status(201).json(createdAppraisal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user's appraisals
// @route   GET /api/appraisal/my
// @access  Private (Faculty)
const getMyAppraisals = async (req, res) => {
    try {
        const appraisals = await Appraisal.find({ faculty: req.user._id });
        res.json(appraisals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update appraisal details
// @route   PUT /api/appraisal/:id
// @access  Private (Faculty)
const updateAppraisal = async (req, res) => {
    try {
        const appraisal = await Appraisal.findById(req.params.id);

        if (appraisal) {
            if (appraisal.faculty.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            if (appraisal.status !== 'Pending') {
                return res.status(400).json({ message: 'Cannot edit processed appraisal' });
            }

            appraisal.academic_year = req.body.academic_year || appraisal.academic_year;
            appraisal.publications = req.body.publications || appraisal.publications;
            appraisal.projects = req.body.projects || appraisal.projects;
            appraisal.achievements = req.body.achievements || appraisal.achievements;
            appraisal.certifications = req.body.certifications || appraisal.certifications;

            const updatedAppraisal = await appraisal.save();
            res.json(updatedAppraisal);
        } else {
            res.status(404).json({ message: 'Appraisal not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete appraisal
// @route   DELETE /api/appraisal/:id
// @access  Private (Faculty)
const deleteAppraisal = async (req, res) => {
    try {
        const appraisal = await Appraisal.findById(req.params.id);

        if (appraisal) {
            if (appraisal.faculty.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }
            await appraisal.deleteOne();
            res.json({ message: 'Appraisal removed' });
        } else {
            res.status(404).json({ message: 'Appraisal not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Get all appraisals with calculated performance scores
// @route   GET /api/appraisal/admin/all
// @access  Private (Admin)
const getAllAppraisals = async (req, res) => {
    try {
        const appraisals = await Appraisal.find({}).populate('faculty', 'name email department');
        
        // Calculate scores for each appraisal
        const enrichedAppraisals = await Promise.all(appraisals.map(async (appraisal) => {
            if (!appraisal.faculty) return appraisal;

            const facultyId = appraisal.faculty._id;

            // 1. Student Feedback (40%)
            const feedbacks = await Feedback.find({ faculty: facultyId });
            let feedbackScore = 0;
            if (feedbacks.length > 0) {
                const avgRating = feedbacks.reduce((acc, f) => {
                    const totalRating = (f.teachingClarity + f.communication + f.subjectKnowledge + f.interaction) / 4;
                    return acc + totalRating;
                }, 0) / feedbacks.length;
                feedbackScore = (avgRating / 5) * 100;
            }

            // 2. Research Publications (30%)
            const researchScore = Math.min(100, (appraisal.publications?.length || 0) * 20);

            // 3. Academic Contributions (20%) - Using projects as academic contributions
            const academicScore = Math.min(100, (appraisal.projects?.length || 0) * 25);

            // 4. Institutional Participation (10%) - Using achievements and certifications
            const participationScore = Math.min(100, ((appraisal.achievements?.length || 0) + (appraisal.certifications?.length || 0)) * 20);

            // Compute Final Score
            const finalScore = Math.round(
                (feedbackScore * 0.4) + 
                (researchScore * 0.3) + 
                (academicScore * 0.2) + 
                (participationScore * 0.1)
            );

            return {
                ...appraisal._doc,
                performanceScore: finalScore,
                scoreBreakdown: {
                    feedback: Math.round(feedbackScore),
                    research: Math.round(researchScore),
                    academic: Math.round(academicScore),
                    participation: Math.round(participationScore)
                }
            };
        }));

        res.json(enrichedAppraisals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update appraisal status
// @route   PUT /api/admin/appraisal/:id/status
// @access  Private (Admin)
const updateAppraisalStatus = async (req, res) => {
    try {
        const appraisal = await Appraisal.findById(req.params.id);

        if (appraisal) {
            appraisal.status = req.body.status || appraisal.status;
            appraisal.remarks = req.body.remarks || appraisal.remarks;
            appraisal.score = req.body.score || appraisal.score;

            const updatedAppraisal = await appraisal.save();
            res.json(updatedAppraisal);
        } else {
            res.status(404).json({ message: 'Appraisal not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    submitAppraisal,
    getMyAppraisals,
    updateAppraisal,
    deleteAppraisal,
    getAllAppraisals,
    updateAppraisalStatus
};
