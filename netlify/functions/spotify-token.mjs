export default async (req, context) => {
    // Only allow GET requests
    if (req.method !== "GET") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env; // Or Netlify.env.get if available

    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
        console.error("Missing Spotify credentials in environment variables");
        return new Response(JSON.stringify({ error: "Server configuration error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        const basic = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);

        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                Authorization: `Basic ${basic}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: SPOTIFY_REFRESH_TOKEN,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            return new Response(JSON.stringify(data), {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*" // Allow CORS for now, restrict in prod if needed
                }
            });
        } else {
            console.error("Spotify API Error:", data);
            return new Response(JSON.stringify({ error: "Failed to refresh token", details: data }), {
                status: response.status,
                headers: { "Content-Type": "application/json" }
            });
        }

    } catch (error) {
        console.error("Function Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};
