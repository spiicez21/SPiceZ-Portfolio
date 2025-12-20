import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

export const useSmoothSnap = (sectionId: string) => {
    useEffect(() => {
        let scrollTimeout: number;
        let isSnapping = false;

        const handleScroll = () => {
            if (isSnapping) return;

            clearTimeout(scrollTimeout);

            scrollTimeout = setTimeout(() => {
                const section = document.getElementById(sectionId);
                if (!section) return;

                const rect = section.getBoundingClientRect();
                const viewportCenter = window.innerHeight / 2;
                const sectionCenter = rect.top + rect.height / 2;
                const distance = Math.abs(sectionCenter - viewportCenter);

                // Only snap if within 200px of center
                if (distance < 200) {
                    isSnapping = true;

                    gsap.to(window, {
                        duration: 0.8,
                        scrollTo: {
                            y: section,
                            offsetY: -window.innerHeight / 2 + rect.height / 2
                        },
                        ease: "power2.inOut",
                        onComplete: () => {
                            isSnapping = false;
                        }
                    });
                }
            }, 150); // Wait 150ms after scroll stops
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimeout);
        };
    }, [sectionId]);
};
