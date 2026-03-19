const Feedback = require('../models/Feedback');

// @desc    Submit student feedback for a faculty
// @route   POST /api/feedback
// @access  Private (Student only)
const submitFeedback = async (req, res) => {
    const { facultyId, teachingClarity, communication, subjectKnowledge, interaction, comments } = req.body;

    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({ message: 'Only students can submit feedback' });
        }

        const feedback = await Feedback.create({
            student: req.user._id,
            faculty: facultyId,
            teachingClarity,
            communication,
            subjectKnowledge,
            interaction,
            comments
        });

        res.status(201).json({ success: true, data: feedback });
    } catch (error) {
        console.error('Submit Feedback Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { submitFeedback };
