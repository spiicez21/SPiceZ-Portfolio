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
    const cardRef = useRef<HTMLDivElement>(null); // New Ref
    const [heroData] = useState<HeroData>(heroDataRaw);
    const [showAscii, setShowAscii] = useState(false);
    const [isTransmitting, setIsTransmitting] = useState(false);

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

        if (taglineRef.current) {
            tl.fromTo(taglineRef.current,
                { opacity: 0, y: -50 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
                "-=0.3"
            );

            // Start transmission (Bars Active) - Use call to interact with React state
            tl.call(() => setIsTransmitting(true), undefined, "-=0.1");

            // Stagger words (Highlight first, then Content)
            const highlightWords = taglineRef.current.querySelectorAll(".radio-highlight .radio-word");
            const contentWords = taglineRef.current.querySelectorAll(".radio-content .radio-word");

            if (highlightWords.length > 0) {
                tl.fromTo(highlightWords,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.1, stagger: 0.2, ease: "none" }, // Slower stagger
                    "-=0.1"
                );
            }

            if (contentWords.length > 0) {
                tl.fromTo(contentWords,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.1, stagger: 0.15, ease: "none" }, // Slower stagger
                    "+=0.1" // Small pause after highlight
                );
            }

            // Stop transmission (Bars Static)
            tl.call(() => setIsTransmitting(false));

            // Animate bars entrance (grow from bottom)
            const bars = taglineRef.current.querySelectorAll(".radio-bar");
            if (bars.length > 0) {
                tl.fromTo(bars,
                    { scaleY: 0 },
                    { scaleY: 1, duration: 0.4, stagger: 0.02, ease: "back.out(1.5)" },
                    "-=4" // Keep it happening early/concurrently with text
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

            <div className="hero-container">
                <div className="hero-content-left">
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr',
                            cursor: 'pointer'
                        }}
                        onClick={() => setShowAscii(!showAscii)}
                    >
                        {/* Name Layer */}
                        <div
                            ref={nameRef}
                            className="hero-name"
                            style={{
                                gridArea: '1/1',
                                opacity: showAscii ? 0 : 1,
                                pointerEvents: showAscii ? 'none' : 'auto',
                                transition: 'opacity 0.3s ease'
                            }}
                        >
                            <ScrambleText text={heroData.name} revealSpeed={60} scrambleSpeed={30} delay={0.5} />
                        </div>

                        {/* ASCII Layer */}
                        <div
                            className="hero-ascii"
                            style={{
                                gridArea: '1/1',
                                opacity: showAscii ? 1 : 0,
                                pointerEvents: showAscii ? 'auto' : 'none',
                                transition: 'opacity 0.3s ease'
                            }}
                        >
                            {heroData.asciiArt ? heroData.asciiArt.join('\n') : ''}
                        </div>
                    </div>

                    <div className="hero-dashboard-row">
                        <div ref={taglineRef} className="team-radio-box" style={{ opacity: 0 }}>
                            <div className="radio-header">
                                <div className="radio-branding">
                                    <img src="/Logo/SPiceZ.png" alt="SPiceZ" className="radio-logo" />
                                    <span className="radio-label">RADIO</span>
                                </div>
                                <div className="radio-waveform">
                                    {/* Generated Dense Waveform */}
                                    {Array.from({ length: 16 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="radio-bar"
                                            style={{ '--delay': `${i * 0.08}s` } as React.CSSProperties}
                                        ></div>
                                    ))}
                                </div>
                            </div>

                            <div className="radio-highlight">
                                {"SYSTEM ONLINE // READY TO RACE".split(" ").map((word, i) => (
                                    <span key={i} className="radio-word" style={{ opacity: 0, display: 'inline-block', marginRight: '0.25em' }}>
                                        {word}
                                    </span>
                                ))}
                            </div>

                            <div className="radio-content">
                                {heroData.tagline.split(" ").map((word, i) => (
                                    <span key={i} className="radio-word" style={{ opacity: 0, display: 'inline-block', marginRight: '0.25em' }}>
                                        {word}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="gig-card-wrapper">
                            <Suspense fallback={null}>
                                <GigCard />
                            </Suspense>
                        </div>
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
