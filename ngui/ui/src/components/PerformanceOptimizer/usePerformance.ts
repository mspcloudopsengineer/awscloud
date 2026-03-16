import { useState, useEffect, useCallback, useRef } from 'react';

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  fps: number;
}

export const usePerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({ loadTime: 0, renderTime: 0, memoryUsage: 0, fps: 0 });
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    // Measure page load time
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (nav) {
      setMetrics((prev) => ({ ...prev, loadTime: Math.round(nav.loadEventEnd - nav.startTime) }));
    }

    // FPS counter
    let animId: number;
    const measureFps = () => {
      frameCount.current++;
      const now = performance.now();
      if (now - lastTime.current >= 1000) {
        setMetrics((prev) => ({ ...prev, fps: frameCount.current }));
        frameCount.current = 0;
        lastTime.current = now;
      }
      animId = requestAnimationFrame(measureFps);
    };
    animId = requestAnimationFrame(measureFps);

    // Memory usage (Chrome only)
    const memInterval = setInterval(() => {
      const mem = (performance as any).memory;
      if (mem) {
        setMetrics((prev) => ({ ...prev, memoryUsage: Math.round(mem.usedJSHeapSize / 1048576) }));
      }
    }, 2000);

    return () => { cancelAnimationFrame(animId); clearInterval(memInterval); };
  }, []);

  const measureRender = useCallback((fn: () => void) => {
    const start = performance.now();
    fn();
    requestAnimationFrame(() => {
      setMetrics((prev) => ({ ...prev, renderTime: Math.round(performance.now() - start) }));
    });
  }, []);

  return { metrics, measureRender };
};

export default usePerformance;
