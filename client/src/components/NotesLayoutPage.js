import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaVideo, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import './NotesLayoutPage.css';

const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'youtu.be') return `https://www.youtube.com/embed/${urlObj.pathname.slice(1)}`;
        const videoId = urlObj.searchParams.get('v');
        if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    } catch (error) { console.error("Invalid URL:", url); }
    return '';
};

const compilerUrls = {
    'JavaScript': 'https://www.programiz.com/javascript/online-compiler/',
    'Python': 'https://www.programiz.com/python-programming/online-compiler/',
    'Java': 'https://www.programiz.com/java-programming/online-compiler/',
    'C++': 'https://www.programiz.com/cpp-programming/online-compiler/',
    'React': null,
    'Node.js': 'https://www.programiz.com/javascript/online-compiler/',
    'PHP': 'https://www.programiz.com/php/online-compiler/',
    'Ruby': 'https://replit.com/@replit/Ruby?embed=true',
    'Go': 'https://www.programiz.com/go/online-compiler/',
    'Kotlin': 'https://www.programiz.com/kotlin/online-compiler/',
};

const NotesLayoutPage = () => {
    const { language, difficulty } = useParams();
    const userRole = localStorage.getItem('role');
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('content');

    useEffect(() => {
        const fetchNotes = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:5000/api/notes/${language}/${difficulty}`, { headers: { 'x-auth-token': token } });
                setNotes(res.data);
                setSelectedNote(null);
            } catch (err) {
                console.error('Error fetching notes:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotes();
    }, [language, difficulty]);

    const handleNoteSelect = (note) => {
        setSelectedNote(note);
        setActiveTab('content');
    };

    const handleDelete = async (noteId) => {
        if (window.confirm('Are you sure you want to permanently delete this note?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/notes/${noteId}`, {
                    headers: { 'x-auth-token': token }
                });
                setNotes(notes.filter(note => note._id !== noteId));
                setSelectedNote(null);
            } catch (err) {
                console.error("Failed to delete note:", err);
                alert('Error: Could not delete note.');
            }
        }
    };
    
    const currentIndex = notes.findIndex(note => note._id === selectedNote?._id);

    const handlePreviousNote = () => {
        if (currentIndex > 0) handleNoteSelect(notes[currentIndex - 1]);
    };

    const handleNextNote = () => {
        if (currentIndex < notes.length - 1) handleNoteSelect(notes[currentIndex + 1]);
    };

    const embedUrl = getYouTubeEmbedUrl(selectedNote?.videoUrl);
    const compilerUrl = compilerUrls[language];

    return (
        <Allotment className="notes-layout-container">
            <Allotment.Pane preferredSize={350} minSize={250}>
                <div className="left-panel">
                    <div className="left-panel-header">
                        <button onClick={() => window.history.back()} className="back-to-dashboard-btn">← Back</button>
                        <h3>{language} - {difficulty}</h3>
                        {userRole === 'admin' && (
                            <Link to={`/editor/new/${language}/${difficulty}`} className="new-note-btn-small">+ New</Link>
                        )}
                    </div>
                    <div className="notes-list-condensed">
                        {loading ? <p style={{padding: '1rem'}}>Loading...</p> : notes.map(note => (
                            <div
                                key={note._id}
                                className={`note-list-item ${selectedNote?._id === note._id ? 'active' : ''}`}
                                onClick={() => handleNoteSelect(note)}
                            >
                                {note.videoUrl && <FaVideo className="video-icon-small" />}
                                <span>{note.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </Allotment.Pane>
            
            <Allotment.Pane>
                <div className="right-panel">
                    {selectedNote ? (
                        <div className="note-detail-content">
                            <div className="note-detail-header">
                                <h2>{selectedNote.title}</h2>
                                {userRole === 'admin' && (
                                    <div className="admin-actions">
                                        <button onClick={() => handleDelete(selectedNote._id)} className="action-btn delete-btn">Delete</button>
                                        <Link to={`/editor/${selectedNote._id}`} className="action-btn edit-btn">Edit</Link>
                                    </div>
                                )}
                            </div>
                            <div className="tabs">
                                <button className={`tab-button ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>Note Content</button>
                                {compilerUrl && (
                                    <button className={`tab-button ${activeTab === 'compiler' ? 'active' : ''}`} onClick={() => setActiveTab('compiler')}>Live Compiler</button>
                                )}
                            </div>
                            <div className="tab-content">
                                {activeTab === 'content' ? (
                                    <>
                                        {embedUrl && (
                                            <div className="video-container"><iframe src={embedUrl} title={selectedNote.title} frameBorder="0" allowFullScreen></iframe></div>
                                        )}
                                        <div className="note-content" dangerouslySetInnerHTML={{ __html: selectedNote.content }} />
                                    </>
                                ) : (
                                    <div className="compiler-container"><iframe src={compilerUrl} title={`${language} Compiler`} className="compiler-iframe"></iframe></div>
                                )}
                            </div>
                            <div className="note-navigation">
                                <button onClick={handlePreviousNote} disabled={currentIndex === 0} className="nav-button"><FaChevronLeft /> Previous</button>
                                <button onClick={handleNextNote} disabled={currentIndex === notes.length - 1} className="nav-button">Next <FaChevronRight /></button>
                            </div>
                        </div>
                    ) : (
                        <div className="placeholder-welcome">
                            <div className="welcome-content">
                                <h1>Welcome to {difficulty} {language}!</h1>
                                <p>Select a topic from the list on the left to get started.</p>
                            </div>
                        </div>
                    )}
                </div>
            </Allotment.Pane>
        </Allotment>
    );
};

export default NotesLayoutPage;