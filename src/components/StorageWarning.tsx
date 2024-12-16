import React, { useEffect, useState } from 'react';
import { checkStorageQuota } from '../utils/storage';

const StorageWarning: React.FC = () => {
    const [showWarning, setShowWarning] = useState(false);
    const [quotaInfo, setQuotaInfo] = useState<ReturnType<typeof checkStorageQuota>>(null);

    useEffect(() => {
        const checkQuota = () => {
            const quota = checkStorageQuota();
            setQuotaInfo(quota);
            setShowWarning(quota?.isNearLimit || false);
        };

        checkQuota();
        const interval = setInterval(checkQuota, 60000);

        return () => clearInterval(interval);
    }, []);

    if (!showWarning) return null;

    return (
        <div className="fixed top-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 p-4">
            <div className="flex">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                        Storage space is running low ({Math.round(quotaInfo?.used || 0 / 1024 / 1024)}MB used)
                    </p>
                    <button
                        onClick={() => {
                            localStorage.clear();
                            setShowWarning(false);
                        }}
                        className="mt-2 text-sm text-yellow-700 underline hover:text-yellow-600"
                    >
                        Clear storage
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StorageWarning; 