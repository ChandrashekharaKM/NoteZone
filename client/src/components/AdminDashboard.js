import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="admin-dashboard-container">
            <h2 className="welcome-message">Admin Dashboard</h2>
            <div className="admin-widgets-container">
                <div className="admin-widget">
                    <h3>User Management</h3>
                    <p>View and manage all registered users.</p>
                    <button onClick={() => navigate('/admin/users')}>Go to Users</button>
                </div>
                <div className="admin-widget">
                    <h3>Site Analytics</h3>
                    <p>View statistics for users and content.</p>
                    <button onClick={() => navigate('/admin/analytics')}>View Analytics</button>
                </div>
                <div className="admin-widget">
                    <h3>Content Management</h3>
                    <p>Admins can add/edit notes via the user dashboard.</p>
                    <button onClick={() => navigate('/dashboard')}>Manage Notes</button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;