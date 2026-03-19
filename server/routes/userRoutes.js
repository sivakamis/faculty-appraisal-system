const express = require('express');
const { getFaculty, getFacultyProfile, getAdminStats, getAllFaculty } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/faculty', protect, getFaculty);
router.get('/profile/:id', protect, getFacultyProfile);
router.get('/admin/stats', protect, admin, getAdminStats);
router.get('/admin/faculty', protect, admin, getAllFaculty);

module.exports = router;
