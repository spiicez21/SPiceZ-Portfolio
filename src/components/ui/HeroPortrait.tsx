import { useRef } from 'react';

export default function HeroPortrait() {
    const containerRef = useRef<HTMLDivElement>(null);


    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Update CSS variables for performance if possible, or state if simple
        // Using state for Reactiveness, or direct style for perf
        // Let's use direct style manipulation for 60fps smoothness without re-renders
        containerRef.current.style.setProperty('--x', `${x}px`);
        containerRef.current.style.setProperty('--y', `${y}px`);
    };

    const handleMouseLeave = () => {
        // Reset or hide
        // Let's just move it off screen or keep last pos?
        // User said "hover revel", implying it hides on leave?
        // Let's hide it by moving mask away
        if (containerRef.current) {
            containerRef.current.style.setProperty('--x', '-1000px');
            containerRef.current.style.setProperty('--y', '-1000px');
        }
    };

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'crosshair', // Optional
                overflow: 'hidden'
            } as React.CSSProperties}
        >
            {/* Background Portrait */}
            <img
                src="/Picture/Background-main.png"
                alt="Background Decoration"
                style={{
                    position: 'absolute',
                    height: '90%',
                    width: 'auto',
                    objectFit: 'contain',
                    zIndex: 0,
                    opacity: 0.5,
                    pointerEvents: 'none'
                }}
            />

            {/* Base Image (Normal) */}
            <img
                src="/Picture/normal-main.png"
                alt="Portrait"
                style={{
                    position: 'absolute',
                    height: '90%', // Adjust size as needed
                    width: 'auto',
                    objectFit: 'contain',
                    zIndex: 1,
                    pointerEvents: 'none' // Let events pass to container
                }}
            />

            {/* Reveal Image (Dithered) */}
            <img
                src="/Picture/dithered-main.png"
                alt="Portrait Dithered"
                style={{
                    position: 'absolute',
                    height: '90%',
                    width: 'auto',
                    objectFit: 'contain',
                    zIndex: 2,
                    pointerEvents: 'none',
                    // The CSS Mask Logic
                    maskImage: 'radial-gradient(circle 250px at var(--x, -1000px) var(--y, -1000px), black 20%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(circle 250px at var(--x, -1000px) var(--y, -1000px), black 20%, transparent 100%)',
                }}
            />
        </div>
    );
}
