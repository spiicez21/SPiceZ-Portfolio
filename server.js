import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health Check (for Railway)
app.get('/health', (req, res) => res.send('OK'));

// API: Contact Discord
app.post('/api/contact-discord', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

        if (!webhookUrl) {
            console.error("Missing DISCORD_WEBHOOK_URL");
            return res.status(500).json({ error: "Server configuration error" });
        }

        const payload = {
            content: "New Contact Form Submission from **SPiceZ Portfolio**",
            embeds: [{
                title: "📬 Ticket Opened",
                color: 5763719,
                fields: [
                    { name: "Name", value: name || "Anonymous", inline: true },
                    { name: "Email", value: email || "Not provided", inline: true },
                    { name: "Message", value: message || "*No message provided*" }
                ],
                timestamp: new Date().toISOString(),
                footer: { text: "Portfolio Contact Form" }
            }]
        };

        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.error("Discord API Error:", response.status, response.statusText);
            return res.status(500).json({ error: "Failed to send to Discord" });
        }

        res.json({ success: true });
    } catch (error) {
        console.error("Function Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// API: Spotify Token
app.get('/api/spotify-token', async (req, res) => {
    try {
        const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env;

        if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
            console.error("Missing Spotify credentials");
            return res.status(500).json({ error: "Server configuration error" });
        }

        const basic = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

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
            res.json(data);
        } else {
            console.error("Spotify API Error:", data);
            res.status(response.status).json({ error: "Failed to refresh token", details: data });
        }
    } catch (error) {
        console.error("Spotify Function Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Serve Static Files (Production)
app.use(express.static(join(__dirname, 'dist')));

// Fallback for SPA Routing
app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
