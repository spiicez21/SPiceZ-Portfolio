import { useEffect, useState } from 'react';
import { FaSpotify } from 'react-icons/fa';
import { useSpotifyTrack, type SpotifyTrack } from '../../hooks/useSpotifyTrack';

const fmt = (ms: number) => {
    const s = Math.max(0, Math.floor(ms / 1000));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

const ago = (iso: string) => {
    const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    if (mins < 60 * 24) return `${Math.round(mins / 60)}h ago`;
    return `${Math.round(mins / 1440)}d ago`;
};

// Extrapolates playback position between polls so the bar moves smoothly.
const useLiveProgress = (track: SpotifyTrack | null) => {
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        if (!track?.isPlaying) return;
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, [track]);

    if (!track) return 0;
    if (!track.isPlaying) return track.progressMs;
    return Math.min(track.progressMs + (now - track.fetchedAt), track.durationMs);
};

const SpotifyPlayer = () => {
    const { track, isLoading } = useSpotifyTrack(15000);
    const progress = useLiveProgress(track);

    if (!track) {
        return (
            <a className="cv-player cv-player--empty" href="https://open.spotify.com" target="_blank" rel="noopener noreferrer">
                <FaSpotify />
                <div><strong>{isLoading ? 'Tuning in…' : 'Probably something loud'}</strong><span>Spotify is offline right now</span></div>
            </a>
        );
    }

    const pct = track.durationMs ? (progress / track.durationMs) * 100 : 0;

    return (
        <div className={`cv-player ${track.isPlaying ? 'is-live' : ''}`}>
            <div className="cv-player__status">
                {track.isPlaying ? (
                    <span className="cv-player__live"><i className="cv-eq"><b /><b /><b /></i> Listening now</span>
                ) : (
                    <span>Last played{track.playedAt ? ` · ${ago(track.playedAt)}` : ''}</span>
                )}
                <a href={track.url} target="_blank" rel="noopener noreferrer" aria-label="Open in Spotify"><FaSpotify /></a>
            </div>
            {track.isPlaying && (
                <div className="cv-player__progress" aria-label={`${fmt(progress)} of ${fmt(track.durationMs)}`}>
                    <span>{fmt(progress)}</span>
                    <div className="cv-player__bar"><i style={{ width: `${pct}%` }} /></div>
                    <span>{fmt(track.durationMs)}</span>
                </div>
            )}
            {/* Official embed: visitors can play the track themselves (a preview, or full if logged in). */}
            <iframe
                key={track.id}
                className="cv-player__embed"
                title={`${track.name} by ${track.artist} on Spotify`}
                src={`https://open.spotify.com/embed/track/${track.id}?utm_source=generator`}
                height="152"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
            />
        </div>
    );
};

export default SpotifyPlayer;
