// discordWebSocket.ts

import WebSocket from 'ws';

export async function connectToDiscord(token: string, executeCallback: (ws: WebSocket) => void): Promise<void> {
    const ws = new WebSocket("wss://gateway.discord.gg/?v=6&encoding=json");

    ws.on("open", (): void => {
        const payload = {
            op: 2,
            d: {
                token: token,
                properties: {
                    $os: "linux",
                    $browser: "chrome",
                    $device: "pc",
                },
            },
        };
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(payload));
        }
    });

    ws.on("message", (data: string) => {
        executeCallback(ws);
    });

    ws.on("error", (error: Error) => {
        console.error("WebSocket error:", error);
        ws.terminate();
    });

    ws.on("close", (code: number, reason: string) => {
        console.log(`WebSocket closed with code ${code}: ${reason}`);
        ws.removeAllListeners();
        setTimeout(() => {
            connectToDiscord(token, executeCallback);
        }, 5000);
    });
}
