import type { Context } from "@netlify/functions";

export default async (req: Request, context: Context) => {
    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        const body = await req.json();
        const { name, email, message } = body;

        const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

        if (!webhookUrl) {
            console.error("Missing DISCORD_WEBHOOK_URL");
            // Don't leak details to client
            return new Response(JSON.stringify({ error: "Server configuration error" }), { status: 500 });
        }

        // Construct Discord Payload
        const payload = {
            content: "New Contact Form Submission from **SPiceZ Portfolio**",
            embeds: [{
                title: "📬 Ticket Opened",
                color: 5763719, // #57F287 (Discord Green-ish)
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
            return new Response(JSON.stringify({ error: "Failed to send to Discord" }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });

    } catch (error) {
        console.error("Function Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
};
