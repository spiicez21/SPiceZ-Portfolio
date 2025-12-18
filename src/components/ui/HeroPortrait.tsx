import { useRef, useState } from 'react';
import SpotifyBadge from './SpotifyBadge';

export default function HeroPortrait() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [maskPos, setMaskPos] = useState({ x: -1000, y: -1000 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setMaskPos({ x, y });
    };

    const handleMouseLeave = () => {
        setMaskPos({ x: -1000, y: -1000 });
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
                overflow: 'hidden'
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

            {/* Reveal Image (Dithered) - Mask follows mouse */}
            <img
                src="/Picture/dithered-main.png"
                alt="Portrait Dithered"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    zIndex: 3,
                    pointerEvents: 'none',
                    maskImage: `radial-gradient(circle 200px at ${maskPos.x}px ${maskPos.y}px, black 20%, transparent 80%)`,
                    WebkitMaskImage: `radial-gradient(circle 200px at ${maskPos.x}px ${maskPos.y}px, black 20%, transparent 80%)`,
                }}
            />

            {/* Spotify Badge */}
            <SpotifyBadge />
        </div>
    );
}
