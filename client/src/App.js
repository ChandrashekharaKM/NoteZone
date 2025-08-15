import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Component Imports
import PrivateRoute from './components/PrivateRoute';
import AuthPage from './components/AuthPage';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import NotesLayoutPage from './components/NotesLayoutPage';
import NotesEditorPage from './components/NotesEditorPage';
import ChangePasswordPage from './components/ChangePasswordPage';
import UserManagementPage from './components/UserManagementPage';
import AnalyticsPage from './components/AnalyticsPage'; // Import the new page
import './App.css';

// Helper functions
const getRole = () => localStorage.getItem('role');
const isAuthenticated = () => localStorage.getItem('token') !== null;

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Route */}
                <Route path="/auth" element={<AuthPage />} />

                {/* Protected Routes wrapped with PrivateRoute */}
                <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
                <Route path="/admin-dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
                <Route path="/admin/users" element={<PrivateRoute><UserManagementPage /></PrivateRoute>} />
                <Route path="/admin/analytics" element={<PrivateRoute><AnalyticsPage /></PrivateRoute>} />
                <Route path="/change-password" element={<PrivateRoute><ChangePasswordPage /></PrivateRoute>} />
                <Route path="/notes/:language/:difficulty" element={<PrivateRoute><NotesLayoutPage /></PrivateRoute>} />
                <Route path="/editor/new/:language/:difficulty" element={<PrivateRoute><NotesEditorPage /></PrivateRoute>} />
                <Route path="/editor/:noteId" element={<PrivateRoute><NotesEditorPage /></PrivateRoute>} />

                {/* Catch-all Route for redirects */}
                <Route
                    path="*"
                    element={
                        isAuthenticated()
                        ? <Navigate to={getRole() === 'admin' ? "/admin-dashboard" : "/dashboard"} />
                        : <Navigate to="/auth" />
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;