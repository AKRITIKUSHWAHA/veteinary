const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// @desc    Super Admin Login
// @route   POST /api/super-admin/login
// @access  Public
const loginSuperAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ status: 'error', message: 'Please provide email and password' });
        }

        const [users] = await db.query('SELECT * FROM super_admins WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            process.env.JWT_SECRET || 'secretkey123',
            { expiresIn: '8h' }
        );

        res.json({
            status: 'success',
            data: {
                token,
                user: { id: user.id, email: user.email, role: user.role }
            }
        });
    } catch (error) {
        console.error('Super Admin Login error:', error);
        res.status(500).json({ status: 'error', message: 'Server error during login', error: error.message });
    }
};

// @desc    Get All Clinics
// @route   GET /api/super-admin/clinics
// @access  Private (SUPER_ADMIN)
const getClinics = async (req, res) => {
    try {
        // Mocking for now, ideally joins saas_subscriptions and users
        const clinics = [
            { id: '1', name: 'Downtown Vet Clinic', adminName: 'Dr. John Doe', email: 'john@downtown.com', phone: '123-456-7890', currentPlan: 'Pro Plan', trialStatus: 'Expired', subStatus: 'Active', createdDate: '2025-01-10', expiryDate: '2026-01-10' },
            { id: '2', name: 'Pet Care Central', adminName: 'Jane Smith', email: 'jane@petcare.com', phone: '987-654-3210', currentPlan: 'Free Trial', trialStatus: 'Active', subStatus: 'Trial', createdDate: '2026-08-01', expiryDate: '2026-08-15' }
        ];
        res.json({ status: 'success', data: clinics });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch clinics' });
    }
};

// @desc    Get Stats
// @route   GET /api/super-admin/stats
// @access  Private (SUPER_ADMIN)
const getStats = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: {
                totalClinics: 120,
                activeClinics: 105,
                trialClinics: 15,
                expiredTrials: 5,
                paidClinics: 90,
                totalDoctors: 340,
                totalPatients: 15200,
                monthlyRevenue: 45000,
                totalRevenue: 520000,
                openSupportTickets: 12
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch stats' });
    }
};

module.exports = {
    loginSuperAdmin,
    getClinics,
    getStats
};
