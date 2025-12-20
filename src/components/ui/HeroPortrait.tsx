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
            className="portrait-inner-wrapper"
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                cursor: 'crosshair',
                '--mask-x': '-1000px',
                '--mask-y': '-1000px',
            } as React.CSSProperties}
        >
            {/* Background Portrait */}
            <img
                src="/Picture/Background-main.png"
                alt=""
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) scale(1.4)',
                    height: '100%',
                    width: 'auto',
                    objectFit: 'contain',
                    zIndex: 0,
                    opacity: 0.4,
                    pointerEvents: 'none'
                }}
            />

            {/* Base Image (Normal) */}
            <img
                src="/Picture/normal-main.png"
                alt=""
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) scale(1.4)',
                    height: '100%',
                    width: 'auto',
                    objectFit: 'contain',
                    zIndex: 2,
                    pointerEvents: 'none'
                }}
            />

            {/* Reveal Image (Dithered) */}
            <div
                className="portrait-reveal-layer"
                style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 3,
                    pointerEvents: 'none',
                    maskImage: `radial-gradient(circle 250px at var(--mask-x) var(--mask-y), black 20%, transparent 80%)`,
                    WebkitMaskImage: `radial-gradient(circle 250px at var(--mask-x) var(--mask-y), black 20%, transparent 80%)`,
                }}
            >
                <img
                    src="/Picture/dithered-main.png"
                    alt=""
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%) scale(1.4)',
                        height: '100%',
                        width: 'auto',
                        objectFit: 'contain',
                    }}
                />
            </div>

            {/* Spotify Badge stays in its fixed corner via CSS (usually bottom-right) */}
            <MemoizedSpotifyBadge />
        </div>
    );
}
