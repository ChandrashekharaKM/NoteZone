const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   POST api/auth/register
// @desc    Register a user
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL) {
        return res.status(400).json({ msg: 'This email is reserved' });
    }
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        user = new User({ username, email, password });
        await user.save();

        const payload = { user: { id: user.id, role: 'user' } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, role: 'user', username: user.username });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/login
// @desc    Authenticate user or admin & get token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const payload = { user: { id: 'admin', role: 'admin' } };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });
            return res.json({ token, role: 'admin', username: 'Admin' });
        }
        
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = { user: { id: user.id, role: 'user' } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });
        res.json({ token, role: 'user', username: user.username });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/auth/change-password
// @desc    Change user password (will not work for static admin)
router.put('/change-password', auth, async (req, res) => {
    if (req.user.id === 'admin') {
        return res.status(400).json({ msg: 'Admin password must be changed in the .env file.'})
    }
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({msg: 'User not found'});
        
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Incorrect current password' });
        
        if (newPassword.length < 6) return res.status(400).json({ msg: 'Password must be at least 6 characters' });
        
        user.password = newPassword;
        await user.save();
        res.json({ msg: 'Password updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;