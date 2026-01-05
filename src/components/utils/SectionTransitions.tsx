import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, setWillChange, clearWillChange, shouldReduceMotion } from '../../lib/animations/gsapClient';

gsap.registerPlugin(ScrollTrigger);

const SectionTransitions = () => {
    const hasInitialized = useRef(false);
    const triggersRef = useRef<ScrollTrigger[]>([]);

    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        // Use requestIdleCallback to defer heavy animation logic
        const initAnimations = () => {
            const sections = document.querySelectorAll<HTMLElement>('section[id]');
            const sectionsArray = Array.from(sections).slice(1); // Skip first section
            
            if (sectionsArray.length === 0) return;

            // Skip heavy animations for reduced motion preference
            if (shouldReduceMotion()) {
                sectionsArray.forEach(section => {
                    gsap.set(section, { autoAlpha: 1 });
                });
                return;
            }

            // Set willChange for all sections upfront
            setWillChange(sectionsArray, 'transform, opacity');

            // Use batch instead of forEach to reduce scroll listeners
            const trigger = ScrollTrigger.batch(sectionsArray, {
                onEnter: (batch) => {
                    gsap.to(batch, {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.6,
                        ease: 'power2.out',
                        stagger: 0.1,
                        overwrite: 'auto',
                    });
                },
                start: 'top 85%',
                once: true, // Only animate once
            });

            if (trigger) {
                triggersRef.current.push(...(Array.isArray(trigger) ? trigger : [trigger]));
            }

            // Simplified header animations using batch
            const headers = sectionsArray
                .map(s => s.querySelector('.section-header'))
                .filter(Boolean) as HTMLElement[];

            if (headers.length > 0) {
                const headerTrigger = ScrollTrigger.batch(headers, {
                    onEnter: (batch) => {
                        gsap.fromTo(batch,
                            { opacity: 0, y: -10 },
                            {
                                opacity: 1,
                                y: 0,
                                duration: 0.4,
                                ease: 'power2.out',
                                stagger: 0.05,
                            }
                        );
                    },
                    start: 'top 80%',
                    once: true,
                });

                if (headerTrigger) {
                    triggersRef.current.push(...(Array.isArray(headerTrigger) ? headerTrigger : [headerTrigger]));
                }
            }

            // Cleanup willChange after animations settle
            setTimeout(() => {
                clearWillChange(sectionsArray);
            }, 2000);
        };

        // Defer initialization
        if ('requestIdleCallback' in window) {
            requestIdleCallback(initAnimations);
        } else {
            setTimeout(initAnimations, 100);
        }

        return () => {
            // Clean up all triggers
            triggersRef.current.forEach(t => t.kill());
            triggersRef.current = [];
        };
    }, []);

    return null;
};

export default SectionTransitions;
