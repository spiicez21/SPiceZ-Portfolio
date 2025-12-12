import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

// Spotify API endpoints and credentials
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = import.meta.env.VITE_SPOTIFY_REFRESH_TOKEN;

console.log('🎵 Spotify Config:', {
    hasClientId: !!CLIENT_ID,
    hasClientSecret: !!CLIENT_SECRET,
    hasRefreshToken: !!REFRESH_TOKEN
});

// Function to generate an access token using the refresh token
export const getAccessToken = async () => {
    if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
        console.warn('Missing Spotify credentials');
        return null;
    }

    try {
        // Creates a base64 code of client_id:client_secret as required by the API
        const basic = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

        // The response will contain the access token
        const response = await fetch(TOKEN_ENDPOINT, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${basic}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: REFRESH_TOKEN,
            }),
        });

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error);
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
