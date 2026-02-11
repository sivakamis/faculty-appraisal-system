const express = require('express');
const router = express.Router();
const {
    submitAppraisal,
    getMyAppraisals,
    updateAppraisal,
    deleteAppraisal,
    getAllAppraisals,
    updateAppraisalStatus
} = require('../controllers/appraisalController');
const { protect, admin } = require('../middleware/authMiddleware');

// Faculty Routes
router.route('/').post(protect, submitAppraisal);
router.route('/my').get(protect, getMyAppraisals);
router.route('/:id').put(protect, updateAppraisal).delete(protect, deleteAppraisal);

// Admin Routes
router.route('/admin/all').get(protect, admin, getAllAppraisals);
router.route('/admin/:id/status').put(protect, admin, updateAppraisalStatus);

module.exports = router;
