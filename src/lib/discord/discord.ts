// discordWebSocket.ts

import { translateText } from '../translate';
import { replyToRoom } from '../utils';
import { handleReconnect, heartbeat, sendPayload } from './connect';

const clientId = process.env.PAPAGO_ID_TOKEN
const clientSecret = process.env.PAPAGO_SECRET_TOKEN

const WebSocket = require('ws')

const ws = new WebSocket("wss://gateway.discord.gg/?v=6&encoding=json");

export async function createWebSocketConnection() {

    const handleWebSocketError = (error: Error) => {
        console.error("WebSocket error:", error);
        ws.terminate();
    };

    const handleWebSocketClose = (code: number, reason: string) => {
        console.log(`WebSocket closed with code ${code}: ${reason}`);
        ws.removeAllListeners();
        clearInterval(5000);
        setTimeout(handleReconnect, 5000);
    };

    ws.on("open", (): void => {
        const payload = {
            op: 2,
            d: {
                token: process.env.DISCORD_API_TOKEN,
                properties: {
                    $os: "linux",
                    $browser: "chrome",
                    $device: "pc",
                },
            },
        };
        sendPayload(ws, payload);
        console.log("WebSocket connected");
    });

    ws.on("error", handleWebSocketError);
    ws.on("close", handleWebSocketClose);

}


export async function handleMessage(client: any, address: any, title: string, room: string, serverId: string, channelId: string) {

    ws.on("message", async (data: string) => {
        let payload = JSON.parse(data);
        const { op, t, d } = payload;

        console.log(d)

        switch (op) {
            case 10:
                const { heartbeat_interval } = d;
                heartbeat(ws, heartbeat_interval);
                break;
        }

        switch (t) {
            case "MESSAGE_CREATE":
                await handleMessageCreate(client, address, d, title, room, serverId, channelId);
                break;
            case "READY":
                console.log("WebSocket connection is ready");
                break;
            default:
                break;
        }
    });

}

async function handleMessageCreate(client: any, address: string, data: any, title: string, room: string, server: string, channel: string) {
    const serverId = data.guild_id;
    const channelId = data.channel_id;

    if (
        serverId === server &&
        channelId === channel
    ) {
        const content = await translateText(clientId, clientSecret, "en", "ko", data.content);
        var output = title + "\n";
        output += "━━━━━━━━━━━━\n";
        output += content.slice(0, 250);
        output += `\u200b`.repeat(500);
        output += content.slice(250);

        await replyToRoom(client, output, room, address);
    }
}

