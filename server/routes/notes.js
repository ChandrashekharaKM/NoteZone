const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Note = require('../models/Note');

const adminCheck = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied. Admin resources.' });
    }
    next();
};

// ... (POST, GET, and PUT routes remain the same)

router.post('/', [auth, adminCheck], async (req, res) => {
    const { title, content, language, difficulty, videoUrl } = req.body;
    try {
        const newNote = new Note({ title, content, language, difficulty, videoUrl, author: req.user.id });
        const note = await newNote.save();
        res.json(note);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/:language/:difficulty', auth, async (req, res) => {
    try {
        const notes = await Note.find({
            language: req.params.language,
            difficulty: req.params.difficulty,
        }).sort({ createdAt: -1 });
        res.json(notes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ msg: 'Note not found' });
        res.json(note);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/:id', [auth, adminCheck], async (req, res) => {
    const { title, content, videoUrl } = req.body;
    try {
        let note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ msg: 'Note not found' });
        note = await Note.findByIdAndUpdate(
            req.params.id,
            { $set: { title, content, videoUrl } },
            { new: true }
        );
        res.json(note);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/notes/:id
// @desc    Delete a note (Admin only)
router.delete('/:id', [auth, adminCheck], async (req, res) => {
    try {
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ msg: 'Note not found' });
        }
        
        // THIS IS THE CORRECTED LINE
        await Note.findByIdAndDelete(req.params.id);
        
        res.json({ msg: 'Note removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;