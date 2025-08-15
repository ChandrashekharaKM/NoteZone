import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './NotesEditorPage.css';

const NotesEditorPage = () => {
    const { noteId, language, difficulty } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [originalNote, setOriginalNote] = useState(null);
    const isNewNote = !noteId;

    useEffect(() => {
        if (!isNewNote) {
            const fetchNote = async () => {
                const token = localStorage.getItem('token');
                try {
                    const res = await axios.get(`http://localhost:5000/api/notes/${noteId}`, {
                        headers: { 'x-auth-token': token }
                    });
                    setTitle(res.data.title);
setContent(res.data.content);
                    setVideoUrl(res.data.videoUrl || '');
                    setOriginalNote(res.data);
                } catch (err) {
                    console.error('Failed to fetch note', err);
                    navigate('/dashboard'); // Redirect if note not found or error
                }
            };
            fetchNote();
        }
    }, [noteId, isNewNote, navigate]);

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        const noteLanguage = language || originalNote?.language;
        const noteDifficulty = difficulty || originalNote?.difficulty;
        
        const noteData = { title, content, videoUrl, language: noteLanguage, difficulty: noteDifficulty };
        
        try {
            if (isNewNote) {
                await axios.post('http://localhost:5000/api/notes', noteData, {
                    headers: { 'x-auth-token': token }
                });
            } else {
                await axios.put(`http://localhost:5000/api/notes/${noteId}`, { title, content, videoUrl }, {
                    headers: { 'x-auth-token': token }
                });
            }
            navigate(`/notes/${noteLanguage}/${noteDifficulty}`);
        } catch (err) {
            console.error('Failed to save note', err);
            alert('Error saving note.');
        }
    };

    return (
        <div className="editor-container">
            <input
                type="text"
                className="title-input"
                placeholder="Note Title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            
            <input
                type="text"
                className="video-url-input"
                placeholder="Reference Video URL (e.g., YouTube link)..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
            />

            <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                className="quill-editor"
            />
            <div className="editor-actions">
                <button onClick={handleSave} className="save-btn">Save Note</button>
                <button onClick={() => navigate(-1)} className="back-btn-editor">Cancel</button>
            </div>
        </div>
    );
};

export default NotesEditorPage;