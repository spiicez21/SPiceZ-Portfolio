import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

// Spotify API endpoints
const SPOTIFY_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const NETLIFY_FUNCTION_ENDPOINT = '/.netlify/functions/spotify-token';

// Local development secrets (Vite only)
const VITE_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const VITE_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const VITE_REFRESH_TOKEN = import.meta.env.VITE_SPOTIFY_REFRESH_TOKEN;

// Check if we can run locally
const canRunLocally = import.meta.env.DEV && VITE_CLIENT_ID && VITE_CLIENT_SECRET && VITE_REFRESH_TOKEN;

console.log('🎵 Spotify Config:', {
    mode: import.meta.env.DEV ? 'Local Dev' : 'Production',
    method: canRunLocally ? 'Direct API (Local)' : 'Netlify Function (Secure)'
});

// Function to get access token
export const getAccessToken = async () => {
    // METHOD 1: Local Development (Direct API)
    if (canRunLocally) {
        try {
            const basic = btoa(`${VITE_CLIENT_ID}:${VITE_CLIENT_SECRET}`);
            const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${basic}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: VITE_REFRESH_TOKEN,
                }),
            });
            const data = await response.json();
            return data.access_token;
        } catch (error) {
            console.error('Error getting local access token:', error);
            return null;
        }
    }

    // METHOD 2: Production (Netlify Function)
    try {
        const response = await fetch(NETLIFY_FUNCTION_ENDPOINT);
        const data = await response.json();

        if (response.ok && data.access_token) {
            return data.access_token;
        } else {
            console.error('Failed to get access token from backend:', data);
            return null;
        }
    } catch (error) {
        console.error('Error fetching access token from backend:', error);
        return null;
    }
};

// Get current playing track
export const getCurrentTrack = async () => {
    try {
        const accessToken = await getAccessToken();
        if (!accessToken) return null;

        spotifyApi.setAccessToken(accessToken);
        const response = await spotifyApi.getMyCurrentPlayingTrack();

        if (response && response.item) {
            return {
                name: response.item.name,
                artist: response.item.artists.map((a: any) => a.name).join(', '),
                album: response.item.album?.name || '',
                image: response.item.album?.images[0]?.url || '',
                isPlaying: response.is_playing
            };
        }

        return null;
    } catch (error) {
        console.error('Error fetching current track:', error);
        return null;
    }
};

// Get recently played tracks
export const getRecentlyPlayed = async () => {
    try {
        const accessToken = await getAccessToken();
        if (!accessToken) return [];

        spotifyApi.setAccessToken(accessToken);
        const response = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 1 });

        if (response && response.items && response.items.length > 0) {
            const track = response.items[0].track as any;
            return [{
                name: track.name,
                artist: track.artists.map((a: any) => a.name).join(', '),
                album: track.album?.name || '',
                image: track.album?.images[0]?.url || '',
                isPlaying: false
            }];
        }

        return [];
    } catch (error) {
        console.error('Error fetching recently played:', error);
        return [];
    }
};
