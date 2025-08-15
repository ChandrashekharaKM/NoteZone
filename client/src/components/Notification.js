import React from 'react';
import './Notification.css';

const Notification = ({ message, type, onClose }) => {
    // If there's no message, render nothing.
    if (!message) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className={`modal-header ${type}`}>
                    {/* Display 'Success' or 'Error' based on the type prop */}
                    <h4>{type === 'success' ? 'Success' : 'Error'}</h4>
                </div>
                <div className="modal-body">
                    <p>{message}</p>
                </div>
                <div className="modal-footer">
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default Notification;