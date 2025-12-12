import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

// Spotify API endpoints and credentials
// NOTE: Secrets are now handled by Netlify Function to avoid exposing them in client bundle
const TOKEN_ENDPOINT = '/.netlify/functions/spotify-token';

console.log('🎵 Spotify Config: Secrets handled by Netlify Function');

// Function to get access token from secure backend
export const getAccessToken = async () => {
    try {
        const response = await fetch(TOKEN_ENDPOINT);
        const data = await response.json();

        if (response.ok && data.access_token) {
            return data.access_token;
        } else {
            console.error('Failed to get access token:', data);
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
