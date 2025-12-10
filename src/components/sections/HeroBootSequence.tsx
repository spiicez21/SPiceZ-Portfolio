import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { gsap } from '../../lib/animations/gsapClient';
import heroDataRaw from '../../content/hero.json';
import './HeroBootSequence.css';

// Lazy load components
const Dither = lazy(() => import('../ui/Dither'));
const HeroPortrait = lazy(() => import('../ui/HeroPortrait'));

interface HeroData {
    name: string;
    handle: string;
    tagline: string;
    asciiName: string;
}

const HeroBootSequence = () => {
    const nameRef = useRef<HTMLDivElement>(null);
    const taglineRef = useRef<HTMLDivElement>(null);
    const [heroData] = useState<HeroData>(heroDataRaw);

    useEffect(() => {
        if (!heroData) return;
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
    }, [heroData]);

    return (
        <div className="hero-boot-wrapper" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
            <div className="hero-background" style={{ opacity: 0.1 }}>
                <Suspense fallback={<div style={{ background: '#000', width: '100%', height: '100%' }} />}>
                    <Dither
                        waveColor={[0.5, 0.5, 0.5]}
                        disableAnimation={true}
                        enableMouseInteraction={true}
                        mouseRadius={0.3}
                        colorNum={4}
                        waveAmplitude={0.3}
                        waveFrequency={3}
                        waveSpeed={0.05}
                        pixelSize={3}
                    />
                </Suspense>
                <div className="hero-overlay-fade" />
            </div>

            <div className="hero-container">
                <div className="hero-content-left">
                    <div ref={nameRef} className="hero-name">
                        {heroData.name}
                    </div>
                    <div ref={taglineRef} className="hero-tagline">
                        {heroData.tagline}
                    </div>
                </div>

                <div className="hero-portrait-right">
                    <Suspense fallback={null}>
                        <HeroPortrait />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default HeroBootSequence;
