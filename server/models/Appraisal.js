const mongoose = require('mongoose');

const AppraisalSchema = new mongoose.Schema({
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    academic_year: { type: String, required: true },
    publications: [{ type: String }], // Simplified for MVP, can be object array
    projects: [{ type: String }],
    achievements: [{ type: String }],
    certifications: [{ type: String }],
    score: { type: Number, default: 0 },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    remarks: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Appraisal', AppraisalSchema);
