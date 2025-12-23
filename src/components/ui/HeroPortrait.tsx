import { memo } from 'react';
import SpotifyBadge from './SpotifyBadge';

const MemoizedSpotifyBadge = memo(SpotifyBadge);

export default function HeroPortrait() {
    return (
        <div
            className="portrait-inner-wrapper"
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
            }}
        >
            {/* Base Image (Normal) */}
            <img
                src="/Picture/normal-main.png"
                alt=""
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -70%) scale(1)',
                    height: '100%',
                    width: 'auto',
                    objectFit: 'contain',
                    zIndex: 2,
                    pointerEvents: 'none'
                }}
            />

            {/* Spotify Badge stays in its fixed corner via CSS (usually bottom-right) */}
            <MemoizedSpotifyBadge />
        </div>
    );
}
