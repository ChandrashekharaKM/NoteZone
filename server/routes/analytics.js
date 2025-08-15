const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Note = require('../models/Note');

// Middleware to check for admin role
const adminCheck = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied. Admin resources.' });
    }
    next();
};

// @route   GET api/analytics/stats
// @desc    Get key application statistics (Admin only)
// @access  Private/Admin
router.get('/stats', [auth, adminCheck], async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const noteCount = await Note.countDocuments();

        // This aggregation query groups notes by language and counts them.
        const notesByLanguage = await Note.aggregate([
            {
                $group: {
                  _id: '$language',
                  count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $project: {
                    language: '$_id',
                    count: 1,
                    _id: 0
                }
            }
        ]);
        
        res.json({
            userCount,
            noteCount,
            notesByLanguage
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;