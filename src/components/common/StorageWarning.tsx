import React, { useEffect, useState } from 'react';
import { StorageManager } from '../../utils/storage.ts';

export const StorageWarning: React.FC = () => {
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        const checkStorage = async () => {
            const hasSpace = await StorageManager.handleStorageLimit();
            setShowWarning(!hasSpace);
        };

        checkStorage();
        const interval = setInterval(checkStorage, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleClearData = () => {
        StorageManager.clearGameData();
        setShowWarning(false);
    };

    if (!showWarning) return null;

    return (
        <div className="fixed bottom-4 right-4 bg-yellow-100 border-yellow-400 border p-4 rounded-lg shadow-lg">
            <h3 className="text-yellow-800 font-bold mb-2">Storage Warning</h3>
            <p className="text-yellow-700 mb-4">
                Storage space is running low. Consider clearing some data to ensure smooth gameplay.
            </p>
            <button
                onClick={handleClearData}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
                Clear Game Data
            </button>
        </div>
    );
}; 