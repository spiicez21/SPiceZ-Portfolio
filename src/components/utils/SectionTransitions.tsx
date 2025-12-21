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

                // SCANLINE REVEAL - Terminal boot-up effect
                gsap.fromTo(section,
                    {
                        clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
                        opacity: 0,
                    },
                    {
                        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                        opacity: 1,
                        duration: 1.5,
                        ease: 'power2.inOut',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 85%',
                            end: 'top 45%',
                            scrub: 1.8,
                        }
                    }
                );

                // DIGITAL GLITCH - Random micro-movements
                const glitchTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        end: 'top 60%',
                    }
                });

                glitchTimeline
                    .to(section, { x: -3, duration: 0.05 })
                    .to(section, { x: 3, duration: 0.05 })
                    .to(section, { x: -2, duration: 0.05 })
                    .to(section, { x: 0, duration: 0.05 });

                // RGB SPLIT on headers
                const header = section.querySelector('.section-header');
                if (header) {
                    gsap.fromTo(header,
                        {
                            textShadow: '3px 0 0 rgba(255,0,0,0.7), -3px 0 0 rgba(0,255,255,0.7)',
                            opacity: 0,
                            y: -20,
                        },
                        {
                            textShadow: '0 0 0 rgba(255,0,0,0), 0 0 0 rgba(0,255,255,0)',
                            opacity: 1,
                            y: 0,
                            duration: 1,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: section,
                                start: 'top 75%',
                                toggleActions: 'play none none reverse'
                            }
                        }
                    );
                }

                // MATRIX CASCADE - Content drops in
                const content = section.querySelector('.section-border');
                if (content) {
                    gsap.fromTo(content,
                        {
                            y: -100,
                            opacity: 0,
                            filter: 'brightness(2)',
                        },
                        {
                            y: 0,
                            opacity: 1,
                            filter: 'brightness(1)',
                            duration: 1.2,
                            ease: 'bounce.out',
                            scrollTrigger: {
                                trigger: section,
                                start: 'top 70%',
                                toggleActions: 'play none none reverse'
                            }
                        }
                    );
                }

                // HOLOGRAM FLICKER - Opacity pulse
                gsap.to(section, {
                    opacity: 1,
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 90%',
                        end: 'top 30%',
                        scrub: 1.5,
                        onEnter: () => {
                            gsap.to(section, {
                                opacity: 1,
                                duration: 0.1,
                                repeat: 3,
                                yoyo: true,
                                repeatDelay: 0.05
                            });
                        },
                        onLeave: () => {
                            gsap.to(section, { opacity: 0.5, duration: 0.6 });
                        },
                        onEnterBack: () => {
                            gsap.to(section, { opacity: 1, duration: 0.6 });
                        }
                    }
                });
            });

        }, 100);

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return null;
};

export default SectionTransitions;
