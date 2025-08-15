const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    language: { type: String, required: true },
    difficulty: { type: String, required: true, enum: ['Beginner', 'Intermediate', 'Advanced'] },
    author: { type: String, required: true },
    videoUrl: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Note', NoteSchema);