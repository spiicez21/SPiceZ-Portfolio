import { useEffect, useRef, useState } from 'react';
import { gsap } from '../../lib/animations/gsapClient';
import './CustomCursor.css';

const CustomCursor = () => {
    const mainRef = useRef<HTMLDivElement>(null);
    const echo1Ref = useRef<HTMLDivElement>(null);
    const echo2Ref = useRef<HTMLDivElement>(null);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (!mainRef.current || !echo1Ref.current || !echo2Ref.current) return;

        // Use quickTo for high performance mouse tracking with varying lag
        const mainX = gsap.quickTo(mainRef.current, "left", { duration: 0.1, ease: "power1" });
        const mainY = gsap.quickTo(mainRef.current, "top", { duration: 0.1, ease: "power1" });

        const echo1X = gsap.quickTo(echo1Ref.current, "left", { duration: 0.25, ease: "power1" });
        const echo1Y = gsap.quickTo(echo1Ref.current, "top", { duration: 0.25, ease: "power1" });

        const echo2X = gsap.quickTo(echo2Ref.current, "left", { duration: 0.4, ease: "power1" });
        const echo2Y = gsap.quickTo(echo2Ref.current, "top", { duration: 0.4, ease: "power1" });

        const handleMouseMove = (e: MouseEvent) => {
            mainX(e.clientX);
            mainY(e.clientY);
            echo1X(e.clientX);
            echo1Y(e.clientY);
            echo2X(e.clientX);
            echo2Y(e.clientY);
        };

        const handleMouseEnter = () => setIsActive(true);
        const handleMouseLeave = () => setIsActive(false);

        window.addEventListener('mousemove', handleMouseMove);

        const interactiveSelectors = 'a, button, .clickable, .nav-action-btn, .mobile-toggle';
        const updateInteractiveListeners = () => {
            const elements = document.querySelectorAll(interactiveSelectors);
            elements.forEach(el => {
                el.addEventListener('mouseenter', handleMouseEnter);
                el.addEventListener('mouseleave', handleMouseLeave);
            });
        };

        updateInteractiveListeners();

        const observer = new MutationObserver(() => {
            updateInteractiveListeners();
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            observer.disconnect();
            const elements = document.querySelectorAll(interactiveSelectors);
            elements.forEach(el => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
            });
        };
    }, []);

    return (
        <div className="custom-cursor-container">
            <div
                ref={echo2Ref}
                className={`cursor-echo echo-2 ${isActive ? 'active-hide' : ''}`}
            />
            <div
                ref={echo1Ref}
                className={`cursor-echo echo-1 ${isActive ? 'active-hide' : ''}`}
            />
            <div
                ref={mainRef}
                className={`cursor-dot ${isActive ? 'active' : ''}`}
            />
        </div>
    );
};

export default CustomCursor;
