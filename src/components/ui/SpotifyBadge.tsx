import { useState, useEffect } from 'react';
import { FaSpotify } from 'react-icons/fa';
import './SpotifyBadge.css';
import { getAccessToken } from '../../services/spotify';



interface SpotifyTrack {
    name: string;
    artist: string;
    album: string;
    image: string;
    url: string;
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
                    url: data.item.external_urls.spotify,
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
                    url: item.external_urls.spotify,
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
        <div className="spotify-anim-wrapper">
            <a
                href={currentTrack.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`spotify-badge ${currentTrack.isPlaying ? 'active' : ''}`}
            >
                <div className="spotify-badge-header">
                    <span>{currentTrack.isPlaying ? 'AUD_STREAM_ACTIVE' : 'AUD_LOG_RECENT'}</span>
                    <FaSpotify className="spotify-logo-corner" />
                </div>

                <div className="spotify-badge-content">
                    <img
                        src={currentTrack.image}
                        alt=""
                        className="spotify-badge-album"
                    />

                    <div className="spotify-badge-info">
                        <div className="spotify-badge-track">{currentTrack.name}</div>
                        <div className="spotify-badge-artist">{currentTrack.artist}</div>
                    </div>
                </div>

                <div className="progress-bar-fill"></div>
                <img src="/Spotify-Badge/batbro.gif" alt="" className="spotify-batbro-gif" />
            </a>
        </div>
    );
};

export default SpotifyBadge;
