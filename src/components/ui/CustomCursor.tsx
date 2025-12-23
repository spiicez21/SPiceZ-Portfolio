import { useEffect, useRef, useState } from 'react';
import { gsap } from '../../lib/animations/gsapClient';
import './CustomCursor.css';

const CustomCursor = () => {
    const mainRef = useRef<HTMLDivElement>(null);
    const echo1Ref = useRef<HTMLDivElement>(null);
    const echo2Ref = useRef<HTMLDivElement>(null);
    const [isActive, setIsActive] = useState(false);

    const currentInteractiveRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!mainRef.current || !echo1Ref.current || !echo2Ref.current) return;

        let mouseX = 0;
        let mouseY = 0;

        const mainX = gsap.quickTo(mainRef.current, "left", { duration: 0.2, ease: "power3" });
        const mainY = gsap.quickTo(mainRef.current, "top", { duration: 0.2, ease: "power3" });

        const echo1X = gsap.quickTo(echo1Ref.current, "left", { duration: 0.35, ease: "power2" });
        const echo1Y = gsap.quickTo(echo1Ref.current, "top", { duration: 0.35, ease: "power2" });

        const echo2X = gsap.quickTo(echo2Ref.current, "left", { duration: 0.5, ease: "power2" });
        const echo2Y = gsap.quickTo(echo2Ref.current, "top", { duration: 0.5, ease: "power2" });

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            mainX(mouseX);
            mainY(mouseY);
            echo1X(mouseX);
            echo1Y(mouseY);
            echo2X(mouseX);
            echo2Y(mouseY);
        };

        const interactiveSelectors = 'button, .nav-action-btn, .mobile-toggle, .work-nav-item, .ink-button, .overlay-close-btn';

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const interactiveEl = target.closest(interactiveSelectors) as HTMLElement;

            if (interactiveEl !== currentInteractiveRef.current) {
                // Cleanup previous
                if (currentInteractiveRef.current) {
                    currentInteractiveRef.current.classList.remove('cursor-inverted');
                }

                // Setup new
                if (interactiveEl) {
                    interactiveEl.classList.add('cursor-inverted');
                    setIsActive(true);
                } else {
                    setIsActive(false);
                }

                currentInteractiveRef.current = interactiveEl;
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);

            // Cleanup class on unmount
            if (currentInteractiveRef.current) {
                currentInteractiveRef.current.classList.remove('cursor-inverted');
            }
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
