import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/animations/gsapClient';
import heroData from '../../content/hero.json';
import './HeroBootSequence.css';

const HeroBootSequence = () => {
    const heroRef = useRef<HTMLDivElement>(null);
    const nameRef = useRef<HTMLDivElement>(null);
    const taglineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tl = gsap.timeline({ delay: 0.3 });

        // Fade in name
        if (nameRef.current) {
            tl.fromTo(nameRef.current,
                {
                    opacity: 0,
                    y: 30,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: 'power3.out',
                }
            );
        }

        // Fade in tagline
        if (taglineRef.current) {
            tl.fromTo(taglineRef.current,
                {
                    opacity: 0,
                    y: 20,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power2.out',
                },
                '-=0.8'
            );
        }

        return () => {
            tl.kill();
        };
    }, []);

    return (
        <div ref={heroRef} className="hero-boot-sequence">
            <div className="hero-content">
                <div ref={nameRef} className="hero-name">
                    {heroData.name}
                </div>
                <div ref={taglineRef} className="hero-tagline">
                    {heroData.tagline}
                </div>
            </div>

            <div className="scroll-indicator">
                <div className="scroll-line"></div>
            </div>
        </div>
    );
};

export default HeroBootSequence;
