import { useState, useEffect } from 'react';
import { Music } from 'lucide-react';
import { FaSpotify } from 'react-icons/fa';
import './SpotifyBadge.css';
import { getAccessToken } from '../../services/spotify';

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

    const fetchCurrentlyPlaying = async () => {
        try {
            const token = await getAccessToken();
            if (!token) return;

            const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 204 || response.status > 400) {
                // returns 204 if nothing playing
                // Try recently played if nothing playing
                fetchRecentlyPlayed(token);
                return;
            }

            const data = await response.json();

            if (data.item) {
                setCurrentTrack({
                    name: data.item.name,
                    artist: data.item.artists.map((artist: any) => artist.name).join(', '),
                    album: data.item.album.name,
                    image: data.item.album.images[0]?.url,
                    isPlaying: data.is_playing
                });
            }
        } catch (error) {
            console.error('Error fetching current track:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRecentlyPlayed = async (token: string) => {
        try {
            const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.items && data.items.length > 0) {
                const item = data.items[0].track;
                setCurrentTrack({
                    name: item.name,
                    artist: item.artists.map((artist: any) => artist.name).join(', '),
                    album: item.album.name,
                    image: item.album.images[0]?.url,
                    isPlaying: false
                });
            }
        } catch (error) {
            console.error('Error fetching recent:', error);
        }
    };

    useEffect(() => {
        fetchCurrentlyPlaying();
        const interval = setInterval(fetchCurrentlyPlaying, 30000);
        return () => clearInterval(interval);
    }, []);

    if (isLoading || !currentTrack) {
        return null;
    }

    return (
        <div className="spotify-badge">
            <FaSpotify className="spotify-logo-corner" />
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
