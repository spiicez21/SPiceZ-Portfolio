import { useState, useEffect } from 'react';
import { Music } from 'lucide-react';
import './SpotifyBadge.css';
import { getCurrentTrack, getRecentlyPlayed } from '../../services/spotify';

interface SpotifyTrack {
    name: string;
    artist: string;
    album: string;
    image: string;
    isPlaying: boolean;
}

const SpotifyBadge = () => {
    const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSpotifyData = async () => {
        try {
            // Try to get current playing track
            let track = await getCurrentTrack();

            // If no current track, get recently played
            if (!track) {
                const recentTracks = await getRecentlyPlayed();
                if (recentTracks.length > 0) {
                    track = recentTracks[0];
                }
            }

            if (track) {
                setCurrentTrack(track);
            }
        } catch (error) {
            console.error('Error fetching Spotify data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSpotifyData();

        // Refresh every 30 seconds to update track
        const interval = setInterval(fetchSpotifyData, 30000);

        return () => clearInterval(interval);
    }, []);

    if (isLoading || !currentTrack) {
        return null;
    }

    return (
        <div className="spotify-badge">
            <div className="spotify-badge-header">
                <Music size={14} />
                <span>{currentTrack.isPlaying ? 'Now Playing' : 'Recently Played'}</span>
            </div>

            <div className="spotify-badge-content">
                <img
                    src={currentTrack.image}
                    alt={currentTrack.name}
                    className="spotify-badge-album"
                />

                <div className="spotify-badge-info">
                    <div className="spotify-badge-track">{currentTrack.name}</div>
                    <div className="spotify-badge-artist">{currentTrack.artist}</div>
                </div>

                {currentTrack.isPlaying && (
                    <div className="spotify-badge-bars">
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SpotifyBadge;
