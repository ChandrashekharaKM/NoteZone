import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminNotesPage.css';

const languages = ['JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'PHP', 'Ruby', 'Go', 'Kotlin'];
const levels = ['Beginner', 'Intermediate', 'Advanced'];

export default function AdminNotesPage() {
    const navigate = useNavigate();
    const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
    const [selectedLevel, setSelectedLevel] = useState(levels[0]);
    const [subTopics, setSubTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [formState, setFormState] = useState({ title: '', content: '', videoUrl: '', credit: '', compilerUrl: '' });
    
    const API_URL = 'http://localhost:5000';
    const token = localStorage.getItem('notezone_token');

    useEffect(() => {
        fetchNotesForLanguage();
    }, [selectedLanguage]);

    const fetchNotesForLanguage = async () => {
        try {
            const response = await fetch(`${API_URL}/api/notes/${selectedLanguage}`, {
                headers: { 'x-auth-token': token }
            });
            const data = await response.json();
            if (data && data.levels) {
                setSubTopics(data.levels[selectedLevel] || []);
            } else {
                setSubTopics([]);
            }
        } catch (error) {
            console.error("Error fetching notes:", error);
        }
    };
    
    useEffect(() => {
        fetchNotesForLanguage();
    }, [selectedLevel]);


    const handleTopicSelect = (topic) => {
        setSelectedTopic(topic);
        setFormState(topic);
    };

    const handleAddNew = () => {
        setSelectedTopic(null);
        setFormState({ title: '', content: '', videoUrl: '', credit: '', compilerUrl: '' });
    };

    const handleFormChange = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const payload = {
            language: selectedLanguage,
            level: selectedLevel,
            subTopicId: selectedTopic ? selectedTopic._id : null,
            ...formState
        };
        try {
            await fetch(`${API_URL}/api/notes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify(payload),
            });
            fetchNotesForLanguage();
            handleAddNew();
        } catch (error) {
            console.error("Error saving notes:", error);
        }
    };

    const handleDelete = async () => {
        if (!selectedTopic) return;
        if (window.confirm(`Are you sure you want to delete the topic "${selectedTopic.title}"?`)) {
            try {
                await fetch(`${API_URL}/api/notes/${selectedLanguage}/${selectedLevel}/${selectedTopic._id}`, {
                    method: 'DELETE',
                    headers: { 'x-auth-token': token }
                });
                fetchNotesForLanguage();
                handleAddNew();
            } catch (error) {
                console.error("Error deleting topic:", error);
            }
        }
    };

    return (
        <div className="notes-editor-layout">
            {/* Panel 1: Languages */}
            <aside className="panel languages-panel">
                <h2 className="panel-title">Languages</h2>
                <ul>
                    {languages.map(lang => (
                        <li 
                            key={lang} 
                            className={selectedLanguage === lang ? 'active' : ''}
                            onClick={() => setSelectedLanguage(lang)}
                        >
                            {lang}
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Panel 2: Sub-Topics */}
            <section className="panel topics-panel">
                <div className="panel-header">
                    <h2 className="panel-title">Topics</h2>
                    <button onClick={handleAddNew} className="add-new-button">+ Add New</button>
                </div>
                <div className="level-selector">
                    {levels.map(level => (
                        <button 
                            key={level}
                            className={selectedLevel === level ? 'active' : ''}
                            onClick={() => setSelectedLevel(level)}
                        >
                            {level}
                        </button>
                    ))}
                </div>
                <ul>
                    {subTopics.map(topic => (
                        <li 
                            key={topic._id}
                            className={selectedTopic && selectedTopic._id === topic._id ? 'active' : ''}
                            onClick={() => handleTopicSelect(topic)}
                        >
                            {topic.title}
                        </li>
                    ))}
                </ul>
            </section>

            {/* Panel 3: Editor */}
            <main className="panel editor-panel">
                <form onSubmit={handleSave}>
                    <h2 className="panel-title">{selectedTopic ? 'Edit Topic' : 'Add New Topic'}</h2>
                    <div className="form-group">
                        <label>Topic Title</label>
                        <input name="title" value={formState.title} onChange={handleFormChange} required />
                    </div>
                    <div className="form-group">
                        <label>Notes Content</label>
                        <textarea name="content" rows="10" value={formState.content} onChange={handleFormChange}></textarea>
                    </div>
                    <div className="form-group">
                        <label>YouTube Link</label>
                        <input name="videoUrl" type="url" value={formState.videoUrl} onChange={handleFormChange} />
                    </div>
                    <div className="form-group">
                        <label>Credit / Source Link</label>
                        <input name="credit" type="url" value={formState.credit} onChange={handleFormChange} />
                    </div>
                    <div className="form-group">
                        <label>Compiler Link</label>
                        <input name="compilerUrl" type="url" value={formState.compilerUrl} onChange={handleFormChange} />
                    </div>
                    <div className="actions-container">
                        <button type="submit" className="action-button save-button">Save</button>
                        {selectedTopic && (
                            <button type="button" onClick={handleDelete} className="action-button delete-button">Delete</button>
                        )}
                    </div>
                </form>
            </main>
        </div>
    );
}
