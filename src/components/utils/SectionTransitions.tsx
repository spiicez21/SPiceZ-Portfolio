import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SectionTransitions = () => {
    const hasInitialized = useRef(false);

    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        setTimeout(() => {
            const sections = gsap.utils.toArray<HTMLElement>('section[id]');

            sections.forEach((section, index) => {
                if (index === 0) return;

                // Create a single timeline for the entire section entry
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 85%',
                        end: 'top 40%',
                        scrub: 1.2, // Smoother but less trailing
                        toggleActions: 'play none none reverse'
                    }
                });

                // 1. SCANLINE REVEAL / Opacity (Combined)
                tl.fromTo(section,
                    {
                        clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
                        autoAlpha: 0,
                    },
                    {
                        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                        autoAlpha: 1,
                        ease: 'power2.inOut',
                        force3D: true
                    },
                    0
                );

                // 2. Header Reveal (Lightweight shadow removal)
                const header = section.querySelector('.section-header');
                if (header) {
                    tl.fromTo(header,
                        {
                            opacity: 0,
                            y: -20,
                        },
                        {
                            opacity: 1,
                            y: 0,
                            ease: 'power3.out',
                        },
                        0.2
                    );
                }

                // 3. Content Drop (Simplified, no filter)
                const content = section.querySelector('.section-border');
                if (content) {
                    tl.fromTo(content,
                        {
                            y: -40, // Reduced from 100
                            opacity: 0,
                        },
                        {
                            y: 0,
                            opacity: 1,
                            ease: 'power2.out', // Better for scrub than bounce
                        },
                        0.4
                    );
                }
            });

        }, 100);

        return () => {
            // Only kill triggers created by this component to avoid breaking others
            ScrollTrigger.getAll().forEach(t => {
                if (t.vars.trigger && (t.vars.trigger as any).tagName === 'SECTION') {
                    t.kill();
                }
            });
        };
    }, []);

    return null;
};

export default SectionTransitions;
