import React, { useEffect, useState } from 'react';

interface PerformanceMetrics {
    fps: number;
    memory: {
        usedJSHeapSize: number;
        totalJSHeapSize: number;
    } | null;
    cpu: number | null;
}

export const PerformanceMonitor: React.FC = () => {
    const [metrics, setMetrics] = useState<PerformanceMetrics>({
        fps: 0,
        memory: null,
        cpu: null
    });

    useEffect(() => {
        let frameCount = 0;
        let lastTime = performance.now();
        let animationFrameId: number;

        const measurePerformance = () => {
            const currentTime = performance.now();
            frameCount++;

            if (currentTime - lastTime >= 1000) {
                // Calculate FPS
                const fps = Math.round(frameCount * 1000 / (currentTime - lastTime));
                
                // Get memory usage if available
                const memory = (performance as any).memory ? {
                    usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
                    totalJSHeapSize: (performance as any).memory.totalJSHeapSize
                } : null;

                setMetrics(prev => ({
                    ...prev,
                    fps,
                    memory
                }));

                frameCount = 0;
                lastTime = currentTime;
            }

            animationFrameId = requestAnimationFrame(measurePerformance);
        };

        measurePerformance();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const formatBytes = (bytes: number): string => {
        const mb = bytes / (1024 * 1024);
        return `${mb.toFixed(2)} MB`;
    };

    return (
        <div className="fixed bottom-4 left-4 bg-black bg-opacity-75 text-white p-4 rounded-lg font-mono text-sm">
            <h3 className="font-bold mb-2">Performance Metrics</h3>
            <div>FPS: {metrics.fps}</div>
            {metrics.memory && (
                <div>
                    <div>Used Memory: {formatBytes(metrics.memory.usedJSHeapSize)}</div>
                    <div>Total Memory: {formatBytes(metrics.memory.totalJSHeapSize)}</div>
                </div>
            )}
        </div>
    );
}; 