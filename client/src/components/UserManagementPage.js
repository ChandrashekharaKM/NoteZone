import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserManagementPage.css';

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/users', {
                    headers: { 'x-auth-token': token }
                });
                setUsers(res.data);
            } catch (err) {
                console.error("Failed to fetch users:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/users/${userId}`, {
                    headers: { 'x-auth-token': token }
                });
                setUsers(users.filter(user => user._id !== userId));
            } catch (err) {
                console.error("Failed to delete user:", err);
                alert('Error: Could not delete user.');
            }
        }
    };
    
    if (loading) return <p>Loading users...</p>;

    return (
        <div className="user-management-container">
            <div className="page-header">
                <h1>User Management</h1>
                <button onClick={() => navigate('/admin-dashboard')} className="back-btn">← Back to Admin Dashboard</button>
            </div>
            <div className="user-table-container">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Date Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button 
                                        className="action-btn delete-btn"
                                        onClick={() => handleDeleteUser(user._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagementPage;