
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SectionFrame from '../ui/SectionFrame';
import './WorkNavigation.css';

const items = [
    { title: 'DEPLOYED BUILDS', path: '/deployed-builds', id: '04' },
    { title: 'PIXEL LAB', path: '/pixel-lab', id: '05' },
    { title: 'IN PROGRESS PROCESSES', path: '/in-progress', id: '06' }
];

const WorkNavigation = () => {
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    const handleNavigate = (path: string) => {
        if (!overlayRef.current) return;

        // Masked transition
        // We expand the overlay to cover the screen
        gsap.to(overlayRef.current, {
            scale: 50, // Scale up massive to cover screen
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
                navigate(path);
                // Reset scale after navigation (optional, depends on if component unmounts)
            }
        });
    };

    // Helper to split text into characters
    const splitText = (text: string) => {
        return text.split('').map((char, index) => (
            <span
                key={index}
                className="char"
                style={{ display: 'inline-block', whiteSpace: 'pre' }}
            >
                {char}
            </span>
        ));
    };

    useGSAP(() => {
        const links = gsap.utils.toArray<HTMLElement>('.work-nav-item');

        // GSAP Marquee Animation
        links.forEach((link, i) => {
            const track = link.querySelector('.marquee-track');
            const direction = i % 2 === 0 ? -1 : 1; // -1 for left (default), 1 for right

            if (track) {
                // Set initial position for right-scrolling rows
                if (direction === 1) {
                    gsap.set(track, { xPercent: -50 });
                }

                // Create the infinite loop
                const marqueeAnim = gsap.to(track, {
                    xPercent: direction === 1 ? 0 : -50,
                    duration: 10,
                    ease: "none",
                    repeat: -1
                });

                // Pause/Resume on hover logic
                link.addEventListener('mouseenter', () => marqueeAnim.pause());
                link.addEventListener('mouseleave', () => marqueeAnim.play());
            }
        });

        links.forEach((link) => {
            const chars = link.querySelectorAll('.work-nav-text .char');
            const hoverChars = link.querySelectorAll('.work-nav-hover-text .char');

            // Start hidden
            gsap.set(hoverChars, { y: '100%' });

            link.addEventListener('mouseenter', () => {
                gsap.to(chars, {
                    y: '-100%',
                    duration: 0.3, // Faster duration per letter
                    stagger: 0.02, // Fast stagger
                    ease: 'power2.out'
                });
                gsap.to(hoverChars, {
                    y: '0%',
                    duration: 0.3,
                    stagger: 0.02,
                    ease: 'power2.out'
                });
            });

            link.addEventListener('mouseleave', () => {
                gsap.to(chars, {
                    y: '0%',
                    duration: 0.3,
                    stagger: 0.02, // Reverse stagger could be cool, but sticking to simple first
                    ease: 'power2.out'
                });
                gsap.to(hoverChars, {
                    y: '100%',
                    duration: 0.3,
                    stagger: 0.02,
                    ease: 'power2.out'
                });
            });
        });
    }, { scope: containerRef });

    return (
        <SectionFrame id="work-navigation" label="SELECTED WORKS" number="04-06" className="work-nav-section">
            <div ref={containerRef} className="work-navigation-container">
                {items.map((item, index) => (
                    <div
                        key={item.path}
                        className={`work-nav-item marquee-${index % 2 === 0 ? 'left' : 'right'}`}
                        onClick={() => handleNavigate(item.path)}
                    >
                        <div className="work-nav-mask">
                            <div className="marquee-track">
                                {/* Repeat content for infinite scroll effect */}
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="marquee-content">
                                        <div className="text-wrapper">
                                            <h2 className="work-nav-text">{splitText(item.title)}</h2>
                                            <h2 className="work-nav-hover-text">{splitText(item.title)}</h2>
                                        </div>
                                        <span className="separator">—</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Transition Overlay */}
            <div
                ref={overlayRef}
                className="transition-overlay"
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    width: '50px',
                    height: '50px',
                    backgroundColor: '#000', // Or theme color
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%) scale(0)',
                    pointerEvents: 'none',
                    zIndex: 9999
                }}
            />
        </SectionFrame>
    );
};

export default WorkNavigation;
