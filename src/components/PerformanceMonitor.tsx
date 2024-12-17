import React, { useState, useEffect, useRef } from 'react';

interface PerformanceMetrics {
    fps: number;
    memory: {
        usedJSHeapSize: number;
        totalJSHeapSize: number;
        jsHeapSizeLimit: number;
    };
    cpuLoad: number;
}

export const PerformanceMonitor: React.FC = () => {
    const [metrics, setMetrics] = useState<PerformanceMetrics>({
        fps: 0,
        memory: {
            usedJSHeapSize: 0,
            totalJSHeapSize: 0,
            jsHeapSizeLimit: 0
        },
        cpuLoad: 0
    });

    const frameCount = useRef(0);
    const lastTime = useRef(performance.now());
    const animationFrameId = useRef<number>();
    const isRunning = useRef(true);

    // Calculate FPS
    useEffect(() => {
        const calculateFPS = () => {
            if (!isRunning.current) return;
            
            frameCount.current++;
            const currentTime = performance.now();
            const elapsed = currentTime - lastTime.current;

            if (elapsed >= 1000) {
                const fps = Math.round((frameCount.current * 1000) / elapsed);
                setMetrics(prev => ({ ...prev, fps }));
                frameCount.current = 0;
                lastTime.current = currentTime;
            }

            animationFrameId.current = requestAnimationFrame(calculateFPS);
        };

        calculateFPS();

        return () => {
            isRunning.current = false;
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, []);

    // Monitor memory and CPU
    useEffect(() => {
        const updateMetrics = () => {
            if (!isRunning.current) return;

            if ('memory' in performance) {
                const memory = (performance as any).memory;
                setMetrics(prev => ({
                    ...prev,
                    memory: {
                        usedJSHeapSize: Math.round(memory.usedJSHeapSize / (1024 * 1024)),
                        totalJSHeapSize: Math.round(memory.totalJSHeapSize / (1024 * 1024)),
                        jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / (1024 * 1024))
                    }
                }));
            }

            // Estimate CPU load
            const iterations = 1000000;
            const startTime = performance.now();
            for (let i = 0; i < iterations; i++) {
                Math.sqrt(i);
            }
            const endTime = performance.now();
            const duration = endTime - startTime;
            const baselineDuration = 50;
            const load = Math.min(100, Math.round((duration / baselineDuration) * 100));
            
            setMetrics(prev => ({ ...prev, cpuLoad: load }));
        };

        const intervalId = setInterval(updateMetrics, 1000);

        return () => {
            isRunning.current = false;
            clearInterval(intervalId);
        };
    }, []);

    return (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg shadow-lg font-mono text-sm">
            <h3 className="text-lg font-bold mb-2">Performance Monitor</h3>
            <div>FPS: {metrics.fps}</div>
            <div>Memory Usage: {metrics.memory.usedJSHeapSize}MB / {metrics.memory.totalJSHeapSize}MB</div>
            <div>Memory Limit: {metrics.memory.jsHeapSizeLimit}MB</div>
            <div>CPU Load: {metrics.cpuLoad}%</div>
        </div>
    );
}; 