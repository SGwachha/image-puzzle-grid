import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface PerformanceMetrics {
    fps: number;
    memory: {
        usedJSHeapSize: number;
        totalJSHeapSize: number;
    } | null;
    cpuUsage: number;
}

const initialMetrics: PerformanceMetrics = {
    fps: 0,
    memory: null,
    cpuUsage: 0
};

const PerformanceContext = createContext<PerformanceMetrics>(initialMetrics);

export const usePerformance = () => {
    const context = useContext(PerformanceContext);
    if (!context) {
        throw new Error('usePerformance must be used within a PerformanceProvider');
    }
    return context;
};

export const PerformanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [metrics, setMetrics] = useState<PerformanceMetrics>(initialMetrics);

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

                // Simulate CPU usage
                const cpuUsage = Math.random() * 100;

                setMetrics({
                    fps,
                    memory,
                    cpuUsage
                });

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

    return (
        <PerformanceContext.Provider value={metrics}>
            {children}
        </PerformanceContext.Provider>
    );
}; 