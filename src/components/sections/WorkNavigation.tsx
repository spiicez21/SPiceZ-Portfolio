
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

    const handleNavigate = (path: string) => {
        navigate(path);
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
            gsap.set(hoverChars, { y: '120%', rotationX: -90, scale: 0.8 });

            link.addEventListener('mouseenter', () => {
                gsap.to(chars, {
                    y: '-120%',
                    rotationX: 90,
                    scale: 0.8,
                    duration: 0.4,
                    stagger: 0.015,
                    ease: 'power3.out'
                });
                gsap.to(hoverChars, {
                    y: '0%',
                    rotationX: 0,
                    scale: 1,
                    duration: 0.4,
                    stagger: 0.015,
                    ease: 'power3.out'
                });
            });

            link.addEventListener('mouseleave', () => {
                gsap.to(chars, {
                    y: '0%',
                    rotationX: 0,
                    scale: 1,
                    duration: 0.4,
                    stagger: 0.015,
                    ease: 'power3.out'
                });
                gsap.to(hoverChars, {
                    y: '120%',
                    rotationX: -90,
                    scale: 0.8,
                    duration: 0.4,
                    stagger: 0.015,
                    ease: 'power3.out'
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
        </SectionFrame>
    );
};

export default WorkNavigation;
