import { useEffect, useState } from 'react';
import { getAccessToken } from '../services/spotify';

export interface SpotifyTrack {
    id: string;
    name: string;
    artist: string;
    album: string;
    image: string;
    url: string;
    isPlaying: boolean;
    durationMs: number;
    // Playback position when fetched; callers extrapolate from fetchedAt.
    progressMs: number;
    fetchedAt: number;
    // Only set for recently-played fallbacks.
    playedAt?: string;
}

interface SpotifyApiTrack {
    id: string;
    name: string;
    duration_ms: number;
    artists: { name: string }[];
    album: { name: string; images: { url: string }[] };
    external_urls: { spotify: string };
}

const toTrack = (item: SpotifyApiTrack, isPlaying: boolean, progressMs = 0, playedAt?: string): SpotifyTrack => ({
    id: item.id,
    name: item.name,
    artist: item.artists.map((artist) => artist.name).join(', '),
    album: item.album.name,
    image: item.album.images[0]?.url,
    url: item.external_urls.spotify,
    isPlaying,
    durationMs: item.duration_ms,
    progressMs,
    fetchedAt: Date.now(),
    playedAt,
});

const fetchRecentlyPlayed = async (token: string) => {
    const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    return data.items?.length ? toTrack(data.items[0].track, false, 0, data.items[0].played_at) : null;
};

// Polls the currently playing track, falling back to the most recent one
// when nothing is playing (Spotify answers 204 in that case).
export const useSpotifyTrack = (pollMs = 30000) => {
    const [track, setTrack] = useState<SpotifyTrack | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                const token = await getAccessToken();
                if (!token) return;

                const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                let next: SpotifyTrack | null = null;
                if (response.status === 204 || response.status > 400) {
                    next = await fetchRecentlyPlayed(token);
                } else {
                    const data = await response.json();
                    // Podcasts/ads come back without artists; show the last song instead.
                    next = data.item && data.currently_playing_type === 'track'
                        ? toTrack(data.item, data.is_playing, data.progress_ms ?? 0)
                        : await fetchRecentlyPlayed(token);
                }
                if (!cancelled && next) setTrack(next);
            } catch (error) {
                console.error('Error fetching Spotify track:', error);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        load();
        const interval = setInterval(load, pollMs);
        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, [pollMs]);

    return { track, isLoading };
};
