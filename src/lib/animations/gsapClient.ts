import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugins
gsap.registerPlugin(ScrollTrigger);

// Configure GSAP for optimal performance
gsap.ticker.lagSmoothing(0);

// Detect user's motion preferences
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Configure default animation settings
gsap.defaults({
  ease: 'power3.out',
  duration: prefersReducedMotion ? 0.01 : 0.6,
});

// ScrollTrigger defaults for performance
ScrollTrigger.defaults({
  toggleActions: 'play none none none',
  markers: false,
});

// Helper to manage willChange safely
export const setWillChange = (elements: gsap.TweenTarget, properties: string) => {
  gsap.set(elements, { willChange: properties });
};

export const clearWillChange = (elements: gsap.TweenTarget) => {
  gsap.set(elements, { clearProps: 'willChange' });
};

// Check if animations should be disabled
export const shouldReduceMotion = () => prefersReducedMotion;

export { gsap, ScrollTrigger };
