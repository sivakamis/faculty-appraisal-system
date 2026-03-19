const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    teachingClarity: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    communication: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    subjectKnowledge: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    interaction: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comments: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', FeedbackSchema);
