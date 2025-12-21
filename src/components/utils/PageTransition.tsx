import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from '../../lib/animations/gsapClient';
import './PageTransition.css';

interface PageTransitionProps {
    children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
    const maskRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    useEffect(() => {
        if (!maskRef.current || !contentRef.current) return;

        // Scroll to top on page change
        window.scrollTo(0, 0);

        // Entrance animation - slide in from left
        const timeline = gsap.timeline();

        // Set initial states - mask covers screen, content hidden
        gsap.set(maskRef.current, {
            x: '0%',
            display: 'block',
        });

        gsap.set(contentRef.current, {
            opacity: 0,
        });

        // Animate mask sliding out, then reveal content
        timeline
            .to(maskRef.current, {
                x: '100%',
                duration: 1,
                ease: 'power3.inOut',
            })
            .set(maskRef.current, {
                display: 'none',
            })
            .set(contentRef.current, {
                opacity: 1,
            });

        return () => {
            timeline.kill();
        };
    }, [location.pathname]);

    return (
        <div key={location.pathname}>
            <div ref={maskRef} className="page-transition-mask" />
            <div ref={contentRef} className="page-transition-content">
                {children}
            </div>
        </div>
    );
};

export default PageTransition;
