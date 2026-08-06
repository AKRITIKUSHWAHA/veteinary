const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: 'error', message: 'Please provide email and password' });
        }

        // Check if user exists by email or username
        const [users] = await db.query('SELECT * FROM users WHERE email = ? OR username = ?', [email, email]);

        if (users.length === 0) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        }

        const user = users[0];

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        }

        // Check if account is active
        if (user.status !== 'Active') {
            return res.status(403).json({ status: 'error', message: 'User account is suspended or inactive' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            process.env.JWT_SECRET || 'secretkey123',
            { expiresIn: '8h' }
        );

        // Send response
        res.json({
            status: 'success',
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    profile_image: user.profile_image
                }
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ status: 'error', message: 'Server error during login', error: error.message });
    }
};

// @desc    Register new clinic & admin account
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const {
            businessName,
            adminName,
            email,
            mobile,
            password,
            confirmPassword,
            selectedPlan = 'free-trial'
        } = req.body;

        // 1. Basic Field Presence Check
        if (!businessName || !adminName || !email || !mobile || !password) {
            return res.status(400).json({ status: 'error', message: 'All registration fields are required' });
        }

        // 2. Length & Format Validations
        if (businessName.trim().length < 3) {
            return res.status(400).json({ status: 'error', message: 'Clinic name must be at least 3 characters long' });
        }

        if (adminName.trim().length < 3) {
            return res.status(400).json({ status: 'error', message: 'Admin full name must be at least 3 characters long' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({ status: 'error', message: 'Please provide a valid email address' });
        }

        const mobileClean = mobile.replace(/[^0-9]/g, '');
        if (mobileClean.length < 10) {
            return res.status(400).json({ status: 'error', message: 'Mobile number must contain at least 10 digits' });
        }

        // Password matching check
        if (confirmPassword && password !== confirmPassword) {
            return res.status(400).json({ status: 'error', message: 'Password and Confirm Password do not match' });
        }

        // Password Strength Check
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passRegex.test(password)) {
            return res.status(400).json({
                status: 'error',
                message: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character'
            });
        }

        // 3. Uniqueness Check in Database
        const [existingUsers] = await db.query(
            'SELECT id FROM users WHERE email = ? OR phone = ?',
            [email.trim().toLowerCase(), mobileClean]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: 'This email or mobile number is already registered'
            });
        }

        // 4. Generate Security IDs & Pass Hash
        const userId = crypto.randomUUID ? crypto.randomUUID() : `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const tenantId = crypto.randomUUID ? crypto.randomUUID() : `TEN-${Date.now()}`;
        const adminId = `ADM-${Math.floor(100000 + Math.random() * 900000)}`;
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 5. Calculate Trial Dates
        const trialStartDate = new Date();
        const trialExpiryDate = new Date();
        trialExpiryDate.setDate(trialStartDate.getDate() + 7);

        // 6. Insert User into Users Table
        const username = email.split('@')[0].toLowerCase() + Math.floor(Math.random() * 100);
        await db.query(
            `INSERT INTO users (id, name, email, phone, role, username, password_hash, status) 
             VALUES (?, ?, ?, ?, 'Admin', ?, ?, 'Active')`,
            [userId, adminName.trim(), email.trim().toLowerCase(), mobileClean, username, passwordHash]
        );

        // 7. Return Structured Response
        res.status(201).json({
            status: 'success',
            message: 'Clinic registered successfully',
            data: {
                adminId,
                tenantId,
                email: email.trim().toLowerCase(),
                adminName: adminName.trim(),
                businessName: businessName.trim(),
                selectedPlan,
                trialStartDate,
                trialExpiryDate
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error during registration',
            error: error.message
        });
    }
};

module.exports = { loginUser, registerUser };
