import { useState, useEffect, useRef } from 'react';
import { Music, X } from 'lucide-react';
import {
    getAuthUrl,
    handleCallback,
    getAccessToken,
    getCurrentlyPlaying,
    getRecentlyPlayed
} from '../../services/spotify';
import './SpotifyEasterEgg.css';

interface SpotifyTrack {
    name: string;
    artist: string;
    album: string;
    image: string;
    isPlaying?: boolean;
}

const SpotifyEasterEgg = () => {
    const [clickCount, setClickCount] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const clickTimerRef = useRef<number | undefined>(undefined);

    // Check authentication on mount
    useEffect(() => {
        // Handle callback if present
        if (window.location.hash.includes('access_token')) {
            handleCallback();
        }

        // Check if already authenticated
        const token = getAccessToken();
        setIsAuthenticated(!!token);
    }, []);

    // Reset click count after 2 seconds of no clicks
    useEffect(() => {
        if (clickCount > 0) {
            clickTimerRef.current = window.setTimeout(() => {
                setClickCount(0);
            }, 2000);
        }
        return () => {
            if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
        };
    }, [clickCount]);

    const handleNoteClick = () => {
        const newCount = clickCount + 1;
        setClickCount(newCount);

        // Open popup after 5 rapid clicks
        if (newCount >= 5) {
            setClickCount(0);

            if (!isAuthenticated) {
                // Redirect to Spotify auth
                window.location.href = getAuthUrl();
            } else {
                // Fetch and show current track
                setShowPopup(true);
                fetchSpotifyData();
            }
        }
    };

    const fetchSpotifyData = async () => {
        try {
            const current = await getCurrentlyPlaying();

            if (current) {
                setCurrentTrack(current);
            } else {
                // If nothing is playing, get most recent track
                const recent = await getRecentlyPlayed();
                if (recent && recent.length > 0) {
                    setCurrentTrack({
                        ...recent[0],
                        isPlaying: false
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching Spotify data:', error);
        }
    };

    return (
        <>
            {/* Floating Music Notes Container */}
            <div className="music-notes-container" onClick={handleNoteClick}>
                <div className="music-note">♪</div>
                <div className="music-note">♫</div>
                <div className="music-note">♪</div>
                <div className="music-note">♫</div>
                <div className="music-note">♪</div>
            </div>

            {/* Bottom Popup */}
            {showPopup && currentTrack && (
                <div className={`spotify-bottom-popup ${showPopup ? 'show' : ''}`}>
                    <button className="popup-close" onClick={() => setShowPopup(false)}>
                        <X size={18} />
                    </button>

                    <div className="popup-content">
                        <div className="now-playing-badge">
                            <Music size={12} />
                            <span>{currentTrack.isPlaying ? 'NOW PLAYING' : 'LAST PLAYED'}</span>
                        </div>

                        <div className="track-display">
                            <img src={currentTrack.image} alt={currentTrack.name} className="track-cover" />
                            <div className="track-details">
                                <div className="track-title">{currentTrack.name}</div>
                                <div className="track-artist">{currentTrack.artist}</div>
                            </div>

                            {currentTrack.isPlaying && (
                                <div className="sound-bars">
                                    <span className="bar"></span>
                                    <span className="bar"></span>
                                    <span className="bar"></span>
                                    <span className="bar"></span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SpotifyEasterEgg;
