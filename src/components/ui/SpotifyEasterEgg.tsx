import { useState, useEffect, useRef } from 'react';
import { Music, X } from 'lucide-react';
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
    const clickTimerRef = useRef<number>();

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
            setShowPopup(true);
            setClickCount(0);
            fetchSpotifyData();
        }
    };

    const fetchSpotifyData = () => {
        // Mock data - replace with Spotify API
        const mockCurrentTrack: SpotifyTrack = {
            name: 'Song Title Here',
            artist: 'Artist Name',
            album: 'Album Name',
            image: 'https://via.placeholder.com/80',
            isPlaying: true
        };

        setCurrentTrack(mockCurrentTrack);
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
                            <Music size={14} />
                            <span>NOW PLAYING</span>
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
