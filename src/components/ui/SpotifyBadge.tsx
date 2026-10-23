import { FaSpotify } from 'react-icons/fa';
import './SpotifyBadge.css';
import { useSpotifyTrack } from '../../hooks/useSpotifyTrack';

const SpotifyBadge = () => {
    const { track: currentTrack, isLoading } = useSpotifyTrack();

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
                    <img loading="lazy" decoding="async"
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
                <img loading="lazy" decoding="async" src="/images/stickers/batbro.gif" alt="" className="spotify-batbro-gif" />
            </a>
        </div>
    );
};

export default SpotifyBadge;
