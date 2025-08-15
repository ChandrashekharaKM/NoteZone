import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AnalyticsPage.css';

const AnalyticsPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/analytics/stats', {
                    headers: { 'x-auth-token': token }
                });
                setStats(res.data);
            } catch (err) {
                console.error("Failed to fetch stats:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <p>Loading analytics...</p>;
    if (!stats) return <p>Could not load analytics data.</p>;
    
    // Find the max count for scaling the bar chart
    const maxCount = Math.max(...stats.notesByLanguage.map(item => item.count), 0);

    return (
        <div className="analytics-container">
            <div className="page-header">
                <h1>Site Analytics</h1>
                <button onClick={() => navigate('/admin-dashboard')} className="back-btn">← Back to Admin Dashboard</button>
            </div>

            {/* Stat Cards */}
            <div className="stat-cards-grid">
                <div className="stat-card">
                    <h2>{stats.userCount}</h2>
                    <p>Total Users</p>
                </div>
                <div className="stat-card">
                    <h2>{stats.noteCount}</h2>
                    <p>Total Notes</p>
                </div>
            </div>

            {/* Bar Chart for Notes by Language */}
            <div className="chart-container">
                <h3>Notes per Language</h3>
                <div className="bar-chart">
                    {stats.notesByLanguage.map(item => (
                        <div className="bar-item" key={item.language}>
                            <div className="bar-label">{item.language}</div>
                            <div className="bar-wrapper">
                                <div 
                                    className="bar" 
                                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                                >
                                </div>
                            </div>
                            <div className="bar-value">{item.count}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;