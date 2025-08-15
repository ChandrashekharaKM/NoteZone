import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Notification from './Notification'; // 1. Import the new component
import './ChangePasswordPage.css';

const ChangePasswordPage = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    // 2. Use a single state for notifications
    const [notification, setNotification] = useState({ message: '', type: '' });
    const navigate = useNavigate();

    const { currentPassword, newPassword, confirmNewPassword } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setNotification({ message: '', type: '' }); // Clear previous notifications

        if (newPassword !== confirmNewPassword) {
            setNotification({ message: 'New passwords do not match', type: 'error' });
            return;
        }
        if (newPassword.length < 6) {
            setNotification({ message: 'Password must be at least 6 characters', type: 'error' });
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Content-Type': 'application/json', 'x-auth-token': token }};
            const body = JSON.stringify({ currentPassword, newPassword });
            
            await axios.put('http://localhost:5000/api/auth/change-password', body, config);
            
            // 3. Set a success notification
            setNotification({ message: 'Password updated successfully! Redirecting to login...', type: 'success' });

            // 4. Wait for a moment, then log out and redirect
            setTimeout(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                localStorage.removeItem('username');
                navigate('/auth');
            }, 2000); // Wait 2 seconds so the user can read the message

        } catch (err) {
            // 5. Set an error notification
            setNotification({ message: err.response.data.msg || 'An error occurred', type: 'error' });
        }
    };

    return (
        <div className="change-password-container">
            <div className="change-password-card">
                <h2>Change Password</h2>
                
                {/* 6. Render the Notification component */}
                <Notification 
                    message={notification.message} 
                    type={notification.type}
                    onClose={() => setNotification({ message: '', type: '' })}
                />

                <form onSubmit={onSubmit}>
                    <input type="password" placeholder="Current Password" name="currentPassword" value={currentPassword} onChange={onChange} required />
                    <input type="password" placeholder="New Password" name="newPassword" value={newPassword} onChange={onChange} required />
                    <input type="password" placeholder="Confirm New Password" name="confirmNewPassword" value={confirmNewPassword} onChange={onChange} required />
                    <button type="submit">Update Password</button>
                </form>
                 <button onClick={() => navigate('/dashboard')} className="back-to-dash">
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default ChangePasswordPage;