const express = require('express');
const router = express.Router();
const { loginSuperAdmin, getClinics, getStats } = require('../controllers/superAdminController');
const superAdminAuth = require('../middleware/superAdminAuth');

// Public route for login
router.post('/login', loginSuperAdmin);

// Protected routes (Requires SUPER_ADMIN role)
router.get('/stats', superAdminAuth, getStats);
router.get('/clinics', superAdminAuth, getClinics);

module.exports = router;
