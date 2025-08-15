import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';
import { FaJs, FaPython, FaJava, FaReact, FaNodeJs, FaPhp, FaGem, FaGoogle } from 'react-icons/fa';
import { SiCplusplus, SiKotlin } from 'react-icons/si';

const languages = [
    { name: 'JavaScript', icon: <FaJs />, description: 'Language of the web. Learn DOM, ES6, async, and more.' },
    { name: 'Python', icon: <FaPython />, description: 'Beginner-friendly and powerful. Explore data, AI, and web dev.' },
    { name: 'Java', icon: <FaJava />, description: 'OOP and enterprise-ready. Build apps with Spring and more.' },
    { name: 'C++', icon: <SiCplusplus />, description: 'High-performance programming for systems and CP.' },
    { name: 'React', icon: <FaReact />, description: 'Build dynamic UIs with components, hooks, and state.' },
    { name: 'Node.js', icon: <FaNodeJs />, description: 'Server-side JavaScript. Learn Express and REST APIs.' },
    { name: 'PHP', icon: <FaPhp />, description: 'Backend scripting for web apps and CMS platforms.' },
    { name: 'Ruby', icon: <FaGem />, description: 'Elegant syntax and Rails framework for rapid development.' },
    { name: 'Go', icon: <FaGoogle />, description: 'Fast, compiled language for scalable backend systems.' },
    { name: 'Kotlin', icon: <SiKotlin />, description: 'Modern language for Android and JVM development.' },
];

const UserDashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    // Get the user's role
    const userRole = localStorage.getItem('role');

    const handleLanguageClick = (languageName) => {
        setSelectedLanguage(languageName);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleDifficultySelect = (difficulty) => {
        handleCloseModal();
        navigate(`/notes/${selectedLanguage}/${difficulty}`);
    };

    return (
        <div className="dashboard-container">
            {/* ADD THIS BUTTON - It will only appear for admins */}
            {userRole === 'admin' && (
                <div className="admin-nav-banner">
                    <button onClick={() => navigate('/admin-dashboard')} className="admin-back-button">
                        ← Back to Admin Dashboard
                    </button>
                </div>
            )}

            <h2 className="welcome-message">Welcome, {username}!</h2>
            <h3 className="sub-heading">Explore Programming Languages</h3>
            <div className="languages-grid">
                {languages.map((lang) => (
                    <div key={lang.name} className="language-card" onClick={() => handleLanguageClick(lang.name)}>
                        <div className="lang-icon">{lang.icon}</div>
                        <h3>{lang.name}</h3>
                        <p>{lang.description}</p>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Select Difficulty for {selectedLanguage}</h3>
                        <button onClick={() => handleDifficultySelect('Beginner')}>Beginner</button>
                        <button onClick={() => handleDifficultySelect('Intermediate')}>Intermediate</button>
                        <button onClick={() => handleDifficultySelect('Advanced')}>Advanced</button>
                        <button className="cancel-btn" onClick={handleCloseModal}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;