import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { gsap } from '../../lib/animations/gsapClient';
import heroDataRaw from '../../content/hero.json';
import ScrambleText from '../utils/ScrambleText';
import './HeroBootSequence.css';

// Lazy load components
const Dither = lazy(() => import('../ui/Dither'));
const HeroPortrait = lazy(() => import('../ui/HeroPortrait'));
const GigCard = lazy(() => import('../ui/GigCard')); // Lazy import

interface HeroData {
    name: string;
    handle: string;
    tagline: string;
    asciiName: string;
    asciiArt?: string[];
}

const HeroBootSequence = () => {
    const nameRef = useRef<HTMLDivElement>(null);
    const taglineRef = useRef<HTMLDivElement>(null);
    const [heroData] = useState<HeroData>(heroDataRaw);
    const [showAscii, setShowAscii] = useState(false);

    useEffect(() => {
        if (!heroData) return;
        const tl = gsap.timeline({ delay: 0.2 });

        // Fade in name
        if (nameRef.current) {
            tl.fromTo(nameRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
            );
        }

        if (taglineRef.current) {
            tl.fromTo(taglineRef.current,
                { opacity: 0, y: -30 },
                { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
                "-=0.4"
            );

            // Stagger words
            const highlightWords = taglineRef.current.querySelectorAll(".radio-highlight .radio-word");
            const contentWords = taglineRef.current.querySelectorAll(".radio-content .radio-word");

            if (highlightWords.length > 0) {
                tl.fromTo(highlightWords,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.08, stagger: 0.15, ease: "none" },
                    "-=0.1"
                );
            }

            if (contentWords.length > 0) {
                tl.fromTo(contentWords,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.08, stagger: 0.1, ease: "none" },
                    "+=0.05"
                );
            }
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

            {/* Portrait - Centered Behind */}
            <div className="hero-portrait-center">
                <Suspense fallback={null}>
                    <HeroPortrait />
                </Suspense>
            </div>

            {/* Filled Name - Behind Portrait */}
            <div className="hero-name-behind" onClick={() => setShowAscii(!showAscii)}>
                <div
                    ref={nameRef}
                    className="hero-name"
                    style={{
                        opacity: showAscii ? 0 : 1,
                        transition: 'opacity 0.3s ease'
                    }}
                >
                    <ScrambleText text={heroData.name} revealSpeed={60} scrambleSpeed={30} delay={0.5} />
                </div>
                <div
                    className="hero-ascii"
                    style={{
                        position: 'absolute',
                        opacity: showAscii ? 1 : 0,
                        transition: 'opacity 0.3s ease'
                    }}
                >
                    {heroData.asciiArt ? heroData.asciiArt.join('\n') : ''}
                </div>
            </div>

            {/* Stroke Name - Above Portrait */}
            <div
                className="hero-name-above"
                style={{ opacity: showAscii ? 0 : 1, transition: 'opacity 0.3s ease' }}
            >
                {heroData.name}
            </div>

            <div className="hero-container">
            </div>

            {/* GigCard - RIGHT */}
            <div className="gig-card-wrapper">
                <Suspense fallback={null}>
                    <GigCard />
                </Suspense>
            </div>
        </div>
    );
};

export default HeroBootSequence;
