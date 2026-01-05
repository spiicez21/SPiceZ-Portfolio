import { createContext, useContext, useEffect, useState } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, shouldReduceMotion } from '../lib/animations/gsapClient';

const SmoothScrollContext = createContext<Lenis | null>(null);

export const useSmoothScroll = () => useContext(SmoothScrollContext);

export const SmoothScrollProvider = ({ children }: { children: React.ReactNode }) => {
    const [lenis, setLenis] = useState<Lenis | null>(null);

    useEffect(() => {
        // Disable smooth scroll for reduced motion preference
        const smoothScrollEnabled = !shouldReduceMotion();

        const lenisInstance = new Lenis({
            lerp: smoothScrollEnabled ? 0.1 : 1,
            duration: smoothScrollEnabled ? 1.2 : 0,
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: smoothScrollEnabled,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });

        setLenis(lenisInstance);

        // Sync with GSAP ScrollTrigger
        lenisInstance.on('scroll', ScrollTrigger.update);
        
        // ScrollTrigger will use window by default with Lenis

        const update = (time: number) => {
            lenisInstance.raf(time * 1000);
        };

        gsap.ticker.add(update);

        // Refresh ScrollTrigger after Lenis is ready
        requestAnimationFrame(() => {
            ScrollTrigger.refresh();
        });

        return () => {
            lenisInstance.destroy();
            gsap.ticker.remove(update);
        };
    }, []);

    return (
        <SmoothScrollContext.Provider value={lenis}>
            {children}
        </SmoothScrollContext.Provider>
    );
};
