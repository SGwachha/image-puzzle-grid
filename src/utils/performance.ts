export class PerformanceMonitor {
    private static instance: PerformanceMonitor;
    private fps: number = 0;
    private frameCount: number = 0;
    private lastTime: number = performance.now();
    private isRunning: boolean = false;

    private constructor() {
        this.startMonitoring();
    }

    public static getInstance(): PerformanceMonitor {
        if (!PerformanceMonitor.instance) {
            PerformanceMonitor.instance = new PerformanceMonitor();
        }
        return PerformanceMonitor.instance;
    }

    private startMonitoring(): void {
        this.isRunning = true;
        this.monitorFrame();
    }

    private monitorFrame(): void {
        if (!this.isRunning) return;

        this.frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - this.lastTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastTime = currentTime;
            this.logMetrics();
        }

        requestAnimationFrame(() => this.monitorFrame());
    }

    private logMetrics(): void {
        const memory = (performance as any).memory ? {
            heapSize: (performance as any).memory.totalJSHeapSize,
            heapUsed: (performance as any).memory.usedJSHeapSize
        } : 'Memory metrics not available';

        console.log({
            fps: this.fps,
            memory,
            timestamp: new Date().toISOString()
        });
    }

    public stop(): void {
        this.isRunning = false;
    }
} 