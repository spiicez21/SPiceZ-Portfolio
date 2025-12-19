import { useRef, memo } from 'react';
import SpotifyBadge from './SpotifyBadge';

const MemoizedSpotifyBadge = memo(SpotifyBadge);

export default function HeroPortrait() {
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        containerRef.current.style.setProperty('--mask-x', `${x}px`);
        containerRef.current.style.setProperty('--mask-y', `${y}px`);
    };

    const handleMouseLeave = () => {
        if (!containerRef.current) return;
        containerRef.current.style.setProperty('--mask-x', `-1000px`);
        containerRef.current.style.setProperty('--mask-y', `-1000px`);
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
                cursor: 'crosshair',
                overflow: 'hidden',
                '--mask-x': '-1000px',
                '--mask-y': '-1000px',
            } as React.CSSProperties}
        >
            {/* Background Portrait */}
            <img
                src="/Picture/Background-main.png"
                alt="Background Decoration"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    zIndex: 0,
                    opacity: 0.5,
                    pointerEvents: 'none'
                }}
            />

            {/* Doodle Layer */}
            <img
                src="/Picture/doodle.png"
                alt="Portrait Doodle"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    zIndex: 1,
                    opacity: 0.3,
                    pointerEvents: 'none'
                }}
            />

            {/* Base Image (Normal) */}
            <img
                src="/Picture/normal-main.png"
                alt="Portrait"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    zIndex: 2,
                    pointerEvents: 'none'
                }}
            />

            {/* Reveal Image (Dithered) - Mask follows mouse via CSS variables */}
            <div
                className="portrait-reveal-layer"
                style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 3,
                    pointerEvents: 'none',
                    maskImage: `radial-gradient(circle 200px at var(--mask-x) var(--mask-y), black 20%, transparent 80%)`,
                    WebkitMaskImage: `radial-gradient(circle 200px at var(--mask-x) var(--mask-y), black 20%, transparent 80%)`,
                }}
            >
                <img
                    src="/Picture/dithered-main.png"
                    alt="Portrait Dithered"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                    }}
                />
            </div>

            {/* Spotify Badge */}
            <MemoizedSpotifyBadge />
        </div>
    );
}
