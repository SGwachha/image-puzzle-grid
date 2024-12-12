import React from 'react';

interface NotificationProps {
    message: string;
    type: 'success' | 'error';
}

const Notification: React.FC<NotificationProps> = ({ message, type }) => {
    const bgColor = type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700';
    
    return (
        <div className={`p-4 mb-4 rounded border ${bgColor}`}>
            {message}
        </div>
    );
};

export default Notification; 