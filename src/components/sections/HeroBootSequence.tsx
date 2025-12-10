import { useEffect, useRef, useState } from 'react';
import { gsap } from '../../lib/animations/gsapClient';
import Dither from '../ui/Dither';
import SectionFrame from '../ui/SectionFrame';
import heroDataRaw from '../../content/hero.json';
import './HeroBootSequence.css';

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
                <Dither
                    waveColor={[0.5, 0.5, 0.5]}
                    disableAnimation={true}
                    enableMouseInteraction={true}
                    mouseRadius={0.3}
                    colorNum={4}
                    waveAmplitude={0.3}
                    waveFrequency={3}
                    waveSpeed={0.05}
                    pixelSize={3} // Increased for more retro look
                />
                <div className="hero-overlay-fade" />
            </div>

            <SectionFrame id="boot-sequence" className="hero-section" hideHeader number="01" label="BOOT SEQUENCE">
                <div className="hero-content">
                    <div ref={nameRef} className="hero-name">
                        {heroData.name}
                    </div>
                    <div ref={taglineRef} className="hero-tagline">
                        {heroData.tagline}
                    </div>
                </div>
            </SectionFrame>
        </div>
    );
};

export default HeroBootSequence;
