/**
 * Performance Monitoring Utilities
 * Use these to measure animation performance in development
 */

import { gsap } from './animations/gsapClient';

/**
 * FPS Monitor - Displays current FPS in console
 * Call this in development to track performance
 */
export const enableFPSMonitor = () => {
  let lastTime = performance.now();
  let frames = 0;
  let fps = 60;

  const tick = () => {
    frames++;
    const currentTime = performance.now();
    
    if (currentTime >= lastTime + 1000) {
      fps = Math.round((frames * 1000) / (currentTime - lastTime));
      
      // Color code based on performance
      const color = fps >= 55 ? '#00ff00' : fps >= 30 ? '#ffaa00' : '#ff0000';
      console.log(`%cFPS: ${fps}`, `color: ${color}; font-weight: bold; font-size: 14px;`);
      
      frames = 0;
      lastTime = currentTime;
    }
    
    requestAnimationFrame(tick);
  };

  tick();
  console.log('🎯 FPS Monitor enabled. Watch console for FPS updates.');
};

/**
 * Log GSAP Performance Stats
 */
export const logGSAPStats = () => {
  const triggers = gsap.globalTimeline.getChildren();
  console.group('📊 GSAP Performance Stats');
  console.log(`Active Timelines: ${triggers.length}`);
  console.log(`Ticker FPS: ${gsap.ticker.fps}`);
  console.log(`Lag Smoothing: ${gsap.ticker.lagSmoothing}`);
  console.groupEnd();
};

/**
 * Measure animation performance over time
 */
export const measureAnimationPerformance = (label: string, duration: number = 5000) => {
  console.log(`🔥 Measuring "${label}" for ${duration}ms...`);
  
  const startTime = performance.now();
  let frameCount = 0;
  let worstFrame = 0;
  let bestFrame = 999;
  let lastFrameTime = startTime;
  
  const measure = () => {
    const now = performance.now();
    const frameDuration = now - lastFrameTime;
    
    if (frameDuration > worstFrame) worstFrame = frameDuration;
    if (frameDuration < bestFrame && frameDuration > 0) bestFrame = frameDuration;
    
    frameCount++;
    lastFrameTime = now;
    
    if (now - startTime < duration) {
      requestAnimationFrame(measure);
    } else {
      const avgFPS = Math.round((frameCount * 1000) / duration);
      const worstFPS = Math.round(1000 / worstFrame);
      const bestFPS = Math.round(1000 / bestFrame);
      
      console.group(`📊 Results for "${label}"`);
      console.log(`Average FPS: ${avgFPS}`);
      console.log(`Best FPS: ${bestFPS}`);
      console.log(`Worst FPS: ${worstFPS}`);
      console.log(`Frame Drops: ${frameCount < (duration / 16) ? 'YES ⚠️' : 'NO ✅'}`);
      console.groupEnd();
    }
  };
  
  requestAnimationFrame(measure);
};

/**
 * Check for performance issues
 */
export const detectPerformanceIssues = () => {
  const issues: string[] = [];
  
  // Check for static willChange
  const elementsWithWillChange = document.querySelectorAll('[style*="will-change"]');
  if (elementsWithWillChange.length > 0) {
    issues.push(`⚠️ Found ${elementsWithWillChange.length} elements with static will-change`);
  }
  
  // Check for heavy animations
  const animatingElements = document.querySelectorAll('.gsap-marker-scroller-start, .gsap-marker-scroller-end');
  if (animatingElements.length > 50) {
    issues.push(`⚠️ High number of ScrollTrigger markers detected: ${animatingElements.length}`);
  }
  
  // Check active timelines - getChildren() returns an array
  const children = gsap.globalTimeline.getChildren();
  const activeTimelines = Array.isArray(children) ? children.length : 0;
  if (activeTimelines > 20) {
    issues.push(`⚠️ High number of active timelines: ${activeTimelines}`);
  } else {
    issues.push(`✅ Active timelines: ${activeTimelines}`);
  }
  
  console.group('🔍 Performance Issues Detected');
  if (issues.length === 0) {
    console.log('✅ No issues detected!');
  } else {
    issues.forEach(issue => console.log(issue));
  }
  console.groupEnd();
  
  return issues;
};

// Development mode helper
if (import.meta.env.DEV) {
  // Make utilities available in console
  (window as unknown as Record<string, unknown>).perfMonitor = {
    enableFPS: enableFPSMonitor,
    logGSAP: logGSAPStats,
    measure: measureAnimationPerformance,
    detect: detectPerformanceIssues,
  };
  
  console.log('🎯 Performance tools available:');
  console.log('  perfMonitor.enableFPS() - Enable FPS monitoring');
  console.log('  perfMonitor.logGSAP() - Log GSAP stats');
  console.log('  perfMonitor.measure(label, duration) - Measure animation performance');
  console.log('  perfMonitor.detect() - Detect performance issues');
}

export default {
  enableFPSMonitor,
  logGSAPStats,
  measureAnimationPerformance,
  detectPerformanceIssues,
};
