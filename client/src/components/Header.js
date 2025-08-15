import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ isAdmin }) => {
    const navigate = useNavigate();
    // The unused 'username' variable has been removed from here.

    const handleLogout = () => {
        localStorage.clear();
        navigate('/auth');
    };

    const headerClass = isAdmin ? 'header-admin' : 'header-user';
    const title = isAdmin ? 'NoteZone - Admin Panel' : 'NoteZone';

    return (
        <header className={headerClass}>
            <h1>{title}</h1>
            <div className="profile-menu">
                {isAdmin ? 'Admin' : 'Profile'} ▾
                <div className="dropdown-content">
                    {!isAdmin && (
                        <Link to="/change-password">Change Password</Link>
                    )}
                    {/* The <a> tag is now a <button> for accessibility */}
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </header>
    );
};

export default Header;