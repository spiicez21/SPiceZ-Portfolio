import { createContext, useContext, useEffect, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from '../lib/animations/gsapClient';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const SmoothScrollContext = createContext<Lenis | null>(null);

export const useSmoothScroll = () => useContext(SmoothScrollContext);

export const SmoothScrollProvider = ({ children }: { children: React.ReactNode }) => {
    const [lenis, setLenis] = useState<Lenis | null>(null);

    useEffect(() => {
        const lenisInstance = new Lenis({
            lerp: 0.1, // Using lerp for smoother fixed-rate damping
            duration: 1.2,
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });

        setLenis(lenisInstance);

        // Sync with GSAP ScrollTrigger
        lenisInstance.on('scroll', ScrollTrigger.update);

        const update = (time: number) => {
            lenisInstance.raf(time * 1000);
        };

        gsap.ticker.add(update);
        gsap.ticker.lagSmoothing(0);

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
