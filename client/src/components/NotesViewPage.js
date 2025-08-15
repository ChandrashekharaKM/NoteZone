import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaVideo } from 'react-icons/fa';
import './NotesViewPage.css';

const NotesViewPage = () => {
    const { language, difficulty } = useParams();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userRole = localStorage.getItem('role');

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:5000/api/notes/${language}/${difficulty}`, {
                    headers: { 'x-auth-token': token }
                });
                setNotes(res.data);
            } catch (err) {
                console.error('Error fetching notes:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotes();
    }, [language, difficulty]);

    const handleDelete = async (noteId) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/notes/${noteId}`, {
                    headers: { 'x-auth-token': token }
                });
                setNotes(notes.filter(note => note._id !== noteId));
            } catch (err) {
                 console.error('Error deleting note:', err);
            }
        }
    };

    if (loading) return <p style={{textAlign: 'center', marginTop: '2rem'}}>Loading notes...</p>;

    return (
        <div className="notes-view-container">
            <header className="notes-view-header">
                <button onClick={() => navigate('/dashboard')} className="back-btn">← Back to Dashboard</button>
                {userRole === 'admin' && (
                    <Link to={`/editor/new/${language}/${difficulty}`} className="new-note-btn">
                        + New Note
                    </Link>
                )}
            </header>

            <h1>{language} - {difficulty} Notes</h1>
            
            <div className="notes-list">
                {notes.length > 0 ? (
                    notes.map(note => (
                        <Link to={`/note/${note._id}`} key={note._id} className="note-item-link">
                            <div className="note-item">
                                <div className="note-title">
                                    {note.videoUrl && <FaVideo className="video-icon" />}
                                    <h3>{note.title}</h3>
                                </div>
                                {userRole === 'admin' && (
                                    <div className="note-actions">
                                        <button 
                                            onClick={(e) => { 
                                                e.preventDefault(); // Prevent navigation when clicking delete
                                                handleDelete(note._id); 
                                            }} 
                                            className="action-btn delete-btn"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="no-notes">
                        <p>No notes found. The admin has not added any yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotesViewPage;