import React, { createContext, useContext, useEffect, useState } from 'react';

interface PerformanceMetrics {
    fps: number;
    memory: {
        usedJSHeapSize: number;
        totalJSHeapSize: number;
        jsHeapSizeLimit: number;
    } | null;
    cpuUsage: number;
}

const PerformanceContext = createContext<PerformanceMetrics | null>(null);

export const PerformanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [metrics, setMetrics] = useState<PerformanceMetrics>({
        fps: 0,
        memory: null,
        cpuUsage: 0
    });

    useEffect(() => {
        let frameCount = 0;
        let lastTime = performance.now();
        let framerId: number;

        const measureFPS = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime >= lastTime + 1000) {
                setMetrics(prev => ({
                    ...prev,
                    fps: frameCount,
                }));
                frameCount = 0;
                lastTime = currentTime;
            }

            framerId = requestAnimationFrame(measureFPS);
        };

        const measurePerformance = () => {
            // Memory usage (Chrome only)
            if (window.performance && (performance as any).memory) {
                const memory = (performance as any).memory;
                setMetrics(prev => ({
                    ...prev,
                    memory: {
                        usedJSHeapSize: memory.usedJSHeapSize,
                        totalJSHeapSize: memory.totalJSHeapSize,
                        jsHeapSizeLimit: memory.jsHeapSizeLimit
                    }
                }));
            }

            // Approximate CPU usage
            const startTime = performance.now();
            let endTime: number;

            setTimeout(() => {
                endTime = performance.now();
                const timeDiff = endTime - startTime;
                const cpuUsage = Math.min(100, (timeDiff / 10) * 100);
                
                setMetrics(prev => ({
                    ...prev,
                    cpuUsage
                }));
            }, 10);
        };

        framerId = requestAnimationFrame(measureFPS);
        const performanceInterval = setInterval(measurePerformance, 1000);

        return () => {
            cancelAnimationFrame(framerId);
            clearInterval(performanceInterval);
        };
    }, []);

    return (
        <PerformanceContext.Provider value={metrics}>
            {children}
        </PerformanceContext.Provider>
    );
};

export const usePerformance = () => {
    const context = useContext(PerformanceContext);
    if (!context) {
        throw new Error('usePerformance must be used within a PerformanceProvider');
    }
    return context;
}; 