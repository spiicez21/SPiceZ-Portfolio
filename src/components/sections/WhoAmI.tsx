

import { useRef } from 'react';
import SectionFrame from '../ui/SectionFrame';
import aboutData from '../../content/about.json';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../lib/animations/gsapClient';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { BubbleText } from '../ui/BubbleText';
import { useSmoothSnap } from '../../hooks/useSmoothSnap';
import './WhoAmI.css';

// Keywords to highlight - easily adjustable
const KEYWORDS = [
    "Computer Science", "building things", "debugging", "3 AM",
    "designing graphics", "hackathons", "learning by doing",
    "robust", "scalable", "full-stack", "creativity"
];

const WhoAmI = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const col1Ref = useRef<HTMLDivElement>(null);
    const col2Ref = useRef<HTMLDivElement>(null);

    // Add smooth snap behavior
    useSmoothSnap('whoami');

    useGSAP(() => {
        if (!containerRef.current || !col1Ref.current || !col2Ref.current) return;

        // Disabled - Hero section controls the slide-up now
        // const tl = gsap.timeline({
        //     scrollTrigger: {
        //         trigger: containerRef.current,
        //         start: "top 85%",
        //         toggleActions: "play reverse play reverse"
        //     }
        // });

        const tl = gsap.timeline(); // No ScrollTrigger

        // 1. Column Entrance: Very smooth slide up + blur fade
        tl.fromTo([col1Ref.current, col2Ref.current],
            {
                y: 60,
                opacity: 0,
                filter: "blur(15px)"
            },
            {
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                duration: 1.2,
                stagger: 0.2,
                ease: "expo.out"
            }
        );

        // 2. Inner Elements Reveal: Staggering headers and content
        tl.fromTo([".col-label", ".identity-title", ".status-indicator", ".location-tag"],
            { y: 20, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.1,
                ease: "power3.out"
            },
            "-=0.8"
        );

        // 3. Bio Paragraphs: Smooth reveal as user scrolls
        gsap.fromTo(".bio-para",
            { opacity: 0, y: 30, filter: "blur(5px)" },
            {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 1.2,
                stagger: 0.15,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".bio-content",
                    start: "top 90%",
                    toggleActions: "play reverse play reverse"
                }
            }
        );

        // 4. Subtle Professional Parallax: Minimal drift for depth
        gsap.to(col1Ref.current, {
            y: -20,
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5 // Slower scrub for smoothness
            }
        });

        gsap.to(col2Ref.current, {
            y: 20,
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5
            }
        });

    }, { scope: containerRef });

    const renderWithHighlights = (text: string) => {
        const regex = new RegExp(`(${KEYWORDS.join('|')})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, index) => {
            const isKeyword = KEYWORDS.some(k => k.toLowerCase() === part.toLowerCase());
            if (isKeyword) {
                return (
                    <span key={index} className="keyword-highlight">
                        <BubbleText text={part} className="font-bold" />
                    </span>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    return (
        <SectionFrame id="whoami" label="WHOAMI" number="01">
            <div className="whoami-revamp" ref={containerRef}>
                <div className="revamp-grid split-layout">
                    {/* Column 1: Identity Profile */}
                    <div className="revamp-col identity-col" ref={col1Ref}>
                        <div className="col-label">IDENTITY_PROFILE</div>
                        <h2 className="identity-title">SYSTEM_CORE</h2>
                        <div className="status-indicator">
                            <span className="pulse-dot"></span>
                            AUTHENTICATED: YUGA_ROOT
                        </div>
                        <div className="location-tag">
                            <FaMapMarkerAlt className="icon" />
                            {aboutData.stats.location}
                        </div>
                    </div>

                    {/* Column 2: Core Bio Log */}
                    <div className="revamp-col bio-col" ref={col2Ref}>
                        <div className="col-label">CORE_LOG</div>
                        <div className="bio-content">
                            <p className="bio-para intro-para">
                                {renderWithHighlights(aboutData.intro)}
                            </p>
                            {aboutData.paragraphs.map((para, idx) => (
                                <p key={idx} className="bio-para">
                                    {renderWithHighlights(para)}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </SectionFrame>
    );
};

export default WhoAmI;
