import { useEffect, useRef, useState } from 'react';
import { gsap } from '../../lib/animations/gsapClient';
import './CustomCursor.css';

const CustomCursor = () => {
    const mainRef = useRef<HTMLDivElement>(null);
    const echo1Ref = useRef<HTMLDivElement>(null);
    const echo2Ref = useRef<HTMLDivElement>(null);
    const [isActive, setIsActive] = useState(false);
    const [isMerging, setIsMerging] = useState(false);
    const [mergeSize, setMergeSize] = useState({ width: 60, height: 60 });
    const currentTargetRef = useRef<HTMLElement | null>(null);

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

            if (currentTargetRef.current) {
                const rect = currentTargetRef.current.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const pullStrength = 0.7;
                const targetX = mouseX + (centerX - mouseX) * pullStrength;
                const targetY = mouseY + (centerY - mouseY) * pullStrength;

                mainX(targetX);
                mainY(targetY);
                echo1X(targetX);
                echo1Y(targetY);
                echo2X(targetX);
                echo2Y(targetY);

                const elementWidth = Math.min(rect.width, 150);
                const elementHeight = Math.min(rect.height, 150);
                setMergeSize({ width: elementWidth, height: elementHeight });
            } else {
                mainX(mouseX);
                mainY(mouseY);
                echo1X(mouseX);
                echo1Y(mouseY);
                echo2X(mouseX);
                echo2Y(mouseY);
            }
        };

        const handleMouseEnter = (e: Event) => {
            const target = e.target as HTMLElement;
            setIsActive(true);
            setIsMerging(true);
            currentTargetRef.current = target;

            // Apply invert effect to the element
            target.classList.add('cursor-inverted');
        };

        const handleMouseLeave = (e: Event) => {
            const target = e.target as HTMLElement;
            setIsActive(false);
            setIsMerging(false);
            currentTargetRef.current = null;
            setMergeSize({ width: 60, height: 60 });

            // Remove invert effect
            target.classList.remove('cursor-inverted');
        };

        window.addEventListener('mousemove', handleMouseMove);

        const interactiveSelectors = 'a, button, .clickable, .nav-action-btn, .mobile-toggle, .cert-link, .work-nav-item, input, textarea, .ink-button';
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
                el.classList.remove('cursor-inverted');
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
                className={`cursor-dot ${isActive ? 'active' : ''} ${isMerging ? 'merging' : ''}`}
                style={isMerging ? {
                    width: `${mergeSize.width}px`,
                    height: `${mergeSize.height}px`,
                } : undefined}
            />
        </div>
    );
};

export default CustomCursor;
