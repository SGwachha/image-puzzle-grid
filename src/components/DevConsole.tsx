import React from 'react';
import { usePerformance } from '../context/PerformanceContext.tsx';

const DevConsole: React.FC = () => {
    const metrics = usePerformance();

    const formatBytes = (bytes: number): string => {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `${size.toFixed(2)} ${units[unitIndex]}`;
    };

    return (
        <div className="fixed top-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg font-mono text-sm">
            <h3 className="font-bold mb-2">Dev Console</h3>
            <div>FPS: {metrics.fps}</div>
            {metrics.memory && (
                <div>
                    <div>Memory Used: {formatBytes(metrics.memory.usedJSHeapSize)}</div>
                    <div>Memory Total: {formatBytes(metrics.memory.totalJSHeapSize)}</div>
                </div>
            )}
            <div>CPU Load: {metrics.cpuUsage.toFixed(1)}%</div>
        </div>
    );
};

export default DevConsole; 