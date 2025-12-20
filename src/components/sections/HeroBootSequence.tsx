import { useRef, lazy, Suspense } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimateIn from '../utils/AnimateIn';
import SignatureSVG from '../ui/SignatureSVG';
import './HeroBootSequence.css';

gsap.registerPlugin(ScrollTrigger);

// Lazy load components
const TopographicBackground = lazy(() => import('../ui/TopographicBackground'));
const HeroPortrait = lazy(() => import('../ui/HeroPortrait'));
const TechnicalInfoBox = lazy(() => import('../ui/TechnicalInfoBox'));

const HeroBootSequence = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const marqueeLeftRef = useRef<HTMLDivElement>(null);
    const marqueeRightRef = useRef<HTMLDivElement>(null);
    const portraitRef = useRef<HTMLDivElement>(null);
    const signaturePathRef = useRef<SVGPathElement>(null);

    useGSAP(() => {
        if (!containerRef.current) return;

        // Set WhoAmI to initial position BEFORE timeline
        gsap.set("#whoami", { y: 0 });

        // Create the main scroll timeline - Signature completes, then immediate exit
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=100%", // Shorter runway - signature then exit
                scrub: 1.5,
                pin: true,
                pinSpacing: false, // Allow WhoAmI to slide up
                anticipatePin: 1
            }
        });

        // STAGE 0: Initial state - Set up stroke animation
        if (signaturePathRef.current) {
            const pathLength = signaturePathRef.current.getTotalLength();
            gsap.set(signaturePathRef.current, {
                strokeDasharray: pathLength,
                strokeDashoffset: pathLength
            });
        }

        // STAGE 1 (0-1): Marquee moves constantly throughout
        tl.to(marqueeLeftRef.current, { xPercent: -30, ease: "none" }, 0);
        tl.to(marqueeRightRef.current, { xPercent: 30, ease: "none" }, 0);

        // STAGE 2 (0-0.5): Signature draws in with stroke animation
        if (signaturePathRef.current) {
            tl.to(signaturePathRef.current, {
                strokeDashoffset: 0,
                ease: "power2.inOut"
            }, 0);
        }

        // STAGE 2.5 (0.52): Fade out signature after it completes
        if (signaturePathRef.current) {
            tl.to(signaturePathRef.current, {
                opacity: 0,
                duration: 0.3,
                ease: "power2.in"
            }, 0.55); // Fade after drawing completes
        }

        // STAGE 3 (0.5-1.0): Immediate exit when signature finishes
        tl.to(portraitRef.current, {
            scale: 1.5,
            y: -150,
            opacity: 0,
            filter: "blur(20px)",
            ease: "power2.in"
        }, 0.7); // Well after signature completes

        // Section disappears (WhoAmI "comes above")
        tl.to(containerRef.current, {
            backgroundColor: "#000",
            ease: "none"
        }, 0.7);

        tl.to(".hero-overlay-fade", {
            opacity: 1,
            height: "100%",
            ease: "power2.in"
        }, 0.7);

        // Fade out tech info
        tl.to(".hero-info-animate", {
            opacity: 0,
            y: 50,
            ease: "power2.in"
        }, 0.7);

        // LOCK WhoAmI completely - multiple approaches
        gsap.set("#whoami", { y: 0, visibility: "hidden" }); // Hide initially

        // Lock at multiple points with overwrite to prevent any other animations
        tl.to("#whoami", { y: 0, visibility: "hidden", ease: "none", overwrite: true }, 0);
        tl.to("#whoami", { y: 0, visibility: "hidden", ease: "none", overwrite: true }, 0.2);
        tl.to("#whoami", { y: 0, visibility: "hidden", ease: "none", overwrite: true }, 0.4);
        tl.to("#whoami", { y: 0, visibility: "hidden", ease: "none", overwrite: true }, 0.5);
        tl.to("#whoami", { y: 0, visibility: "hidden", ease: "none", overwrite: true }, 0.69);

        // Make visible and slide up AFTER signature is done (0.7 to 1.0)
        tl.to("#whoami", {
            visibility: "visible",
            y: "-100vh",
            ease: "power2.inOut",
            overwrite: true
        }, 0.7);

        // FINAL EXIT
        tl.to(containerRef.current, {
            autoAlpha: 0,
            pointerEvents: "none",
            duration: 0.1
        }, 0.95);

    }, { scope: containerRef });

    return (
        <div className="hero-boot-wrapper lando-style" ref={containerRef}>
            <Suspense fallback={null}>
                <TopographicBackground />
            </Suspense>

            {/* Background Marquee Text */}
            <div className="hero-marquee-bg">
                <div className="marquee-row left" ref={marqueeLeftRef}>
                    YUGA BHARATHI J // SPICEZ_21 // FULL-STACK DEVELOPER //
                </div>
                <div className="marquee-row right" ref={marqueeRightRef}>
                    CREATIVE TECHNOLOGIST // BUG_HUNTER // DESIGNER //
                </div>
            </div>

            {/* Portrait - Centered */}
            <div className="hero-portrait-container" ref={portraitRef}>
                <Suspense fallback={null}>
                    <HeroPortrait />
                </Suspense>
            </div>

            {/* Signature Overlay */}
            <div className="hero-signature-wrapper">
                <SignatureSVG ref={signaturePathRef} />
            </div>

            {/* Bottom-Left Info Box */}
            <AnimateIn
                className="hero-info-animate"
                animation="fade-up"
                delay={0.5}
                duration={1}
            >
                <Suspense fallback={null}>
                    <TechnicalInfoBox />
                </Suspense>
            </AnimateIn>

            <div className="hero-overlay-fade" />
        </div>
    );
};

export default HeroBootSequence;
