import React, { useEffect, useState } from 'react';
import { secureLocalStorage, secureSessionStorage } from '../utils/storage.ts';

export const StorageMonitor: React.FC = () => {
    const [showWarning, setShowWarning] = useState(false);
    const [localUsage, setLocalUsage] = useState(0);
    const [sessionUsage, setSessionUsage] = useState(0);

    useEffect(() => {
        const checkStorage = () => {
            const localPercentage = secureLocalStorage.getUsagePercentage();
            const sessionPercentage = secureSessionStorage.getUsagePercentage();
            
            setLocalUsage(localPercentage);
            setSessionUsage(sessionPercentage);
            setShowWarning(localPercentage > 80 || sessionPercentage > 80);
        };

        // Check storage usage
        const intervalId = setInterval(checkStorage, 5000);
        checkStorage();

        return () => clearInterval(intervalId);
    }, []);

    if (!showWarning) return null;

    return (
        <div className="fixed top-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 p-4 max-w-md rounded shadow-lg z-50">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm0-9a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                        Storage Warning
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                        <p>Storage usage is getting high:</p>
                        <ul className="list-disc list-inside mt-1">
                            <li>Local Storage: {Math.round(localUsage)}%</li>
                            <li>Session Storage: {Math.round(sessionUsage)}%</li>
                        </ul>
                    </div>
                    <div className="mt-3">
                        <button
                            onClick={() => {
                                if (window.confirm('Are you sure you want to clear old data?')) {
                                    secureLocalStorage.clear();
                                    secureSessionStorage.clear();
                                    setShowWarning(false);
                                }
                            }}
                            className="text-sm font-medium text-yellow-800 hover:text-yellow-900"
                        >
                            Clear Old Data
                        </button>
                    </div>
                </div>
                <div className="ml-auto pl-3">
                    <button
                        onClick={() => setShowWarning(false)}
                        className="inline-flex text-gray-400 hover:text-gray-500"
                    >
                        <span className="sr-only">Dismiss</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}; 