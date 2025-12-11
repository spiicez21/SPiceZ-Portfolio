import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const SCOPES = ['user-read-currently-playing', 'user-read-recently-played'];

// Generate random string for state
const generateRandomString = (length: number) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], '');
};

// Get auth URL
export const getAuthUrl = () => {
    const state = generateRandomString(16);
    localStorage.setItem('spotify_auth_state', state);

    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        response_type: 'token',
        redirect_uri: REDIRECT_URI,
        state: state,
        scope: SCOPES.join(' '),
        show_dialog: 'false'
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
};

// Handle callback and extract token
export const handleCallback = () => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);

    const accessToken = params.get('access_token');
    const state = params.get('state');
    const storedState = localStorage.getItem('spotify_auth_state');

    if (state === null || state !== storedState) {
        return null;
    }

    if (accessToken) {
        localStorage.setItem('spotify_access_token', accessToken);
        localStorage.setItem('spotify_token_timestamp', Date.now().toString());
        spotifyApi.setAccessToken(accessToken);

        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
        return accessToken;
    }

    return null;
};

// Check if token is valid
export const isTokenValid = () => {
    const token = localStorage.getItem('spotify_access_token');
    const timestamp = localStorage.getItem('spotify_token_timestamp');

    if (!token || !timestamp) return false;

    // Tokens expire after 1 hour
    const oneHour = 60 * 60 * 1000;
    const isExpired = Date.now() - parseInt(timestamp) > oneHour;

    return !isExpired;
};

// Get access token
export const getAccessToken = () => {
    if (isTokenValid()) {
        const token = localStorage.getItem('spotify_access_token');
        if (token) {
            spotifyApi.setAccessToken(token);
            return token;
        }
    }
    return null;
};

// Get currently playing track
export const getCurrentlyPlaying = async () => {
    try {
        const response = await spotifyApi.getMyCurrentPlayingTrack();

        if (response && response.item) {
            return {
                name: response.item.name,
                artist: response.item.artists.map(a => a.name).join(', '),
                album: response.item.album.name,
                image: response.item.album.images[0]?.url || '',
                isPlaying: response.is_playing
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching currently playing:', error);
        return null;
    }
};

// Get recently played tracks
export const getRecentlyPlayed = async () => {
    try {
        const response = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 3 });

        return response.items.map(item => {
            const track = item.track as any; // Cast to access album property
            return {
                name: track.name,
                artist: track.artists.map((a: any) => a.name).join(', '),
                album: track.album?.name || '',
                image: track.album?.images[0]?.url || ''
            };
        });
    } catch (error) {
        console.error('Error fetching recently played:', error);
        return [];
    }
};

// Logout
export const logout = () => {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_token_timestamp');
    localStorage.removeItem('spotify_auth_state');
    spotifyApi.setAccessToken('');
};
