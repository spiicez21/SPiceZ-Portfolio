import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SignatureSVG from '../ui/SignatureSVG';
import TopographicBackground from '../ui/TopographicBackground';
import HeroPortrait from '../ui/HeroPortrait';
import F1Card from '../ui/F1Card';
import SectionFrame from '../ui/SectionFrame';
import aboutData from '../../content/about.json';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { BubbleText } from '../ui/BubbleText';
import './HeroBootSequence.css';

gsap.registerPlugin(ScrollTrigger);

// Keywords to highlight - from WhoAmI
const KEYWORDS = [
    "Computer Science", "building things", "debugging", "3 AM",
    "designing graphics", "hackathons", "learning by doing",
    "robust", "scalable", "full-stack", "creativity"
];

const HeroBootSequence = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentWrapperRef = useRef<HTMLDivElement>(null);
    const dimOverlayRef = useRef<HTMLDivElement>(null);
    const marqueeLeftRef = useRef<HTMLDivElement>(null);
    const marqueeRightRef = useRef<HTMLDivElement>(null);
    const portraitRef = useRef<HTMLDivElement>(null);
    const signaturePathRef = useRef<SVGPathElement>(null);
    const whoAmIRef = useRef<HTMLDivElement>(null);
    const f1CardRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=200%", // Extended for 2 sections
                scrub: 1, // Smooth scrub
                pin: true,
                anticipatePin: 1
            }
        });

        // --- HERO SEQUENCE (0% - 45%) ---

        // Set up signature stroke animation
        if (signaturePathRef.current) {
            const pathLength = signaturePathRef.current.getTotalLength();
            gsap.set(signaturePathRef.current, {
                strokeDasharray: pathLength,
                strokeDashoffset: pathLength
            });
        }

        // Marquee moves constantly
        tl.to(marqueeLeftRef.current, { xPercent: -50, ease: "none" }, 0);
        tl.to(marqueeRightRef.current, { xPercent: 50, ease: "none" }, 0);

        // 1. Scale Down & Dim (0% - 40%)
        tl.fromTo(contentWrapperRef.current,
            { scale: 1, borderRadius: "0px", boxShadow: "0 0 0 rgba(0, 0, 0, 0)" },
            { scale: 0.7, borderRadius: "24px", boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)", ease: "power2.out", duration: 0.4 },
            0
        );

        tl.fromTo(dimOverlayRef.current,
            { opacity: 0 },
            { opacity: 0.85, ease: "power2.out", duration: 0.4 },
            0
        );

        // Animate NavBar text to white as background darkens (Manual Invert)
        // Note: NavBar is outside the component scope, so we must query selector globally
        const navFirstName = document.querySelector(".brand-firstname");
        const navLastName = document.querySelector(".brand-lastname");

        if (navFirstName) tl.to(navFirstName, { color: "#ffffff", duration: 0.4 }, 0);
        if (navLastName) tl.to(navLastName, { color: "rgba(255, 255, 255, 0.4)", duration: 0.4 }, 0);

        // 2. Signature Draw (0% - 40%)
        if (signaturePathRef.current) {
            const pathLength = signaturePathRef.current.getTotalLength();
            tl.fromTo(signaturePathRef.current,
                { strokeDashoffset: pathLength },
                { strokeDashoffset: 0, ease: "power2.inOut", duration: 0.4 },
                0
            );
        }

        // 3. Hero Elements Fade Out (40% - 50%)
        tl.to([portraitRef.current, f1CardRef.current, signaturePathRef.current], {
            opacity: 0,
            y: -50,
            duration: 0.1,
            ease: "power2.in"
        }, 0.4);

        // 3b. Fade out background marquee and content wrapper entirely
        tl.to(".hero-marquee-bg", { opacity: 0, duration: 0.2 }, 0.45);
        tl.to(contentWrapperRef.current, { opacity: 0, scale: 0.6, duration: 0.3 }, 0.5);

        // --- WHOAMI SEQUENCE (50% - 100%) ---

        // 4. WhoAmI Slides Up (50% - 70%)
        tl.fromTo(whoAmIRef.current,
            { y: "120vh", opacity: 0 },
            { y: "0vh", opacity: 1, ease: "power3.out", duration: 0.3 },
            0.5
        );

        // 5. Staggered Content Reveal (70% - 90%)
        // Using direct className targeting scoped to ref
        const targets = gsap.utils.toArray([".col-label", ".identity-title", ".status-indicator", ".location-tag", ".bio-para"]);

        tl.fromTo(targets,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.02, duration: 0.2, ease: "power2.out" },
            0.7
        );

        // Keep pinned until end

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
        <div className="hero-boot-wrapper lando-style" ref={containerRef}>
            {/* Background Marquee Text */}
            <div className="hero-marquee-bg">
                <div className="marquee-row left" ref={marqueeLeftRef}>
                    YUGA BHARATHI J // SPICEZ_21 // FULL-STACK DEVELOPER // YUGA BHARATHI J // SPICEZ_21 // FULL-STACK DEVELOPER //
                </div>
                <div className="marquee-row right" ref={marqueeRightRef}>
                    CREATIVE TECHNOLOGIST // BUG_HUNTER // DESIGNER // CREATIVE TECHNOLOGIST // BUG_HUNTER // DESIGNER //
                </div>
            </div>

            {/* Scalable White Hero Card */}
            <div className="hero-content-wrapper" ref={contentWrapperRef}>
                <TopographicBackground />
                <div className="hero-portrait-container" ref={portraitRef}>
                    <HeroPortrait />
                </div>
                <div className="hero-signature-wrapper">
                    <SignatureSVG ref={signaturePathRef} />
                </div>
                <div ref={f1CardRef} className="hero-info-animate">
                    <F1Card />
                </div>
                <div className="hero-dim-overlay" ref={dimOverlayRef} />
                <div className="hero-overlay-fade" />
            </div>

            {/* WhoAmI Section - integrated */}
            <div className="whoami-section" ref={whoAmIRef}>
                <SectionFrame id="whoami" label="WHOAMI" number="01">
                    <div className="whoami-revamp">
                        <div className="revamp-grid split-layout">
                            {/* Column 1: Identity Profile */}
                            <div className="revamp-col identity-col">
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
                            <div className="revamp-col bio-col">
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
            </div>
        </div>
    );
};

export default HeroBootSequence;
